
// src/app/saved-plans/page.tsx
"use client";

import { useEffect, useState } from "react";
import { usePrayerPlansStore } from "@/hooks/use-prayer-plans-store";
import type { SavedPrayerPlan } from "@/types/prayer-plan";
import PrayerPlanDisplay from "@/components/prayer-plan-display";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Trash2, Info, CalendarClock, Loader2, ShieldAlert } from "lucide-react";
import { format, parseISO } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useLanguage } from "@/contexts/language-context"; 
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SavedPlansPage() {
  const { savedPlans, deletePlan, isInitialized: storeIsInitialized } = usePrayerPlansStore();
  const [mounted, setMounted] = useState(false);
  const { t } = useLanguage(); 
  const { currentUser, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !authLoading && !currentUser) {
      router.push('/login?redirect=/saved-plans');
    }
  }, [mounted, authLoading, currentUser, router]);


  if (authLoading || !mounted || !storeIsInitialized || !currentUser) {
    return (
      <div className="text-center py-20 flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg text-muted-foreground">{authLoading ? t('checkingAuthStatus') : t('loadingSavedPlans')}</p>
      </div>
    );
  }
  
  if (!currentUser) {
     return (
      <Card className="mt-8 shadow-lg w-full max-w-md mx-auto">
        <CardHeader className="items-center">
          <ShieldAlert className="h-12 w-12 text-destructive mb-4" />
          <CardTitle className="text-2xl">{t('accessDeniedTitle')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            {t('mustBeLoggedInToViewPlans')}
          </p>
        </CardContent>
        <CardFooter>
          <Button asChild className="w-full">
            <Link href="/login?redirect=/saved-plans">{t('loginButton')}</Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }


  if (savedPlans.length === 0) {
    return (
      <Card className="mt-8 shadow-lg w-full max-w-md mx-auto">
        <CardHeader className="items-center">
          <Info className="h-12 w-12 text-primary mb-4" />
          <CardTitle className="text-2xl">{t('noSavedPlansTitle')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            {t('noSavedPlansDescription')}
          </p>
        </CardContent>
         <CardFooter>
            <Button asChild className="w-full">
                <Link href="/">{t('createFirstPlanButton')}</Link>
            </Button>
        </CardFooter>
      </Card>
    );
  }

  const sortedPlans = [...savedPlans].sort((a, b) => parseISO(b.savedAt).getTime() - parseISO(a.savedAt).getTime());


  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-primary text-center">{t('yourSavedPlans')}</h1>
      
      <Accordion type="multiple" className="w-full space-y-4">
        {sortedPlans.map((plan) => (
          <AccordionItem key={plan.id} value={plan.id} className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4">
              <AccordionTrigger className="flex-1 text-left hover:no-underline">
                <div className="flex flex-col">
                   <span className="font-semibold text-primary text-lg">
                    {t('planFor')} &quot;{plan.prayerReasonContext.length > 50 ? `${plan.prayerReasonContext.substring(0, 50)}...` : plan.prayerReasonContext}&quot;
                  </span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <CalendarClock size={14} /> {t('saved')} {format(parseISO(plan.savedAt), "MMM d, yyyy h:mm a")} ({plan.languageContext})
                  </span>
                </div>
              </AccordionTrigger>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="ml-4 text-destructive hover:bg-destructive/10">
                    <Trash2 className="h-5 w-5" />
                    <span className="sr-only">{t('deletePlan')}</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{t('deletePlanConfirmTitle')}</AlertDialogTitle>
                    <AlertDialogDescription>
                      {t('deletePlanConfirmDescription')}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                    <AlertDialogAction onClick={() => deletePlan(plan.id)} className="bg-destructive hover:bg-destructive/90">
                      {t('delete')}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
            <AccordionContent className="px-6 pb-6 border-t border-border">
              <PrayerPlanDisplay plan={plan} isSavedPlanView={true} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
