import mongoose from "mongoose";

const aiMessageSchema = new mongoose.Schema(
  {
    threadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AIThread",
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },
    mode: {
      type: String,
      enum: ["ASK", "REVIEW", "DRAFT"],
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    artifacts: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    openaiResponseId: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

aiMessageSchema.index({ threadId: 1, createdAt: 1 });

const AIMessage = mongoose.model("AIMessage", aiMessageSchema);

export default AIMessage;

