import { Check, CheckCheck, Info } from "lucide-react";
import MessageContent from "./MessageContent";

export default function MessageBubble({
  m,
  isMe,
  chat,
  isRead,
  currentUser,
  userMap,
  setSelectedMessage,
  getSenderName
}) {
  const time = new Date(m.createdAt).toLocaleTimeString();

  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[70%] rounded-lg px-3 py-2 text-sm ${
          isMe ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-100"
        }`}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between gap-3 mb-1">
          <span className="text-xs font-semibold text-gray-300">
            {isMe ? "You" : getSenderName(m, currentUser, userMap)}
          </span>

          <div className="flex items-center gap-1">
            <span className="text-[10px] text-gray-400">{time}</span>

            {isMe &&
              (chat.type === "private" ? (
                isRead ? (
                  <CheckCheck size={14} className="text-green-400" />
                ) : (
                  <Check size={14} className="text-gray-400" />
                )
              ) : (
                <button
                  onClick={() => setSelectedMessage(m)}
                  className="p-0.5 rounded hover:bg-gray-600"
                >
                  <Info size={12} />
                </button>
              ))}
          </div>
        </div>

        {/* BODY */}
        <MessageContent m={m} />
      </div>
    </div>
  );
}
