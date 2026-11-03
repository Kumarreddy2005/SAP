/**
 * Career Orchestrator — Validated Candidate Session Storage Layer
 * 
 * Provides validated, tamper-resistant session persistence across page refreshes
 * for the current browser session. Guarantees strict isolation between:
 * - EMPTY (clean, zero-candidate state)
 * - DEMO (curated Alex Vance baseline)
 * - REAL_PROFILE (verified or unreviewed candidate session)
 */

import { ExtractedSkillItem } from '@career-orchestrator/shared';
import { INITIAL_DEMO_SKILLS } from '../demo/demoSkills';

export type SessionMode = 'EMPTY' | 'DEMO' | 'REAL_PROFILE';

export interface ManualProfileData {
  fullName: string;
  currentTitle: string;
  yearsExperience: number;
  education: string;
  responsibilities: string;
}

export interface StoredCandidateSession {
  version: 1;
  mode: SessionMode;
  profileId: string | null;
  manualProfile: ManualProfileData;
  skills: ExtractedSkillItem[];
  uploadedFile: { name: string; size: number; type: string } | null;
  isRealProfileLoaded: boolean;
  isRealProfileReviewed: boolean;
  targetRoleSlug: string;
  completedLearningIds: string[];
}

export const BLANK_MANUAL_PROFILE: ManualProfileData = {
  fullName: '',
  currentTitle: '',
  yearsExperience: 0,
  education: '',
  responsibilities: ''
};

export const ALEX_VANCE_PROFILE: ManualProfileData = {
  fullName: 'Alex Vance',
  currentTitle: 'Senior Financial Analyst',
  yearsExperience: 4.5,
  education: 'Bachelor of Science in Accounting & Information Systems',
  responsibilities:
    'Manage general ledger journal reconciliation, statutory balance sheet audits, and SQL-based variance audits.'
};

export const DEFAULT_TARGET_ROLE_SLUG = 'sap-s4hana-finance-consultant';

const SESSION_STORAGE_KEY = 'career_orchestrator_session_state_v1';

// In-memory fallback for non-browser environments (e.g., Node.js / unit tests)
let memoryStorage: Record<string, string> = {};

function getStorageItem(key: string): string | null {
  try {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      return window.sessionStorage.getItem(key);
    }
  } catch {
    // Ignore and fallback
  }
  return memoryStorage[key] || null;
}

function setStorageItem(key: string, value: string): void {
  try {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      window.sessionStorage.setItem(key, value);
      return;
    }
  } catch {
    // Ignore and fallback
  }
  memoryStorage[key] = value;
}

function removeStorageItem(key: string): void {
  try {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      window.sessionStorage.removeItem(key);
      return;
    }
  } catch {
    // Ignore and fallback
  }
  delete memoryStorage[key];
}

/**
 * Creates a clean EMPTY session record
 */
export function createEmptySession(): StoredCandidateSession {
  return {
    version: 1,
    mode: 'EMPTY',
    profileId: null,
    manualProfile: { ...BLANK_MANUAL_PROFILE },
    skills: [],
    uploadedFile: null,
    isRealProfileLoaded: false,
    isRealProfileReviewed: false,
    targetRoleSlug: DEFAULT_TARGET_ROLE_SLUG,
    completedLearningIds: []
  };
}

/**
 * Creates the standard DEMO session record for Alex Vance
 */
export function createDemoSession(): StoredCandidateSession {
  return {
    version: 1,
    mode: 'DEMO',
    profileId: 'demo-profile',
    manualProfile: { ...ALEX_VANCE_PROFILE },
    skills: [...INITIAL_DEMO_SKILLS],
    uploadedFile: null,
    isRealProfileLoaded: false,
    isRealProfileReviewed: true,
    targetRoleSlug: DEFAULT_TARGET_ROLE_SLUG,
    completedLearningIds: []
  };
}

