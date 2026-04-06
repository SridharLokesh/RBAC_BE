import app from "../index.js";
import connectDB from "../Database/ConfigDB.js";

export default async function handler(req, res) {
  try {
    // Connect DB per request (safe for serverless)
    await connectDB();

    return app(req, res);
  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({ error: error.message });
  }
}