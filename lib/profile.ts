"use client";

export type EducationLevel =
  | "School Student"
  | "College Student"
  | "Graduate / Working"
  | "Researcher"
  | "Other";

export interface InnovateXProfile {
  name: string;
  email: string;
  educationLevel: EducationLevel;
  classOrYear: string;
  field: string;
  interests: string[];
  subjects: string[];
  skills: string[];
  goals: string[];
  onboardingCompleted: boolean;
}

export interface DemoUser {
  name: string;
  email: string;
}

export const PROFILE_UPDATED_EVENT = "innovatex-profile-updated";

const PROFILE_STORAGE_KEY = "innovatex-profile";
const DEMO_USER_STORAGE_KEY = "innovatex-demo-user";

function readStorage<T>(key: string): T | null {
  if (typeof window === "undefined") return null;

  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : null;
  } catch {
    return null;
  }
}

function notifyProfileUpdate() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(PROFILE_UPDATED_EVENT));
  }
}

export function getProfile() {
  return readStorage<InnovateXProfile>(PROFILE_STORAGE_KEY);
}

export function saveProfile(profile: InnovateXProfile) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
  notifyProfileUpdate();
}

export function getDemoUser() {
  return readStorage<DemoUser>(DEMO_USER_STORAGE_KEY);
}

export function saveDemoUser(user: DemoUser) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(DEMO_USER_STORAGE_KEY, JSON.stringify(user));
  notifyProfileUpdate();
}

export function signOutDemoUser() {
  if (typeof window === "undefined") return;

  window.localStorage.removeItem(PROFILE_STORAGE_KEY);
  window.localStorage.removeItem(DEMO_USER_STORAGE_KEY);
  notifyProfileUpdate();
}
