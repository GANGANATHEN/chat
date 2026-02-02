import React, { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { loadLocal } from "../utils/storage";

const Users = ({ currentUser, openPrivateChat, chat, onClose, isMobile }) => {
  const users = loadLocal("users", []);
  const [query, setQuery] = useState("");

  const filteredUsers = useMemo(() => {
    return users
      .filter(
        (u) =>
          u.id !== currentUser.id &&
          u.name.toLowerCase().includes(query.toLowerCase()),
      )
      .map((u) => ({ id: u.id, name: u.name }));
  }, [query, users, currentUser.id]);

  return (
    <div className={`sidebar-scroll-area custom-scrollbar pb-15 space-y-2`}>
      {/* SEARCH */}
      <div className="relative mb-3">
        <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search users..."
          className="w-full bg-gray-800 pl-9 pr-3 py-2 rounded text-sm outline-none"
        />
      </div>

      <div className="px-3">
        {filteredUsers.length > 0 ? (
          filteredUsers
            .slice()
            .sort((a, b) => {
              // sort alphabetically by name
              const nameCompare = a.name.localeCompare(b.name);
              if (nameCompare !== 0) return nameCompare;

              // if names are same, sort by id
              return a.id.localeCompare(b.id);
            })
            .map((u) => (
              <div key={u.id} className={`py-1`}>
                <div
                  onClick={() => {
                    openPrivateChat(u);
                    if (!isMobile && onClose) onClose();
                  }}
                  className="
                      flex items-center gap-3 py-1.5 px-2 rounded-lg
                      text-gray-200
                      hover:bg-gray-800
                      hover:text-white/40
                      transition-colors
                    "
                >
                  <div
                    className="
                      h-9 w-9 rounded-full
                      bg-indigo-500
                      flex items-center justify-center
                      text-sm font-semibold text-white
                    "
                  >
                    {u.name[0].toUpperCase()}
                  </div>

                  <span className="truncate">{u.name}</span>
                </div>
              </div>
            ))
        ) : (
          <div className="px-3 py-2 text-sm text-gray-500">
            No other users available
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;
