import { SidebarTrigger } from "@/components/ui/sidebar";
import UserProfile from "../components/UserProfile";
import GroupProfile from "../components/GroupProfile";
import { useState, useEffect, useRef } from "react";
import {
  AudioLines,
  FilePlus,
  SendHorizontal,
  Users,
  User,
  File,
  Images,
  Video,
  Music,
  Archive,
} from "lucide-react";
import ProfileModal from "./ProfilePopub";
import SystemMessage from "./SystemMessage";
import MessageInfoModal from "./MessageInfoModel";
import MessageBubble from "./MessageBubble";

export default function ChatWindow({
  chat,
  state,
  currentUser,
  text,
  setText,
  sendMessage,
  addUsers,
  removeUsers,
  profileOpen,
  profileUser,
  setProfileOpen,
  handleProfile,
  getSenderName,
  userMap,
  setSelectedUser,
  selectedUser,
  onLogout,
  sendSystemMessage,
  otherUserDetails,
  isOnline,
  lastSeenText,
  isRecording,
  stopRecording,
  startRecording,
  selectedFiles,
  handleSendAll,
  fileInputRef,
  handleFileSelect,
  setSelectedFiles,
  imageFiles,
  otherFiles,
}) {
  // ref for new messages
  const bottomRef = useRef(null);
  const [addedUser, setAddedUser] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);

  function getFileIcon(file) {
    if (file.type.startsWith("image/")) return <Images size={18} />;
    if (file.type.startsWith("video/")) return <Video size={18} />;
    if (file.type.startsWith("audio/")) return <Music size={18} />;
    if (
      file.type === "application/zip" ||
      file.name.endsWith(".zip") ||
      file.name.endsWith(".rar")
    )
      return <Archive size={18} />;
    return <File size={18} />;
  }

  // scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: chat.messages.length > 1 ? "smooth" : "auto",
    });
  }, [chat?.messages]);

  return (
    <section className="flex-1 w-full h-full flex flex-col bg-gray-900 overflow-hidden">
      <div className="flex items-center gap-x-4 px-3.5 py-3 ">
        {["group", "private"].includes(chat?.type) && (
          <div className="flex items-center gap-x-2 font-semibold truncate">
            <button
              onClick={() => {
                if (chat.type === "group") {
                  handleProfile(chat);
                } else {
                  handleProfile(otherUserDetails);
                }
              }}
              className="relative rounded-full p-2 bg-gray-600"
            >
              {chat?.type === "group" ? (
                <Users size={17} />
              ) : (
                <User size={17} />
              )}

              {/* Online dot */}
              {/* {chat.type === "private" && isOnline && (
                <span className="absolute top-0 right-0 flex items-center justify-center">
                  <span className="absolute inline-flex h-3 w-3 rounded-full bg-green-400 opacity-50 animate-ping"></span>
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500 shadow-md"></span>
                </span>
              )} */}
            </button>

            {/* Name + status */}
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold">
                {chat?.type === "group"
                  ? `${chat.name} group`
                  : otherUserDetails?.name}
              </span>

              {chat.type === "private" && (
                <span className="text-xs text-gray-400">
                  {isOnline ? "Online" : lastSeenText}
                </span>
              )}
            </div>
          </div>
        )}

        {profileOpen && profileUser && (
          <>
            {profileUser.type === "group" ? (
              <GroupProfile
                chat={profileUser}
                state={state}
                userMap={userMap}
                onClose={() => setProfileOpen(false)}
                onAddMember={(userId) => addUsers(profileUser.id, userId)}
                onRemoveMember={(userId) => removeUsers(profileUser.id, userId)}
                currentUser={currentUser}
                setSelectedUser={setSelectedUser}
                addedUser={addedUser}
                setAddedUser={setAddedUser}
                sendMessage={sendMessage}
                sendSystemMessage={sendSystemMessage}
              />
            ) : (
              <UserProfile
                user={profileUser}
                currentUser={currentUser}
                onClose={() => setProfileOpen(false)}
                onLogout={onLogout}
                onSave={(newName) =>
                  dispatch({
                    type: "UPDATE_USER_NAME",
                    payload: { id: currentUser.id, name: newName },
                  })
                }
              />
            )}
          </>
        )}
        <ProfileModal
          user={selectedUser}
          userMap={userMap}
          onClose={() => setSelectedUser(null)}
        />
      </div>

      {!chat ? (
        <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">
          Select a chat to start messaging
        </div>
      ) : (
        <>
          <div className="flex-1 min-h-0 p-4 overflow-y-auto custom-scrollbar space-y-3">
            {[...chat.messages]
              .sort((a, b) => a.createdAt - b.createdAt)
              .map((m) => {
                if (m?.type === "system")
                  return <SystemMessage key={m.id} m={m} />;

                const isMe = m.sender?.id === currentUser.id;
                let isRead = false;

                if (isMe) {
                  if (chat.type === "private") {
                    const otherId = chat.members.find(
                      (u) => u.id !== currentUser.id,
                    )?.id;
                    isRead = m.readBy?.some((r) => r.userId === otherId);
                  } else {
                    const others = chat.members.filter(
                      (u) => u.id !== currentUser.id,
                    );
                    isRead = others.every((u) => m.readBy?.includes(u.id));
                  }
                }

                return (
                  <MessageBubble
                    key={m.id}
                    m={m}
                    isMe={isMe}
                    chat={chat}
                    isRead={isRead}
                    currentUser={currentUser}
                    userMap={userMap}
                    setSelectedMessage={setSelectedMessage}
                    getSenderName={getSenderName}
                    getFileIcon={getFileIcon}
                  />
                );
              })}

            <div ref={bottomRef} />
          </div>

          <MessageInfoModal
            message={selectedMessage}
            chat={chat}
            userMap={userMap}
            onClose={() => setSelectedMessage(null)}
          />

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendAll();
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendAll();
              }
            }}
            className="px-3 py-3"
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={handleFileSelect}
            />
            {imageFiles.length > 0 && (
              <div className="mb-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {imageFiles.map((file, index) => {
                  const url = URL.createObjectURL(file);

                  return (
                    <div
                      key={index}
                      className="relative group rounded-xl overflow-hidden
          border border-gray-700"
                    >
                      <img
                        src={url}
                        alt={file.name}
                        className="h-24 w-full object-cover"
                      />

                      {/* remove button */}
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedFiles((prev) =>
                            prev.filter((f) => f !== file),
                          )
                        }
                        className="absolute top-1 right-1
            bg-black/60 text-white text-xs
            rounded-full w-6 h-6
            flex items-center justify-center
            opacity-0 group-hover:opacity-100
            transition"
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {otherFiles.length > 0 && (
              <div className="mb-2 flex flex-wrap gap-2">
                {otherFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2
        px-3 py-2 bg-gray-700/70
        text-gray-200 text-xs
        rounded-xl max-w-xs"
                  >
                    {getFileIcon(file)}

                    <span className="truncate">{file.name}</span>

                    <button
                      type="button"
                      onClick={() =>
                        setSelectedFiles((prev) =>
                          prev.filter((f) => f !== file),
                        )
                      }
                      className="text-gray-400 hover:text-white"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div
              className="mx-auto max-w-3xl flex items-end gap-2
  bg-gray-800 border border-gray-700 rounded-3xl px-3 py-2
  focus-within:border-blue-500 transition"
            >
              {/* ACTIONS */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-700"
                >
                  <FilePlus size={18} />
                </button>

                <button
                  type="button"
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`p-2 rounded-full transition ${
                    isRecording
                      ? "bg-red-500 text-white animate-pulse"
                      : "text-gray-400 hover:text-white hover:bg-gray-700"
                  }`}
                  title={isRecording ? "Stop recording" : "Voice message"}
                >
                  <AudioLines size={18} />
                </button>
              </div>

              {/* INPUT */}
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={1}
                placeholder="Message..."
                className="flex-1 resize-none bg-transparent text-sm text-gray-100 
                placeholder-gray-400 focus:outline-none px-1 max-h-40 overflow-y-auto 
                custom-scrollbar mb-2"
                onInput={(e) => {
                  e.target.style.height = "auto";
                  e.target.style.height =
                    Math.min(e.target.scrollHeight, 160) + "px";
                }}
              />

              {/* SEND */}
              <button
                type="submit"
                disabled={!text.trim() && selectedFiles.length === 0}
                className="p-2 flex items-center justify-center text-center rounded-full 
                bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700
                disabled:text-gray-500 text-white shadow-sm hover:shadow-md transition-all 
                duration-200"
                title="Send"
              >
                <SendHorizontal size={16} className="translate-x-px" />
              </button>
            </div>
          </form>
        </>
      )}
    </section>
  );
}
