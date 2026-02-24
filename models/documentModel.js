import mongoose from "mongoose";
import paginatePlugin from "../plugins/paginatePlugin.js";

const documentSchema = new mongoose.Schema(
  {
    // Tree structure & metadata
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Document",
      // required: true,
    },
    root: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Document",
      // required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    version: {
      type: String,
    },
    isDraft: {
      type: Boolean,
      default: true,
    },
    name: {
      type: String,
    },
  },
  { timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Children virtual:
documentSchema.virtual("children", {
  ref: "Document",
  localField: "_id",
  foreignField: "parent",
});

documentSchema.plugin(paginatePlugin);

const Document = mongoose.model("Document", documentSchema);


// Methods:

// getParent
// getDescendants
// getAncestors
// getRoot
// getSiblings
// getLineage

export default Document;
