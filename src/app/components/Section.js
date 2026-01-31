export default function Section({
  activeSection,
  isOpen,
  onClose,
  children,
  isMobile,
}) {
  if (!isOpen || !activeSection) return null;

  return (
    <div
      className={`
        ${!isMobile ? "fixed inset-y-0 left-12 z-40 w-[80%]" : "w-[25%]"}
        border-r border-gray-700 bg-gray-900
      `}
    >
      {/* HEADER */}
      <div className="h-12 flex items-center justify-between px-4 py-3 border-b border-gray-700">
        <h3 className="text-xs uppercase tracking-widest text-gray-400">
          {activeSection}
        </h3>

        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white text-lg"
        >
          ✕
        </button>
      </div>

      {/* CONTENT */}
      <div className="p-3 overflow-y-auto flex-1">{children}</div>
    </div>
  );
}
