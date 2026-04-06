import express from "express";
import {
  createManager,
  getAllManagers,
  updateManager,
  deleteManager,
  createUser,
  getAllUsers,
  updateUser,
  deleteUser,
  createDashboard,
  getAllDashboards,
  updateDashboard,
  deleteDashboard,
} from "../Controllers/adminController.js";
import protect from "../Middleware/auth.js";
import authorizeRoles from "../Middleware/role.js";

const router = express.Router();

// All routes protected — Admin only
router.use(protect, authorizeRoles("admin"));

// ── Manager Routes ──────────────────────────────
router.post("/managers", createManager);
router.get("/managers", getAllManagers);
router.put("/managers/:id", updateManager);
router.delete("/managers/:id", deleteManager);

// ── User Routes ─────────────────────────────────
router.post("/users", createUser);
router.get("/users", getAllUsers);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

// ── Dashboard Routes ────────────────────────────
router.post("/dashboards", createDashboard);
router.get("/dashboards", getAllDashboards);
router.put("/dashboards/:id", updateDashboard);
router.delete("/dashboards/:id", deleteDashboard);

export default router;