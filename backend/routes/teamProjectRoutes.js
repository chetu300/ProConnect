import express from "express";
import {
  createTeamProject,
  getTeamProjects,
  requestToJoinProject,
  reviewJoinRequest,
  updateTeamProjectStatus,
} from "../controllers/teamup/teamProjects.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.use(protectRoute);
router.get("/", getTeamProjects);
router.post("/", createTeamProject);
router.post("/:projectId/requests", requestToJoinProject);
router.patch("/:projectId/status", updateTeamProjectStatus);
router.patch("/:projectId/requests/:requestId", reviewJoinRequest);

export default router;
