const mongoose = require("mongoose");
const Session = require("../src/models/Session");

const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/typeflow";

async function connectDB() {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(mongoUri);
}

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader("Access-Control-Allow-Headers", "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  await connectDB();

  if (req.method === "GET") {
    try {
      const { userId } = req.query;
      if (!userId) {
        return res.status(400).json({ message: "userId is required." });
      }

      const sessions = await Session.find({ userId }).sort({ createdAt: 1 }).lean();
      return res.json({ sessions });
    } catch (error) {
      console.error("Get sessions error:", error);
      return res.status(500).json({ message: "Failed to load sessions." });
    }
  }

  if (req.method === "POST") {
    try {
      const { userId, wpm, acc, errors, time, cat, mode, date, challengeKey } = req.body;

      if (!userId) {
        return res.status(400).json({ message: "userId is required." });
      }

      if (typeof wpm !== "number" || typeof acc !== "number") {
        return res.status(400).json({ message: "wpm and acc are required." });
      }

      const session = await Session.create({
        userId,
        wpm,
        acc,
        errorCount: errors || 0,
        time: time || 0,
        cat: cat || "general",
        mode: mode || "practice",
        challengeKey: challengeKey || null,
        createdAtClient: date ? new Date(date) : undefined
      });

      return res.status(201).json({ session });
    } catch (error) {
      console.error("Create session error:", error);
      return res.status(500).json({ message: "Failed to save session." });
    }
  }

  if (req.method === "DELETE") {
    try {
      const { userId } = req.query;
      if (!userId) {
        return res.status(400).json({ message: "userId is required." });
      }

      await Session.deleteMany({ userId });
      return res.json({ ok: true });
    } catch (error) {
      console.error("Delete sessions error:", error);
      return res.status(500).json({ message: "Failed to clear sessions." });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
};
