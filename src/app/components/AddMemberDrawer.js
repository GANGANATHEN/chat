import { X, UserPlus, Search } from "lucide-react";
import { useState, useMemo } from "react";
import { loadLocal } from "../utils/storage";

export default function AddMemberDrawer({
  chat,
  onAdd,
  onClose,
  currentUser,
  addedUser,
  setAddedUser,
}) {
  const allUsers = loadLocal("users", []);
  const [query, setQuery] = useState("");

  const filteredUsers = useMemo(() => {
    return allUsers
      .filter(
        (u) =>
          u.name.toLowerCase().includes(query.toLowerCase()) &&
          !chat.members.some((m) => m.id === u.id),
      )
      .map((u) => ({ id: u.id, name: u.name }));
  }, [query, allUsers, chat.members]);

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-end z-50">
      <div className="w-80 bg-gray-900 p-4 flex flex-col">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Add members</h3>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

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

        {/* USER LIST */}
        <div className="flex-1 overflow-y-auto space-y-2">
          {filteredUsers.length === 0 && (
            <p className="text-sm text-gray-500 text-center mt-10">
              No users found
            </p>
          )}

          {filteredUsers.map((u) => {
            {
              /* console.log(u); */
            }
            return (
              <div
                key={u.id}
                className="flex items-center justify-between bg-gray-800 p-2 rounded"
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-indigo-500 flex items-center justify-center font-semibold">
                    {(u.name?.[0] || "?").toUpperCase()}
                  </div>
                  <span className="text-sm">{u.name}</span>
                </div>

                <button
                  onClick={() => {
                    onAdd({
                      id: u.id,
                      name: u.name,
                      addername: currentUser.name,
                    });

                    // show message
                    setAddedUser(u.name);

                    // auto hide after 2s
                    setTimeout(() => setAddedUser(null), 2000);
                  }}
                  className="text-indigo-400 hover:text-indigo-300"
                  title="Add user"
                >
                  <UserPlus size={18} />
                </button>
              </div>
            );
          })}
        </div>

        {addedUser && (
          <p className="font-medium mt-3 text-sm text-lime-300 text-center">
            {addedUser} was added
          </p>
        )}
      </div>
    </div>
  );
}
