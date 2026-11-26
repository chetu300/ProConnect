import { useAuth } from "../../context/AuthContext.jsx";

export default function MessageBubble({ message }) {
  const { user } = useAuth();
  const isMine = message.sender?._id === user?._id;
  const messageTime = new Date(message.createdAt).toLocaleTimeString(
    [],
    {
      hour: "2-digit",
      minute: "2-digit",
    }
  );

  return (
    <div className={`chat ${isMine ? "chat-end" : "chat-start"}`}>
      <div
        className="
          chat-bubble max-w-[85%] whitespace-pre-wrap
          break-words
        "
      >
        {message.text}
      </div>
      <time className="chat-footer text-xs opacity-60">
        {messageTime}
      </time>
    </div>
  );
}
