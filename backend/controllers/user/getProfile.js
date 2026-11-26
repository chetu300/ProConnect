import User from "../../models/User.js";

export async function getProfile(req, res) {
  try {
    const username = req.params.username.toLowerCase();
    const user = await User.findOne({ username }).select(
      "-password -email"
    );

    if (!user) {
      return res.status(404).json({
        message: "Profile not found",
      });
    }

    return res.json(user);
  } catch (error) {
    console.error("Get profile failed:", error.message);
    return res.status(500).json({
      message: "Could not load profile",
    });
  }
}
