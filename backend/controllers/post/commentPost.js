import mongoose from "mongoose";
import Post from "../../models/Post.js";
import { createNotification } from "../../utils/createNotification.js";

export async function commentPost(req, res) {
  try {
    const { postId } = req.params;
    const text = req.body.text?.trim();

    if (!mongoose.isValidObjectId(postId)) {
      return res.status(400).json({ message: "Invalid post ID" });
    }

    if (!text) {
      return res.status(400).json({
        message: "Comment text is required",
      });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    post.comments.push({
      user: req.user._id,
      text,
    });

    if (!post.author.equals(req.user._id)) {
      await createNotification(req.app.get("io"), {
        recipient: post.author,
        sender: req.user._id,
        type: "comment",
        message: `${req.user.name} commented on your post`,
        relatedPost: post._id,
      });
    }

    await post.save();
    await post.populate("comments.user", "name username profileImage");

    return res.status(201).json(post.comments.at(-1));
  } catch (error) {
    console.error("Comment on post failed:", error.message);
    return res.status(500).json({
      message: "Could not add comment",
    });
  }
}
