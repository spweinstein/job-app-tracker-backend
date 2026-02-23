import mongoose from "mongoose";
import Document from "./documentModel.js";

const coverLetterSchema = new mongoose.Schema(
  {
    body: {
      type: String,
      required: true,
    },
    notes: String,
  },
  { timestamps: true },
);

export default Document.discriminator("CoverLetter", coverLetterSchema);
