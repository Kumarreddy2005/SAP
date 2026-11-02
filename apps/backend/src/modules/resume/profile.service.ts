import {
  ProfileReviewSubmission,
  ProfileReviewResponse,
  ExtractedSkillItem
} from '@career-orchestrator/shared';
import { ProfileRepository, profileRepository, StoredProfile } from './profile.repository';

export class ProfileService {
  constructor(private repo: ProfileRepository = profileRepository) {}

  async reviewProfile(
    profileId: string,
    submission: ProfileReviewSubmission
  ): Promise<ProfileReviewResponse | null> {
    const existing = await this.repo.getProfileById(profileId);
    if (!existing) {
      return null;
    }

    // Segregate confirmed and rejected skills
    const confirmedSkills: ExtractedSkillItem[] = [];
    let rejectedCount = 0;

    for (const item of submission.reviewedSkills) {
      if (item.isConfirmed) {
        if (!item.proficiency) {
          throw new Error(`Confirmed skill "${item.name}" requires an explicit proficiency level.`);
        }
        confirmedSkills.push({
          id: item.skillId,
          code: item.skillId.startsWith('USER-') || item.skillId.startsWith('manual-')
            ? item.skillId
            : item.skillId,
          name: item.name.trim(),
          category: item.category,
          proficiency: item.proficiency,
          yearsExperience: item.yearsExperience ?? undefined,
          isConfirmed: true,
          isTransferable: item.isTransferable,
          confidenceScore: item.confidenceScore !== undefined ? item.confidenceScore : 1.0, // Preserve original extraction confidence separately from proficiency
          extractionMethod: item.extractionMethod || 'MANUAL_ENTRY',
          evidenceSnippet: item.evidenceSnippet,
          reviewStatus: 'CONFIRMED'
        });
      } else {
        rejectedCount++;
      }
    }

    // Persist to repository
    await this.repo.updateProfile(profileId, {
      fullName: submission.fullName || existing.fullName,
      currentTitle: submission.currentTitle || existing.currentTitle,
      yearsExperience: submission.yearsExperience ?? existing.yearsExperience,
      confirmedSkills,
      isReviewed: true,
      notes: submission.notes
    });

    return {
      profileId,
      status: 'CONFIRMED',
      confirmedSkillsCount: confirmedSkills.length,
      rejectedSkillsCount: rejectedCount,
      confirmedSkills,
      updatedAt: new Date().toISOString()
    };
  }

  async getProfile(profileId: string): Promise<StoredProfile | null> {
    return this.repo.getProfileById(profileId);
  }
}
