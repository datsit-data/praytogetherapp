// src/types/prayer-plan.ts
import type { CreatePrayerPlanOutput } from "@/ai/flows/create-prayer-plan";

export interface SavedPrayerPlan extends CreatePrayerPlanOutput {
  id: string;
  savedAt: string; // ISO string date for when the plan was saved
  // prayerReasonContext and languageContext are part of CreatePrayerPlanOutput
}
