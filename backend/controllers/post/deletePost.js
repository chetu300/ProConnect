import mongoose from "mongoose";
import Post from "../../models/Post.js";

export async function deletePost(req, res) {
  try {
    const { postId } = req.params;

    if (!mongoose.isValidObjectId(postId)) {
      return res.status(400).json({ message: "Invalid post ID" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (!post.author.equals(req.user._id)) {
      return res.status(403).json({
        message: "You can only delete your own posts",
      });
    }

    await post.deleteOne();
    return res.json({ message: "Post deleted" });
  } catch (error) {
    console.error("Delete post failed:", error.message);
    return res.status(500).json({
      message: "Could not delete post",
    });
  }
}
