import { GoogleGenerativeAI } from '@google/generative-ai';
import type { GeminiAnalysis, SupportedLanguage } from '../types';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

function dataURLtoBase64(dataUrl: string): { base64: string; mimeType: string } {
  const [header, base64] = dataUrl.split(',');
  const mimeType = header.match(/:(.*?);/)?.[1] ?? 'image/jpeg';
  return { base64, mimeType };
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
    ? `**explanation**: Provide helpful HINTS in ${targetLanguage} to guide the student toward solving this on their own. DO NOT give the complete solution. Instead, ask guiding questions, suggest which concepts to review, or give the first step only. Encourage critical thinking. For example, "What operation would help you isolate x?" or "Remember the order of operations: PEMDAS."`
    : `**explanation**: Provide a clear, step-by-step explanation of how to solve or understand this homework in ${targetLanguage}. Use simple language appropriate for a student. If it's math, show each step. If it's a reading/history/science assignment, explain the key concepts.`;

  const prompt = `You are an expert tutor helping a student understand their homework.
${gradeLevelInstruction}
Analyze the image of homework and provide:

1. **originalText**: Extract all text/problems visible in the image exactly as written.
2. **translatedText**: Translate the extracted text into ${targetLanguage}.
3. ${explanationInstruction}
4. **subject**: Identify the subject (e.g., "Math", "Science", "History", "English", "Biology").
5. **sourceLanguage**: The language the original homework is written in (e.g., "English").

IMPORTANT: The explanation must be entirely in ${targetLanguage}. Be thorough but brief, do not include unnecessary details. Do not use Markdown syntax when writing the explanation. Keep it to Plaintext.

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
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Failed to parse Gemini response');
  return JSON.parse(jsonMatch[0]) as GeminiAnalysis;
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
    ? `**explanation**: Provide helpful HINTS in ${targetLanguage} to guide the student toward solving this on their own. DO NOT give the complete solution. Instead, ask guiding questions, suggest which concepts to review, or give the first step only. Encourage critical thinking. For example, "What operation would help you isolate x?" or "Remember the order of operations: PEMDAS."`
    : `**explanation**: Provide a clear, step-by-step explanation of how to solve or understand this homework in ${targetLanguage}. Use simple language appropriate for a student. If it's math, show each step. If it's a reading/history/science assignment, explain the key concepts.`;

  const prompt = `You are an expert tutor helping a student understand their homework.
${gradeLevelInstruction}
The student has typed in the following homework problem:

"${homeworkText}"

Provide:
1. **originalText**: The homework text exactly as the student typed it.
2. **translatedText**: Translate the text into ${targetLanguage}.
3. ${explanationInstruction}
4. **subject**: Identify the subject (e.g., "Math", "Science", "History", "English", "Biology").
5. **sourceLanguage**: The language the original homework is written in (e.g., "English").

IMPORTANT: The explanation must be entirely in ${targetLanguage}. Be thorough but brief, do not include unnecessary details. Do not use Markdown syntax when writing the explanation. Keep it to Plaintext.
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
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Failed to parse Gemini response');
  return JSON.parse(jsonMatch[0]) as GeminiAnalysis;
}

export async function askFollowUp(
  question: string,
  context: string,
  targetLanguage: SupportedLanguage,
): Promise<string> {
  const prompt = `You are a helpful tutor. A student previously received this homework explanation:

"${context}"

The student is now asking a follow-up question in ${targetLanguage}: "${question}"

Please answer their question clearly and helpfully in ${targetLanguage}. Use simple language appropriate for a student. Be encouraging.

Respond with ONLY your answer text, no JSON or formatting wrappers.`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}
