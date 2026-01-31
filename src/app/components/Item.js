export default function Item({ onClick }) {
  return (
    <div
      onClick={onClick}
      className="custom-scrollbar cursor-pointer px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition"
    >
      Click to open chat
    </div>
  );
}
