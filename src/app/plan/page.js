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
  const [activeSection, setActiveSection] = useState("chats");
  const [text, setText] = useState("");

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

  /* -------------------- ACTIONS -------------------- */
  function openChat(chatId) {
    dispatch({ type: "SET_ACTIVE_CHAT", payload: chatId });
    dispatch({
      type: "MARK_CHAT_AS_READ",
      payload: { chatId, userId: state.currentUser.id },
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

  /* -------------------- UI -------------------- */
  return (
    <div className="h-screen w-full flex bg-gray-900 text-white">
      {/* LEFT ICON SIDEBAR */}
      <SidebarIcon />

      {/* DETAILS PANEL */}
      <div className="w-[25%] border-r border-gray-700 p-3 overflow-y-auto">
        {activeSection === "chats" && (
          <Section title="All Chats">
            {sidebarItems
              .sort((a, b) => b.lastMessageAt - a.lastMessageAt)
              .map((item) => (
                <Item
                  key={item.chatId}
                  label={item.title}
                  unread={item.unreadCount}
                  onClick={() => openChat(item.chatId)}
                />
              ))}
          </Section>
        )}

        {activeSection === "users" && (
          <Section title="Users">
            {state.users
              .filter((u) => u.id !== state.currentUser.id)
              .map((u) => (
                <Item
                  key={u.id}
                  label={u.name}
                  onClick={() => openPrivateChat(u)}
                />
              ))}
          </Section>
        )}

        {activeSection === "groups" && (
          <Section title="Groups">
            {state.chats
              .filter(
                (c) =>
                  c.type === "group" &&
                  c.members.some((m) => m.id === state.currentUser.id),
              )
              .map((g) => (
                <Item
                  key={g.id}
                  label={g.name}
                  onClick={() => openChat(g.id)}
                />
              ))}
          </Section>
        )}
      </div>

      {/* CHAT AREA (OLD COMPONENT 그대로) */}
      <div className="w-[60%]">
        <ChatWindow
          chat={activeChat}
          currentUser={state.currentUser}
          text={text}
          setText={setText}
          sendMessage={sendMessage}
          userMap={userMap}
        />
      </div>
    </div>
  );
}
