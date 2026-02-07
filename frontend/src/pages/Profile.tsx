import { useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useAppStore } from '../stores/appStore';
import LanguageSelector from '../components/LanguageSelector';
import { GRADE_LEVELS } from '../types';
import { LogOut, User, ChevronDown, ChevronUp, Camera, Edit2, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';
import type { SupportedLanguage } from '../types';
import { useNavigate } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export default function Profile() {
  const { user, profile, signOut, updateLanguage } = useAuthStore();
  const { reset, hintsMode, setHintsMode } = useAppStore();
  const navigate = useNavigate();

  const [languageExpanded, setLanguageExpanded] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [editedName, setEditedName] = useState(profile?.displayName || '');
  const [editedAge, setEditedAge] = useState(profile?.age?.toString() || '');
  const [editedGrade, setEditedGrade] = useState(profile?.gradeLevel || '');

  const handleSignOut = async () => {
    try {
      reset();
      await signOut();
      navigate('/');
    } catch {
      toast.error('Sign out failed');
    }
  };

  const handleLanguageSelect = async (lang: SupportedLanguage) => {
    try {
      await updateLanguage(lang);
      toast.success('Language updated');
      setLanguageExpanded(false);
    } catch {
      toast.error('Failed to update language');
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    try {
      const updates: any = {
        displayName: editedName || null,
      };

      if (editedAge) {
        const ageNum = parseInt(editedAge);
        if (ageNum >= 6 && ageNum <= 100) {
          updates.age = ageNum;
        } else {
          toast.error('Age must be between 6 and 100');
          return;
        }
      } else {
        updates.age = null;
      }

      if (editedGrade) {
        updates.gradeLevel = editedGrade;
      }

      await updateDoc(doc(db, 'users', user.uid), updates);

      // Update local state
      const updatedProfile = { ...profile, ...updates };
      useAuthStore.setState({ profile: updatedProfile as any });

      setEditingProfile(false);
      toast.success('Profile updated');
    } catch (err) {
      console.error('Profile update failed:', err);
      toast.error('Failed to update profile');
    }
  };

  const handleCancelEdit = () => {
    setEditedName(profile?.displayName || '');
    setEditedAge(profile?.age?.toString() || '');
    setEditedGrade(profile?.gradeLevel || '');
    setEditingProfile(false);
  };

  return (
    <div className="mx-auto max-w-lg px-5 py-6 pb-20">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Profile & Settings</h1>

      {/* User Info Card */}
      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5">
        <div className="mb-4 flex items-start gap-4">
          <div className="relative">
            {profile?.photoURL ? (
              <img
                src={profile.photoURL}
                alt="Avatar"
                className="h-16 w-16 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-100">
                <User className="h-8 w-8 text-primary-600" />
              </div>
            )}
            <button
              className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-primary-600 text-white shadow-md transition-transform hover:scale-110"
              onClick={() => toast('Photo upload coming soon!')}
            >
              <Camera className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1">
            {editingProfile ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  placeholder="Your name"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                />
                <p className="text-xs text-gray-500">{profile?.email}</p>
              </div>
            ) : (
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {profile?.displayName || 'Student'}
                </h2>
                <p className="text-sm text-gray-500">{profile?.email}</p>
              </div>
            )}
          </div>

          {!editingProfile && (
            <button
              onClick={() => setEditingProfile(true)}
              className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            >
              <Edit2 className="h-4 w-4" />
            </button>
          )}
        </div>

        {editingProfile && (
          <div className="space-y-3 border-t border-gray-100 pt-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Age (optional)</label>
              <input
                type="number"
                value={editedAge}
                onChange={(e) => setEditedAge(e.target.value)}
                placeholder="6+"
                min={6}
                max={100}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Grade Level</label>
              <select
                value={editedGrade}
                onChange={(e) => setEditedGrade(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
              >
                <option value="">Select grade level</option>
                {GRADE_LEVELS.map((grade) => (
                  <option key={grade} value={grade}>
                    {grade}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSaveProfile}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
              >
                <Save className="h-4 w-4" />
                Save
              </button>
              <button
                onClick={handleCancelEdit}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                <X className="h-4 w-4" />
                Cancel
              </button>
            </div>
          </div>
        )}

        {!editingProfile && (profile?.age || profile?.gradeLevel) && (
          <div className="mt-3 flex gap-2 border-t border-gray-100 pt-3">
            {profile.age && (
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
                Age {profile.age}
              </span>
            )}
            {profile.gradeLevel && (
              <span className="rounded-full bg-primary-100 px-3 py-1 text-xs text-primary-700">
                {profile.gradeLevel}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Language Preference - Collapsible */}
      <div className="mb-6 rounded-xl border border-gray-200 bg-white">
        <button
          onClick={() => setLanguageExpanded(!languageExpanded)}
          className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-gray-50"
        >
          <div>
            <h3 className="font-semibold text-gray-900">Preferred Language</h3>
            <p className="text-sm text-gray-500">
              {profile?.selectedLanguage
                ? `Explanations in ${profile.selectedLanguage.charAt(0).toUpperCase() + profile.selectedLanguage.slice(1)}`
                : 'Select your language'}
            </p>
          </div>
          {languageExpanded ? (
            <ChevronUp className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-400" />
          )}
        </button>
        {languageExpanded && (
          <div className="border-t border-gray-100 p-4">
            <LanguageSelector
              selected={profile?.selectedLanguage ?? null}
              onSelect={handleLanguageSelect}
            />
          </div>
        )}
      </div>

      {/* App Settings */}
      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4">
        <h3 className="mb-3 font-semibold text-gray-900">App Settings</h3>
        <div className="space-y-3">
          {/* Hints Mode Default */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Hints Mode by Default</p>
              <p className="text-xs text-gray-500">Get hints instead of full solutions</p>
            </div>
            <button
              onClick={() => setHintsMode(!hintsMode)}
              className={`relative h-6 w-11 rounded-full transition-colors ${
                hintsMode ? 'bg-primary-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`absolute top-1 left-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                  hintsMode ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Sign Out - Less Prominent */}
      <button
        onClick={handleSignOut}
        className="mx-auto flex items-center gap-2 px-4 py-2 text-sm text-gray-500 transition-colors hover:text-red-600"
      >
        <LogOut className="h-4 w-4" />
        Sign Out
      </button>
    </div>
  );
}
