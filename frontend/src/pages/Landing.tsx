import { useState, useRef } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import {
  BookOpen,
  Camera,
  MessageSquare,
  Globe,
  Lightbulb,
  Eye,
  GraduationCap,
  ArrowRight,
  CheckCircle,
  Volume2,
  Play,
  Pause,
  Mic,
  Keyboard,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function Landing() {
  const navigate = useNavigate();
  const { user, signInWithGoogle, loading } = useAuthStore();
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Redirect authenticated users to home
  if (user) {
    return <Navigate to="/home" replace />;
  }

  const handlePlayAudio = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio('/demo-explanation.mp3');
      audioRef.current.onended = () => setIsPlaying(false);
      audioRef.current.onpause = () => setIsPlaying(false);
      audioRef.current.onplay = () => setIsPlaying(true);
    }

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
  };

  const handleGetStarted = () => {
    navigate('/login');
  };

  const handleGoogleSignUp = async () => {
    try {
      await signInWithGoogle();
      toast.success('Welcome to Clarify!');
      navigate('/home');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Sign-up failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      {/* Header */}
      <header className="border-b border-primary-100 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-600 shadow-md">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Clarify</span>
          </div>
          <button
            onClick={() => navigate('/login')}
            className="rounded-lg px-4 py-2 text-sm font-medium text-primary-600 transition-colors hover:bg-primary-50"
          >
            Sign In
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <div>
            <h1 className="text-4xl font-bold leading-tight text-gray-900 md:text-5xl lg:text-6xl">
              Understand Homework in Your Language
            </h1>
            <p className="mt-6 text-lg text-gray-600 md:text-xl">
              Scan, type, or speak your problem. Clarify explains it step-by-step in your language with audio so you can listen and learn.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={handleGetStarted}
                className="flex items-center justify-center gap-2 rounded-xl bg-primary-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:bg-primary-700 hover:shadow-xl active:scale-[0.98]"
              >
                Get Started
                <ArrowRight className="h-5 w-5" />
              </button>
              <button
                onClick={handleGoogleSignUp}
                disabled={loading}
                className="flex items-center justify-center gap-3 rounded-xl border-2 border-gray-300 bg-white px-8 py-4 text-lg font-semibold text-gray-700 shadow-md transition-all hover:bg-gray-50 hover:shadow-lg active:scale-[0.98] disabled:opacity-50"
              >
                <svg className="h-6 w-6" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Sign up with Google
              </button>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="relative">
            <div className="rounded-2xl bg-gradient-to-br from-primary-100 to-primary-200 p-8 shadow-2xl">
              <div className="space-y-4">
                <div className="rounded-xl bg-white p-4 shadow-md">
                  <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                    <Camera className="h-4 w-4" />
                    Original Problem
                  </div>
                  <p className="text-sm text-gray-700">
                    Solve: 2x + 5 = 13
                  </p>
                </div>
                <div className="rounded-xl bg-primary-600 p-4 shadow-md">
                  <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-primary-200">
                    <MessageSquare className="h-4 w-4" />
                    Explanation (Spanish)
                  </div>
                  <p className="text-sm text-white">
                    Para resolver esta ecuación, primero resta 5 de ambos lados...
                  </p>
                  <button
                    onClick={handlePlayAudio}
                    className="mt-3 flex w-full items-center gap-3 rounded-lg bg-white/10 px-3 py-2.5 transition-all hover:bg-white/20 active:scale-[0.98]"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                      {isPlaying ? (
                        <Pause className="h-4 w-4 text-white" />
                      ) : (
                        <Play className="h-4 w-4 text-white ml-0.5" />
                      )}
                    </div>
                    {isPlaying && (
                      <div className="flex flex-1 items-center gap-1">
                        <div className="h-1 w-1 rounded-full bg-white/60 animate-pulse"></div>
                        <div className="h-1.5 w-1.5 rounded-full bg-white/80 animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                        <div className="h-2 w-2 rounded-full bg-white animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                        <div className="h-1.5 w-1.5 rounded-full bg-white/80 animate-pulse" style={{ animationDelay: '0.3s' }}></div>
                        <div className="h-1 w-1 rounded-full bg-white/60 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    )}
                    <span className="text-sm font-medium text-white">
                      {isPlaying ? 'Playing Audio' : 'Listen in Spanish'}
                    </span>
                  </button>
                </div>
                <div className="rounded-xl bg-green-50 p-4 shadow-md">
                  <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    Solution
                  </div>
                  <p className="text-sm text-green-900">
                    x = 4
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-3xl font-bold text-gray-900 md:text-4xl">
            How It Works
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-gray-600">
            Get homework help in three simple steps
          </p>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {/* Step 1 */}
            <div className="text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-primary-100">
                <div className="flex gap-1">
                  <Camera className="h-6 w-6 text-primary-600" />
                  <Keyboard className="h-6 w-6 text-primary-600" />
                  <Mic className="h-6 w-6 text-primary-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center justify-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-600 text-sm font-bold text-white">
                  1
                </span>
                <h3 className="text-xl font-semibold text-gray-900">Scan, Type, or Speak</h3>
              </div>
              <p className="mt-3 text-gray-600">
                Take a photo, type your question, or simply speak it - whatever works best for you
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-primary-100">
                <Lightbulb className="h-10 w-10 text-primary-600" />
              </div>
              <div className="mt-4 flex items-center justify-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-600 text-sm font-bold text-white">
                  2
                </span>
                <h3 className="text-xl font-semibold text-gray-900">Get Explanations</h3>
              </div>
              <p className="mt-3 text-gray-600">
                Clarify breaks down the problem step-by-step with helpful hints and guidance
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-primary-100">
                <BookOpen className="h-10 w-10 text-primary-600" />
              </div>
              <div className="mt-4 flex items-center justify-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-600 text-sm font-bold text-white">
                  3
                </span>
                <h3 className="text-xl font-semibold text-gray-900">Learn & Review</h3>
              </div>
              <p className="mt-3 text-gray-600">
                Read explanations in your preferred language and save problems to review later
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-3xl font-bold text-gray-900 md:text-4xl">
            Why Students Love Clarify
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-gray-600">
            Powerful features designed to help you succeed
          </p>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100">
                <Globe className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Multilingual Support</h3>
              <p className="mt-2 text-gray-600">
                Get explanations in Spanish, Chinese, Arabic, Vietnamese, French, Hindi, or Portuguese
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
                <Mic className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Speech-to-Speech</h3>
              <p className="mt-2 text-gray-600">
                Speak your question and get instant audio explanations. It's like talking to a real tutor.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100">
                <MessageSquare className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Step-by-Step Explanations</h3>
              <p className="mt-2 text-gray-600">
                Understand every step of the solution with clear, detailed explanations
              </p>
            </div>

            {/* Feature 4 */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100">
                <Lightbulb className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Hints Mode</h3>
              <p className="mt-2 text-gray-600">
                Get helpful hints without giving away the full solution so you can learn
              </p>
            </div>

            {/* Feature 5 */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100">
                <Eye className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Handwriting Recognition</h3>
              <p className="mt-2 text-gray-600">
                Recognizes handwritten problems and diagrams from your photos
              </p>
            </div>

            {/* Feature 6 */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                <GraduationCap className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">All Grade Levels</h3>
              <p className="mt-2 text-gray-600">
                Supports students from 1st grade through college with age-appropriate explanations
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl font-bold text-white md:text-4xl">
            Ready to Master Your Homework?
          </h2>
          <p className="mt-4 text-lg text-primary-100 md:text-xl">
            Start learning in your language today
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <button
              onClick={handleGetStarted}
              className="flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 text-lg font-semibold text-primary-600 shadow-lg transition-all hover:bg-gray-50 hover:shadow-xl active:scale-[0.98]"
            >
              Create Free Account
              <ArrowRight className="h-5 w-5" />
            </button>
            <button
              onClick={handleGoogleSignUp}
              disabled={loading}
              className="flex items-center justify-center gap-3 rounded-xl border-2 border-white/30 bg-white/10 px-8 py-4 text-lg font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20 active:scale-[0.98] disabled:opacity-50"
            >
              <svg className="h-6 w-6" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Sign up with Google
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-8">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900">Clarify</span>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
              <button onClick={() => navigate('/faq')} className="transition-colors hover:text-primary-600">FAQ</button>
              <a href="#" className="transition-colors hover:text-primary-600">About</a>
              <a href="#" className="transition-colors hover:text-primary-600">Contact</a>
              <a href="#" className="transition-colors hover:text-primary-600">Privacy Policy</a>
              <a href="#" className="transition-colors hover:text-primary-600">Terms of Service</a>
            </div>
          </div>
          <div className="mt-6 text-center text-sm text-gray-500">
            © 2026 Clarify. Built for Code for Change Hackathon.
          </div>
        </div>
      </footer>
    </div>
  );
}
