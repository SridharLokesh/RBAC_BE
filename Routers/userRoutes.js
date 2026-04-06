import express from "express";
import {
  getMyDashboards,
  getDashboardById,
  getProfile,
  getTeammates,
} from "../Controllers/userController.js";
import protect from "../Middleware/auth.js";
import authorizeRoles from "../Middleware/role.js";

const router = express.Router();

// All routes protected — User only
router.use(protect, authorizeRoles("user"));

// Dashboard Routes 
router.get("/dashboards", getMyDashboards);
router.get("/dashboards/:id", getDashboardById);

// Profile & Team 
router.get("/profile", getProfile);
router.get("/teammates", getTeammates);

export default router;