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

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await connectDB();

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
    console.error("Leaderboard error:", error);
    return res.status(500).json({ message: "Failed to load leaderboard." });
  }
};
