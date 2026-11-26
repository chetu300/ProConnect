import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UserPlus } from "lucide-react";
import api from "../lib/axios.js";
import ConnectionRequests from "../components/network/ConnectionRequests.jsx";
import PersonCard from "../components/network/PersonCard.jsx";

export default function NetworkPage() {
  const queryClient = useQueryClient();
  const suggestions = useQuery({
    queryKey: ["suggestions"],
    queryFn: async () => (await api.get("/users/suggestions")).data,
  });
  const connections = useQuery({
    queryKey: ["network"],
    queryFn: async () => (await api.get("/connections")).data,
  });
  const sendRequest = useMutation({
    mutationFn: (userId) => api.post(`/connections/${userId}/request`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["network"] });
      queryClient.invalidateQueries({ queryKey: ["suggestions"] });
    },
  });

  return (
    <div className="space-y-5">
      <ConnectionRequests requests={connections.data?.receivedRequests} />
      {connections.data?.sentRequests.length > 0 && (
        <section className="card gap-3 p-5">
          <h2 className="text-xl font-bold text-ink-primary">Requests sent</h2>
          {connections.data.sentRequests.map((request) => (
            <PersonCard
              key={request._id}
              person={request.receiver}
              button={<span className="rounded-full border border-purple-200 bg-purple-50 px-2.5 py-0.5 text-xs font-semibold text-brand-purple">Pending</span>}
            />
          ))}
        </section>
      )}
      <section className="card gap-3 p-5">
        <h2 className="text-xl font-bold text-ink-primary">People you may know</h2>
        {suggestions.isLoading && <p className="text-ink-secondary">Loading people...</p>}
        {suggestions.data?.map((person) => (
          <PersonCard
            key={person._id}
            person={person}
            button={
              <button className="btn btn-primary btn-sm" onClick={() => sendRequest.mutate(person._id)}>
                <UserPlus size={16} /> Connect
              </button>
            }
          />
        ))}
        {suggestions.isError && <p className="text-sm text-red-600">Could not load suggestions.</p>}
        {sendRequest.isError && <p className="text-sm text-red-600">Could not send request.</p>}
      </section>
      <section className="card gap-3 p-5">
        <h2 className="text-xl font-bold text-ink-primary">Your connections</h2>
        {connections.data?.connections.map((person) => (
          <PersonCard key={person._id} person={person} />
        ))}
        {connections.data?.connections.length === 0 && (
          <p className="text-sm text-ink-secondary">Your accepted connections will show here.</p>
        )}
        {connections.isError && <p className="text-sm text-red-600">Could not load your network.</p>}
      </section>
    </div>
  );
}
