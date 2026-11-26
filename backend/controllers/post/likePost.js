import mongoose from "mongoose";
import Post from "../../models/Post.js";
import { createNotification } from "../../utils/createNotification.js";

export async function likePost(req, res) {
  try {
    if (!mongoose.isValidObjectId(req.params.postId)) {
      return res.status(400).json({ message: "Invalid post ID" });
    }

    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const userId = req.user._id;
    const alreadyLiked = post.likes.some(
      (likedUser) => likedUser.equals(userId)
    );

    if (alreadyLiked) {
      post.likes.pull(userId);
    } else {
      post.likes.push(userId);

      if (!post.author.equals(userId)) {
        await createNotification(req.app.get("io"), {
          recipient: post.author,
          sender: userId,
          type: "like",
          message: `${req.user.name} liked your post`,
          relatedPost: post._id,
        });
      }
    }

    await post.save();
    await post.populate("likes", "name username profileImage");

    return res.json({
      liked: !alreadyLiked,
      likes: post.likes,
    });
  } catch (error) {
    console.error("Like post failed:", error.message);
    return res.status(500).json({
      message: "Could not update post like",
    });
  }
}
