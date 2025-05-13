// src/app/actions.ts
"use server";

import { createPrayerPlan, type CreatePrayerPlanInput, type CreatePrayerPlanOutput } from "@/ai/flows/create-prayer-plan";
import { z } from "zod";

const PrayerRequestSchema = z.object({
  prayerReason: z.string().min(10, "Please describe your prayer reason in at least 10 characters."),
});

export interface PrayerPlanState {
  data?: CreatePrayerPlanOutput;
  error?: string;
  message?: string;
}

export async function submitPrayerRequestAction(
  prevState: PrayerPlanState | null,
  formData: FormData
): Promise<PrayerPlanState> {
  const prayerReason = formData.get("prayerReason") as string;

  const validationResult = PrayerRequestSchema.safeParse({ prayerReason });

  if (!validationResult.success) {
    return {
      error: validationResult.error.errors.map((e) => e.message).join(", "),
    };
  }

  try {
    const input: CreatePrayerPlanInput = { prayerReason: validationResult.data.prayerReason };
    const plan = await createPrayerPlan(input);
    if (plan && plan.prayerPlan && plan.prayerPlan.length > 0) {
      return { data: plan, message: "Prayer plan created successfully!" };
    } else {
      return { error: "Failed to generate a prayer plan. The AI might not have found relevant content. Please try rephrasing your reason." };
    }
  } catch (error) {
    console.error("Error creating prayer plan:", error);
    return { error: "An unexpected error occurred while creating your prayer plan. Please try again later." };
  }
}
