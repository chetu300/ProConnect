import mongoose from "mongoose";
import Connection from "../../models/Connection.js";
import { createNotification } from "../../utils/createNotification.js";

export async function acceptRequest(req, res) {
  try {
    const { requestId } = req.params;

    if (!mongoose.isValidObjectId(requestId)) {
      return res.status(400).json({
        message: "Invalid request ID",
      });
    }

    const request = await Connection.findOne({
      _id: requestId,
      receiver: req.user._id,
      status: "pending",
    });

    if (!request) {
      return res.status(404).json({
        message: "Pending request not found",
      });
    }

    request.status = "accepted";
    await request.save();
    await createNotification(req.app.get("io"), {
      recipient: request.sender,
      sender: req.user._id,
      type: "connection",
      message: `${req.user.name} accepted your connection request`,
    });
    await request.populate(
      "sender",
      "name username profileImage headline"
    );

    return res.json(request);
  } catch (error) {
    console.error("Accept request failed:", error.message);
    return res.status(500).json({
      message: "Could not accept request",
    });
  }
}
