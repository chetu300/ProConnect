import mongoose from "mongoose";
import Connection from "../../models/Connection.js";
import Message from "../../models/Message.js";
import { emitToUser } from "../../config/socket.js";
import { createNotification } from "../../utils/createNotification.js";

export async function sendMessage(req, res) {
  try {
    const { userId } = req.params;
    const text = req.body.text?.trim();

    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    if (req.user._id.equals(userId)) {
      return res.status(400).json({
        message: "You cannot message yourself",
      });
    }
    if (!text) {
      return res.status(400).json({
        message: "Message text is required",
      });
    }

    const connection = await Connection.findOne({
      status: "accepted",
      $or: [
        { sender: req.user._id, receiver: userId },
        { sender: userId, receiver: req.user._id },
      ],
    });

    // Chat is only open between users who accepted a connection.
    if (!connection) {
      return res.status(403).json({
        message: "You can only message a connection",
      });
    }

    const message = await Message.create({
      sender: req.user._id,
      receiver: userId,
      text,
    });
    await message.populate(
      "sender",
      "name username profileImage"
    );

    emitToUser(req.app.get("io"), userId, "newMessage", message);
    await createNotification(req.app.get("io"), {
      recipient: userId,
      sender: req.user._id,
      type: "message",
      message: `${req.user.name} sent you a message`,
    });

    return res.status(201).json(message);
  } catch (error) {
    console.error("Send message failed:", error.message);
    return res.status(500).json({
      message: "Could not send message",
    });
  }
}
