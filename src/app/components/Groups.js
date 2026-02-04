import React, { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { loadLocal } from "../utils/storage";

const Groups = ({
  createGroup,
  chats,
  setActiveChat,
  isMobile,
  onClose,
  currentUser,
}) => {
  const [query, setQuery] = useState("");
  const getFilteredGroupChats = (chats, currentUser, query) => {
    if (!Array.isArray(chats) || !currentUser) return [];

    return chats
      .filter((chat) => {
        // only group chats
        if (chat.type?.toLowerCase() !== "group") return false;

        // current user must be a member
        if (
          !Array.isArray(chat.members) ||
          !chat.members.some((m) => m.id === currentUser.id)
        ) {
          return false;
        }

        // search by group name
        if (query) {
          return chat.name?.toLowerCase().includes(query.toLowerCase());
        }

        return true;
      })
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name) || a.id.localeCompare(b.id));
  };

  const filteredGroups = useMemo(
    () => getFilteredGroupChats(chats, currentUser, query),
    [chats, currentUser, query],
  );

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

      {/* SEARCH */}
      <div className="relative mb-3">
        <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search Group..."
          className="w-full bg-gray-800 pl-9 pr-3 py-2 rounded text-sm outline-none"
        />
      </div>

      <div className="sidebar-scroll-area custom-scrollbar space-y-2 px-1 pb-15">
        {filteredGroups.map((c) => (
          <div
            key={c.id}
            onClick={() => {
              setActiveChat(c.id);
              if (!isMobile && onClose) onClose();
            }}
            className="flex items-center gap-3 py-1.5 px-2 rounded-lg text-gray-200 
            hover:bg-gray-800 transition"
          >
            <div
              className="h-9 w-9 rounded-full bg-red-500 flex items-center justify-center 
              text-sm font-semibold text-white"
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
