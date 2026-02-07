import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useAppStore } from '../stores/appStore';
import { analyzeHomework, analyzeText, askFollowUp } from '../services/gemini';
import { generateSpeech } from '../services/elevenlabs';
import { saveHomeworkResult, createConversation, addConversationMessage, uploadAudioBlob, updateHomeworkAudioUrl } from '../services/firestore';
import AudioPlayer from '../components/AudioPlayer';
import { Loader2, Mic, MicOff, Send, ArrowLeft, BookOpen, Lightbulb } from 'lucide-react';
import toast from 'react-hot-toast';
import type { ConversationMessage } from '../types';

export default function Result() {
  const navigate = useNavigate();
  const { user, profile } = useAuthStore();
  const {
    capturedImage, typedText, currentResult, conversation, hintsMode,
    isAnalyzing, isGeneratingAudio, isListening,
    setCapturedImage, setTypedText, setCurrentResult, addMessage,
    setIsAnalyzing, setIsGeneratingAudio, setIsListening,
    reset,
  } = useAppStore();

  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [followUpText, setFollowUpText] = useState('');
  const [followUpAudioUrl, setFollowUpAudioUrl] = useState<string | null>(null);
  const [isAnswering, setIsAnswering] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const hasStarted = useRef(false);
  const mainAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const hasInput = capturedImage || typedText;
    if (!hasInput || !user || !profile?.selectedLanguage) {
      navigate('/home');
      return;
    }
    if (currentResult || hasStarted.current) return;
    hasStarted.current = true;

    const localImage = capturedImage;
    const localText = typedText;
    const run = async () => {
      setIsAnalyzing(true);
      try {
        console.log('[Clarify] Sending to Gemini...');
        const analysis = localImage
          ? await analyzeHomework(localImage, profile.selectedLanguage!, profile.gradeLevel, hintsMode)
          : await analyzeText(localText!, profile.selectedLanguage!, profile.gradeLevel, hintsMode);
        console.log('[Clarify] Gemini responded:', analysis);

        const result = {
          userId: user.uid,
          imageUrl: localImage ?? '',
          originalText: analysis.originalText,
          translatedText: analysis.translatedText,
          explanation: analysis.explanation,
          sourceLanguage: analysis.sourceLanguage,
          targetLanguage: profile.selectedLanguage!,
          subject: analysis.subject,
          timestamp: Date.now(),
        };

        // Show result immediately
        setCurrentResult(result);
        setIsAnalyzing(false);
        setCapturedImage(null);
        setTypedText(null);

        // Save to Firestore in the background (don't store base64 image)
        const { imageUrl: _img, ...firestoreData } = result;
        const savePromise = saveHomeworkResult({ ...firestoreData, imageUrl: '' }).then(async (docId) => {
          try {
            const convId = await createConversation(docId, user.uid);
            setConversationId(convId);
            const cur = useAppStore.getState().currentResult;
            if (cur) setCurrentResult({ ...cur, id: docId });
          } catch (e) {
            console.error('[Clarify] Conversation create failed:', e);
          }
          return docId;
        }).catch((e) => {
          console.error('[Clarify] Firestore save failed:', e);
          return null;
        });

        // Generate audio in the background - delay to ensure loading state renders
        setTimeout(async () => {
          setIsGeneratingAudio(true);
          try {
            const { blobUrl, blob } = await generateSpeech(analysis.explanation, profile.selectedLanguage!);
            setAudioUrl(blobUrl);
            setIsGeneratingAudio(false);

            // Upload audio to Firebase Storage & save URL to Firestore
            savePromise.then(async (docId) => {
              if (!docId) return;
              try {
                const downloadUrl = await uploadAudioBlob(user.uid, blob);
                await updateHomeworkAudioUrl(docId, downloadUrl);
              } catch (e) {
                console.error('[Clarify] Audio upload failed:', e);
              }
            });
          } catch {
            toast.error('Audio generation failed');
            setIsGeneratingAudio(false);
          }
        }, 0);
      } catch (err) {
        console.error('[Clarify] Analysis failed:', err);
        toast.error('Failed to analyze homework. Please try again.');
        setIsAnalyzing(false);
        navigate('/home');
      }
    };
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  const startListening = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      toast.error('Speech recognition not supported in this browser');
      return;
    }

    // Map user's selected language to speech recognition language code
    const speechLangMap: Record<string, string> = {
      spanish: 'es-ES',
      chinese: 'zh-CN',
      arabic: 'ar-SA',
      vietnamese: 'vi-VN',
      french: 'fr-FR',
      hindi: 'hi-IN',
      portuguese: 'pt-BR',
    };

    const recognition = new SR();
    recognition.continuous = false;
    recognition.interimResults = false;
    // Use the user's selected language for speech recognition
    recognition.lang = profile?.selectedLanguage
      ? speechLangMap[profile.selectedLanguage] || 'en-US'
      : 'en-US';
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      setFollowUpText(transcript);
      setIsListening(false);
    };
    recognition.onerror = () => {
      setIsListening(false);
      toast.error('Speech recognition failed');
    };
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  const handleFollowUp = async () => {
    if (!followUpText.trim() || !currentResult || !profile?.selectedLanguage) return;
    const question = followUpText.trim();
    setFollowUpText('');
    setFollowUpAudioUrl(null);

    const userMsg: ConversationMessage = { role: 'user', text: question, timestamp: Date.now() };
    addMessage(userMsg);
    if (conversationId) addConversationMessage(conversationId, userMsg);

    setIsAnswering(true);
    try {
      const answer = await askFollowUp(question, currentResult.explanation, profile.selectedLanguage);
      const assistantMsg: ConversationMessage = { role: 'assistant', text: answer, timestamp: Date.now() };
      addMessage(assistantMsg);
      if (conversationId) addConversationMessage(conversationId, assistantMsg);

      try {
        const { blobUrl } = await generateSpeech(answer, profile.selectedLanguage);
        setFollowUpAudioUrl(blobUrl);
      } catch { /* audio optional */ }
    } catch {
      toast.error('Failed to get answer');
    }
    setIsAnswering(false);
  };

  if (isAnalyzing) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 px-6">
        <div className="relative">
          <div className="h-20 w-20 rounded-2xl bg-primary-100 flex items-center justify-center">
            <BookOpen className="h-10 w-10 text-primary-600" />
          </div>
          <Loader2 className="absolute -right-2 -top-2 h-6 w-6 animate-spin text-primary-500" />
        </div>
        <div className="text-center">
          <h2 className="text-lg font-semibold text-gray-900">Analyzing homework...</h2>
          <p className="mt-1 text-sm text-gray-500">This usually takes a few seconds</p>
        </div>
      </div>
    );
  }

  if (!currentResult) return null;

  return (
    <div className="mx-auto flex h-full max-w-lg flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-gray-100 px-4 py-3">
        <button onClick={() => { reset(); navigate('/home'); }} className="rounded-lg p-1 text-gray-500 hover:bg-gray-100">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-sm font-semibold text-gray-900">{currentResult.subject}</h1>
          <p className="text-xs text-gray-500">Homework Explanation</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
        {/* Original Image */}
        {currentResult.imageUrl && (
          <div className="overflow-hidden rounded-xl border border-gray-200">
            <img src={currentResult.imageUrl} alt="Homework" className="w-full" />
          </div>
        )}

        {/* Original Text */}
        <div>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">Original Text</h3>
          <p className="rounded-xl bg-gray-100 px-4 py-3 text-sm text-gray-700 whitespace-pre-wrap">
            {currentResult.originalText}
          </p>
        </div>

        {/* Translation */}
        <div>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">Translation</h3>
          <p className="rounded-xl bg-primary-50 px-4 py-3 text-sm text-primary-900 whitespace-pre-wrap">
            {currentResult.translatedText}
          </p>
        </div>

        {/* Explanation */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                {hintsMode ? 'Hints' : 'Explanation'}
              </h3>
              {hintsMode && (
                <span className="flex items-center gap-1 rounded-full bg-primary-100 px-2 py-0.5 text-xs font-medium text-primary-700">
                  <Lightbulb className="h-3 w-3" />
                  Hints Mode
                </span>
              )}
            </div>
            <AudioPlayer src={audioUrl} loading={isGeneratingAudio} />
          </div>
          <div className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-900 whitespace-pre-wrap">
            {currentResult.explanation}
          </div>
        </div>

        {/* Conversation */}
        {conversation.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-400">Follow-up Q&A</h3>
            {conversation.map((msg, i) => (
              <div
                key={i}
                className={`rounded-xl px-4 py-3 text-sm whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'ml-8 bg-primary-600 text-white'
                    : 'mr-8 bg-gray-100 text-gray-800'
                }`}
              >
                {msg.text}
              </div>
            ))}
            {followUpAudioUrl && (
              <AudioPlayer src={followUpAudioUrl} />
            )}
            {isAnswering && (
              <div className="mr-8 flex items-center gap-2 rounded-xl bg-gray-100 px-4 py-3 text-sm text-gray-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                Thinking...
              </div>
            )}
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Follow-up Input */}
      <div className="border-t border-gray-200 bg-white px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="flex items-center gap-2">
          <button
            onClick={isListening ? stopListening : startListening}
            className={`shrink-0 rounded-full p-2.5 transition-colors ${
              isListening
                ? 'bg-red-500 text-white animate-pulse'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </button>
          <input
            value={followUpText}
            onChange={(e) => setFollowUpText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleFollowUp()}
            placeholder="Ask a follow-up question..."
            className="flex-1 rounded-full border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
          />
          <button
            onClick={handleFollowUp}
            disabled={!followUpText.trim() || isAnswering}
            className="shrink-0 rounded-full bg-primary-600 p-2.5 text-white transition-colors hover:bg-primary-700 disabled:opacity-30"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
