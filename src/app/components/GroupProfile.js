import { X, Minus, UserPlus, Users } from "lucide-react";

export default function GroupProfile({
  chat,
  onClose,
  onRemoveMember,
  onAddMember,
}) {
  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-end z-50"
      onClick={onClose}
    >
      <div
        className="w-105 h-full bg-gray-900 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="relative px-6 py-5 border-b border-gray-800">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-white"
          >
            <X />
          </button>

          <div className="flex flex-col items-center text-center">
            <div className="h-16 w-16 rounded-full bg-indigo-600 flex items-center justify-center text-xl font-bold">
              {chat.name[0].toUpperCase()}
            </div>

            <h2 className="text-xl font-semibold mt-3">{chat.name}</h2>
            <p className="text-sm text-gray-400 mt-1 flex items-center gap-1">
              <Users size={14} />
              {chat.members.length} members
            </p>
          </div>
        </div>

        {/* MEMBERS */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <h3 className="text-xs uppercase text-gray-400 mb-3 tracking-wide">
            Group Members
          </h3>

          <ul className="space-y-2">
            {chat.members.map((m) => (
              <li
                key={m.id}
                className="group flex items-center justify-between bg-gray-800/60 hover:bg-gray-800 px-3 py-2 rounded-lg transition"
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-gray-700 flex items-center justify-center font-semibold">
                    {m.name[0]?.toUpperCase()}
                  </div>

                  <div>
                    <p className="text-sm font-medium text-white">{m.name}</p>
                    <p className="text-xs text-gray-400">Member</p>
                  </div>
                </div>

                <button
                  onClick={() => onRemoveMember(m.id)}
                  className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-500 transition"
                  title="Remove member"
                >
                  <Minus size={16} />
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* FOOTER */}
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={onAddMember}
            className="w-full bg-indigo-600 hover:bg-indigo-500 transition py-2.5 rounded-lg flex items-center justify-center gap-2 font-medium"
          >
            <UserPlus size={18} />
            Add member
          </button>
        </div>
      </div>
    </div>
  );
}
