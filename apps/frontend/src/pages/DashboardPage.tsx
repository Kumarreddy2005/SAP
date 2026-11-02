import React, { useState, useEffect } from 'react';
import { useCareerContext } from '../context/CareerContext';
import { DEMO_CAREER_ROLES, ExtendedCareerRole } from '../demo/demoCareers';
import { PracticalProjectDefinition, ProjectSubmissionInput, ProjectReviewInput } from '@career-orchestrator/shared';

// Dashboard components
import { DashboardSidebar } from '../components/dashboard/DashboardSidebar';
import { DashboardTopNav } from '../components/dashboard/DashboardTopNav';
import { CareerIdentityBanner } from '../components/dashboard/CareerIdentityBanner';
import { TransitionProgressTracker } from '../components/dashboard/TransitionProgressTracker';
import { InteractiveKpiGrid } from '../components/dashboard/InteractiveKpiGrid';
import { CareerDnaRadarChart } from '../components/dashboard/CareerDnaRadarChart';
import { RecommendedCareersSection } from '../components/dashboard/RecommendedCareersSection';
import { InteractiveSkillGapSection } from '../components/dashboard/InteractiveSkillGapSection';
import { LearningPathwaySection } from '../components/dashboard/LearningPathwaySection';
import { ProjectPortfolioSection } from '../components/dashboard/ProjectPortfolioSection';
import { CareerIntelligenceSection } from '../components/dashboard/CareerIntelligenceSection';
import { GlobalSearchPalette } from '../components/dashboard/GlobalSearchPalette';
import { SkillsDetailModal } from '../components/dashboard/SkillsDetailModal';
import { ExplainMatchModal } from '../components/dashboard/ExplainMatchModal';
import { ProjectSubmitModal } from '../components/dashboard/ProjectSubmitModal';
import { CloseIcon } from '../components/common/Icons';

