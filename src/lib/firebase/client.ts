'use client';

import { FirebaseApp, FirebaseOptions, getApp, getApps, initializeApp } from 'firebase/app';
import { Analytics, getAnalytics, isSupported } from 'firebase/analytics';
import { logger } from '@/lib/utils/logger';

type FirebaseClientState = {
  app: FirebaseApp | null;
  analytics: Analytics | null;
  initialized: boolean;
};

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const state: FirebaseClientState = {
  app: null,
  analytics: null,
  initialized: false,
};

function hasFirebaseConfig() {
  return Boolean(
    firebaseConfig.apiKey &&
      firebaseConfig.authDomain &&
      firebaseConfig.projectId &&
      firebaseConfig.storageBucket &&
      firebaseConfig.messagingSenderId &&
      firebaseConfig.appId &&
      firebaseConfig.measurementId
  );
}

export function isFirebaseAnalyticsEnabled() {
  return hasFirebaseConfig();
}

export function getFirebaseApp(): FirebaseApp | null {
  if (!hasFirebaseConfig()) {
    return null;
  }

  if (state.app) {
    return state.app;
  }

  state.app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  return state.app;
}

export async function getFirebaseAnalytics(): Promise<Analytics | null> {
  if (state.initialized) {
    return state.analytics;
  }

  state.initialized = true;

  if (typeof window === 'undefined' || !hasFirebaseConfig()) {
    return null;
  }

  try {
    const supported = await isSupported();
    if (!supported) {
      return null;
    }

    const app = getFirebaseApp();
    if (!app) {
      return null;
    }

    state.analytics = getAnalytics(app);
    return state.analytics;
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      logger.warn({ error }, 'Firebase Analytics initialization skipped');
    }

    state.analytics = null;
    return null;
  }
}
