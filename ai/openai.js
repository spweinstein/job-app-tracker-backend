import OpenAI from "openai";

let client;

export function getOpenAIClient() {
  if (!client) {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      throw new Error("OPENAI_API_KEY is not set");
    }

    client = new OpenAI({ apiKey });
  }

  return client;
}

export async function callResponses({
  model,
  previousResponseId,
  instructions,
  input,
  tools = null,
  toolOutputs = null,  // Add tool_outputs parameter
}) {
  const openai = getOpenAIClient();

  const payload = {
    model: model || process.env.OPENAI_MODEL || "gpt-4.1-mini",
    input,
    instructions,
  };

  if (previousResponseId) {
    payload.previous_response_id = previousResponseId;
  }

  // Add tools if provided
  if (tools && tools.length > 0) {
    payload.tools = tools;
  }

  // Add tool outputs if provided (for continuing after tool calls)
  if (toolOutputs && toolOutputs.length > 0) {
    payload.tool_outputs = toolOutputs;
  }

  const response = await openai.responses.create(payload);

  return response;
}