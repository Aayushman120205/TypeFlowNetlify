const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    wpm: {
      type: Number,
      required: true,
      min: 0
    },
    acc: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    errorCount: {
      type: Number,
      default: 0,
      min: 0
    },
    time: {
      type: Number,
      default: 0,
      min: 0
    },
    cat: {
      type: String,
      default: "general"
    },
    mode: {
      type: String,
      default: "practice"
    },
    challengeKey: {
      type: String,
      default: null
    },
    createdAtClient: Date
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Session", sessionSchema);
