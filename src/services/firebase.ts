import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import type { Auth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import type { Firestore } from 'firebase/firestore';

// Mock values if variables are missing
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "mock-api-key-123456",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "fifa-smarthub-ai.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "fifa-smarthub-ai",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "fifa-smarthub-ai.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1234567890",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456:web:123456"
};

// Initialize Firebase (safely catch errors if config is bad)
let app;
let auth: Auth | null = null;
let db: Firestore | null = null;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} catch (error) {
  console.warn("Firebase initialization failed, using mock auth/db context:", error);
}

export { auth, db };

// Firebase helper mocks for guest access
export const signInWithGoogleMock = async (role: string) => {
  return {
    user: {
      uid: `google-user-${role}-${Math.random().toString(36).substr(2, 9)}`,
      displayName: `FIFA Google ${role.charAt(0).toUpperCase() + role.slice(1)}`,
      email: `${role}-google@fifa.com`,
      photoURL: `https://api.dicebear.com/7.x/adventurer/svg?seed=${role}`,
    }
  };
};

export const signInGuestMock = async (role: string) => {
  return {
    user: {
      uid: `guest-user-${role}-${Math.random().toString(36).substr(2, 9)}`,
      displayName: `Guest ${role.charAt(0).toUpperCase() + role.slice(1)}`,
      email: `${role}-guest@fifa.com`,
      photoURL: `https://api.dicebear.com/7.x/bottts/svg?seed=${role}`,
    }
  };
};
