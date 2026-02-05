import { X, UserPlus, Users } from "lucide-react";
import { useState } from "react";
import AddMemberDrawer from "./AddMemberDrawer";

export default function GroupProfile({
  chat,
  state,
  onClose,
  sendMessage,
  onRemoveMember,
  onAddMember,
  currentUser,
  setSelectedUser,
  userMap,
  addedUser,
  setAddedUser,
  sendSystemMessage,
}) {
  const [addOpen, setAddOpen] = useState(false);
  const [error, setError] = useState(null);
  const [uiRemovedUser, setUiRemovedUser] = useState(null);

  function handleMemberAction(m, actionType) {
    const isInGroup = state.chats
      .find((c) => c.id === state.activeChatId)
      ?.members.some((mem) => mem.id === m.id);

    if (!isInGroup) {
      setError(`${m.name} is already not in the group`);
      setTimeout(() => setError(null), 2000);
      return;
    }

    // 🔥 UI feedback FIRST
    setUiRemovedUser({
      id: m.id,
      name: m.name,
    });

    // 🔥 Global update
    onRemoveMember(m.id);

    // system message
    sendSystemMessage({
      subtype: actionType,
      content: {
        text:
          actionType === "leave"
            ? `${m.name} left the group`
            : `${m.name} was removed by ${currentUser.name}`,
      },
      meta: { userId: m.id },
    });

    // auto-hide message
    setTimeout(() => setUiRemovedUser(null), 2000);
  }

  // console.log(chat.members.some((m) => m.id === currentUser.id))

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex justify-end"
      // onClick={onClose}
    >
      {/* DRAWER */}
      <div
        className="w-105 max-w-full bg-gray-950 h-full flex flex-col shadow-2xl 
      animate-slideIn"
        // onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="relative p-6 border-b border-gray-800">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-white"
          >
            <X size={20} />
          </button>

          <div className="flex items-center gap-4">
            {/* GROUP AVATAR */}
            <div className="h-14 w-14 rounded-full bg-linear-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-xl font-bold">
              {chat.name[0].toUpperCase()}
            </div>

            <div>
              <h2 className="text-xl font-semibold">{chat.name}</h2>
              <p className="text-sm text-gray-400 flex items-center gap-1">
                <Users size={14} />
                {chat.members.length} members
              </p>
            </div>
          </div>
        </div>

        {/* MEMBERS */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <h3 className="text-xs uppercase tracking-wide text-gray-500 mb-3">
            Members
          </h3>

          <div className="space-y-2 flex-1 overflow-y-auto">
            {chat.members
              .slice()
              .sort((a, b) => {
                // current user always first
                if (a.id === currentUser.id) return -1;
                if (b.id === currentUser.id) return 1;

                // then sort by name
                return (userMap[a?.id]?.name || "").localeCompare(
                  userMap[b?.id]?.name || "",
                );
              })
              .map((m) => {
                const isAdmin = chat.admin === currentUser.id;
                const isMe = currentUser.id === m.id;

                const actionType =
                  isMe && !isAdmin
                    ? "leave"
                    : isAdmin && !isMe
                      ? "remove"
                      : null;

                return (
                  <div
                    key={m.id}
                    className="group flex items-center justify-between 
      bg-gray-900 hover:bg-gray-800 transition rounded-lg px-3 py-2"
                  >
                    {/* Avatar + Name */}
                    <div className="flex items-center gap-3">
                      <div
                        onClick={() => setSelectedUser(m)}
                        className="cursor-pointer h-9 w-9 rounded-full bg-indigo-500 flex 
          items-center justify-center text-sm font-semibold text-white"
                      >
                        {(userMap[m?.id]?.name?.[0] || "?").toUpperCase()}
                      </div>

                      <span className="text-sm text-white">
                        {userMap[m?.id]?.name || "Unknown"}
                      </span>

                      {/* ADMIN BADGE */}
                      {chat.admin === m.id && (
                        <span className="ml-2 text-xs text-lime-400 font-medium">
                          Admin
                        </span>
                      )}
                    </div>

                    {/* Action button */}
                    {actionType && (
                      <button
                        onClick={() => handleMemberAction(m, actionType)}
                        className="cursor-pointer text-red-400 opacity-0 group-hover:opacity-100 transition"
                        title={
                          actionType === "leave"
                            ? "Leave group"
                            : "Remove member"
                        }
                      >
                        {actionType === "leave" ? "Leave" : "Remove"}
                      </button>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
        {error && (
          <p className="font-medium mt-3 text-sm text-orange-500 text-center">
            {error}
          </p>
        )}

        {uiRemovedUser && (
          <p className="font-medium text-red-500 text-center text-sm mb-3">
            {uiRemovedUser.id === currentUser.id
              ? "You left the group"
              : `${uiRemovedUser.name} was removed`}
          </p>
        )}

        {/* FOOTER */}
        <div className="p-4 border-t border-gray-800 bg-gray-950">
          <button
            disabled={currentUser.id !== chat.admin}
            onClick={() => setAddOpen(true)}
            className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 
            font-medium transition ${
              currentUser.id !== chat.admin
                ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-500 text-white"
            }`}
          >
            <UserPlus size={18} />
            Add member
          </button>
        </div>
      </div>

      {/* ADD MEMBER DRAWER */}
      {addOpen && (
        <AddMemberDrawer
          chat={chat}
          state={state}
          onAdd={onAddMember}
          onClose={() => setAddOpen(false)}
          currentUser={currentUser}
          addedUser={addedUser}
          setAddedUser={setAddedUser}
          sendSystemMessage={sendSystemMessage}
          sendMessage={sendMessage}
        />
      )}
    </div>
  );
}
