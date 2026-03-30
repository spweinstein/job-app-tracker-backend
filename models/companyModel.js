import mongoose from "mongoose";
import paginatePlugin from "../plugins/paginatePlugin.js";

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    description: {
      type: String,
    },

    url: String,
    notes: String,
  },
  { timestamps: true },
);

companySchema.plugin(paginatePlugin);

export default mongoose.model("Company", companySchema);
