
import { GoogleGenAI, Type } from "@google/genai";
import { NPC, Case } from "../types.ts";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

export interface InterviewTurn {
  response: string;
  choices: string[];
  recommendedIndex: number; 
}

export const generateInterviewResponse = async (
  currentCase: Case,
  npc: NPC,
  chatHistory: { role: 'user' | 'model'; text: string }[],
  userMessage: string | null 
): Promise<InterviewTurn> => {
  const ai = getClient();
  if (!ai) {
    return {
        response: "Koneksi terputus: Silakan cek API Key.",
        choices: ["Ulangi koneksi.", "Hubungi IT BPK.", "Tunggu sebentar."],
        recommendedIndex: 0
    };
  }

  const systemInstruction = `Role: ${npc.name}, ${npc.role}. Persona: ${npc.personality}. 
Secret Knowledge: ${npc.knowledge}. Strategy: ${npc.defenseStrategy}.

Task: Respond to auditor as ${npc.name}. Be polite but evasive. 

Provide 3 Audit Chat Choices for the user. 
One choice MUST be the most strategic "Audit Strike" that uses evidence (logs/docs) or logical pressure to break the NPC's defense.

Output JSON:
{
  "response": "Text from NPC",
  "choices": ["Choice 1", "Choice 2", "Choice 3"],
  "recommendedIndex": 1
}`;

  try {
    const model = 'gemini-3-flash-preview';
    const prompt = userMessage || "Mari kita bahas temuan saya di lapangan.";

    const result = await ai.models.generateContent({
      model: model,
      contents: [
        ...chatHistory.map(h => ({ role: h.role === 'user' ? 'user' : 'model', parts: [{ text: h.text }] })),
        { role: 'user', parts: [{ text: prompt }] }
      ],
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 0 },
        temperature: 0.7,
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            response: { type: Type.STRING },
            choices: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              minItems: 3,
              maxItems: 3
            },
            recommendedIndex: { type: Type.INTEGER }
          },
          required: ["response", "choices", "recommendedIndex"]
        }
      },
    });

    const data = JSON.parse(result.text || "{}");
    return {
      response: data.response || "Kami sudah serahkan sesuai prosedur.",
      choices: data.choices || ["...", "...", "..."],
      recommendedIndex: data.recommendedIndex ?? 0
    };
  } catch (error) {
    console.error("Gemini Error:", error);
    return {
      response: "Saya sedang koordinasi dengan pimpinan.",
      choices: ["Saya tunggu.", "Ini mendesak.", "Lupakan."],
      recommendedIndex: 1
    };
  }
};
