import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  HealthResponse,
  ProficiencyLevel,
  ExtractedSkillItem,
  ResumeUploadResponse,
  ProfileReviewResponse,
  CareerMatchResult,
  SkillGapAnalysis,
  LearningPathway,
  CareerComparisonResult,
  CareerRole
} from '@career-orchestrator/shared';
import { INITIAL_DEMO_SKILLS } from '../demo/demoSkills';
import { DEMO_CAREER_ROLES, ExtendedCareerRole } from '../demo/demoCareers';

export interface ManualProfileData {
  fullName: string;
  currentTitle: string;
  yearsExperience: number;
  education: string;
  responsibilities: string;
}

export interface ProjectEvidenceSubmission {
  projectId: string;
  submissionUrl: string;
  reflectionText: string;
  submittedAt: string;
}

interface CareerContextType {
  // Profile & Ingestion State
  currentProfileId: string | null;
  setCurrentProfileId: (id: string | null) => void;
  manualProfile: ManualProfileData;
  setManualProfile: React.Dispatch<React.SetStateAction<ManualProfileData>>;
  uploadedFile: { name: string; size: number; type: string } | null;
  setUploadedFile: (file: { name: string; size: number; type: string } | null) => void;
  extractedTextPreview: string;
  extractionWarnings: string[];
  isRealProfileLoaded: boolean;
  isRealProfileReviewed: boolean;
  handleUploadSuccess: (res: ResumeUploadResponse) => void;
  handleReviewSuccess: (res: ProfileReviewResponse) => void;
  resetToDemoData: () => void;

  // Skills State
  skills: ExtractedSkillItem[];
  setSkills: React.Dispatch<React.SetStateAction<ExtractedSkillItem[]>>;
  confirmSkill: (id: string) => void;
  rejectSkill: (id: string) => void;
  updateProficiency: (id: string, proficiency: ProficiencyLevel) => void;
  updateYearsExperience: (id: string, years: number) => void;
  editSkillName: (id: string, newName: string) => void;
  addManualSkill: (skill: Omit<ExtractedSkillItem, 'id'>) => void;

  // Career Targets & Comparison
  targetRole: ExtendedCareerRole;
  targetRoleSlug: string;
  setTargetRoleSlug: (slug: string) => void;
  comparisonRoleSlugs: string[];
  toggleComparisonRole: (slug: string) => void;
  calculateRoleMatch: (role: ExtendedCareerRole) => {
    percentage: number;
    matchedSkills: string[];
    missingSkills: string[];
    isCalculatedFromReviewedProfile: boolean;
  };

  // Real Backend Matching, Gaps, Pathways & Comparison
  careerMatches: CareerMatchResult[];
  isLoadingMatches: boolean;
  matchesError: string | null;
  fetchCareerMatches: (profileId?: string) => Promise<void>;

  currentGapAnalysis: SkillGapAnalysis | null;
  isLoadingGaps: boolean;
  fetchSkillGaps: (roleSlug: string, profileId?: string) => Promise<SkillGapAnalysis | null>;

  currentPathway: LearningPathway | null;
  isLoadingPathway: boolean;
  generateLearningPathway: (roleSlug: string, profileId?: string) => Promise<LearningPathway | null>;

  comparisonResult: CareerComparisonResult | null;
  isLoadingComparison: boolean;
  fetchComparison: (roleSlugs: string[], profileId?: string) => Promise<CareerComparisonResult | null>;

  // Learning & Projects
  completedLearningIds: string[];
  toggleLearningCompletion: (id: string) => void;
  projectSubmissions: Record<string, ProjectEvidenceSubmission>;
  submitProjectEvidence: (projectId: string, url: string, reflection: string) => void;

  // Backend Health
  backendHealth: HealthResponse | null;
  healthStatus: 'checking' | 'online' | 'offline';
}

const CareerContext = createContext<CareerContextType | undefined>(undefined);

