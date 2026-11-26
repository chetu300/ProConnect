import express from "express";
import { getProfile } from "../controllers/user/getProfile.js";
import { updateProfile } from "../controllers/user/updateProfile.js";
import { getSuggestions } from "../controllers/user/getSuggestions.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/suggestions", protectRoute, getSuggestions);
router.get("/:username", protectRoute, getProfile);
router.patch("/me", protectRoute, updateProfile);

export default router;
