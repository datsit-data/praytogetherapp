
// src/contexts/auth-context.tsx
"use client";

import type { ReactNode, Dispatch, SetStateAction } from 'react';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  getAuth, 
  onAuthStateChanged, 
  type User, 
  type AuthError,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup 
} from 'firebase/auth';
import { app } from '@/lib/firebase/client';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useLanguage } from './language-context';
import { getUserProfile, isNewUser as checkIsNewUserInFirestore } from '@/services/user-profile-service'; // Added
import type { UserProfile } from '@/types/user-profile'; // Added
import { Loader2 } from 'lucide-react';

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null; // Added
  loading: boolean; // Covers auth and profile loading
  authError: string | null; // Renamed from error to authError
  setAuthError: Dispatch<SetStateAction<string | null>>; // Renamed from setError
  signUp: (email: string, pass: string) => Promise<User | null>;
  logIn: (email: string, pass: string) => Promise<User | null>;
  signInWithGoogle: () => Promise<User | null>;
  logOut: () => Promise<void>;
  getRedirectUrl: () => string;
  refreshUserProfile: () => Promise<void>; // Added
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null); // Added
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const auth = getAuth(app); 
  const { t, setLocale } = useLanguage();

  const getRedirectUrl = useCallback(() => {
    return searchParams.get('redirect') || '/';
  }, [searchParams]);

  const handleAuthSuccess = useCallback(async (user: User, isNewSocialUser: boolean = false) => {
    setCurrentUser(user);
    setLoading(true); // Start loading profile
    try {
      const profile = await getUserProfile(user.uid);
      if (profile) {
        setUserProfile(profile);
        if (profile.preferredLanguage) {
          setLocale(profile.preferredLanguage); // Set app language from profile
        }
        // If profile exists, redirect to intended URL or home
        const redirectUrl = getRedirectUrl();
        // Avoid redirecting to /profile/edit if they already have a profile and are not on login/signup
        if (redirectUrl === '/profile/edit' && (pathname === '/login' || pathname === '/signup')) {
             router.push('/');
        } else {
            router.push(redirectUrl);
        }

      } else {
        // New user (or profile doesn't exist), redirect to profile creation
        setUserProfile(null); // Ensure profile is null
        const destination = `/profile/edit?isNewUser=true${getRedirectUrl() !== '/' ? `&redirectAfterProfile=${encodeURIComponent(getRedirectUrl())}` : ''}`;
        router.push(destination);
      }
    } catch (e) {
      console.error("Error fetching or handling profile:", e);
      setAuthError(t('profileFetchError'));
      // Fallback redirect if profile handling fails
      router.push('/'); 
    } finally {
      setLoading(false);
    }
  }, [router, getRedirectUrl, t, setLocale, pathname]);


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        if (!currentUser || currentUser.uid !== user.uid) { // Only run full logic if user changes
          setCurrentUser(user); // Set current user immediately
          setLoading(true);
          try {
            const profile = await getUserProfile(user.uid);
            setUserProfile(profile);
            if (profile && profile.preferredLanguage) {
              setLocale(profile.preferredLanguage);
            }
            // Do not redirect here as this is for initial load/auth state changes,
            // redirections are handled by login/signup methods.
          } catch (e) {
            console.error("Error fetching profile on auth state change:", e);
            setAuthError(t('profileFetchError'));
          } finally {
            setLoading(false);
          }
        } else {
           setLoading(false); // User is the same, no need to reload profile, just stop loading
        }
      } else {
        setCurrentUser(null);
        setUserProfile(null);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth]); // currentUser should not be in deps to avoid loops

  const refreshUserProfile = useCallback(async () => {
    if (currentUser) {
      setLoading(true);
      try {
        const profile = await getUserProfile(currentUser.uid);
        setUserProfile(profile);
        if (profile && profile.preferredLanguage) {
          setLocale(profile.preferredLanguage);
        }
      } catch (e) {
        console.error("Error refreshing user profile:", e);
        setAuthError(t('profileFetchError'));
      } finally {
        setLoading(false);
      }
    }
  }, [currentUser, t, setLocale]);

  const signUp = async (email: string, pass: string): Promise<User | null> => {
    setLoading(true);
    setAuthError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
      await handleAuthSuccess(userCredential.user); // Redirect to profile edit for new users
      return userCredential.user;
    } catch (err) {
      const authErr = err as AuthError;
      console.error("Signup error:", authErr);
      setAuthError(authErr.message || t('signupFailedError'));
      setLoading(false);
      return null;
    }
  };

  const logIn = async (email: string, pass: string): Promise<User | null> => {
    setLoading(true);
    setAuthError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, pass);
      await handleAuthSuccess(userCredential.user);
      return userCredential.user;
    } catch (err) {
      const authErr = err as AuthError;
      console.error("Login error:", authErr);
      setAuthError(authErr.message || t('loginFailedError'));
      setLoading(false);
      return null;
    }
  };

  const signInWithGoogle = async (): Promise<User | null> => {
    setLoading(true);
    setAuthError(null);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const isNew = await checkIsNewUserInFirestore(result.user.uid);
      await handleAuthSuccess(result.user, isNew);
      return result.user;
    } catch (err) {
      const authErr = err as AuthError;
      console.error("Google Sign-in error:", authErr);
      if (authErr.code === 'auth/popup-closed-by-user') {
        setAuthError(t('googlePopupClosedError'));
      } else {
        setAuthError(authErr.message || t('googleSignInFailedError'));
      }
      setLoading(false);
      return null;
    }
  };

  const logOut = async () => {
    setLoading(true);
    setAuthError(null);
    try {
      await signOut(auth);
      setCurrentUser(null);
      setUserProfile(null); // Clear profile on logout
      router.push('/login'); 
    } catch (err) {
       const authErr = err as AuthError;
       console.error("Logout error:", authErr);
       setAuthError(authErr.message || t('logoutFailedError'));
    } finally {
        setLoading(false);
    }
  };
  
  const value = {
    currentUser,
    userProfile, // Added
    loading,
    authError, // Renamed
    setAuthError, // Renamed
    signUp,
    logIn,
    signInWithGoogle,
    logOut,
    getRedirectUrl,
    refreshUserProfile, // Added
  };

  // Global loading indicator if needed, but generally handled by pages
  if (loading && !currentUser && (pathname === '/login' || pathname === '/signup' || pathname === '/profile/edit')) {
     // Don't show global loader on these pages, they have their own
  } else if (loading && (userProfile === undefined || (currentUser && userProfile === null && pathname !== '/profile/edit'))) {
    // Show a global loader if auth is done but profile is still loading,
    // or if user is logged in but profile is null and not on edit page (meaning redirect to edit is likely happening)
    return (
      <div className="flex justify-center items-center min-h-screen bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }


  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
