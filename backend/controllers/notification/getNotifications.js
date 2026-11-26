import Notification from "../../models/Notification.js";

export async function getNotifications(req, res) {
  try {
    const notifications = await Notification.find({
      recipient: req.user._id,
    })
      .sort({ createdAt: -1 })
      .limit(50)
      .populate("sender", "name username profileImage");

    return res.json(notifications);
  } catch (error) {
    console.error("Get notifications failed:", error.message);
    return res.status(500).json({
      message: "Could not load notifications",
    });
  }
}
