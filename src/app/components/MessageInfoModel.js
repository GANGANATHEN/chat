import React from "react";

export default function MessageInfoModal({ message, chat, userMap, onClose }) {
  if (!message) return null;

  // normalize readers (old vs new)
  const readers = (message.readBy || []).map((r) =>
    typeof r === "string" ? { userId: r, readAt: null } : r,
  );

  const senderId = message.sender?.id;

  // exclude sender from list
  const filteredReaders = readers.filter((r) => r.userId !== senderId);

  return (
    <div
      className="fixed inset-0 z-50 flex justify-center items-start pt-24 md:pt-32 
    lg:pt-40 bg-black/30"
      onClick={onClose}
    >
      <div className="bg-gray-800 rounded-xl shadow-lg w-80 max-w-[90%] md:w-96 p-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-semibold text-white">Read by</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-sm"
          >
            ✕
          </button>
        </div>

        {/* No readers */}
        {filteredReaders.length === 0 ? (
          <p className="text-xs text-gray-400">No one has read this yet</p>
        ) : (
          <ul className="space-y-2 max-h-96 overflow-y-auto">
            {filteredReaders.map((r) => (
              <li
                key={r.userId}
                className="flex justify-between text-xs px-2 py-1 hover:bg-gray-700 rounded"
              >
                <span className="text-gray-200">
                  {userMap[r.userId]?.name || "Unknown"}
                </span>
                {r.readAt && !isNaN(r.readAt) && (
                  <span className="text-gray-400 text-[10px]">
                    {new Date(r.readAt).toLocaleTimeString("en-GB", {
                      hour: "2-digit",
                      minute: "2-digit",
                      second:"2-digit"
                    })}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
