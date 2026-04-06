import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectDB from "./Database/ConfigDB.js";
import authRoutes from "./Routers/authRoutes.js";
import adminRoutes from "./Routers/adminRoutes.js";
import managerRoutes from "./Routers/managerRoutes.js";
import userRoutes from "./Routers/userRoutes.js";




const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "RBAC API Running..." });
});

// ── Routes

app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/manager", managerRoutes);
app.use("/user", userRoutes);





//EXPORT APP ONLY
export default app;