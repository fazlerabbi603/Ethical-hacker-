
import { Injectable } from '@angular/core';
import { GoogleGenAI, Type } from '@google/genai';

export interface Vulnerability {
  name: string;
  description: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low' | 'Informational';
  recommendation: string;
}

export interface OpenPort {
  port: number;
  service: string;
  status: string;
  description: string;
}

export interface HeaderInfo {
  name: string;
  value: string;
  securityNote: string;
}

export interface ScanResult {
  summary: string;
  vulnerabilities: Vulnerability[];
  openPorts: OpenPort[];
  headers: HeaderInfo[];
}

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

  async analyzeUrl(url: string): Promise<ScanResult> {
    const prompt = `
      Act as a professional ethical hacker and senior security analyst. 
      Perform a simulated, non-intrusive security analysis of the website at the URL: "${url}".
      
      IMPORTANT: Your analysis must be based SOLELY on theoretical knowledge of web technologies, common misconfigurations, and publicly inferable information associated with a typical setup for a site like this. DO NOT perform any actual network requests, port scans, or any form of active attack. Your entire response should be a theoretical assessment.

      Your analysis should cover:
      1.  **Vulnerabilities:** Identify potential common vulnerabilities (e.g., outdated software based on headers, insecure header configurations, potential for XSS/SQLi based on common frameworks).
      2.  **Open Ports:** List common ports that are typically open for a web server and related services (e.g., 80, 443, 22, 3306), and describe their purpose.
      3.  **HTTP Headers:** Analyze common security-related HTTP headers that should be present and identify any that are missing or misconfigured.

      Return the complete analysis strictly in the provided JSON schema format. Ensure all fields are populated with professional and actionable information.
    `;

    const schema = {
      type: Type.OBJECT,
      properties: {
        summary: {
          type: Type.STRING,
          description: "A high-level summary of the theoretical security posture of the target URL, written in a professional tone."
        },
        vulnerabilities: {
          type: Type.ARRAY,
          description: "An array of potential vulnerabilities found.",
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING, description: "The name of the vulnerability (e.g., 'Cross-Site Scripting (XSS)', 'Missing Content Security Policy')." },
              description: { type: Type.STRING, description: "A detailed description of the vulnerability and its potential impact." },
              severity: { type: Type.STRING, description: "The severity level: Critical, High, Medium, Low, or Informational." },
              recommendation: { type: Type.STRING, description: "Actionable steps to mitigate this vulnerability." }
            },
            required: ["name", "description", "severity", "recommendation"]
          }
        },
        openPorts: {
          type: Type.ARRAY,
          description: "An array of commonly associated open ports and services.",
          items: {
            type: Type.OBJECT,
            properties: {
              port: { type: Type.INTEGER, description: "The port number." },
              service: { type: Type.STRING, description: "The common service running on this port (e.g., HTTP, HTTPS, SSH)." },
              status: { type: Type.STRING, description: "The theoretical status, e.g., 'Likely Open'." },
              description: { type: Type.STRING, description: "A brief description of the port's purpose and security implications." }
            },
            required: ["port", "service", "status", "description"]
          }
        },
        headers: {
          type: Type.ARRAY,
          description: "An analysis of important security-related HTTP headers.",
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING, description: "The name of the HTTP header (e.g., 'Strict-Transport-Security')." },
              value: { type: Type.STRING, description: "The observed or recommended value for the header. State 'Not Present' if it is missing." },
              securityNote: { type: Type.STRING, description: "A brief note on the security implication and importance of this header." }
            },
            required: ["name", "value", "securityNote"]
          }
        }
      },
      required: ["summary", "vulnerabilities", "openPorts", "headers"]
    };

    try {
      const response = await this.ai.models.generateContent({
        model: this.model,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: schema,
        },
      });

      const jsonText = response.text.trim();
      return JSON.parse(jsonText) as ScanResult;

    } catch (error) {
      console.error('Error calling Gemini API:', error);
      throw new Error('Failed to get analysis from AI agent. The model may have refused to respond to the prompt.');
    }
  }
}
