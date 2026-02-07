import { useAuthStore } from '../stores/authStore';
import { useAppStore } from '../stores/appStore';
import LanguageSelector from '../components/LanguageSelector';
import { LogOut, User } from 'lucide-react';
import toast from 'react-hot-toast';
import type { SupportedLanguage } from '../types';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { profile, signOut, updateLanguage } = useAuthStore();
  const { reset } = useAppStore();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      reset();
      await signOut();
      navigate('/login');
    } catch {
      toast.error('Sign out failed');
    }
  };

  const handleLanguageSelect = async (lang: SupportedLanguage) => {
    try {
      await updateLanguage(lang);
      toast.success('Language updated');
    } catch {
      toast.error('Failed to update language');
    }
  };

  return (
    <div className="mx-auto max-w-lg px-5 py-6">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Profile</h1>

      {/* User Info */}
      <div className="mb-8 flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4">
        {profile?.photoURL ? (
          <img
            src={profile.photoURL}
            alt="Avatar"
            className="h-14 w-14 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-100">
            <User className="h-7 w-7 text-primary-600" />
          </div>
        )}
        <div className="min-w-0">
          <h2 className="truncate text-base font-semibold text-gray-900">
            {profile?.displayName || 'Student'}
          </h2>
          <p className="truncate text-sm text-gray-500">{profile?.email}</p>
        </div>
      </div>

      {/* Language Preference */}
      <div className="mb-8">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-400">
          Preferred Language
        </h2>
        <LanguageSelector
          selected={profile?.selectedLanguage ?? null}
          onSelect={handleLanguageSelect}
        />
      </div>

      {/* Sign Out */}
      <button
        onClick={handleSignOut}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-3 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 active:scale-[0.98]"
      >
        <LogOut className="h-4 w-4" />
        Sign Out
      </button>
    </div>
  );
}
