import express from "express";
import {
  createTeamProject,
  getTeamProjects,
  requestToJoinProject,
  reviewJoinRequest,
  updateTeamProject,
  deleteTeamProject,
  updateTeamProjectStatus,
} from "../controllers/teamup/teamProjects.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.use(protectRoute);
router.get("/", getTeamProjects);
router.post("/", createTeamProject);
router.post("/:projectId/requests", requestToJoinProject);
router.patch("/:projectId", updateTeamProject);
router.delete("/:projectId", deleteTeamProject);
router.patch("/:projectId/status", updateTeamProjectStatus);
router.patch("/:projectId/requests/:requestId", reviewJoinRequest);

export default router;
