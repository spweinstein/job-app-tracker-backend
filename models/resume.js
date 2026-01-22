const mongoose = require("mongoose");

const experienceSchema = new mongoose.Schema({
  // user: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "User",
  //   required: true,
  //   index: true,
  // },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
  },
});

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
  },

  notes: String,

  experience: [experienceSchema],
});

module.exports = mongoose.model("Resume", resumeSchema);
