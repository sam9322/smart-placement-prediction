/**
 * SMART PLACEMENT PREDICTION & CAREER COACH
 * Application Controller, Router, Form Handlers, & UI Utilities
 */

// Global toast notification function
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  let icon = 'fa-solid fa-circle-info';
  if (type === 'success') icon = 'fa-solid fa-circle-check';
  if (type === 'warning') icon = 'fa-solid fa-triangle-exclamation';
  if (type === 'danger') icon = 'fa-solid fa-circle-exclamation';

  toast.innerHTML = `
    <i class="${icon} toast-icon" style="color: ${type === 'success' ? 'var(--accent-emerald)' : type === 'warning' ? 'var(--accent-amber)' : type === 'danger' ? 'var(--accent-rose)' : 'var(--primary)'}"></i>
    <span class="toast-message">${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// Router: Switch active view based on hash
function switchView(viewName) {
  const views = ['dashboard', 'profile', 'resume', 'prediction', 'coach', 'skillgap', 'roadmap', 'interview'];
  if (!views.includes(viewName)) viewName = 'dashboard';

  // Update hash
  window.location.hash = viewName;

  // Update view containers
  views.forEach(v => {
    const el = document.getElementById(`view-${v}`);
    if (el) el.classList.remove('active');
  });

  const targetView = document.getElementById(`view-${viewName}`);
  if (targetView) targetView.classList.add('active');

  // Update sidebar links active class
  document.querySelectorAll('.sidebar-link').forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${viewName}`) {
      link.classList.add('active');
    }
  });

  // Update header breadcrumb/title
  const titleMap = {
    dashboard: { title: 'Student Dashboard', desc: 'Holistic overview of placement metrics, skill readiness, and action items' },
    profile: { title: 'Student Academic & Skills Profile', desc: 'Manage your portfolio, CGPA, certifications, and technical proficiencies' },
    resume: { title: 'Resume Upload & ATS Analyzer', desc: 'Extract skills, evaluate ATS placement score, and measure job role alignment' },
    prediction: { title: 'Placement Probability Predictor', desc: 'Algorithmic multi-factor assessment engine for campus readiness' },
    coach: { title: 'AI Career Coach & Matcher', desc: 'Explore tech roles, take the career quiz, and discover target pathways' },
    skillgap: { title: 'Skill Gap Analysis & Roadmap', desc: 'Compare your skills against target role requirements and bridge deficiencies' },
    roadmap: { title: 'Interactive Placement Roadmap', desc: '4-stage milestone checklist spanning beginner to job ready mastery' },
    interview: { title: 'Interview Preparation Hub', desc: 'Timed aptitude drill, core CS technical cards, HR STAR guide, & mock simulator' }
  };

  const headerTitle = document.getElementById('header-view-title');
  const headerDesc = document.getElementById('header-view-desc');
  if (headerTitle && titleMap[viewName]) headerTitle.innerText = titleMap[viewName].title;
  if (headerDesc && titleMap[viewName]) headerDesc.innerText = titleMap[viewName].desc;

  // Close mobile sidebar if open
  closeMobileSidebar();

  // Render view-specific data
  if (viewName === 'dashboard') renderDashboard();
  if (viewName === 'profile') renderProfileView();
  if (viewName === 'resume') { if (window.resumeAnalyzer) resumeAnalyzer.init(); }
  if (viewName === 'prediction') syncPredictionFormWithProfile();
  if (viewName === 'coach') {
    careerCoach.renderQuizContainer('coach-quiz-root');
    careerCoach.renderCareersCatalog('coach-careers-root');
  }
  if (viewName === 'skillgap') renderSkillGapAnalysis();
  if (viewName === 'roadmap') renderRoadmapView();
  if (viewName === 'interview') interviewManager.init();

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Sidebar toggle logic
function toggleSidebar() {
  const sidebar = document.getElementById('app-sidebar');
  if (sidebar) sidebar.classList.toggle('mobile-open');
}

function closeMobileSidebar() {
  const sidebar = document.getElementById('app-sidebar');
  if (sidebar) sidebar.classList.remove('mobile-open');
}

// Theme Toggle
function handleThemeToggle() {
  const newTheme = toggleTheme();
  const icon = document.getElementById('theme-toggle-icon');
  if (icon) {
    icon.className = newTheme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  }
  showToast(`Switched to ${newTheme} mode!`, 'info');
  // Re-render charts with new theme colors
  if (window.renderDashboard) renderDashboard();
}

