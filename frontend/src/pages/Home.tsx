import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useAppStore } from '../stores/appStore';
import CameraModal from '../components/CameraModal';
import { LANGUAGES } from '../types';
import { Camera, Sparkles, Globe, Send, Lightbulb, ChevronDown, BookOpen, HelpCircle, Image, Calculator, Beaker, Book, Languages } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Home() {
  const { profile } = useAuthStore();
  const { setCapturedImage, setTypedText, hintsMode, setHintsMode } = useAppStore();
  const navigate = useNavigate();
  const [showCamera, setShowCamera] = useState(false);
  const [homeworkText, setHomeworkText] = useState('');
  const [showTypeInput, setShowTypeInput] = useState(false);
  const [showHintTooltip, setShowHintTooltip] = useState(false);

  const requireLanguage = (): boolean => {
    if (!profile?.selectedLanguage) {
      toast.error('Select a language in your Profile first');
      navigate('/profile');
      return false;
    }
    return true;
  };

  const handleCapture = (imageDataUrl: string) => {
    if (!requireLanguage()) return;
    setCapturedImage(imageDataUrl);
    setShowCamera(false);
    navigate('/result');
  };

  const handleTextSubmit = () => {
    if (!homeworkText.trim()) return;
    if (!requireLanguage()) return;
    setTypedText(homeworkText.trim());
    navigate('/result');
  };

  const langInfo = profile?.selectedLanguage ? LANGUAGES[profile.selectedLanguage] : null;
  const firstName = profile?.displayName?.split(' ')[0] || 'there';
  const greeting = `Welcome back, ${firstName}`;

  const exampleProblems = [
    'Solve for x: 2x + 5 = 13',
    'What is photosynthesis?',
    'Explain the water cycle',
  ];

  return (
    <div className="mx-auto flex h-full max-w-lg flex-col px-6 py-6">
      {/* Header with Logo */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600">
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold text-gray-900">Clarify</span>
        </div>
        <button
          onClick={() => navigate('/faq')}
          className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100"
        >
          <HelpCircle className="h-5 w-5" />
        </button>
      </div>

      {/* Greeting */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{greeting}</h1>
        <p className="mt-2 text-base text-gray-600">
          Get instant homework help in your language
        </p>
      </div>

      {/* Settings Bar */}
      <div className="mb-8 flex flex-wrap items-center gap-3">
        {/* Language Selector */}
        {langInfo ? (
          <button
            onClick={() => navigate('/profile')}
            className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 transition-all hover:border-primary-300 hover:bg-primary-50"
          >
            <Languages className="h-4 w-4 text-primary-600" />
            <span className="font-medium">{langInfo.label}</span>
            <ChevronDown className="h-3 w-3 text-gray-400" />
          </button>
        ) : (
          <button
            onClick={() => navigate('/profile')}
            className="flex items-center gap-2 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-700 transition-colors hover:bg-amber-100"
          >
            <Globe className="h-4 w-4" />
            Select Language
          </button>
        )}

        {/* Hints Mode Toggle */}
        <div className="relative">
          <button
            onMouseEnter={() => setShowHintTooltip(true)}
            onMouseLeave={() => setShowHintTooltip(false)}
            onClick={() => setHintsMode(!hintsMode)}
            className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm transition-all hover:border-primary-300"
          >
            <Lightbulb className={`h-4 w-4 ${hintsMode ? 'fill-amber-400 text-amber-500' : 'text-gray-400'}`} />
            <span className="font-medium text-gray-700">Hints</span>
            <div
              className={`relative h-6 w-11 rounded-full transition-colors ${
                hintsMode ? 'bg-primary-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`absolute top-1 left-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                  hintsMode ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </div>
          </button>
          {showHintTooltip && (
            <div className="absolute left-0 top-full z-10 mt-2 w-64 rounded-lg bg-gray-900 p-3 text-xs text-white shadow-lg">
              Get helpful hints instead of full solutions. Perfect for learning!
              <div className="absolute -top-1 left-4 h-2 w-2 rotate-45 bg-gray-900" />
            </div>
          )}
        </div>
      </div>

      {/* Subject Tags */}
      <div className="mb-6 flex flex-wrap gap-2">
        <div className="flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
          <Calculator className="h-3.5 w-3.5" />
          Math
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
          <Beaker className="h-3.5 w-3.5" />
          Science
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700">
          <Book className="h-3.5 w-3.5" />
          History
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-700">
          <Sparkles className="h-3.5 w-3.5" />
          & More
        </div>
      </div>

      {/* Primary Action: Scan Homework */}
      <button
        onClick={() => {
          if (!requireLanguage()) return;
          setShowCamera(true);
        }}
        className="group relative mb-4 flex w-full items-center justify-center gap-4 overflow-hidden rounded-2xl bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-7 shadow-lg shadow-primary-600/30 transition-all hover:shadow-xl hover:shadow-primary-600/40 active:scale-[0.98]"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-primary-600 opacity-0 transition-opacity group-hover:opacity-100" />
        <Camera className="relative h-8 w-8 text-white" />
        <div className="relative flex-1 text-left">
          <div className="text-xl font-bold text-white">Scan Homework</div>
          <div className="text-sm text-primary-100">Photo or upload from gallery</div>
        </div>
        <Image className="relative h-6 w-6 text-primary-200" />
      </button>

      <p className="mb-6 text-center text-xs text-gray-500">
        Works with handwritten or typed problems
      </p>

      {/* OR Divider */}
      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center">
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-xs font-medium text-gray-500">
            or
          </span>
        </div>
      </div>

      {/* Secondary Action: Type It Out */}
      {!showTypeInput ? (
        <button
          onClick={() => setShowTypeInput(true)}
          className="mb-6 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 px-4 py-4 text-sm font-medium text-gray-600 transition-all hover:border-primary-400 hover:bg-primary-50 hover:text-primary-700"
        >
          <Send className="h-4 w-4" />
          Type your question instead
        </button>
      ) : (
        <div className="mb-6 rounded-xl border border-gray-200 bg-gray-50 p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-700">Type your question</h3>
            <button
              onClick={() => setShowTypeInput(false)}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
          </div>
          <div className="flex gap-2">
            <textarea
              value={homeworkText}
              onChange={(e) => setHomeworkText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleTextSubmit();
                }
              }}
              placeholder="Ask any homework question..."
              rows={3}
              autoFocus
              className="flex-1 resize-none rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none placeholder:text-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
            />
            <button
              onClick={handleTextSubmit}
              disabled={!homeworkText.trim()}
              className="self-end shrink-0 rounded-lg bg-primary-600 p-2.5 text-white transition-colors hover:bg-primary-700 disabled:opacity-30"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Quick Start Examples */}
      <div className="mb-6">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
          Try an example
        </p>
        <div className="space-y-2">
          {exampleProblems.map((problem, i) => (
            <button
              key={i}
              onClick={() => {
                setHomeworkText(problem);
                setShowTypeInput(true);
              }}
              className="flex w-full items-start gap-2 rounded-lg border border-gray-200 bg-white p-3 text-left text-sm text-gray-700 transition-all hover:border-primary-300 hover:bg-primary-50"
            >
              <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary-500" />
              <span>{problem}</span>
            </button>
          ))}
        </div>
      </div>

      {showCamera && (
        <CameraModal onCapture={handleCapture} onClose={() => setShowCamera(false)} />
      )}
    </div>
  );
}
