// src/ai/flows/create-prayer-plan.ts
'use server';
/**
 * @fileOverview Flow to create a personalized prayer plan based on user's reason for prayer.
 *
 * - createPrayerPlan - A function that generates a prayer plan.
 * - CreatePrayerPlanInput - The input type for the createPrayerPlan function.
 * - CreatePrayerPlanOutput - The return type for the createPrayerPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CreatePrayerPlanInputSchema = z.object({
  prayerReason: z
    .string()
    .describe('The reason for prayer provided by the user.'),
});
export type CreatePrayerPlanInput = z.infer<typeof CreatePrayerPlanInputSchema>;

const DailyPrayerSchema = z.object({
  day: z.string().describe('Day of the prayer plan'),
  bibleVerse: z.string().describe('A relevant Bible verse for the day.'),
  rationale: z
    .string()
    .describe('Explanation of why the Bible verse is relevant to the prayer reason.'),
  prayer: z.string().describe('A short, personalized prayer for the day.'),
});

const CreatePrayerPlanOutputSchema = z.object({
  prayerPlan: z.array(DailyPrayerSchema).describe('The generated prayer plan.'),
  recommendedDays: z
    .string()
    .describe('Recommended days for the prayer plan based on the prayer reason.'),
  planDurationSuggestion: z
    .string()
    .describe('Suggested duration for the prayer plan.'),
});

export type CreatePrayerPlanOutput = z.infer<typeof CreatePrayerPlanOutputSchema>;

export async function createPrayerPlan(input: CreatePrayerPlanInput): Promise<CreatePrayerPlanOutput> {
  return createPrayerPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'createPrayerPlanPrompt',
  input: {schema: CreatePrayerPlanInputSchema},
  output: {schema: CreatePrayerPlanOutputSchema},
  prompt: `You are a helpful AI assistant that specializes in creating personalized prayer plans.

  Based on the user's reason for prayer, create a structured prayer plan that includes:

  - A daily scripture relevant to the prayer reason.
  - A rationale explaining why the scripture is applicable.
  - A short, personalized prayer for each day.
  - Recommend the days of the week the user should pray.
  - Suggest a duration for the prayer plan.

  Reason for prayer: {{{prayerReason}}}

  Format the prayer plan as a JSON object with the following structure:
  {
    "prayerPlan": [
      {
        "day": "Day of the week",
        "bibleVerse": "Relevant Bible verse",
        "rationale": "Explanation of why the verse is relevant",
        "prayer": "Short personalized prayer"
      }
    ],
    "recommendedDays": "Days of the week",
    "planDurationSuggestion": "Suggested duration"
  }`,
});

const createPrayerPlanFlow = ai.defineFlow(
  {
    name: 'createPrayerPlanFlow',
    inputSchema: CreatePrayerPlanInputSchema,
    outputSchema: CreatePrayerPlanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
