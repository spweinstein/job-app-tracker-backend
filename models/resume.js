const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },

  name: {
    type: String,
    required: true,
  },

  link: {
    type: String,
    required: true,
  },

  notes: String,
});

module.exports = mongoose.model("Resume", resumeSchema);
