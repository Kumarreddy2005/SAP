import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { StepIndicator } from '../components/common/StepIndicator';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { DemoDataBanner } from '../components/common/DemoDataBanner';
import { UploadCloudIcon, CheckIcon, ArrowRightIcon } from '../components/common/Icons';
import { useCareerContext } from '../context/CareerContext';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { manualProfile, setManualProfile, uploadedFile, setUploadedFile } = useCareerContext();

  const [activeTab, setActiveTab] = useState<'upload' | 'manual'>('upload');
  const [dragActive, setDragActive] = useState(false);
  const [uploadNotice, setUploadNotice] = useState<string | null>(null);

  // Form validation errors
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processSelectedFile(e.target.files[0]);
    }
  };

  const processSelectedFile = (file: File) => {
    const validExtensions = ['.pdf', '.docx'];
    const hasValidExt = validExtensions.some((ext) => file.name.toLowerCase().endsWith(ext));

    if (!hasValidExt) {
      alert('Invalid file format. Please upload a PDF (.pdf) or Word document (.docx).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('File size exceeds the 10MB limit. Please upload a smaller file.');
      return;
    }

    setUploadedFile({
      name: file.name,
      size: file.size,
      type: file.type || 'application/pdf'
    });

    setUploadNotice(
      `File "${file.name}" (${(file.size / 1024).toFixed(1)} KB) staged. Note: Live binary extraction connects in Phase 2; demonstration skills will be loaded on the next screen.`
    );
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!manualProfile.fullName.trim()) errors.fullName = 'Full Name is required.';
    if (!manualProfile.currentTitle.trim()) errors.currentTitle = 'Current Role or Target Title is required.';
    if (manualProfile.yearsExperience < 0 || isNaN(manualProfile.yearsExperience)) {
      errors.yearsExperience = 'Please enter valid years of experience (0 or more).';
    }
    if (!manualProfile.responsibilities.trim() || manualProfile.responsibilities.trim().length < 20) {
      errors.responsibilities = 'Please provide at least 20 characters describing your key responsibilities.';
    }

    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      navigate('/skills-review');
    }
  };

  const handleContinueWithUpload = () => {
    if (!uploadedFile) {
      alert('Please select a resume file first or switch to the manual entry form.');
      return;
    }
    navigate('/skills-review');
  };

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: '1280px', margin: '0 auto' }}>
      <Breadcrumbs items={[{ label: 'Background Intake' }]} />
      <StepIndicator currentStepId="profile" />

      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#001A47', marginBottom: '0.5rem' }}>
          Candidate Background Intake
        </h1>
        <p style={{ color: '#5B6876', fontSize: '1.05rem', maxWidth: '800px' }}>
          Provide your professional background to discover transferable skills. Upload your current resume or enter your experience history manually.
        </p>
      </div>

      <DemoDataBanner
        featureName="Resume Text Extraction UI"
        backendStateText="The file dropzone validates formats and prepares the payload. In Phase 2, backend pdf-parse and mammoth workers will parse document text into structured experience entities."
      />

      {/* Intake Method Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          borderBottom: '2px solid #EDF1F5',
          marginBottom: '2rem'
        }}
      >
        <button
          onClick={() => setActiveTab('upload')}
          style={{
            padding: '0.75rem 1.5rem',
            fontWeight: 600,
            fontSize: '1rem',
            color: activeTab === 'upload' ? '#0A6ED1' : '#5B6876',
            borderBottom: activeTab === 'upload' ? '3px solid #0A6ED1' : '3px solid transparent',
            marginBottom: '-2px',
            backgroundColor: 'transparent',
            cursor: 'pointer'
          }}
        >
          Option A: Upload Resume (.PDF / .DOCX)
        </button>
        <button
          onClick={() => setActiveTab('manual')}
          style={{
            padding: '0.75rem 1.5rem',
            fontWeight: 600,
            fontSize: '1rem',
            color: activeTab === 'manual' ? '#0A6ED1' : '#5B6876',
            borderBottom: activeTab === 'manual' ? '3px solid #0A6ED1' : '3px solid transparent',
            marginBottom: '-2px',
            backgroundColor: 'transparent',
            cursor: 'pointer'
          }}
        >
          Option B: Manual Work History Entry
        </button>
      </div>

      {activeTab === 'upload' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
          {/* Upload Dropzone Card */}
          <Card
            title="Resume Document Upload"
            subtitle="Accepted formats: Adobe PDF (.pdf) and Microsoft Word (.docx)"
          >
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              style={{
                border: `2px dashed ${dragActive ? '#0A6ED1' : uploadedFile ? '#107E3E' : '#C4D5EA'}`,
                backgroundColor: dragActive ? '#EBF3FB' : uploadedFile ? '#F3FAF6' : '#FAFBFD',
                borderRadius: '8px',
                padding: '3rem 2rem',
                textAlign: 'center',
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1rem'
              }}
            >
              <div style={{ color: uploadedFile ? '#107E3E' : '#0A6ED1' }}>
                <UploadCloudIcon size={48} />
              </div>

              <div>
                <h4 style={{ fontSize: '1.15rem', color: '#001A47', marginBottom: '0.35rem' }}>
                  {uploadedFile ? 'Resume Staged For Review' : 'Drag & drop your resume file here'}
                </h4>
                <p style={{ color: '#5B6876', fontSize: '0.9rem' }}>
                  Supports PDF or DOCX up to 10MB in size
                </p>
              </div>

              {uploadedFile && (
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #B8E3C8',
                    padding: '0.75rem 1.25rem',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem'
                  }}
                >
                  <CheckIcon color="#107E3E" size={18} />
                  <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#001A47' }}>
                    {uploadedFile.name}
                  </span>
                  <Badge variant="success" size="sm">
                    Ready
                  </Badge>
                </div>
              )}

              <div style={{ marginTop: '0.5rem' }}>
                <input
                  type="file"
                  id="resumeFileInput"
                  accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  style={{ display: 'none' }}
                  onChange={handleFileInput}
                />
                <label htmlFor="resumeFileInput">
                  <span
                    style={{
                      display: 'inline-block',
                      backgroundColor: '#FFFFFF',
                      color: '#0A6ED1',
                      border: '1px solid #0A6ED1',
                      padding: '0.5rem 1.25rem',
                      borderRadius: '6px',
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      cursor: 'pointer'
                    }}
                  >
                    {uploadedFile ? 'Choose Different File' : 'Browse Local Files'}
                  </span>
                </label>
              </div>
            </div>

            {uploadNotice && (
              <div
                style={{
                  marginTop: '1.25rem',
                  padding: '0.75rem 1rem',
                  backgroundColor: '#EBF3FB',
                  borderRadius: '6px',
                  fontSize: '0.85rem',
                  color: '#0A6ED1'
                }}
              >
                {uploadNotice}
              </div>
            )}

            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="primary"
                size="md"
                onClick={handleContinueWithUpload}
                disabled={!uploadedFile}
                icon={<ArrowRightIcon size={16} />}
                iconPosition="right"
              >
                Continue to Skills Review
              </Button>
            </div>
          </Card>

          {/* Quick Start / Guidance Card */}
          <Card title="Extraction & Privacy Standards" subtitle="What happens with your data">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontSize: '0.9rem', color: '#5B6876', lineHeight: 1.5 }}>
              <div>
                <strong style={{ color: '#001A47', display: 'block', marginBottom: '0.25rem' }}>
                  1. Zero Data Sharing
                </strong>
                Uploaded documents are processed strictly in memory and are never shared or sold. Private contact info is stripped before processing.
              </div>
              <div>
                <strong style={{ color: '#001A47', display: 'block', marginBottom: '0.25rem' }}>
                  2. Full Human Control
                </strong>
                No skill is finalized automatically. On the next screen, you inspect every competency, delete irrelevant items, and correct proficiency levels.
              </div>
              <div>
                <strong style={{ color: '#001A47', display: 'block', marginBottom: '0.25rem' }}>
                  3. Don't Have a Resume Ready?
                </strong>
                Switch to the <em>Option B: Manual Work History Entry</em> tab to enter your role and experience points directly.
              </div>
            </div>
          </Card>
        </div>
      ) : (
        /* Manual Work History Entry Form */
        <Card title="Manual Experience Entry" subtitle="Enter your career history without an uploaded document">
          <form onSubmit={handleManualSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.4rem', color: '#001A47' }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  value={manualProfile.fullName}
                  onChange={(e) => setManualProfile({ ...manualProfile, fullName: e.target.value })}
                  placeholder="e.g. Alex Vance"
                  style={{ width: '100%' }}
                />
                {formErrors.fullName && (
                  <span style={{ color: '#BB0000', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>
                    {formErrors.fullName}
                  </span>
                )}
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.4rem', color: '#001A47' }}>
                  Current Role / Background Title *
                </label>
                <input
                  type="text"
                  value={manualProfile.currentTitle}
                  onChange={(e) => setManualProfile({ ...manualProfile, currentTitle: e.target.value })}
                  placeholder="e.g. Senior Financial Analyst or Operations Coordinator"
                  style={{ width: '100%' }}
                />
                {formErrors.currentTitle && (
                  <span style={{ color: '#BB0000', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>
                    {formErrors.currentTitle}
                  </span>
                )}
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.4rem', color: '#001A47' }}>
                  Total Relevant Experience (Years) *
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  value={manualProfile.yearsExperience}
                  onChange={(e) => setManualProfile({ ...manualProfile, yearsExperience: parseFloat(e.target.value) || 0 })}
                  style={{ width: '100%' }}
                />
                {formErrors.yearsExperience && (
                  <span style={{ color: '#BB0000', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>
                    {formErrors.yearsExperience}
                  </span>
                )}
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.4rem', color: '#001A47' }}>
                  Highest Education / Degree
                </label>
                <input
                  type="text"
                  value={manualProfile.education}
                  onChange={(e) => setManualProfile({ ...manualProfile, education: e.target.value })}
                  placeholder="e.g. B.S. in Accounting or Computer Science"
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.4rem', color: '#001A47' }}>
                Key Responsibilities, Technologies & Accomplishments *
              </label>
              <textarea
                rows={4}
                value={manualProfile.responsibilities}
                onChange={(e) => setManualProfile({ ...manualProfile, responsibilities: e.target.value })}
                placeholder="Describe your day-to-day tasks, business systems used (e.g. Excel, SQL, ERP tools), cross-functional workshops, or financial reconciliations..."
                style={{ width: '100%', resize: 'vertical' }}
              />
              {formErrors.responsibilities && (
                <span style={{ color: '#BB0000', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>
                  {formErrors.responsibilities}
                </span>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <Button type="button" variant="ghost" onClick={() => navigate('/')}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" icon={<ArrowRightIcon size={16} />} iconPosition="right">
                Save & Continue to Skills Review
              </Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
};
