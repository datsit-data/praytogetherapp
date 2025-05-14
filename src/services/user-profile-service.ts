// src/services/user-profile-service.ts
import { db } from '@/lib/firebase/client';
import type { UserProfile } from '@/types/user-profile';
import { doc, getDoc, setDoc, serverTimestamp, collection, query, where, getDocs } from 'firebase/firestore';

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  if (!uid) return null;
  try {
    const profileDocRef = doc(db, 'userProfiles', uid);
    const profileSnap = await getDoc(profileDocRef);
    if (profileSnap.exists()) {
      return { uid, ...profileSnap.data() } as UserProfile;
    }
    return null;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    // Optionally, rethrow or handle specific errors
    return null;
  }
}

export async function saveUserProfile(uid: string, profileData: Partial<Omit<UserProfile, 'uid' | 'createdAt' | 'updatedAt'>>): Promise<UserProfile | null> {
  if (!uid) throw new Error("User ID is required to save profile.");
  try {
    const profileDocRef = doc(db, 'userProfiles', uid);
    const profileSnap = await getDoc(profileDocRef);
    
    const dataToSave: any = {
      ...profileData,
      updatedAt: serverTimestamp(),
    };

    if (!profileSnap.exists()) {
      dataToSave.createdAt = serverTimestamp();
    }

    await setDoc(profileDocRef, dataToSave, { merge: true });
    
    // Fetch the saved data to get server-generated timestamps resolved
    const savedProfileSnap = await getDoc(profileDocRef);
    if (savedProfileSnap.exists()) {
         const savedData = savedProfileSnap.data();
         return {
            uid,
            name: savedData.name,
            photoURL: savedData.photoURL,
            bio: savedData.bio,
            religion: savedData.religion,
            country: savedData.country,
            city: savedData.city,
            preferredLanguage: savedData.preferredLanguage,
            preferredBibleVersion: savedData.preferredBibleVersion,
            createdAt: savedData.createdAt?.toDate().toISOString(), // Convert Firestore Timestamp
            updatedAt: savedData.updatedAt?.toDate().toISOString(), // Convert Firestore Timestamp
        } as UserProfile;
    }
    return null;

  } catch (error) {
    console.error("Error saving user profile:", error);
    // Optionally, rethrow or handle specific errors
    throw error; // Re-throw to be caught by the calling form
  }
}


// Check if it's a new user by seeing if a profile document exists.
// This is typically called after a social sign-in.
export async function isNewUser(uid: string): Promise<boolean> {
  if (!uid) return true; // Or handle as an error
  const profile = await getUserProfile(uid);
  return !profile;
}
