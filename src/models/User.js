const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 20
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true
    },
    passwordHash: {
      type: String,
      required: true
    },
    avatar: {
      bg: String,
      border: String,
      text: String
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("User", userSchema);
