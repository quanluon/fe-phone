import { User as FirebaseAuthUser } from "firebase/auth";
import { authApi } from "@/lib/api/auth";
import {
  changeFirebasePassword,
  confirmFirebaseResetPassword,
  getCurrentFirebaseUser,
  registerWithFirebaseEmail,
  sendFirebaseResetPasswordEmail,
  signInWithFirebaseEmail,
  signInWithFirebaseFacebook,
  signInWithFirebaseGoogle,
  signOutFromFirebase,
  subscribeToFirebaseAuthState,
} from "@/lib/firebase/auth";
import { createPersistStorage, getErrorMessage } from "@/lib/utils";
import {
  AppProfile,
  AuthIdentity,
  AuthUser,
  ChangePasswordRequest,
  ForgotPasswordRequest,
  LoginRequest,
  RegisterRequest,
} from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  firebaseUser: FirebaseAuthUser | null;
  authIdentity: AuthIdentity | null;
  profile: AppProfile | null;
  user: AuthUser | null;
  adminApiKey: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  _hasHydrated: boolean;
  _isInitialized: boolean;
}

interface AuthActions {
  initializeAuth: () => void;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  socialLogin: (provider: "facebook" | "google") => Promise<void>;
  logout: () => Promise<void>;
  handleUnauthorized: () => Promise<void>;
  syncProfile: () => Promise<void>;
  updateProfile: (data: Partial<AppProfile>) => Promise<void>;
  forgotPassword: (data: ForgotPasswordRequest) => Promise<void>;
  resetPassword: (actionCode: string, newPassword: string) => Promise<void>;
  changePassword: (data: ChangePasswordRequest) => Promise<void>;
  clearError: () => void;
  clearSession: () => void;
  setUser: (user: AuthUser | null) => void;
  setAdminApiKey: (key: string | null) => void;
}

type AuthStore = AuthState & AuthActions;

let unsubscribeAuthObserver: (() => void) | null = null;
let activeSocialLoginRequest: Promise<void> | null = null;

function hasPersistedAuthSession(state: Pick<AuthState, "user" | "authIdentity" | "isAuthenticated">) {
  return Boolean(state.isAuthenticated || state.user || state.authIdentity);
}

function mapFirebaseUserToIdentity(firebaseUser: FirebaseAuthUser): AuthIdentity {
  const [firstName, ...remainingNameParts] = (firebaseUser.displayName || "").split(" ").filter(Boolean);
  const lastName = remainingNameParts.join(" ");

  return {
    uid: firebaseUser.uid,
    firebaseUid: firebaseUser.uid,
    authProviderUid: firebaseUser.uid,
    email: firebaseUser.email || "",
    firstName: firstName || undefined,
    lastName: lastName || undefined,
    fullName: firebaseUser.displayName || undefined,
    phone: firebaseUser.phoneNumber || undefined,
    profileImage: firebaseUser.photoURL || undefined,
    avatar: firebaseUser.photoURL || undefined,
    isEmailVerified: firebaseUser.emailVerified,
    isPhoneVerified: Boolean(firebaseUser.phoneNumber),
    createdAt: firebaseUser.metadata.creationTime || new Date().toISOString(),
    updatedAt: firebaseUser.metadata.lastSignInTime || new Date().toISOString(),
    lastLoginAt: firebaseUser.metadata.lastSignInTime || undefined,
  };
}

function mapFirebaseUserToAuthUser(firebaseUser: FirebaseAuthUser): AuthUser {
  const identity = mapFirebaseUserToIdentity(firebaseUser);

  return {
    _id: identity.uid,
    firebaseUid: identity.firebaseUid,
    authProviderUid: identity.authProviderUid,
    email: identity.email,
    firstName: identity.firstName,
    lastName: identity.lastName,
    fullName: identity.fullName,
    phone: identity.phone,
    profileImage: identity.profileImage,
    avatar: identity.avatar,
    type: "customer",
    role: "user",
    status: "active",
    isEmailVerified: identity.isEmailVerified,
    isPhoneVerified: identity.isPhoneVerified,
    createdAt: identity.createdAt,
    updatedAt: identity.updatedAt,
    lastLoginAt: identity.lastLoginAt,
  };
}

