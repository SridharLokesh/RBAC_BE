import express from "express";
import {
  createUser,
  getMyUsers,
  updateUser,
  deleteUser,
  createDashboard,
  getMyDashboards,
  updateDashboard,
  deleteDashboard,
} from "../Controllers/managerController.js";
import protect from "../Middleware/auth.js";
import authorizeRoles from "../Middleware/role.js";

const router = express.Router();

// All routes protected — Manager only
router.use(protect, authorizeRoles("manager"));

// User Routes 
router.post("/users", createUser);
router.get("/users", getMyUsers);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

// Dashboard Routes 
router.post("/dashboards", createDashboard);
router.get("/dashboards", getMyDashboards);
router.put("/dashboards/:id", updateDashboard);
router.delete("/dashboards/:id", deleteDashboard);

export default router;