import mongoose from "mongoose";

const aiThreadSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    scope: {
      type: String,
      enum: ["DOCUMENT", "GENERAL"],
      default: "DOCUMENT",
      required: true,
    },
    docType: {
      type: String,
      enum: ["resume", "cover_letter"],
      default: null,
    },
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Document",
      default: null,
      index: true,
    },
    openaiPreviousResponseId: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// Validation enforcing relationship between scope, documentId, and docType
aiThreadSchema.pre("validate", function () {
    if (this.scope === "DOCUMENT") {
      if (!this.documentId) {
        throw new Error("documentId is required when scope is DOCUMENT");
      }
      if (!this.docType) {
        throw new Error("docType is required when scope is DOCUMENT");
      }
    }
  
    if (this.scope === "GENERAL") {
      this.documentId = null;
      this.docType = null;
    }
  });

// Compound index for faster lookups
aiThreadSchema.index(
  { userId: 1, scope: 1, documentId: 1 },
  {
    unique: true,
    partialFilterExpression: { scope: "DOCUMENT" },
  },
);

const AIThread = mongoose.model("AIThread", aiThreadSchema);

export default AIThread;

