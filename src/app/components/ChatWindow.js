import { SidebarTrigger } from "@/components/ui/sidebar";
import { useEffect, useRef } from "react";

export default function ChatWindow({
  chat,
  currentUser,
  text,
  setText,
  sendMessage,
}) {
  // ref for new messages
  const bottomRef = useRef(null);

  // scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: chat.messages.length > 1 ? "smooth" : "auto",
    });
  }, [chat?.messages]);

  return (
    <section className="flex-1 w-full h-full flex flex-col bg-gray-900 overflow-hidden">
      <div className="flex items-center gap-x-4 p-4 border-b border-gray-700">
        <SidebarTrigger className="md:hidden" />
        <div className="font-semibold text-lg truncate">
          {chat ? chat.name : "Chat"}
          {chat?.type === "group" && (
            <span className="text-red-500 ml-2 text-sm">(Group)</span>
          )}
        </div>
      </div>

      {!chat ? (
        <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">
          Select a chat to start messaging
        </div>
      ) : (
        <>
          <div className="flex-1 min-h-0 p-4 overflow-y-auto custom-scrollbar space-y-3">
            {chat.messages.map((m) => {
              const isMe =
                m.sender?.id === currentUser.id ||
                m.senderId === currentUser.id;
              console.log("message", m);

              return (
                <div
                  key={m.id}
                  className={`w-fit px-3 py-2 rounded-lg text-sm ${
                    isMe
                      ? "ml-auto bg-blue-600 text-white"
                      : "bg-gray-700 text-gray-100"
                  }`}
                >
                  <div className="flex gap-x-4 justify-between items-center mb-1">
                    <span className="text-xs font-semibold text-gray-300">
                      {isMe
                        ? "You"
                        : chat.type === "group"
                          ? m.sender.name
                          : chat.name}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      {new Date(m.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                  {m.text}
                </div>
              );
            })}
            <div ref={bottomRef}></div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className="p-3 border-t border-gray-700 flex gap-2"
          >
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="flex-1 bg-gray-800 border border-gray-700 px-3 py-2 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
              placeholder="Type a message..."
            />

            <button
              type="submit"
              className="bg-blue-600 px-4 rounded-lg text-sm font-semibold hover:bg-blue-700"
            >
              Send
            </button>
          </form>
        </>
      )}
    </section>
  );
}
