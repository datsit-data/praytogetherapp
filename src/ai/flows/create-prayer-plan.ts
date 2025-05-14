// src/ai/flows/create-prayer-plan.ts
'use server';
/**
 * @fileOverview Flow to create a personalized prayer plan based on user's reason for prayer, selected language, and preferred Bible version.
 *
 * - createPrayerPlan - A function that generates a prayer plan.
 * - CreatePrayerPlanInput - The input type for the createPrayerPlan function.
 * - CreatePrayerPlanOutput - The return type for the createPrayerPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { BibleVersionId } from '@/types/user-profile'; // Assuming BibleVersionId is defined here

const CreatePrayerPlanInputSchema = z.object({
  prayerReason: z
    .string()
    .describe('The reason for prayer provided by the user.'),
  language: z
    .string()
    .describe('The language for the prayer plan (e.g., "English", "Spanish"). Default to English if not specified.'),
  bibleVersion: z
    .string() // Changed from BibleVersionId to string to accept any version name from profile
    .describe('The preferred Bible version for scripture texts (e.g., "NIV", "NVI", "KJV"). The AI should try to use this version. If not possible or the version is not recognized for the language, use a standard modern translation (NIV/ESV for English, NVI for Spanish).')
    .optional(),
});
export type CreatePrayerPlanInput = z.infer<typeof CreatePrayerPlanInputSchema>;

const DailyPrayerSchema = z.object({
  day: z.string().describe('Day of the prayer plan (e.g., "Day 1", "Monday", "Lunes", "Día 1") in the specified language.'),
  bibleVerse: z.string().describe('A relevant Bible verse reference (e.g., John 3:16).'),
  bibleVerseText: z.string().describe('The full text of the Bible verse, accurately quoted. Use the specified {{{bibleVersion}}} if possible for the {{{language}}}. If not specified or recognized, use "Nueva Versión Internacional" (NVI) for Spanish, or a modern, clear translation (e.g., NIV, ESV) for English. Must be in the specified language.'),
  reflection: z
    .string()
    .describe('A detailed reflection (at least 3-4 sentences) in the specified language on how the Bible verse applies to the user\'s prayer reason, guiding them to analyze its meaning in context.'),
  prayer: z.string().describe('A longer, more comprehensive, and personalized prayer (at least 4-5 sentences) in the specified language for the day, inspired by the verse, reflection, and prayer reason.'),
  tipOfTheDay: z.string().describe('A practical and encouraging tip (1-2 sentences) in the specified language for the day, related to the prayer reason and scripture, helping the user to apply the day\'s theme in their life.'),
  actionableSteps: z.string().describe('A list of 2-3 concrete, actionable steps or practices in the specified language. Each step should start with a hyphen and a space (e.g., "- Step 1\\n- Step 2"). These steps should complement prayer and reflection, directly related to the prayer reason and the day\'s teachings.'),
});

const CreatePrayerPlanOutputSchema = z.object({
  prayerReasonContext: z.string().describe("The original prayer reason this plan was generated for."),
  languageContext: z.string().describe("The language this plan was generated in."),
  bibleVersionContext: z.string().optional().describe("The Bible version requested for this plan, if provided."),
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
3.  The full text of that Bible verse, accurately quoted in {{{language}}}. 
    Attempt to use the Bible version '{{{bibleVersion}}}' if it is specified and appropriate for the {{{language}}}.
    If '{{{bibleVersion}}}' is not specified, not available, or not suitable for the {{{language}}}, then:
    - If {{{language}}} is Spanish (e.g., 'es', 'Spanish'), provide the text from the "Nueva Versión Internacional" (NVI).
    - If {{{language}}} is English, use a modern and clear translation like the New International Version (NIV) or English Standard Version (ESV).
4.  A detailed reflection (at least 3-4 sentences) in {{{language}}} on how the Bible verse applies to the user's prayer reason ({{{prayerReason}}}), guiding them to analyze its meaning in context.
5.  A longer, more comprehensive, and personalized prayer (at least 4-5 sentences) in {{{language}}} for the day, inspired by the verse, reflection, and prayer reason.
6.  A practical and encouraging tip (1-2 sentences) in {{{language}}} for the day, related to the prayer reason and scripture, under the key \`tipOfTheDay\`. This tip should help the user apply the day's theme in their life.
7.  A list of 2-3 concrete, actionable steps or practices in {{{language}}} that the user can undertake, under the key \`actionableSteps\`. Format this as a string, where each step starts with a hyphen and a space (e.g., "- Step 1\\n- Step 2"). These steps should complement their prayer and reflection, directly related to their prayer reason and the day's teachings.

Reason for prayer: {{{prayerReason}}}
Desired language: {{{language}}}
Preferred Bible Version: {{{bibleVersion}}} (Use this if possible, otherwise default as instructed above)

Output the entire plan in {{{language}}}.

Format the prayer plan as a JSON object with the following structure, ensuring all string values are in {{{language}}}:
{
  "prayerReasonContext": "{{{prayerReason}}}",
  "languageContext": "{{{language}}}",
  "bibleVersionContext": "{{{bibleVersion}}}",
  "prayerPlan": [
    {
      "day": "Localized Day (e.g., Day 1 / Lunes)",
      "bibleVerse": "Bible Verse Reference (e.g., John 3:16)",
      "bibleVerseText": "Full text of the Bible verse in {{{language}}}. Adhere to Bible version instructions.",
      "reflection": "Detailed reflection in {{{language}}}",
      "prayer": "Longer, personalized prayer in {{{language}}}",
      "tipOfTheDay": "Localized practical tip for the day (1-2 sentences) in {{{language}}}",
      "actionableSteps": "- Localized actionable step 1 in {{{language}}}\\n- Localized actionable step 2 in {{{language}}}\\n- Localized actionable step 3 in {{{language}}}"
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
    // Ensure bibleVersionContext is present in the output, even if input.bibleVersion was undefined
    return { ...output!, bibleVersionContext: input.bibleVersion ?? undefined };
  }
);
