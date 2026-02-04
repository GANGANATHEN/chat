import { saveLocal, loadLocal } from "../utils/storage";

export function chatReducer(state, action) {
  switch (action.type) {
    case "INIT_FROM_STORAGE":
      return {
        ...state,
        users: action.payload.users,
        chats: action.payload.chats,
        currentUser: action.payload.currentUser,
      };

    case "LOGIN": {
      sessionStorage.setItem("currentUser", JSON.stringify(action.payload));
      return { ...state, currentUser: action.payload };
    }

    case "LOGOUT":
      sessionStorage.removeItem("currentUser");
      return { ...state, currentUser: null, activeChatId: null };

    case "SET_ACTIVE_CHAT":
      return { ...state, activeChatId: action.payload };

    case "CREATE_CHAT": {
      const chats = [...state.chats, action.payload];
      saveLocal("chats", chats);
      return { ...state, chats, activeChatId: action.payload.id };
    }

    case "CREATE_GROUP": {
      const updatedChats = [...state.chats, action.payload];

      saveLocal("chats", updatedChats);

      return {
        ...state,
        chats: updatedChats,
        activeChatId: action.payload.id,
      };
    }

    case "ADD_GROUP_MEMBER": {
      const { chatId, user } = action.payload;

      if (!user || typeof user !== "object") return state;

      return {
        ...state,
        chats: state.chats.map((chat) => {
          if (chat.id !== chatId) return chat;

          const alreadyExists = chat.members.some((m) => m.id === user.id);

          if (alreadyExists) return chat;

          return {
            ...chat,
            members: [...chat.members, user],
          };
        }),
      };
    }

    case "REMOVE_GROUP_MEMBER": {
      const { chatId, userId } = action.payload;

      return {
        ...state,
        chats: state.chats.map((chat) =>
          chat.id === chatId
            ? {
                ...chat,
                members: chat.members.filter((m) => m.id !== userId),
              }
            : chat,
        ),
      };
    }

    case "INIT_FROM_STORAGE": {
      const { users, chats, currentUser } = action.payload;

      const normalizedChats = chats.map((chat) => {
        if (chat.type !== "group") return chat;

        return {
          ...chat,
          members: chat.members.map((m) => {
            // If already object, return as-is
            if (typeof m === "object") return m;

            // If string ID, convert to object
            const user = users.find((u) => u.id === m);
            return {
              id: m,
              name: user?.name || "Unknown",
            };
          }),
        };
      });

      return {
        ...state,
        users,
        chats: normalizedChats,
        currentUser,
      };
    }

    case "SEND_MESSAGE": {
      const chats = state.chats.map((c) => {
        if (c.id !== state.activeChatId) return c;

        const MAX_MESSAGES = 30;

        // add new message
        const updatedMessages = [...c.messages, action.payload];

        // separate system & normal messages
        const systemMessages = updatedMessages.filter(
          (m) => m.type === "system",
        );

        const normalMessages = updatedMessages.filter(
          (m) => m.type !== "system",
        );

        // keep only last 30 normal messages
        const limitedNormalMessages =
          normalMessages.length > MAX_MESSAGES
            ? normalMessages.slice(-MAX_MESSAGES)
            : normalMessages;

        return {
          ...c,
          messages: [...systemMessages, ...limitedNormalMessages],
        };
      });

      saveLocal("chats", chats);
      return { ...state, chats };
    }

    case "MARK_CHAT_AS_READ": {
      const { chatId, userId } = action.payload;

      return {
        ...state,
        chats: state.chats.map((chat) => {
          if (chat.id !== chatId) return chat;

          return {
            ...chat,
            messages: chat.messages.map((m) => {
              // already read → no change
              if (m.readBy?.includes(userId)) return m;

              return {
                ...m,
                readBy: [...(m.readBy || []), userId],
              };
            }),
          };
        }),
      };
    }

    case "SYNC_CHATS":
      return { ...state, chats: action.payload };

    default:
      return state;
  }
}
