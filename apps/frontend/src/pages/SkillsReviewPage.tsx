import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { StepIndicator } from '../components/common/StepIndicator';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { DemoDataBanner } from '../components/common/DemoDataBanner';
import { CheckIcon, TrashIcon, PlusIcon, ArrowRightIcon, ArrowLeftIcon } from '../components/common/Icons';
import { useCareerContext } from '../context/CareerContext';
import { ProficiencyLevel, SkillCategory } from '@career-orchestrator/shared';
import { AVAILABLE_SKILL_CATALOGUE } from '../demo/demoSkills';

export const SkillsReviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { skills, confirmSkill, rejectSkill, updateProficiency, addManualSkill } = useCareerContext();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState<SkillCategory>('DOMAIN_BUSINESS');
  const [newSkillProficiency, setNewSkillProficiency] = useState<ProficiencyLevel>('INTERMEDIATE');
  const [newSkillYears, setNewSkillYears] = useState(2);
  const [newSkillTransferable, setNewSkillTransferable] = useState(true);

  const confirmedCount = skills.filter((s) => s.isConfirmed).length;
  const suggestedCount = skills.filter((s) => !s.isConfirmed).length;

  const handleCreateSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) {
      alert('Please enter a skill name.');
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
      sourceSnippet: 'Manually added by candidate during skill review.'
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
      sourceSnippet: 'Selected from standard competency taxonomy.'
    });
    setIsAddModalOpen(false);
  };

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: '1280px', margin: '0 auto' }}>
      <Breadcrumbs items={[{ label: 'Background', path: '/profile' }, { label: 'Skills Review' }]} />
      <StepIndicator currentStepId="skills" />

      {/* Page Header */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: '1rem',
          marginBottom: '1.5rem'
        }}
      >
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#001A47', marginBottom: '0.5rem' }}>
            Interactive Competency Review
          </h1>
          <p style={{ color: '#5B6876', fontSize: '1.05rem', maxWidth: '800px' }}>
            Human-in-the-Loop Verification: Review, calibrate, and confirm your capabilities. The career matching engine will only evaluate confirmed competencies.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button
            variant="outline"
            icon={<PlusIcon size={16} />}
            onClick={() => setIsAddModalOpen(true)}
          >
            Add Competency
          </Button>
          <Button
            variant="primary"
            icon={<ArrowRightIcon size={16} />}
            iconPosition="right"
            onClick={() => navigate('/careers')}
          >
            Confirm & Explore Careers ({confirmedCount})
          </Button>
        </div>
      </div>

      <DemoDataBanner
        featureName="Skills Verification & Taxonomy Review"
        backendStateText="The skills below reflect candidate capabilities identified from the sample background. You can adjust proficiencies, confirm/reject items, or add new skills."
      />

      {/* Metrics Summary Strip */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}
      >
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #D9E1E8', borderRadius: '8px', padding: '1rem 1.25rem' }}>
          <span style={{ fontSize: '0.8rem', color: '#5B6876', textTransform: 'uppercase', fontWeight: 600 }}>Total Extracted</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#001A47', marginTop: '0.2rem' }}>{skills.length}</div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #D9E1E8', borderRadius: '8px', padding: '1rem 1.25rem' }}>
          <span style={{ fontSize: '0.8rem', color: '#107E3E', textTransform: 'uppercase', fontWeight: 600 }}>Confirmed by You</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#107E3E', marginTop: '0.2rem' }}>{confirmedCount}</div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #D9E1E8', borderRadius: '8px', padding: '1rem 1.25rem' }}>
          <span style={{ fontSize: '0.8rem', color: '#E9730C', textTransform: 'uppercase', fontWeight: 600 }}>Pending Review</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#E9730C', marginTop: '0.2rem' }}>{suggestedCount}</div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #D9E1E8', borderRadius: '8px', padding: '1rem 1.25rem' }}>
          <span style={{ fontSize: '0.8rem', color: '#0A6ED1', textTransform: 'uppercase', fontWeight: 600 }}>Transferable Assets</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#0A6ED1', marginTop: '0.2rem' }}>
            {skills.filter((s) => s.isTransferable).length}
          </div>
        </div>
      </div>

      {/* Skills Table Card */}
      <Card
        title="Competency Verification Table"
        subtitle="Review each skill and select your confirmed proficiency level"
      >
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #EDF1F5', color: '#001A47' }}>
                <th style={{ padding: '0.75rem 1rem' }}>Competency & Category</th>
                <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                <th style={{ padding: '0.75rem 1rem' }}>Calibrated Proficiency</th>
                <th style={{ padding: '0.75rem 1rem' }}>Experience</th>
                <th style={{ padding: '0.75rem 1rem' }}>Resume Evidence / Source</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {skills.map((skill) => (
                <tr
                  key={skill.id}
                  style={{
                    borderBottom: '1px solid #EDF1F5',
                    backgroundColor: skill.isConfirmed ? 'transparent' : '#FEFAF5'
                  }}
                >
                  {/* Name & Category */}
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontWeight: 600, color: '#001A47' }}>{skill.name}</div>
                    <div style={{ display: 'flex', gap: '0.35rem', marginTop: '0.25rem' }}>
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

                  {/* Status Badge */}
                  <td style={{ padding: '1rem' }}>
                    {skill.isConfirmed ? (
                      <Badge variant="success">Confirmed</Badge>
                    ) : (
                      <Badge variant="warning">AI Suggested ({Math.round(skill.confidenceScore * 100)}%)</Badge>
                    )}
                  </td>

                  {/* Proficiency Level Select */}
                  <td style={{ padding: '1rem' }}>
                    <select
                      value={skill.proficiency}
                      onChange={(e) => updateProficiency(skill.id, e.target.value as ProficiencyLevel)}
                      style={{ fontSize: '0.85rem', padding: '0.35rem 0.6rem' }}
                    >
                      <option value="NOVICE">Novice (Level 1)</option>
                      <option value="INTERMEDIATE">Intermediate (Level 2)</option>
                      <option value="ADVANCED">Advanced (Level 3)</option>
                      <option value="EXPERT">Expert (Level 4)</option>
                    </select>
                  </td>

                  {/* Years */}
                  <td style={{ padding: '1rem', color: '#5B6876', whiteSpace: 'nowrap' }}>
                    {skill.yearsExperience} yrs
                  </td>

                  {/* Evidence Snippet */}
                  <td style={{ padding: '1rem', maxWidth: '320px', color: '#5B6876', fontSize: '0.85rem' }}>
                    {skill.sourceSnippet ? (
                      <span title={skill.sourceSnippet} style={{ fontStyle: 'italic' }}>
                        "{skill.sourceSnippet}"
                      </span>
                    ) : (
                      <span style={{ color: '#8492A0' }}>Manual entry</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td style={{ padding: '1rem', textAlign: 'right', whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                      {!skill.isConfirmed && (
                        <Button
                          variant="primary"
                          size="sm"
                          icon={<CheckIcon size={14} />}
                          onClick={() => confirmSkill(skill.id)}
                          title="Confirm this skill"
                        >
                          Confirm
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={<TrashIcon size={14} color="#BB0000" />}
                        onClick={() => rejectSkill(skill.id)}
                        title="Remove skill"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Navigation Buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem' }}>
        <Button variant="ghost" icon={<ArrowLeftIcon size={16} />} onClick={() => navigate('/profile')}>
          Back to Background Intake
        </Button>
        <Button
          variant="primary"
          size="lg"
          icon={<ArrowRightIcon size={18} />}
          iconPosition="right"
          onClick={() => navigate('/careers')}
        >
          Proceed to Career Exploration →
        </Button>
      </div>

      {/* Modal for adding a new skill */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Competency to Profile"
      >
        <form onSubmit={handleCreateSkill}>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.4rem', color: '#001A47' }}>
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
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.4rem', color: '#001A47' }}>
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
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.4rem', color: '#001A47' }}>
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
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.4rem', color: '#001A47' }}>
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
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                <input
                  type="checkbox"
                  checked={newSkillTransferable}
                  onChange={(e) => setNewSkillTransferable(e.target.checked)}
                />
                <span>Is Transferable Competency</span>
              </label>
            </div>
          </div>

          <div style={{ borderTop: '1px solid #EDF1F5', paddingTop: '1rem', marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#5B6876', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
              Or quick-pick from standard catalogue:
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {AVAILABLE_SKILL_CATALOGUE.map((item) => (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => handleSelectFromCatalogue(item)}
                  style={{
                    backgroundColor: '#F5F6F7',
                    border: '1px solid #D9E1E8',
                    padding: '0.3rem 0.6rem',
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                    color: '#222B35',
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
              Add to Verified Profile
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
