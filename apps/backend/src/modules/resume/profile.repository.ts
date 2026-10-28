import { ExtractedSkillItem } from '@career-orchestrator/shared';

export interface StoredProfile {
  id: string;
  filename?: string;
  fullName?: string;
  currentTitle?: string;
  yearsExperience?: number;
  education?: string;
  rawTextPreview?: string;
  suggestedSkills: ExtractedSkillItem[];
  confirmedSkills: ExtractedSkillItem[];
  isReviewed: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProfileRepository {
  createProfile(profile: Omit<StoredProfile, 'createdAt' | 'updatedAt'>): Promise<StoredProfile>;
  getProfileById(id: string): Promise<StoredProfile | null>;
  updateProfile(id: string, updates: Partial<StoredProfile>): Promise<StoredProfile | null>;
  deleteProfile(id: string): Promise<boolean>;
}

/**
 * In-Memory Development Repository
 *
 * NOTE: This implementation is an isolated, non-durable development fallback
 * used because PostgreSQL is not currently installed or configured on the development host.
 * State is retained in-process for the current session and will NOT survive backend restarts.
 *
 * To enable durable enterprise persistence:
 * 1. Supply a valid PostgreSQL connection URI in .env (DATABASE_URL).
 * 2. Run 'npx prisma migrate dev' to generate PostgreSQL tables.
 * 3. Swap this provider for PrismaProfileRepository implementing ProfileRepository.
 */
export class InMemoryProfileRepository implements ProfileRepository {
  private profiles = new Map<string, StoredProfile>();

  constructor() {
    console.log(
      '[ProfileRepository] Initialized InMemoryProfileRepository (Temporary non-durable session storage; PostgreSQL connection pending).'
    );
  }

  async createProfile(profile: Omit<StoredProfile, 'createdAt' | 'updatedAt'>): Promise<StoredProfile> {
    const now = new Date().toISOString();
    const stored: StoredProfile = {
      ...profile,
      createdAt: now,
      updatedAt: now
    };
    this.profiles.set(stored.id, stored);
    return stored;
  }

  async getProfileById(id: string): Promise<StoredProfile | null> {
    return this.profiles.get(id) || null;
  }

  async updateProfile(id: string, updates: Partial<StoredProfile>): Promise<StoredProfile | null> {
    const existing = this.profiles.get(id);
    if (!existing) return null;

    const updated: StoredProfile = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.profiles.set(id, updated);
    return updated;
  }

  async deleteProfile(id: string): Promise<boolean> {
    return this.profiles.delete(id);
  }

  // Helper for testing
  clear(): void {
    this.profiles.clear();
  }
}

// Global singleton instance for backend runtime
export const profileRepository: ProfileRepository = new InMemoryProfileRepository();
