export default function ChatWindow({
  chat,
  currentUser,
  text,
  setText,
  sendMessage,
}) {
  if (!chat)
    return (
      <section className="flex-1 flex items-center justify-center text-gray-400">
        Select a chat
      </section>
    );

  return (
    <section className="flex-1 flex flex-col">
      <div className="p-4 border-b border-gray-700 font-bold">
        {chat.name}
        {chat.type === "group" && (
          <span className="text-red-500 ml-2">(Group Chat)</span>
        )}
      </div>

      <div className="flex-1 p-4 overflow-y-auto space-y-2">
        {chat.messages.map((m) => (
          <div
            key={m.id}
            className={`max-w-xs p-2 rounded ${
              m.senderId === currentUser.id
                ? "ml-auto bg-blue-600"
                : "bg-gray-700"
            }`}
          >
            {m.text}
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-gray-700 flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 border border-gray-400 p-2 rounded text-white"
          placeholder="Type message..."
        />
        <button onClick={sendMessage} className="bg-blue-600 px-4 rounded">
          Send
        </button>
      </div>
    </section>
  );
}
