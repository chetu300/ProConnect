import "./config/loadEnv.js";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createServer } from "node:http";
import { connectDB } from "./config/db.js";
import { createSocketServer } from "./config/socket.js";
import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import connectionRoutes from "./routes/connectionRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import teamProjectRoutes from "./routes/teamProjectRoutes.js";

const app = express();
const httpServer = createServer(app);
const io = createSocketServer(httpServer);
const configuredClientOrigin = new URL(
  process.env.CLIENT_URL || "http://localhost:5173"
).origin;

app.set("io", io);
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || origin === configuredClientOrigin) {
        return callback(null, true);
      }

      try {
        const { protocol, hostname } = new URL(origin);
        const isLocalDevelopmentOrigin =
          process.env.NODE_ENV !== "production" &&
          protocol === "http:" &&
          ["localhost", "127.0.0.1"].includes(hostname);

        if (isLocalDevelopmentOrigin) {
          return callback(null, true);
        }
      } catch {
        return callback(new Error("Origin not allowed by CORS"));
      }

      return callback(new Error("Origin not allowed by CORS"));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: "5mb" }));
app.use(cookieParser());

app.get("/api/v1/health", (req, res) => {
  res.json({ message: "ProConnect API is running" });
});
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/posts", postRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/connections", connectionRoutes);
app.use("/api/v1/messages", messageRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/team-projects", teamProjectRoutes);

const port = process.env.PORT || 5000;

connectDB().then(() => {
  httpServer.listen(port, () => {
    console.log(`ProConnect API listening on port ${port}`);
  });
}).catch((error) => {
  console.error("Could not start ProConnect:", error.message);
  process.exit(1);
});