// ==========================================================================
// PROFILE VIEW FUNCTIONS
// ==========================================================================
function renderProfileView() {
  const profile = appState.getProfile();

  // Fill input fields
  setVal('profile-fullname', profile.fullName);
  setVal('profile-email', profile.email);
  setVal('profile-phone', profile.phone);
  setVal('profile-college', profile.college);
  setVal('profile-degree', profile.degree);
  setVal('profile-branch', profile.branch);
  setVal('profile-gradyear', profile.gradYear);
  setVal('profile-roll', profile.rollNumber);
  setVal('profile-cgpa', profile.cgpa);
  setVal('profile-tenth', profile.tenthMarks);
  setVal('profile-twelfth', profile.twelfthMarks);
  setVal('profile-backlogs', profile.backlogs);
  setVal('profile-aptitude', profile.aptitudeScore);
  setVal('profile-coding-rating', profile.codingRating);

  // Summary card on left
  const summaryName = document.getElementById('profile-summary-name');
  if (summaryName) summaryName.innerText = profile.fullName;

  const summaryAvatar = document.getElementById('profile-summary-avatar');
  if (summaryAvatar) {
    const inits = (profile.fullName || 'SW').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    summaryAvatar.innerText = inits;
  }

  const summaryRoll = document.getElementById('profile-summary-roll');
  if (summaryRoll) summaryRoll.innerText = `${profile.rollNumber} • ${profile.degree} ${profile.branch}`;

  const summaryCgpa = document.getElementById('profile-summary-cgpa');
  if (summaryCgpa) summaryCgpa.innerText = profile.cgpa;

  const summarySkillsCount = document.getElementById('profile-summary-skills-count');
  if (summarySkillsCount) summarySkillsCount.innerText = (profile.skills || []).length;

  const summaryProjectsCount = document.getElementById('profile-summary-projects-count');
  if (summaryProjectsCount) summaryProjectsCount.innerText = (profile.projects || []).length;

  const summaryAptitude = document.getElementById('profile-summary-aptitude');
  if (summaryAptitude) summaryAptitude.innerText = `${profile.aptitudeScore}%`;

  // Render skills tags
  renderSkillsTags();

  // Render Projects list
  renderProjectsList();

  // Render Certifications list
  renderCertificationsList();

  // Render Internships list
  renderInternshipsList();
}

function setVal(id, val) {
  const el = document.getElementById(id);
  if (el) el.value = val !== undefined ? val : '';
}

function renderSkillsTags() {
  const container = document.getElementById('profile-skills-container');
  if (!container) return;

  const skills = appState.getProfile().skills || [];
  container.innerHTML = skills.map((skill, index) => `
    <span class="tag-item">
      <span>${skill}</span>
      <span class="tag-remove" onclick="removeSkillByIndex(${index})" title="Remove skill">&times;</span>
    </span>
  `).join('');
}

function addSkillFromInput() {
  const input = document.getElementById('profile-skill-input');
  if (!input) return;

  const val = input.value.trim();
  if (!val) return;

  const profile = appState.getProfile();
  if (!profile.skills.includes(val)) {
    profile.skills.push(val);
    appState.updateProfile({ skills: profile.skills });
    renderSkillsTags();
    showToast(`Added skill: ${val}`, 'success');
  } else {
    showToast(`Skill "${val}" already exists!`, 'warning');
  }
  input.value = '';
}

function removeSkillByIndex(index) {
  const profile = appState.getProfile();
  const removed = profile.skills.splice(index, 1);
  appState.updateProfile({ skills: profile.skills });
  renderSkillsTags();
  showToast(`Removed skill: ${removed}`, 'info');
}

function renderProjectsList() {
  const list = document.getElementById('profile-projects-list');
  if (!list) return;

  const projects = appState.getProfile().projects || [];
  list.innerHTML = projects.map(p => `
    <div class="card p-3 mb-2" style="background: var(--bg-card-subtle); border-radius: var(--radius-md); padding: 1rem; margin-bottom: 0.75rem;">
      <div class="flex items-center justify-between" style="display: flex; justify-content: space-between;">
        <h4 style="font-size: 0.95rem; font-weight: 700;">${p.title}</h4>
        <button class="btn btn-ghost btn-sm text-danger" onclick="deleteProject('${p.id}')" title="Delete Project">
          <i class="fa-solid fa-trash" style="color: var(--accent-rose);"></i>
        </button>
      </div>
      <div style="font-size: 0.8rem; color: var(--primary); font-weight: 600; margin: 0.25rem 0;">Stack: ${p.stack}</div>
      <p style="font-size: 0.85rem; color: var(--text-muted);">${p.desc}</p>
    </div>
  `).join('');
}

