const express = require("express");

const Session = require("../models/Session");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ message: "userId is required." });
    }

    const sessions = await Session.find({ userId }).sort({ createdAt: 1 }).lean();
    return res.json({ sessions });
  } catch (error) {
    return res.status(500).json({ message: "Failed to load sessions." });
  }
});

router.post("/", async (req, res) => {
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
    return res.status(500).json({ message: "Failed to save session." });
  }
});

router.delete("/", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ message: "userId is required." });
    }

    await Session.deleteMany({ userId });
    return res.json({ ok: true });
  } catch (error) {
    return res.status(500).json({ message: "Failed to clear sessions." });
  }
});

module.exports = router;
