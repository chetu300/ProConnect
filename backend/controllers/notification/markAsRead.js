import mongoose from "mongoose";
import Notification from "../../models/Notification.js";

export async function markAsRead(req, res) {
  try {
    const { notificationId } = req.params;

    if (!mongoose.isValidObjectId(notificationId)) {
      return res.status(400).json({
        message: "Invalid notification ID",
      });
    }

    const notification = await Notification.findOneAndUpdate(
      {
        _id: notificationId,
        recipient: req.user._id,
      },
      { $set: { isRead: true } },
      { new: true }
    ).populate("sender", "name username profileImage");

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found",
      });
    }

    return res.json(notification);
  } catch (error) {
    console.error("Mark notification read failed:", error.message);
    return res.status(500).json({
      message: "Could not update notification",
    });
  }
}
