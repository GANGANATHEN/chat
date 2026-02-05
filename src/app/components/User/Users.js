import React, { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { loadLocal } from "../../utils/storage";

const Users = ({ currentUser, openPrivateChat, onClose, isMobile }) => {
  const users = loadLocal("users", []);
  const [query, setQuery] = useState("");

  const filteredUsers = useMemo(() => {
    return users
      .filter(
        (u) =>
          u.id !== currentUser.id &&
          u.name.toLowerCase().includes(query.toLowerCase()),
      )
      .map((u) => ({
        id: u.id,
        name: u.name,
        isOnline: u.isOnline,
        lastSeen: u.lastSeen,
      }));
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
            .map((u) => {
              {/* console.log(u.lastSeen); */}
              return (
                <div key={u.id} className="py-1">
                  <div
                    onClick={() => {
                      openPrivateChat(u);
                      if (!isMobile && onClose) onClose();
                    }}
                    className="relative flex items-center gap-3 py-1.5 px-2 rounded-lg
               text-gray-200 hover:bg-gray-800 transition-colors group cursor-pointer"
                  >
                    {/* Avatar */}
                    <div className="relative h-9 w-9 shrink-0">
                      <div
                        className={`h-9 w-9 rounded-full bg-indigo-500 flex items-center justify-center
                    text-sm font-semibold text-white`}
                      >
                        {u.name[0].toUpperCase()}
                      </div>

                      {/* Online indicator */}
                      {u.isOnline && (
                        <span className="absolute bottom-0 right-0 flex items-center justify-center">
                          {/* Halo / Pulse */}
                          <span className="absolute inline-flex h-3 w-3 rounded-full bg-green-400 opacity-50 animate-ping"></span>
                          {/* Solid dot */}
                          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500 shadow-md"></span>
                        </span>
                      )}
                    </div>

                    {/* Name + Last Seen */}
                    <div className="flex flex-col">
                      <span className="truncate">{u.name}</span>

                      {/* Last seen text - inline on mobile, tooltip on desktop */}
                      {!u.isOnline && u.lastSeen && (
                        <>
                          {/* Desktop: hover tooltip */}
                          <div
                            className="hidden md:block absolute -top-7 left-1/2 transform -translate-x-1/2
                        bg-gray-800 text-white text-[10px] px-2 py-0.5 rounded-full
                        shadow-lg opacity-0 group-hover:opacity-100 transition-opacity
                        whitespace-nowrap z-50 pointer-events-none"
                          >
                            Last seen{" "}
                            {new Date(u.lastSeen).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>

                          {/* Mobile: inline text */}
                          <span className="block md:hidden text-[10px] text-gray-400">
                            Last seen{" "}
                            {new Date(u.lastSeen).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
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
