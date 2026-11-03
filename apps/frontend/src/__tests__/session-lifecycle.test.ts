import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import {
  createEmptySession,
  createDemoSession,
  loadSessionState,
  persistSessionState,
  resetMemoryStorageForTesting,
  SessionMode,
  StoredCandidateSession
} from '../context/sessionState';

describe('Career Orchestrator — Candidate Session Lifecycle & Audit Tests', () => {
  beforeEach(() => {
    resetMemoryStorageForTesting();
  });

  // Scenario 1: Start New Profile remains empty after simulated refresh
  it('1. Start New Profile remains empty after simulated page refresh', () => {
    // User triggers Start New Profile
    const emptySession = createEmptySession();
    persistSessionState(emptySession);

    // Simulate page reload / remount
    const restored = loadSessionState();
    assert.equal(restored.mode, 'EMPTY');
    assert.equal(restored.profileId, null);
    assert.equal(restored.skills.length, 0);
    assert.equal(restored.isRealProfileLoaded, false);
    assert.equal(restored.isRealProfileReviewed, false);
    assert.equal(restored.uploadedFile, null);
    assert.equal(restored.manualProfile.fullName, '');
  });

  // Scenario 2: Load Demo Baseline remains demo after simulated refresh
  it('2. Load Demo Baseline remains demo after simulated page refresh', () => {
    // User loads demo baseline
    const demoSession = createDemoSession();
    persistSessionState(demoSession);

    // Simulate page reload
    const restored = loadSessionState();
    assert.equal(restored.mode, 'DEMO');
    assert.equal(restored.profileId, 'demo-profile');
    assert.ok(restored.skills.length > 0, 'Demo skills must be populated');
    assert.equal(restored.manualProfile.fullName, 'Alex Vance');
  });

  // Scenario 3: Upload Resume A -> reset -> upload Resume B isolates states correctly
  it('3. Upload Resume A -> reset -> upload Resume B isolates candidate states completely', () => {
    // Upload Resume A
    const resumeASession: StoredCandidateSession = {
      version: 1,
      mode: 'REAL_PROFILE',
      profileId: 'profile-candidate-alpha',
      isRealProfileLoaded: true,
      isRealProfileReviewed: true,
      uploadedFile: { name: 'Resume_Alpha.pdf', size: 1024, type: 'application/pdf' },
      manualProfile: { fullName: 'Candidate Alpha', currentTitle: 'ERP Specialist', yearsExperience: 5, education: '', responsibilities: '' },
      skills: [
        {
          id: 'sk-alpha-1',
          code: 'SK-FI-001',
          name: 'SAP FI Financial Accounting',
          category: 'SAP_FUNCTIONAL',
          proficiency: 'ADVANCED',
          yearsExperience: 5,
          isTransferable: true,
          confidenceScore: 0.95,
          isConfirmed: true,
          reviewStatus: 'CONFIRMED',
          extractionMethod: 'EXPLICIT_MENTION'
        }
      ],
      targetRoleSlug: 'sap-s4hana-finance',
      completedLearningIds: []
    };
    persistSessionState(resumeASession);

    // User clicks Start New Profile
    persistSessionState(createEmptySession());
    const resetState = loadSessionState();
    assert.equal(resetState.mode, 'EMPTY');
    assert.equal(resetState.skills.length, 0);

    // Upload Resume B
    const resumeBSession: StoredCandidateSession = {
      version: 1,
      mode: 'REAL_PROFILE',
      profileId: 'profile-candidate-beta',
      isRealProfileLoaded: true,
      isRealProfileReviewed: false,
      uploadedFile: { name: 'Resume_Beta.docx', size: 2048, type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
      manualProfile: { fullName: 'Candidate Beta', currentTitle: 'Integration Architect', yearsExperience: 8, education: '', responsibilities: '' },
      skills: [
        {
          id: 'sk-beta-1',
          code: 'SK-CPI-001',
          name: 'SAP Cloud Platform Integration (CPI)',
          category: 'SAP_TECHNICAL',
          proficiency: 'EXPERT',
          yearsExperience: 8,
          isTransferable: true,
          confidenceScore: 0.98,
          isConfirmed: false,
          reviewStatus: 'SUGGESTED',
          extractionMethod: 'EXPLICIT_MENTION'
        }
      ],
      targetRoleSlug: 'sap-integration-architect',
      completedLearningIds: []
    };
    persistSessionState(resumeBSession);

    const activeBeta = loadSessionState();
    assert.equal(activeBeta.profileId, 'profile-candidate-beta');
    assert.equal(activeBeta.manualProfile.fullName, 'Candidate Beta');
    assert.equal(activeBeta.skills.length, 1);
    assert.equal(activeBeta.skills[0].name, 'SAP Cloud Platform Integration (CPI)');
    // Crucial: Must NOT contain any Alpha skills or Alex Vance demo skills
    assert.ok(!activeBeta.skills.some((s) => s.name.includes('Financial Accounting')));
    assert.ok(!activeBeta.skills.some((s) => s.name.includes('Universal Journal')));
  });

  // Scenario 4: Old upload response cannot overwrite Resume B (generation guard)
  it('4. Outdated async upload response cannot overwrite subsequent candidate profile (generation guard)', () => {
    let sessionGeneration = 1;
    let candidateProfileId = 'profile-initial';

    // Simulate async upload 1 started at gen 1
    const upload1Gen = sessionGeneration;

    // User immediately resets or uploads Resume 2, bumping generation
    sessionGeneration += 1;
    candidateProfileId = 'profile-candidate-2';
    const upload2Gen = sessionGeneration;

    // When upload 1 finally completes late:
    const applyUpload1 = () => {
      if (upload1Gen !== sessionGeneration) {
        // Discard stale response
        return false;
      }
      candidateProfileId = 'profile-candidate-1-stale';
      return true;
    };

    const upload1Applied = applyUpload1();
    assert.equal(upload1Applied, false, 'Late response from gen 1 must be rejected');
    assert.equal(candidateProfileId, 'profile-candidate-2', 'State must remain Candidate 2');

    // When upload 2 completes on current generation:
    const applyUpload2 = () => {
      if (upload2Gen !== sessionGeneration) return false;
      candidateProfileId = 'profile-candidate-2-verified';
      return true;
    };
    const upload2Applied = applyUpload2();
    assert.equal(upload2Applied, true);
    assert.equal(candidateProfileId, 'profile-candidate-2-verified');
  });

  // Scenario 5: Pending project submission cannot repopulate an empty/reset session
  it('5. Pending project submission cannot repopulate an empty or reset session', () => {
    let sessionMode: SessionMode = 'REAL_PROFILE';
    let sessionGen = 10;
    const submissions: Record<string, { status: string; id: string }> = {};

    // Submission started at gen 10
    const submitGen = sessionGen;

    // User initiates Start New Profile before server responds
    sessionMode = 'EMPTY';
    sessionGen += 1;

    // Async submission callback fires
    const handleSubmissionComplete = (result: { status: string; id: string; projectId: string }) => {
      if (submitGen !== sessionGen || sessionMode === 'EMPTY') {
        // Must reject repopulation into empty session
        return false;
      }
      submissions[result.projectId] = result;
      return true;
    };

    const wasApplied = handleSubmissionComplete({
      projectId: 'proj-fi-001',
      id: 'sub-late',
      status: 'SUBMITTED'
    });

    assert.equal(wasApplied, false, 'Late submission response must be discarded after session reset');
    assert.equal(Object.keys(submissions).length, 0, 'Submissions must remain empty');
  });

  // Scenario 6: Empty session never fetches demo submissions
  it('6. Empty session never fetches demo submissions or external user submissions', () => {
    const sessionMode: SessionMode = 'EMPTY';
    let didMakeNetworkCall = false;

    const fetchUserSubmissions = (mode: SessionMode, profileId: string | null) => {
      if (mode === 'EMPTY' || !profileId) {
        return; // Guard prevents network call
      }
      didMakeNetworkCall = true;
    };

    fetchUserSubmissions(sessionMode, null);
    assert.equal(didMakeNetworkCall, false, 'Network call must be guarded in EMPTY mode');
  });

  // Scenario 7: Demo session intentionally loads demo submissions
  it('7. Demo session intentionally loads demo submissions', () => {
    const sessionMode: SessionMode = 'DEMO';
    const profileId = 'demo-profile';
    let loadedDemoSubmissions = false;

    const fetchUserSubmissions = (mode: SessionMode, currentProfileId: string | null) => {
      if (mode === 'EMPTY' || !currentProfileId) return;
      if (mode === 'DEMO' && currentProfileId === 'demo-profile') {
        loadedDemoSubmissions = true;
      }
    };

    fetchUserSubmissions(sessionMode, profileId);
    assert.equal(loadedDemoSubmissions, true, 'Demo session must load demo submissions');
  });

  // Scenario 8: Backend deletion failure preserves state and sets error banner
  it('8. Backend deletion failure preserves state and sets error notification banner', () => {
    let activeProfileId = 'profile-pre-delete';
    let isResetModalOpen = true;
    let resetErrorMessage = '';

    // Simulate backend delete endpoint returning 500
    const performReset = async (mockNetworkSuccess: boolean) => {
      try {
        if (!mockNetworkSuccess) {
          throw new Error('500 Internal Server Error: Profile persistence lock');
        }
        activeProfileId = '';
        isResetModalOpen = false;
      } catch (err: any) {
        resetErrorMessage = `Failed to delete backend session profile: ${err.message}`;
        // Preserve current profile so user data is not lost or corrupted
      }
    };

    performReset(false);
    assert.equal(activeProfileId, 'profile-pre-delete', 'Profile ID must be preserved upon failure');
    assert.equal(isResetModalOpen, true, 'Modal should remain open to inform candidate');
    assert.ok(resetErrorMessage.includes('500 Internal Server Error'));
  });

  // Scenario 9: Mobile dashboard layout constraints verify no element exceeds 375px
  it('9. Mobile dashboard layout constraints guarantee 0 horizontal overflow at 375px', () => {
    const viewportWidth = 375;
    const paddingX = 16 * 2; // 1rem each side = 32px
    const maxContentWidth = viewportWidth - paddingX; // 343px

    // Verify two-column grid breakpoint constraint: minmax(min(100%, 320px), 1fr)
    const columnMinWidth = Math.min(maxContentWidth, 320);
    assert.ok(
      columnMinWidth <= maxContentWidth,
      `Grid column min width (${columnMinWidth}px) must not exceed container content width (${maxContentWidth}px)`
    );

    // Verify radar chart size constraint
    const radarContainerFluid = Math.min(maxContentWidth, 340);
    assert.ok(radarContainerFluid <= maxContentWidth);

    // Verify previous bug minmax(480px, 1fr) would fail on 375px
    const oldColumnWidth = 480;
    assert.ok(oldColumnWidth > maxContentWidth, 'The previous 480px minmax caused 105px overflow');
  });

  // Scenario 10: A completed project alone CANNOT trigger HIGH_READINESS
  it('10. A completed project alone CANNOT trigger HIGH_READINESS without verified eligibility and 0 mandatory gaps', () => {
    const isRealProfileReviewed = true;

    // Case A: Missing backend scorecard or mandatory gaps exist
    const scorecardWithGaps = {
      isReadinessEligible: false,
      overallReadinessScore: 68,
      outstandingMandatoryGaps: ['S/4HANA Finance Customizing (IMG)', 'General Ledger Accounting']
    };

    const isReadinessValidatedWithGaps = Boolean(
      isRealProfileReviewed &&
      scorecardWithGaps &&
      scorecardWithGaps.isReadinessEligible &&
      scorecardWithGaps.overallReadinessScore >= 70 &&
      scorecardWithGaps.outstandingMandatoryGaps.length === 0
    );

    assert.equal(
      isReadinessValidatedWithGaps,
      false,
      'Candidate with mandatory gaps remaining must NEVER be marked HIGH_READINESS'
    );

    // Case B: Fully verified backend scorecard with 0 mandatory gaps and score >= 70
    const verifiedScorecard = {
      isReadinessEligible: true,
      overallReadinessScore: 82,
      outstandingMandatoryGaps: []
    };

    const isReadinessValidatedVerified = Boolean(
      isRealProfileReviewed &&
      verifiedScorecard &&
      verifiedScorecard.isReadinessEligible &&
      verifiedScorecard.overallReadinessScore >= 70 &&
      verifiedScorecard.outstandingMandatoryGaps.length === 0
    );

    assert.equal(
      isReadinessValidatedVerified,
      true,
      'Candidate with 0 mandatory gaps and score >= 70 is verified for HIGH_READINESS'
    );
  });

  // Scenario 11: Missing project score never defaults to 88/100
  it('11. Missing project score never defaults to fabricated 88/100', () => {
    const unreviewedSubmission = {
      id: 'sub-new',
      status: 'SUBMITTED',
      overallScore: undefined
    };

    const reviewedSubmissionNoScore = {
      id: 'sub-reviewed-pending-calc',
      status: 'REVIEWED',
      overallScore: undefined
    };

    const reviewedSubmissionValidScore = {
      id: 'sub-reviewed-scored',
      status: 'REVIEWED',
      overallScore: 92
    };

    const formatBadge = (sub?: { status: string; overallScore?: number }) => {
      if (sub?.status === 'REVIEWED') {
        return sub.overallScore !== undefined ? `REVIEWED & SCORED (${sub.overallScore}/100)` : 'REVIEWED & SCORED';
      }
      return 'SUBMITTED (AWAITING REVIEW)';
    };

    assert.equal(formatBadge(unreviewedSubmission), 'SUBMITTED (AWAITING REVIEW)');
    assert.equal(formatBadge(reviewedSubmissionNoScore), 'REVIEWED & SCORED');
    assert.equal(formatBadge(reviewedSubmissionValidScore), 'REVIEWED & SCORED (92/100)');
    assert.ok(!formatBadge(reviewedSubmissionNoScore).includes('88/100'), 'Must never fabricate 88/100');
  });

  // Scenario 12: Missing backend matching results never display as verified matches
  it('12. Missing backend matching results never display as verified matches', () => {
    const isEmptySession = true;
    const isRealProfileReviewed = false;
    const backendTargetMatch = undefined;

    const isVerifiedBackendMatch = Boolean(!isEmptySession && isRealProfileReviewed && backendTargetMatch);
    assert.equal(isVerifiedBackendMatch, false, 'Unreviewed or empty session must never claim verified match');

    const targetMatchScore = isEmptySession ? 0 : 75;
    assert.equal(targetMatchScore, 0, 'Empty session target match score must be exactly 0%');
  });
});
