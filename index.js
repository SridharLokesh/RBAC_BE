import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectDB from "./Database/Configdb.js";
import authRoutes from "./Routers/authRoutes.js";
import adminRoutes from "./Routers/adminRoutes.js";
import managerRoutes from "./Routers/managerRoutes.js";
import userRoutes from "./Routers/userRoutes.js";

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "RBAC API Running..." });
});

// ── Routes ──────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/manager", managerRoutes);
app.use("/api/user", userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});