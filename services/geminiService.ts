
import { GoogleGenAI, Type } from "@google/genai";
import type { FormulaResponse } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const formulaSchema = {
  type: Type.OBJECT,
  properties: {
    formula: {
      type: Type.STRING,
      description: "The generated Excel or Google Sheets formula, starting with an '=' sign."
    },
    explanation: {
      type: Type.STRING,
      description: "A clear, step-by-step explanation of how the formula works. Use bullet points for complex formulas."
    }
  },
  required: ['formula', 'explanation']
};


export const generateFormula = async (prompt: string): Promise<FormulaResponse> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate an Excel formula for the following task: ${prompt}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: formulaSchema,
        systemInstruction: "You are an expert in Microsoft Excel and Google Sheets. Your task is to generate a formula based on a user's description. You must return the response in a JSON format with two keys: 'formula' and 'explanation'. The 'formula' key should contain only the formula, starting with an '=' sign. The 'explanation' key should provide a clear, step-by-step explanation of how the formula works.",
      }
    });
    
    const jsonText = response.text.trim();
    if (!jsonText) {
      throw new Error("Received an empty response from the API.");
    }
    
    const parsedResponse = JSON.parse(jsonText);

    if (parsedResponse && typeof parsedResponse.formula === 'string' && typeof parsedResponse.explanation === 'string') {
      return parsedResponse as FormulaResponse;
    } else {
      throw new Error("Invalid JSON structure received from the API.");
    }

  } catch (error) {
    console.error("Error generating formula:", error);
    if (error instanceof Error && error.message.includes('json')) {
         throw new Error("Failed to parse the response from the AI. Please try again.");
    }
    throw new Error("An error occurred while communicating with the AI. Please check your connection and try again.");
  }
};
