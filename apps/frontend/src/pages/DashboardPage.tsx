import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCareerContext } from '../context/CareerContext';
import { DEMO_CAREER_ROLES, ExtendedCareerRole } from '../demo/demoCareers';
import { DEMO_LEARNING_MODULES, LearningModule } from '../demo/demoLearning';
import { PracticalProjectDefinition, ProjectSubmissionInput, ProjectReviewInput } from '@career-orchestrator/shared';

// Dashboard components & modals
import { DashboardTopNav } from '../components/dashboard/DashboardTopNav';
import { CareerDnaRadarChart } from '../components/dashboard/CareerDnaRadarChart';
import { GlobalSearchPalette } from '../components/dashboard/GlobalSearchPalette';
import { SkillsDetailModal } from '../components/dashboard/SkillsDetailModal';
import { ExplainMatchModal } from '../components/dashboard/ExplainMatchModal';
import { ProjectSubmitModal } from '../components/dashboard/ProjectSubmitModal';
import { ResetSessionModal } from '../components/common/ResetSessionModal';
import {
  CheckIcon,
  AlertTriangleIcon,
  ArrowRightIcon,
  ColumnsIcon,
  CloseIcon,
  FileTextIcon
} from '../components/common/Icons';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    sessionMode,
    manualProfile,
    uploadedFile,
    skills,
    targetRole,
    targetRoleSlug,
    setTargetRoleSlug,
    calculateRoleMatch,
    isRealProfileLoaded,
    isRealProfileReviewed,
    isDemoProfileActive,
    currentProfileId,
    careerMatches,
    fetchCareerMatches,
    loadDemoBaseline,
    completedLearningIds,
    toggleLearningCompletion,
    projects,
    activeProjectSubmissions,
    startProjectWorkspace,
    submitProjectDeliverables,
    reviewProjectDeliverables,
    readinessScorecard,
    fetchReadinessScorecard
  } = useCareerContext();

  // Modals & Panels State
  const [isSearchPaletteOpen, setIsSearchPaletteOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [skillsModalFilter, setSkillsModalFilter] = useState<'ALL' | 'CONFIRMED' | 'TRANSFERABLE' | 'SUGGESTED' | null>(null);
  const [explainingRoleData, setExplainingRoleData] = useState<{
    role: ExtendedCareerRole;
    score: number;
    matchedSkills: string[];
    missingSkills: string[];
  } | null>(null);
  const [submittingProject, setSubmittingProject] = useState<PracticalProjectDefinition | null>(null);
  const [isRolePickerModalOpen, setIsRolePickerModalOpen] = useState(false);

  // Keyboard shortcut listener for Global Search (Cmd+K or /)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === '/' || (e.key === 'k' && (e.metaKey || e.ctrlKey))) && !isSearchPaletteOpen) {
        const target = e.target as HTMLElement;
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
          e.preventDefault();
          setIsSearchPaletteOpen(true);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchPaletteOpen]);

  // Synchronize real backend matches when profile has been reviewed
  useEffect(() => {
    if (isRealProfileReviewed && currentProfileId && currentProfileId !== 'demo-profile') {
      fetchCareerMatches(currentProfileId);
    }
  }, [isRealProfileReviewed, currentProfileId, fetchCareerMatches]);

  // Fetch readiness scorecard when target role changes
  useEffect(() => {
    if (isRealProfileReviewed && currentProfileId) {
      fetchReadinessScorecard(targetRoleSlug, currentProfileId || undefined);
    }
  }, [isRealProfileReviewed, targetRoleSlug, currentProfileId, fetchReadinessScorecard]);

  // Determine candidate confirmed and transferable competencies
  const isEmptySession = sessionMode === 'EMPTY' || (!isDemoProfileActive && !isRealProfileLoaded && !currentProfileId && skills.length === 0);

  const confirmedSkills = skills.filter((s) => s.isConfirmed && s.reviewStatus === 'CONFIRMED');
  const unreviewedSkills = skills.filter((s) => !s.isConfirmed && s.reviewStatus !== 'REJECTED');
  const transferableSkills = confirmedSkills.filter((s) => s.isTransferable);

  // Real backend matching lookup vs deterministic local fallback
  const backendTargetMatch = careerMatches.find(
    (m) => m.roleSlug === targetRoleSlug || m.roleId === targetRole.id
  );
  const localMatch = calculateRoleMatch(targetRole);

  const isVerifiedBackendMatch = Boolean(!isEmptySession && isRealProfileReviewed && backendTargetMatch);
  const targetMatchScore = isEmptySession
    ? 0
    : isVerifiedBackendMatch
    ? backendTargetMatch!.overallScore
    : localMatch.percentage;

  const matchedSkillsList = isEmptySession
    ? []
    : isVerifiedBackendMatch
    ? backendTargetMatch!.matchedSkills.map((m) => m.skillName)
    : localMatch.matchedSkills;

  const missingSkillsList: string[] = isEmptySession
    ? (targetRole.requiredSkills || []).filter((r) => r.isMandatory).map((r) => r.skillName)
    : isVerifiedBackendMatch
    ? backendTargetMatch!.missingMandatorySkills.map((m) => m.skillName)
    : localMatch.missingSkills;

  // Compute matches for all 14 roles
  const rolesWithMatches = DEMO_CAREER_ROLES.map((role) => {
    if (isEmptySession) {
      return {
        role,
        matchScore: 0,
        matchedSkills: [] as string[],
        missingSkills: (role.requiredSkills || []).filter((r) => r.isMandatory).map((r) => r.skillName)
      };
    }
    const bMatch = careerMatches.find((m) => m.roleSlug === role.slug || m.roleId === role.id);
    if (isRealProfileReviewed && bMatch) {
      return {
        role,
        matchScore: bMatch.overallScore,
        matchedSkills: bMatch.matchedSkills.map((m) => m.skillName),
        missingSkills: bMatch.missingMandatorySkills.map((m) => m.skillName)
      };
    }
    const match = calculateRoleMatch(role);
    return {
      role,
      matchScore: match.percentage,
      matchedSkills: match.matchedSkills,
      missingSkills: match.missingSkills
    };
  });

  // Alternative recommendations (excluding active target, sorted by match score, max 4)
  const alternativeRoles = rolesWithMatches
    .filter((r) => r.role.slug !== targetRoleSlug)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 4);

  // Learning progress: honest fractional count (no artificial multipliers!)
  const roleLearningModules: LearningModule[] = DEMO_LEARNING_MODULES.filter(
    (m) => m.roleSlug === targetRole.slug
  );
  const displayLearningModules =
    roleLearningModules.length > 0 ? roleLearningModules.slice(0, 3) : DEMO_LEARNING_MODULES.slice(0, 3);

  const completedLearningCount = displayLearningModules.filter((m) =>
    completedLearningIds.includes(m.id)
  ).length;
  const totalLearningCount = displayLearningModules.length;
  const honestLearningPct =
    totalLearningCount > 0 ? Math.round((completedLearningCount / totalLearningCount) * 100) : 0;

  // Project workspace state
  const targetProject =
    projects.find((p) => p.roleSlug === targetRoleSlug) ||
    projects[0] || {
      id: 'proj-fi-001',
      title: 'Enterprise Blueprint & Configuration Guide',
      roleSlug: targetRoleSlug,
      difficulty: 'INTERMEDIATE' as const,
      estimatedEffortHours: 12,
      targetSkills: ['S/4HANA Finance Customizing (IMG)', 'General Ledger Accounting'],
      description: 'Architect multi-company enterprise organizational hierarchy and configure Universal Journal settings.',
      deliverables: ['IMG Configuration Blueprint', 'GL Account Group Hierarchy Matrix'],
      rubricCriteria: [
        { criterion: 'Completeness of Organizational Structure', weightPercentage: 50 },
        { criterion: 'Accurate General Ledger Account Group segmentation', weightPercentage: 50 }
      ]
    };

  const currentSubmission = activeProjectSubmissions[targetProject.id];
  const projectStatus = currentSubmission?.status || 'NOT_STARTED';
  const projectsCompletedCount = Object.values(activeProjectSubmissions).filter(
    (s) => s.status === 'REVIEWED' || s.status === 'COMPLETED'
  ).length;

  // Project workspace handlers
  const handleStartProject = async (projectId: string) => {
    if (!currentProfileId && !isDemoProfileActive) {
      navigate('/profile');
      return;
    }
    await startProjectWorkspace(projectId, currentProfileId || 'demo-profile');
  };

  const handleOpenSubmitModal = (proj: PracticalProjectDefinition) => {
    setSubmittingProject(proj);
  };

  const handleProjectSubmit = async (input: ProjectSubmissionInput) => {
    await submitProjectDeliverables(input);
  };

  const handleSimulateReview = async (projectId: string) => {
    const sub = activeProjectSubmissions[projectId];
    if (!sub) return;

    const projDef = projects.find((p) => p.id === projectId) || targetProject;
    const criteria = projDef.rubricCriteria || [
      { criterion: 'Completeness of Organizational Structure Hierarchy', weightPercentage: 50 },
      { criterion: 'Accurate General Ledger Account Group segmentation', weightPercentage: 50 }
    ];

    const reviewInput: ProjectReviewInput = {
      submissionId: sub.id,
      status: 'REVIEWED',
      reviewerFeedback:
        'Demonstrates rigorous understanding of leading vs non-leading ledger variants in Universal Journal ACDOCA. [Simulated Demonstration Reviewer Mode]',
      reviewerType: 'SIMULATED_DEMO_REVIEWER',
      rubricAssessments: criteria.map((c, idx) => ({
        criterion: c.criterion,
        weightPercentage: c.weightPercentage,
        awardedScore: 85 + (idx % 2 === 0 ? 5 : -5),
        isSatisfied: true,
        feedback: `Meets enterprise benchmark for ${c.criterion}.`
      }))
    };

    await reviewProjectDeliverables(reviewInput);
  };

  // Readiness scorecard validation: requires verified backend eligibility, score >= 70, and 0 mandatory gaps
  const isReadinessValidated = Boolean(
    !isEmptySession &&
    isRealProfileReviewed &&
    readinessScorecard &&
    readinessScorecard.isReadinessEligible &&
    readinessScorecard.overallReadinessScore >= 70 &&
    readinessScorecard.outstandingMandatoryGaps.length === 0
  );

  // --------------------------------------------------------------------------
  // SECTION 2: Dynamic Next Recommended Action Resolution
  // --------------------------------------------------------------------------
  let nextAction: {
    state: 'EMPTY_SESSION' | 'UNREVIEWED' | 'INTAKE_NEEDED' | 'UPSKILLING' | 'LEARNING_ACTIVE' | 'HIGH_READINESS';
    badge: string;
    badgeBg: string;
    badgeColor: string;
    title: string;
    description: string;
    buttonLabel: string;
    buttonPath: string;
    buttonAction?: () => void;
    secondaryButtonLabel?: string;
    secondaryButtonAction?: () => void;
  };

  if (isEmptySession) {
    nextAction = {
      state: 'EMPTY_SESSION',
      badge: 'Empty Session • Intake Required',
      badgeBg: '#F1F5F9',
      badgeColor: '#475569',
      title: 'Welcome to Career Orchestrator — Begin Transition Analysis',
      description: 'Upload your resume document (PDF or DOCX) to extract and calibrate your competencies, or load the Alex Vance demo baseline to explore complete analytics.',
      buttonLabel: 'Upload Resume Document →',
      buttonPath: '/profile',
      secondaryButtonLabel: 'Load Alex Vance Demo Baseline',
      secondaryButtonAction: () => loadDemoBaseline()
    };
  } else if (!isRealProfileReviewed && skills.length > 0) {
    // State A: Resume uploaded or manual skills entered, but review pending
    nextAction = {
      state: 'UNREVIEWED',
      badge: 'Action Required • Calibration',
      badgeBg: '#FEF3E8',
      badgeColor: '#E9730C',
      title: 'Review and Confirm Extracted Competencies',
      description: `We identified ${skills.length} candidate competencies from your background. Review and confirm proficiency ratings to generate verified transition matching.`,
      buttonLabel: 'Proceed to Skills Review →',
      buttonPath: '/skills-review'
    };
  } else if (!isRealProfileReviewed && skills.length === 0) {
    // State B: Fresh intake session (0 skills)
    nextAction = {
      state: 'INTAKE_NEEDED',
      badge: 'Intake Required • Step 1',
      badgeBg: '#EBF3FB',
      badgeColor: '#0A6ED1',
      title: 'Upload Candidate Resume to Extract Competencies',
      description: 'Upload your PDF or DOCX resume document to automatically extract and catalog your technical, functional, and domain skills.',
      buttonLabel: 'Upload Resume Document →',
      buttonPath: '/profile'
    };
  } else if (isReadinessValidated) {
    // State D: High readiness verified by backend scorecard
    nextAction = {
      state: 'HIGH_READINESS',
      badge: `Readiness Validated • ${readinessScorecard?.overallReadinessScore}% Score`,
      badgeBg: '#E8F5ED',
      badgeColor: '#107E3E',
      title: `Career Readiness Validated for ${targetRole.title}`,
      description: `You satisfy the core competencies and mandatory requirements for ${targetRole.title}. Inspect your verified readiness scorecard or explore verified external job destinations.`,
      buttonLabel: 'View Readiness Scorecard →',
      buttonPath: '/readiness'
    };
  } else if (isRealProfileReviewed && completedLearningCount > 0 && honestLearningPct < 100) {
    // State C: Learning in progress
    const activeModule = displayLearningModules.find((m) => !completedLearningIds.includes(m.id)) || displayLearningModules[0];
    nextAction = {
      state: 'LEARNING_ACTIVE',
      badge: `In Progress • ${honestLearningPct}% Curriculum Completed`,
      badgeBg: '#EBF3FB',
      badgeColor: '#0A6ED1',
      title: `Resume Learning: ${activeModule?.title || 'Target Curriculum'}`,
      description: `Continue your structured learning pathway for ${targetRole.title}. Next module: ${activeModule?.code || 'Module'} (${activeModule?.estimatedHours || 10} hrs).`,
      buttonLabel: 'Continue Learning Pathway →',
      buttonPath: '/learning'
    };
  } else {
    // State E: Skills confirmed, prioritize missing mandatory competencies
    const firstMissing = missingSkillsList[0] || 'Core ERP Configuration';
    nextAction = {
      state: 'UPSKILLING',
      badge: 'Target Priority • Skill Gap',
      badgeBg: '#F3E8FF',
      badgeColor: '#7C3AED',
      title: `Target Role: ${targetRole.title} — Begin Priority Milestone`,
      description: `Bridge your highest-priority gap in "${firstMissing}" through curated SAP Learning Hub pathways and practical project challenges.`,
      buttonLabel: 'Start Priority Pathway →',
      buttonPath: '/learning'
    };
  }

  // --------------------------------------------------------------------------
  // SECTION 4: Visual Career Transition Map Steps
  // --------------------------------------------------------------------------
  const transitionSteps = [
    {
      id: 'step-1',
      stepNumber: 1,
      title: 'Background Intake',
      subtitle: isRealProfileLoaded
        ? uploadedFile?.name || 'Resume Uploaded'
        : isDemoProfileActive
        ? 'Alex Vance Demo Baseline'
        : manualProfile.fullName
        ? `${manualProfile.fullName} Profile`
        : 'Pending Intake',
      isComplete: sessionMode === 'DEMO' || (sessionMode === 'REAL_PROFILE' && Boolean(isRealProfileLoaded || manualProfile.fullName)),
      isActive: sessionMode === 'EMPTY' || (!isRealProfileLoaded && !isDemoProfileActive && !manualProfile.fullName),
      path: '/profile'
    },
    {
      id: 'step-2',
      stepNumber: 2,
      title: 'Skills Review',
      subtitle: isRealProfileReviewed && skills.length > 0
        ? `${confirmedSkills.length} Confirmed`
        : skills.length > 0
        ? `${skills.length} Pending Review`
        : '0 Skills',
      isComplete: (sessionMode === 'DEMO' || sessionMode === 'REAL_PROFILE') && isRealProfileReviewed && skills.length > 0,
      isActive: sessionMode === 'REAL_PROFILE' && skills.length > 0 && !isRealProfileReviewed,
      path: '/skills-review'
    },
    {
      id: 'step-3',
      stepNumber: 3,
      title: 'Target Calibration',
      subtitle: targetRole.title,
      isComplete: sessionMode === 'DEMO' || (sessionMode === 'REAL_PROFILE' && isRealProfileReviewed),
      isActive: sessionMode === 'REAL_PROFILE' && !isRealProfileReviewed,
      path: '/careers'
    },
    {
      id: 'step-4',
      stepNumber: 4,
      title: 'Skill Gap Matrix',
      subtitle: `${missingSkillsList.length} Competency Gaps`,
      isComplete: (sessionMode === 'DEMO' || (sessionMode === 'REAL_PROFILE' && isRealProfileReviewed)) && missingSkillsList.length === 0,
      isActive: (sessionMode === 'DEMO' || (sessionMode === 'REAL_PROFILE' && isRealProfileReviewed)) && missingSkillsList.length > 0,
      path: '/careers'
    },
    {
      id: 'step-5',
      stepNumber: 5,
      title: 'Learning Pathway',
      subtitle: `${completedLearningCount}/${totalLearningCount} Milestones (${honestLearningPct}%)`,
      isComplete: totalLearningCount > 0 && honestLearningPct === 100,
      isActive: completedLearningCount > 0 && honestLearningPct < 100,
      path: '/learning'
    },
    {
      id: 'step-6',
      stepNumber: 6,
      title: 'Practical Projects',
      subtitle:
        projectStatus === 'REVIEWED'
          ? currentSubmission?.overallScore !== undefined
            ? `Rubric Scored (${currentSubmission.overallScore}/100)`
            : 'Rubric Scored'
          : projectStatus === 'SUBMITTED'
          ? 'Awaiting Review'
          : projectStatus === 'IN_PROGRESS'
          ? 'Workspace Active'
          : 'Not Started',
      isComplete: projectStatus === 'REVIEWED',
      isActive: projectStatus === 'IN_PROGRESS' || projectStatus === 'SUBMITTED',
      path: '/projects'
    },
    {
      id: 'step-7',
      stepNumber: 7,
      title: 'Readiness & Jobs',
      subtitle:
        isEmptySession
          ? 'Intake Required'
          : readinessScorecard?.overallReadinessScore !== undefined
          ? `${readinessScorecard.overallReadinessScore}% Readiness Score`
          : isRealProfileReviewed
          ? 'Scorecard Available'
          : 'Evaluation Pending Review',
      isComplete: isReadinessValidated,
      isActive: Boolean(!isEmptySession && isRealProfileReviewed && readinessScorecard && !isReadinessValidated),
      path: '/readiness'
    }
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8FAFC', display: 'flex', flexDirection: 'column', width: '100%', maxWidth: '100vw', overflowX: 'hidden' }}>
      {/* SECTION 1: Unified Executive Top Navigation Header */}
      <DashboardTopNav
        candidateName={isDemoProfileActive ? 'Alex Vance' : manualProfile.fullName}
        candidateTitle={isDemoProfileActive ? 'Lead Financial Systems Analyst' : manualProfile.currentTitle}
        targetRoleSlug={targetRoleSlug}
        allRoles={DEMO_CAREER_ROLES}
        onSelectTargetRole={setTargetRoleSlug}
        onOpenSearch={() => setIsSearchPaletteOpen(true)}
        isRealProfileReviewed={isRealProfileReviewed}
        isRealProfileLoaded={isRealProfileLoaded}
        isDemoProfileActive={isDemoProfileActive}
        unreviewedSkillsCount={unreviewedSkills.length}
        confirmedSkillsCount={confirmedSkills.length}
        completedLearningCount={completedLearningCount}
        projectsCompletedCount={projectsCompletedCount}
        onOpenResetModal={() => setIsResetModalOpen(true)}
        onLoadDemoBaseline={loadDemoBaseline}
      />

      {/* Main Dashboard Surfaces */}
      <main
        style={{
          maxWidth: '1440px',
          width: '100%',
          margin: '0 auto',
          padding: '1.25rem 1rem 3rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          flex: 1,
          boxSizing: 'border-box',
          overflowX: 'hidden'
        }}
      >
        {/* SECTION 2: Career Transition Overview Header & 4-Stat Bar */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#001A47', margin: 0, letterSpacing: '-0.01em' }}>
                Your Career Transition
              </h1>
              <p style={{ fontSize: '0.82rem', color: '#64748B', margin: '0.2rem 0 0' }}>
                Deterministic AI intelligence mapping your enterprise competencies to verified SAP career destinations
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  backgroundColor: isDemoProfileActive
                    ? '#FEF3E8'
                    : isRealProfileReviewed
                    ? '#E8F5ED'
                    : isRealProfileLoaded
                    ? '#EBF3FB'
                    : '#F1F5F9',
                  color: isDemoProfileActive
                    ? '#E9730C'
                    : isRealProfileReviewed
                    ? '#107E3E'
                    : isRealProfileLoaded
                    ? '#0A6ED1'
                    : '#64748B',
                  padding: '0.25rem 0.65rem',
                  borderRadius: '20px',
                  border: `1px solid ${
                    isDemoProfileActive
                      ? '#FBD38D'
                      : isRealProfileReviewed
                      ? '#B8E3C8'
                      : isRealProfileLoaded
                      ? '#B9D5F5'
                      : '#CBD5E1'
                  }`
                }}
              >
                {isDemoProfileActive
                  ? 'Demo Baseline Active (Alex Vance)'
                  : isRealProfileReviewed
                  ? 'Verified Candidate Profile'
                  : isRealProfileLoaded
                  ? 'Intake Staged (Review Pending)'
                  : 'Empty Session'}
              </span>
            </div>
          </div>

          <section
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #D9E1E8',
              borderRadius: '12px',
              padding: '1.25rem 1rem',
              boxShadow: '0 2px 8px rgba(0, 26, 71, 0.04)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
              gap: '1.25rem'
            }}
          >
            {/* Stat 1: Candidate Identity */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', paddingRight: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Candidate Profile
              </span>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#001A47' }}>
                {isDemoProfileActive ? 'Alex Vance' : manualProfile.fullName || 'No Candidate Loaded'}
              </div>
              <div style={{ fontSize: '0.82rem', color: '#475569' }}>
                {isDemoProfileActive ? 'Senior Financial Analyst' : manualProfile.currentTitle || 'Title Not Specified'} • {manualProfile.yearsExperience > 0 ? `${manualProfile.yearsExperience} yrs exp` : 'Intake pending'}
              </div>
            </div>

            {/* Stat 2: Resume Document Source */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', paddingRight: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Document Source
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileTextIcon size={18} color="#0A6ED1" />
                <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#001A47', wordBreak: 'break-all' }}>
                  {uploadedFile ? uploadedFile.name : isDemoProfileActive ? 'Alex Vance Demo Baseline' : 'No Resume Uploaded'}
                </span>
              </div>
              <div>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    backgroundColor: uploadedFile ? '#E8F5ED' : isDemoProfileActive ? '#FEF3E8' : '#F1F5F9',
                    color: uploadedFile ? '#107E3E' : isDemoProfileActive ? '#E9730C' : '#64748B',
                    padding: '0.15rem 0.5rem',
                    borderRadius: '4px'
                  }}
                >
                  {uploadedFile ? 'Parsed in-memory (PDF/DOCX)' : isDemoProfileActive ? 'Curated Hackathon Baseline' : 'Upload Pending'}
                </span>
              </div>
            </div>

            {/* Stat 3: Target Role Selection */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', paddingRight: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Target Career Goal
                </span>
                <button
                  onClick={() => setIsRolePickerModalOpen(true)}
                  style={{
                    fontSize: '0.72rem',
                    color: '#0A6ED1',
                    fontWeight: 700,
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0
                  }}
                >
                  Change Role
                </button>
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: '#001A47' }}>
                {targetRole.title}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#64748B' }}>
                {targetRole.ecosystem} • {targetRole.track.replace(/_/g, ' ')}
              </div>
            </div>

            {/* Stat 4: Competency Calibration Status */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Competency Status
              </span>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#001A47' }}>
                {isRealProfileReviewed
                  ? `${confirmedSkills.length} Confirmed (${transferableSkills.length} Transferable)`
                  : skills.length > 0
                  ? `${skills.length} Extracted (Review Pending)`
                  : '0 Skills Registered'}
              </div>
              <div>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    backgroundColor: isRealProfileReviewed ? '#E8F5ED' : skills.length > 0 ? '#FEF3E8' : '#F1F5F9',
                    color: isRealProfileReviewed ? '#107E3E' : skills.length > 0 ? '#E9730C' : '#64748B',
                    padding: '0.15rem 0.5rem',
                    borderRadius: '4px'
                  }}
                >
                  {isRealProfileReviewed ? 'Calibrated for Transition Engine' : skills.length > 0 ? 'Human Review Required' : 'Intake Required'}
                </span>
              </div>
            </div>
          </section>
        </div>

        {/* SECTION 3: Four Meaningful Quantitative Metric Cards */}
        <section
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
            gap: '1.25rem'
          }}
        >
          {/* Metric 1: Confirmed Skills */}
          <div
            onClick={() => {
              if (confirmedSkills.length > 0) setSkillsModalFilter('CONFIRMED');
              else navigate('/skills-review');
            }}
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #D9E1E8',
              borderRadius: '10px',
              padding: '1.25rem',
              boxShadow: '0 2px 6px rgba(0, 26, 71, 0.04)',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#0A6ED1';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 26, 71, 0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#D9E1E8';
              e.currentTarget.style.boxShadow = '0 2px 6px rgba(0, 26, 71, 0.04)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                Confirmed Skills
              </span>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: confirmedSkills.length > 0 ? '#107E3E' : '#64748B', backgroundColor: confirmedSkills.length > 0 ? '#E8F5ED' : '#F1F5F9', padding: '0.15rem 0.45rem', borderRadius: '4px' }}>
                {isRealProfileReviewed ? 'Calibrated' : `${unreviewedSkills.length} unreviewed`}
              </span>
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#001A47' }}>
              {confirmedSkills.length}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '0.35rem' }}>
              {confirmedSkills.length > 0 ? `${transferableSkills.length} Transferable to target role` : 'No verified competencies'}
            </div>
          </div>

          {/* Metric 2: Transferable Skills */}
          <div
            onClick={() => {
              if (transferableSkills.length > 0) setSkillsModalFilter('TRANSFERABLE');
              else navigate('/skills-review');
            }}
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #D9E1E8',
              borderRadius: '10px',
              padding: '1.25rem',
              boxShadow: '0 2px 6px rgba(0, 26, 71, 0.04)',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#0A6ED1';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 26, 71, 0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#D9E1E8';
              e.currentTarget.style.boxShadow = '0 2px 6px rgba(0, 26, 71, 0.04)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                Transferable Skills
              </span>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#0A6ED1', backgroundColor: '#EBF3FB', padding: '0.15rem 0.45rem', borderRadius: '4px' }}>
                Cross-Functional
              </span>
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#001A47' }}>
              {transferableSkills.length}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '0.35rem' }}>
              {transferableSkills.length > 0 ? `Strengths mapped to ${targetRole.ecosystem}` : 'Awaiting skill review'}
            </div>
          </div>

          {/* Metric 3: Priority Skill Gaps */}
          <div
            onClick={() => navigate('/careers')}
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #D9E1E8',
              borderRadius: '10px',
              padding: '1.25rem',
              boxShadow: '0 2px 6px rgba(0, 26, 71, 0.04)',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#0A6ED1';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 26, 71, 0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#D9E1E8';
              e.currentTarget.style.boxShadow = '0 2px 6px rgba(0, 26, 71, 0.04)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                Priority Skill Gaps
              </span>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#BB0000', backgroundColor: '#FDEDED', padding: '0.15rem 0.45rem', borderRadius: '4px' }}>
                Mandatory
              </span>
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#001A47' }}>
              {isRealProfileReviewed ? missingSkillsList.length : skills.length > 0 ? missingSkillsList.length : 0}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '0.35rem' }}>
              {missingSkillsList.length > 0 ? `Required competencies for ${targetRole.title}` : 'No identified gaps'}
            </div>
          </div>

          {/* Metric 4: Learning Milestones */}
          <div
            onClick={() => navigate('/learning')}
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #D9E1E8',
              borderRadius: '10px',
              padding: '1.25rem',
              boxShadow: '0 2px 6px rgba(0, 26, 71, 0.04)',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#0A6ED1';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 26, 71, 0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#D9E1E8';
              e.currentTarget.style.boxShadow = '0 2px 6px rgba(0, 26, 71, 0.04)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                Curriculum Completed
              </span>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: isEmptySession ? '#64748B' : honestLearningPct === 100 ? '#107E3E' : '#0A6ED1', backgroundColor: isEmptySession ? '#F1F5F9' : honestLearningPct === 100 ? '#E8F5ED' : '#EBF3FB', padding: '0.15rem 0.45rem', borderRadius: '4px' }}>
                {isEmptySession ? 'Intake Required' : `${honestLearningPct}% Progress`}
              </span>
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#001A47' }}>
              {isEmptySession ? '—' : `${completedLearningCount} / ${totalLearningCount}`}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '0.35rem' }}>
              {isEmptySession ? 'Intake required for curriculum' : 'Self-reported milestone completions'}
            </div>
          </div>
        </section>

        {/* SECTION 4: Dynamic Next Recommended Action Banner */}
        <section
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #D9E1E8',
            borderLeft: `6px solid ${nextAction.badgeColor}`,
            borderRadius: '10px',
            padding: '1.25rem 1.25rem',
            boxShadow: '0 2px 10px rgba(0, 26, 71, 0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.25rem',
            flexWrap: 'wrap',
            boxSizing: 'border-box'
          }}
        >
          <div style={{ flex: 1, minWidth: 'min(100%, 280px)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
              <span
                style={{
                  backgroundColor: nextAction.badgeBg,
                  color: nextAction.badgeColor,
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  padding: '0.2rem 0.55rem',
                  borderRadius: '4px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em'
                }}
              >
                {nextAction.badge}
              </span>
              <span style={{ fontSize: '0.8rem', color: '#64748B' }}>
                Next Recommended Strategic Action
              </span>
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#001A47', margin: '0 0 0.35rem' }}>
              {nextAction.title}
            </h2>
            <p style={{ color: '#475569', fontSize: '0.92rem', margin: 0, lineHeight: 1.45, maxWidth: '820px' }}>
              {nextAction.description}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            {nextAction.secondaryButtonLabel && (
              <button
                onClick={() => {
                  if (nextAction.secondaryButtonAction) {
                    nextAction.secondaryButtonAction();
                  }
                }}
                style={{
                  backgroundColor: '#FFFFFF',
                  color: '#0A6ED1',
                  border: '1px solid #CBD5E1',
                  borderRadius: '6px',
                  padding: '0.75rem 1.25rem',
                  fontSize: '0.92rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F0F6FC')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FFFFFF')}
              >
                {nextAction.secondaryButtonLabel}
              </button>
            )}

            <button
              onClick={() => {
                if (nextAction.buttonAction) {
                  nextAction.buttonAction();
                } else {
                  navigate(nextAction.buttonPath);
                }
              }}
              style={{
                backgroundColor: '#0A6ED1',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '6px',
                padding: '0.75rem 1.5rem',
                fontSize: '0.92rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 2px 6px rgba(10, 110, 209, 0.3)',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#0854A0')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#0A6ED1')}
            >
              <span>{nextAction.buttonLabel}</span>
            </button>
          </div>
        </section>

        {/* SECTION 5: Visual Career Transition Map (Horizontal 7-step journey) */}
        <section
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #D9E1E8',
            borderRadius: '12px',
            padding: '1.25rem 1.5rem',
            boxShadow: '0 2px 8px rgba(0, 26, 71, 0.04)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#001A47', margin: 0 }}>
                Career Transition Roadmap
              </h3>
              <p style={{ fontSize: '0.78rem', color: '#64748B', margin: '0.2rem 0 0' }}>
                End-to-end milestone workflow from raw resume extraction to verified external career destinations
              </p>
            </div>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                color: '#0A6ED1',
                backgroundColor: '#EBF3FB',
                padding: '0.2rem 0.55rem',
                borderRadius: '4px'
              }}
            >
              Interactive Milestone Map
            </span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 130px), 1fr))',
              gap: '0.75rem'
            }}
          >
            {transitionSteps.map((step) => {
              const borderCol = step.isComplete ? '#107E3E' : step.isActive ? '#0A6ED1' : '#E2E8F0';
              const bgCol = step.isComplete ? '#F4FAF6' : step.isActive ? '#EBF3FB' : '#FFFFFF';
              return (
                <div
                  key={step.id}
                  onClick={() => navigate(step.path)}
                  style={{
                    border: `1.5px solid ${borderCol}`,
                    backgroundColor: bgCol,
                    borderRadius: '8px',
                    padding: '0.75rem 0.65rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: '85px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 10px rgba(0, 26, 71, 0.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span
                      style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        backgroundColor: step.isComplete ? '#107E3E' : step.isActive ? '#0A6ED1' : '#94A3B8',
                        color: '#FFFFFF',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {step.isComplete ? <CheckIcon size={12} /> : step.stepNumber}
                    </span>
                    <span style={{ fontSize: '0.65rem', fontWeight: 700, color: step.isComplete ? '#107E3E' : step.isActive ? '#0A6ED1' : '#94A3B8' }}>
                      {step.isComplete ? 'DONE' : step.isActive ? 'ACTIVE' : 'NEXT'}
                    </span>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#001A47', marginTop: '0.4rem' }}>
                      {step.title}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#64748B', marginTop: '0.15rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {step.subtitle}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION 5: Career Intelligence (Two-Column Layout on Desktop) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: '1.5rem', width: '100%', boxSizing: 'border-box' }}>
          {/* LEFT COLUMN: Career Matching & Gap Breakdown */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            {/* Card 5A: Target Role Match & Competency Breakdown */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #D9E1E8',
                borderRadius: '12px',
                padding: '1.5rem',
                boxShadow: '0 2px 8px rgba(0, 26, 71, 0.05)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.25rem' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0A6ED1', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Target Role Match Breakdown
                  </span>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#001A47', margin: '0.2rem 0 0' }}>
                    {targetRole.title}
                  </h3>
                  <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '0.2rem' }}>
                    {isEmptySession
                      ? 'No candidate loaded — upload a resume or load demo baseline'
                      : isVerifiedBackendMatch
                      ? 'Verified Backend AI Matching Engine (Deterministic Ontology)'
                      : isRealProfileReviewed
                      ? 'Local Calibration Fallback'
                      : 'Sample Baseline Evaluation (Review skills for verified score)'}
                  </div>
                </div>

                {/* Match percentage circular badge */}
                <div
                  style={{
                    backgroundColor: targetMatchScore >= 70 ? '#E8F5ED' : '#EBF3FB',
                    border: `2px solid ${targetMatchScore >= 70 ? '#107E3E' : '#0A6ED1'}`,
                    color: targetMatchScore >= 70 ? '#107E3E' : '#0A6ED1',
                    borderRadius: '12px',
                    padding: '0.6rem 0.9rem',
                    textAlign: 'center',
                    minWidth: '85px'
                  }}
                >
                  <div style={{ fontSize: '1.45rem', fontWeight: 800, lineHeight: 1 }}>
                    {targetMatchScore}%
                  </div>
                  <div style={{ fontSize: '0.65rem', fontWeight: 700, marginTop: '0.2rem', textTransform: 'uppercase' }}>
                    Fit Score
                  </div>
                </div>
              </div>

              {/* Notice for session state */}
              {isEmptySession ? (
                <div
                  style={{
                    backgroundColor: '#F8FAFC',
                    border: '1px solid #CBD5E1',
                    borderRadius: '8px',
                    padding: '0.75rem 1rem',
                    marginBottom: '1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.75rem'
                  }}
                >
                  <span style={{ color: '#475569', fontSize: '0.82rem' }}>
                    Upload a candidate resume or load the demo candidate to calculate verified role match scores.
                  </span>
                  <button
                    onClick={() => navigate('/profile')}
                    style={{
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      color: '#0A6ED1',
                      background: 'none',
                      border: '1px solid #0A6ED1',
                      borderRadius: '4px',
                      padding: '0.25rem 0.6rem',
                      cursor: 'pointer'
                    }}
                  >
                    Go to Intake
                  </button>
                </div>
              ) : !isRealProfileReviewed ? (
                <div
                  style={{
                    backgroundColor: '#FEF3E8',
                    border: '1px solid #FBD38D',
                    borderRadius: '8px',
                    padding: '0.75rem 1rem',
                    marginBottom: '1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.75rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#C05621', fontSize: '0.82rem' }}>
                    <AlertTriangleIcon size={18} color="#C05621" />
                    <span>Review your extracted skills to generate verified backend match scores.</span>
                  </div>
                  <button
                    onClick={() => navigate('/skills-review')}
                    style={{
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      color: '#C05621',
                      background: 'none',
                      border: '1px solid #C05621',
                      borderRadius: '4px',
                      padding: '0.25rem 0.6rem',
                      cursor: 'pointer'
                    }}
                  >
                    Review Skills
                  </button>
                </div>
              ) : null}

              {/* Matched vs Missing Skills Summary */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 140px), 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
                <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#107E3E', fontWeight: 700, fontSize: '0.82rem' }}>
                    <CheckIcon size={14} color="#107E3E" />
                    <span>Matched Competencies ({matchedSkillsList.length})</span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.5rem' }}>
                    {matchedSkillsList.slice(0, 4).map((s) => (
                      <span key={s} style={{ fontSize: '0.72rem', backgroundColor: '#E8F5ED', color: '#107E3E', padding: '0.15rem 0.45rem', borderRadius: '4px', fontWeight: 500 }}>
                        {s}
                      </span>
                    ))}
                    {matchedSkillsList.length > 4 && (
                      <span style={{ fontSize: '0.72rem', color: '#64748B', padding: '0.15rem' }}>
                        +{matchedSkillsList.length - 4} more
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#BB0000', fontWeight: 700, fontSize: '0.82rem' }}>
                    <AlertTriangleIcon size={14} color="#BB0000" />
                    <span>Priority Gaps ({missingSkillsList.length})</span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.5rem' }}>
                    {missingSkillsList.slice(0, 4).map((s: string) => (
                      <span key={s} style={{ fontSize: '0.72rem', backgroundColor: '#FDEDED', color: '#BB0000', padding: '0.15rem 0.45rem', borderRadius: '4px', fontWeight: 500 }}>
                        {s}
                      </span>
                    ))}
                    {missingSkillsList.length > 4 && (
                      <span style={{ fontSize: '0.72rem', color: '#64748B', padding: '0.15rem' }}>
                        +{missingSkillsList.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Links */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #EDF1F5', paddingTop: '0.85rem' }}>
                <button
                  onClick={() => {
                    setExplainingRoleData({
                      role: targetRole,
                      score: targetMatchScore,
                      matchedSkills: matchedSkillsList,
                      missingSkills: missingSkillsList
                    });
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#0A6ED1',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                >
                  <span>Inspect Explainability Formula</span>
                  <ArrowRightIcon size={12} />
                </button>

                <button
                  onClick={() => navigate('/careers')}
                  style={{
                    backgroundColor: '#F1F5F9',
                    border: '1px solid #CBD5E1',
                    borderRadius: '6px',
                    color: '#001A47',
                    padding: '0.35rem 0.75rem',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Full 14-Role Comparison →
                </button>
              </div>
            </div>

            {/* Card 5B: Pure SVG Career DNA Radar Chart */}
            <div id="career-dna">
              <CareerDnaRadarChart skills={skills} targetRole={targetRole} />
            </div>
          </div>

          {/* RIGHT COLUMN: Curated Learning & Projects */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            {/* Card 5C: Active Learning Pathway Recommendations */}
            <div
              id="learning-pathway"
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #D9E1E8',
                borderRadius: '12px',
                padding: '1.5rem',
                boxShadow: '0 2px 8px rgba(0, 26, 71, 0.05)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#001A47', margin: 0 }}>
                    Target Learning Pathway
                  </h3>
                  <p style={{ fontSize: '0.78rem', color: '#64748B', margin: '0.2rem 0 0' }}>
                    Curated SAP Learning Hub & openSAP curriculum for {targetRole.title}
                  </p>
                </div>

                <button
                  onClick={() => navigate('/learning')}
                  style={{
                    fontSize: '0.78rem',
                    color: '#0A6ED1',
                    fontWeight: 700,
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  View Full Syllabus →
                </button>
              </div>

              {/* Content for Empty vs Active Session */}
              {isEmptySession ? (
                <div
                  style={{
                    backgroundColor: '#F8FAFC',
                    border: '1px solid #CBD5E1',
                    borderRadius: '8px',
                    padding: '1.5rem',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.75rem'
                  }}
                >
                  <p style={{ color: '#475569', fontSize: '0.88rem', margin: 0, maxWidth: '400px' }}>
                    Curated learning pathways and milestone tracking are calibrated after candidate intake and skill confirmation.
                  </p>
                  <button
                    onClick={() => navigate('/profile')}
                    style={{
                      backgroundColor: '#0A6ED1',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '0.55rem 1.1rem',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Go to Intake →
                  </button>
                </div>
              ) : (
                <>
                  {/* Honest Fractional Progress Indicator */}
                  <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, color: '#001A47', marginBottom: '0.4rem' }}>
                      <span>Curriculum Completion</span>
                      <span style={{ color: '#0A6ED1' }}>
                        {completedLearningCount} of {totalLearningCount} Milestones ({honestLearningPct}%)
                      </span>
                    </div>
                    <div style={{ width: '100%', height: '8px', backgroundColor: '#E2E8F0', borderRadius: '4px', overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${honestLearningPct}%`,
                          height: '100%',
                          backgroundColor: honestLearningPct === 100 ? '#107E3E' : '#0A6ED1',
                          transition: 'width 0.3s ease'
                        }}
                      />
                    </div>
                  </div>

                  {/* Module List */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {displayLearningModules.map((module) => {
                      const isDone = completedLearningIds.includes(module.id);
                      return (
                        <div
                          key={module.id}
                          style={{
                            border: `1px solid ${isDone ? '#B8E3C8' : '#E2E8F0'}`,
                            backgroundColor: isDone ? '#F4FAF6' : '#FFFFFF',
                            borderRadius: '8px',
                            padding: '0.85rem 1rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '0.75rem'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                            <input
                              type="checkbox"
                              checked={isDone}
                              onChange={() => toggleLearningCompletion(module.id)}
                              style={{ marginTop: '0.25rem', cursor: 'pointer', width: '16px', height: '16px' }}
                              title="Mark module complete"
                            />
                            <div>
                              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#001A47' }}>
                                {module.code}: {module.title}
                              </div>
                              <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '0.15rem' }}>
                                {module.provider} • {module.estimatedHours} hrs • Target: {module.targetSkill}
                              </div>
                            </div>
                          </div>

                          <a
                            href={module.externalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              fontSize: '0.75rem',
                              color: '#0A6ED1',
                              textDecoration: 'none',
                              fontWeight: 600,
                              padding: '0.3rem 0.55rem',
                              borderRadius: '4px',
                              border: '1px solid #D0E2F5',
                              backgroundColor: '#EBF3FB',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            Launch
                          </a>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {/* Card 5D: Practical Project Workspace Status */}
            <div
              id="projects"
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #D9E1E8',
                borderRadius: '12px',
                padding: '1.5rem',
                boxShadow: '0 2px 8px rgba(0, 26, 71, 0.05)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#001A47', margin: 0 }}>
                    Practical Project Workspace
                  </h3>
                  <p style={{ fontSize: '0.78rem', color: '#64748B', margin: '0.2rem 0 0' }}>
                    Hands-on enterprise challenge to build verifiable proof of competence
                  </p>
                </div>

                <button
                  onClick={() => navigate('/projects')}
                  style={{
                    fontSize: '0.78rem',
                    color: '#0A6ED1',
                    fontWeight: 700,
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  All Challenges →
                </button>
              </div>

              {/* Target Project Card */}
              <div
                style={{
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px',
                  padding: '1rem',
                  backgroundColor: '#F8FAFC',
                  marginBottom: '1rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem' }}>
                  <div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#001A47' }}>
                      {targetProject.title}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.2rem' }}>
                      Estimated effort: {targetProject.estimatedEffortHours} hrs • Difficulty: {targetProject.difficulty}
                    </div>
                  </div>

                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '0.2rem 0.55rem',
                      borderRadius: '4px',
                      backgroundColor:
                        projectStatus === 'REVIEWED'
                          ? '#E8F5ED'
                          : projectStatus === 'SUBMITTED'
                          ? '#EBF3FB'
                          : projectStatus === 'IN_PROGRESS'
                          ? '#FEF3E8'
                          : '#EDF1F5',
                      color:
                        projectStatus === 'REVIEWED'
                          ? '#107E3E'
                          : projectStatus === 'SUBMITTED'
                          ? '#0A6ED1'
                          : projectStatus === 'IN_PROGRESS'
                          ? '#E9730C'
                          : '#64748B'
                    }}
                  >
                    {projectStatus === 'REVIEWED'
                      ? `REVIEWED & SCORED (${currentSubmission?.overallScore !== undefined ? `${currentSubmission.overallScore}/100` : 'SCORED'})`
                      : projectStatus === 'SUBMITTED'
                      ? 'SUBMITTED (AWAITING REVIEW)'
                      : projectStatus === 'IN_PROGRESS'
                      ? 'IN PROGRESS'
                      : 'NOT STARTED'}
                  </span>
                </div>

                <p style={{ fontSize: '0.82rem', color: '#475569', margin: '0.6rem 0', lineHeight: 1.45 }}>
                  {targetProject.description}
                </p>

                {/* Target Skills Pills */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '0.75rem' }}>
                  {targetProject.targetSkills.map((sk) => (
                    <span key={sk} style={{ fontSize: '0.7rem', backgroundColor: '#FFFFFF', border: '1px solid #CBD5E1', color: '#001A47', padding: '0.1rem 0.45rem', borderRadius: '4px', fontWeight: 500 }}>
                      {sk}
                    </span>
                  ))}
                </div>

                {/* If reviewed, show simulated score feedback */}
                {currentSubmission?.status === 'REVIEWED' && (
                  <div
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #B8E3C8',
                      borderRadius: '6px',
                      padding: '0.75rem',
                      marginTop: '0.5rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, color: '#107E3E' }}>
                      <span>Rubric Evaluation Score: {currentSubmission?.overallScore !== undefined ? `${currentSubmission.overallScore} / 100` : 'Evaluated'}</span>
                      <span style={{ fontSize: '0.7rem', color: '#64748B' }}>Simulated Demonstration Reviewer</span>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#475569', marginTop: '0.3rem', fontStyle: 'italic' }}>
                      "{currentSubmission.reviewerFeedback}"
                    </div>
                  </div>
                )}
              </div>

              {/* Workspace Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                {projectStatus === 'NOT_STARTED' && (
                  <button
                    onClick={() => handleStartProject(targetProject.id)}
                    style={{
                      backgroundColor: '#0A6ED1',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '0.55rem 1.1rem',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Initialize Workspace
                  </button>
                )}

                {projectStatus === 'IN_PROGRESS' && (
                  <button
                    onClick={() => handleOpenSubmitModal(targetProject)}
                    style={{
                      backgroundColor: '#0A6ED1',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '0.55rem 1.1rem',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Submit Deliverables
                  </button>
                )}

                {projectStatus === 'SUBMITTED' && (
                  <button
                    onClick={() => handleSimulateReview(targetProject.id)}
                    style={{
                      backgroundColor: '#107E3E',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '0.55rem 1.1rem',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Simulate Review Evaluation
                  </button>
                )}

                {projectStatus === 'REVIEWED' && (
                  <button
                    onClick={() => handleOpenSubmitModal(targetProject)}
                    style={{
                      backgroundColor: '#F1F5F9',
                      border: '1px solid #CBD5E1',
                      color: '#001A47',
                      borderRadius: '6px',
                      padding: '0.55rem 1.1rem',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Update Submission
                  </button>
                )}

                <button
                  onClick={() => navigate('/projects')}
                  style={{
                    backgroundColor: 'transparent',
                    border: '1px solid #CBD5E1',
                    borderRadius: '6px',
                    color: '#475569',
                    padding: '0.55rem 1rem',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Workspace Rubric & Guidelines
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 6: Recommendations & Curated Pathways */}
        <section
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #D9E1E8',
            borderRadius: '12px',
            padding: '1.5rem',
            boxShadow: '0 2px 8px rgba(0, 26, 71, 0.05)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#001A47', margin: 0 }}>
                Top Alternative SAP Career Pathways
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#64748B', margin: '0.2rem 0 0' }}>
                Curated SAP Catalogue Assessment (October 2026) — Verified Against 14 Official SAP Enterprise Role Profiles
              </p>
            </div>

            <button
              onClick={() => navigate('/careers')}
              style={{
                backgroundColor: '#EBF3FB',
                color: '#0A6ED1',
                border: '1px solid #D0E2F5',
                padding: '0.45rem 0.9rem',
                borderRadius: '6px',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <ColumnsIcon size={14} />
              <span>Compare All 14 Roles Side-by-Side</span>
            </button>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))',
              gap: '1rem'
            }}
          >
            {alternativeRoles.map(({ role, matchScore, matchedSkills, missingSkills }) => {
              const isHigh = matchScore >= 60;
              return (
                <div
                  key={role.id}
                  style={{
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    padding: '1rem',
                    backgroundColor: '#F8FAFC',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '0.75rem',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#FFFFFF';
                    e.currentTarget.style.borderColor = '#0A6ED1';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 26, 71, 0.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#F8FAFC';
                    e.currentTarget.style.borderColor = '#E2E8F0';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                      <span
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          backgroundColor: '#EDF1F5',
                          color: '#475569',
                          padding: '0.15rem 0.45rem',
                          borderRadius: '4px'
                        }}
                      >
                        {role.ecosystem}
                      </span>

                      <span
                        style={{
                          fontSize: '0.8rem',
                          fontWeight: 800,
                          color: isHigh ? '#107E3E' : '#0A6ED1',
                          backgroundColor: isHigh ? '#E8F5ED' : '#EBF3FB',
                          padding: '0.2rem 0.55rem',
                          borderRadius: '10px'
                        }}
                      >
                        {matchScore}% Fit
                      </span>
                    </div>

                    <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#001A47', lineHeight: 1.3 }}>
                      {role.title}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.2rem' }}>
                      Track: {role.track.replace(/_/g, ' ')}
                    </div>

                    <div style={{ fontSize: '0.75rem', color: '#475569', marginTop: '0.6rem' }}>
                      {matchedSkills.length} matched • {missingSkills.length} remaining gaps
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderTop: '1px solid #EDF1F5', paddingTop: '0.65rem' }}>
                    <button
                      onClick={() => setTargetRoleSlug(role.slug)}
                      style={{
                        flex: 1,
                        backgroundColor: '#0A6ED1',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '0.4rem 0.6rem',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Set as Target
                    </button>

                    <button
                      onClick={() => navigate('/careers')}
                      style={{
                        backgroundColor: '#FFFFFF',
                        color: '#001A47',
                        border: '1px solid #CBD5E1',
                        borderRadius: '4px',
                        padding: '0.4rem 0.6rem',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      Compare
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* Global Search Palette Modal (Cmd+K) */}
      <GlobalSearchPalette
        isOpen={isSearchPaletteOpen}
        onClose={() => setIsSearchPaletteOpen(false)}
        skills={skills}
        onSelectRole={(slug) => setTargetRoleSlug(slug)}
        onSelectSkill={(skill) => {
          setSkillsModalFilter(skill.isConfirmed ? 'CONFIRMED' : 'SUGGESTED');
        }}
      />

      {/* Skills Detail Modal */}
      <SkillsDetailModal
        isOpen={skillsModalFilter !== null}
        onClose={() => setSkillsModalFilter(null)}
        skills={skills}
        initialFilter={skillsModalFilter || 'ALL'}
      />

      {/* Explain Match Formula Modal */}
      <ExplainMatchModal
        isOpen={explainingRoleData !== null}
        onClose={() => setExplainingRoleData(null)}
        role={explainingRoleData?.role || null}
        matchScore={explainingRoleData?.score || 0}
        matchedSkills={explainingRoleData?.matchedSkills || []}
        missingSkills={explainingRoleData?.missingSkills || []}
      />

      {/* Practical Project Deliverable Submission Modal */}
      <ProjectSubmitModal
        isOpen={submittingProject !== null}
        onClose={() => setSubmittingProject(null)}
        project={submittingProject}
        profileId={currentProfileId || 'demo-profile'}
        onSubmit={handleProjectSubmit}
      />

      {/* Session Reset Confirmation Modal */}
      <ResetSessionModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
      />

      {/* Quick Role Switcher Modal */}
      {isRolePickerModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 26, 71, 0.65)',
            backdropFilter: 'blur(4px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem 1rem'
          }}
          onClick={() => setIsRolePickerModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              width: '100%',
              maxWidth: '620px',
              maxHeight: '80vh',
              boxShadow: '0 20px 40px rgba(0, 26, 71, 0.25)',
              border: '1px solid #D9E1E8',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                padding: '1.25rem 1.5rem',
                borderBottom: '1px solid #E2E8F0',
                backgroundColor: '#001A47',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>
                  Select Target SAP Career Role
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#C4D5EA', margin: '0.2rem 0 0' }}>
                  Choose from 14 curated enterprise roles to re-calibrate your dashboard
                </p>
              </div>
              <button
                onClick={() => setIsRolePickerModalOpen(false)}
                style={{
                  color: '#FFFFFF',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '6px',
                  padding: '0.4rem',
                  display: 'flex',
                  alignItems: 'center',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <CloseIcon size={18} />
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {DEMO_CAREER_ROLES.map((role) => {
                const isSelected = role.slug === targetRoleSlug;
                const match = calculateRoleMatch(role);
                return (
                  <div
                    key={role.id}
                    onClick={() => {
                      setTargetRoleSlug(role.slug);
                      setIsRolePickerModalOpen(false);
                    }}
                    style={{
                      padding: '0.75rem 1rem',
                      borderRadius: '8px',
                      border: isSelected ? '2px solid #0A6ED1' : '1px solid #EDF1F5',
                      backgroundColor: isSelected ? '#EBF3FB' : '#FFFFFF',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) e.currentTarget.style.backgroundColor = '#F8FAFC';
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) e.currentTarget.style.backgroundColor = '#FFFFFF';
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#001A47' }}>
                        {role.title}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                        {role.ecosystem} • {role.track.replace(/_/g, ' ')}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span
                        style={{
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          backgroundColor: match.percentage >= 70 ? '#E8F5ED' : '#F1F5F9',
                          color: match.percentage >= 70 ? '#107E3E' : '#0A6ED1',
                          padding: '0.2rem 0.55rem',
                          borderRadius: '10px'
                        }}
                      >
                        {match.percentage}% Match
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
