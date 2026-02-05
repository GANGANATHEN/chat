"use client";
import { useEffect, useReducer, useState, useMemo, useRef } from "react";
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
import GroupNamePrompt from "../components/GroupNamePrompt";

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
  // for create group prompt
  const [showPrompt, setShowPrompt] = useState(false);
  // for message
  const [text, setText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  // for all type of files
  const fileInputRef = useRef(null);
  const [selectedFiles, setSelectedFiles] = useState([]);

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
        m.sender?.id !== currentUserId && !m.readBy?.includes(currentUserId),
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

      dispatch({
        type: "MARK_CHAT_AS_READ",
        payload: {
          chatId: chat.id,
          userId: state.currentUser.id,
        },
      });
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
    setShowPrompt(true);
  }

  function handleCreateGroup(name) {
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

    setShowPrompt(false);
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

  // for send all messages
  function sendMessage({ type, content = {}, meta = {} }) {
    if (!state.activeChatId) return;

    dispatch({
      type: "SEND_MESSAGE",
      payload: {
        id: uid(),
        chatId: state.activeChatId,
        type,
        sender: {
          id: state.currentUser.id,
          name: state.currentUser.name,
        },

        content, // text / image / audio / file
        meta, // duration, size, etc

        createdAt: Date.now(),
        readBy: [{ userId: state.currentUser.id, readAt: Date.now() }],
      },
    });
  }

  // send text
  function handleSendText() {
    if (!text.trim()) return;

    sendMessage({
      type: "text",
      content: {
        text: text.trim(),
      },
    });

    setText("");
  }

  // for audio start recording
  async function startRecording() {
    try {
      console.log("Requesting mic permission...");

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert("Your browser does not support audio recording");
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      console.log("Mic access granted");

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });

        const audioUrl = URL.createObjectURL(audioBlob);

        sendMessage({
          type: "audio",
          content: { url: audioUrl },
        });
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Mic error:", err);
      alert(err.message || "Microphone permission denied");
    }
  }

  // for audio stop recording
  function stopRecording() {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  }

  // for open files
  function openFilePicker() {
    fileInputRef.current?.click();
  }

  function handleFileSelect(e) {
    const files = Array.from(e.target.files);

    setSelectedFiles((prev) => [...prev, ...files]);
    e.target.value = "";
  }

  function handleSendAll() {
    if (!text.trim() && selectedFiles.length === 0) return;

    const filesToSend = [...selectedFiles];
    const textToSend = text.trim();

    // clear UI
    setText("");
    setSelectedFiles([]);

    // send text 
    if (textToSend) {
      sendMessage({
        type: "text",
        content: {
          text: textToSend,
        },
      });
    }

    // send files
    filesToSend.forEach((file) => {
      const fileType = getFileType(file);
      const fileUrl = URL.createObjectURL(file);

      sendMessage({
        type: fileType,
        content: {
          url: fileUrl,
          name: file.name,
          size: file.size,
          mimeType: file.type,
        },
      });
    });
  }

  function getFileType(file) {
    if (file.type.startsWith("image/")) return "image";
    if (file.type.startsWith("video/")) return "video";
    if (file.type.startsWith("audio/")) return "audio";
    return "file";
  }

  const imageFiles = selectedFiles.filter((f) => f.type.startsWith("image/"));

  const otherFiles = selectedFiles.filter((f) => !f.type.startsWith("image/"));

  // for group add/remove/leave message
  function sendSystemMessage({ subtype, content, meta = {} }) {
    if (!state.activeChatId) return;

    dispatch({
      type: "SEND_MESSAGE",
      payload: {
        id: uid(),
        type: "system",
        subtype, // add | remove | leave
        sender: {
          id: state.currentUser.id,
          name: state.currentUser.name,
        },
        content, // { text: "..." }
        meta,
        createdAt: Date.now(),
      },
    });
  }

  // for logic issue in user profile
  function getSenderName(message, currentUser, userMap) {
    if (message.sender?.id === currentUser.id) {
      return "You";
    }

    console.log("Sender debug:", message.sender?.name, message.sender?.id);

    return userMap[message.sender?.id]?.name || "Unknown";
  }

  function getChatTitle(chat, currentUserId, userMap) {
    if (!chat) return "Chat";
    if (chat.type === "group") return `${chat.name} group`;
    const other = chat.members.find((m) => m.id !== currentUserId);
    return userMap[other?.id]?.name || "Chat";
  }

  // for lastseen time
  function formatLastSeen(ts) {
    if (!ts) return "";

    const now = Date.now();
    const diff = now - ts;

    const ONE_MIN = 60000;
    const ONE_HOUR = 3600000;
    const ONE_DAY = 86400000;

    if (diff < ONE_MIN) {
      return "just now";
    }

    if (diff < ONE_HOUR) {
      return `${Math.floor(diff / ONE_MIN)} min ago`;
    }

    if (diff < ONE_DAY) {
      return new Date(ts).toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    if (diff < ONE_DAY * 2) {
      return "yesterday";
    }

    return `${Math.floor(diff / ONE_DAY)} days ago`;
  }

  // for lastseen/online
  const otherUser = activeChat?.members?.find(
    (u) => u.id !== state.currentUser.id,
  );
  const otherUserDetails = userMap?.[otherUser?.id];

  const isOnline = otherUserDetails?.isOnline;
  // console.log(isOnline)

  const lastSeenText = isOnline
    ? "Online"
    : `Last seen ${formatLastSeen(otherUserDetails?.lastSeen)}`;

  // logout
  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    router.replace("/");
  };

  /* -------------------- UI -------------------- */
  return (
    <div className="h-dvh w-full flex bg-gray-900 text-white">
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
            state={state}
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
        {showPrompt && (
          <GroupNamePrompt
            onConfirm={handleCreateGroup}
            onCancel={() => setShowPrompt(false)}
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
          state={state}
          currentUser={state.currentUser}
          text={text}
          setText={setText}
          handleSendText={handleSendText}
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
          sendSystemMessage={sendSystemMessage}
          otherUserDetails={otherUserDetails}
          isOnline={isOnline}
          lastSeenText={lastSeenText}
          isRecording={isRecording}
          stopRecording={stopRecording}
          startRecording={startRecording}
          openFilePicker={openFilePicker}
          selectedFiles={selectedFiles}
          handleSendAll={handleSendAll}
          fileInputRef={fileInputRef}
          handleFileSelect={handleFileSelect}
          setSelectedFiles={setSelectedFiles}
          imageFiles={imageFiles}
          otherFiles={otherFiles}
        />
      </div>
    </div>
  );
}
