import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import {
  CheckIcon,
  TrashIcon,
  PlusIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  AlertTriangleIcon,
  EditIcon,
  FileTextIcon,
  InfoIcon,
  SearchIcon
} from '../components/common/Icons';
import { useCareerContext } from '../context/CareerContext';
import {
  ProficiencyLevel,
  SkillCategory,
  ExtractedSkillItem,
  ProfileReviewResponse
} from '@career-orchestrator/shared';
import { AVAILABLE_SKILL_CATALOGUE } from '../demo/demoSkills';
import { enterpriseTheme } from '../theme/tokens';

export const SkillsReviewPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    currentProfileId,
    manualProfile,
    uploadedFile,
    extractedTextPreview,
    extractionWarnings,
    isRealProfileLoaded,
    skills,
    confirmSkill,
    rejectSkill,
    updateProficiency,
    updateYearsExperience,
    editSkillName,
    addManualSkill,
    handleReviewSuccess,
    resetToDemoData,
    sessionMode
  } = useCareerContext();

  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Add Competency Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState<SkillCategory>('DOMAIN_BUSINESS');
  const [newSkillProficiency, setNewSkillProficiency] = useState<ProficiencyLevel>('INTERMEDIATE');
  const [newSkillYears, setNewSkillYears] = useState(2);
  const [newSkillTransferable, setNewSkillTransferable] = useState(true);

  // Edit Competency Modal State
  const [editingSkill, setEditingSkill] = useState<ExtractedSkillItem | null>(null);
  const [editNameValue, setEditNameValue] = useState('');

  // Extracted text preview toggle
  const [showRawText, setShowRawText] = useState(false);

  // Backend submission state
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  const confirmedCount = skills.filter((s) => s.isConfirmed).length;
  const suggestedCount = skills.filter((s) => !s.isConfirmed && s.reviewStatus !== 'REJECTED').length;
  const rejectedCount = skills.filter((s) => s.reviewStatus === 'REJECTED').length;

  // Filtered skills list
  const filteredSkills = useMemo(() => {
    return skills.filter((skill) => {
      const matchesSearch =
        skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        skill.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (skill.evidenceSnippet && skill.evidenceSnippet.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        selectedCategory === 'ALL' || skill.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [skills, searchQuery, selectedCategory]);

  const handleOpenEdit = (skill: ExtractedSkillItem) => {
    setEditingSkill(skill);
    setEditNameValue(skill.name);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSkill && editNameValue.trim()) {
      editSkillName(editingSkill.id, editNameValue.trim());
      setEditingSkill(null);
    }
  };

  const handleCreateSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) {
      alert('Please enter a competency name.');
      return;
    }

    addManualSkill({
      code: `USER-${Date.now().toString().slice(-4)}`,
      name: newSkillName.trim(),
      category: newSkillCategory,
      proficiency: newSkillProficiency,
      yearsExperience: newSkillYears,
      isConfirmed: true,
      isTransferable: newSkillTransferable,
      confidenceScore: 1.0,
      evidenceSnippet: 'Manually added by candidate during skill review.',
      extractionMethod: 'MANUAL_ENTRY',
      reviewStatus: 'CONFIRMED'
    });

    setNewSkillName('');
    setIsAddModalOpen(false);
  };

  const handleSelectFromCatalogue = (item: { code: string; name: string; category: string }) => {
    addManualSkill({
      code: item.code,
      name: item.name,
      category: item.category as SkillCategory,
      proficiency: 'INTERMEDIATE',
      yearsExperience: 1.5,
      isConfirmed: true,
      isTransferable: true,
      confidenceScore: 1.0,
      evidenceSnippet: 'Selected from standard competency taxonomy.',
      extractionMethod: 'MANUAL_ENTRY',
      reviewStatus: 'CONFIRMED'
    });
    setIsAddModalOpen(false);
  };

  const handleConfirmAndExplore = async () => {
    setSaveError(null);

    const confirmedOnly = skills.filter((s) => s.isConfirmed);
    if (confirmedOnly.length === 0) {
      setSaveError('Please review and confirm at least one competency before proceeding to career matching.');
      return;
    }

    const uncalibrated = confirmedOnly.filter((s) => !s.proficiency);
    if (uncalibrated.length > 0) {
      setSaveError(
        `Proficiency level is required for all confirmed competencies before saving your profile. Please select a level for: ${uncalibrated.map((s) => `"${s.name}"`).join(', ')}.`
      );
      return;
    }

    // If there is an active backend profile, persist confirmed items via PUT /api/v1/profile/:id/review
    if (currentProfileId) {
      setIsSaving(true);
      try {
        const payload = {
          profileId: currentProfileId,
          fullName: manualProfile.fullName,
          currentTitle: manualProfile.currentTitle,
          yearsExperience: manualProfile.yearsExperience,
          reviewedSkills: skills.map((s) => ({
            skillId: s.id,
            name: s.name,
            category: s.category,
            proficiency: s.proficiency || undefined,
            yearsExperience: s.yearsExperience !== undefined ? s.yearsExperience : undefined,
            confidenceScore: s.confidenceScore,
            isConfirmed: s.isConfirmed,
            isTransferable: s.isTransferable,
            evidenceSnippet: s.evidenceSnippet || '',
            extractionMethod: s.extractionMethod || 'MANUAL_ENTRY',
            reviewStatus: s.reviewStatus || (s.isConfirmed ? 'CONFIRMED' : 'SUGGESTED')
          }))
        };

        const response = await fetch(`/api/v1/profile/${currentProfileId}/review`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || data.error || `Failed with status ${response.status}`);
        }

        const reviewResult = data as ProfileReviewResponse;
        handleReviewSuccess(reviewResult);
        setSaveSuccessMsg(`Saved ${reviewResult.confirmedSkillsCount} confirmed competencies to profile.`);

        setTimeout(() => {
          navigate('/careers');
        }, 500);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to save reviewed profile.';
        setSaveError(msg);
      } finally {
        setIsSaving(false);
      }
    } else {
      // In demo mode or offline intake
      handleReviewSuccess({
        profileId: 'demo-profile',
        status: 'CONFIRMED',
        confirmedSkillsCount: confirmedOnly.length,
        rejectedSkillsCount: skills.length - confirmedOnly.length,
        confirmedSkills: confirmedOnly,
        updatedAt: new Date().toISOString()
      });
      navigate('/careers');
    }
  };

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
      <Breadcrumbs items={[{ label: 'Background', path: '/profile' }, { label: 'Skills Review' }]} />

      {/* Page Header */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: '1rem',
          marginBottom: '1.75rem'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: enterpriseTheme.colors.textPrimary, margin: 0 }}>
              Human-in-the-Loop Skills Review
            </h1>
            <Badge variant={sessionMode === 'DEMO' ? 'info' : 'success'}>
              Stage 2 of 8
            </Badge>
          </div>
          <p style={{ color: enterpriseTheme.colors.textSecondary, fontSize: '0.98rem', maxWidth: '820px', lineHeight: 1.5 }}>
            Inspect candidate competencies, calibrate proficiencies, and verify transferable strengths. Career matching runs exclusively against confirmed skills.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Button
            variant="outline"
            icon={<PlusIcon size={16} />}
            onClick={() => setIsAddModalOpen(true)}
          >
            Add Competency
          </Button>

          <Button
            variant="primary"
            icon={isSaving ? undefined : <ArrowRightIcon size={16} />}
            iconPosition="right"
            onClick={handleConfirmAndExplore}
            disabled={isSaving}
          >
            {isSaving ? 'Persisting Profile...' : `Confirm & Explore Careers (${confirmedCount})`}
          </Button>
        </div>
      </div>

      {/* Profile Origin & Live Status Banner */}
      {isRealProfileLoaded ? (
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: `1px solid ${enterpriseTheme.colors.successBorder}`,
            borderRadius: enterpriseTheme.radii.md,
            padding: '1rem 1.25rem',
            marginBottom: '1.75rem',
            boxShadow: enterpriseTheme.shadows.card
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                style={{
                  backgroundColor: enterpriseTheme.colors.successSubtle,
                  color: enterpriseTheme.colors.success,
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <FileTextIcon color={enterpriseTheme.colors.success} size={18} />
              </div>
              <div>
                <strong style={{ color: enterpriseTheme.colors.textPrimary, fontSize: '0.92rem' }}>
                  Parsed from Document: {uploadedFile?.name || 'Uploaded Resume'}
                </strong>
                <div style={{ fontSize: '0.78rem', color: enterpriseTheme.colors.textSecondary, marginTop: '0.2rem' }}>
                  Session ID: <code>{currentProfileId || 'Local'}</code> • Extracted {extractedTextPreview.length} characters • Non-durable in-memory session
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {extractedTextPreview && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowRawText(!showRawText)}
                >
                  {showRawText ? 'Hide Text' : 'Inspect Text'}
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={resetToDemoData}
              >
                Reset to Sample
              </Button>
            </div>
          </div>

          {/* Raw Text Preview Collapsible */}
          {showRawText && extractedTextPreview && (
            <div
              style={{
                marginTop: '1rem',
                padding: '0.75rem 1rem',
                backgroundColor: enterpriseTheme.colors.canvas,
                border: `1px solid ${enterpriseTheme.colors.surfaceBorder}`,
                borderRadius: '6px',
                maxHeight: '160px',
                overflowY: 'auto',
                fontSize: '0.8rem',
                fontFamily: 'monospace',
                color: enterpriseTheme.colors.textPrimary,
                whiteSpace: 'pre-wrap'
              }}
            >
              {extractedTextPreview}
            </div>
          )}

          {/* Extraction Warnings if any */}
          {extractionWarnings.length > 0 && (
            <div style={{ marginTop: '0.75rem', fontSize: '0.82rem', color: enterpriseTheme.colors.warning }}>
              <strong>Advisory:</strong> {extractionWarnings.join(' ')}
            </div>
          )}
        </div>
      ) : (
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: `1px solid ${enterpriseTheme.colors.infoBorder}`,
            borderRadius: enterpriseTheme.radii.md,
            padding: '0.85rem 1.25rem',
            marginBottom: '1.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            flexWrap: 'wrap',
            boxShadow: enterpriseTheme.shadows.card
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <InfoIcon color={enterpriseTheme.colors.primary} size={18} />
            <div style={{ fontSize: '0.86rem', color: enterpriseTheme.colors.textPrimary }}>
              <strong>Demo Baseline Active:</strong> Showing Alex Vance sample competencies for Senior Financial Analyst. To parse your real resume, return to{' '}
              <button
                onClick={() => navigate('/profile')}
                style={{
                  color: enterpriseTheme.colors.primary,
                  textDecoration: 'underline',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                Profile Intake
              </button>
              .
            </div>
          </div>
        </div>
      )}

      {/* Save Error or Success Alert */}
      {saveError && (
        <div
          style={{
            marginBottom: '1.5rem',
            padding: '1rem',
            backgroundColor: enterpriseTheme.colors.criticalSubtle,
            border: `1px solid ${enterpriseTheme.colors.criticalBorder}`,
            borderRadius: enterpriseTheme.radii.sm,
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            color: enterpriseTheme.colors.critical,
            fontSize: '0.88rem'
          }}
        >
          <AlertTriangleIcon size={18} color={enterpriseTheme.colors.critical} />
          <div style={{ flex: 1 }}>{saveError}</div>
          <Button variant="outline" size="sm" onClick={() => setSaveError(null)}>
            Dismiss
          </Button>
        </div>
      )}

      {saveSuccessMsg && (
        <div
          style={{
            marginBottom: '1.5rem',
            padding: '0.75rem 1rem',
            backgroundColor: enterpriseTheme.colors.successSubtle,
            border: `1px solid ${enterpriseTheme.colors.successBorder}`,
            borderRadius: enterpriseTheme.radii.sm,
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            color: enterpriseTheme.colors.success,
            fontSize: '0.88rem'
          }}
        >
          <CheckIcon size={18} color={enterpriseTheme.colors.success} />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* Metrics Summary Strip */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
          gap: '1rem',
          marginBottom: '1.75rem'
        }}
      >
        <div style={{ backgroundColor: '#FFFFFF', border: `1px solid ${enterpriseTheme.colors.surfaceBorder}`, borderRadius: enterpriseTheme.radii.md, padding: '1rem 1.25rem', boxShadow: enterpriseTheme.shadows.card }}>
          <span style={{ fontSize: '0.75rem', color: enterpriseTheme.colors.textMuted, textTransform: 'uppercase', fontWeight: 700 }}>Total Identified</span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: enterpriseTheme.colors.textPrimary, marginTop: '0.2rem' }}>{skills.length}</div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', border: `1px solid ${enterpriseTheme.colors.surfaceBorder}`, borderRadius: enterpriseTheme.radii.md, padding: '1rem 1.25rem', boxShadow: enterpriseTheme.shadows.card }}>
          <span style={{ fontSize: '0.75rem', color: enterpriseTheme.colors.success, textTransform: 'uppercase', fontWeight: 700 }}>Confirmed Skills</span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: enterpriseTheme.colors.success, marginTop: '0.2rem' }}>{confirmedCount}</div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', border: `1px solid ${enterpriseTheme.colors.surfaceBorder}`, borderRadius: enterpriseTheme.radii.md, padding: '1rem 1.25rem', boxShadow: enterpriseTheme.shadows.card }}>
          <span style={{ fontSize: '0.75rem', color: enterpriseTheme.colors.warning, textTransform: 'uppercase', fontWeight: 700 }}>Pending Review</span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: enterpriseTheme.colors.warning, marginTop: '0.2rem' }}>{suggestedCount}</div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', border: `1px solid ${enterpriseTheme.colors.surfaceBorder}`, borderRadius: enterpriseTheme.radii.md, padding: '1rem 1.25rem', boxShadow: enterpriseTheme.shadows.card }}>
          <span style={{ fontSize: '0.75rem', color: enterpriseTheme.colors.primary, textTransform: 'uppercase', fontWeight: 700 }}>Transferable Assets</span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: enterpriseTheme.colors.primary, marginTop: '0.2rem' }}>
            {skills.filter((s) => s.isTransferable && s.isConfirmed).length}
          </div>
        </div>

        {rejectedCount > 0 && (
          <div style={{ backgroundColor: '#FFFFFF', border: `1px solid ${enterpriseTheme.colors.surfaceBorder}`, borderRadius: enterpriseTheme.radii.md, padding: '1rem 1.25rem', boxShadow: enterpriseTheme.shadows.card }}>
            <span style={{ fontSize: '0.75rem', color: enterpriseTheme.colors.critical, textTransform: 'uppercase', fontWeight: 700 }}>Excluded</span>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: enterpriseTheme.colors.critical, marginTop: '0.2rem' }}>{rejectedCount}</div>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          backgroundColor: '#FFFFFF',
          border: `1px solid ${enterpriseTheme.colors.surfaceBorder}`,
          borderRadius: enterpriseTheme.radii.md,
          padding: '0.85rem 1.25rem',
          marginBottom: '1.5rem',
          boxShadow: enterpriseTheme.shadows.card
        }}
      >
        {/* Search Input */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: '240px', flex: 1 }}>
          <SearchIcon size={16} color={enterpriseTheme.colors.textMuted} />
          <input
            type="text"
            placeholder="Search competencies, tags, or evidence snippets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', border: 'none', padding: '0.25rem 0', outline: 'none', fontSize: '0.88rem' }}
          />
        </div>

        {/* Category Filter Pills */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {[
            { label: 'All', value: 'ALL' },
            { label: 'Business', value: 'DOMAIN_BUSINESS' },
            { label: 'Functional', value: 'SAP_FUNCTIONAL' },
            { label: 'Technical', value: 'SAP_TECHNICAL' },
            { label: 'Software', value: 'SOFTWARE_DEV' },
            { label: 'Analytics', value: 'DATA_ANALYTICS' },
            { label: 'Soft Skills', value: 'TRANSFERABLE_SOFT' }
          ].map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              style={{
                padding: '0.25rem 0.65rem',
                borderRadius: '4px',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                border: `1px solid ${
                  selectedCategory === cat.value
                    ? enterpriseTheme.colors.primary
                    : enterpriseTheme.colors.surfaceBorder
                }`,
                backgroundColor:
                  selectedCategory === cat.value
                    ? enterpriseTheme.colors.primarySubtle
                    : '#FFFFFF',
                color:
                  selectedCategory === cat.value
                    ? enterpriseTheme.colors.primary
                    : enterpriseTheme.colors.textSecondary,
                transition: 'all 0.15s ease'
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Skills Table Card or Empty State */}
      {skills.length === 0 ? (
        <Card title="No Competencies Found" subtitle="No skills have been extracted or added to this profile.">
          <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <FileTextIcon size={48} color={enterpriseTheme.colors.textMuted} />
            <h3 style={{ fontSize: '1.25rem', color: enterpriseTheme.colors.textPrimary, marginTop: '1rem', marginBottom: '0.5rem', fontWeight: 700 }}>
              Your Competency Inventory is Empty
            </h3>
            <p style={{ color: enterpriseTheme.colors.textSecondary, maxWidth: '480px', margin: '0 auto 1.5rem', fontSize: '0.92rem' }}>
              Upload an Adobe PDF or Word DOCX resume containing text to extract skills automatically, or add your competencies manually.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <Button variant="outline" onClick={() => navigate('/profile')}>
                Return to Intake
              </Button>
              <Button variant="primary" icon={<PlusIcon size={16} />} onClick={() => setIsAddModalOpen(true)}>
                Add Manual Competency
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <div className="sap-table-container">
          <table className="sap-table">
            <thead>
              <tr>
                <th style={{ minWidth: '220px' }}>Competency & Category</th>
                <th style={{ width: '110px' }}>Extraction</th>
                <th style={{ width: '130px' }}>Review Status</th>
                <th style={{ minWidth: '160px' }}>Calibrated Proficiency *</th>
                <th style={{ width: '110px' }}>Experience</th>
                <th style={{ minWidth: '260px' }}>Resume Source / Evidence</th>
                <th style={{ textAlign: 'right', minWidth: '150px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSkills.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: enterpriseTheme.colors.textMuted }}>
                    No competencies match your search or category filter.
                  </td>
                </tr>
              ) : (
                filteredSkills.map((skill) => {
                  const isRejected = skill.reviewStatus === 'REJECTED';

                  return (
                    <tr
                      key={skill.id}
                      style={{
                        backgroundColor: isRejected
                          ? enterpriseTheme.colors.criticalSubtle
                          : skill.isConfirmed
                          ? 'transparent'
                          : '#FFFBF5',
                        opacity: isRejected ? 0.6 : 1
                      }}
                    >
                      {/* Name & Category */}
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <span
                            style={{
                              fontWeight: 700,
                              color: isRejected ? enterpriseTheme.colors.textMuted : enterpriseTheme.colors.textPrimary,
                              textDecoration: isRejected ? 'line-through' : 'none'
                            }}
                          >
                            {skill.name}
                          </span>
                          <button
                            onClick={() => handleOpenEdit(skill)}
                            title="Edit competency name"
                            style={{
                              border: 'none',
                              background: 'transparent',
                              cursor: 'pointer',
                              color: enterpriseTheme.colors.textMuted,
                              padding: '2px'
                            }}
                          >
                            <EditIcon size={12} />
                          </button>
                        </div>
                        <div style={{ display: 'flex', gap: '0.35rem', marginTop: '0.25rem', flexWrap: 'wrap' }}>
                          <Badge variant="neutral" size="sm">
                            {skill.category.replace(/_/g, ' ')}
                          </Badge>
                          {skill.isTransferable && (
                            <Badge variant="info" size="sm">
                              Transferable
                            </Badge>
                          )}
                        </div>
                      </td>

                      {/* Extraction Method */}
                      <td style={{ whiteSpace: 'nowrap' }}>
                        {skill.extractionMethod === 'EXPLICIT_MENTION' ? (
                          <Badge variant="info" size="sm">
                            Direct Mention
                          </Badge>
                        ) : skill.extractionMethod === 'CONTEXTUAL_INFERENCE' ? (
                          <Badge variant="purple" size="sm">
                            Inferred
                          </Badge>
                        ) : (
                          <Badge variant="neutral" size="sm">
                            Manual
                          </Badge>
                        )}
                      </td>

                      {/* Review Status Badge */}
                      <td style={{ whiteSpace: 'nowrap' }}>
                        {skill.isConfirmed ? (
                          <Badge variant="success">Confirmed</Badge>
                        ) : isRejected ? (
                          <Badge variant="critical">Rejected</Badge>
                        ) : (
                          <div style={{ display: 'inline-flex', flexDirection: 'column', gap: '0.2rem' }}>
                            <Badge variant="warning">
                              Suggested ({Math.round(skill.confidenceScore * 100)}%)
                            </Badge>
                            <div style={{ width: '60px', height: '3px', backgroundColor: '#EDF1F5', borderRadius: '2px', overflow: 'hidden' }}>
                              <div
                                style={{
                                  width: `${Math.round(skill.confidenceScore * 100)}%`,
                                  height: '100%',
                                  backgroundColor: enterpriseTheme.colors.warning
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </td>

                      {/* Proficiency Level Select */}
                      <td>
                        <select
                          value={skill.proficiency || ''}
                          disabled={isRejected}
                          onChange={(e) => {
                            updateProficiency(skill.id, e.target.value as ProficiencyLevel);
                            setSaveError(null);
                          }}
                          style={{
                            fontSize: '0.84rem',
                            padding: '0.35rem 0.5rem',
                            borderRadius: '4px',
                            border: `1px solid ${!skill.proficiency && skill.isConfirmed ? enterpriseTheme.colors.critical : enterpriseTheme.colors.surfaceBorder}`,
                            width: '100%',
                            color: skill.proficiency ? enterpriseTheme.colors.textPrimary : enterpriseTheme.colors.textMuted
                          }}
                        >
                          <option value="" disabled>Select Level...</option>
                          <option value="NOVICE">Novice (L1)</option>
                          <option value="INTERMEDIATE">Intermediate (L2)</option>
                          <option value="ADVANCED">Advanced (L3)</option>
                          <option value="EXPERT">Expert (L4)</option>
                        </select>
                      </td>

                      {/* Years */}
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <input
                            type="number"
                            step="0.5"
                            min="0"
                            max="40"
                            disabled={isRejected}
                            placeholder="—"
                            value={skill.yearsExperience !== undefined ? skill.yearsExperience : ''}
                            onChange={(e) => updateYearsExperience(skill.id, parseFloat(e.target.value) || 0)}
                            style={{
                              width: '55px',
                              padding: '0.3rem 0.4rem',
                              fontSize: '0.84rem',
                              border: `1px solid ${enterpriseTheme.colors.surfaceBorder}`,
                              borderRadius: '4px'
                            }}
                          />
                          <span style={{ fontSize: '0.78rem', color: enterpriseTheme.colors.textMuted }}>yrs</span>
                        </div>
                      </td>

                      {/* Evidence Snippet */}
                      <td style={{ maxWidth: '340px', color: enterpriseTheme.colors.textSecondary, fontSize: '0.82rem' }}>
                        {skill.evidenceSnippet ? (
                          <span title={skill.evidenceSnippet} style={{ fontStyle: 'italic', display: 'block', maxHeight: '42px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            "{skill.evidenceSnippet}"
                          </span>
                        ) : (
                          <span style={{ color: enterpriseTheme.colors.textMuted }}>Manual addition by candidate</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                          {!skill.isConfirmed ? (
                            <Button
                              variant="primary"
                              size="sm"
                              icon={<CheckIcon size={13} />}
                              onClick={() => {
                                if (!skill.proficiency) {
                                  setSaveError(
                                    `Please select a calibrated proficiency level (Novice, Intermediate, Advanced, or Expert) for "${skill.name}" before confirming.`
                                  );
                                  return;
                                }
                                confirmSkill(skill.id);
                                setSaveError(null);
                              }}
                              title="Confirm this competency"
                            >
                              Confirm
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => rejectSkill(skill.id)}
                              title="Unconfirm / Reject"
                            >
                              Unconfirm
                            </Button>
                          )}

                          <Button
                            variant="ghost"
                            size="sm"
                            icon={<TrashIcon size={14} color={enterpriseTheme.colors.critical} />}
                            onClick={() => rejectSkill(skill.id)}
                            title="Exclude competency"
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Navigation Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <Button variant="ghost" icon={<ArrowLeftIcon size={16} />} onClick={() => navigate('/profile')}>
          Back to Profile Intake
        </Button>
        <Button
          variant="primary"
          size="lg"
          icon={isSaving ? undefined : <ArrowRightIcon size={18} />}
          iconPosition="right"
          onClick={handleConfirmAndExplore}
          disabled={isSaving}
        >
          {isSaving ? 'Persisting Profile...' : `Confirm & Explore Careers (${confirmedCount}) →`}
        </Button>
      </div>

      {/* Add Competency Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Competency to Candidate Profile"
      >
        <form onSubmit={handleCreateSkill}>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.86rem', marginBottom: '0.4rem', color: enterpriseTheme.colors.textPrimary }}>
              Competency Name *
            </label>
            <input
              type="text"
              placeholder="e.g. S/4HANA Finance Customizing or Python"
              value={newSkillName}
              onChange={(e) => setNewSkillName(e.target.value)}
              style={{ width: '100%' }}
              autoFocus
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.86rem', marginBottom: '0.4rem', color: enterpriseTheme.colors.textPrimary }}>
                Category
              </label>
              <select
                value={newSkillCategory}
                onChange={(e) => setNewSkillCategory(e.target.value as SkillCategory)}
                style={{ width: '100%' }}
              >
                <option value="DOMAIN_BUSINESS">Domain / Business</option>
                <option value="SAP_FUNCTIONAL">SAP Functional</option>
                <option value="SAP_TECHNICAL">SAP Technical</option>
                <option value="SOFTWARE_DEV">Software Development</option>
                <option value="DATA_ANALYTICS">Data & Analytics</option>
                <option value="TRANSFERABLE_SOFT">Transferable Soft Skill</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.86rem', marginBottom: '0.4rem', color: enterpriseTheme.colors.textPrimary }}>
                Calibrated Proficiency
              </label>
              <select
                value={newSkillProficiency}
                onChange={(e) => setNewSkillProficiency(e.target.value as ProficiencyLevel)}
                style={{ width: '100%' }}
              >
                <option value="NOVICE">Novice (Level 1)</option>
                <option value="INTERMEDIATE">Intermediate (Level 2)</option>
                <option value="ADVANCED">Advanced (Level 3)</option>
                <option value="EXPERT">Expert (Level 4)</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.86rem', marginBottom: '0.4rem', color: enterpriseTheme.colors.textPrimary }}>
                Years of Experience
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                value={newSkillYears}
                onChange={(e) => setNewSkillYears(parseFloat(e.target.value) || 0)}
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', marginTop: '1.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.88rem' }}>
                <input
                  type="checkbox"
                  checked={newSkillTransferable}
                  onChange={(e) => setNewSkillTransferable(e.target.checked)}
                />
                <span>Transferable Competency</span>
              </label>
            </div>
          </div>

          <div style={{ borderTop: `1px solid ${enterpriseTheme.colors.surfaceBorder}`, paddingTop: '1rem', marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: enterpriseTheme.colors.textMuted, textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
              Or quick-pick from standard catalogue:
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', maxHeight: '120px', overflowY: 'auto' }}>
              {AVAILABLE_SKILL_CATALOGUE.map((item) => (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => handleSelectFromCatalogue(item)}
                  style={{
                    backgroundColor: enterpriseTheme.colors.canvas,
                    border: `1px solid ${enterpriseTheme.colors.surfaceBorder}`,
                    padding: '0.3rem 0.6rem',
                    borderRadius: '4px',
                    fontSize: '0.78rem',
                    color: enterpriseTheme.colors.textPrimary,
                    cursor: 'pointer'
                  }}
                >
                  + {item.name}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <Button type="button" variant="ghost" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Add to Profile
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Competency Name Modal */}
      {editingSkill && (
        <Modal
          isOpen={true}
          onClose={() => setEditingSkill(null)}
          title="Edit Competency Canonical Name"
        >
          <form onSubmit={handleSaveEdit}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.86rem', marginBottom: '0.4rem', color: enterpriseTheme.colors.textPrimary }}>
                Competency Name
              </label>
              <input
                type="text"
                value={editNameValue}
                onChange={(e) => setEditNameValue(e.target.value)}
                style={{ width: '100%' }}
                autoFocus
              />
              <span style={{ fontSize: '0.78rem', color: enterpriseTheme.colors.textMuted, marginTop: '0.35rem', display: 'block' }}>
                Original Extracted Code: <code>{editingSkill.code}</code>
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <Button type="button" variant="ghost" onClick={() => setEditingSkill(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Save Name
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
