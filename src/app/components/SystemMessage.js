export default function SystemMessage({ children, type = "info" }) {
  return (
    <div className="flex justify-center my-2">
      <div
        className={`px-3 py-1 text-xs rounded-full
          ${
            type === "add"
              ? "bg-green-500/10 text-green-400"
              : type === "remove"
                ? "bg-red-500/10 text-red-400"
                : "bg-gray-500/10 text-gray-300"
          }`}
      >
        {children}
      </div>
    </div>
  );
}
