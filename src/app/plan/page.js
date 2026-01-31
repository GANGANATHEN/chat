"use client";
import { useEffect, useReducer, useState, useMemo } from "react";
import { chatReducer } from "../../app/store/chatReducer";
import { uid, loadLocal, loadSession } from "../../app/utils/storage";
import ChatWindow from "../../app/components/ChatWindow";
import SidebarIcon from "../components/SidebarIcon";
import Section from "../components/Section";
import Item from "../components/Item";
import { useRouter } from "next/navigation";
// data
import { sidebarSections } from "../data/data";
import Profile from "../components/Profile";
import AllChats from "../components/AllChats";
import Users from "../components/Users";
import Groups from "../components/Groups";

export default function Page() {
  const router = useRouter();

  /* -------------------- REDUCER -------------------- */
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
  // for message
  const [text, setText] = useState("");
  console.log(isSectionOpen);

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

  /* -------------------- Mobile responsive -------------------- */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth > 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

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

  const sidebarItems = useMemo(() => {
    if (!state.currentUser) return [];

    return state.chats.map((chat) => {
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

  function openPrivateChat(user) {
    const chat = state.chats.find(
      (c) =>
        c.type === "private" &&
        c.members.some((m) => m.id === state.currentUser.id) &&
        c.members.some((m) => m.id === user.id),
    );

    if (chat) {
      openChat(chat.id);
    } else {
      dispatch({
        type: "CREATE_CHAT",
        payload: {
          id: uid(),
          type: "private",
          members: [state.currentUser, { id: user.id, name: user.name }],
          messages: [],
        },
      });
    }
  }

  function sendMessage() {
    if (!text || !state.activeChatId) return;

    dispatch({
      type: "SEND_MESSAGE",
      payload: {
        id: uid(),
        sender: state.currentUser,
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
        {activeSection === "chats" && (
          <AllChats
            sidebarItems={sidebarItems}
            openChat={openChat}
            isMobile={isMobile}
            onClose={() => {
              setIsSectionOpen(false);
              setActiveSection(null);
            }}
          />
        )}
        {activeSection === "users" && <Users />}
        {activeSection === "groups" && <Groups />}
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
          userMap={userMap}
          onLogout={handleLogout}
          getSenderName={getSenderName}
        />
      </div>
    </div>
  );
}
