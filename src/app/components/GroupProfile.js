import { X, Minus, UserPlus, Users } from "lucide-react";
import { useState } from "react";
import AddMemberDrawer from "./AddMemberDrawer";

export default function GroupProfile({
  chat,
  onClose,
  onRemoveMember,
  onAddMember,
  currentUser,
}) {
  const [addOpen, setAddOpen] = useState(false);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex justify-end">
      {/* DRAWER */}
      <div className="w-105 max-w-full bg-gray-950 h-full flex flex-col shadow-2xl animate-slideIn">
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
                if (a.id === currentUser.id) return -1; // current user first
                if (b.id === currentUser.id) return 1; // alp

                const nameCompare = a.name.localeCompare(b.name);
                if (nameCompare !== 0) return nameCompare;

                return a.id.localeCompare(b.id); // if names same
              })

              .map((m) => (
                <div
                  key={m.id}
                  className="group flex items-center justify-between bg-gray-900 hover:bg-gray-800 transition rounded-lg px-3 py-2"
                >
                  {/* Avatar + Name */}
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-indigo-500 flex items-center justify-center text-sm font-semibold text-white">
                      {(m.name?.[0] || "?").toUpperCase()}
                    </div>
                    <span className="text-sm text-white">
                      {m.name || "Unknown"}
                    </span>
                  </div>

                  {/* Remove/Leave button */}
                  <button
                    onClick={() => onRemoveMember(m.id)}
                    className="opacity-0 group-hover:opacity-100 transition flex items-center gap-1 text-red-400 hover:text-red-300"
                    title={
                      currentUser.id === m.id ? "Leave group" : "Remove member"
                    }
                  >
                    <Minus size={16} />
                    <span className="text-xs">
                      {currentUser.id === m.id ? "Leave" : "Remove"}
                    </span>
                  </button>
                </div>
              ))}
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-4 border-t border-gray-800 bg-gray-950">
          <button
            onClick={() => setAddOpen(true)}
            className="w-full bg-indigo-600 hover:bg-indigo-500 transition py-3 rounded-xl flex items-center justify-center gap-2 font-medium"
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
          onAdd={onAddMember}
          onClose={() => setAddOpen(false)}
        />
      )}
    </div>
  );
}
