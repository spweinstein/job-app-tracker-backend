const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
    index: true,
  },
  name: {
    type: String,
    required: true,
  },
  website: String,
  description: String,
  notes: String,
});

module.exports = mongoose.model("Company", companySchema);
