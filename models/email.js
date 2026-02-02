const Activity = require("./activity.js");
const mongoose = require("mongoose");

const Email = Activity.discriminator(
  "Email",
  new mongoose.Schema({
    subject: String,
    recipient: String,
    ccRecipients: [String],
    attachments: [String],
  }),
);

module.exports = Email;
