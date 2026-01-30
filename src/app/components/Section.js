export default function Section({ title, children }) {
  return (
    <div>
      <h3 className="text-xs uppercase text-gray-400 mb-3">
        {title}
      </h3>
      <div className="space-y-2">{children}</div>
    </div>
  );
}