function mergeAuthProfile(firebaseUser: FirebaseAuthUser, profile: Partial<AuthUser> | null): AuthUser {
  return {
    ...mapFirebaseUserToAuthUser(firebaseUser),
    ...(profile || {}),
    _id: profile?._id || firebaseUser.uid,
    email: profile?.email || firebaseUser.email || "",
    firebaseUid: profile?.firebaseUid || firebaseUser.uid,
    authProviderUid: profile?.authProviderUid || firebaseUser.uid,
    isEmailVerified: profile?.isEmailVerified ?? firebaseUser.emailVerified,
    isPhoneVerified: profile?.isPhoneVerified ?? Boolean(firebaseUser.phoneNumber),
    profileImage: profile?.profileImage || profile?.avatar || firebaseUser.photoURL || undefined,
  };
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      firebaseUser: null,
      authIdentity: null,
      profile: null,
      user: null,
      adminApiKey: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      _hasHydrated: false,
      _isInitialized: false,

      initializeAuth: () => {
        if (unsubscribeAuthObserver) {
          set({ _isInitialized: true, _hasHydrated: true });
          return;
        }

        set({ isLoading: true });

        unsubscribeAuthObserver = subscribeToFirebaseAuthState(async (firebaseUser) => {
          if (!firebaseUser) {
            get().clearSession();
            set({ _isInitialized: true, _hasHydrated: true });
            return;
          }

          set({
            firebaseUser,
            authIdentity: mapFirebaseUserToIdentity(firebaseUser),
            profile: null,
            user: mapFirebaseUserToAuthUser(firebaseUser),
            isAuthenticated: true,
            isLoading: true,
            error: null,
            _isInitialized: true,
            _hasHydrated: true,
          });

          await get().syncProfile();
        });
      },

      login: async (credentials: LoginRequest) => {
        set({ isLoading: true, error: null });
        try {
          const credential = await signInWithFirebaseEmail(credentials);
          const authIdentity = mapFirebaseUserToIdentity(credential.user);
          set({
            firebaseUser: credential.user,
            authIdentity,
            profile: null,
            user: mapFirebaseUserToAuthUser(credential.user),
            isAuthenticated: true,
          });
          await get().syncProfile();
        } catch (error: unknown) {
          set({
            firebaseUser: null,
            authIdentity: null,
            profile: null,
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: getErrorMessage(error) || "Đăng nhập thất bại",
          });
          throw error;
        }
      },

      register: async (data: RegisterRequest) => {
        set({ isLoading: true, error: null });
        try {
          const credential = await registerWithFirebaseEmail(data);
          const firebaseUser = credential.user;
          const authIdentity = mapFirebaseUserToIdentity(firebaseUser);

          set({
            firebaseUser,
            authIdentity,
            profile: null,
            user: mapFirebaseUserToAuthUser(firebaseUser),
            isAuthenticated: true,
          });

          try {
            await authApi.updateProfile({
              firebaseUid: firebaseUser.uid,
              email: firebaseUser.email || data.email,
              firstName: data.firstName,
              lastName: data.lastName,
              phone: data.phone,
            });
          } catch {
            // Backend may auto-provision profile on first authenticated profile fetch.
          }

          await get().syncProfile();
        } catch (error: unknown) {
          set({
            firebaseUser: null,
            authIdentity: null,
            profile: null,
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: getErrorMessage(error) || "Đăng ký thất bại",
          });
          throw error;
        }
      },

      socialLogin: async (provider: "facebook" | "google") => {
        if (activeSocialLoginRequest) {
          return activeSocialLoginRequest;
        }

        set({ isLoading: true, error: null });
        activeSocialLoginRequest = (async () => {
          try {
            const credential =
              provider === "google"
                ? await signInWithFirebaseGoogle()
                : await signInWithFirebaseFacebook();
            const authIdentity = mapFirebaseUserToIdentity(credential.user);

            set({
              firebaseUser: credential.user,
              authIdentity,
              profile: null,
              user: mapFirebaseUserToAuthUser(credential.user),
              isAuthenticated: true,
            });

            await get().syncProfile();
          } catch (error: unknown) {
            set({
              firebaseUser: null,
              authIdentity: null,
              profile: null,
              user: null,
              isAuthenticated: false,
              isLoading: false,
              error: getErrorMessage(error) || "Đăng nhập bằng mạng xã hội thất bại",
            });
            throw error;
          } finally {
            activeSocialLoginRequest = null;
          }
        })();

        return activeSocialLoginRequest;
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          await signOutFromFirebase();
        } finally {
          get().clearSession();
        }
      },

      handleUnauthorized: async () => {
        get().clearSession();
        const firebaseUser = getCurrentFirebaseUser();
        if (firebaseUser) {
          try {
            await signOutFromFirebase();
          } catch {
            // Ignore sign-out failures during unauthorized cleanup.
          }
        }
      },

      syncProfile: async () => {
        const firebaseUser = get().firebaseUser || getCurrentFirebaseUser();

        if (!firebaseUser) {
          get().clearSession();
          return;
        }

        set({ isLoading: true, error: null });

        try {
          const response = await authApi.getProfile();
          set({
            firebaseUser,
            authIdentity: mapFirebaseUserToIdentity(firebaseUser),
            profile: response.data,
            user: mergeAuthProfile(firebaseUser, response.data),
            isAuthenticated: true,
            isLoading: false,
            error: null,
            _hasHydrated: true,
          });
        } catch (error: unknown) {
          set({
            firebaseUser,
            authIdentity: mapFirebaseUserToIdentity(firebaseUser),
            profile: null,
            user: mapFirebaseUserToAuthUser(firebaseUser),
            isAuthenticated: true,
            isLoading: false,
            error: getErrorMessage(error) || null,
            _hasHydrated: true,
          });
        }
      },

      updateProfile: async (data: Partial<AppProfile>) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authApi.updateProfile(data);
          const firebaseUser = get().firebaseUser || getCurrentFirebaseUser();
          set({
            firebaseUser,
            authIdentity: firebaseUser ? mapFirebaseUserToIdentity(firebaseUser) : get().authIdentity,
            profile: response.data,
            user: firebaseUser ? mergeAuthProfile(firebaseUser, response.data) : response.data,
            isLoading: false,
            error: null,
          });
        } catch (error: unknown) {
          set({
            isLoading: false,
            error: getErrorMessage(error) || "Failed to update profile",
          });
          throw error;
        }
      },

      forgotPassword: async (data: ForgotPasswordRequest) => {
        await sendFirebaseResetPasswordEmail(data.email);
      },

      resetPassword: async (actionCode: string, newPassword: string) => {
        await confirmFirebaseResetPassword(actionCode, newPassword);
      },

      changePassword: async (data: ChangePasswordRequest) => {
        await changeFirebasePassword(data);
      },

      clearError: () => {
        set({ error: null });
      },

      clearSession: () => {
        set({
          firebaseUser: null,
          authIdentity: null,
          profile: null,
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
          _hasHydrated: true,
        });
      },

      setUser: (user: AuthUser | null) => {
        set((state) => ({
          user,
          profile: user,
          isAuthenticated: Boolean(user || state.firebaseUser || state.authIdentity),
        }));
      },

      setAdminApiKey: (key: string | null) => {
        set({ adminApiKey: key });
      },
    }),
    {
      name: "auth-storage",
      storage: createPersistStorage(),
      partialize: (state) => ({
        authIdentity: state.authIdentity,
        profile: state.profile,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        adminApiKey: state.adminApiKey,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          const hasPersistedSession = hasPersistedAuthSession(state);
          state.isLoading = false;
          state.error = null;
          state.isAuthenticated = hasPersistedSession;
          state._hasHydrated = true;
        }
      },
    }
  )
);
