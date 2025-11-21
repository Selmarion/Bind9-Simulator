import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ValidationResult, Language, FileConfig } from "../types";
import { LANGUAGES } from "../translations";

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing");
  }
  return new GoogleGenAI({ apiKey });
};

const MODEL_ID = "gemini-2.5-flash";

// Schema for Validation Response
const validationSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    isValid: { type: Type.BOOLEAN, description: "True if the BIND9 configuration is syntactically correct." },
    errors: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          line: { type: Type.INTEGER, description: "The line number where the error occurred." },
          message: { type: Type.STRING, description: "A clear error message in the requested language explaining the syntax error." },
          severity: { type: Type.STRING, enum: ["error", "warning"], description: "The severity of the issue." },
        },
        required: ["line", "message", "severity"]
      },
      description: "List of syntax errors found."
    },
    generalFeedback: { type: Type.STRING, description: "A brief summary of the configuration status in the requested language." }
  },
  required: ["isValid", "errors", "generalFeedback"]
};

export const validateBindConfig = async (code: string, filename: string, lang: Language): Promise<ValidationResult> => {
  try {
    const ai = getAiClient();
    const languageName = LANGUAGES[lang];
    
    const prompt = `
      You are an experienced Linux system administrator and BIND9 DNS expert.
      Check the following configuration file (${filename}) for syntax and logical errors.
      Strictly follow BIND9 format.
      Respond in ${languageName}.
      
      Code to check:
      \`\`\`
      ${code}
      \`\`\`
    `;

    const response = await ai.models.generateContent({
      model: MODEL_ID,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: validationSchema,
        temperature: 0.1 
      },
    });

    const responseText = response.text;
    if (!responseText) throw new Error("No response from AI");

    return JSON.parse(responseText) as ValidationResult;
  } catch (error) {
    console.error("Validation Error:", error);
    return {
      isValid: false,
      errors: [{ line: 0, message: "Error connecting to AI service.", severity: "error" }],
      generalFeedback: "Failed to execute validation."
    };
  }
};

export const explainBindConfig = async (code: string, filename: string, lang: Language): Promise<string> => {
  try {
    const ai = getAiClient();
    const languageName = LANGUAGES[lang];

    const prompt = `
      You are a network technology teacher. Explain in simple and clear terms in ${languageName},
      what this BIND9 configuration file (${filename}) does.
      Analyze key directives. Use Markdown for formatting.
      Be concise but informative.
      
      Code:
      \`\`\`
      ${code}
      \`\`\`
    `;

    const response = await ai.models.generateContent({
      model: MODEL_ID,
      contents: prompt,
    });

    return response.text || "Failed to get explanation.";
  } catch (error) {
    console.error("Explanation Error:", error);
    return "An error occurred while trying to get an explanation from AI.";
  }
};

export const simulateNslookup = async (
  commandArgs: string, 
  files: Record<string, FileConfig>, 
  lang: Language
): Promise<string> => {
  try {
    const ai = getAiClient();
    
    // Combine all files into context
    const filesContext = Object.values(files).map(f => `
File: ${f.name} (${f.type})
Content:
\`\`\`
${f.content}
\`\`\`
`).join('\n');

    const prompt = `
      You are a Linux DNS Server simulator.
      Act exactly like the 'nslookup' command line tool.
      
      Context - Current BIND9 Configuration:
      ${filesContext}
      
      Task:
      User executes: nslookup ${commandArgs}
      
      Based *strictly* on the configuration files provided above, generate the output of this command.
      
      Rules:
      1. If the record exists in the configuration, return the answer section.
      2. If the zone or record does not exist, return standard NXDOMAIN or SERVFAIL error messages.
      3. If the syntax of the config files is so broken that BIND wouldn't start, return a connection timed out or server failed error.
      4. Output ONLY the text that would appear in the terminal. No markdown blocks, no explanations.
      5. The output should look realistic (Server: 127.0.0.1, Address: 127.0.0.1#53, etc.).
    `;

    const response = await ai.models.generateContent({
      model: MODEL_ID,
      contents: prompt,
      config: {
        temperature: 0.1
      }
    });

    return response.text || "Error: No output generated.";
  } catch (error) {
    console.error("Nslookup Error:", error);
    return ";; Connection to server failed; no servers could be reached";
  }
};