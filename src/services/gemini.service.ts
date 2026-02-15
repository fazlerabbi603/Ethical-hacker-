
import { Injectable } from '@angular/core';
import { GoogleGenAI } from '@google/genai';

@Injectable({
  providedIn: 'root',
})
export class GeminiService {
  private readonly ai: GoogleGenAI;
  private readonly model = 'gemini-2.5-flash';

  constructor() {
    // This will not work in a browser environment as `process` is a Node.js global.
    // The Applet environment will polyfill this.
    const apiKey = (process as any).env.API_KEY;
    if (!apiKey) {
      throw new Error('API_KEY environment variable not found.');
    }
    this.ai = new GoogleGenAI({ apiKey });
  }

  async askQuestion(question: string): Promise<string> {
    const systemInstruction = `
      You are a professional Ethical Hacker and Cybersecurity expert AI assistant. 
      Your name is 'EH-Agent'. Your sole purpose is to educate users on cybersecurity concepts, 
      defensive techniques, and ethical hacking principles. You must explain topics in a clear and professional manner.
      
      Under no circumstances will you provide instructions, code, or guidance for performing illegal or malicious hacking activities.
      If a user asks for such information, you must politely refuse and explain that your purpose is to promote cybersecurity and defense, not to facilitate attacks.
      Always prioritize safety, ethics, and the law in your responses.
    `;

    try {
      const response = await this.ai.models.generateContent({
        model: this.model,
        contents: question,
        config: {
          systemInstruction: systemInstruction,
        },
      });

      return response.text;
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      throw new Error('Failed to get a response from the AI agent. The model may have refused to respond to the prompt due to safety policies.');
    }
  }
}
