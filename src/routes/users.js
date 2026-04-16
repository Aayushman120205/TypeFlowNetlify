const express = require("express");

const Session = require("../models/Session");

const router = express.Router();

router.get("/:userId/stats", async (req, res) => {
  try {
    const { userId } = req.params;
    const sessions = await Session.find({ userId }).sort({ createdAt: 1 }).lean();
    return res.json({ sessions });
  } catch (error) {
    return res.status(500).json({ message: "Failed to load user stats." });
  }
});

module.exports = router;
