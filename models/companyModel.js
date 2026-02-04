import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  description: {
    type: String,
  },

  url: String,
  description: String,
  notes: String,
});

export default mongoose.model("Company", companySchema);
