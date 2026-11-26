import express from "express";
import { sendMessage } from "../controllers/message/sendMessage.js";
import { getMessages } from "../controllers/message/getMessages.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.use(protectRoute);
router.get("/:userId", getMessages);
router.post("/:userId", sendMessage);

export default router;
