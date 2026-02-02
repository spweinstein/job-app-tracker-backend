const User = require("./user.js");
const Company = require("./company.js");
const JobApp = require("./jobApp.js");
const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  },
  jobApp: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "JobApp",
    required: true,
  },
  startAt: {
    type: Date,
    required: true,
  },
  endAt: Date,
  state: {
    type: String,
    enum: ["Planned", "Done", "Canceled"],
  },
  title: {
    type: String,
    required: true,
  },
  description: String,
  notes: String,
});

const Activity = mongoose.model("Activity", activitySchema);

// Discriminator models - add type-specific fields

// const Email = Activity.discriminator(
//   "Email",
//   new Schema({
//     subject: String,
//     recipient: String,
//     ccRecipients: [String],
//     attachments: [String],
//   }),
// );

// const Call = Activity.discriminator(
//   "Call",
//   new Schema({
//     phoneNumber: String,
//     duration: Number, // minutes
//     outcome: String,
//   }),
// );

module.exports = Activity;
