'use server';
/**
 * @fileOverview Generates daily prayer content including scripture, rationale, and a short prayer.
 *
 * - generateDailyPrayerContent - A function to generate daily prayer content.
 * - GenerateDailyPrayerContentInput - The input type for the generateDailyPrayerContent function.
 * - GenerateDailyPrayerContentOutput - The return type for the generateDailyPrayerContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDailyPrayerContentInputSchema = z.object({
  prayerTopic: z
    .string()
    .describe('The topic or reason for the user wanting to pray.'),
  dayNumber: z
    .number()
    .describe('The day number in the prayer plan (e.g., 1 for the first day).'),
  totalDays: z
    .number()
    .describe('The total number of days in the prayer plan.'),
});
export type GenerateDailyPrayerContentInput = z.infer<
  typeof GenerateDailyPrayerContentInputSchema
>;

const GenerateDailyPrayerContentOutputSchema = z.object({
  scripture: z.string().describe('A relevant scripture for the day.'),
  rationale: z
    .string()
    .describe(
      'A rationale explaining why the scripture is relevant to the prayer topic.'
    ),
  prayer: z.string().describe('A short, personalized prayer for the day.'),
});
export type GenerateDailyPrayerContentOutput = z.infer<
  typeof GenerateDailyPrayerContentOutputSchema
>;

export async function generateDailyPrayerContent(
  input: GenerateDailyPrayerContentInput
): Promise<GenerateDailyPrayerContentOutput> {
  return generateDailyPrayerContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDailyPrayerContentPrompt',
  input: {schema: GenerateDailyPrayerContentInputSchema},
  output: {schema: GenerateDailyPrayerContentOutputSchema},
  prompt: `You are a prayer content generator. Generate a scripture, rationale, and short prayer based on the prayer topic for a specific day in the prayer plan.

Prayer Topic: {{{prayerTopic}}}
Day Number: {{{dayNumber}}}
Total Days: {{{totalDays}}}

Consider the day number and total days to create a progressive and coherent prayer plan. The scripture, rationale, and prayer should be aligned with the overall prayer topic and the specific day's context within the plan.

Ensure that the scripture is relevant and provides guidance or encouragement related to the prayer topic. The rationale should clearly explain the connection between the scripture and the prayer topic, offering insights and understanding.

The prayer should be a personalized and heartfelt expression of the user's desire, incorporating elements from the scripture and rationale.

Output the scripture, rationale, and prayer as strings.

Output format must be parsable by Typescript:
{
  "scripture": "",
  "rationale": "",
  "prayer": ""
}`,
});

const generateDailyPrayerContentFlow = ai.defineFlow(
  {
    name: 'generateDailyPrayerContentFlow',
    inputSchema: GenerateDailyPrayerContentInputSchema,
    outputSchema: GenerateDailyPrayerContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
