import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
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
  CareerRole,
  PracticalProjectDefinition,
  ProjectSubmission,
  ProjectSubmissionInput,
  ProjectReviewInput,
  CareerReadinessScorecard,
  RoleJobSearchResponse
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
  isDemoProfileActive: boolean;
  manualProfile: ManualProfileData;
  setManualProfile: React.Dispatch<React.SetStateAction<ManualProfileData>>;
  uploadedFile: { name: string; size: number; type: string } | null;
  setUploadedFile: (file: { name: string; size: number; type: string } | null) => void;
  extractedTextPreview: string;
  extractionWarnings: string[];
  isRealProfileLoaded: boolean;
  isRealProfileReviewed: boolean;
  isResettingSession: boolean;
  sessionResetToken: number;
  sessionGeneration: number;
  handleUploadSuccess: (res: ResumeUploadResponse) => void;
  handleReviewSuccess: (res: ProfileReviewResponse) => void;
  startNewProfile: () => Promise<{ success: boolean; error?: string }>;
  startNewCandidateSession: () => Promise<{ success: boolean; error?: string }>;
  loadDemoBaseline: () => void;
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

  // Real Project Workspaces
  projects: PracticalProjectDefinition[];
  isLoadingProjects: boolean;
  activeProjectSubmissions: Record<string, ProjectSubmission>;
  fetchProjects: (filters?: { roleSlug?: string; search?: string; difficulty?: string }) => Promise<void>;
  startProjectWorkspace: (projectId: string, profileId?: string) => Promise<ProjectSubmission | null>;
  submitProjectDeliverables: (input: ProjectSubmissionInput) => Promise<ProjectSubmission | null>;
  reviewProjectDeliverables: (input: ProjectReviewInput) => Promise<ProjectSubmission | null>;
  fetchUserSubmissions: (profileId?: string, isDemo?: boolean) => Promise<void>;

  // Career Readiness Scorecard
  readinessScorecard: CareerReadinessScorecard | null;
  isLoadingReadiness: boolean;
  fetchReadinessScorecard: (roleSlug?: string, profileId?: string) => Promise<CareerReadinessScorecard | null>;

  // Job Search Destinations
  jobSearchData: RoleJobSearchResponse | null;
  isLoadingJobs: boolean;
  fetchJobSearchLinks: (roleSlug?: string, options?: { location?: string; keywords?: string }) => Promise<RoleJobSearchResponse | null>;

  // Backend Health
  backendHealth: HealthResponse | null;
  healthStatus: 'checking' | 'online' | 'offline';
}

const CareerContext = createContext<CareerContextType | undefined>(undefined);

