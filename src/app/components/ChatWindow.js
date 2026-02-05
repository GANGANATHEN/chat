import { SidebarTrigger } from "@/components/ui/sidebar";
import UserProfile from "../components/UserProfile";
import GroupProfile from "../components/GroupProfile";
import { useState, useEffect, useRef } from "react";
import {
  Images,
  AudioLines,
  FilePlus,
  SendHorizontal,
  Users,
  User,
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
  handleSendText,
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
}) {
  // ref for new messages
  const bottomRef = useRef(null);
  const [addedUser, setAddedUser] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);

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
            {chat.messages.map((m) => {
              if ((m.type = "system")) {
                return <SystemMessage key={m.id} m={m} />;
              }

              const isMe = m.sender?.id === currentUser.id;
              let isRead = false;

              if (isMe) {
                if (chat.type === "private") {
                  const otherId = chat.members.find(
                    (u) => u.id !== currentUser.id,
                  )?.id;
                  isRead = m.readBy?.includes(otherId);
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
              handleSendText();
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendText();
              }
            }}
            className="px-3 py-3"
          >
            <div
              className="mx-auto max-w-3xl flex justify-center items-center gap-2
            bg-gray-800 border border-gray-700 rounded-3xl px-3 py-2 
            focus-within:border-blue-500 transition"
            >
              {/* ACTIONS */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-700 transition"
                  title="Attach file"
                >
                  <FilePlus size={18} />
                </button>

                <button
                  type="button"
                  className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-700 transition"
                  title="Upload image"
                >
                  <Images size={18} />
                </button>

                <button
                  type="button"
                  className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-700 transition"
                  title="Voice message"
                >
                  <AudioLines size={18} />
                </button>
              </div>

              {/* INPUT */}
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={1}
                placeholder="Message....."
                className="flex-1 resize-none bg-transparent text-sm text-gray-100 placeholder-gray-400 focus:outline-none max-h-40 px-1"
                onInput={(e) => {
                  e.target.style.height = "auto";
                  e.target.style.height = e.target.scrollHeight + "px";
                }}
              />

              {/* SEND */}
              <button
                type="submit"
                disabled={!text.trim()}
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
