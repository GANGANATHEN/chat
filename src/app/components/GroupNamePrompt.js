import { useState } from "react";

export default function GroupNamePrompt({ onConfirm, onCancel }) {
  const [name, setName] = useState("");

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-900 w-80 rounded-lg p-4">
        <h3 className="font-semibold mb-3">Create Group</h3>

        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter group name"
          className="w-full bg-gray-800 px-3 py-2 rounded text-sm outline-none mb-4"
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-3 py-1 text-sm text-red-500 hover:text-red-300"
          >
            Cancel
          </button>

          <button
            disabled={!name.trim()}
            onClick={() => onConfirm(name.trim())}
            className="px-3 py-1 text-sm bg-indigo-600 rounded disabled:opacity-40"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
