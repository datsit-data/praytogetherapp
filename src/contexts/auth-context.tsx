
// src/contexts/auth-context.tsx
"use client";

import type { ReactNode, Dispatch, SetStateAction } from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import { 
  getAuth, 
  onAuthStateChanged, 
  type User, 
  type AuthError,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import { app } from '@/lib/firebase/client'; // Use the initialized app
import { useRouter } from 'next/navigation';
import { useLanguage } from './language-context';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  error: string | null;
  setError: Dispatch<SetStateAction<string | null>>;
  signUp: (email: string, pass: string) => Promise<User | null>;
  logIn: (email: string, pass: string) => Promise<User | null>;
  logOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const auth = getAuth(app); // Get auth instance from our initialized app
  const { t } = useLanguage();


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [auth]);

  const signUp = async (email: string, pass: string): Promise<User | null> => {
    setLoading(true);
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
      setCurrentUser(userCredential.user);
      setLoading(false);
      return userCredential.user;
    } catch (err) {
      const authError = err as AuthError;
      console.error("Signup error:", authError);
      setError(authError.message || t('signupFailedError'));
      setLoading(false);
      return null;
    }
  };

  const logIn = async (email: string, pass: string): Promise<User | null> => {
    setLoading(true);
    setError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, pass);
      setCurrentUser(userCredential.user);
      setLoading(false);
      return userCredential.user;
    } catch (err) {
      const authError = err as AuthError;
      console.error("Login error:", authError);
       setError(authError.message || t('loginFailedError'));
      setLoading(false);
      return null;
    }
  };

  const logOut = async () => {
    setLoading(true);
    setError(null);
    try {
      await signOut(auth);
      setCurrentUser(null);
      router.push('/login'); // Redirect to login after logout
    } catch (err) {
       const authError = err as AuthError;
       console.error("Logout error:", authError);
       setError(authError.message || t('logoutFailedError'));
    } finally {
        setLoading(false);
    }
  };
  

  const value = {
    currentUser,
    loading,
    error,
    setError,
    signUp,
    logIn,
    logOut,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
