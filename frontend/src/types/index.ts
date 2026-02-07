export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  selectedLanguage: SupportedLanguage | null;
  age?: number;
  gradeLevel?: string;
  createdAt: number;
}

export type SupportedLanguage =
  | 'spanish'
  | 'chinese'
  | 'arabic'
  | 'vietnamese'
  | 'french'
  | 'hindi'
  | 'portuguese';

export const LANGUAGES: Record<SupportedLanguage, { label: string; native: string; flag: string }> = {
  spanish: { label: 'Spanish', native: 'Espa\u00f1ol', flag: '\ud83c\uddea\ud83c\uddf8' },
  chinese: { label: 'Chinese', native: '\u4e2d\u6587', flag: '\ud83c\udde8\ud83c\uddf3' },
  arabic: { label: 'Arabic', native: '\u0627\u0644\u0639\u0631\u0628\u064a\u0629', flag: '\ud83c\uddf8\ud83c\udde6' },
  vietnamese: { label: 'Vietnamese', native: 'Ti\u1ebfng Vi\u1ec7t', flag: '\ud83c\uddfb\ud83c\uddf3' },
  french: { label: 'French', native: 'Fran\u00e7ais', flag: '\ud83c\uddeb\ud83c\uddf7' },
  hindi: { label: 'Hindi', native: '\u0939\u093f\u0928\u094d\u0926\u0940', flag: '\ud83c\uddee\ud83c\uddf3' },
  portuguese: { label: 'Portuguese', native: 'Portugu\u00eas', flag: '\ud83c\udde7\ud83c\uddf7' },
};

export const GRADE_LEVELS = [
  '1st Grade',
  '2nd Grade',
  '3rd Grade',
  '4th Grade',
  '5th Grade',
  '6th Grade',
  '7th Grade',
  '8th Grade',
  '9th Grade',
  '10th Grade',
  '11th Grade',
  '12th Grade',
  'College',
] as const;

export interface HomeworkResult {
  id?: string;
  userId: string;
  imageUrl: string;
  originalText: string;
  translatedText: string;
  explanation: string;
  sourceLanguage: string;
  targetLanguage: SupportedLanguage;
  subject: string;
  timestamp: number;
  audioUrl?: string;
}

export interface ConversationMessage {
  role: 'user' | 'assistant';
  text: string;
  timestamp: number;
  audioUrl?: string;
}

export interface Conversation {
  id?: string;
  homeworkId: string;
  userId: string;
  messages: ConversationMessage[];
  createdAt: number;
}

export interface GeminiAnalysis {
  originalText: string;
  translatedText: string;
  explanation: string;
  subject: string;
  sourceLanguage: string;
}
