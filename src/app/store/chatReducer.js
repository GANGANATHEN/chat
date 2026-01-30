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
      return {
        ...state,
        chats: state.chats.map((chat) => {
          if (chat.id !== action.payload.chatId) return chat;

          return {
            ...chat,
            members: chat.members.filter((m) => m.id !== action.payload.userId),
          };
        }),
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

        // keep only last 30 messages
        const limitedMessages =
          updatedMessages.length > MAX_MESSAGES
            ? updatedMessages.slice(-MAX_MESSAGES)
            : updatedMessages;

        return {
          ...c,
          messages: limitedMessages,
        };
      });

      saveLocal("chats", chats);
      return { ...state, chats };
    }

    case "SYNC_CHATS":
      return { ...state, chats: action.payload };

    default:
      return state;
  }
}
