import type { SupportedLanguage } from '../types';

const API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;
const BASE_URL = 'https://api.elevenlabs.io/v1';

// Multilingual v2 voice - "Rachel" works well across languages
const VOICE_ID = '21m00Tcm4TlvDq8ikWAM';

const LANGUAGE_CODES: Record<SupportedLanguage, string> = {
  spanish: 'es',
  chinese: 'zh',
  arabic: 'ar',
  vietnamese: 'vi',
  french: 'fr',
  hindi: 'hi',
  portuguese: 'pt',
};

export async function generateSpeech(
  text: string,
  language: SupportedLanguage,
): Promise<{ blobUrl: string; blob: Blob }> {
  const response = await fetch(`${BASE_URL}/text-to-speech/${VOICE_ID}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'xi-api-key': API_KEY,
    },
    body: JSON.stringify({
      text: text.slice(0, 4000),
      model_id: 'eleven_multilingual_v2',
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75,
      },
      language_code: LANGUAGE_CODES[language],
    }),
  });

  if (!response.ok) {
    throw new Error(`ElevenLabs API error: ${response.status}`);
  }

  const blob = await response.blob();
  return { blobUrl: URL.createObjectURL(blob), blob };
}
