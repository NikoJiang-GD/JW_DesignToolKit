
import { GoogleGenAI, Type } from "@google/genai";
import { EmotionPoint, AIAnalysis } from "../types";

export const analyzeEmotionCurve = async (points: EmotionPoint[]): Promise<AIAnalysis> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const pointsSummary = points
    .sort((a, b) => a.time - b.time)
    .map(p => `Time: ${p.time}, Event: ${p.event}, Intensity: ${p.intensity}, Emoji: ${p.emoji}`)
    .join('\n');

  const prompt = `
    As an expert game designer, analyze the following player emotion curve for a game sequence:
    ${pointsSummary}

    Evaluate the pacing (Koster's Theory of Fun, flow state). 
    Check for:
    1. "The Peak-End Rule" (Is the climax strong and the ending satisfying?).
    2. Emotional variety (Is it too flat or too chaotic?).
    3. Tension/Release cycles.

    Provide feedback in JSON format.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          pacingFeedback: { type: Type.STRING },
          suggestions: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["summary", "pacingFeedback", "suggestions"]
      }
    }
  });

  return JSON.parse(response.text);
};
