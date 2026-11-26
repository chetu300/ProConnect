import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UserRoundCheck, UserRoundX } from "lucide-react";
import api from "../../lib/axios.js";
import PersonCard from "./PersonCard.jsx";

export default function ConnectionRequests({ requests }) {
  const queryClient = useQueryClient();
  const updateRequest = useMutation({
    mutationFn: ({ requestId, action }) =>
      api.patch(`/connections/${requestId}/${action}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["network"] });
      queryClient.invalidateQueries({ queryKey: ["suggestions"] });
    },
  });

  return (
    <section className="card gap-3 p-5">
      <h1 className="text-xl font-bold text-ink-primary">Connection requests</h1>
      {requests?.map((request) => (
        <PersonCard
          key={request._id}
          person={request.sender}
          button={
            <div className="flex gap-1">
              <button className="btn btn-primary btn-sm" aria-label="Accept request" onClick={() => updateRequest.mutate({ requestId: request._id, action: "accept" })}>
                <UserRoundCheck size={17} />
              </button>
              <button className="btn btn-ghost btn-sm" aria-label="Reject request" onClick={() => updateRequest.mutate({ requestId: request._id, action: "reject" })}>
                <UserRoundX size={17} />
              </button>
            </div>
          }
        />
      ))}
      {requests?.length === 0 && (
        <p className="text-sm text-ink-secondary">No new connection requests.</p>
      )}
      {updateRequest.isError && (
        <p className="text-sm text-red-600">Could not update the request.</p>
      )}
    </section>
  );
}