export const CareerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Ingestion & Profile State
  const [currentProfileId, setCurrentProfileId] = useState<string | null>(null);
  const [extractedTextPreview, setExtractedTextPreview] = useState<string>('');
  const [extractionWarnings, setExtractionWarnings] = useState<string[]>([]);
  const [isRealProfileLoaded, setIsRealProfileLoaded] = useState<boolean>(false);
  const [isRealProfileReviewed, setIsRealProfileReviewed] = useState<boolean>(false);

  const [manualProfile, setManualProfile] = useState<ManualProfileData>({
    fullName: 'Alex Vance',
    currentTitle: 'Senior Financial Analyst',
    yearsExperience: 4.5,
    education: 'Bachelor of Science in Accounting & Information Systems',
    responsibilities:
      'Manage general ledger journal reconciliation, statutory balance sheet audits, and SQL-based variance audits.'
  });

  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: number; type: string } | null>(null);

  // 2. Skills State
  const [skills, setSkills] = useState<ExtractedSkillItem[]>(INITIAL_DEMO_SKILLS);

  // 3. Career Role Selection & Comparison
  const [targetRoleSlug, setTargetRoleSlug] = useState<string>('sap-s4hana-finance-consultant');
  const [comparisonRoleSlugs, setComparisonRoleSlugs] = useState<string[]>([
    'sap-s4hana-finance-consultant',
    'sap-abap-cloud-developer'
  ]);

  // 4. Backend Engine States
  const [careerMatches, setCareerMatches] = useState<CareerMatchResult[]>([]);
  const [isLoadingMatches, setIsLoadingMatches] = useState<boolean>(false);
  const [matchesError, setMatchesError] = useState<string | null>(null);

  const [currentGapAnalysis, setCurrentGapAnalysis] = useState<SkillGapAnalysis | null>(null);
  const [isLoadingGaps, setIsLoadingGaps] = useState<boolean>(false);

  const [currentPathway, setCurrentPathway] = useState<LearningPathway | null>(null);
  const [isLoadingPathway, setIsLoadingPathway] = useState<boolean>(false);

  const [comparisonResult, setComparisonResult] = useState<CareerComparisonResult | null>(null);
  const [isLoadingComparison, setIsLoadingComparison] = useState<boolean>(false);

  // 5. Learning & Projects
  const [completedLearningIds, setCompletedLearningIds] = useState<string[]>([]);
  const [projectSubmissions, setProjectSubmissions] = useState<Record<string, ProjectEvidenceSubmission>>({});

  // 6. Backend Health
  const [backendHealth, setBackendHealth] = useState<HealthResponse | null>(null);
  const [healthStatus, setHealthStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  // Check backend health on initial load
  useEffect(() => {
    let isMounted = true;
    fetch('/api/v1/health')
      .then((res) => (res.ok ? res.json() : null))
      .then((data: HealthResponse | null) => {
        if (isMounted) {
          if (data && data.status === 'ok') {
            setBackendHealth(data);
            setHealthStatus('online');
          } else {
            setHealthStatus('offline');
          }
        }
      })
      .catch(() => {
        if (isMounted) setHealthStatus('offline');
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const targetRole =
    DEMO_CAREER_ROLES.find((r) => r.slug === targetRoleSlug) || DEMO_CAREER_ROLES[0];

  const toggleComparisonRole = (slug: string) => {
    setComparisonRoleSlugs((prev) => {
      if (prev.includes(slug)) {
        return prev.filter((s) => s !== slug);
      }
      if (prev.length >= 4) {
        alert('You can compare a maximum of 4 career roles side-by-side.');
        return prev;
      }
      return [...prev, slug];
    });
  };

  /**
   * Fetch explainable career matches from backend
   */
  const fetchCareerMatches = useCallback(async (profileId?: string) => {
    const pid = profileId || currentProfileId;
    if (!pid) return;

    setIsLoadingMatches(true);
    setMatchesError(null);

    try {
      const res = await fetch(`/api/v1/careers/matches/${pid}`);
      if (!res.ok) {
        throw new Error(`Failed to fetch career matches (HTTP ${res.status})`);
      }
      const data = await res.json();
      if (data && Array.isArray(data.matches)) {
        setCareerMatches(data.matches);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error fetching matches';
      setMatchesError(msg);
    } finally {
      setIsLoadingMatches(false);
    }
  }, [currentProfileId]);

  /**
   * Fetch detailed skill gap analysis for target role
   */
  const fetchSkillGaps = useCallback(async (roleSlug: string, profileId?: string) => {
    const pid = profileId || currentProfileId;
    if (!pid) return null;

    setIsLoadingGaps(true);
    try {
      const res = await fetch(`/api/v1/careers/${roleSlug}/gaps/${pid}`);
      if (!res.ok) return null;
      const data = (await res.json()) as SkillGapAnalysis;
      setCurrentGapAnalysis(data);
      return data;
    } catch {
      return null;
    } finally {
      setIsLoadingGaps(false);
    }
  }, [currentProfileId]);

  /**
   * Request backend to generate sequenced learning pathway
   */
  const generateLearningPathway = useCallback(async (roleSlug: string, profileId?: string) => {
    const pid = profileId || currentProfileId;
    if (!pid) return null;

    setIsLoadingPathway(true);
    try {
      const res = await fetch('/api/v1/learning-pathways', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileId: pid, roleSlug })
      });
      if (!res.ok) return null;
      const data = (await res.json()) as LearningPathway;
      setCurrentPathway(data);
      return data;
    } catch {
      return null;
    } finally {
      setIsLoadingPathway(false);
    }
  }, [currentProfileId]);

  /**
   * Compare multiple roles side-by-side
   */
  const fetchComparison = useCallback(async (roleSlugs: string[], profileId?: string) => {
    const pid = profileId || currentProfileId;
    setIsLoadingComparison(true);
    try {
      const res = await fetch('/api/v1/careers/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileId: pid || undefined, roleSlugs })
      });
      if (!res.ok) return null;
      const data = (await res.json()) as CareerComparisonResult;
      setComparisonResult(data);
      return data;
    } catch {
      return null;
    } finally {
      setIsLoadingComparison(false);
    }
  }, [currentProfileId]);

  const handleUploadSuccess = (res: ResumeUploadResponse) => {
    setCurrentProfileId(res.profileId);
    setUploadedFile({
      name: res.filename,
      size: res.fileSizeBytes,
      type: res.filename.toLowerCase().endsWith('.docx')
        ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        : 'application/pdf'
    });
    setExtractedTextPreview(res.extractedTextPreview);
    setExtractionWarnings(res.warnings);
    setSkills(res.suggestedSkills);
    setIsRealProfileLoaded(true);
    setIsRealProfileReviewed(false);
  };

  const handleReviewSuccess = (res: ProfileReviewResponse) => {
    setSkills(res.confirmedSkills);
    setIsRealProfileReviewed(true);
    if (res.profileId && res.profileId !== 'demo-profile') {
      fetchCareerMatches(res.profileId);
    }
  };

  const resetToDemoData = () => {
    setCurrentProfileId(null);
    setUploadedFile(null);
    setExtractedTextPreview('');
    setExtractionWarnings([]);
    setSkills(INITIAL_DEMO_SKILLS);
    setIsRealProfileLoaded(false);
    setIsRealProfileReviewed(false);
    setCareerMatches([]);
    setCurrentGapAnalysis(null);
    setCurrentPathway(null);
  };

  const confirmSkill = (id: string) => {
    setSkills((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isConfirmed: true, reviewStatus: 'CONFIRMED' } : s))
    );
  };

  const rejectSkill = (id: string) => {
    setSkills((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isConfirmed: false, reviewStatus: 'REJECTED' } : s))
    );
  };

  const updateProficiency = (id: string, proficiency: ProficiencyLevel) => {
    setSkills((prev) =>
      prev.map((s) => (s.id === id ? { ...s, proficiency } : s))
    );
  };

  const updateYearsExperience = (id: string, yearsExperience: number) => {
    setSkills((prev) =>
      prev.map((s) => (s.id === id ? { ...s, yearsExperience } : s))
    );
  };

  const editSkillName = (id: string, newName: string) => {
    setSkills((prev) =>
      prev.map((s) => (s.id === id ? { ...s, name: newName } : s))
    );
  };

  const addManualSkill = (newSkill: Omit<ExtractedSkillItem, 'id'>) => {
    const item: ExtractedSkillItem = {
      ...newSkill,
      id: `manual-skill-${Date.now()}`
    };
    setSkills((prev) => [item, ...prev]);
  };

  const toggleLearningCompletion = (id: string) => {
    setCompletedLearningIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const submitProjectEvidence = (projectId: string, url: string, reflection: string) => {
    setProjectSubmissions((prev) => ({
      ...prev,
      [projectId]: {
        projectId,
        submissionUrl: url,
        reflectionText: reflection,
        submittedAt: new Date().toISOString()
      }
    }));
  };

  /**
   * Deterministic local match calculation (fallback when offline or demo)
   */
  const calculateRoleMatch = (role: ExtendedCareerRole | CareerRole) => {
    const backendMatch = careerMatches.find((m) => m.roleSlug === role.slug || m.roleId === role.id);
    if (backendMatch && isRealProfileReviewed) {
      return {
        percentage: backendMatch.overallScore,
        matchedSkills: backendMatch.matchedSkills.map((m) => m.skillName),
        missingSkills: backendMatch.missingMandatorySkills.map((m) => m.skillName),
        isCalculatedFromReviewedProfile: true
      };
    }

    const activeConfirmedSkills = skills.filter((s) => s.isConfirmed && s.reviewStatus === 'CONFIRMED');

    if (activeConfirmedSkills.length === 0) {
      return {
        percentage: 0,
        matchedSkills: [],
        missingSkills: role.requiredSkills.map((r) => r.skillName),
        isCalculatedFromReviewedProfile: isRealProfileReviewed
      };
    }

    const confirmedNames = activeConfirmedSkills.map((s) => s.name.toLowerCase());
    const matchedSkills: string[] = [];
    const missingSkills: string[] = [];
    let weightedMatchedScore = 0;
    let totalWeight = 0;

    for (const req of role.requiredSkills) {
      const weight = req.weight || 1.0;
      totalWeight += weight;

      const reqLower = req.skillName.toLowerCase();
      const isMatched = confirmedNames.some(
        (cName) => cName.includes(reqLower) || reqLower.includes(cName)
      );

      if (isMatched) {
        matchedSkills.push(req.skillName);
        weightedMatchedScore += weight;
      } else {
        missingSkills.push(req.skillName);
      }
    }

    const calculatedPercentage =
      totalWeight > 0 ? Math.round((weightedMatchedScore / totalWeight) * 100) : 0;

    return {
      percentage: calculatedPercentage,
      matchedSkills,
      missingSkills,
      isCalculatedFromReviewedProfile: isRealProfileReviewed
    };
  };

  return (
    <CareerContext.Provider
      value={{
        currentProfileId,
        setCurrentProfileId,
        manualProfile,
        setManualProfile,
        uploadedFile,
        setUploadedFile,
        extractedTextPreview,
        extractionWarnings,
        isRealProfileLoaded,
        isRealProfileReviewed,
        handleUploadSuccess,
        handleReviewSuccess,
        resetToDemoData,
        skills,
        setSkills,
        confirmSkill,
        rejectSkill,
        updateProficiency,
        updateYearsExperience,
        editSkillName,
        addManualSkill,
        targetRole,
        targetRoleSlug,
        setTargetRoleSlug,
        comparisonRoleSlugs,
        toggleComparisonRole,
        calculateRoleMatch,
        careerMatches,
        isLoadingMatches,
        matchesError,
        fetchCareerMatches,
        currentGapAnalysis,
        isLoadingGaps,
        fetchSkillGaps,
        currentPathway,
        isLoadingPathway,
        generateLearningPathway,
        comparisonResult,
        isLoadingComparison,
        fetchComparison,
        completedLearningIds,
        toggleLearningCompletion,
        projectSubmissions,
        submitProjectEvidence,
        backendHealth,
        healthStatus
      }}
    >
      {children}
    </CareerContext.Provider>
  );
};

export const useCareerContext = () => {
  const context = useContext(CareerContext);
  if (!context) {
    throw new Error('useCareerContext must be used within a CareerProvider');
  }
  return context;
};
