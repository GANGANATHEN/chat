"use client";
import { useEffect, useReducer, useState, useMemo } from "react";
import { chatReducer } from "../store/chatReducer";
import { uid, loadLocal, loadSession } from "../utils/storage";
import ChatWindow from "../components/ChatWindow";
import SidebarIcon from "../components/SidebarIcon";
import Section from "../components/Section";
import { useRouter } from "next/navigation";
// data
import Profile from "../components/Profile";
import AllChats from "../components/AllChats";
import Users from "../components/Users";
import Groups from "../components/Groups";

export default function Page() {
  const router = useRouter();

  // for useReduser
  const initialState = {
    users: [],
    chats: [],
    currentUser: null,
    activeChatId: null,
  };

  const [state, dispatch] = useReducer(chatReducer, initialState);

  /* -------------------- UI STATE -------------------- */
  const [isMobile, setIsMobile] = useState(false);
  // for chat page open
  const [activeSection, setActiveSection] = useState(null);
  const [isSectionOpen, setIsSectionOpen] = useState(false);
  // for user and group profile open
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileUser, setProfileUser] = useState(null);
  // for group user profile open
  const [selectedUser, setSelectedUser] = useState(null);
  // for message
  const [text, setText] = useState("");
  // console.log(selectedUser);

  /* -------------------- INIT -------------------- */
  useEffect(() => {
    const users = loadLocal("users", []);
    const chats = loadLocal("chats", []);
    const currentUser = loadSession("currentUser");

    if (!currentUser) {
      router.replace("/");
      return;
    }

    dispatch({
      type: "INIT_FROM_STORAGE",
      payload: { users, chats, currentUser },
    });
  }, [router]);

  // Sync chats across tabs
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth >= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
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

  /* -------------------- HELPERS -------------------- */
  const userMap = useMemo(() => {
    const map = {};
    state.users.forEach((u) => (map[u.id] = u));
    return map;
  }, [state.users]);

  const activeChat = state.chats.find((c) => c.id === state.activeChatId);

  /* -------------------- CHAT META -------------------- */
  function getChatMeta(chat, currentUserId) {
    if (!chat.messages.length) return { lastMessageAt: 0, unreadCount: 0 };

    const last = chat.messages.at(-1);
    const unreadCount = chat.messages.filter(
      (m) =>
        m.sender.id !== currentUserId && !m.readBy?.includes(currentUserId),
    ).length;

    return { lastMessageAt: last.createdAt, unreadCount };
  }

  // for allchats -> new chat
  const sidebarItems = useMemo(() => {
    if (!state.currentUser) return [];

    return state.chats
      .filter((chat) => chat.members.some((m) => m.id === state.currentUser.id))
      .map((chat) => {
        const meta = getChatMeta(chat, state.currentUser.id);

        if (chat.type === "group") {
          return {
            chatId: chat.id,
            title: chat.name,
            ...meta,
          };
        }

        const other = chat.members.find((m) => m.id !== state.currentUser.id);

        return {
          chatId: chat.id,
          title: userMap[other?.id]?.name || "Unknown",
          ...meta,
        };
      });
  }, [state.chats, state.currentUser, userMap]);

  // handle open user and group profile
  const handleProfile = (user) => {
    setProfileUser(user);
    setProfileOpen(true);
  };

  // for open chat
  function openChat(chatId) {
    dispatch({ type: "SET_ACTIVE_CHAT", payload: chatId });

    dispatch({
      type: "MARK_CHAT_AS_READ",
      payload: {
        chatId,
        userId: state.currentUser.id,
      },
    });
  }

  // open and creata a 1v1 chat
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
  // console.log(state.currentUser);

  // open and create a group chat
  function createGroup() {
    const name = prompt("Group name?");
    if (!name) return;

    const members = [
      { id: state.currentUser.id, name: state.currentUser.name },
    ];
    // loadLocal("users", []).map((u) => ({
    //   id: u.id,
    //   name: u.name,
    // }));
    console.log(members);

    dispatch({
      type: "CREATE_GROUP",
      payload: {
        id: uid(),
        type: "group",
        admin: state.currentUser.id,
        name,
        members,
        messages: [],
      },
    });
  }

  // for add a user in group
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

  // for remove user in group
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
        readBy: [state.currentUser.id],
      },
    });

    setText("");
  }

  // for logic issue in user profile
  function getSenderName(message, currentUser, userMap) {
    if (message.sender.id === currentUser.id) {
      return "You";
    }

    console.log("Sender debug:", message.sender.name, message.sender.id);

    return userMap[message.sender.id]?.name || "Unknown";
  }

  function getChatTitle(chat, currentUserId, userMap) {
    if (!chat) return "Chat";
    if (chat.type === "group") return `${chat.name} group`;
    const other = chat.members.find((m) => m.id !== currentUserId);
    return userMap[other?.id]?.name || "Chat";
  }

  // logout
  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    router.replace("/");
  };

  /* -------------------- UI -------------------- */
  return (
    <div className="h-screen w-full flex bg-gray-900 text-white">
      {/* LEFT ICON SIDEBAR */}
      <div className="min-w-12">
        <SidebarIcon
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          isMobile={isMobile}
          onOpen={() => setIsSectionOpen(true)}
          onLogout={handleLogout}
        />
      </div>

      {/* DETAILS PANEL */}
      <Section
        activeSection={activeSection}
        isOpen={isSectionOpen}
        isMobile={isMobile}
        onClose={() => {
          setIsSectionOpen(false);
          setActiveSection(null);
        }}
      >
        {/* All chats */}
        {activeSection === "chats" && (
          <AllChats
            sidebarItems={sidebarItems}
            currentUser={state.currentUser}
            openChat={openChat}
            isMobile={isMobile}
            onClose={() => {
              setIsSectionOpen(false);
              setActiveSection(null);
            }}
          />
        )}
        {/* Only Users */}
        {activeSection === "users" && (
          <Users
            chat={activeChat}
            currentUser={state.currentUser}
            openChat={openChat}
            openPrivateChat={openPrivateChat}
            isMobile={isMobile}
            onClose={() => {
              setIsSectionOpen(false);
              setActiveSection(null);
            }}
          />
        )}
        {/* Only Groups */}
        {activeSection === "groups" && (
          <Groups
            chats={state.chats}
            chat={activeChat}
            currentUser={state.currentUser}
            createGroup={createGroup}
            setActiveChat={(id) =>
              dispatch({ type: "SET_ACTIVE_CHAT", payload: id })
            }
            isMobile={isMobile}
            onClose={() => {
              setIsSectionOpen(false);
              setActiveSection(null);
            }}
          />
        )}
      </Section>

      {/* CHAT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        <Profile
          currentUser={state.currentUser}
          openProfile={handleProfile}
          onLogout={handleLogout}
        />
        <ChatWindow
          chat={activeChat}
          currentUser={state.currentUser}
          text={text}
          setText={setText}
          sendMessage={sendMessage}
          profileOpen={profileOpen}
          profileUser={profileUser}
          setProfileOpen={setProfileOpen}
          handleProfile={handleProfile}
          userMap={userMap}
          addUsers={addGroupUsers}
          removeUsers={removeGroupUsers}
          onLogout={handleLogout}
          getSenderName={getSenderName}
          getChatTitle={getChatTitle}
          setSelectedUser={setSelectedUser}
          selectedUser={selectedUser}
        />
      </div>
    </div>
  );
}
