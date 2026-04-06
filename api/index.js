import app from "../index.js";
import connectDB from "../Database/ConfigDB.js";

export default async function handler(req, res) {
  // ✅ MUST be first — before anything else
  res.setHeader("Access-Control-Allow-Origin", "https://rbac-fe-lime.vercel.app");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // ✅ Handle preflight request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    await connectDB();
    return app(req, res);
  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({ error: error.message });
  }
}