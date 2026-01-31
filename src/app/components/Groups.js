import React from "react";

const Groups = ({
  createGroup,
  chats,
  setActiveChat,
  isMobile,
  onClose,
  currentUser,
}) => {
  return (
    <div className="space-y-3 px-2 py-2.5">
      <button
        onClick={createGroup}
        className="
          w-full py-2 rounded-lg
          bg-linear-to-r from-indigo-500 to-blue-600
          text-sm font-semibold text-white
          hover:opacity-90 transition
        "
      >
        + Create Group
      </button>

      <div className="sidebar-scroll-area custom-scrollbar space-y-2 px-1 pb-15">
        {chats
          .filter((c) => {
            return (
              c.type?.toLowerCase() === "group" &&
              currentUser &&
              Array.isArray(c.members) &&
              c.members.some((m) => m.id === currentUser.id)
            );
          })
          .slice()
          .sort(
            (a, b) => a.name.localeCompare(b.name) || a.id.localeCompare(b.id),
          )
          .map((c) => (
            <div
              key={c.id}
              onClick={() => {
                setActiveChat(c.id);
                if (!isMobile && onClose) onClose();
              }}
              className="
        flex items-center gap-3 py-3 px-2 rounded-lg
        text-gray-200 hover:bg-gray-800 transition
      "
            >
              <div
                className="
        h-9 w-9 rounded-full bg-red-500
        flex items-center justify-center
        text-sm font-semibold text-white
      "
              >
                {(c.name?.[0] || "?").toUpperCase()}
              </div>

              <span className="truncate">{c.name}</span>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Groups;
