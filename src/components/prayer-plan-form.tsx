// src/components/prayer-plan-form.tsx
"use client";

import { useFormStatus } from "react-dom";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Send, Loader2, Languages, Info } from "lucide-react";
import type { PrayerPlanState } from "@/app/actions";
import { useLanguage } from "@/contexts/language-context"; 

interface PrayerPlanFormProps {
  formAction: (payload: FormData) => void;
  initialState: PrayerPlanState | null;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  const { t } = useLanguage();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {t('generatingPlanButton')}
        </>
      ) : (
        <>
          <Send className="mr-2 h-4 w-4" />
          {t('createPlanButton')}
        </>
      )}
    </Button>
  );
}

export default function PrayerPlanForm({ formAction, initialState }: PrayerPlanFormProps) {
  const { t } = useLanguage(); 

  return (
    <form action={formAction} className="space-y-6 p-6 bg-card rounded-lg shadow-md">
      <div>
        <Label htmlFor="prayerReason" className="block text-lg font-medium mb-2">
          {t('prayerReasonLabel')}
        </Label>
        <Textarea
          id="prayerReason"
          name="prayerReason"
          placeholder={t('prayerReasonPlaceholder')}
          rows={5}
          required
          className="text-base"
          defaultValue={initialState?.input?.prayerReason ?? ""}
        />
      </div>

      <div>
        <Label htmlFor="language" className="block text-lg font-medium mb-2 flex items-center">
          <Languages className="mr-2 h-5 w-5 text-primary" />
          {t('languageForPlanLabel')}
        </Label>
        <Select name="language" defaultValue={initialState?.input?.language ?? "English"}>
          <SelectTrigger className="w-full" id="language">
            <SelectValue placeholder={t('selectLanguage')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="English">{t('english')}</SelectItem>
            <SelectItem value="Spanish">{t('spanish')}</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
          <Info size={12} /> {t('prayerPlanContentLanguageInfo')}
        </p>
      </div>
      
      {initialState?.error && !initialState.data && (
         <p className="text-sm text-destructive mt-2">{initialState.error}</p> 
      )}

      <div className="flex justify-end">
        <SubmitButton />
      </div>
    </form>
  );
}
