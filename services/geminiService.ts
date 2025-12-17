import { GoogleGenAI, Type } from "@google/genai";
import { CalendarEvent } from "../types";

const apiKey = process.env.API_KEY || ''; // Ensure this is safe in prod
const ai = new GoogleGenAI({ apiKey });

export const generateSmartSchedule = async (prompt: string): Promise<CalendarEvent[]> => {
  if (!apiKey) {
    console.error("API Key is missing");
    return [];
  }

  try {
    const today = new Date().toISOString().split('T')[0];

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate a realistic daily schedule based on this request: "${prompt}". 
      Assume today is ${today}. Return a list of events with realistic start and end times for today.
      Ensure times are in ISO 8601 format (e.g., ${today}T09:00:00).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: "Short title of the event" },
              start: { type: Type.STRING, description: "Start time in ISO format" },
              end: { type: Type.STRING, description: "End time in ISO format" },
              description: { type: Type.STRING, description: "Short description" },
              type: { type: Type.STRING, enum: ["work", "personal", "meeting", "health"] }
            },
            required: ["title", "start", "end", "type"]
          }
        }
      }
    });

    if (response.text) {
      const data = JSON.parse(response.text);
      // Add IDs to the events
      return data.map((event: any, index: number) => ({
        ...event,
        id: `gen-${Date.now()}-${index}`
      }));
    }
    
    return [];
  } catch (error) {
    console.error("Failed to generate schedule:", error);
    throw error;
  }
};