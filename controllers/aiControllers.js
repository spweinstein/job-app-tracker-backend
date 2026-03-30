import mongoose from "mongoose";
import AIThread from "../models/aiThreadModel.js";
import AIMessage from "../models/aiMessageModel.js";
import Resume from "../models/resumeModel.js";
import CoverLetter from "../models/coverLetterModel.js";
import { askInThread } from "../ai/aiEngine.js";
import { getDocumentText } from "../ai/getDocText.js";



function getDocModel(docType) {
  if (docType === "resume") return Resume;
  if (docType === "cover_letter") return CoverLetter;
  return null;
}

export const createThread = async (req, res) => {
    try {
      const { docType, documentId } = req.body || {};
      
      // Determine scope based on provided parameters
      const hasDocument = docType && documentId;
      const hasNeither = !docType && !documentId;
      
      // Invalid: only one provided
      if ((docType && !documentId) || (!docType && documentId)) {
        return res.status(400).json({ 
          error: "Both docType and documentId must be provided together, or both omitted for general chat." 
        });
      }
      
      // GENERAL thread path
      if (hasNeither) {
        // Find or create a single general thread per user
        let thread = await AIThread.findOne({
          userId: req.user._id,
          scope: "GENERAL",
        });
        
        if (!thread) {
          thread = await AIThread.create({
            userId: req.user._id,
            scope: "GENERAL",
            docType: null,
            documentId: null,
            openaiPreviousResponseId: null,
          });
        }
        
        return res.json({
          threadId: thread._id,
          thread,
        });
      }
      
      // DOCUMENT thread path (existing logic)
      if (docType !== "resume" && docType !== "cover_letter") {
        return res.status(400).json({ error: "Invalid docType." });
      }
  
      if (!mongoose.Types.ObjectId.isValid(documentId)) {
        return res.status(400).json({ error: "Invalid documentId." });
      }
  
      const Model = getDocModel(docType);
      if (!Model) {
        return res.status(400).json({ error: "Unsupported docType." });
      }
  
      const document = await Model.findOne({
        _id: documentId,
        owner: req.user._id,
      }).select("_id owner");
  
      if (!document) {
        return res.status(404).json({ error: "Document not found." });
      }
  
      let thread = await AIThread.findOne({
        userId: req.user._id,
        scope: "DOCUMENT",
        documentId: document._id,
      });
  
      if (!thread) {
        thread = await AIThread.create({
          userId: req.user._id,
          scope: "DOCUMENT",
          docType,
          documentId: document._id,
          openaiPreviousResponseId: null,
        });
      } else if (!thread.docType) {
        thread.docType = docType;
        await thread.save();
      }
  
      return res.json({
        threadId: thread._id,
        thread,
      });
    } catch (error) {
      console.error("Error at createThread:", error);
      return res.status(500).json({ error: error.message });
    }
  };

export const getThread = async (req, res) => {
  try {
    const { threadId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(threadId)) {
      return res.status(400).json({ error: "Invalid threadId." });
    }

    const thread = await AIThread.findOne({
      _id: threadId,
      userId: req.user._id,
    });

    if (!thread) {
      return res.status(404).json({ error: "Thread not found." });
    }

    return res.json({ thread });
  } catch (error) {
    console.error("Error at getThread:", error);
    return res.status(500).json({ error: error.message });
  }
};