export const CareerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Ingestion & Profile State
  const [currentProfileId, setCurrentProfileId] = useState<string | null>('demo-profile');
  const [isDemoProfileActive, setIsDemoProfileActive] = useState<boolean>(true);
  const [extractedTextPreview, setExtractedTextPreview] = useState<string>('');
  const [extractionWarnings, setExtractionWarnings] = useState<string[]>([]);
  const [isRealProfileLoaded, setIsRealProfileLoaded] = useState<boolean>(false);
  const [isRealProfileReviewed, setIsRealProfileReviewed] = useState<boolean>(true);
  const [isResettingSession, setIsResettingSession] = useState<boolean>(false);
  const [sessionResetToken, setSessionResetToken] = useState<number>(0);
  const [sessionGeneration, setSessionGeneration] = useState<number>(0);

  // References for request cancellation and generation guarding
  const sessionGenerationRef = useRef<number>(0);
  const activeAbortControllerRef = useRef<AbortController | null>(null);

  const abortPendingRequests = useCallback(() => {
    if (activeAbortControllerRef.current) {
      activeAbortControllerRef.current.abort();
    }
    activeAbortControllerRef.current = new AbortController();
  }, []);

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

  // 6. Real Project Workspaces, Readiness & Jobs
  const [projects, setProjects] = useState<PracticalProjectDefinition[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState<boolean>(false);
  const [activeProjectSubmissions, setActiveProjectSubmissions] = useState<Record<string, ProjectSubmission>>({});
  const [readinessScorecard, setReadinessScorecard] = useState<CareerReadinessScorecard | null>(null);
  const [isLoadingReadiness, setIsLoadingReadiness] = useState<boolean>(false);
  const [jobSearchData, setJobSearchData] = useState<RoleJobSearchResponse | null>(null);
  const [isLoadingJobs, setIsLoadingJobs] = useState<boolean>(false);

  // 7. Backend Health
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
   * Fetch explainable career matches from backend with generation guarding
   */
  const fetchCareerMatches = useCallback(async (profileId?: string) => {
    const pid = profileId || currentProfileId;
    if (!pid) return;

    const curGen = sessionGenerationRef.current;
    setIsLoadingMatches(true);
    setMatchesError(null);

    try {
      const res = await fetch(`/api/v1/careers/matches/${pid}`);
      if (curGen !== sessionGenerationRef.current) return;
      if (!res.ok) {
        throw new Error(`Failed to fetch career matches (HTTP ${res.status})`);
      }
      const data = await res.json();
      if (curGen !== sessionGenerationRef.current) return;
      if (data && Array.isArray(data.matches)) {
        setCareerMatches(data.matches);
      }
    } catch (err: unknown) {
      if (curGen !== sessionGenerationRef.current) return;
      const msg = err instanceof Error ? err.message : 'Error fetching matches';
      setMatchesError(msg);
    } finally {
      if (curGen === sessionGenerationRef.current) {
        setIsLoadingMatches(false);
      }
    }
  }, [currentProfileId]);

  /**
   * Fetch detailed skill gap analysis for target role
   */
  const fetchSkillGaps = useCallback(async (roleSlug: string, profileId?: string) => {
    const pid = profileId || currentProfileId;
    if (!pid) return null;

    const curGen = sessionGenerationRef.current;
    setIsLoadingGaps(true);
    try {
      const res = await fetch(`/api/v1/careers/${roleSlug}/gaps/${pid}`);
      if (curGen !== sessionGenerationRef.current) return null;
      if (!res.ok) return null;
      const data = (await res.json()) as SkillGapAnalysis;
      if (curGen !== sessionGenerationRef.current) return null;
      setCurrentGapAnalysis(data);
      return data;
    } catch {
      return null;
    } finally {
      if (curGen === sessionGenerationRef.current) {
        setIsLoadingGaps(false);
      }
    }
  }, [currentProfileId]);

  /**
   * Request backend to generate sequenced learning pathway
   */
  const generateLearningPathway = useCallback(async (roleSlug: string, profileId?: string) => {
    const pid = profileId || currentProfileId;
    if (!pid) return null;

    const curGen = sessionGenerationRef.current;
    setIsLoadingPathway(true);
    try {
      const res = await fetch('/api/v1/learning-pathways', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileId: pid, roleSlug })
      });
      if (curGen !== sessionGenerationRef.current) return null;
      if (!res.ok) return null;
      const data = (await res.json()) as LearningPathway;
      if (curGen !== sessionGenerationRef.current) return null;
      setCurrentPathway(data);
      return data;
    } catch {
      return null;
    } finally {
      if (curGen === sessionGenerationRef.current) {
        setIsLoadingPathway(false);
      }
    }
  }, [currentProfileId]);

  /**
   * Compare multiple roles side-by-side
   */
  const fetchComparison = useCallback(async (roleSlugs: string[], profileId?: string) => {
    const pid = profileId || currentProfileId;
    const curGen = sessionGenerationRef.current;
    setIsLoadingComparison(true);
    try {
      const res = await fetch('/api/v1/careers/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileId: pid || undefined, roleSlugs })
      });
      if (curGen !== sessionGenerationRef.current) return null;
      if (!res.ok) return null;
      const data = (await res.json()) as CareerComparisonResult;
      if (curGen !== sessionGenerationRef.current) return null;
      setComparisonResult(data);
      return data;
    } catch {
      return null;
    } finally {
      if (curGen === sessionGenerationRef.current) {
        setIsLoadingComparison(false);
      }
    }
  }, [currentProfileId]);

  /**
   * Real Project Workspaces API Integrations
   */
  const fetchProjects = useCallback(
    async (filters?: { roleSlug?: string; search?: string; difficulty?: string }) => {
      setIsLoadingProjects(true);
      try {
        const params = new URLSearchParams();
        if (filters?.roleSlug) params.set('roleSlug', filters.roleSlug);
        if (filters?.search) params.set('search', filters.search);
        if (filters?.difficulty) params.set('difficulty', filters.difficulty);

        const res = await fetch(`/api/v1/projects?${params.toString()}`);
        if (!res.ok) return;
        const data = await res.json();
        setProjects(data.projects || []);
      } catch {
        // Fallback to empty
      } finally {
        setIsLoadingProjects(false);
      }
    },
    []
  );

  /**
   * SAFE SUBMISSIONS FETCHER:
   * Prevents the demo submission from resurrecting when session is empty.
   * If profileId is null/undefined and isDemo is false, clears submissions and does NOT query backend.
   */
  const fetchUserSubmissions = useCallback(
    async (profileId?: string, isDemo = false) => {
      const pid = profileId !== undefined ? profileId : currentProfileId;

      if (!pid && !isDemo) {
        setActiveProjectSubmissions({});
        return;
      }

      const targetPid = isDemo ? 'demo-profile' : pid;
      if (!targetPid || (targetPid === 'demo-profile' && !isDemo && !isDemoProfileActive)) {
        setActiveProjectSubmissions({});
        return;
      }

      const curGen = sessionGenerationRef.current;
      try {
        const res = await fetch(`/api/v1/projects/submissions/${targetPid}`);
        if (curGen !== sessionGenerationRef.current) return;
        if (!res.ok) return;
        const data = await res.json();
        if (curGen !== sessionGenerationRef.current) return;
        const map: Record<string, ProjectSubmission> = {};
        (data.submissions || []).forEach((s: ProjectSubmission) => {
          map[s.projectId] = s;
        });
        setActiveProjectSubmissions(map);
      } catch {
        // Fallback
      }
    },
    [currentProfileId, isDemoProfileActive]
  );

  const startProjectWorkspace = useCallback(
    async (projectId: string, profileId?: string) => {
      const pid = profileId || currentProfileId;
      if (!pid) return null; // Never silently fall back to demo-profile for empty candidate!

      try {
        const res = await fetch(`/api/v1/projects/${projectId}/start`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ projectId, profileId: pid })
        });
        if (!res.ok) return null;
        const data = (await res.json()) as ProjectSubmission;
        setActiveProjectSubmissions((prev) => ({ ...prev, [projectId]: data }));
        return data;
      } catch {
        return null;
      }
    },
    [currentProfileId]
  );

  const submitProjectDeliverables = useCallback(async (input: ProjectSubmissionInput) => {
    try {
      const res = await fetch(`/api/v1/projects/${input.projectId}/submissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input)
      });
      if (!res.ok) return null;
      const data = (await res.json()) as ProjectSubmission;
      setActiveProjectSubmissions((prev) => ({ ...prev, [input.projectId]: data }));
      setProjectSubmissions((prev) => ({
        ...prev,
        [input.projectId]: {
          projectId: input.projectId,
          submissionUrl: input.repositoryUrl || input.liveDemoUrl || '',
          reflectionText: input.learningReflection,
          submittedAt: data.submittedAt || new Date().toISOString()
        }
      }));
      return data;
    } catch {
      return null;
    }
  }, []);

  const reviewProjectDeliverables = useCallback(async (input: ProjectReviewInput) => {
    try {
      const res = await fetch(`/api/v1/projects/submissions/${input.submissionId}/review`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input)
      });
      if (!res.ok) return null;
      const data = (await res.json()) as ProjectSubmission;
      setActiveProjectSubmissions((prev) => ({ ...prev, [data.projectId]: data }));
      return data;
    } catch {
      return null;
    }
  }, []);

  /**
   * Career Readiness Scorecard API Integration
   */
  const fetchReadinessScorecard = useCallback(
    async (roleSlug?: string, profileId?: string) => {
      const targetSlug = roleSlug || targetRoleSlug;
      const pid = profileId || currentProfileId;
      if (!pid) {
        setReadinessScorecard(null);
        return null;
      }

      const curGen = sessionGenerationRef.current;
      setIsLoadingReadiness(true);
      try {
        const completedQuery =
          completedLearningIds.length > 0
            ? `?completedMilestones=${completedLearningIds.join(',')}`
            : '';
        const res = await fetch(`/api/v1/readiness/${pid}/${targetSlug}${completedQuery}`);
        if (curGen !== sessionGenerationRef.current) return null;
        if (!res.ok) return null;
        const data = (await res.json()) as CareerReadinessScorecard;
        if (curGen !== sessionGenerationRef.current) return null;
        setReadinessScorecard(data);
        return data;
      } catch {
        return null;
      } finally {
        if (curGen === sessionGenerationRef.current) {
          setIsLoadingReadiness(false);
        }
      }
    },
    [targetRoleSlug, currentProfileId, completedLearningIds]
  );

  /**
   * Job Search Destinations API Integration
   */
  const fetchJobSearchLinks = useCallback(
    async (roleSlug?: string, options?: { location?: string; keywords?: string }) => {
      const targetSlug = roleSlug || targetRoleSlug;
      setIsLoadingJobs(true);
      try {
        const params = new URLSearchParams();
        if (options?.location) params.set('location', options.location);
        if (options?.keywords) params.set('keywords', options.keywords);

        const res = await fetch(`/api/v1/jobs/search-links/${targetSlug}?${params.toString()}`);
        if (!res.ok) return null;
        const data = (await res.json()) as RoleJobSearchResponse;
        setJobSearchData(data);
        return data;
      } catch {
        return null;
      } finally {
        setIsLoadingJobs(false);
      }
    },
    [targetRoleSlug]
  );

  // Initial load of projects catalogue; only load demo submissions if demo profile is active
  useEffect(() => {
    fetchProjects();
    if (isDemoProfileActive) {
      fetchUserSubmissions('demo-profile', true);
    }
  }, [fetchProjects, isDemoProfileActive]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleUploadSuccess = (res: ResumeUploadResponse) => {
    setCurrentProfileId(res.profileId);
    setIsDemoProfileActive(false);
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
    setActiveProjectSubmissions({});
    setCareerMatches([]);
    setMatchesError(null);
    setCurrentGapAnalysis(null);
    setCurrentPathway(null);
    setReadinessScorecard(null);
  };

  const handleReviewSuccess = (res: ProfileReviewResponse) => {
    setSkills(res.confirmedSkills);
    setIsRealProfileReviewed(true);
    if (res.profileId && res.profileId !== 'demo-profile') {
      fetchCareerMatches(res.profileId);
      fetchUserSubmissions(res.profileId);
    }
  };

  /**
   * ACTION 1: START NEW PROFILE (True Empty Candidate Intake Session)
   * Completely purges the candidate session from frontend state and backend in-memory storage.
   * Does NOT repopulate Alex Vance demo data.
   */
  const startNewProfile = async (): Promise<{ success: boolean; error?: string }> => {
    if (isResettingSession) return { success: false, error: 'Reset operation already in progress' };
    setIsResettingSession(true);

    abortPendingRequests();

    const pid = currentProfileId;
    let backendError: string | null = null;

    if (pid && pid !== 'demo-profile') {
      try {
        const res = await fetch(`/api/v1/profile/${pid}`, {
          method: 'DELETE'
        });
        // 200 is success, 404 is acceptable (already purged), 500 or others is a real failure
        if (!res.ok && res.status !== 404) {
          const errJson = await res.json().catch(() => ({}));
          backendError = errJson.message || `Backend responded with HTTP ${res.status}`;
        }
      } catch (err: unknown) {
        backendError = err instanceof Error ? err.message : 'Network error during backend deletion';
      }
    }

    if (backendError) {
      setIsResettingSession(false);
      return { success: false, error: backendError };
    }

    // Reset all context state to pure empty intake
    setCurrentProfileId(null);
    setIsDemoProfileActive(false);
    setUploadedFile(null);
    setExtractedTextPreview('');
    setExtractionWarnings([]);
    setIsRealProfileLoaded(false);
    setIsRealProfileReviewed(false);
    setManualProfile({
      fullName: '',
      currentTitle: '',
      yearsExperience: 0,
      education: '',
      responsibilities: ''
    });
    setSkills([]); // EMPTY array (zero skills)
    setCareerMatches([]);
    setMatchesError(null);
    setCurrentGapAnalysis(null);
    setCurrentPathway(null);
    setComparisonResult(null);
    setCompletedLearningIds([]);
    setProjectSubmissions({});
    setActiveProjectSubmissions({}); // Zero project submissions
    setReadinessScorecard(null);
    setJobSearchData(null);
    setTargetRoleSlug('sap-s4hana-finance-consultant');
    setComparisonRoleSlugs([
      'sap-s4hana-finance-consultant',
      'sap-abap-cloud-developer'
    ]);

    // Selective storage cleanup (candidate state only)
    try {
      sessionStorage.removeItem('career_orchestrator_candidate');
      sessionStorage.removeItem('career_orchestrator_staged_file');
      localStorage.removeItem('career_orchestrator_profile');
      localStorage.removeItem('career_orchestrator_skills');
      localStorage.removeItem('career_orchestrator_target');
      localStorage.removeItem('career_orchestrator_submissions');
    } catch (err) {
      console.warn('[CareerContext] Storage cleanup warning:', err);
    }

    sessionGenerationRef.current += 1;
    setSessionGeneration(sessionGenerationRef.current);
    setSessionResetToken((prev) => prev + 1);
    setIsResettingSession(false);

    return { success: true };
  };

  /**
   * ACTION 2: LOAD DEMO BASELINE
   * Explicitly loads the Alex Vance demo candidate with calibrated skills and intended demo project submissions.
   */
  const loadDemoBaseline = () => {
    abortPendingRequests();

    setCurrentProfileId('demo-profile');
    setIsDemoProfileActive(true);
    setUploadedFile(null);
    setExtractedTextPreview('');
    setExtractionWarnings([]);
    setManualProfile({
      fullName: 'Alex Vance',
      currentTitle: 'Senior Financial Analyst',
      yearsExperience: 4.5,
      education: 'Bachelor of Science in Accounting & Information Systems',
      responsibilities:
        'Manage general ledger journal reconciliation, statutory balance sheet audits, and SQL-based variance audits.'
    });
    setSkills(INITIAL_DEMO_SKILLS);
    setIsRealProfileLoaded(false);
    setIsRealProfileReviewed(true);
    setTargetRoleSlug('sap-s4hana-finance-consultant');
    setComparisonRoleSlugs([
      'sap-s4hana-finance-consultant',
      'sap-abap-cloud-developer'
    ]);
    setCareerMatches([]);
    setMatchesError(null);
    setCurrentGapAnalysis(null);
    setCurrentPathway(null);
    setComparisonResult(null);
    setCompletedLearningIds([]);
    setProjectSubmissions({});
    setReadinessScorecard(null);
    setJobSearchData(null);

    // Explicitly load demo project submission for Alex Vance
    void fetchUserSubmissions('demo-profile', true);

    sessionGenerationRef.current += 1;
    setSessionGeneration(sessionGenerationRef.current);
    setSessionResetToken((prev) => prev + 1);
  };

  const startNewCandidateSession = startNewProfile;
  const resetToDemoData = () => {
    void startNewProfile();
  };

  const confirmSkill = (id: string) => {
    setSkills((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              isConfirmed: true,
              reviewStatus: 'CONFIRMED'
            }
          : s
      )
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

    // If zero confirmed skills, return 0% fit score with all requirements missing
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
        isDemoProfileActive,
        manualProfile,
        setManualProfile,
        uploadedFile,
        setUploadedFile,
        extractedTextPreview,
        extractionWarnings,
        isRealProfileLoaded,
        isRealProfileReviewed,
        isResettingSession,
        sessionResetToken,
        sessionGeneration,
        handleUploadSuccess,
        handleReviewSuccess,
        startNewProfile,
        startNewCandidateSession,
        loadDemoBaseline,
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
        projects,
        isLoadingProjects,
        activeProjectSubmissions,
        fetchProjects,
        startProjectWorkspace,
        submitProjectDeliverables,
        reviewProjectDeliverables,
        fetchUserSubmissions,
        readinessScorecard,
        isLoadingReadiness,
        fetchReadinessScorecard,
        jobSearchData,
        isLoadingJobs,
        fetchJobSearchLinks,
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
