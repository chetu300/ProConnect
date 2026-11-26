import express from "express";
import { signup } from "../controllers/auth/signup.js";
import { login } from "../controllers/auth/login.js";
import { logout } from "../controllers/auth/logout.js";
import { getMe } from "../controllers/auth/getMe.js";
import { googleLogin } from "../controllers/auth/googleLogin.js";
import { protectRoute } from "../middleware/protectRoute.js";
import { authLimiter } from "../middleware/rateLimiters.js";

const router = express.Router();

router.post("/signup", authLimiter, signup);
router.post("/login", authLimiter, login);
router.post("/google", authLimiter, googleLogin);
router.post("/logout", logout);
router.get("/me", protectRoute, getMe);

export default router;
