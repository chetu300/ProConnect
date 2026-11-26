import mongoose from "mongoose";
import Connection from "../../models/Connection.js";
import { createNotification } from "../../utils/createNotification.js";

export async function sendRequest(req, res) {
  try {
    const { userId } = req.params;

    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    if (req.user._id.equals(userId)) {
      return res.status(400).json({
        message: "You cannot connect with yourself",
      });
    }

    const existing = await Connection.findOne({
      $or: [
        { sender: req.user._id, receiver: userId },
        { sender: userId, receiver: req.user._id },
      ],
    });

    if (existing?.status === "accepted") {
      return res.status(409).json({
        message: "You are already connected",
      });
    }

    if (existing?.status === "pending") {
      return res.status(409).json({
        message: "A connection request is already pending",
      });
    }

    if (existing) {
      await existing.deleteOne();
    }

    const connection = await Connection.create({
      sender: req.user._id,
      receiver: userId,
    });

    await createNotification(req.app.get("io"), {
      recipient: userId,
      sender: req.user._id,
      type: "connection",
      message: `${req.user.name} sent you a connection request`,
    });

    return res.status(201).json(connection);
  } catch (error) {
    console.error("Send connection request failed:", error.message);
    return res.status(500).json({
      message: "Could not send connection request",
    });
  }
}
