import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useAppStore } from '../stores/appStore';
import CameraModal from '../components/CameraModal';
import { LANGUAGES } from '../types';
import { Camera, Sparkles, Globe, Send } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Home() {
  const { profile } = useAuthStore();
  const { setCapturedImage, setTypedText } = useAppStore();
  const navigate = useNavigate();
  const [showCamera, setShowCamera] = useState(false);
  const [homeworkText, setHomeworkText] = useState('');

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

  return (
    <div className="mx-auto flex h-full max-w-lg flex-col px-5 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Hey{profile?.displayName ? `, ${profile.displayName.split(' ')[0]}` : ''}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Snap a photo or type your homework and we'll explain it.
        </p>
      </div>

      {/* Current Language Pill */}
      {langInfo ? (
        <button
          onClick={() => navigate('/profile')}
          className="mb-6 flex w-fit items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50 active:scale-[0.98]"
        >
          <span className="text-lg">{langInfo.flag}</span>
          <span>Explaining in <span className="font-semibold">{langInfo.label}</span></span>
        </button>
      ) : (
        <button
          onClick={() => navigate('/profile')}
          className="mb-6 flex w-fit items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-700 transition-colors hover:bg-amber-100 active:scale-[0.98]"
        >
          <Globe className="h-4 w-4" />
          <span>Select your language in Profile</span>
        </button>
      )}

      {/* Type Homework */}
      <div className="mb-6">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-400">
          Type your homework
        </h2>
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
            placeholder="e.g. What is the quadratic formula? Solve 2x + 5 = 13..."
            rows={3}
            className="flex-1 resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none placeholder:text-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
          />
          <button
            onClick={handleTextSubmit}
            disabled={!homeworkText.trim()}
            className="self-end shrink-0 rounded-xl bg-primary-600 p-3 text-white transition-colors hover:bg-primary-700 disabled:opacity-30 active:scale-[0.98]"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="mb-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-gray-200" />
        <span className="text-xs text-gray-400">or</span>
        <div className="h-px flex-1 bg-gray-200" />
      </div>

      {/* Scan Button */}
      <button
        onClick={() => {
          if (!requireLanguage()) return;
          setShowCamera(true);
        }}
        className="flex w-full items-center justify-center gap-3 rounded-2xl bg-primary-600 px-6 py-4 text-lg font-semibold text-white shadow-lg shadow-primary-600/25 transition-all hover:bg-primary-700 active:scale-[0.98]"
      >
        <Camera className="h-6 w-6" />
        Scan Homework
      </button>

      <div className="mt-4 flex items-start gap-2 rounded-xl bg-primary-50 px-4 py-3">
        <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary-500" />
        <p className="text-xs text-primary-700">
          Take a photo of any homework — math, science, history, or any subject.
          We'll explain it step-by-step in your language.
        </p>
      </div>

      {showCamera && (
        <CameraModal onCapture={handleCapture} onClose={() => setShowCamera(false)} />
      )}
    </div>
  );
}
