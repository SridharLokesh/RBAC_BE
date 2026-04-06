import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import authRoutes from "./Routers/authRoutes.js";
import adminRoutes from "./Routers/adminRoutes.js";
import managerRoutes from "./Routers/managerRoutes.js";
import userRoutes from "./Routers/userRoutes.js";

const app = express();

// ── CORS — must be before all routes
app.use(cors({
  origin: "https://rbac-fe-lime.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

// ── Handle ALL preflight OPTIONS requests
app.options("*", cors({
  origin: "https://rbac-fe-lime.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "RBAC API Running..." });
});

// ── Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/manager", managerRoutes);
app.use("/api/user", userRoutes);

export default app;