/**
 * Loads and validates the candidate session state from browser session storage.
 * If storage is uninitialized, returns DEMO mode by default.
 * If storage is corrupt or unrecognized, safely resets to EMPTY.
 */
export function loadSessionState(): StoredCandidateSession {
  // Allow explicit query parameter override for direct demo or empty inspection
  try {
    if (typeof window !== 'undefined' && window.location && typeof window.location.search === 'string') {
      if (window.location.search.includes('mode=empty')) {
        const empty = createEmptySession();
        persistSessionState(empty);
        return empty;
      }
      if (window.location.search.includes('mode=demo')) {
        const demo = createDemoSession();
        persistSessionState(demo);
        return demo;
      }
    }
  } catch {
    // Ignore and proceed to standard storage resolution
  }

  const raw = getStorageItem(SESSION_STORAGE_KEY);
  if (!raw) {
    // Default initial visit in fresh browser tab: load DEMO baseline
    return createDemoSession();
  }

  try {
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.version !== 1 || typeof parsed.mode !== 'string') {
      return createEmptySession();
    }

    if (parsed.mode === 'EMPTY') {
      return {
        version: 1,
        mode: 'EMPTY',
        profileId: null,
        manualProfile: { ...BLANK_MANUAL_PROFILE },
        skills: [],
        uploadedFile: null,
        isRealProfileLoaded: false,
        isRealProfileReviewed: false,
        targetRoleSlug: typeof parsed.targetRoleSlug === 'string' ? parsed.targetRoleSlug : DEFAULT_TARGET_ROLE_SLUG,
        completedLearningIds: []
      };
    }

    if (parsed.mode === 'DEMO') {
      return {
        version: 1,
        mode: 'DEMO',
        profileId: 'demo-profile',
        manualProfile: { ...ALEX_VANCE_PROFILE },
        skills: [...INITIAL_DEMO_SKILLS],
        uploadedFile: null,
        isRealProfileLoaded: false,
        isRealProfileReviewed: true,
        targetRoleSlug: typeof parsed.targetRoleSlug === 'string' ? parsed.targetRoleSlug : DEFAULT_TARGET_ROLE_SLUG,
        completedLearningIds: Array.isArray(parsed.completedLearningIds) ? parsed.completedLearningIds : []
      };
    }

    if (parsed.mode === 'REAL_PROFILE') {
      return {
        version: 1,
        mode: 'REAL_PROFILE',
        profileId: typeof parsed.profileId === 'string' ? parsed.profileId : null,
        manualProfile: parsed.manualProfile && typeof parsed.manualProfile.fullName === 'string'
          ? parsed.manualProfile
          : { ...BLANK_MANUAL_PROFILE },
        skills: Array.isArray(parsed.skills) ? parsed.skills : [],
        uploadedFile: parsed.uploadedFile && typeof parsed.uploadedFile.name === 'string'
          ? parsed.uploadedFile
          : null,
        isRealProfileLoaded: Boolean(parsed.isRealProfileLoaded),
        isRealProfileReviewed: Boolean(parsed.isRealProfileReviewed),
        targetRoleSlug: typeof parsed.targetRoleSlug === 'string' ? parsed.targetRoleSlug : DEFAULT_TARGET_ROLE_SLUG,
        completedLearningIds: Array.isArray(parsed.completedLearningIds) ? parsed.completedLearningIds : []
      };
    }

    return createEmptySession();
  } catch {
    return createEmptySession();
  }
}

/**
 * Persists the validated candidate session state to session storage.
 */
export function persistSessionState(state: StoredCandidateSession): void {
  try {
    setStorageItem(SESSION_STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.warn('[SessionState] Failed to persist session state:', err);
  }
}

/**
 * Resets in-memory storage (used for isolated unit testing).
 */
export function resetMemoryStorageForTesting(): void {
  memoryStorage = {};
  removeStorageItem(SESSION_STORAGE_KEY);
}
