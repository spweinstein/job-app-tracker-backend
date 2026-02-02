const Activity = require("./activity.js");
const mongoose = require("mongoose");

const Task = Activity.discriminator(
  "Task",
  new mongoose.Schema({
    priority: { type: String, enum: ["Low", "Medium", "High"] },
    dueDate: Date,
  }),
);

module.exports = Task;
