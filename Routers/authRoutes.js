import express from "express";
import {
  registerAdmin,
  login,
  getMe,
} from "../Controllers/authController.js";
import protect from "../Middleware/auth.js";

const router = express.Router();

router.post("/register-admin", registerAdmin);
router.post("/login", login);
router.get("/me", protect, getMe);

export default router;