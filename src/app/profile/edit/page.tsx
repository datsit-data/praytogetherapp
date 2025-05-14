// src/app/profile/edit/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/contexts/auth-context';
import { useLanguage } from '@/contexts/language-context';
import { UserProfileSchema, type UserProfile, RELIGIONS, BIBLE_VERSIONS_SUPPORTED, getBibleVersionsForLanguage } from '@/types/user-profile';
import type { Locale } from '@/lib/i18n';
import { saveUserProfile } from '@/services/user-profile-service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, UserCog, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type UserProfileFormData = Omit<UserProfile, 'uid' | 'createdAt' | 'updatedAt'>;

export default function EditProfilePage() {
  const { currentUser, userProfile, loading: authLoading, refreshUserProfile } = useAuth();
  const { t, locale, setLocale } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const isNewUser = searchParams.get('isNewUser') === 'true';
  const redirectAfterProfile = searchParams.get('redirectAfterProfile') || '/';

  const defaultValues: Partial<UserProfileFormData> = {
    name: userProfile?.name ?? currentUser?.displayName ?? '',
    photoURL: userProfile?.photoURL ?? currentUser?.photoURL ?? '',
    bio: userProfile?.bio ?? '',
    religion: userProfile?.religion ?? '',
    country: userProfile?.country ?? '',
    city: userProfile?.city ?? '',
    preferredLanguage: userProfile?.preferredLanguage ?? locale,
    preferredBibleVersion: userProfile?.preferredBibleVersion ?? (getBibleVersionsForLanguage(userProfile?.preferredLanguage ?? locale)[0]?.id || ''),
  };

  const { register, handleSubmit, control, watch, setValue, formState: { errors } } = useForm<UserProfileFormData>({
    resolver: zodResolver(UserProfileSchema.omit({ uid: true, createdAt: true, updatedAt: true })),
    defaultValues,
  });

  const selectedLanguage = watch('preferredLanguage', userProfile?.preferredLanguage ?? locale);
  const availableBibleVersions = getBibleVersionsForLanguage(selectedLanguage);

  useEffect(() => {
    if (!authLoading && !currentUser) {
      router.push('/login?redirect=/profile/edit');
    }
  }, [authLoading, currentUser, router]);

  useEffect(() => {
    // Reset form with profile data once it loads, or if currentUser changes
    if (currentUser) {
        setValue('name', userProfile?.name ?? currentUser.displayName ?? '');
        setValue('photoURL', userProfile?.photoURL ?? currentUser.photoURL ?? '');
        setValue('bio', userProfile?.bio ?? '');
        setValue('religion', userProfile?.religion ?? '');
        setValue('country', userProfile?.country ?? '');
        setValue('city', userProfile?.city ?? '');
        setValue('preferredLanguage', userProfile?.preferredLanguage ?? locale);
        const currentBibleVersion = userProfile?.preferredBibleVersion ?? '';
        const langForBible = userProfile?.preferredLanguage ?? locale;
        const biblesForLang = getBibleVersionsForLanguage(langForLang);
        
        if (biblesForLang.find(b => b.id === currentBibleVersion)) {
            setValue('preferredBibleVersion', currentBibleVersion);
        } else {
            setValue('preferredBibleVersion', biblesForLang[0]?.id ?? '');
        }
    }
  }, [userProfile, currentUser, setValue, locale]);

  useEffect(() => {
    const bibles = getBibleVersionsForLanguage(selectedLanguage);
    if (bibles.length > 0 && !bibles.find(b => b.id === watch('preferredBibleVersion'))) {
      setValue('preferredBibleVersion', bibles[0].id);
    } else if (bibles.length === 0) {
      setValue('preferredBibleVersion', '');
    }
  }, [selectedLanguage, setValue, watch]);


  const onSubmit: SubmitHandler<UserProfileFormData> = async (data) => {
    if (!currentUser) {
      toast({ title: t('error'), description: t('mustBeLoggedInToSaveProfile'), variant: 'destructive' });
      return;
    }
    setIsSubmitting(true);
    try {
      await saveUserProfile(currentUser.uid, data);
      await refreshUserProfile(); // Refresh context with new profile data
      if (data.preferredLanguage) {
        setLocale(data.preferredLanguage as Locale); // Update app language immediately
      }
      toast({ title: t('profileSavedTitle'), description: t('profileSavedDescription') });
      router.push(isNewUser ? redirectAfterProfile : '/'); // Redirect home or to original destination
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({ title: t('errorSavingProfileTitle'), description: (error as Error).message || t('errorSavingProfileDescription'), variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || (!currentUser && !authLoading)) { // Show loader if auth is loading OR if no user and not done loading auth
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="flex justify-center items-center py-12">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader className="text-center">
          <UserCog className="mx-auto h-12 w-12 text-primary mb-2" />
          <CardTitle className="text-3xl font-bold">{isNewUser ? t('completeYourProfileTitle') : t('editProfileTitle')}</CardTitle>
          <CardDescription>{isNewUser ? t('completeYourProfileDescription') : t('editProfileDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">{t('profileNameLabel')}</Label>
                <Input id="name" {...register('name')} />
                {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="photoURL">{t('profilePhotoUrlLabel')}</Label>
                <Input id="photoURL" type="url" {...register('photoURL')} placeholder="https://example.com/your-photo.jpg"/>
                {errors.photoURL && <p className="text-sm text-destructive">{errors.photoURL.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">{t('profileBioLabel')}</Label>
              <Textarea id="bio" {...register('bio')} rows={3} placeholder={t('profileBioPlaceholder')} />
              {errors.bio && <p className="text-sm text-destructive">{errors.bio.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="religion">{t('profileReligionLabel')} <span className="text-destructive">*</span></Label>
                <Select onValueChange={(value) => setValue('religion', value, { shouldValidate: true })} value={watch('religion')}>
                  <SelectTrigger id="religion"><SelectValue placeholder={t('profileReligionPlaceholder')} /></SelectTrigger>
                  <SelectContent>
                    {RELIGIONS.map(r => <SelectItem key={r.id} value={r.id}>{t(r.id as any) || r.name}</SelectItem>)}
                  </SelectContent>
                </Select>
                {errors.religion && <p className="text-sm text-destructive">{errors.religion.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">{t('profileCountryLabel')}</Label>
                <Input id="country" {...register('country')} placeholder={t('profileCountryPlaceholder')} />
                {errors.country && <p className="text-sm text-destructive">{errors.country.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="city">{t('profileCityLabel')}</Label>
                <Input id="city" {...register('city')} placeholder={t('profileCityPlaceholder')} />
                {errors.city && <p className="text-sm text-destructive">{errors.city.message}</p>}
              </div>
            
              <div className="space-y-2">
                <Label htmlFor="preferredLanguage">{t('profilePreferredLanguageLabel')}</Label>
                <Select 
                    onValueChange={(value) => setValue('preferredLanguage', value as Locale, { shouldValidate: true })} 
                    value={watch('preferredLanguage')}
                >
                  <SelectTrigger id="preferredLanguage"><SelectValue placeholder={t('selectLanguage')} /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">{t('english')}</SelectItem>
                    <SelectItem value="es">{t('spanish')}</SelectItem>
                  </SelectContent>
                </Select>
                {errors.preferredLanguage && <p className="text-sm text-destructive">{errors.preferredLanguage.message}</p>}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="preferredBibleVersion">{t('profilePreferredBibleVersionLabel')}</Label>
              <Select 
                onValueChange={(value) => setValue('preferredBibleVersion', value, { shouldValidate: true })} 
                value={watch('preferredBibleVersion')}
                disabled={availableBibleVersions.length === 0}
              >
                <SelectTrigger id="preferredBibleVersion">
                  <SelectValue placeholder={availableBibleVersions.length > 0 ? t('profileBibleVersionPlaceholder') : t('noBibleVersionsForLanguage')} />
                </SelectTrigger>
                <SelectContent>
                  {availableBibleVersions.map(v => <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>)}
                </SelectContent>
              </Select>
              {errors.preferredBibleVersion && <p className="text-sm text-destructive">{errors.preferredBibleVersion.message}</p>}
               {availableBibleVersions.length === 0 && <p className="text-sm text-muted-foreground mt-1">{t('selectLanguageForBibleVersions')}</p>}
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={isSubmitting || authLoading}>
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                {isSubmitting ? t('savingProfileButton') : t('saveProfileButton')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
