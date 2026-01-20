const mongoose = require("mongoose");
const jobAppSchema = require("./jobApp.js");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  //   applications: [applicationSchema],
});

module.exports = mongoose.model("User", userSchema);
