import { create } from 'zustand';
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '../config/firebase';
import type { UserProfile, SupportedLanguage } from '../types';

interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  initialized: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, age?: number, gradeLevel?: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateLanguage: (language: SupportedLanguage) => Promise<void>;
  init: () => () => void;
}

async function ensureUserProfile(user: User, age?: number, gradeLevel?: string): Promise<UserProfile> {
  const ref = doc(db, 'users', user.uid);
  const snap = await getDoc(ref);
  if (snap.exists()) {
    const data = snap.data() as UserProfile;
    // Provide defaults for existing users without age/gradeLevel
    if (!data.gradeLevel) {
      await setDoc(ref, { gradeLevel: 'College' }, { merge: true });
      data.gradeLevel = 'College';
    }
    return data;
  }
  const profile: UserProfile = {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    selectedLanguage: null,
    age,
    gradeLevel: gradeLevel || 'College',
    createdAt: Date.now(),
  };
  await setDoc(ref, profile);
  return profile;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  loading: false,
  initialized: false,

  signInWithGoogle: async () => {
    set({ loading: true });
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const profile = await ensureUserProfile(result.user);
      set({ user: result.user, profile, loading: false });
    } catch {
      set({ loading: false });
      throw new Error('Google sign-in failed');
    }
  },

  signInWithEmail: async (email, password) => {
    set({ loading: true });
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const profile = await ensureUserProfile(result.user);
      set({ user: result.user, profile, loading: false });
    } catch {
      set({ loading: false });
      throw new Error('Sign-in failed. Check your email and password.');
    }
  },

  signUpWithEmail: async (email, password, age, gradeLevel) => {
    set({ loading: true });
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const profile = await ensureUserProfile(result.user, age, gradeLevel);
      set({ user: result.user, profile, loading: false });
    } catch {
      set({ loading: false });
      throw new Error('Sign-up failed. Email may already be in use.');
    }
  },

  signOut: async () => {
    await firebaseSignOut(auth);
    set({ user: null, profile: null });
  },

  updateLanguage: async (language) => {
    const { user } = get();
    if (!user) return;
    const ref = doc(db, 'users', user.uid);
    await setDoc(ref, { selectedLanguage: language }, { merge: true });
    set((state) => ({
      profile: state.profile ? { ...state.profile, selectedLanguage: language } : null,
    }));
  },

  init: () => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const profile = await ensureUserProfile(user);
        set({ user, profile, initialized: true, loading: false });
      } else {
        set({ user: null, profile: null, initialized: true, loading: false });
      }
    });
    return unsubscribe;
  },
}));
