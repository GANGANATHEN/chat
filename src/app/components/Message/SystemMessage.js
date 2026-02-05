export default function SystemMessage({ m }) {
  const colorMap = {
    add: "text-lime-400",
    remove: "text-red-400",
    leave: "text-yellow-400",
  };

  const color = colorMap[m.subtype] || "text-gray-400";

  return (
    <div className={`text-xs text-center my-2 ${color}`}>
      {m.content?.text}
      <span className="ml-2 text-[10px] text-gray-500">
        {new Date(m.createdAt).toLocaleTimeString()}
      </span>
    </div>
  );
}
