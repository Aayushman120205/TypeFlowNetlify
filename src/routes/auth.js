const express = require("express");
const bcrypt = require("bcryptjs");

const User = require("../models/User");
const { sanitizeUser } = require("../lib/serializers");

const router = express.Router();

router.post("/register", async (req, res) => {
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
    return res.status(500).json({ message: "Failed to create account." });
  }
});

router.post("/login", async (req, res) => {
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
    return res.status(500).json({ message: "Failed to sign in." });
  }
});

module.exports = router;
