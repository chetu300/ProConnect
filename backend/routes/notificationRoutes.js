import express from "express";
import { getNotifications } from "../controllers/notification/getNotifications.js";
import { markAsRead } from "../controllers/notification/markAsRead.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.use(protectRoute);
router.get("/", getNotifications);
router.patch("/:notificationId/read", markAsRead);

export default router;
