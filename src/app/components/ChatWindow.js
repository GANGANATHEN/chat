import { SidebarTrigger } from "@/components/ui/sidebar";
import UserProfile from "../components/UserProfile";
import GroupProfile from "../components/GroupProfile";
import { useState, useEffect, useRef } from "react";
import {
  Images,
  MicVocal,
  FilePlus,
  SendHorizontal,
  Users,
  User,
} from "lucide-react";
import ProfileModal from "./ProfilePopub";
import SystemMessage from "./SystemMessage";

export default function ChatWindow({
  chat,
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
  getChatTitle,
  userMap,
  setSelectedUser,
  selectedUser,
  onLogout,
  sendSystemMessage,
}) {
  // ref for new messages
  const bottomRef = useRef(null);
  const [addedUser, setAddedUser] = useState(null);
  const [removedUser, setRemovedUser] = useState(null);
  const isCurrentUserRemoved = removedUser?.id === currentUser?.id;
  console.log(removedUser);

  const otherUser = chat?.members?.find((u) => u.id !== currentUser.id);

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
          <div className="flex items-center gap-x-2 font-semibold text-lg truncate">
            <button
              onClick={() => {
                if (chat.type === "group") {
                  // open group profile
                  handleProfile(chat);
                } else {
                  // private chat for other user
                  const otherUser = chat.members.find(
                    (m) => m.id !== currentUser.id,
                  );
                  handleProfile(otherUser);
                }
              }}
              className="rounded-full p-2 bg-gray-600 cursor-pointer"
            >
              {chat?.type === "group" ? (
                <Users size={17} />
              ) : (
                <User size={17} />
              )}
            </button>

            {chat?.type === "group"
              ? `${chat.name} group`
              : getChatTitle(chat, currentUser.id, userMap)}
          </div>
        )}

        {profileOpen && profileUser && (
          <>
            {profileUser.type === "group" ? (
              <GroupProfile
                chat={profileUser}
                userMap={userMap}
                onClose={() => setProfileOpen(false)}
                onAddMember={(userId) => addUsers(profileUser.id, userId)}
                onRemoveMember={(userId) => removeUsers(profileUser.id, userId)}
                currentUser={currentUser}
                setSelectedUser={setSelectedUser}
                isCurrentUserRemoved={isCurrentUserRemoved}
                setRemovedUser={setRemovedUser}
                addedUser={addedUser}
                setAddedUser={setAddedUser}
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
              const isMe = m.sender?.id === currentUser.id;

              // TEXT MESSAGE
              if (m.type === "text") {
                return (
                  <div
                    key={m.id}
                    className={`w-fit px-3 py-2 rounded-lg text-sm ${
                      isMe
                        ? "ml-auto bg-blue-600 text-white"
                        : "bg-gray-700 text-gray-100"
                    }`}
                  >
                    <div className="flex gap-x-4 justify-between items-center mb-1">
                      <span className="text-xs font-semibold text-gray-300">
                        {isMe ? "You" : getSenderName(m, currentUser, userMap)}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {new Date(m.createdAt).toLocaleTimeString()}
                      </span>
                    </div>

                    {m.text}
                  </div>
                );
              }

              // SYSTEM MESSAGE (add / remove / leave)
              if (["add", "remove", "leave"].includes(m.type)) {
                const colorMap = {
                  add: "text-lime-400",
                  remove: "text-red-400",
                  leave: "text-yellow-400",
                };

                return (
                  <div
                    key={m.id}
                    className={`text-xs text-center my-2 ${colorMap[m.type]}`}
                  >
                    {m.text}
                    <span className="ml-2 text-[10px] text-gray-400">
                      {new Date(m.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                );
              }

              return null;
            })}

            <div ref={bottomRef} />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
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
                  <MicVocal size={18} />
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
