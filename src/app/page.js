"use client";
import { useEffect, useReducer, useState } from "react";
import { chatReducer } from "../app/store/chatReducer";
import { uid, loadLocal, loadSession } from "../app//utils/storage";
import Login from "../app/components/Login";
import Sidebar from "../app/components/Sidebar";
import ChatWindow from "../app/components/ChatWindow";

export default function Page() {
  const initialState = {
    users: [],
    chats: [],
    currentUser: null,
    activeChatId: null,
  };

  const [state, dispatch] = useReducer(chatReducer, initialState);
  const [isMobile, setIsMobile] = useState(false);

  const [name, setName] = useState("");
  const [text, setText] = useState("");

  // Initialize state from localStorage and sessionStorage
  useEffect(() => {
    const users = loadLocal("users", []);
    const chats = loadLocal("chats", []);
    const currentUser = loadSession("currentUser");

    dispatch({
      type: "INIT_FROM_STORAGE",
      payload: { users, chats, currentUser },
    });
  }, []);

  // Sync chats across tabs
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth > 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const sync = (e) => {
      if (e.key === "chats") {
        dispatch({
          type: "SYNC_CHATS",
          payload: JSON.parse(e.newValue) || [],
        });
      }
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  function login() {
    if (!name.trim()) return;

    let users = loadLocal("users", []);
    let user = users.find((u) => u.name === name);

    if (!user) {
      user = { id: uid(), name };
      users.push(user);
      localStorage.setItem("users", JSON.stringify(users));
    }

    setName("");

    dispatch({ type: "LOGIN", payload: user });
  }

  function openPrivateChat(user) {
    console.log("Opening private chat with user:", user);

    const chat = state.chats.find(
      (c) =>
        c.type === "private" &&
        c.members.some((m) => m.id === state.currentUser.id) &&
        c.members.some((m) => m.id === user.id),
    );

    console.log("Found chat:", chat);

    if (chat) {
      dispatch({ type: "SET_ACTIVE_CHAT", payload: chat.id });
    } else {
      dispatch({
        type: "CREATE_CHAT",
        payload: {
          id: uid(),
          type: "private",
          members: [
            { id: state.currentUser.id, name: state.currentUser.name },
            { id: user.id, name: user.name },
          ],
          messages: [],
        },
      });
    }
  }

  function createGroup() {
    const name = prompt("Group name?");
    if (!name) return;

    const members = loadLocal("users", []).map((u) => u.id);

    dispatch({
      type: "CREATE_GROUP",
      payload: { id: uid(), type: "group", name, members, messages: [] },
    });
  }

  function sendMessage() {
    if (!text || !state.activeChatId) return;

    dispatch({
      type: "SEND_MESSAGE",
      payload: {
        id: uid(),
        sender: {
          id: state.currentUser.id,
          name: state.currentUser.name,
        },
        text,
        createdAt: Date.now(),
      },
    });

    setText("");
  }

  const activeChat = state.chats.find((c) => c.id === state.activeChatId);

  if (!state.currentUser)
    return <Login name={name} setName={setName} onLogin={login} />;

  return (
    <div className="flex flex-row gap-0 h-screen w-full bg-gray-900 text-white ">
      <Sidebar
        currentUser={state.currentUser}
        chats={state.chats}
        openPrivateChat={openPrivateChat}
        createGroup={createGroup}
        setActiveChat={(id) =>
          dispatch({ type: "SET_ACTIVE_CHAT", payload: id })
        }
        onLogout={() => dispatch({ type: "LOGOUT" })}
        isMobile={isMobile}
      />
      <ChatWindow
        chat={activeChat}
        currentUser={state.currentUser}
        text={text}
        state={state}
        setText={setText}
        sendMessage={sendMessage}
      />
    </div>
  );
}
