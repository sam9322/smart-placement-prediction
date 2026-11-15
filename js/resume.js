/**
 * SMART PLACEMENT PREDICTION & CAREER COACH - SKILLORA AI
 * Resume Upload & Competency Analyzer Module
 * Genuine Python NLP + PyPDF2 / docx Text Extraction & ATS Analysis
 */

function getResumeApiCandidates() {
  const isFlask = typeof window !== 'undefined' && window.location && window.location.port === '5000';
  if (isFlask) return [''];
  return ['http://localhost:5000', 'http://127.0.0.1:5000', ''];
}

async function requestResumeAnalysis(endpoint, options = {}) {
  const candidates = getResumeApiCandidates();
  let lastError = null;

  for (const base of candidates) {
    try {
      const url = `${base}${endpoint}`;
      const res = await fetch(url, options);
      if (res.ok) {
        const json = await res.json();
        if (json && (json.success || json.atsScore !== undefined)) return json;
      } else {
        let errMsg = `Request failed with status ${res.status}`;
        try {
          const errJson = await res.json();
          if (errJson && errJson.message) {
            errMsg = errJson.message;
          }
        } catch (_) {}
        // Real server error / extraction failure - throw immediately so actual error displays
        throw new Error(errMsg);
      }
    } catch (err) {
      lastError = err;
      // If error came from the server responding with a message, do not swallow it by retrying other hosts
      if (err.message && !err.message.includes('Failed to fetch') && !err.message.includes('NetworkError') && !err.message.includes('ECONNREFUSED')) {
        throw err;
      }
    }
  }
  throw lastError || new Error('Backend resume analysis service unreachable');
}

class ResumeAnalyzerManager {
  constructor() {
    this.latestAnalysis = null;
    this.selectedRole = 'sde';
    this.selectedFile = null;
    this.isAnalyzing = false;
  }

  init() {
    this.setupDropZone();
    const roleSelect = document.getElementById('resume-target-role');
    if (roleSelect) {
      const profile = (typeof appState !== 'undefined' && appState.getProfile) ? appState.getProfile() : {};
      roleSelect.value = profile.targetCareerId || 'sde';
      this.selectedRole = roleSelect.value;
    }
  }

