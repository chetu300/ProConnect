import { Server } from "socket.io";
import jwt from "jsonwebtoken";

const allowedOrigin = new URL(
  process.env.CLIENT_URL || "http://localhost:5173"
).origin;

export function createSocketServer(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: allowedOrigin,
      credentials: true,
    },
  });

  io.use((socket, next) => {
    // Socket login uses the same JWT cookie as the API.
    const cookieHeader = socket.handshake.headers.cookie || "";
    const tokenCookie = cookieHeader
      .split(";")
      .map((cookie) => cookie.trim())
      .find((cookie) => cookie.startsWith("token="));
    const token = tokenCookie?.slice("token=".length);

    if (!token) {
      return next(new Error("Authentication required"));
    }

    try {
      const decoded = jwt.verify(
        decodeURIComponent(token),
        process.env.JWT_SECRET
      );
      socket.data.userId = decoded.userId;
      return next();
    } catch (error) {
      return next(new Error("Invalid or expired login"));
    }
  });

  io.on("connection", (socket) => {
    socket.join(`user:${socket.data.userId}`);
  });

  return io;
}

export function emitToUser(io, userId, eventName, payload) {
  io.to(`user:${userId}`).emit(eventName, payload);
}
