import mongoose from "mongoose";
import Connection from "../../models/Connection.js";

export async function rejectRequest(req, res) {
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

    request.status = "rejected";
    await request.save();

    return res.json({
      message: "Connection request rejected",
    });
  } catch (error) {
    console.error("Reject request failed:", error.message);
    return res.status(500).json({
      message: "Could not reject request",
    });
  }
}
