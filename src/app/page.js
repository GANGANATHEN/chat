"use client";
import { useEffect, useReducer, useState } from "react";
import { chatReducer } from "../app/store/chatReducer";
import { uid, loadLocal, loadSession } from "../app//utils/storage";
import Login from "../app/components/Login";
import Sidebar from "../app/components/Sidebar";
import ChatWindow from "../app/components/ChatWindow";

export default function Page() {
  const [state, dispatch] = useReducer(chatReducer, {
    users: loadLocal("users", []),
    chats: loadLocal("chats", []),
    currentUser: loadSession("currentUser"),
    activeChatId: null,
  });

  const [name, setName] = useState("");
  const [text, setText] = useState("");

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

    dispatch({ type: "LOGIN", payload: user });
  }

  function openPrivateChat(user) {
    const chat = state.chats.find(
      (c) =>
        c.type === "private" &&
        c.members.includes(state.currentUser.id) &&
        c.members.includes(user.id),
    );

    if (chat) dispatch({ type: "SET_ACTIVE_CHAT", payload: chat.id });
    else
      dispatch({
        type: "CREATE_CHAT",
        payload: {
          id: uid(),
          type: "private",
          name: user.name,
          members: [state.currentUser.id, user.id],
          messages: [],
        },
      });
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
        senderId: state.currentUser.id,
        text,
        createdAt: Date.now(),
      },
    });

    setText("");
  }

  const activeChat = state.chats.find(
    (c) =>
      c.id === state.activeChatId && c.members.includes(state.currentUser?.id),
  );

  if (!state.currentUser)
    return <Login name={name} setName={setName} onLogin={login} />;

  return (
    <main className="h-screen flex bg-gray-900 text-white">
      <Sidebar
        currentUser={state.currentUser}
        chats={state.chats}
        openPrivateChat={openPrivateChat}
        createGroup={createGroup}
        setActiveChat={(id) =>
          dispatch({ type: "SET_ACTIVE_CHAT", payload: id })
        }
        onLogout={() => dispatch({ type: "LOGOUT" })}
      />

      <ChatWindow
        chat={activeChat}
        currentUser={state.currentUser}
        text={text}
        setText={setText}
        sendMessage={sendMessage}
      />
    </main>
  );
}