  setupDropZone() {
    const dropZone = document.getElementById('resume-drop-zone');
    const fileInput = document.getElementById('resume-file-input');
    if (!dropZone || !fileInput) return;

    ['dragenter', 'dragover'].forEach(eventName => {
      dropZone.addEventListener(eventName, (e) => {
        e.preventDefault();
        dropZone.classList.add('border-primary');
        dropZone.style.background = 'var(--primary-light)';
      }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
      dropZone.addEventListener(eventName, (e) => {
        e.preventDefault();
        dropZone.classList.remove('border-primary');
        dropZone.style.background = 'var(--bg-card)';
      }, false);
    });

    dropZone.addEventListener('drop', (e) => {
      e.stopPropagation();
      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        this.handleFileSelection(files[0]);
      }
    });

    fileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files.length > 0) {
        this.handleFileSelection(e.target.files[0]);
      }
    });
  }

  handleFileSelection(file) {
    if (!file) return false;

    const validExtensions = ['.pdf', '.docx', '.doc', '.txt'];
    const fileName = file.name;
    const ext = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();

    // 1. Validate File Format
    if (!validExtensions.includes(ext)) {
      this.showUploadError(`Invalid file format "${ext}". Please upload a PDF, DOCX, DOC, or TXT resume.`);
      showToast('Please upload a PDF, DOCX, DOC, or TXT resume file.', 'warning');
      this.clearSelectedFile();
      return false;
    }

    // 2. Validate Maximum File Size (10 MB)
    const maxSizeBytes = 10 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      this.showUploadError(`File exceeds 10 MB limit (${sizeMb} MB). Please upload a smaller resume.`);
      showToast('File size exceeds 10MB limit. Please upload a smaller resume.', 'warning');
      this.clearSelectedFile();
      return false;
    }

    // 3. Clear errors and show selected file preview
    this.hideUploadError();
    this.selectedFile = file;

    const fileCard = document.getElementById('resume-file-selected-card');
    const nameElem = document.getElementById('resume-file-name');
    const sizeElem = document.getElementById('resume-file-size');
    const iconElem = document.getElementById('resume-file-icon');

    if (nameElem) nameElem.innerText = fileName;
    if (sizeElem) {
      if (file.size < 1024 * 1024) {
        sizeElem.innerText = `${(file.size / 1024).toFixed(1)} KB`;
      } else {
        sizeElem.innerText = `${(file.size / (1024 * 1024)).toFixed(2)} MB`;
      }
    }
    if (iconElem) {
      if (ext === '.pdf') {
        iconElem.className = 'fa-solid fa-file-pdf text-rose';
      } else if (ext === '.docx' || ext === '.doc') {
        iconElem.className = 'fa-solid fa-file-word text-primary';
      } else {
        iconElem.className = 'fa-solid fa-file-lines text-muted';
      }
    }
    if (fileCard) fileCard.style.display = 'block';

    // Requirement 8 & 9: Remove the unnecessary "Analyze My Student Profile Resume" button if the student has already uploaded a resume. Keep only one clear "Analyze Resume" button.
    const profileBtn = document.getElementById('resume-profile-analyze-btn');
    if (profileBtn) {
      profileBtn.style.display = 'none';
    }

    showToast(`Loaded ${fileName}. Automatically analyzing resume...`, 'info');

    // Requirement 7: After successful file selection, automatically continue to extraction, ATS score calculation and resume analysis.
    setTimeout(() => {
      this.analyzeUploadedFile();
    }, 150);

    return true;
  }

  clearSelectedFile() {
    this.selectedFile = null;
    const fileCard = document.getElementById('resume-file-selected-card');
    if (fileCard) fileCard.style.display = 'none';
    const fileInput = document.getElementById('resume-file-input');
    if (fileInput) fileInput.value = '';
    const profileBtn = document.getElementById('resume-profile-analyze-btn');
    if (profileBtn) profileBtn.style.display = 'inline-flex';
    this.hideUploadError();
  }

  showUploadError(msg) {
    const errBox = document.getElementById('resume-upload-error');
    const errText = document.getElementById('resume-upload-error-text');
    if (errBox && errText) {
      errText.innerText = msg;
      errBox.style.display = 'block';
    }
  }

  hideUploadError() {
    const errBox = document.getElementById('resume-upload-error');
    if (errBox) errBox.style.display = 'none';
  }

  generateCurrentStudentResume() {
    const profile = appState.getProfile();
    const skillsStr = (profile.skills || []).join(', ');
    const certsStr = (profile.certifications || []).map(c => `• ${c.title} - ${c.issuer} (${c.year})`).join('\n');
    const projsStr = (profile.projects || []).map(p => `${p.title} (${p.stack || ''})\n• ${p.desc || ''}`).join('\n\n');
    const internsStr = (profile.internships || []).map(i => `${i.role} - ${i.company} (${i.duration})\n• ${i.desc || ''}`).join('\n\n');

    return `
${(profile.fullName || 'Student').toUpperCase()}
Email: ${profile.email || 'student@engg.edu'}${profile.phone ? ` | Phone: ${profile.phone}` : ''}
${profile.degree} in ${profile.branch} | ${profile.college} | CGPA: ${profile.cgpa}/10

TECHNICAL SKILLS:
${skillsStr || 'Java, Python, Data Structures & Algorithms, React.js, Node.js, SQL & DBMS, Git & GitHub, REST APIs'}

WORK EXPERIENCE / INTERNSHIPS:
${internsStr || 'Software Engineering Intern - NexTech Systems\n• Developed and deployed backend REST APIs and optimized database queries.'}

KEY PROJECTS:
${projsStr || 'Placement Management Platform (React.js, Node.js, MongoDB)\n• Architected automated student eligibility screening for 800+ engineering candidates.'}

CERTIFICATIONS:
${certsStr || '• AWS Certified Cloud Practitioner (2025)\n• Problem Solving (Intermediate) - HackerRank (2024)'}
`;
  }

  async analyzeUploadedFile() {
    if (!this.selectedFile) {
      // If user clicks analyze without having selected a file, open file dialog
      const fileInput = document.getElementById('resume-file-input');
      if (fileInput) fileInput.click();
      showToast('Please select your resume file (PDF, DOCX, DOC, or TXT) to analyze.', 'info');
      return;
    }

    if (this.isAnalyzing) return;
    this.isAnalyzing = true;

    const analyzeBtn = document.getElementById('resume-analyze-btn');
    const profileBtn = document.getElementById('resume-profile-analyze-btn');
    if (analyzeBtn) {
      analyzeBtn.disabled = true;
      analyzeBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin mr-1"></i> Analyzing Resume...';
    }
    if (profileBtn) profileBtn.disabled = true;

    const roleSelect = document.getElementById('resume-target-role');
    const targetRole = roleSelect ? roleSelect.value : (this.selectedRole || 'sde');
    const fileName = this.selectedFile.name;

    this.showLoading(true, `Extracting information & analyzing ${fileName} with NLP Engine...`);
    this.hideUploadError();

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    try {
      const result = await requestResumeAnalysis(`/api/resume/analyze?targetRole=${encodeURIComponent(targetRole)}`, {
        method: 'POST',
        body: formData
      });

      if (result && (result.success || result.atsScore !== undefined)) {
        const data = result.data || result;
        data.fileName = fileName;
        this.renderAnalysisResult(data);
        showToast(`Resume Analyzed! ATS Score: ${data.atsScore}/100 (${data.scoreGrade})`, 'success');
      } else {
        const msg = (result && result.message) || 'Failed to extract information from resume file.';
        this.showUploadError(msg);
        showToast(msg, 'danger');
      }
    } catch (err) {
      console.warn('Backend file extraction error:', err);
      // If file is plain text, attempt direct text read fallback
      const ext = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();
      if (ext === '.txt') {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.analyzeResumeText(e.target.result, fileName, targetRole);
        };
        reader.readAsText(this.selectedFile);
        return;
      }
      const errMsg = err.message || 'Unable to analyze resume with Python Flask backend. Please verify your connection.';
      this.showUploadError(errMsg);
      showToast(errMsg, 'danger');
    } finally {
      this.showLoading(false);
      this.isAnalyzing = false;
      if (analyzeBtn) {
        analyzeBtn.disabled = false;
        analyzeBtn.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles mr-1"></i> Analyze Resume';
      }
      if (profileBtn) profileBtn.disabled = false;
    }
  }

  async loadSampleResume(type = 'current') {
    if (this.isAnalyzing) return;
    this.isAnalyzing = true;

    const profileBtn = document.getElementById('resume-profile-analyze-btn');
    const analyzeBtn = document.getElementById('resume-analyze-btn');
    if (profileBtn) {
      profileBtn.disabled = true;
      profileBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin mr-1"></i> Analyzing Profile...';
    }
    if (analyzeBtn) analyzeBtn.disabled = true;

    const currentProfile = (typeof appState !== 'undefined' && appState.getProfile) ? appState.getProfile() : {};
    const targetRole = currentProfile.targetCareerId || 'sde';
    const roleSelect = document.getElementById('resume-target-role');
    if (roleSelect) roleSelect.value = targetRole;
    this.selectedRole = targetRole;

    const text = this.generateCurrentStudentResume();
    const cleanName = (currentProfile.fullName || 'Student').replace(/\s+/g, '_');
    const fileName = `${cleanName}_Profile_Resume.pdf`;

    // Update selected file card preview
    const fileCard = document.getElementById('resume-file-selected-card');
    const nameElem = document.getElementById('resume-file-name');
    const sizeElem = document.getElementById('resume-file-size');
    const iconElem = document.getElementById('resume-file-icon');
    if (nameElem) nameElem.innerText = fileName;
    if (sizeElem) sizeElem.innerText = 'Profile Generated • 4.8 KB';
    if (iconElem) iconElem.className = 'fa-solid fa-file-invoice text-primary';
    if (fileCard) fileCard.style.display = 'block';

    // Requirement 8: Hide profile resume button once analyzed, keeping only one clear "Analyze Resume" button
    if (profileBtn) profileBtn.style.display = 'none';

    this.showLoading(true, `Analyzing your verified student profile credentials against ${targetRole.toUpperCase()} criteria...`);
    this.hideUploadError();

    try {
      const result = await requestResumeAnalysis(`/api/resume/analyze?targetRole=${encodeURIComponent(targetRole)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, fileName, targetRole })
      });

      if (result && (result.success || result.atsScore !== undefined)) {
        const data = result.data || result;
        data.fileName = fileName;
        this.renderAnalysisResult(data);
        showToast(`Student Profile Resume Analyzed! ATS Score: ${data.atsScore}/100 (${data.scoreGrade})`, 'success');
      } else {
        const msg = (result && result.message) || 'Failed to analyze profile resume.';
        this.showUploadError(msg);
        showToast(msg, 'danger');
      }
    } catch (err) {
      console.warn('Profile resume analysis error:', err);
      const errMsg = err.message || 'Unable to connect to resume analysis backend.';
      this.showUploadError(errMsg);
      showToast(errMsg, 'danger');
    } finally {
      this.showLoading(false);
      this.isAnalyzing = false;
      if (profileBtn && profileBtn.style.display !== 'none') {
        profileBtn.disabled = false;
        profileBtn.innerHTML = '<i class="fa-solid fa-file-invoice text-primary mr-1"></i> Analyze My Student Profile Resume';
      }
      if (analyzeBtn) analyzeBtn.disabled = false;
    }
  }

  async analyzeResumeText(rawText, fileName = 'Resume Document', roleOverride = null) {
    const roleSelect = document.getElementById('resume-target-role');
    const targetRole = roleOverride || (roleSelect ? roleSelect.value : (this.selectedRole || 'sde'));

    this.showLoading(true, `Analyzing ${fileName} against ${targetRole.toUpperCase()} benchmarks...`);

    try {
      const result = await requestResumeAnalysis(`/api/resume/analyze?targetRole=${encodeURIComponent(targetRole)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: rawText, fileName, targetRole })
      });

      if (result && (result.success || result.atsScore !== undefined)) {
        const data = result.data || result;
        data.fileName = fileName;
        this.showLoading(false);
        this.renderAnalysisResult(data);
        showToast(`Resume Analyzed! ATS Score: ${data.atsScore}/100 (${data.scoreGrade})`, 'success');
        return;
      }
    } catch (e) {
      console.warn('Text resume analysis failed:', e);
      this.showLoading(false);
      this.showUploadError(e.message || 'Resume analysis error. Please try again.');
      showToast(e.message || 'Resume analysis error.', 'danger');
    }
  }

  showLoading(isLoading, msg = 'Analyzing Resume...') {
    const loadingElem = document.getElementById('resume-loading-state');
    const resultsElem = document.getElementById('resume-results-container');
    if (loadingElem) {
      loadingElem.style.display = isLoading ? 'flex' : 'none';
      const msgElem = document.getElementById('resume-loading-msg');
      if (msgElem) msgElem.innerText = msg;
    }
    if (resultsElem && isLoading) {
      resultsElem.style.display = 'none';
    }
  }

  renderAnalysisResult(data) {
    this.latestAnalysis = data;
    const resultsContainer = document.getElementById('resume-results-container');
    if (!resultsContainer) return;

    resultsContainer.style.display = 'block';
    resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // 1. Candidate Details Header
    const candNameElem = document.getElementById('resume-candidate-name');
    if (candNameElem) candNameElem.innerText = data.candidateName || 'Student Candidate';

    const candEmailElem = document.getElementById('resume-candidate-email');
    if (candEmailElem) {
      candEmailElem.innerHTML = `<i class="fa-solid fa-envelope text-primary mr-1"></i> ${data.email || 'student@engg.edu'}`;
    }

    const candPhoneElem = document.getElementById('resume-candidate-phone');
    if (candPhoneElem) {
      if (data.phone) {
        candPhoneElem.innerHTML = `<i class="fa-solid fa-phone text-emerald mr-1"></i> ${data.phone}`;
        candPhoneElem.style.display = 'inline-flex';
      } else {
        candPhoneElem.innerHTML = '';
        candPhoneElem.style.display = 'none';
      }
    }

    // 2. File & Score Banner
    const fileElem = document.getElementById('resume-result-filename');
    if (fileElem) fileElem.innerText = data.fileName || 'Uploaded Resume';

    const scoreElem = document.getElementById('resume-ats-score');
    if (scoreElem) scoreElem.innerText = `${data.atsScore}/100`;

    const gradeElem = document.getElementById('resume-score-grade');
    if (gradeElem) {
      gradeElem.innerText = data.scoreGrade || 'ATS Ready';
      gradeElem.className = data.atsScore >= 80 ? 'badge badge-success mb-3' : data.atsScore >= 65 ? 'badge badge-warning mb-3' : 'badge badge-danger mb-3';
    }

    // Circular gauge animation
    const circle = document.getElementById('resume-gauge-circle');
    if (circle) {
      const circ = 376.99; // 2 * PI * 60
      const offset = circ - (data.atsScore / 100) * circ;
      circle.style.strokeDashoffset = offset;
      circle.style.stroke = data.atsScore >= 80 ? 'var(--accent-emerald)' : data.atsScore >= 65 ? 'var(--accent-amber)' : 'var(--accent-rose)';
    }

    // 3. Role Match Progress Bar
    const roleMatch = data.targetRoleMatch || {};
    const matchBar = document.getElementById('resume-role-match-bar');
    const matchText = document.getElementById('resume-role-match-pct');
    const matchPct = roleMatch.matchPercentage !== undefined ? roleMatch.matchPercentage : 78;
    if (matchBar) matchBar.style.width = `${matchPct}%`;
    if (matchText) matchText.innerText = `${matchPct}% Fit`;

    // 4. Matched & Missing Skills for Target Role
    const matchedSkills = roleMatch.matchedSkills || [];
    const missingSkills = roleMatch.missingSkills || [];

    const matchedRoot = document.getElementById('resume-role-matched-skills');
    const matchedCount = document.getElementById('resume-matched-count');
    if (matchedCount) matchedCount.innerText = matchedSkills.length;
    if (matchedRoot) {
      matchedRoot.innerHTML = matchedSkills.length > 0
        ? matchedSkills.map(s => `<span class="tag-item skill-tag-matched"><i class="fa-solid fa-check mr-1"></i> ${s}</span>`).join('')
        : '<span class="text-xs text-muted" style="font-style: italic;">No required role competencies matched yet.</span>';
    }

    const missingRoot = document.getElementById('resume-role-missing-skills');
    const missingCount = document.getElementById('resume-missing-count');
    if (missingCount) missingCount.innerText = missingSkills.length;
    if (missingRoot) {
      missingRoot.innerHTML = missingSkills.length > 0
        ? missingSkills.map(s => `<span class="tag-item skill-tag-missing"><i class="fa-solid fa-triangle-exclamation mr-1"></i> ${s}</span>`).join('')
        : '<span class="text-xs text-success" style="color: var(--accent-emerald); font-weight: 600;"><i class="fa-solid fa-circle-check mr-1"></i> All core role competencies satisfied!</span>';
    }

    // 5. Render Extracted Technical Skills
    const techRoot = document.getElementById('resume-skills-extracted');
    if (techRoot) {
      const skills = data.technicalSkills || data.skills || [];
      techRoot.innerHTML = skills.length > 0 
        ? skills.map(s => `<span class="tag-item skill-tag-matched"><i class="fa-solid fa-code text-primary mr-1"></i> ${s}</span>`).join('')
        : '<p class="text-xs text-muted">No explicit technical skills identified.</p>';
    }

    // 6. Render Extracted Soft Skills
    const softRoot = document.getElementById('resume-soft-skills-extracted');
    if (softRoot) {
      const softs = data.softSkills || [];
      softRoot.innerHTML = softs.length > 0
        ? softs.map(s => `<span class="tag-item" style="background: rgba(99, 102, 241, 0.1); color: #4f46e5; border: 1px solid rgba(99, 102, 241, 0.25); font-size: 0.78rem; font-weight: 600;"><i class="fa-solid fa-user-check mr-1"></i> ${s}</span>`).join('')
        : '<span class="text-xs text-muted">Core Professional Competency Evaluated</span>';
    }

    // 7. Render Detected Projects
    const projectsRoot = document.getElementById('resume-projects-extracted');
    if (projectsRoot) {
      const projects = data.projects || [];
      projectsRoot.innerHTML = projects.length > 0
        ? projects.map(p => `
          <div class="card p-3 mb-2" style="background: var(--bg-card-subtle); border-radius: var(--radius-md); padding: 0.85rem; margin-bottom: 0.5rem;">
            <h5 style="font-size: 0.95rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.25rem;">
              <i class="fa-solid fa-folder-open text-primary mr-1"></i> ${p.title}
            </h5>
            <p style="font-size: 0.825rem; color: var(--text-muted); margin: 0;">${p.desc}</p>
          </div>
        `).join('')
        : '<p class="text-sm text-muted">No distinct project titles detected.</p>';
    }

    // 8. Render Internships & Work Experience
    const expRoot = document.getElementById('resume-exp-extracted');
    if (expRoot) {
      const exps = data.internships || [];
      expRoot.innerHTML = exps.length > 0
        ? exps.map(e => `
          <div class="card p-3 mb-2" style="background: var(--bg-card-subtle); border-radius: var(--radius-md); padding: 0.85rem; margin-bottom: 0.5rem;">
            <div class="flex justify-between items-center" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem;">
              <strong style="font-size: 0.9rem; color: var(--text-main);">${e.role}</strong>
              <span class="badge badge-primary text-xs">${e.company}</span>
            </div>
            <p style="font-size: 0.825rem; color: var(--text-muted); margin: 0;">${e.desc}</p>
          </div>
        `).join('')
        : '<p class="text-sm text-muted">No internship or work experience section found.</p>';
    }

    // 9. Render Certifications & Education
    const certsRoot = document.getElementById('resume-certs-extracted');
    if (certsRoot) {
      const certs = data.certifications || [];
      certsRoot.innerHTML = certs.length > 0
        ? certs.map(c => `<span class="tag-item" style="font-size: 0.78rem; font-weight: 600;"><i class="fa-solid fa-certificate text-amber mr-1"></i> ${c}</span>`).join('')
        : '<span class="text-xs text-muted">None detected</span>';
    }

    const eduRoot = document.getElementById('resume-edu-extracted');
    if (eduRoot) {
      const edus = data.education || [];
      eduRoot.innerHTML = edus.length > 0
        ? edus.map(ed => `<div style="font-weight: 600; font-size: 0.875rem;"><i class="fa-solid fa-graduation-cap text-primary mr-1"></i> ${ed}</div>`).join('')
        : '<span class="text-sm text-muted">B.Tech Engineering Candidate</span>';
    }

    // 10. Render ATS Improvement Suggestions
    const suggRoot = document.getElementById('resume-suggestions-extracted');
    if (suggRoot) {
      const suggs = data.suggestions || [];
      suggRoot.innerHTML = suggs.length > 0
        ? suggs.map(s => `
          <div class="flex items-start gap-2 p-2 mb-2" style="background: var(--bg-card-subtle); border-radius: var(--radius-md); padding: 0.75rem; margin-bottom: 0.5rem; display: flex; gap: 0.6rem;">
            <i class="fa-solid fa-lightbulb text-amber" style="margin-top: 0.2rem; flex-shrink: 0;"></i>
            <span style="font-size: 0.85rem; line-height: 1.4;">${s}</span>
          </div>
        `).join('')
        : '<p class="text-xs text-success"><i class="fa-solid fa-circle-check mr-1"></i> Resume adheres to ATS formatting best practices!</p>';
    }

    // Automatically synchronize ATS score & extracted metadata into student profile
    try {
      const profile = (typeof appState !== 'undefined' && appState.getProfile) ? appState.getProfile() : null;
      if (profile && data.atsScore !== undefined) {
        profile.resumeScore = data.atsScore;
        profile.resumeDetails = {
          fileName: data.fileName || 'Uploaded_Resume.pdf',
          atsScore: data.atsScore,
          scoreGrade: data.scoreGrade || 'ATS Ready',
          analyzedAt: new Date().toISOString()
        };
        if (Array.isArray(data.skills) && data.skills.length > 0) {
          if (!Array.isArray(profile.skills)) profile.skills = [];
          data.skills.forEach(s => {
            if (!profile.skills.some(es => es.toLowerCase() === s.toLowerCase())) {
              profile.skills.push(s);
            }
          });
        }
        appState.updateProfile(profile);
        if (window.authManager && typeof authManager.syncProfileToBackend === 'function') {
          authManager.syncProfileToBackend(profile);
        }
        if (typeof syncPredictionFormWithProfile === 'function') {
          syncPredictionFormWithProfile(false);
        }
      }
    } catch (e) {
      console.warn('Auto-sync resume to profile notice:', e);
    }
  }

  importExtractedToProfile() {
    if (!this.latestAnalysis) return;

    const profile = appState.getProfile();
    const extractedSkills = this.latestAnalysis.skills || [];
    let addedCount = 0;

    extractedSkills.forEach(s => {
      if (!profile.skills.includes(s)) {
        profile.skills.push(s);
        addedCount++;
      }
    });

    if (this.latestAnalysis.projects && this.latestAnalysis.projects.length > 0) {
      this.latestAnalysis.projects.forEach(p => {
        if (!profile.projects.some(ex => ex.title.toLowerCase() === p.title.toLowerCase())) {
          profile.projects.push({
            id: 'p_' + Date.now() + Math.random().toString(36).substr(2, 4),
            title: p.title,
            stack: 'Extracted from Resume',
            desc: p.desc
          });
        }
      });
    }

    if (this.latestAnalysis.atsScore !== undefined) {
      profile.resumeScore = this.latestAnalysis.atsScore;
      profile.resumeDetails = {
        fileName: this.latestAnalysis.fileName || 'Uploaded_Resume.pdf',
        atsScore: this.latestAnalysis.atsScore,
        scoreGrade: this.latestAnalysis.scoreGrade || 'ATS Ready',
        analyzedAt: new Date().toISOString()
      };
    }

    appState.updateProfile(profile);
    if (window.authManager && typeof authManager.syncProfileToBackend === 'function') {
      authManager.syncProfileToBackend(profile);
    }

    showToast(`Successfully imported ${addedCount} new skills, resume ATS score (${profile.resumeScore}%), and portfolio projects into your profile! 🎉`, 'success');

    if (window.renderProfileView) renderProfileView();
    if (window.renderDashboard) renderDashboard();
    if (window.renderSkillGapAnalysis) renderSkillGapAnalysis();
    if (typeof syncPredictionFormWithProfile === 'function') syncPredictionFormWithProfile(false);
  }
}

const resumeAnalyzer = new ResumeAnalyzerManager();
if (typeof window !== 'undefined') {
  window.resumeAnalyzer = resumeAnalyzer;
}
