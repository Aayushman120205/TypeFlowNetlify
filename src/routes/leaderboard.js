const express = require("express");

const Session = require("../models/Session");

const router = express.Router();

router.get("/", async (_req, res) => {
  try {
    const leaderboard = await Session.aggregate([
      {
        $group: {
          _id: "$userId",
          bestWpm: { $max: "$wpm" },
          bestAcc: { $max: "$acc" },
          totalSessions: { $sum: 1 },
          latestSessionAt: { $max: "$createdAt" }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user"
        }
      },
      {
        $unwind: "$user"
      },
      {
        $sort: {
          bestWpm: -1,
          bestAcc: -1,
          latestSessionAt: -1
        }
      },
      {
        $limit: 50
      }
    ]);

    const rows = leaderboard.map((entry, index) => ({
      rank: index + 1,
      userId: entry._id.toString(),
      name: entry.user.name,
      initials: entry.user.name.slice(0, 2).toUpperCase(),
      country: "—",
      wpm: entry.bestWpm,
      acc: entry.bestAcc,
      streak: `${entry.totalSessions}x`,
      tags: entry.totalSessions >= 10 ? ["Consistent"] : [],
      avBg: entry.user.avatar?.bg || "",
      avBorder: entry.user.avatar?.border || "",
      avText: entry.user.avatar?.text || ""
    }));

    return res.json({ leaderboard: rows });
  } catch (error) {
    return res.status(500).json({ message: "Failed to load leaderboard." });
  }
});

module.exports = router;
