import { create } from 'zustand';
import type { HomeworkResult, ConversationMessage } from '../types';

interface AppState {
  capturedImage: string | null;
  typedText: string | null;
  currentResult: HomeworkResult | null;
  conversation: ConversationMessage[];
  isAnalyzing: boolean;
  isGeneratingAudio: boolean;
  isListening: boolean;
  setCapturedImage: (image: string | null) => void;
  setTypedText: (text: string | null) => void;
  setCurrentResult: (result: HomeworkResult | null) => void;
  addMessage: (message: ConversationMessage) => void;
  clearConversation: () => void;
  setIsAnalyzing: (val: boolean) => void;
  setIsGeneratingAudio: (val: boolean) => void;
  setIsListening: (val: boolean) => void;
  reset: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  capturedImage: null,
  typedText: null,
  currentResult: null,
  conversation: [],
  isAnalyzing: false,
  isGeneratingAudio: false,
  isListening: false,
  setCapturedImage: (image) => set({ capturedImage: image }),
  setTypedText: (text) => set({ typedText: text }),
  setCurrentResult: (result) => set({ currentResult: result }),
  addMessage: (message) =>
    set((state) => ({ conversation: [...state.conversation, message] })),
  clearConversation: () => set({ conversation: [] }),
  setIsAnalyzing: (val) => set({ isAnalyzing: val }),
  setIsGeneratingAudio: (val) => set({ isGeneratingAudio: val }),
  setIsListening: (val) => set({ isListening: val }),
  reset: () =>
    set({
      capturedImage: null,
      typedText: null,
      currentResult: null,
      conversation: [],
      isAnalyzing: false,
      isGeneratingAudio: false,
      isListening: false,
    }),
}));
