'use server';

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function generateNasehatAction() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = "Generate a short, powerful Islamic reminder/nasehat in Indonesian for an Instagram post. Include a headline, a quote (perkataan ulama or hadits summary), and the source. Keep it concise. Format the output as JSON with keys: headline, quote, source.";
    
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
      }
    });
    
    const text = result.response.text();
    return JSON.parse(text || '{}');
  } catch (error) {
    console.error("AI Generation Error:", error);
    throw new Error("Failed to generate nasehat");
  }
}

export async function rewriteNasehatAction(quote: string, tone: 'Tegas' | 'Lembut' | 'Motivasi') {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Rewrite this Islamic quote to be more ${tone} in tone while keeping the essence: "${quote}". Return ONLY the rewritten text.`;
    
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return text.trim();
  } catch (error) {
    console.error("AI Rewrite Error:", error);
    throw new Error("Failed to rewrite nasehat");
  }
}
