import React, { useState, useMemo } from "react";
import { Search } from "lucide-react";

const AllChats = ({
  sidebarItems,
  currentUser,
  openChat,
  isMobile,
  onClose,
}) => {
  // const users = loadLocal("users", []);
  const [query, setQuery] = useState("");

  const sortedSidebarItems = useMemo(() => {
    return sidebarItems
      .filter((item) => {
        if (query && !item.title.toLowerCase().includes(query.toLowerCase()))
          return false;
        if (item.isMuted) return false;
        return true;
      })
      .slice()
      .sort((a, b) => {
        if (a.lastMessageAt && b.lastMessageAt) {
          return b.lastMessageAt - a.lastMessageAt;
        }
        if (a.lastMessageAt && !b.lastMessageAt) return -1;
        if (!a.lastMessageAt && b.lastMessageAt) return 1;
        return a.title.localeCompare(b.title);
      });
  }, [sidebarItems, query]);

  return (
    <div className={`custom-scrollbar sidebar-scroll-area pb-15`}>
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
        {sortedSidebarItems.length > 0 ? (
          sortedSidebarItems.map((item) => (
            <div key={item.chatId} className="py-1">
              <div
                onClick={() => {
                  openChat(item.chatId);
                  if (!isMobile && onClose) onClose();
                }}
                className="flex items-center gap-3 py-1.5 px-2 rounded-lg
                     text-gray-200 hover:bg-gray-800 transition"
              >
                <div
                  className="h-9 w-9 rounded-full bg-indigo-500
                          flex items-center justify-center
                          text-sm font-semibold text-white"
                >
                  {(item.avatarLetter || item.title?.[0] || "?").toUpperCase()}
                </div>

                <span className="flex-1 truncate">{item.title}</span>

                {item.unreadCount > 0 && (
                  <span
                    className="ml-auto min-w-4.5 h-4.5
                             text-xs bg-blue-600 text-white
                             rounded-full flex items-center
                             justify-center"
                  >
                    {item.unreadCount}
                  </span>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="px-3 py-2 text-sm text-gray-500">No chats</div>
        )}
      </div>
    </div>
  );
};

export default AllChats;
