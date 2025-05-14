
// src/app/login/page.tsx
"use client";

import { useState, type FormEvent, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, LogInIcon, ChromeIcon } from 'lucide-react'; 
import { useLanguage } from '@/contexts/language-context';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { logIn, signInWithGoogle, currentUser, loading: authLoading, authError, setAuthError, getRedirectUrl } = useAuth(); // authError, setAuthError
  const router = useRouter();
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);

  useEffect(() => {
    // If user is already logged in and not in the process of profile creation, redirect them.
    // The authLoading check ensures we don't redirect prematurely if profile is still loading.
    if (currentUser && !authLoading ) { 
      const redirectUrl = getRedirectUrl();
      // Avoid redirect loop if already on profile edit or if it's the intended redirect.
      if (redirectUrl !== '/profile/edit' || router.pathname !== '/profile/edit') {
         router.push(redirectUrl);
      }
    }
  }, [currentUser, authLoading, router, getRedirectUrl]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setAuthError(null); 
    await logIn(email, password); // AuthContext now handles redirection
    setIsSubmitting(false); // This might not be reached if redirection happens first
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleSubmitting(true);
    setAuthError(null);
    await signInWithGoogle(); // AuthContext now handles redirection
    setIsGoogleSubmitting(false); // Might not be reached
  };

  // Show loader if auth context is loading (either auth state or profile)
  // or if a submission is in progress.
  if (authLoading && !authError) { 
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // If already logged in and not loading, the useEffect above should handle redirection.
  // This state is mostly a fallback or for the brief moment before effect runs.
  if (currentUser && !authLoading) {
     return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-muted-foreground">{t('redirectingMessage') || 'Redirecting...'}</p>
      </div>
    );
  }


  return (
    <div className="flex justify-center items-center py-12">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <LogInIcon className="mx-auto h-12 w-12 text-primary mb-2" />
          <CardTitle className="text-3xl font-bold">{t('loginTitle')}</CardTitle>
          <CardDescription>{t('loginPrompt')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">{t('emailLabel')}</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t('passwordLabel')}</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="text-base"
              />
            </div>
            {authError && <p className="text-sm text-destructive text-center py-2">{authError}</p>}
            <Button type="submit" className="w-full" disabled={isSubmitting || authLoading || isGoogleSubmitting}>
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <LogInIcon className="mr-2 h-4 w-4" />
              )}
              {isSubmitting ? t('loggingInButton') : t('loginButton')}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                {t('orContinueWith')}
              </span>
            </div>
          </div>

          <Button 
            variant="outline" 
            className="w-full" 
            onClick={handleGoogleSignIn} 
            disabled={isSubmitting || authLoading || isGoogleSubmitting}
          >
            {isGoogleSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <ChromeIcon className="mr-2 h-4 w-4" />
            )}
            {isGoogleSubmitting ? t('signingInWithGoogleButton') : t('signInWithGoogleButton')} {/* Added new key */}
          </Button>

        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-2 pt-6">
          <p className="text-sm text-muted-foreground">
            {t('dontHaveAccountPrompt')}{' '}
            <Button variant="link" asChild className="p-0 h-auto">
              <Link href={`/signup${getRedirectUrl() !== '/' ? `?redirect=${encodeURIComponent(getRedirectUrl())}` : ''}`}>{t('signupLink')}</Link>
            </Button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
