import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../lib/axios.js";
import ChatSidebar from "../components/chat/ChatSidebar.jsx";
import ChatWindow from "../components/chat/ChatWindow.jsx";

export default function MessagesPage() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [search, setSearch] = useState("");
  const connections = useQuery({
    queryKey: ["network"],
    queryFn: async () => (await api.get("/connections")).data,
  });

  return (
    <div className="grid gap-4 md:grid-cols-[280px_1fr]">
      <div>
        {connections.isLoading && (
          <p className="p-4 text-ink-secondary">
            Loading connections...
          </p>
        )}
        {connections.isError && (
          <p className="p-4 text-red-600">
            Could not load connections.
          </p>
        )}
        {connections.data && (
          <ChatSidebar
            people={connections.data.connections}
            selectedUser={selectedUser}
            onSelect={setSelectedUser}
            search={search}
            onSearch={setSearch}
          />
        )}
      </div>
      <ChatWindow selectedUser={selectedUser} />
    </div>
  );
}
