import { File } from "lucide-react";
export default function MessageContent({ m }) {
  switch (m.type) {
    case "text":
      return <p className="whitespace-pre-wrap">{m.content?.text}</p>;

    case "image":
      return (
        <img
          src={m.content?.url}
          alt={m.content?.fileName}
          className="rounded-lg max-h-64"
        />
      );

    case "video":
      return (
        <video controls src={m.content?.url} className="rounded-lg max-h-64" />
      );

    case "audio":
    case "voice":
      return <audio controls src={m.content?.url} className="w-56" />;

    case "file":
      return (
        <a
          href={m.content?.url}
          download
          className="flex items-center gap-2 underline"
        >
          <File size={16} />
          {m.content?.fileName}
        </a>
      );

    default:
      return (
        <p className="italic text-xs text-gray-400">Unsupported message</p>
      );
  }
}
