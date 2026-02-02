const Activity = require("./activity.js");
const mongoose = require("mongoose");

const Interview = Activity.discriminator(
  "Interview",
  new mongoose.Schema({
    interviewers: [String],
    interviewType: { type: String, enum: ["Phone", "Video", "Onsite"] },
  }),
);

module.exports = Interview;
