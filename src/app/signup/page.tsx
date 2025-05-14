
// src/app/signup/page.tsx
"use client";

import { useState, type FormEvent, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, UserPlus, ChromeIcon } from 'lucide-react'; // Added ChromeIcon
import { useLanguage } from '@/contexts/language-context';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { signUp, signInWithGoogle, currentUser, loading: authLoading, error, setError, getRedirectUrl } = useAuth();
  const router = useRouter();
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);


  useEffect(() => {
    if (currentUser) {
      router.push(getRedirectUrl());
    }
  }, [currentUser, router, getRedirectUrl]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError(t('passwordsDontMatchError'));
      return;
    }
    setIsSubmitting(true);
    setError(null); 
    const user = await signUp(email, password);
    if (user) {
      router.push(getRedirectUrl()); 
    }
    setIsSubmitting(false);
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleSubmitting(true);
    setError(null);
    const user = await signInWithGoogle();
    if (user) {
      router.push(getRedirectUrl());
    }
    setIsGoogleSubmitting(false);
  };
  
  if (authLoading && !error) {
     return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  if (currentUser && !authLoading) {
     return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center py-12">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <UserPlus className="mx-auto h-12 w-12 text-primary mb-2" />
          <CardTitle className="text-3xl font-bold">{t('signupTitle')}</CardTitle>
          <CardDescription>{t('signupPrompt')}</CardDescription>
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
                placeholder={t('passwordPlaceholder')}
                required
                className="text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">{t('confirmPasswordLabel')}</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={t('confirmPasswordPlaceholder')}
                required
                className="text-base"
              />
            </div>
            {error && <p className="text-sm text-destructive text-center py-2">{error}</p>}
            <Button type="submit" className="w-full" disabled={isSubmitting || authLoading || isGoogleSubmitting}>
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <UserPlus className="mr-2 h-4 w-4" />
              )}
              {isSubmitting ? t('creatingAccountButton') : t('signupButton')}
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
            {t('signInWithGoogleButton')} 
          </Button>

        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-2 pt-6">
          <p className="text-sm text-muted-foreground">
            {t('alreadyHaveAccountPrompt')}{' '}
            <Button variant="link" asChild className="p-0 h-auto">
               <Link href={`/login${getRedirectUrl() !== '/' ? `?redirect=${encodeURIComponent(getRedirectUrl())}` : ''}`}>{t('loginLink')}</Link>
            </Button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
