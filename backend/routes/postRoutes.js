import express from "express";
import { createPost } from "../controllers/post/createPost.js";
import { getFeed } from "../controllers/post/getFeed.js";
import { likePost } from "../controllers/post/likePost.js";
import { commentPost } from "../controllers/post/commentPost.js";
import { deletePost } from "../controllers/post/deletePost.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.use(protectRoute);
router.get("/", getFeed);
router.post("/", createPost);
router.post("/:postId/like", likePost);
router.post("/:postId/comments", commentPost);
router.delete("/:postId", deletePost);

export default router;
