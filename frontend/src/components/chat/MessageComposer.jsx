import { useState } from "react";
import { Send } from "lucide-react";

export default function MessageComposer({ onSend, isSending, hasError }) {
  const [text, setText] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    const messageText = text.trim();
    if (!messageText) return;

    await onSend(messageText);
    setText("");
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="flex gap-2 border-t border-border-subtle p-3"
      >
        <input
          className="input input-bordered auth-input w-full"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Write a message..."
        />
        <button
          className="btn btn-primary"
          disabled={!text.trim() || isSending}
        >
          <Send size={17} />
        </button>
      </form>
      {hasError && (
        <p className="px-4 pb-3 text-sm text-red-600">
          Could not send message.
        </p>
      )}
    </>
  );
}
