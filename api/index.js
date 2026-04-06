import app from "../index.js";
import connectDB from "../Database/ConfigDB.js";

export default async function handler(req, res) {
  // MUST be FIRST — before anything else
  res.setHeader("Access-Control-Allow-Origin", "*");;
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Handle preflight request immediately
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    await connectDB();
    return app(req, res);
  } catch (error) {
    console.error("SERVER ERROR:", error);
    return res.status(500).json({ error: error.message });
  }
}