function addProject() {
  const title = prompt('Project Title (e.g. Smart Placement Portal):');
  if (!title) return;
  const stack = prompt('Tech Stack (e.g. React, Node.js, MongoDB):') || 'JavaScript, HTML, CSS';
  const desc = prompt('Brief Impact/Description:') || 'Full stack application with responsive UI.';

  const profile = appState.getProfile();
  if (!profile.projects) profile.projects = [];
  profile.projects.push({
    id: 'p_' + Date.now(),
    title,
    stack,
    desc
  });

  appState.updateProfile({ projects: profile.projects });
  renderProjectsList();
  showToast('Project added to portfolio!', 'success');
}

function deleteProject(pId) {
  const profile = appState.getProfile();
  profile.projects = (profile.projects || []).filter(p => p.id !== pId);
  appState.updateProfile({ projects: profile.projects });
  renderProjectsList();
  showToast('Project deleted', 'info');
}

function renderCertificationsList() {
  const list = document.getElementById('profile-certs-list');
  if (!list) return;

  const certs = appState.getProfile().certifications || [];
  list.innerHTML = certs.map(c => `
    <div class="flex items-center justify-between p-2 mb-2" style="background: var(--bg-card-subtle); border-radius: var(--radius-md); padding: 0.75rem; margin-bottom: 0.5rem; display: flex; justify-content: space-between; align-items: center;">
      <div>
        <div style="font-size: 0.9rem; font-weight: 600;">${c.title}</div>
        <div style="font-size: 0.75rem; color: var(--text-muted);">${c.issuer} • ${c.year}</div>
      </div>
      <button class="btn btn-ghost btn-sm text-danger" onclick="deleteCert('${c.id}')">
        <i class="fa-solid fa-trash" style="color: var(--accent-rose);"></i>
      </button>
    </div>
  `).join('');
}

function addCertification() {
  const title = prompt('Certification Name (e.g. AWS Cloud Practitioner):');
  if (!title) return;
  const issuer = prompt('Issuing Organization (e.g. Amazon Web Services / Coursera):') || 'Self';
  const year = prompt('Year of Completion:') || '2026';

  const profile = appState.getProfile();
  if (!profile.certifications) profile.certifications = [];
  profile.certifications.push({
    id: 'c_' + Date.now(),
    title,
    issuer,
    year
  });

  appState.updateProfile({ certifications: profile.certifications });
  renderCertificationsList();
  showToast('Certification added!', 'success');
}

function deleteCert(cId) {
  const profile = appState.getProfile();
  profile.certifications = (profile.certifications || []).filter(c => c.id !== cId);
  appState.updateProfile({ certifications: profile.certifications });
  renderCertificationsList();
  showToast('Certification removed', 'info');
}

function renderInternshipsList() {
  const list = document.getElementById('profile-internships-list');
  if (!list) return;

  const interns = appState.getProfile().internships || [];
  list.innerHTML = interns.map(i => `
    <div class="card p-3 mb-2" style="background: var(--bg-card-subtle); border-radius: var(--radius-md); padding: 1rem; margin-bottom: 0.75rem;">
      <div class="flex items-center justify-between" style="display: flex; justify-content: space-between;">
        <h4 style="font-size: 0.95rem; font-weight: 700;">${i.role} @ ${i.company}</h4>
        <button class="btn btn-ghost btn-sm text-danger" onclick="deleteInternship('${i.id}')">
          <i class="fa-solid fa-trash" style="color: var(--accent-rose);"></i>
        </button>
      </div>
      <div style="font-size: 0.8rem; color: var(--text-muted); margin: 0.2rem 0;">${i.duration}</div>
      <p style="font-size: 0.85rem; color: var(--text-muted);">${i.desc}</p>
    </div>
  `).join('');
}

function addInternship() {
  const company = prompt('Company Name:');
  if (!company) return;
  const role = prompt('Internship Role (e.g. Software Engineering Intern):') || 'Intern';
  const duration = prompt('Duration (e.g. 3 Months, Summer 2025):') || '2 Months';
  const desc = prompt('Key Responsibilities/Work Done:') || 'Contributed to production code.';

  const profile = appState.getProfile();
  if (!profile.internships) profile.internships = [];
  profile.internships.push({
    id: 'i_' + Date.now(),
    company,
    role,
    duration,
    desc
  });

  appState.updateProfile({ internships: profile.internships });
  renderInternshipsList();
  showToast('Internship experience added!', 'success');
}

