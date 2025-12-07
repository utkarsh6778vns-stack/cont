import { GoogleGenAI, Type } from "@google/genai";
import { PitchFormData, GeneratedEmail } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generatePitchEmail = async (formData: PitchFormData): Promise<GeneratedEmail> => {
  const modelId = "gemini-2.5-flash";

  const prompt = `
    You are an expert sales copywriter and technical consultant specializing in web development and artificial intelligence solutions.
    
    Task: Write a cold outreach email to a potential client proposing to build/redesign their website and integrate custom AI solutions.
    
    Context Details:
    - Recipient Name: ${formData.recipientName}
    - Recipient Company: ${formData.recipientCompany}
    - Recipient Website (if known): ${formData.recipientWebsite || "Not specified"}
    - Sender Name: ${formData.senderName}
    - Sender Portfolio/Agency: ${formData.senderPortfolio || "Not specified"}
    - Specific Focus/Value Prop: ${formData.specificFocus}
    - Tone: ${formData.tone}

    Guidelines:
    1. The email must be engaging, concise, and value-driven.
    2. Focus on how a modern website combined with AI (chatbots, automation, personalization) can increase their revenue or save time.
    3. Include a catchy Subject Line.
    4. The email body must be formatted with distinct paragraphs. Use double line breaks (\\n\\n) to separate paragraphs so the spacing is clear.
    
    Output Format:
    Return the response in JSON format with "subject" and "body" fields.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            subject: { type: Type.STRING },
            body: { type: Type.STRING },
          },
          required: ["subject", "body"],
        },
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as GeneratedEmail;
    }
    
    throw new Error("No content generated.");
  } catch (error) {
    console.error("Error generating email:", error);
    throw new Error("Failed to generate email. Please check your API key and try again.");
  }
};