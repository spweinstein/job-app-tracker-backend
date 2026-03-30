import OpenAI from "openai";

/*

From OpenAI documentation:
============================

import OpenAI from "openai";
const client = new OpenAI();

const tools = [
    {
        type: "function",
        name: "get_weather",
        description: "Get current temperature for a given location.",
        parameters: {
            type: "object",
            properties: {
                location: {
                    type: "string",
                    description: "City and country e.g. Bogotá, Colombia",
                },
            },
            required: ["location"],
            additionalProperties: false,
        },
        strict: true,
    },
];

const response = await client.responses.create({
    model: "gpt-5",
    input: [
        { role: "user", content: "What is the weather like in Paris today?" },
    ],
    tools,
});

console.log(response.output[0].to_json());

=============================================



*/

import AIThread from "../models/aiThreadModel.js"; 
import AIMessage from "../models/aiMessageModel.js";

import dotenv from "dotenv";
dotenv.config();


class Chat {
  constructor(
    apiKey=process?.env?.OPENAI_API_KEY, 
    model=process?.env?.OPENAI_MODEL || "gpt-4.1-mini",
    tools=null, 
    threadId=null,
    userId=null,
    scope="GENERAL",
    docType=null,
    documentId=null
  ) {
    this.client = new OpenAI({ apiKey });
    this.model = model;
    this.tools = tools;
    this.userId = userId;
    this.scope = scope;
    this.docType = docType;
    this.documentId = documentId;
    this.threadId = threadId;
    this.fetchThread();
  }

  async fetchThread(){
    if(!this.threadId){
      const {userId, scope, docType, documentId, openaiPreviousResponseId} = this;
      const thread = await AIThread.create({
        userId,
        scope,
        docType,
        documentId,
        openaiPreviousResponseId: null
      });
      this.thread = thread;
    }
    else {
      const thread = await AIThread.findById(this.threadId);
      if(!thread) throw new Error("Thread not found");
      this.thread = thread;
    }
    return this.thread;
  }

  async getLatestMessage(){
    const thread = await AIThread.findById(this.threadId);
    if(!thread) throw new Error("Thread not found");
    const messages = await AIMessage.find({ thread: thread._id }).sort({ createdAt: -1 }).limit(1);
    return messages[0];
  }

  async sendMessage(message, previousResponseId=null) {
    const response = await this.client.responses.create({
      model: this.model,
      messages: [{ role: "user", content: message }],
      tools: this.tools,
      previousResponseId: previousResponseId,
    });
    return response.choices[0].message.content;
  }


}

export default Chat;