function deleteInternship(iId) {
  const profile = appState.getProfile();
  profile.internships = (profile.internships || []).filter(i => i.id !== iId);
  appState.updateProfile({ internships: profile.internships });
  renderInternshipsList();
  showToast('Internship removed', 'info');
}

function handleSaveProfileForm(e) {
  if (e) e.preventDefault();

  const cgpaVal = parseFloat(document.getElementById('profile-cgpa').value) || 0;
  if (cgpaVal < 0 || cgpaVal > 10) {
    showToast('Please enter a valid CGPA between 0.0 and 10.0', 'danger');
    return;
  }

  const updatedProfile = {
    fullName: document.getElementById('profile-fullname').value.trim() || 'Student',
    email: document.getElementById('profile-email').value.trim(),
    phone: document.getElementById('profile-phone').value.trim(),
    college: document.getElementById('profile-college').value.trim(),
    degree: document.getElementById('profile-degree').value.trim(),
    branch: document.getElementById('profile-branch').value.trim(),
    gradYear: document.getElementById('profile-gradyear').value.trim(),
    rollNumber: document.getElementById('profile-roll').value.trim(),
    cgpa: cgpaVal,
    tenthMarks: parseFloat(document.getElementById('profile-tenth').value) || 0,
    twelfthMarks: parseFloat(document.getElementById('profile-twelfth').value) || 0,
    backlogs: parseInt(document.getElementById('profile-backlogs').value) || 0,
    aptitudeScore: parseInt(document.getElementById('profile-aptitude').value) || 0,
    codingRating: parseInt(document.getElementById('profile-coding-rating').value) || 1200
  };

  appState.updateProfile(updatedProfile);
  if (window.authManager) authManager.syncProfileToBackend(updatedProfile);
  renderProfileView();
  showToast('Profile saved & synchronized with backend database! ✨', 'success');
  if (window.renderDashboard) renderDashboard();
}

function resetAllDataToDefault() {
  if (confirm('Are you sure you want to reload the default sample student data? All custom edits will be reset.')) {
    appState.resetToDefault();
    renderProfileView();
    renderDashboard();
    syncPredictionFormWithProfile();
    showToast('Loaded demo student profile (Aarav Patel, B.Tech CSE)!', 'success');
  }
}

// ==========================================================================
// PREDICTION VIEW FUNCTIONS
// ==========================================================================
function syncPredictionFormWithProfile() {
  const profile = appState.getProfile();
  
  // Set slider & input values
  setRangeValue('pred-cgpa', profile.cgpa, 'pred-cgpa-val');
  setRangeValue('pred-aptitude', profile.aptitudeScore, 'pred-aptitude-val');
  setRangeValue('pred-coding', profile.codingRating, 'pred-coding-val');
  
  setVal('pred-projects', (profile.projects || []).length);
  setVal('pred-internships', (profile.internships || []).length);
  setVal('pred-certs', (profile.certifications || []).length);
  setVal('pred-backlogs', profile.backlogs || 0);

  // Update existing prediction display if available
  const existingPred = appState.getPrediction();
  if (existingPred && existingPred.probability) {
    updateGaugeDisplay('pred-gauge-svg', 'pred-gauge-val', existingPred.probability);
    renderPredictionDetails(existingPred);
  }
}

function setRangeValue(sliderId, val, labelId) {
  const slider = document.getElementById(sliderId);
  const label = document.getElementById(labelId);
  if (slider) slider.value = val;
  if (label) label.innerText = val;
}

function handleRangeInput(sliderId, labelId) {
  const slider = document.getElementById(sliderId);
  const label = document.getElementById(labelId);
  if (slider && label) {
    label.innerText = slider.value;
  }
}

