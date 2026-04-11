'use client';

import {
  EmailAuthProvider,
  FacebookAuthProvider,
  GoogleAuthProvider,
  User,
  UserCredential,
  confirmPasswordReset,
  onAuthStateChanged,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updatePassword,
  updateProfile,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { ChangePasswordRequest, LoginRequest, RegisterRequest } from '@/types';
import { getFirebaseAuth } from './client';

function getRequiredAuth() {
  const auth = getFirebaseAuth();
  if (!auth) {
    throw new Error('Firebase Auth is not configured');
  }

  return auth;
}

export function subscribeToFirebaseAuthState(callback: (user: User | null) => void) {
  return onAuthStateChanged(getRequiredAuth(), callback);
}

export async function signInWithFirebaseEmail(credentials: LoginRequest): Promise<UserCredential> {
  return signInWithEmailAndPassword(getRequiredAuth(), credentials.email, credentials.password);
}

export async function registerWithFirebaseEmail(data: RegisterRequest): Promise<UserCredential> {
  const credential = await createUserWithEmailAndPassword(getRequiredAuth(), data.email, data.password);

  const displayName = [data.firstName, data.lastName].filter(Boolean).join(' ').trim();
  if (displayName || data.phone) {
    await updateProfile(credential.user, {
      displayName: displayName || credential.user.displayName,
    });
  }

  return credential;
}

export async function signInWithFirebaseGoogle(): Promise<UserCredential> {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  return signInWithPopup(getRequiredAuth(), provider);
}

export async function signInWithFirebaseFacebook(): Promise<UserCredential> {
  const provider = new FacebookAuthProvider();
  provider.addScope('email');
  return signInWithPopup(getRequiredAuth(), provider);
}

export async function signOutFromFirebase() {
  await signOut(getRequiredAuth());
}

export async function sendFirebaseResetPasswordEmail(email: string) {
  await sendPasswordResetEmail(getRequiredAuth(), email);
}

export async function confirmFirebaseResetPassword(actionCode: string, newPassword: string) {
  await confirmPasswordReset(getRequiredAuth(), actionCode, newPassword);
}

export async function changeFirebasePassword(data: ChangePasswordRequest) {
  const auth = getRequiredAuth();
  const currentUser = auth.currentUser;

  if (!currentUser || !currentUser.email) {
    throw new Error('No authenticated Firebase user found');
  }

  const credential = EmailAuthProvider.credential(currentUser.email, data.currentPassword);
  await reauthenticateWithCredential(currentUser, credential);
  await updatePassword(currentUser, data.newPassword);
}

export async function getFirebaseIdToken(forceRefresh: boolean = false): Promise<string | null> {
  const auth = getFirebaseAuth();
  const currentUser = auth?.currentUser;

  if (!currentUser) {
    return null;
  }

  return currentUser.getIdToken(forceRefresh);
}

export function getCurrentFirebaseUser() {
  return getFirebaseAuth()?.currentUser || null;
}
