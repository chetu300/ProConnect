import express from "express";
import { sendRequest } from "../controllers/connection/sendRequest.js";
import { acceptRequest } from "../controllers/connection/acceptRequest.js";
import { rejectRequest } from "../controllers/connection/rejectRequest.js";
import { getConnections } from "../controllers/connection/getConnections.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.use(protectRoute);
router.get("/", getConnections);
router.post("/:userId/request", sendRequest);
router.patch("/:requestId/accept", acceptRequest);
router.patch("/:requestId/reject", rejectRequest);

export default router;
