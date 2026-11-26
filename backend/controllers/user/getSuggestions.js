import Connection from "../../models/Connection.js";
import User from "../../models/User.js";

export async function getSuggestions(req, res) {
  try {
    const currentUserId = req.user._id;
    const existingConnections = await Connection.find({
      $or: [
        { sender: currentUserId },
        { receiver: currentUserId },
      ],
    }).select("sender receiver");

    const excludedIds = new Set([currentUserId.toString()]);
    for (const connection of existingConnections) {
      excludedIds.add(connection.sender.toString());
      excludedIds.add(connection.receiver.toString());
    }

    const users = await User.find({
      _id: { $nin: [...excludedIds] },
    })
      .select("name username headline profileImage")
      .limit(20);

    return res.json(users);
  } catch (error) {
    console.error("Get suggestions failed:", error.message);
    return res.status(500).json({
      message: "Could not load suggested users",
    });
  }
}
