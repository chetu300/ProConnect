import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useSocket } from "../context/SocketContext.jsx";
import api from "../lib/axios.js";

export default function NotificationsPage() {
  const socket = useSocket();
  const queryClient = useQueryClient();
  const notifications = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => (await api.get("/notifications")).data,
  });
  const markRead = useMutation({
    mutationFn: (notificationId) =>
      api.patch(`/notifications/${notificationId}/read`),
    onSuccess: (response) => {
      queryClient.setQueryData(["notifications"], (oldNotifications = []) =>
        oldNotifications.map((item) =>
          item._id === response.data._id ? response.data : item
        )
      );
    },
  });

  useEffect(() => {
    if (!socket) return undefined;
    const addNotification = (notification) => {
      queryClient.setQueryData(["notifications"], (oldNotifications = []) => [
        notification,
        ...oldNotifications.filter((item) => item._id !== notification._id),
      ]);
    };

    socket.on("newNotification", addNotification);
    return () => socket.off("newNotification", addNotification);
  }, [socket, queryClient]);

  return (
    <section className="card gap-3 p-5">
      <h1 className="text-xl font-bold text-ink-primary">Notifications</h1>
      {notifications.isLoading && <p className="text-ink-secondary">Loading notifications...</p>}
      {notifications.data?.map((item) => (
        <article
          key={item._id}
          className={`w-full rounded-xl border border-border-subtle p-4 text-left ${item.isRead ? "bg-white" : "bg-purple-50"}`}
        >
          <span className="font-semibold text-ink-primary">
            {item.sender?.name || "A ProConnect member"}
          </span>
          <span className="ml-1 text-ink-primary">{item.message}</span>
          {!item.isRead && (
            <button
              className="ml-2 text-sm font-medium text-brand-purple hover:underline"
              onClick={() => markRead.mutate(item._id)}
            >
              Mark read
            </button>
          )}
          {item.sender?.username && (
            <Link
              className="ml-2 text-sm font-medium text-brand-indigo hover:underline"
              to={`/profile/${item.sender.username}`}
              onClick={(event) => event.stopPropagation()}
            >
              View profile
            </Link>
          )}
          <p className="mt-1 text-xs text-ink-secondary">
            {new Date(item.createdAt).toLocaleString()}
          </p>
        </article>
      ))}
      {notifications.data?.length === 0 && (
        <p className="text-ink-secondary">You are all caught up.</p>
      )}
      {notifications.isError && (
        <p className="text-sm text-red-600">Could not load notifications.</p>
      )}
    </section>
  );
}
