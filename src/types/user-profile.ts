// src/types/user-profile.ts
import { z } from 'zod';
import type { Locale } from '@/lib/i18n';

export const BIBLE_VERSIONS_SUPPORTED = [
  { id: 'NIV', name: 'New International Version (NIV)', language: 'en' },
  { id: 'ESV', name: 'English Standard Version (ESV)', language: 'en' },
  { id: 'KJV', name: 'King James Version (KJV)', language: 'en' },
  { id: 'NVI', name: 'Nueva Versión Internacional (NVI)', language: 'es' },
  { id: 'RVR1960', name: 'Reina Valera 1960 (RVR1960)', language: 'es' },
  // Add more versions as needed
] as const;
export type BibleVersionId = typeof BIBLE_VERSIONS_SUPPORTED[number]['id'];

export const RELIGIONS = [
  { id: 'christianity', name: 'Christianity' },
  { id: 'judaism', name: 'Judaism' },
  { id: 'islam', name: 'Islam' },
  { id: 'hinduism', name: 'Hinduism' },
  { id: 'buddhism', name: 'Buddhism' },
  { id: 'spiritual_not_religious', name: 'Spiritual but not religious'},
  { id: 'agnostic', name: 'Agnostic' },
  { id: 'atheist', name: 'Atheist' },
  { id: 'other', name: 'Other' },
  { id: 'prefer_not_to_say', name: 'Prefer not to say' },
] as const;
export type ReligionId = typeof RELIGIONS[number]['id'];

export const UserProfileSchema = z.object({
  uid: z.string(),
  name: z.string().trim().min(1, "Name is required.").max(100, "Name cannot exceed 100 characters.").optional().nullable(),
  photoURL: z.string().url("Please enter a valid URL for your photo.").max(500, "Photo URL is too long.").optional().nullable().or(z.literal('')),
  bio: z.string().trim().max(500, "Biography cannot exceed 500 characters.").optional().nullable(),
  religion: z.string().min(1, "Religion is required."),
  country: z.string().trim().max(100, "Country name cannot exceed 100 characters.").optional().nullable(),
  city: z.string().trim().max(100, "City name cannot exceed 100 characters.").optional().nullable(),
  preferredLanguage: z.enum(['en', 'es'] as [Locale, ...Locale[]]).default('es'),
  preferredBibleVersion: z.string().min(1, "Preferred Bible version is required."),
  createdAt: z.string().optional(), // ISO date string
  updatedAt: z.string().optional(), // ISO date string
});

export type UserProfile = z.infer<typeof UserProfileSchema>;

// Helper to get Bible versions based on language
export const getBibleVersionsForLanguage = (language: Locale) => {
  return BIBLE_VERSIONS_SUPPORTED.filter(version => version.language === language);
};