function handleRunPrediction(e) {
  if (e) e.preventDefault();

  const cgpa = parseFloat(document.getElementById('pred-cgpa').value) || 7.0;
  const aptitudeScore = parseInt(document.getElementById('pred-aptitude').value) || 70;
  const codingRating = parseInt(document.getElementById('pred-coding').value) || 1400;
  const projectsCount = parseInt(document.getElementById('pred-projects').value) || 0;
  const internshipsCount = parseInt(document.getElementById('pred-internships').value) || 0;
  const certsCount = parseInt(document.getElementById('pred-certs').value) || 0;
  const backlogs = parseInt(document.getElementById('pred-backlogs').value) || 0;

  const profile = appState.getProfile();
  const skillsCount = (profile.skills || []).length;

  const result = calculatePlacementProbability({
    cgpa,
    skillsCount,
    internshipsCount,
    projectsCount,
    certsCount,
    aptitudeScore,
    codingRating,
    backlogs
  });

  // Save to State
  appState.updatePrediction({
    probability: result.probability,
    tier: result.tier,
    tierLabel: result.tierLabel,
    factors: result.factors,
    lastCalculated: new Date().toISOString().split('T')[0]
  });

  // Sync to backend SQLite database if user is authenticated
  if (window.authManager) {
    authManager.syncPredictionToBackend(result);
  }

  // Animate Gauge
  updateGaugeDisplay('pred-gauge-svg', 'pred-gauge-val', result.probability);

  // Render Details & Suggestions
  renderPredictionDetails(result);

  // Trigger celebration confetti if High tier!
  if (result.probability >= 80 && typeof confetti === 'function') {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  }

  showToast(`Prediction calculated: ${result.probability}% Placement Probability (${result.tier} Readiness)!`, 'success');
  if (window.renderDashboard) renderDashboard();
}

function renderPredictionDetails(result) {
  // Tier Status Badge
  const statusElem = document.getElementById('pred-readiness-status');
  if (statusElem) {
    statusElem.className = `readiness-status ${result.tierClass || (result.tier === 'High' ? 'high' : result.tier === 'Medium' ? 'medium' : 'low')}`;
    statusElem.innerHTML = `
      <i class="fa-solid ${result.tier === 'High' ? 'fa-circle-check' : result.tier === 'Medium' ? 'fa-circle-exclamation' : 'fa-triangle-exclamation'}"></i>
      <span>${result.tierLabel || result.tier}</span>
    `;
  }

  // Suggestions List
  const suggList = document.getElementById('pred-suggestions-list');
  if (suggList) {
    const list = result.suggestions || [];
    if (list.length === 0) {
      suggList.innerHTML = `<li class="suggestion-item"><i class="fa-solid fa-circle-check text-success"></i> Exceptional readiness! Maintain coding streaks and mock interview practice.</li>`;
    } else {
      suggList.innerHTML = list.map(s => `
        <li class="suggestion-item">
          <i class="${s.icon}"></i>
          <div>${s.text}</div>
        </li>
      `).join('');
    }
  }

  // Factor breakdown progress bars
  const factors = result.factors || {};
  setBarVal('bar-factor-academics', factors.academics || 80, 'val-factor-academics');
  setBarVal('bar-factor-tech', factors.technicalDSA || 80, 'val-factor-tech');
  setBarVal('bar-factor-projects', factors.projects || 80, 'val-factor-projects');
  setBarVal('bar-factor-internships', factors.internships || 80, 'val-factor-internships');
  setBarVal('bar-factor-aptitude', factors.aptitude || 80, 'val-factor-aptitude');
}

function setBarVal(barId, val, textId) {
  const bar = document.getElementById(barId);
  const txt = document.getElementById(textId);
  if (bar) bar.style.width = `${val}%`;
  if (txt) txt.innerText = `${val}%`;
}

// Modal helper
function closeModal(modalId) {
  const m = document.getElementById(modalId);
  if (m) m.classList.remove('open');
}

// Re-render all view components when account changes
function renderAllAppViews() {
  if (typeof renderProfileView === 'function') renderProfileView();
  if (typeof renderDashboard === 'function') renderDashboard();
  if (typeof syncPredictionFormWithProfile === 'function') syncPredictionFormWithProfile();
  if (typeof renderSkillGapView === 'function') renderSkillGapView();
  if (typeof renderRoadmapView === 'function') renderRoadmapView();
  if (typeof renderCoachView === 'function') renderCoachView();
  if (window.authManager && typeof authManager.updateNavbarAuthUI === 'function') {
    authManager.updateNavbarAuthUI();
  }
}
window.renderAllAppViews = renderAllAppViews;

// Global initialization on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  // Init Theme
  const currentTheme = initTheme();
  const themeIcon = document.getElementById('theme-toggle-icon');
  if (themeIcon) {
    themeIcon.className = currentTheme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  }

  // Initial render of all view modules
  setTimeout(() => {
    renderAllAppViews();
  }, 100);

  // Setup initial view based on window.location.hash
  const initialHash = window.location.hash.replace('#', '') || 'dashboard';
  switchView(initialHash);

  // Listen to hash changes (browser back/forward button)
  window.addEventListener('hashchange', () => {
    const hash = window.location.hash.replace('#', '') || 'dashboard';
    switchView(hash);
  });
});

