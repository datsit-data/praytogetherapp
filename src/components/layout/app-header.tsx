
// src/components/layout/app-header.tsx
"use client"; 

import { Sparkles, ListChecks, LanguagesIcon, LogIn, UserPlus, LogOut, UserCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/language-context'; 
import type { Locale } from '@/lib/i18n'; 
import { useAuth } from '@/contexts/auth-context';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; 
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


export default function AppHeader() {
  const { locale, setLocale, t } = useLanguage(); 
  const { currentUser, logOut, loading } = useAuth();

  const handleLanguageChange = (value: string) => {
    setLocale(value as Locale);
  };

  const getInitials = (email?: string | null) => {
    if (!email) return "U";
    return email.substring(0, 2).toUpperCase();
  };


  return (
    <header className="bg-card border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-primary hover:opacity-80 transition-opacity">
          <Sparkles className="h-7 w-7 text-accent" />
          <span>{t('appName')}</span> 
        </Link>
        <nav className="flex items-center gap-2 sm:gap-4">
          {currentUser && (
            <Button variant="ghost" asChild>
              <Link href="/saved-plans" className="flex items-center gap-2">
                <ListChecks className="h-5 w-5" />
                <span className="hidden sm:inline">{t('savedPlansNav')}</span>
              </Link>
            </Button>
          )}
          <div className="flex items-center gap-2">
            <LanguagesIcon className="h-5 w-5 text-muted-foreground" />
            <Select value={locale} onValueChange={handleLanguageChange}>
              <SelectTrigger className="w-auto min-w-[100px] sm:min-w-[120px] h-9 text-sm" aria-label={t('selectAppLanguage')}>
                <SelectValue placeholder={t('selectLanguage')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">{t('english')}</SelectItem>
                <SelectItem value="es">{t('spanish')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {!loading && (
            <>
              {!currentUser ? (
                <>
                  <Button variant="ghost" asChild>
                    <Link href="/login" className="flex items-center gap-1 sm:gap-2">
                      <LogIn className="h-5 w-5" />
                      <span className="hidden sm:inline">{t('loginButton')}</span>
                    </Link>
                  </Button>
                  <Button asChild>
                    <Link href="/signup" className="flex items-center gap-1 sm:gap-2">
                      <UserPlus className="h-5 w-5" />
                      <span className="hidden sm:inline">{t('signupButton')}</span>
                    </Link>
                  </Button>
                </>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                      <Avatar className="h-8 w-8">
                        {/* Placeholder for user avatar image if available */}
                        {/* <AvatarImage src={currentUser.photoURL || undefined} alt={currentUser.displayName || currentUser.email || "User"} /> */}
                        <AvatarFallback>{getInitials(currentUser.email)}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{t('myAccount')}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {currentUser.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {/* Add other items like Profile, Settings here if needed */}
                    {/* <DropdownMenuItem><UserCircle className="mr-2 h-4 w-4" />{t('profile')}</DropdownMenuItem> */}
                    <DropdownMenuItem onClick={logOut} className="cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      {t('logoutButton')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
