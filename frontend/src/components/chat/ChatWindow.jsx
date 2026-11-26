import { useEffect, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSocket } from "../../context/SocketContext.jsx";
import api from "../../lib/axios.js";
import MessageComposer from "./MessageComposer.jsx";
import MessageList from "./MessageList.jsx";

export default function ChatWindow({ selectedUser }) {
  const socket = useSocket();
  const queryClient = useQueryClient();
  const bottomRef = useRef(null);
  const messageKey = ["messages", selectedUser?._id];

  const messages = useQuery({
    queryKey: messageKey,
    enabled: Boolean(selectedUser),
    queryFn: async () => {
      const response = await api.get(`/messages/${selectedUser._id}`);
      return response.data;
    },
  });

  const sendMessage = useMutation({
    mutationFn: (text) =>
      api.post(`/messages/${selectedUser._id}`, { text }),
    onSuccess: (response) => {
      queryClient.setQueryData(messageKey, (oldMessages = []) => [
        ...oldMessages,
        response.data,
      ]);
    },
  });

  useEffect(() => {
    if (!socket || !selectedUser) return undefined;

    function addMessage(message) {
      if (message.sender?._id !== selectedUser._id) return;

      queryClient.setQueryData(messageKey, (oldMessages = []) => {
        const alreadyAdded = oldMessages.some(
          (item) => item._id === message._id
        );
        if (alreadyAdded) return oldMessages;

        return [...oldMessages, message];
      });
    }

    socket.on("newMessage", addMessage);
    return () => socket.off("newMessage", addMessage);
  }, [socket, selectedUser, queryClient]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.data]);

  if (!selectedUser) {
    return (
      <section className="card flex min-h-96 items-center justify-center p-6 text-ink-secondary">
        Choose a connection to start chatting.
      </section>
    );
  }

  return (
    <section className="card flex min-h-[65vh] flex-col">
      <header className="border-b border-border-subtle p-4 font-semibold text-ink-primary">
        {selectedUser.name}
      </header>
      <MessageList
        messages={messages.data}
        isLoading={messages.isLoading}
        isError={messages.isError}
        bottomRef={bottomRef}
      />
      <MessageComposer
        onSend={(text) => sendMessage.mutateAsync(text)}
        isSending={sendMessage.isPending}
        hasError={sendMessage.isError}
      />
    </section>
  );
}