export const DashboardPage: React.FC = () => {
  const {
    manualProfile,
    uploadedFile,
    skills,
    targetRole,
    targetRoleSlug,
    setTargetRoleSlug,
    calculateRoleMatch,
    isRealProfileReviewed,
    currentProfileId,
    resetToDemoData,
    completedLearningIds,
    toggleLearningCompletion,
    projects,
    activeProjectSubmissions,
    startProjectWorkspace,
    submitProjectDeliverables,
    reviewProjectDeliverables,
    healthStatus
  } = useCareerContext();

  // Layout & Navigation State
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Modals & Panels State
  const [isSearchPaletteOpen, setIsSearchPaletteOpen] = useState(false);
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

  // Compute matches for all 14 curated roles
  const rolesWithMatches = DEMO_CAREER_ROLES.map((role) => {
    const match = calculateRoleMatch(role);
    return {
      role,
      matchScore: match.percentage,
      matchedSkills: match.matchedSkills,
      missingSkills: match.missingSkills
    };
  });

  const activeMatch = calculateRoleMatch(targetRole);
  const activeMatchScore = activeMatch.percentage;

  // KPI metrics
  const confirmedSkills = skills.filter((s) => s.isConfirmed && s.reviewStatus === 'CONFIRMED');
  const transferableSkills = confirmedSkills.filter((s) => s.isTransferable);
  const recommendedRolesCount = rolesWithMatches.filter((r) => r.matchScore >= 40).length;
  const remainingGapsCount = activeMatch.missingSkills.length;
  const projectsCompletedCount = Object.values(activeProjectSubmissions).filter(
    (s) => s.status === 'REVIEWED' || s.status === 'COMPLETED'
  ).length;

  // Scroll helper
  const handleScrollToSection = (sectionId: string) => {
    setMobileSidebarOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Project workspace actions
  const handleStartProject = async (projectId: string) => {
    await startProjectWorkspace(projectId, currentProfileId || 'demo-profile');
  };

  const handleOpenSubmitModal = (projectId: string) => {
    const proj = projects.find((p) => p.id === projectId) || DEMO_CAREER_ROLES[0]?.suggestedProjectIds?.[0] ? projects[0] : null;
    if (proj) {
      setSubmittingProject(proj);
    } else {
      // Find from catalogue
      const defaultProj = {
        id: projectId,
        title: 'Enterprise Blueprint & Configuration',
        roleSlug: targetRoleSlug,
        difficulty: 'INTERMEDIATE' as const,
        estimatedEffortHours: 12,
        targetSkills: ['S/4HANA Finance Customizing (IMG)', 'General Ledger Accounting'],
        description: 'Complete hands-on enterprise setup deliverables.',
        deliverables: ['Configuration Document', 'Account Group Hierarchy'],
        rubricCriteria: [{ criterion: 'Completeness of Organizational Structure', weightPercentage: 100 }]
      };
      setSubmittingProject(defaultProj);
    }
  };

  const handleProjectSubmit = async (input: ProjectSubmissionInput) => {
    await submitProjectDeliverables(input);
  };

  const handleSimulateReview = async (projectId: string) => {
    const sub = activeProjectSubmissions[projectId];
    if (!sub) return;

    // Build simulated evaluation from project rubric
    const targetProject = projects.find((p) => p.id === projectId);
    const criteria = targetProject?.rubricCriteria || [
      { criterion: 'Completeness of Organizational Structure Hierarchy', weightPercentage: 50 },
      { criterion: 'Accurate General Ledger Account Group segmentation', weightPercentage: 50 }
    ];

    const reviewInput: ProjectReviewInput = {
      submissionId: sub.id,
      status: 'REVIEWED',
      reviewerFeedback:
        'Demonstrates solid foundational understanding of enterprise organizational setup and document splitting rules. [Simulated Demonstration Reviewer Mode]',
      reviewerType: 'SIMULATED_DEMO_REVIEWER',
      rubricAssessments: criteria.map((c) => ({
        criterion: c.criterion,
        weightPercentage: c.weightPercentage,
        awardedScore: 88,
        isSatisfied: true,
        feedback: `Meets enterprise standard for ${c.criterion}.`
      }))
    };

    await reviewProjectDeliverables(reviewInput);
  };

  const handleExplainMatch = (role: ExtendedCareerRole, score: number) => {
    const match = calculateRoleMatch(role);
    setExplainingRoleData({
      role,
      score,
      matchedSkills: match.matchedSkills,
      missingSkills: match.missingSkills
    });
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F5F7FA' }}>
      {/* Collapsible Dark Navy Sidebar (Desktop) */}
      <div className="hide-on-mobile">
        <DashboardSidebar
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          onScrollToSection={handleScrollToSection}
          candidateName={manualProfile.fullName}
          isRealProfileReviewed={isRealProfileReviewed}
          healthStatus={healthStatus}
          onResetDemo={resetToDemoData}
        />
      </div>

      {/* Mobile Sidebar Overlay Drawer */}
      {mobileSidebarOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            display: 'flex',
            backgroundColor: 'rgba(0, 26, 71, 0.7)'
          }}
          onClick={() => setMobileSidebarOpen(false)}
        >
          <div
            style={{ width: '260px', height: '100%', backgroundColor: '#001438' }}
            onClick={(e) => e.stopPropagation()}
          >
            <DashboardSidebar
              isCollapsed={false}
              onToggleCollapse={() => setMobileSidebarOpen(false)}
              onScrollToSection={handleScrollToSection}
              candidateName={manualProfile.fullName}
              isRealProfileReviewed={isRealProfileReviewed}
              healthStatus={healthStatus}
              onResetDemo={resetToDemoData}
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflowX: 'hidden' }}>
        {/* Top Navigation */}
        <DashboardTopNav
          candidateName={manualProfile.fullName}
          candidateTitle={manualProfile.currentTitle}
          targetRoleSlug={targetRoleSlug}
          allRoles={DEMO_CAREER_ROLES}
          onSelectTargetRole={setTargetRoleSlug}
          onOpenSearch={() => setIsSearchPaletteOpen(true)}
          isRealProfileReviewed={isRealProfileReviewed}
          onResetDemo={resetToDemoData}
          onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        />

        {/* Dashboard Body Surfaces */}
        <main
          style={{
            padding: '1.75rem 2rem',
            maxWidth: '1440px',
            width: '100%',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.75rem'
          }}
        >
          {/* Section B: Career Identity Banner */}
          <CareerIdentityBanner
            manualProfile={manualProfile}
            uploadedFile={uploadedFile}
            skills={skills}
            targetRole={targetRole}
            matchScore={activeMatchScore}
            onOpenRoleSelector={() => setIsRolePickerModalOpen(true)}
            isRealProfileReviewed={isRealProfileReviewed}
          />

          {/* Section C: Career Transition Progress */}
          <div id="progress">
            <TransitionProgressTracker
              isProfileComplete={Boolean(manualProfile.fullName && manualProfile.currentTitle)}
              skillsReviewedPct={skills.length > 0 ? (confirmedSkills.length / skills.length) * 100 : 0}
              confirmedCount={confirmedSkills.length}
              totalSkillsCount={skills.length}
              isCareerAnalysisComplete={Boolean(targetRoleSlug)}
              learningProgressPct={completedLearningIds.length > 0 ? Math.min(100, completedLearningIds.length * 34) : 0}
              completedLearningCount={completedLearningIds.length}
              totalLearningCount={3}
              projectEvidencePct={projectsCompletedCount > 0 ? Math.min(100, projectsCompletedCount * 50) : 0}
              completedProjectCount={projectsCompletedCount}
              totalProjectCount={2}
              onNavigateToSection={handleScrollToSection}
            />
          </div>

          {/* Section D: Interactive KPI Cards */}
          <InteractiveKpiGrid
            skillsIdentifiedCount={skills.length}
            skillsConfirmedCount={confirmedSkills.length}
            transferableCount={transferableSkills.length}
            recommendedRolesCount={recommendedRolesCount}
            remainingGapsCount={remainingGapsCount}
            projectsCompletedCount={projectsCompletedCount}
            onOpenSkillsModal={(filter) => setSkillsModalFilter(filter)}
            onScrollToSection={handleScrollToSection}
          />

          {/* Section E: Career DNA Radar Chart */}
          <div id="career-dna">
            <CareerDnaRadarChart skills={skills} targetRole={targetRole} />
          </div>

          {/* Section F: Recommended Career Opportunities */}
          <RecommendedCareersSection
            rolesWithMatches={rolesWithMatches}
            activeTargetSlug={targetRoleSlug}
            onSetTargetRole={setTargetRoleSlug}
            onExplainMatch={handleExplainMatch}
          />

          {/* Section G: Interactive Skill Gap Analysis */}
          <InteractiveSkillGapSection
            targetRole={targetRole}
            skills={skills}
            onNavigateToLearning={() => handleScrollToSection('learning-pathway')}
            onNavigateToProjects={() => handleScrollToSection('projects')}
          />

          {/* Section H: Personalized Learning Pathway */}
          <LearningPathwaySection
            targetRole={targetRole}
            completedLearningIds={completedLearningIds}
            toggleLearningCompletion={toggleLearningCompletion}
          />

          {/* Section I: Practical Projects & Evidence Portfolio */}
          <ProjectPortfolioSection
            projects={projects}
            activeSubmissions={activeProjectSubmissions}
            onStartProject={handleStartProject}
            onSubmitDeliverables={handleOpenSubmitModal}
            onSimulateReview={handleSimulateReview}
          />

          {/* Section J: Career Intelligence & Curated Insights */}
          <CareerIntelligenceSection targetRole={targetRole} />
        </main>
      </div>

      {/* Global Search Palette Modal */}
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
                  alignItems: 'center'
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
                      <div style={{ fontSize: '0.75rem', color: '#5B6876' }}>
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
