import { writeFileSync, readFileSync } from 'fs';
import { join } from 'path';

// Load .env file
const envPath = join(process.cwd(), '.env');
const envContent = readFileSync(envPath, 'utf-8');
const envVars = envContent.split('\n').reduce((acc, line) => {
  const [key, value] = line.split('=');
  if (key && value) acc[key.trim()] = value.trim();
  return acc;
}, {} as Record<string, string>);

const API_KEY = envVars.VITE_ELEVENLABS_API_KEY;
const VOICE_ID = '21m00Tcm4TlvDq8ikWAM';

const demoText = "Para resolver esta ecuación, primero resta 5 de ambos lados. Esto nos da 2x = 8. Luego, divide ambos lados por 2 para obtener x = 4.";

async function generateDemoAudio() {
  console.log('Generating demo audio...');

  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'xi-api-key': API_KEY!,
    },
    body: JSON.stringify({
      text: demoText,
      model_id: 'eleven_multilingual_v2',
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75,
      },
      language_code: 'es',
    }),
  });

  if (!response.ok) {
    throw new Error(`ElevenLabs API error: ${response.status}`);
  }

  const blob = await response.blob();
  const buffer = Buffer.from(await blob.arrayBuffer());

  const outputPath = join(process.cwd(), 'public', 'demo-explanation.mp3');
  writeFileSync(outputPath, buffer);

  console.log(`✅ Demo audio saved to: ${outputPath}`);
}

generateDemoAudio().catch(console.error);
