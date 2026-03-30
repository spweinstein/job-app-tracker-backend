// Update askInThread to handle tool calling

import { getSystemPrompt, getAskPrompt, getGeneralSystemPrompt, getGeneralAskPrompt } from "./prompts.js";
import { callResponses } from "./openai.js";
import { TOOL_DEFINITIONS } from "./tools.js";
import { executeTool } from "./toolHandlers.js";

export function extractAssistantText(openaiResponse) {
  if (!openaiResponse) return "";
  
  try {
    const text = openaiResponse.output?.[0]?.content?.[0]?.text;
    if (text) return text;
  } catch (e) {
    console.log(`Error extracting assistant text: ${e}`);
  }
  
  return openaiResponse.output_text || "";
}

/**
 * Extract tool calls from OpenAI response
 */
export function extractToolCalls(openaiResponse) {
    try {
      const toolCalls = openaiResponse.output?.[0]?.content?.filter(
        item => item.type === "tool_call"
      ) || [];
      
      return toolCalls.map(call => {
        // Parse arguments - they might be a string or already an object
        let args = {};
        if (call.arguments) {
          if (typeof call.arguments === 'string') {
            try {
              args = JSON.parse(call.arguments);
            } catch (e) {
              console.error('Error parsing tool call arguments:', e);
              args = {};
            }
          } else {
            args = call.arguments;
          }
        }
        
        return {
          id: call.id,
          name: call.name,
          arguments: args
        };
      });
    } catch (e) {
      console.log(`Error extracting tool calls: ${e}`);
      return [];
    }
  }

export async function askInThread({ 
    thread, 
    docText, 
    userText, 
    model, 
    isGeneral = false,
    userId,
    enableTools = true
  }) {
    let instructions;
    let input;
    
    if (isGeneral || !docText) {
      instructions = [getGeneralSystemPrompt(), getGeneralAskPrompt()].join("\n\n");
      input = `User Question:\n${userText}`;
    } else {
      instructions = [getSystemPrompt(), getAskPrompt()].join("\n\n");
      const safeDocText = docText.trim() || "(No document content available.)";
      input = `Document Context:\n${safeDocText}\n\nUser Question:\n${userText}`;
    }
    
    // const tools = (enableTools && (isGeneral || !docText)) ? TOOL_DEFINITIONS : null;
    // console.log(tools)
    
    let response = await callResponses({
      model,
      previousResponseId: thread?.openaiPreviousResponseId || null,
      instructions,
      input,
      tools: TOOL_DEFINITIONS,
    });
    
    // Handle tool calls in a loop
    const maxToolIterations = 5;
    let iteration = 0;
    
    while (iteration < maxToolIterations) {
      const toolCalls = extractToolCalls(response);
      
      if (toolCalls.length === 0) {
        // No more tool calls, return the final response
        break;
      }
      
      // Execute all tool calls in parallel
      const toolOutputs = await Promise.all(
        toolCalls.map(async (toolCall) => {
          try {
            // Parse arguments if they're a string
            const args = typeof toolCall.arguments === 'string' 
              ? JSON.parse(toolCall.arguments) 
              : toolCall.arguments;
            
            const result = await executeTool(toolCall.name, args, userId);
            
            // Return in the format expected by OpenAI Responses API
            return {
              tool_call_id: toolCall.id,
              output: JSON.stringify(result)  // Use 'output' not 'content'
            };
          } catch (error) {
            console.error(`Error executing tool ${toolCall.name}:`, error);
            return {
              tool_call_id: toolCall.id,
              output: JSON.stringify({ error: error.message })
            };
          }
        })
      );
      
      // Continue the conversation with tool outputs
      // Don't pass new input - the API will continue from the previous response
      response = await callResponses({
        model,
        previousResponseId: response.id,
        instructions,
        input: "",  // Empty input - tool outputs are what matter here
        tools,
        toolOutputs,  // Pass tool outputs in the correct format
      });
      
      iteration++;
    }
    
    return {
      assistantText: extractAssistantText(response),
      openaiResponseId: response.id,
    };
  }