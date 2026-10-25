import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const STORAGE_KEY_CUSTOM_CONFIG = 'careloop_firebase_custom_config';

export const getStoredFirebaseConfig = () => {
  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_CUSTOM_CONFIG);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.apiKey && parsed.projectId) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Could not parse custom Firebase config:', e);
    }
  }

  // Check Vite environment variables if available
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_FIREBASE_API_KEY && import.meta.env.VITE_FIREBASE_PROJECT_ID) {
    return {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.appspot.com`,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
      appId: import.meta.env.VITE_FIREBASE_APP_ID || ''
    };
  }

  return null;
};

export const saveCustomFirebaseConfig = (config) => {
  if (!config || !config.apiKey || !config.projectId) {
    throw new Error('Valid apiKey and projectId are required');
  }
  localStorage.setItem(STORAGE_KEY_CUSTOM_CONFIG, JSON.stringify(config));
  window.location.reload();
};

export const clearCustomFirebaseConfig = () => {
  localStorage.removeItem(STORAGE_KEY_CUSTOM_CONFIG);
  window.location.reload();
};

// Initialize Firebase App
let firebaseApp = null;
let firebaseAuth = null;
let firestoreDb = null;
let googleAuthProvider = null;
let isConfigured = false;

const currentConfig = getStoredFirebaseConfig();

if (currentConfig && currentConfig.apiKey && currentConfig.projectId) {
  try {
    firebaseApp = getApps().length === 0 ? initializeApp(currentConfig) : getApp();
    firebaseAuth = getAuth(firebaseApp);
    firestoreDb = getFirestore(firebaseApp);
    googleAuthProvider = new GoogleAuthProvider();
    googleAuthProvider.setCustomParameters({ prompt: 'select_account' });
    isConfigured = true;
    console.info('Careloop: Connected to live Firebase project:', currentConfig.projectId);
  } catch (err) {
    console.error('Careloop: Firebase initialization failed, falling back to offline sandbox:', err);
    isConfigured = false;
  }
}

export { firebaseApp, firebaseAuth, firestoreDb, googleAuthProvider, isConfigured };
