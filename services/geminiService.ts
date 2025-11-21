import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ValidationResult } from "../types";

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
          message: { type: Type.STRING, description: "A clear error message in Russian explaining the syntax error." },
          severity: { type: Type.STRING, enum: ["error", "warning"], description: "The severity of the issue." },
        },
        required: ["line", "message", "severity"]
      },
      description: "List of syntax errors found."
    },
    generalFeedback: { type: Type.STRING, description: "A brief summary of the configuration status in Russian." }
  },
  required: ["isValid", "errors", "generalFeedback"]
};

export const validateBindConfig = async (code: string, filename: string): Promise<ValidationResult> => {
  try {
    const ai = getAiClient();
    const prompt = `
      Ты опытный системный администратор Linux и эксперт по DNS серверу BIND9.
      Проверь следующий конфигурационный файл (${filename}) на наличие синтаксических и логических ошибок.
      Строго придерживайся формата BIND9.
      Ответь на РУССКОМ языке.
      
      Код для проверки:
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
        temperature: 0.1 // Low temperature for precise validation
      },
    });

    const responseText = response.text;
    if (!responseText) throw new Error("No response from AI");

    return JSON.parse(responseText) as ValidationResult;
  } catch (error) {
    console.error("Validation Error:", error);
    return {
      isValid: false,
      errors: [{ line: 0, message: "Ошибка соединения с AI сервисом проверки.", severity: "error" }],
      generalFeedback: "Не удалось выполнить проверку."
    };
  }
};

export const explainBindConfig = async (code: string, filename: string): Promise<string> => {
  try {
    const ai = getAiClient();
    const prompt = `
      Ты преподаватель сетевых технологий. Объясни простым и понятным языком на РУССКОМ, 
      что делает этот конфигурационный файл BIND9 (${filename}).
      Разбери ключевые директивы. Используй Markdown для форматирования.
      Будь краток, но информативен.
      
      Код:
      \`\`\`
      ${code}
      \`\`\`
    `;

    const response = await ai.models.generateContent({
      model: MODEL_ID,
      contents: prompt,
    });

    return response.text || "Не удалось получить объяснение.";
  } catch (error) {
    console.error("Explanation Error:", error);
    return "Произошла ошибка при попытке получить объяснение от AI.";
  }
};
