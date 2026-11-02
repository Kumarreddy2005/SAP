import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { StepIndicator } from '../components/common/StepIndicator';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { UploadCloudIcon, CheckIcon, ArrowRightIcon, AlertTriangleIcon, FileTextIcon } from '../components/common/Icons';
import { useCareerContext } from '../context/CareerContext';
import { ResumeUploadResponse } from '@career-orchestrator/shared';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const {
    manualProfile,
    setManualProfile,
    setUploadedFile,
    handleUploadSuccess,
    sessionResetToken,
    sessionGeneration,
    loadDemoBaseline
  } = useCareerContext();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const sessionGenRef = useRef<number>(sessionGeneration);

  useEffect(() => {
    sessionGenRef.current = sessionGeneration;
  }, [sessionGeneration]);

  const [activeTab, setActiveTab] = useState<'upload' | 'manual'>('upload');
  const [dragActive, setDragActive] = useState(false);
  const [selectedFileObj, setSelectedFileObj] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadWarning, setUploadWarning] = useState<string | null>(null);
  const [uploadSuccessData, setUploadSuccessData] = useState<ResumeUploadResponse | null>(null);

  // Form validation errors for manual intake
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Reset local state whenever candidate session is reset
  useEffect(() => {
    setSelectedFileObj(null);
    setUploadError(null);
    setUploadWarning(null);
    setUploadSuccessData(null);
    setFormErrors({});
    setIsUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [sessionResetToken, sessionGeneration]);

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
    setUploadError(null);
    setUploadWarning(null);
    setUploadSuccessData(null);

    const validExtensions = ['.pdf', '.docx'];
    const hasValidExt = validExtensions.some((ext) => file.name.toLowerCase().endsWith(ext));

    if (!hasValidExt) {
      setUploadError('Invalid file format. Please upload an Adobe PDF (.pdf) or Word document (.docx).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File size exceeds the 10MB limit. Please upload a smaller file.');
      return;
    }

    setSelectedFileObj(file);
    setUploadedFile({
      name: file.name,
      size: file.size,
      type: file.type || (file.name.endsWith('.docx') ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' : 'application/pdf')
    });
  };

  const executeUpload = async () => {
    if (!selectedFileObj) {
      setUploadError('Please select a file to upload.');
      return;
    }

    const curGen = sessionGenRef.current;
    setIsUploading(true);
    setUploadError(null);
    setUploadWarning(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFileObj);

      const response = await fetch('/api/v1/resume/upload', {
        method: 'POST',
        body: formData
      });

      // Discard response if candidate session was reset while upload was in flight
      if (curGen !== sessionGenRef.current) return;

      const data = await response.json();

      if (curGen !== sessionGenRef.current) return;

      if (!response.ok) {
        throw new Error(data.message || data.error || `Server responded with HTTP ${response.status}`);
      }

      const uploadResult = data as ResumeUploadResponse;
      setUploadSuccessData(uploadResult);
      handleUploadSuccess(uploadResult);

      if (uploadResult.status === 'EMPTY_TEXT' || uploadResult.suggestedSkills.length === 0) {
        setUploadWarning(
          uploadResult.warnings.length > 0
            ? uploadResult.warnings.join(' ')
            : 'No readable text was detected. Note: Optical Character Recognition (OCR) for scanned image documents is not enabled. Please upload a text-based PDF/DOCX or add skills manually.'
        );
      } else {
        // Automatically navigate to skills review after a brief confirmation
        setTimeout(() => {
          if (curGen === sessionGenRef.current) {
            navigate('/skills-review');
          }
        }, 600);
      }
    } catch (err: unknown) {
      if (curGen !== sessionGenRef.current) return;
      const message = err instanceof Error ? err.message : 'Upload failed. Please try again.';
      setUploadError(message);
    } finally {
      if (curGen === sessionGenRef.current) {
        setIsUploading(false);
      }
    }
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

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: '1280px', margin: '0 auto' }}>
      <Breadcrumbs items={[{ label: 'Background Intake' }]} />
      <StepIndicator currentStepId="profile" />

      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#001A47', marginBottom: '0.5rem' }}>
          Candidate Background Intake
        </h1>
        <p style={{ color: '#5B6876', fontSize: '1.05rem', maxWidth: '800px' }}>
          Provide your professional background to discover transferable skills. Upload your resume for automated competency extraction or enter your experience history manually.
        </p>
      </div>

      {/* Active Pipeline Status Banner */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0.75rem 1.25rem',
          borderRadius: '8px',
          backgroundColor: '#EBF3FB',
          border: '1px solid #C4D5EA',
          marginBottom: '1.75rem'
        }}
      >
        <span
          style={{
            display: 'inline-block',
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            backgroundColor: '#107E3E'
          }}
        />
        <div style={{ fontSize: '0.875rem', color: '#001A47' }}>
          <strong>Live Extraction Pipeline:</strong> Documents are securely parsed in-memory using Mozilla PDF.js & Mammoth DOCX engines. Matches candidate competencies across 9 functional categories.
        </div>
      </div>

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
                border: `2px dashed ${dragActive ? '#0A6ED1' : selectedFileObj ? '#107E3E' : '#C4D5EA'}`,
                backgroundColor: dragActive ? '#EBF3FB' : selectedFileObj ? '#F3FAF6' : '#FAFBFD',
                borderRadius: '8px',
                padding: '2.5rem 1.5rem',
                textAlign: 'center',
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1rem'
              }}
            >
              <div style={{ color: selectedFileObj ? '#107E3E' : '#0A6ED1' }}>
                <UploadCloudIcon size={48} />
              </div>

              <div>
                <h4 style={{ fontSize: '1.15rem', color: '#001A47', marginBottom: '0.35rem' }}>
                  {selectedFileObj ? 'Document Selected & Ready' : 'Drag & drop your resume file here'}
                </h4>
                <p style={{ color: '#5B6876', fontSize: '0.9rem' }}>
                  Supports PDF or DOCX up to 10MB in size
                </p>
              </div>

              {selectedFileObj && (
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
                  <FileTextIcon color="#107E3E" size={20} />
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#001A47' }}>
                      {selectedFileObj.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#5B6876' }}>
                      {(selectedFileObj.size / 1024).toFixed(1)} KB • {selectedFileObj.name.endsWith('.docx') ? 'DOCX Document' : 'PDF Document'}
                    </div>
                  </div>
                  <Badge variant="success" size="sm">
                    Staged
                  </Badge>
                </div>
              )}

              <div style={{ marginTop: '0.5rem' }}>
                <input
                  ref={fileInputRef}
                  type="file"
                  id="resumeFileInput"
                  accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  style={{ display: 'none' }}
                  onChange={handleFileInput}
                  disabled={isUploading}
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
                      cursor: isUploading ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {selectedFileObj ? 'Select Different File' : 'Browse Local Files'}
                  </span>
                </label>
              </div>
            </div>

            {/* Error Message */}
            {uploadError && (
              <div
                style={{
                  marginTop: '1.25rem',
                  padding: '1rem',
                  backgroundColor: '#FDEDED',
                  border: '1px solid #F5B7B1',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem',
                  color: '#BB0000',
                  fontSize: '0.9rem'
                }}
              >
                <AlertTriangleIcon size={20} color="#BB0000" />
                <div style={{ flex: 1 }}>
                  <strong>Upload / Parsing Error:</strong> {uploadError}
                </div>
                <button
                  onClick={() => setUploadError(null)}
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: '#BB0000',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '0.85rem'
                  }}
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* Warning Message (e.g. Scanned / Empty PDF) */}
            {uploadWarning && (
              <div
                style={{
                  marginTop: '1.25rem',
                  padding: '1rem',
                  backgroundColor: '#FFF4E5',
                  border: '1px solid #FFD099',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem',
                  color: '#A05000',
                  fontSize: '0.875rem'
                }}
              >
                <AlertTriangleIcon size={20} color="#E9730C" />
                <div style={{ flex: 1 }}>
                  <strong>Extraction Advisory:</strong> {uploadWarning}
                  <div style={{ marginTop: '0.5rem' }}>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate('/skills-review')}
                    >
                      Continue & Add Skills Manually →
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Extraction Success Summary */}
            {uploadSuccessData && !uploadWarning && (
              <div
                style={{
                  marginTop: '1.25rem',
                  padding: '0.9rem 1rem',
                  backgroundColor: '#EBF8EE',
                  border: '1px solid #B8E3C8',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  fontSize: '0.9rem',
                  color: '#107E3E'
                }}
              >
                <CheckIcon size={18} color="#107E3E" />
                <span>
                  Extracted {uploadSuccessData.extractedTextPreview.length} characters and identified <strong>{uploadSuccessData.suggestedSkills.length} candidate competencies</strong>. Redirecting to review...
                </span>
              </div>
            )}

            <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => {
                  loadDemoBaseline();
                  navigate('/skills-review');
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#0A6ED1',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  padding: 0
                }}
              >
                Or load Alex Vance Demo Profile for Hackathon Presentation
              </button>

              <Button
                variant="primary"
                size="md"
                onClick={executeUpload}
                disabled={!selectedFileObj || isUploading}
                icon={isUploading ? undefined : <ArrowRightIcon size={16} />}
                iconPosition="right"
              >
                {isUploading ? 'Extracting Competencies...' : 'Extract & Review Competencies'}
              </Button>
            </div>
          </Card>

          {/* Quick Start / Guidance Card */}
          <Card title="Extraction & Privacy Standards" subtitle="How your data is handled">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontSize: '0.9rem', color: '#5B6876', lineHeight: 1.5 }}>
              <div>
                <strong style={{ color: '#001A47', display: 'block', marginBottom: '0.25rem' }}>
                  1. Zero Data Sharing & Non-Durable In-Memory Processing
                </strong>
                Uploaded documents are processed strictly in server memory and discarded immediately. No resume text is saved to public URLs or persistent storage.
              </div>
              <div>
                <strong style={{ color: '#001A47', display: 'block', marginBottom: '0.25rem' }}>
                  2. Human-in-the-Loop Verification
                </strong>
                No extracted skill is final until you review and confirm it. On the next screen, you inspect each candidate competency, verify evidence snippets, calibrate proficiencies, or reject items.
              </div>
              <div>
                <strong style={{ color: '#001A47', display: 'block', marginBottom: '0.25rem' }}>
                  3. Scanned PDF & OCR Notice
                </strong>
                Documents must contain a readable text layer. Scanned photo PDFs without embedded text cannot be extracted automatically because OCR is not enabled on this host.
              </div>
              <div>
                <strong style={{ color: '#001A47', display: 'block', marginBottom: '0.25rem' }}>
                  4. Don't Have a Resume Ready?
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
