import { File, Images, Video, Music, FolderArchive } from "lucide-react";
export default function MessageContent({ m }) {
  function getFileIcon(file) {
    if (!file?.mimeType) return <File size={18} />;

    if (file.mimeType.startsWith("image/")) return <Images size={18} />;
    if (file.mimeType.startsWith("video/")) return <Video size={18} />;
    if (file.mimeType.startsWith("audio/")) return <Music size={18} />;
    // For compressed files
    if (
      file.mimeType === "application/zip" ||
      file.name.endsWith(".zip") ||
      file.name.endsWith(".rar") ||
      file.mimeType === "application/x-zip-compressed"
    )
      return <FolderArchive size={18} />;

    return <File size={18} />; // fallback
  }

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
      // console.log(m.content);

      return (
        <a
          href={m.content?.url}
          download
          className="flex items-center gap-2 underline"
        >
          {getFileIcon && getFileIcon(m.content)}
          {m.content?.name}
        </a>
      );

    default:
      return (
        <p className="italic text-xs text-gray-400">Unsupported message</p>
      );
  }
}