export const getThreads = async (req, res) => {
    // paginate
    try {
    const result = await AIThread.paginate(req, { userId: req.user._id }, {
      populate: ["document"],
    });

    return res.json(result);
  } catch (error) {
    console.error("Error at getThreads:", error);
    return res.status(500).json({ error: error.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { threadId } = req.params;
    const { cursor, limit: rawLimit } = req.query;

    if (!mongoose.Types.ObjectId.isValid(threadId)) {
      return res.status(400).json({ error: "Invalid threadId." });
    }

    const thread = await AIThread.findOne({
      _id: threadId,
      userId: req.user._id,
    });

    if (!thread) {
      return res.status(404).json({ error: "Thread not found." });
    }

    const limit = Math.min(parseInt(rawLimit, 10) || 25, 100);
    const query = { threadId: thread._id };

    if (cursor) {
      if (!mongoose.Types.ObjectId.isValid(cursor)) {
        return res.status(400).json({ error: "Invalid cursor." });
      }

      const cursorMessage = await AIMessage.findOne({
        _id: cursor,
        threadId: thread._id,
      }).select("_id createdAt");

      if (!cursorMessage) {
        return res.status(400).json({ error: "Cursor not found for thread." });
      }

      query.$or = [
        { createdAt: { $gt: cursorMessage.createdAt } },
        {
          createdAt: cursorMessage.createdAt,
          _id: { $gt: cursorMessage._id },
        },
      ];
    }

    const messages = await AIMessage.find(query)
      .sort({ createdAt: 1, _id: 1 })
      .limit(limit + 1);

    let nextCursor = null;
    if (messages.length > limit) {
      const nextMessage = messages.pop();
      nextCursor = nextMessage._id.toString();
    }

    return res.json({
      messages,
      nextCursor,
    });
  } catch (error) {
    console.error("Error at getMessages:", error);
    return res.status(500).json({ error: error.message });
  }
};

export const postMessage = async (req, res) => {
    try {
      const { threadId } = req.params;
      const { text } = req.body || {};
  
      if (!mongoose.Types.ObjectId.isValid(threadId)) {
        return res.status(400).json({ error: "Invalid threadId." });
      }
  
      if (!text || typeof text !== "string" || text.trim().length === 0) {
        return res.status(400).json({ error: "Text is required." });
      }
  
      const thread = await AIThread.findOne({
        _id: threadId,
        userId: req.user._id,
      });
  
      if (!thread) {
        return res.status(404).json({ error: "Thread not found." });
      }
  
      // Create user message
      const userMessage = await AIMessage.create({
        threadId: thread._id,
        userId: req.user._id,
        role: "user",
        mode: "ASK",
        text: text.trim(),
        artifacts: null,
        openaiResponseId: null,
      });
  
      let assistantText;
      let openaiResponseId = null;
  
      // Handle DOCUMENT vs GENERAL threads
      if (thread.scope === "DOCUMENT") {
        if (!thread.documentId || !thread.docType) {
          return res.status(400).json({ error: "Thread is missing document data." });
        }
  
        const Model = getDocModel(thread.docType);
        if (!Model) {
          return res.status(400).json({ error: "Unsupported docType on thread." });
        }
  
        const document = await Model.findOne({
          _id: thread.documentId,
          owner: req.user._id,
        });
  
        if (!document) {
          return res.status(404).json({ error: "Document not found." });
        }
  
        const docText = getDocumentText(document);
  
        try {
          const result = await askInThread({
            thread,
            docText,
            userText: text.trim(),
            userId: req.user._id,
            isGeneral: false,
            enableTools: true,
          });
          assistantText = result.assistantText || "";
          openaiResponseId = result.openaiResponseId || null;
        } catch (error) {
          console.error("Error calling OpenAI in postMessage:", error);
          return res
            .status(500)
            .json({ error: "Failed to generate AI response." });
        }
      } else if (thread.scope === "GENERAL") {
        try {
          const result = await askInThread({
            thread,
            docText: null,
            userText: text.trim(),
            userId: req.user._id,
            isGeneral: true,
            enableTools: true,
          });
          assistantText = result.assistantText || "";
          openaiResponseId = result.openaiResponseId || null;
        } catch (error) {
          console.error("Error calling OpenAI in postMessage:", error);
          return res
            .status(500)
            .json({ error: "Failed to generate AI response." });
        }
      } else {
        return res.status(400).json({ error: "Invalid thread scope." });
      }
  
      // Create assistant message
      const assistantMessage = await AIMessage.create({
        threadId: thread._id,
        userId: req.user._id,
        role: "assistant",
        mode: "ASK",
        text: assistantText || "Sorry — something went wrong generating a response.",
        artifacts: null,
        openaiResponseId,
      });
  
      // Update thread with latest response ID
      if (openaiResponseId) {
        thread.openaiPreviousResponseId = openaiResponseId;
        await thread.save();
      }
  
      return res.status(201).json({
        userMessage,
        assistantMessage,
      });
    } catch (error) {
      console.error("Error at postMessage:", error);
      return res.status(500).json({ error: error.message });
    }
  };