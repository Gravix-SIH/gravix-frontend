/**
 * Privacy & Anonymity Helpers
 * Supports mapping real user IDs ↔ anonymous IDs,
 * toggling identity sharing, and sanitizing user data.
 */

import { randomString } from "./random";

export type IdentityMode = "real" | "anonymous";

export interface UserProfile {
  uid: string;          // Firebase UID
  anonId: string;       // Anonymous UUID (anon_butterfly_12345)
  email?: string;
  name?: string;
  department?: string;
  role?: "student" | "counselor" | "admin";
}

/**
 * Generate an anonymous ID with a readable prefix
 * Example: anon_skyfox_839201
 */
export function generateAnonId(): string {
  const animals = ["butterfly", "owl", "tiger", "dolphin", "skyfox"];
  const adj = ["calm", "bright", "kind", "silent", "brave"];
  const word = adj[Math.floor(Math.random() * adj.length)] + "_" +
               animals[Math.floor(Math.random() * animals.length)];
  return `anon_${word}_${randomString(6)}`;
}

/**
 * Toggle between real and anonymous identity
 */
export function toggleIdentity(
  user: UserProfile,
  mode: IdentityMode
): Partial<UserProfile> {
  if (mode === "anonymous") {
    return {
      anonId: user.anonId,
      role: user.role,
    };
  }
  return {
    uid: user.uid,
    email: user.email,
    name: user.name,
    role: user.role,
  };
}

/**
 * Sanitize profile before sharing with others
 * (removes PII unless identity is explicitly shared)
 */
export function sanitizeProfile(
  user: UserProfile,
  shareIdentity: boolean
): Partial<UserProfile> {
  if (!shareIdentity) {
    return {
      anonId: user.anonId,
      role: user.role,
    };
  }
  return {
    uid: user.uid,
    email: user.email,
    name: user.name,
    department: user.department,
    role: user.role,
  };
}
