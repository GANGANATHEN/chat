import React from "react";
import { loadLocal } from "../utils/storage";

const Users = ({ currentUser, openPrivateChat, onClose, isMobile }) => {
  const users = loadLocal("users", []);
  const otherUsers = users?.filter((u) => u.id !== currentUser.id);
  return (
    <div className={`sidebar-scroll-area custom-scrollbar pb-15`}>
      <div className="px-3">
        {otherUsers && otherUsers.length > 0 ? (
          otherUsers
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
                      flex items-center gap-3 py-6 rounded-lg
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
