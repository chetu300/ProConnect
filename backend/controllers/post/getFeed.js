import Post from "../../models/Post.js";

export async function getFeed(req, res) {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const pageSize = 20;
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .populate("author", "name username profileImage headline")
      .populate("likes", "name username profileImage")
      .populate("comments.user", "name username profileImage");

    return res.json({
      posts,
      page,
      hasMore: posts.length === pageSize,
    });
  } catch (error) {
    console.error("Get feed failed:", error.message);
    return res.status(500).json({
      message: "Could not load the feed",
    });
  }
}
