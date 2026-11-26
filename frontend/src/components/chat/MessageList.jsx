import MessageBubble from "./MessageBubble.jsx";

export default function MessageList({
  messages,
  isLoading,
  isError,
  bottomRef,
}) {
  return (
    <div className="flex-1 space-y-2 overflow-y-auto p-4">
      {isLoading && (
        <p className="text-center text-sm text-ink-secondary">
          Loading messages...
        </p>
      )}
      {isError && (
        <p className="text-center text-sm text-red-600">
          Could not load messages.
        </p>
      )}
      {messages?.map((message) => (
        <MessageBubble key={message._id} message={message} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
