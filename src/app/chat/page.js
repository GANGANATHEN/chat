"use client";
import { useEffect, useReducer, useState } from "react";
import { chatReducer } from "../../app/store/chatReducer";
import { uid, loadLocal, loadSession } from "../../app//utils/storage";
import Sidebar from "../../app/components/Sidebar";
import ChatWindow from "../../app/components/ChatWindow";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const initialState = {
    users: [],
    chats: [],
    currentUser: null,
    activeChatId: null,
  };

  const [state, dispatch] = useReducer(chatReducer, initialState);
  const [isMobile, setIsMobile] = useState(false);

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

  // for login route
  useEffect(() => {
    const currentUser = loadSession("currentUser");
    if (!currentUser) {
      router.replace("/");
      return;
    }

    const users = loadLocal("users", []);
    const chats = loadLocal("chats", []);

    dispatch({
      type: "INIT_FROM_STORAGE",
      payload: { users, chats, currentUser },
    });
  }, [router]);

  // state management for remove group members
  useEffect(() => {
    if (state.chats.length > 0) {
      localStorage.setItem("chats", JSON.stringify(state.chats));
    }
  }, [state.chats]);

  //   function login() {
  //     if (!name.trim()) return;

  //     let users = loadLocal("users", []);
  //     let user = users.find((u) => u.name === name);

  //     if (!user) {
  //       user = { id: uid(), name };
  //       users.push(user);
  //       localStorage.setItem("users", JSON.stringify(users));
  //       router.push("/chat");
  //     }

  //     setName("");

  //     dispatch({ type: "LOGIN", payload: user });
  //   }

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

    const members = loadLocal("users", []).map((u) => ({
      id: u.id,
      name: u.name,
    }));

    dispatch({
      type: "CREATE_GROUP",
      payload: {
        id: uid(),
        type: "group",
        name,
        members,
        messages: [],
      },
    });
  }

  function addGroupUsers(chatId, user) {
    if (!user || !user.id || !user.name) {
      console.error("Invalid user object passed:", user);
      return;
    }

    dispatch({
      type: "ADD_GROUP_MEMBER",
      payload: { chatId, user },
    });

    console.log("user added", chatId, user);
  }

  function removeGroupUsers(chatId, userId) {
    dispatch({
      type: "REMOVE_GROUP_MEMBER",
      payload: { chatId, userId },
    });
    console.log("user removed", chatId, userId);
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

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    router.replace("/");
  };

  const [profileOpen, setProfileOpen] = useState(false);
  const [profileUser, setProfileUser] = useState(null);

  const handleProfile = (user) => {
    setProfileUser(user);
    setProfileOpen(true);
  };

  const activeChat = state.chats.find((c) => c.id === state.activeChatId);

  if (!state.currentUser) return null;

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
        onLogout={handleLogout}
        isMobile={isMobile}
        openProfile={handleProfile}
      />
      <ChatWindow
        chat={activeChat}
        currentUser={state.currentUser}
        text={text}
        addUsers={addGroupUsers}
        removeUsers={removeGroupUsers}
        setText={setText}
        sendMessage={sendMessage}
        profileOpen={profileOpen}
        profileUser={profileUser}
        setProfileOpen={setProfileOpen}
        handleProfile={handleProfile}
      />
    </div>
  );
}
