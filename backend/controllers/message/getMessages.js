import mongoose from "mongoose";
import Connection from "../../models/Connection.js";
import Message from "../../models/Message.js";

export async function getMessages(req, res) {
  try {
    const { userId } = req.params;
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const connection = await Connection.findOne({
      status: "accepted",
      $or: [
        { sender: req.user._id, receiver: userId },
        { sender: userId, receiver: req.user._id },
      ],
    });

    if (!connection) {
      return res.status(403).json({
        message: "Chat is only available to connections",
      });
    }

    // Mark incoming messages as read before showing the conversation.
    await Message.updateMany(
      {
        sender: userId,
        receiver: req.user._id,
        isRead: false,
      },
      { $set: { isRead: true } }
    );

    const messages = await Message.find({
      $or: [
        { sender: req.user._id, receiver: userId },
        { sender: userId, receiver: req.user._id },
      ],
    })
      .sort({ createdAt: -1 })
      .limit(100)
      .populate("sender", "name username profileImage")
      .populate("receiver", "name username profileImage");

    return res.json(messages.reverse());
  } catch (error) {
    console.error("Get messages failed:", error.message);
    return res.status(500).json({
      message: "Could not load messages",
    });
  }
}
