
import { GoogleGenAI, Type } from "@google/genai";
import { Task, Language } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const getLangName = (lang: Language) => {
  if (lang === 'uz') return "Uzbek (o'zbek tili)";
  if (lang === 'ru') return "Russian (русский язык)";
  return "English";
};

// Generate productivity insights based on task list
export async function getProductivityInsights(tasks: Task[], lang: Language) {
  if (tasks.length === 0) return [];

  const taskSummary = tasks
    .slice(-20)
    .map(t => `- ${t.text} (${t.completed ? 'Done' : 'Pending'}, Date: ${t.date})`)
    .join('\n');
  
  const targetLang = getLangName(lang);
  const prompt = `You are a professional productivity coach. Analyze the user's task history:
  ${taskSummary}

  Provide 3 specific and practical tips to improve their performance. 
  MANDATORY: You must write all titles and content in ${targetLang}.
  Return the response ONLY in the specified JSON format.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              content: { type: Type.STRING },
              type: { type: Type.STRING, enum: ['productivity', 'wellness', 'focus'] }
            },
            required: ["title", "content", "type"]
          }
        }
      }
    });

    return JSON.parse(response.text || '[]');
  } catch (error) {
    console.error("Gemini Insights Error:", error);
    return [];
  }
}

// Chat with AI assistant about current tasks
export async function chatWithAI(query: string, tasks: Task[], lang: Language) {
  const context = tasks
    .filter(t => t.date === new Date().toISOString().split('T')[0])
    .map(t => t.text)
    .join(', ');

  const appLang = getLangName(lang);
  
  // Stronger instruction to follow the language of the user's question
  const prompt = `System: You are an AI Productivity Assistant for the "Kunlik Hisobot" app.
Current App Language Setting: ${appLang}.
User's Today Tasks: ${context || "No tasks planned yet"}.

User Question: "${query}"

Instructions:
1. If the user's question is in a specific language (Uzbek, Russian, or English), respond in THAT SAME language.
2. If the language is unclear, use the current App Language: ${appLang}.
3. Be concise, motivational, and helpful. 
4. Do not use any extra formatting like bolding or stars if not needed.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    return response.text;
  } catch (error) {
    console.error("Chat Error:", error);
    return lang === 'uz' ? "Xatolik yuz berdi." : lang === 'ru' ? "Произошла ошибка." : "An error occurred.";
  }
}

export async function getDailySummary(tasks: Task[], lang: Language) {
  const completed = tasks.filter(t => t.completed).length;
  const total = tasks.length;
  const targetLang = getLangName(lang);
  
  const prompt = `The user completed ${completed} out of ${total} tasks today. 
  Write a very short (1 sentence), sincere and encouraging message in ${targetLang}.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text.trim();
  } catch (error) {
    return "...";
  }
}
