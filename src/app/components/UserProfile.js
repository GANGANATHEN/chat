import { X, Pencil, Camera, Check } from "lucide-react";
import { useState } from "react";

export default function UserProfile({ user, currentUser, onClose, onSave }) {
  const isMe = currentUser.id === user.id;

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user.name);

  function handleSave() {
    if (!name.trim()) return;
    onSave?.(name);
    setEditing(false);
  }

  function handleDelete() {
    const confirmDelete = confirm(
      "Are you sure? Your account and all chats will be deleted.",
    );

    if (!confirmDelete) return;

    // 1. Remove user from users
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const updatedUsers = users.filter((u) => u.id !== user.id);
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    // 2. Remove user from chats
    const chats = JSON.parse(localStorage.getItem("chats")) || [];
    const updatedChats = chats
      .map((chat) => ({
        ...chat,
        members: chat.members.filter((m) => m.id !== user.id),
        messages: chat.messages.filter((msg) => msg.sender.id !== user.id),
      }))
      .filter((chat) => chat.members.length > 0);

    localStorage.setItem("chats", JSON.stringify(updatedChats));

    // 3. Clear session
    sessionStorage.removeItem("currentUser");

    // 4. Redirect
    window.location.href = "/";
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-end z-50"
      onClick={onClose}
    >
      <div
        className="w-90 h-full bg-gray-900 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="relative px-5 py-4 border-b border-gray-800">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-white"
          >
            <X />
          </button>

          <h2 className="text-sm uppercase text-gray-400 tracking-wide">
            Profile
          </h2>
        </div>

        {/* AVATAR */}
        <div className="flex flex-col items-center mt-8">
          <div className="relative">
            <div className="h-24 w-24 rounded-full bg-indigo-600 flex items-center justify-center text-3xl font-bold">
              {user.name[0].toUpperCase()}
            </div>

            {isMe && (
              <button
                className="absolute bottom-1 right-1 bg-gray-800 p-1.5 rounded-full hover:bg-gray-700"
                title="Change photo"
              >
                <Camera size={16} />
              </button>
            )}
          </div>

          {/* NAME */}
          <div className="mt-4 text-center">
            {editing ? (
              <div className="flex items-center gap-2">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-gray-800 text-white px-3 py-1.5 rounded text-sm focus:outline-none"
                />
                <button
                  onClick={handleSave}
                  className="text-green-400 hover:text-green-500"
                >
                  <Check size={18} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-semibold">{user.name}</h3>

                {isMe && (
                  <button
                    onClick={() => setEditing(true)}
                    className="text-gray-400 hover:text-white"
                  >
                    <Pencil size={16} />
                  </button>
                )}
              </div>
            )}

            <p className="text-xs text-gray-400 mt-1">User ID: {user.id}</p>
          </div>
        </div>

        {/* INFO */}
        <div className="mt-8 px-5 space-y-3">
          <div className="bg-gray-800/60 p-3 rounded-lg">
            <p className="text-xs text-gray-400">Status</p>
            <p className="text-sm text-white">
              {isMe ? "This is you" : "Chat member"}
            </p>
          </div>
        </div>

        {/* DELETE ACCOUNT */}
        {isMe && (
          <div className="mt-auto px-5 py-4 border-t border-gray-800">
            <button
              onClick={handleDelete}
              className="w-full py-2.5 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white transition font-medium">
              Delete Account
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
