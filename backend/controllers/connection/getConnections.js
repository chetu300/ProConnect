import Connection from "../../models/Connection.js";

export async function getConnections(req, res) {
  try {
    const userId = req.user._id;
    const [accepted, received, sent] = await Promise.all([
      Connection.find({
        status: "accepted",
        $or: [{ sender: userId }, { receiver: userId }],
      })
        .populate("sender", "name username profileImage headline")
        .populate("receiver", "name username profileImage headline"),
      Connection.find({ receiver: userId, status: "pending" })
        .populate("sender", "name username profileImage headline"),
      Connection.find({ sender: userId, status: "pending" })
        .populate("receiver", "name username profileImage headline"),
    ]);

    return res.json({
      connections: accepted.map((item) =>
        item.sender._id.equals(userId) ? item.receiver : item.sender
      ),
      receivedRequests: received,
      sentRequests: sent,
    });
  } catch (error) {
    console.error("Get connections failed:", error.message);
    return res.status(500).json({
      message: "Could not load connections",
    });
  }
}
