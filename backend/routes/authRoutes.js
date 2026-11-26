import express from "express";
import { signup } from "../controllers/auth/signup.js";
import { login } from "../controllers/auth/login.js";
import { logout } from "../controllers/auth/logout.js";
import { getMe } from "../controllers/auth/getMe.js";
import { googleLogin } from "../controllers/auth/googleLogin.js";
import { forgotPassword, resetPassword } from "../controllers/auth/passwordReset.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/google", googleLogin);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/logout", logout);
router.get("/me", protectRoute, getMe);

export default router;
