'use client';

import { FirebaseApp, FirebaseOptions, getApp, getApps, initializeApp } from 'firebase/app';
import { Analytics, getAnalytics, isSupported } from 'firebase/analytics';
import { Auth, getAuth } from 'firebase/auth';
import { logger } from '@/lib/utils/logger';

type FirebaseClientState = {
  app: FirebaseApp | null;
  analytics: Analytics | null;
  auth: Auth | null;
  initialized: boolean;
};

type SocialAuthProvider = 'google' | 'facebook';

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
  auth: null,
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

function parseBooleanEnv(value?: string) {
  if (!value) {
    return false;
  }

  return ['1', 'true', 'yes', 'on'].includes(value.trim().toLowerCase());
}

export function isFirebaseAuthConfigured() {
  return hasFirebaseConfig();
}

export function isFirebaseProviderEnabled(provider: SocialAuthProvider) {
  if (!hasFirebaseConfig()) {
    return false;
  }

  const envMap: Record<SocialAuthProvider, string | undefined> = {
    google: process.env.NEXT_PUBLIC_FIREBASE_ENABLE_GOOGLE_AUTH,
    facebook: process.env.NEXT_PUBLIC_FIREBASE_ENABLE_FACEBOOK_AUTH,
  };

  return parseBooleanEnv(envMap[provider]);
}

export function getEnabledFirebaseProviders(): SocialAuthProvider[] {
  return (['google', 'facebook'] as const).filter((provider) =>
    isFirebaseProviderEnabled(provider)
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

export function getFirebaseAuth(): Auth | null {
  if (state.auth) {
    return state.auth;
  }

  const app = getFirebaseApp();
  if (!app) {
    return null;
  }

  state.auth = getAuth(app);
  return state.auth;
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
