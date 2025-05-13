// src/ai/flows/create-prayer-plan.ts
'use server';
/**
 * @fileOverview Flow to create a personalized prayer plan based on user's reason for prayer and selected language.
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
  language: z
    .string()
    .describe('The language for the prayer plan (e.g., "English", "Spanish"). Default to English if not specified.'),
});
export type CreatePrayerPlanInput = z.infer<typeof CreatePrayerPlanInputSchema>;

const DailyPrayerSchema = z.object({
  day: z.string().describe('Day of the prayer plan (e.g., "Day 1", "Monday", "Lunes", "Día 1") in the specified language.'),
  bibleVerse: z.string().describe('A relevant Bible verse reference (e.g., John 3:16).'),
  bibleVerseText: z.string().describe('The full text of the Bible verse, accurately quoted and in the specified language.'),
  reflection: z
    .string()
    .describe('A detailed reflection (at least 3-4 sentences) in the specified language on how the Bible verse applies to the user\'s prayer reason, guiding them to analyze its meaning in context.'),
  prayer: z.string().describe('A longer, more comprehensive, and personalized prayer (at least 4-5 sentences) in the specified language for the day, inspired by the verse, reflection, and prayer reason.'),
});

const CreatePrayerPlanOutputSchema = z.object({
  prayerReasonContext: z.string().describe("The original prayer reason this plan was generated for."),
  languageContext: z.string().describe("The language this plan was generated in."),
  prayerPlan: z.array(DailyPrayerSchema).describe('The generated prayer plan in the specified language.'),
  recommendedDays: z
    .string()
    .describe('Recommended days for the prayer plan (e.g., "Daily", "Diario") in the specified language, based on the prayer reason.'),
  planDurationSuggestion: z
    .string()
    .describe('Suggested duration for the prayer plan (e.g., "7 days", "7 días") in the specified language.'),
});

export type CreatePrayerPlanOutput = z.infer<typeof CreatePrayerPlanOutputSchema>;

export async function createPrayerPlan(input: CreatePrayerPlanInput): Promise<CreatePrayerPlanOutput> {
  return createPrayerPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'createPrayerPlanPrompt',
  input: {schema: CreatePrayerPlanInputSchema},
  output: {schema: CreatePrayerPlanOutputSchema},
  prompt: `You are a helpful AI assistant that specializes in creating personalized prayer plans in the specified language: {{{language}}}.

Based on the user's reason for prayer ({{{prayerReason}}}), create a structured prayer plan.
The plan should be for a suggested duration and recommend specific days for prayer.
Each day in the plan should include:
1.  The day identifier (e.g., "Day 1", "Monday", "Lunes", "Día 1") in {{{language}}}.
2.  A relevant Bible verse reference.
3.  The full text of that Bible verse, accurately quoted and in {{{language}}}.
4.  A detailed reflection (at least 3-4 sentences) in {{{language}}} on how the Bible verse applies to the user's prayer reason ({{{prayerReason}}}), guiding them to analyze its meaning in context.
5.  A longer, more comprehensive, and personalized prayer (at least 4-5 sentences) in {{{language}}} for the day, inspired by the verse, reflection, and prayer reason.

Reason for prayer: {{{prayerReason}}}
Desired language: {{{language}}}

Output the entire plan in {{{language}}}.

Format the prayer plan as a JSON object with the following structure, ensuring all string values are in {{{language}}}:
{
  "prayerReasonContext": "{{{prayerReason}}}",
  "languageContext": "{{{language}}}",
  "prayerPlan": [
    {
      "day": "Localized Day (e.g., Day 1 / Lunes)",
      "bibleVerse": "Bible Verse Reference (e.g., John 3:16)",
      "bibleVerseText": "Full text of the Bible verse in {{{language}}}",
      "reflection": "Detailed reflection in {{{language}}}",
      "prayer": "Longer, personalized prayer in {{{language}}}"
    }
  ],
  "recommendedDays": "Localized recommended days (e.g., Daily / Diario)",
  "planDurationSuggestion": "Localized suggested duration (e.g., 7 days / 7 días)"
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
