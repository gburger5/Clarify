import { GoogleGenerativeAI } from '@google/generative-ai';
import type { GeminiAnalysis, SupportedLanguage } from '../types';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

function dataURLtoBase64(dataUrl: string): { base64: string; mimeType: string } {
  const [header, base64] = dataUrl.split(',');
  const mimeType = header.match(/:(.*?);/)?.[1] ?? 'image/jpeg';
  return { base64, mimeType };
}

function extractAndCleanJSON(text: string): string {
  // Remove markdown code block markers if present
  let cleanedText = text.trim();

  // Check for code blocks and remove them
  if (cleanedText.startsWith('```')) {
    // Remove opening ```json or ```
    cleanedText = cleanedText.replace(/^```(?:json)?\s*\n?/, '');
    // Remove closing ```
    cleanedText = cleanedText.replace(/\n?```\s*$/, '');
  }

  cleanedText = cleanedText.trim();

  // Extract the JSON object (greedy match to get the complete object)
  const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('No JSON object found in response');
  }

  let jsonString = jsonMatch[0];

  // Remove any control characters that would break JSON parsing
  // but DON'T touch characters inside string values
  jsonString = jsonString.replace(/[\u0000-\u001F\u007F-\u009F]/g, (match) => {
    // Keep newlines and tabs as-is (they're already properly formatted in the JSON)
    if (match === '\n' || match === '\r' || match === '\t') return match;
    // Remove other control characters
    return '';
  });

  // Remove any trailing commas before closing braces/brackets
  jsonString = jsonString.replace(/,(\s*[}\]])/g, '$1');

  return jsonString;
}

export async function analyzeHomework(
  imageDataUrl: string,
  targetLanguage: SupportedLanguage,
  gradeLevel?: string,
  hintsMode: boolean = false,
): Promise<GeminiAnalysis> {
  const { base64, mimeType } = dataURLtoBase64(imageDataUrl);

  const gradeLevelInstruction = gradeLevel
    ? `The student is in ${gradeLevel}. Adjust your language complexity, vocabulary, and explanation depth to be appropriate for this grade level.`
    : '';

  const explanationInstruction = hintsMode
    ? `**explanation**: Give friendly, encouraging HINTS in ${targetLanguage} to help the student figure this out themselves. Don't give away the answer! Instead, ask thought-provoking questions, suggest what to think about, or give just the first step. Be supportive and make them feel capable. For example: "What do you think would happen if you moved that number to the other side?" or "Think about what PEMDAS tells us to do first here."`
    : `**explanation**: Explain this in ${targetLanguage} like you're a friendly tutor sitting next to the student. Be conversational, warm, and encouraging. Break it down step-by-step, but make it feel natural - like you're having a conversation, not reading from a textbook. Use "you" and "we" to make it personal. If it helps, use simple analogies or real-world examples. Show your work for math problems, but explain WHY each step matters.`;

  const prompt = `You are a warm, friendly tutor helping a student with their homework. Your goal is to make them feel confident and capable.
${gradeLevelInstruction}
Analyze the homework image and provide:

1. **originalText**: Extract all text/problems visible in the image exactly as written.
2. **translatedText**: Translate the extracted text into ${targetLanguage}.
3. ${explanationInstruction}
4. **subject**: Identify the subject in ENGLISH ONLY (e.g., "Math", "Science", "History", "English", "Biology").
5. **sourceLanguage**: The language the original homework is written in (e.g., "English").

IMPORTANT:
- The explanation must be entirely in ${targetLanguage}
- The subject must ALWAYS be in English
- Be thorough but brief, do not include unnecessary details
- Do not use Markdown syntax, line breaks, or special characters in the explanation
- Keep all text to single-line plaintext without newlines

Respond ONLY with valid JSON in this exact format:
{
  "originalText": "...",
  "translatedText": "...",
  "explanation": "...",
  "subject": "...",
  "sourceLanguage": "..."
}`;

  const result = await model.generateContent([
    { text: prompt },
    { inlineData: { data: base64, mimeType } },
  ]);

  const text = result.response.text();

  try {
    const cleanedJSON = extractAndCleanJSON(text);
    return JSON.parse(cleanedJSON) as GeminiAnalysis;
  } catch (error) {
    console.error('[Clarify] JSON parsing error. Raw response:', text);
    console.error('[Clarify] Parse error:', error);
    throw new Error(`Failed to parse AI response: ${error instanceof Error ? error.message : 'Invalid JSON format'}`);
  }
}

export async function analyzeText(
  homeworkText: string,
  targetLanguage: SupportedLanguage,
  gradeLevel?: string,
  hintsMode: boolean = false,
): Promise<GeminiAnalysis> {
  const gradeLevelInstruction = gradeLevel
    ? `The student is in ${gradeLevel}. Adjust your language complexity, vocabulary, and explanation depth to be appropriate for this grade level.`
    : '';

  const explanationInstruction = hintsMode
    ? `**explanation**: Give friendly, encouraging HINTS in ${targetLanguage} to help the student figure this out themselves. Don't give away the answer! Instead, ask thought-provoking questions, suggest what to think about, or give just the first step. Be supportive and make them feel capable. For example: "What do you think would happen if you moved that number to the other side?" or "Think about what PEMDAS tells us to do first here."`
    : `**explanation**: Explain this in ${targetLanguage} like you're a friendly tutor sitting next to the student. Be conversational, warm, and encouraging. Break it down step-by-step, but make it feel natural - like you're having a conversation, not reading from a textbook. Use "you" and "we" to make it personal. If it helps, use simple analogies or real-world examples. Show your work for math problems, but explain WHY each step matters.`;

  const prompt = `You are a warm, friendly tutor helping a student with their homework. Your goal is to make them feel confident and capable.
${gradeLevelInstruction}
The student has typed in this homework problem:

"${homeworkText}"

Provide:
1. **originalText**: The homework text exactly as the student typed it.
2. **translatedText**: Translate the text into ${targetLanguage}.
3. ${explanationInstruction}
4. **subject**: Identify the subject in ENGLISH ONLY (e.g., "Math", "Science", "History", "English", "Biology").
5. **sourceLanguage**: The language the original homework is written in (e.g., "English").

IMPORTANT:
- The explanation must be entirely in ${targetLanguage}
- The subject must ALWAYS be in English
- Be thorough but brief, do not include unnecessary details
- Do not use Markdown syntax, line breaks, or special characters in the explanation
- Keep all text to single-line plaintext without newlines

Respond ONLY with valid JSON in this exact format:
{
  "originalText": "...",
  "translatedText": "...",
  "explanation": "...",
  "subject": "...",
  "sourceLanguage": "..."
}`;

  const result = await model.generateContent(prompt);

  const text = result.response.text();

  try {
    const cleanedJSON = extractAndCleanJSON(text);
    return JSON.parse(cleanedJSON) as GeminiAnalysis;
  } catch (error) {
    console.error('[Clarify] JSON parsing error. Raw response:', text);
    console.error('[Clarify] Parse error:', error);
    throw new Error(`Failed to parse AI response: ${error instanceof Error ? error.message : 'Invalid JSON format'}`);
  }
}

export async function askFollowUp(
  question: string,
  context: string,
  targetLanguage: SupportedLanguage,
): Promise<string> {
  const prompt = `You're a patient, friendly tutor continuing a conversation with a student. Earlier, you explained this:

"${context}"

Now the student asks: "${question}"

Respond in ${targetLanguage} like you're having a natural conversation. Be warm, encouraging, and genuinely helpful. If they're confused, acknowledge it's okay and explain in a different way. If they're getting it, celebrate that! Keep it conversational and supportive - you're not just delivering information, you're building their confidence.

Respond with ONLY your answer (no JSON, no formatting tags - just natural conversational text).`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}
