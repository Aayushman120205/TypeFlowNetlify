const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../src/models/User");
const { sanitizeUser } = require("../src/lib/serializers");

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

  if (req.method === "POST") {
    const { action } = req.query;

    if (action === "register") {
      try {
        const { name, email, password, avatar } = req.body;

        if (!name || name.trim().length < 3 || name.trim().length > 20) {
          return res.status(400).json({ message: "Name must be 3-20 characters." });
        }

        if (!email || !/\S+@\S+\.\S+/.test(email)) {
          return res.status(400).json({ message: "A valid email is required." });
        }

        if (!password || password.length < 8) {
          return res.status(400).json({ message: "Password must be at least 8 characters." });
        }

        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
          return res.status(409).json({ message: "Email already in use." });
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const user = await User.create({
          name: name.trim(),
          email: email.toLowerCase(),
          passwordHash,
          avatar: avatar || {}
        });

        return res.status(201).json({ user: sanitizeUser(user) });
      } catch (error) {
        console.error("Register error:", error);
        return res.status(500).json({ message: "Failed to create account." });
      }
    }

    if (action === "login") {
      try {
        const { user: userInput, password } = req.body;

        if (!userInput || !password) {
          return res.status(400).json({ message: "Username/email and password are required." });
        }

        const user = await User.findOne({
          $or: [{ email: userInput.toLowerCase() }, { name: userInput }]
        });

        if (!user) {
          return res.status(404).json({ message: "No account found with that username." });
        }

        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) {
          return res.status(401).json({ message: "Incorrect password." });
        }

        return res.json({ user: sanitizeUser(user) });
      } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ message: "Failed to sign in." });
      }
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
};
