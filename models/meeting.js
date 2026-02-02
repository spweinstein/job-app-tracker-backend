const Activity = require("./activity.js");
const mongoose = require("mongoose");

const Meeting = Activity.discriminator(
  "Meeting",
  new mongoose.Schema({
    attendees: [String],
    meetingType: {
      type: String,
      enum: ["Coffee Chat", "Info Interview", "Networking Event"],
    },
  }),
);

module.exports = Meeting;
