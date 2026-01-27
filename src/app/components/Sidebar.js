import { loadLocal } from "../utils/storage";

export default function Sidebar({
  currentUser,
  chats,
  onLogout,
  openPrivateChat,
  createGroup,
  setActiveChat,
}) {
  const users = loadLocal("users", []);

  return (
    <aside className="w-1/4 border-r border-gray-700 p-4">
      <div className="flex justify-between mb-3">
        <h2 className="font-bold">Users</h2>
        <button onClick={onLogout} className="text-red-400 text-sm">
          Logout
        </button>
      </div>

      {users
        .filter((u) => u.id !== currentUser.id)
        .map((u) => (
          <p
            key={u.id}
            onClick={() => openPrivateChat(u)}
            className="cursor-pointer p-2 hover:bg-gray-700 rounded"
          >
            {u.name}
          </p>
        ))}

      <hr className="my-3 border-gray-700" />

      <h3 className="text-red-500 font-bold mb-2">Group Chats</h3>
      <button
        onClick={createGroup}
        className="bg-red-600 w-full p-2 rounded mb-2"
      >
        + Create Group
      </button>

      {chats
        .filter(
          (c) => c.type === "group" && c.members.includes(currentUser.id)
        )
        .map((c) => (
          <p
            key={c.id}
            onClick={() => setActiveChat(c.id)}
            className="cursor-pointer p-2 text-red-400 hover:bg-gray-700 rounded"
          >
            {c.name}
          </p>
        ))}
    </aside>
  );
}
