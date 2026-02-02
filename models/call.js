const Activity = require("./activity.js");
const mongoose = require("mongoose");

const Call = Activity.discriminator(
  "Call",
  new mongoose.Schema({
    phoneNumber: String,
    duration: Number, // minutes
    outcome: String,
  }),
);

module.exports = Call;
