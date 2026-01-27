import { saveLocal, loadLocal } from "../utils/storage";

export function chatReducer(state, action) {
  switch (action.type) {
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
      const chats = [...state.chats, action.payload];
      saveLocal("chats", chats);
      return { ...state, chats, activeChatId: action.payload.id };
    }

    case "SEND_MESSAGE": {
      const chats = state.chats.map((c) =>
        c.id === state.activeChatId
          ? { ...c, messages: [...c.messages, action.payload] }
          : c
      );
      saveLocal("chats", chats);
      return { ...state, chats };
    }

    case "SYNC_CHATS":
      return { ...state, chats: action.payload };

    default:
      return state;
  }
}
