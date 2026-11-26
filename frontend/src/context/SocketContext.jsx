import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";

const SocketContext = createContext({
  socket: null,
  hasNewMessage: false,
  hasNewNotification: false,
});
const socketUrl = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

export function SocketProvider({ children }) {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const [socket, setSocket] = useState(null);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const [hasNewNotification, setHasNewNotification] = useState(false);

  useEffect(() => {
    if (!user) {
      setSocket(null);
      setHasNewMessage(false);
      setHasNewNotification(false);
      return undefined;
    }

    const newSocket = io(socketUrl, { withCredentials: true });
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    if (!socket) return undefined;

    function handleNewMessage() {
      setHasNewMessage(true);
    }

    function handleNewNotification() {
      setHasNewNotification(true);
    }

    socket.on("newMessage", handleNewMessage);
    socket.on("newNotification", handleNewNotification);
    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("newNotification", handleNewNotification);
    };
  }, [socket]);

  useEffect(() => {
    if (pathname === "/messages") setHasNewMessage(false);
    if (pathname === "/notifications") setHasNewNotification(false);
  }, [pathname]);

  return (
    <SocketContext.Provider value={{ socket, hasNewMessage, hasNewNotification }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext).socket;
}

export function useSocketNotifications() {
  const { hasNewMessage, hasNewNotification } = useContext(SocketContext);
  return { hasNewMessage, hasNewNotification };
}
