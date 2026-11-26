import Notification from "../models/Notification.js";
import { emitToUser } from "../config/socket.js";

export async function createNotification(io, notificationData) {
  // Save it first so offline users can still see the notification later.
  const notification = await Notification.create(notificationData);
  await notification.populate(
    "sender",
    "name username profileImage"
  );

  emitToUser(
    io,
    notification.recipient,
    "newNotification",
    notification
  );

  return notification;
}
