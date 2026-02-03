const mongoose = require("mongoose");

const resumeTailorMessageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ["user", "assistant", "system"],
    required: true,
  },

  content: {
    type: String,
    required: true,
  },
});

const resumeTailorSessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true,
    ref: "User",
  },

  resume: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true,
    ref: "Resume",
  },

  jobApp: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: "jobApp",
  },

  instructions: String,

  jobDescription: String,

  type: {
    type: String,
    enum: ["job-tailored", "general-customization"],
  },

  status: {
    type: String,
    enum: ["draft", "accepted", "rejected", "failed"],
  },

  messages: {
    type: [resumeTailorMessageSchema],
  },

  changeSummary: String,
});

module.exports = mongoose.model(
  "ResumeTailorSession",
  resumeTailorSessionSchema,
);
