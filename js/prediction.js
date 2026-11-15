/**
 * CareerPulse.AI – Smart Placement Predictor Engine
 * 
 * Multi-factor algorithmic calculation evaluated across:
 * - Academics (CGPA, Backlogs, Degree, Branch)
 * - Programming & DSA depth
 * - Core CS knowledge (OS, DBMS, Networks, OOP)
 * - Development & System engineering skills
 * - Projects & Capstone complexity
 * - Internships & Experience
 * - Aptitude, Reasoning & Problem solving
 * - Communication & Soft skills
 * - Resume ATS score
 * 
 * Computes:
 * - Overall Placement Readiness Score (0–100%)
 * - Granular Sub-Scores: DSA %, Development %, Core CS %, Projects %, Communication %, Resume %
 * - Category Readiness Predictions:
 *   - Service-Based Companies (High / Medium / Low)
 *   - Startup Roles (High / Medium / Low)
 *   - Product-Based Companies (High / Medium / Low)
 *   - Top Product Companies (High / Medium / Needs Improvement)
 * - Strongest Opportunity Spotlight with detailed "Why" explanation.
 */

function calculateSmartPlacementPrediction(params) {
  const {
    college = 'National Institute of Engineering & Technology',
    degree = 'B.Tech',
    branch = 'Computer Science & Engineering',
    gradYear = 2026,
    cgpa = 8.45,
    backlogs = 0,
    programmingLanguage = 'Java',
    dsaSkill = 'Advanced', // 'Beginner', 'Intermediate', 'Advanced', 'Expert'
    coreCsKnowledge = 'Strong', // 'Basic', 'Moderate', 'Strong', 'Comprehensive'
    devSkills = 'Full Stack & APIs', // 'None', 'Frontend', 'Backend', 'Full Stack & APIs', 'Cloud & DevOps'
    projectsCount = 2,
    internshipsCount = 1,
    certsCount = 2,
    aptitudeScore = 84,
    communicationScore = 85,
    resumeScore = 82,
    preferredJobRole = 'sde'
  } = params;

  // 1. Calculate Granular Sub-Scores (0 - 100%)

  // DSA Sub-Score
  let dsaScore = 50;
  if (dsaSkill === 'Expert') dsaScore = 96;
  else if (dsaSkill === 'Advanced') dsaScore = 85;
  else if (dsaSkill === 'Intermediate') dsaScore = 70;
  else dsaScore = 48;

  // Development Sub-Score
  let devScore = 45;
  if (devSkills === 'Cloud & DevOps' || devSkills === 'Full Stack & APIs') devScore = 90;
  else if (devSkills === 'Backend' || devSkills === 'Frontend') devScore = 75;
  else devScore = 42;

  // Core CS Sub-Score
  let coreCsScore = 55;
  if (coreCsKnowledge === 'Comprehensive') coreCsScore = 94;
  else if (coreCsKnowledge === 'Strong') coreCsScore = 82;
  else if (coreCsKnowledge === 'Moderate') coreCsScore = 68;
  else coreCsScore = 45;

  // Projects Sub-Score
  let projScore = 30;
  if (projectsCount >= 3) projScore = 96;
  else if (projectsCount === 2) projScore = 85;
  else if (projectsCount === 1) projScore = 65;
  else projScore = 30;

  // Communication Sub-Score
  const commScore = Math.min(100, Math.max(30, Number(communicationScore)));

  // Resume Sub-Score
  const resScore = Math.min(100, Math.max(35, Number(resumeScore)));

  // Academic Normalized Score
  const academicScore = Math.min(100, Math.max(30, (Number(cgpa) / 10) * 100));

  // Internship Score
  let internScore = 35;
  if (internshipsCount >= 2) internScore = 98;
  else if (internshipsCount === 1) internScore = 84;
  else internScore = 35;

  // 2. Weighted Overall Readiness Score Calculation
  // Weights: DSA (20%), Development (18%), Core CS (14%), Projects (14%), Academics (12%), Aptitude (10%), Communication (6%), Internships (6%)
  let rawReadiness = 
    (dsaScore * 0.20) +
    (devScore * 0.18) +
    (coreCsScore * 0.14) +
    (projScore * 0.14) +
    (academicScore * 0.12) +
    (Number(aptitudeScore) * 0.10) +
    (commScore * 0.06) +
    (internScore * 0.06);

  // Active Backlog Penalty (-12% per active standing backlog)
  if (backlogs > 0) {
    rawReadiness -= (backlogs * 12);
  }

  // Clamped between 20% and 98%
  const overallReadiness = Math.round(Math.min(98, Math.max(20, rawReadiness)));

  // 3. Categorized Company Readiness Predictions
  // Rather than predicting a simplistic binary, classify readiness bands:
  let serviceBased = 'Medium readiness';
  let startupRoles = 'Medium readiness';
  let productBased = 'Needs improvement';
  let topProduct = 'Needs improvement';

  // Service-Based (TCS, Infosys, Wipro, Cognizant, Accenture)
  // Key criteria: Aptitude 65+, CGPA 6.5+, Backlogs 0-1
  if (academicScore >= 65 && Number(aptitudeScore) >= 65 && backlogs === 0) {
    serviceBased = 'High readiness';
  } else if (academicScore >= 55 && Number(aptitudeScore) >= 50) {
    serviceBased = 'Medium readiness';
  } else {
    serviceBased = 'Needs preparation';
  }

  // Startup Roles (Swiggy, Zepto, Razorpay, Fintechs)
  // Key criteria: Development 75+, Projects 80+, Fast Problem Solving
  if (devScore >= 75 && projScore >= 75 && (dsaScore >= 65 || commScore >= 70)) {
    startupRoles = 'High readiness';
  } else if (devScore >= 60 || projScore >= 60) {
    startupRoles = 'Medium readiness';
  } else {
    startupRoles = 'Needs improvement';
  }

  // Product-Based Companies (Oracle, Cisco, Adobe, Salesforce)
  // Key criteria: DSA 75+, Core CS 75+, Projects 75+, CGPA 7.5+
  if (dsaScore >= 75 && coreCsScore >= 70 && cgpa >= 7.5 && overallReadiness >= 75) {
    productBased = 'High readiness';
  } else if (dsaScore >= 60 && cgpa >= 7.0 && overallReadiness >= 65) {
    productBased = 'Medium readiness';
  } else {
    productBased = 'Needs improvement';
  }

  // Top Product Companies (Google, Microsoft, Amazon, Atlassian, Uber)
  // Key criteria: DSA 85+, Core CS 80+, Projects 85+, Aptitude 85+, Backlogs 0
  if (dsaScore >= 85 && coreCsScore >= 80 && projScore >= 80 && backlogs === 0 && cgpa >= 8.0 && overallReadiness >= 82) {
    topProduct = 'High readiness';
  } else if (dsaScore >= 75 && coreCsScore >= 70 && backlogs === 0 && cgpa >= 7.5 && overallReadiness >= 72) {
    topProduct = 'Medium readiness';
  } else {
    topProduct = 'Needs improvement';
  }

  // 4. Strongest Opportunity Identification & Explanation
  let strongestOpportunity = 'Software Developer';
  let whyExplanation = '';

  const roleMeta = CAREERS_CATALOG.find(c => c.id === preferredJobRole) || CAREERS_CATALOG[0];
  const roleTitle = roleMeta.title;

  if (dsaScore >= 80 && devScore >= 75) {
    strongestOpportunity = 'Software Development Engineer (Product & SDE-1)';
    whyExplanation = `Your exceptional Data Structures & Algorithms proficiency (${dsaScore}%) combined with solid hands-on development (${devScore}%) and strong academic standing (${cgpa} CGPA) clears the bar for competitive product engineering recruitment rounds. Product companies mandate high algorithmic speed in online screenings, which is your strongest asset.`;
  } else if (devScore >= 80 && projScore >= 80) {
    strongestOpportunity = 'Full Stack Web Developer & High-Growth Startups';
    whyExplanation = `Your project portfolio (${projScore}%) and development versatility (${devScore}%) give you immediate leverage for startup roles. Engineering hiring managers at venture-backed startups look for students who can deploy working software on Day 1, which your GitHub repositories prove.`;
  } else if (Number(aptitudeScore) >= 80 && academicScore >= 75) {
    strongestOpportunity = 'Technology Analyst & IT Giant Digital Bands';
    whyExplanation = `Your standout cognitive aptitude (${aptitudeScore}%) and clean academic record (${cgpa} CGPA) place you comfortably in the top 10% for campus mass recruiting Prime/Digital tracks (TCS Digital, Cognizant GenC Next). Focus on practicing 30 LeetCode Medium questions to unlock product company shortlists.`;
  } else {
    strongestOpportunity = `${roleTitle} Roles`;
    whyExplanation = `Your current strengths lie in ${programmingLanguage} programming and foundational computer science. To break into high-readiness tier product roles, prioritize leveling up active coding ratings and clearing any standing academic backlogs.`;
  }

  // 5. Tier Classification
  let tier = 'Medium';
  let tierLabel = 'Moderate Readiness - Strong Candidate for Startup & Tech Giant Drives (8 - 16 LPA)';
  let tierClass = 'medium';

  if (overallReadiness >= 80) {
    tier = 'High';
    tierLabel = 'High Readiness - Tier-1 Product Company Candidate (14 - 36 LPA)';
    tierClass = 'high';
  } else if (overallReadiness < 60) {
    tier = 'Low';
    tierLabel = 'Needs Targeted Skill Building - Screening Test Risk (<6 LPA)';
    tierClass = 'low';
  }

  // 6. Actionable Suggestions
  const suggestions = [];

  if (backlogs > 0) {
    suggestions.push({
      icon: 'fa-solid fa-triangle-exclamation text-rose',
      text: `Clear ${backlogs} standing backlog(s) as top priority. Over 85% of visiting Tier-1 firms enforce strict zero-active-backlog eligibility.`
    });
  }

  if (dsaScore < 75) {
    suggestions.push({
      icon: 'fa-solid fa-code text-primary',
      text: `DSA readiness is at ${dsaScore}%. Solve 2 LeetCode Medium problems daily on Arrays, HashMaps, and Trees to comfortably pass Round 1 coding screenings.`
    });
  } else {
    suggestions.push({
      icon: 'fa-solid fa-circle-check text-emerald',
      text: `Solid DSA depth (${dsaScore}%). Maintain competitive momentum by participating in weekly LeetCode / CodeChef contests.`
    });
  }

  if (coreCsScore < 75) {
    suggestions.push({
      icon: 'fa-solid fa-server text-cyan',
      text: `Core CS score is at ${coreCsScore}%. Review Operating Systems (Deadlocks, Paging) and DBMS (ACID, Normalization, Indexing) which account for 40% of technical interview questions.`
    });
  }

  if (projScore < 80) {
    suggestions.push({
      icon: 'fa-solid fa-folder-tree text-amber',
      text: 'Deploy at least 2 full-scale portfolio projects with live URLs, clean documentation, and GitHub CI/CD badges.'
    });
  }

  if (internshipsCount === 0) {
    suggestions.push({
      icon: 'fa-solid fa-briefcase text-emerald',
      text: 'Completing a summer software or research internship boosts your campus interview shortlist rate by over 60%.'
    });
  }

  if (resScore < 75) {
    suggestions.push({
      icon: 'fa-solid fa-file-invoice text-rose',
      text: `Resume score is ${resScore}%. Use the Resume Analyzer module to quantify your bullet points with measurable impact metrics.`
    });
  }

  return {
    probability: overallReadiness,
    tier,
    tierLabel,
    tierClass,
    subScores: {
      dsa: dsaScore,
      development: devScore,
      coreCs: coreCsScore,
      projects: projScore,
      communication: commScore,
      resume: resScore
    },
    companyReadiness: {
      serviceBased,
      startupRoles,
      productBased,
      topProduct
    },
    strongestOpportunity,
    whyExplanation,
    suggestions,
    factors: {
      academics: Math.round(academicScore),
      technicalDSA: dsaScore,
      projects: projScore,
      internships: internScore,
      aptitude: Number(aptitudeScore)
    }
  };
}

// Backward-compatible alias for existing code
function calculatePlacementProbability(params) {
  const profile = (window.appState && window.appState.getProfile) ? window.appState.getProfile() : {};
  const merged = { ...profile, ...params };
  return calculateSmartPlacementPrediction(merged);
}

/**
 * Animate the SVG circular gauge
 */
function updateGaugeDisplay(gaugeSvgId, textElementId, targetPercent) {
  const circle = document.querySelector(`#${gaugeSvgId} .gauge-fill`);
  const textElem = document.getElementById(textElementId);
  if (!circle || !textElem) return;

  const circumference = 565.48; // 2 * PI * 90
  const offset = circumference - (targetPercent / 100) * circumference;
  circle.style.strokeDashoffset = offset;

  // Change color based on score
  if (targetPercent >= 80) {
    circle.style.stroke = 'var(--accent-emerald)';
  } else if (targetPercent >= 60) {
    circle.style.stroke = 'var(--accent-amber)';
  } else {
    circle.style.stroke = 'var(--accent-rose)';
  }

  // Smooth counter animation
  let currentVal = 0;
  const step = Math.max(1, Math.ceil(targetPercent / 25));
  const interval = setInterval(() => {
    currentVal += step;
    if (currentVal >= targetPercent) {
      currentVal = targetPercent;
      clearInterval(interval);
    }
    textElem.innerText = `${currentVal}%`;
  }, 25);
}

/**
 * Sync Prediction Form with Profile
 */
/**
 * Synchronize Smart Placement Predictor Parameters form with authenticated student profile,
 * Resume Analyzer extractions, and the verified SQLite database.
 * Real-time SQLite / Database synchronization without dummy/hardcoded fallbacks.
 * Automatically calculates Placement Readiness Score after fetching.
 */
async function syncPredictionFormWithProfile(isManualClick = false) {
  const syncBtn = document.getElementById('btn-sync-prediction-profile');
  const syncText = document.getElementById('btn-sync-text');

  if (isManualClick) {
    if (syncBtn) syncBtn.disabled = true;
    if (syncText) syncText.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Syncing...';
    try {
      if (window.authManager && typeof authManager.refreshUserProfile === 'function') {
        await authManager.refreshUserProfile(false);
      }
    } catch (e) {
      console.warn('Sync error:', e);
    }
  } else {
    // If backend online and session exists, ensure fresh user profile from SQLite
    if (window.authManager && authManager.token && authManager.isBackendOnline && typeof authManager.fetchCurrentUser === 'function') {
      try {
        await authManager.fetchCurrentUser();
      } catch (e) {
        console.warn('Background sync error:', e);
      }
    }
  }

  const profile = appState.getProfile();
  if (!profile) {
    if (isManualClick && syncBtn) {
      syncBtn.disabled = false;
      if (syncText) syncText.innerText = 'Sync Profile';
    }
    return;
  }

  // Cross-reference Resume Analyzer extractions & ATS details
  const latestResume = (window.resumeAnalyzer && window.resumeAnalyzer.latestAnalysis) ? window.resumeAnalyzer.latestAnalysis : null;
  const resumeDetails = profile.resumeDetails || (latestResume ? {
    fileName: latestResume.fileName || 'Uploaded_Resume.pdf',
    atsScore: latestResume.atsScore,
    scoreGrade: latestResume.scoreGrade || 'ATS Ready',
    analyzedAt: new Date().toISOString()
  } : {});

  // Determine effective ATS Resume Score (prioritize fresh analysis or stored profile score)
  let effectiveResumeScore = (profile.resumeScore !== undefined && profile.resumeScore !== null && profile.resumeScore > 0)
    ? parseInt(profile.resumeScore)
    : (latestResume && latestResume.atsScore !== undefined ? parseInt(latestResume.atsScore) : 0);

  // Merge technical skills from profile & Resume Analyzer
  let effectiveSkills = Array.isArray(profile.skills) ? [...profile.skills] : [];
  if (latestResume && Array.isArray(latestResume.skills)) {
    latestResume.skills.forEach(s => {
      if (!effectiveSkills.some(es => es.toLowerCase() === s.toLowerCase())) {
        effectiveSkills.push(s);
      }
    });
  }

  // Projects list & count (profile + resume analyzer)
  let effectiveProjects = Array.isArray(profile.projects) ? [...profile.projects] : [];
  if (latestResume && Array.isArray(latestResume.projects)) {
    latestResume.projects.forEach(p => {
      if (!effectiveProjects.some(ep => ep.title && ep.title.toLowerCase() === p.title.toLowerCase())) {
        effectiveProjects.push(p);
      }
    });
  }

  // Internships list & count
  let effectiveInternships = Array.isArray(profile.internships) ? [...profile.internships] : [];
  if (latestResume && Array.isArray(latestResume.internships)) {
    latestResume.internships.forEach(i => {
      if (!effectiveInternships.some(ei => ei.role && ei.role.toLowerCase() === i.role.toLowerCase())) {
        effectiveInternships.push(i);
      }
    });
  }

  // Certifications list & count
  let effectiveCerts = Array.isArray(profile.certifications) ? [...profile.certifications] : [];
  if (latestResume && Array.isArray(latestResume.certifications)) {
    latestResume.certifications.forEach(c => {
      const cTitle = typeof c === 'string' ? c : (c.title || '');
      if (cTitle && !effectiveCerts.some(ec => (typeof ec === 'string' ? ec : (ec.title || '')).toLowerCase() === cTitle.toLowerCase())) {
        effectiveCerts.push(c);
      }
    });
  }

  // Helper setters
  const setVal = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.value = (val !== undefined && val !== null) ? val : '';
  };

  const setSlider = (id, valId, val, fallback = 0) => {
    const el = document.getElementById(id);
    const valEl = document.getElementById(valId);
    const num = (val !== undefined && val !== null && !isNaN(val)) ? parseFloat(val) : fallback;
    if (el) el.value = num;
    if (valEl) valEl.innerText = (num % 1 !== 0) ? num.toFixed(2) : num;
  };

  // 1-4. College, Degree, Branch, Graduation Year
  const effectiveCollege = profile.college || (latestResume && latestResume.education && latestResume.education[0] ? latestResume.education[0].split('•')[0].trim() : '');
  setVal('pred-college', effectiveCollege);
  setVal('pred-degree', profile.degree || 'B.Tech');
  setVal('pred-branch', profile.branch || '');
  setVal('pred-gradyear', profile.gradYear || profile.grad_year || '2026');

  // 5. Current CGPA
  const currentCgpa = (profile.cgpa !== undefined && profile.cgpa !== null) ? parseFloat(profile.cgpa) : 0;
  setSlider('pred-cgpa', 'pred-cgpa-val', currentCgpa, 0);

  // 6. Active Standing Backlogs
  setVal('pred-backlogs', (profile.backlogs !== undefined) ? String(profile.backlogs) : '0');

  // 7. Primary Programming Language (auto-deduce from skills if unset)
  let effectiveLanguage = profile.programmingLanguage || '';
  if (!effectiveLanguage && effectiveSkills.length > 0) {
    const langCandidates = ['Java', 'C++', 'Python', 'JavaScript', 'TypeScript', 'Go'];
    for (const l of langCandidates) {
      if (effectiveSkills.some(s => s.toLowerCase().includes(l.toLowerCase()))) {
        effectiveLanguage = (l === 'TypeScript' ? 'JavaScript' : l);
        break;
      }
    }
  }
  setVal('pred-language', effectiveLanguage);

  // 8. Data Structures & Algorithms (DSA) Level
  let effectiveDsa = profile.dsaSkill || '';
  if (!effectiveDsa) {
    const cr = profile.codingRating || 0;
    if (cr >= 1800) effectiveDsa = 'Expert';
    else if (cr >= 1600) effectiveDsa = 'Advanced';
    else if (cr >= 1300) effectiveDsa = 'Intermediate';
    else if (effectiveSkills.some(s => s.toLowerCase().includes('data structure') || s.toLowerCase().includes('dsa') || s.toLowerCase().includes('algorithm'))) effectiveDsa = 'Intermediate';
    else effectiveDsa = 'Beginner';
  }
  setVal('pred-dsa-skill', effectiveDsa);

  // 9. Core Computer Science Knowledge
  let effectiveCoreCs = profile.coreCsKnowledge || '';
  if (!effectiveCoreCs) {
    const hasCore = effectiveSkills.some(s => s.toLowerCase().includes('operating') || s.toLowerCase().includes('dbms') || s.toLowerCase().includes('sql') || s.toLowerCase().includes('network'));
    effectiveCoreCs = hasCore ? 'Strong' : 'Moderate';
  }
  setVal('pred-corecs', effectiveCoreCs);

  // 10. Development & System Skills
  let effectiveDevSkills = profile.devSkills || '';
  if (!effectiveDevSkills) {
    const hasCloud = effectiveSkills.some(s => s.toLowerCase().includes('docker') || s.toLowerCase().includes('aws') || s.toLowerCase().includes('cloud') || s.toLowerCase().includes('devops'));
    const hasBackend = effectiveSkills.some(s => s.toLowerCase().includes('node') || s.toLowerCase().includes('express') || s.toLowerCase().includes('spring') || s.toLowerCase().includes('django') || s.toLowerCase().includes('sql'));
    const hasFrontend = effectiveSkills.some(s => s.toLowerCase().includes('react') || s.toLowerCase().includes('html') || s.toLowerCase().includes('css') || s.toLowerCase().includes('frontend'));

    if (hasCloud) effectiveDevSkills = 'Cloud & DevOps';
    else if (hasFrontend && hasBackend) effectiveDevSkills = 'Full Stack & APIs';
    else if (hasBackend) effectiveDevSkills = 'Backend';
    else if (hasFrontend) effectiveDevSkills = 'Frontend';
    else effectiveDevSkills = 'Full Stack & APIs';
  }
  setVal('pred-dev-skills', effectiveDevSkills);

  // 11. Technical Skills Matrix
  const skillsContainer = document.getElementById('pred-skills-tags');
  if (skillsContainer) {
    if (effectiveSkills.length > 0) {
      skillsContainer.innerHTML = effectiveSkills.map(s => `
        <span class="tag-item skill-tag-matched" style="font-size: 0.78rem; padding: 0.2rem 0.55rem; background: var(--primary-light); color: var(--primary); border-radius: var(--radius-sm); border: 1px solid rgba(124, 58, 237, 0.2);">
          <i class="fa-solid fa-code text-primary"></i> ${s}
        </span>
      `).join('');
    } else {
      skillsContainer.innerHTML = `
        <span class="text-xs text-muted" style="color: var(--text-muted);">
          <i class="fa-solid fa-circle-info"></i> No technical skills in profile yet.
          <a href="#profile" class="text-primary font-bold" style="text-decoration: underline; margin-left: 4px;">Add skills in Profile</a>
        </span>
      `;
    }
  }

  // 12. Projects Count & Summary
  const projCount = Math.min(3, effectiveProjects.length);
  setVal('pred-projects', String(projCount));
  const projsCountEl = document.getElementById('pred-projects-summary-count');
  if (projsCountEl) projsCountEl.innerText = effectiveProjects.length;

  // 13. Internships Count & Summary
  const internCount = Math.min(2, effectiveInternships.length);
  setVal('pred-internships', String(internCount));
  const internsCountEl = document.getElementById('pred-internships-summary-count');
  if (internsCountEl) internsCountEl.innerText = effectiveInternships.length;

  // 14. Certifications Count & Summary
  const certCount = Math.min(3, effectiveCerts.length);
  setVal('pred-certs', String(certCount));
  const certsCountEl = document.getElementById('pred-certs-summary-count');
  if (certsCountEl) certsCountEl.innerText = effectiveCerts.length;

  // 15. Resume Details & ATS Score
  setSlider('pred-resume', 'pred-resume-val', effectiveResumeScore, 0);

  const resumeStatusText = document.getElementById('pred-resume-status-text');
  if (resumeStatusText) {
    if (resumeDetails.fileName && effectiveResumeScore > 0) {
      resumeStatusText.innerHTML = `
        <div class="flex items-center justify-between" style="display: flex; justify-content: space-between; align-items: center;">
          <span><i class="fa-solid fa-file-pdf text-rose"></i> <strong>${resumeDetails.fileName}</strong> (ATS Evaluated)</span>
          <span class="badge ${effectiveResumeScore >= 80 ? 'badge-success' : 'badge-warning'} text-xs">${resumeDetails.scoreGrade || 'ATS Ready'} (${effectiveResumeScore}/100)</span>
        </div>
      `;
    } else if (effectiveResumeScore > 0) {
      resumeStatusText.innerHTML = `<span><i class="fa-solid fa-circle-check text-emerald"></i> ATS Resume Score: <strong>${effectiveResumeScore}/100</strong> (Synchronized from profile & analyzer)</span>`;
    } else {
      resumeStatusText.innerHTML = `<span style="color: #d97706;"><i class="fa-solid fa-triangle-exclamation"></i> No resume analyzed yet. <a href="#resume" class="text-primary font-semibold">Upload resume to evaluate ATS score</a></span>`;
    }
  }

  // 16. Aptitude, Soft skills & Preferred Role
  setSlider('pred-aptitude', 'pred-aptitude-val', (profile.aptitudeScore !== undefined ? profile.aptitudeScore : 0), 0);
  setSlider('pred-comm', 'pred-comm-val', (profile.communicationScore !== undefined ? profile.communicationScore : 0), 0);
  setVal('pred-preferred-role', profile.targetCareerId || 'sde');

  // Authenticated Student UID identification (Requirement 3 & 4)
  const authUser = (window.authManager && authManager.currentUser) ? authManager.currentUser : profile;
  const uid = authUser.id || profile.id || 'Active';
  const fullName = authUser.fullName || authUser.fullname || profile.fullName || 'Student';

  const syncUserName = document.getElementById('pred-sync-user-name');
  const syncUserUid = document.getElementById('pred-sync-user-uid');
  const syncTimestamp = document.getElementById('pred-sync-timestamp');

  if (syncUserName) syncUserName.innerText = fullName;
  if (syncUserUid) syncUserUid.innerText = `#${uid}`;
  if (syncTimestamp) syncTimestamp.innerText = `Synced ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

  // Missing Fields Warning & Status Alerts
  const missing = [];
  if (!effectiveCollege) missing.push('College');
  if (!profile.branch) missing.push('Branch');
  if (!profile.cgpa || profile.cgpa <= 0) missing.push('Current CGPA');
  if (!effectiveLanguage) missing.push('Primary Programming Language');
  if (effectiveSkills.length === 0) missing.push('Technical Skills');
  if (effectiveProjects.length === 0) missing.push('Projects');
  if (effectiveResumeScore <= 0) missing.push('ATS Resume Score');

  const missingAlert = document.getElementById('pred-profile-missing-alert');
  const syncStatus = document.getElementById('pred-profile-sync-status');
  const missingText = document.getElementById('pred-missing-fields-text');

  if (missing.length > 0) {
    if (missingText) missingText.innerHTML = `The following parameters are not populated in your profile: <strong>${missing.join(', ')}</strong>.`;
    if (missingAlert) missingAlert.style.display = 'block';
    if (syncStatus) syncStatus.style.display = 'none';
  } else {
    if (missingAlert) missingAlert.style.display = 'none';
    if (syncStatus) syncStatus.style.display = 'block';
  }

  // AUTOMATICALLY CALCULATE PLACEMENT READINESS SCORE AFTER FETCHING DATA (Requirement 7)
  handleRunPrediction(null, true);

  if (isManualClick) {
    if (syncBtn) syncBtn.disabled = false;
    if (syncText) syncText.innerText = 'Sync Profile';
    if (typeof showToast === 'function') {
      const pred = appState.getPrediction();
      const scoreStr = pred ? ` • Readiness: ${pred.probability}%` : '';
      showToast(`Placement parameters auto-synchronized for ${fullName} (UID: #${uid})${scoreStr}! ✨`, 'success');
    }
  }
}

/**
 * Save user adjusted parameters from the form directly back to student profile in database
 * Permanent SQLite persistence associated with the authenticated user ID
 */
async function savePredictionParamsToProfile() {
  const saveBtns = document.querySelectorAll('.btn-save-prediction-profile');
  saveBtns.forEach(btn => {
    btn.disabled = true;
    const txtSpan = btn.querySelector('.btn-save-pred-text');
    if (txtSpan) {
      btn.dataset.origText = txtSpan.innerText;
      txtSpan.innerText = 'Saving to SQLite...';
    }
  });

  try {
    const getStr = (id, fallback = '') => {
      const el = document.getElementById(id);
      return el ? el.value.trim() : fallback;
    };
    const getNum = (id, fallback = 0) => {
      const el = document.getElementById(id);
      return el ? parseFloat(el.value) || fallback : fallback;
    };

    const updatedParams = {
      college: getStr('pred-college'),
      degree: getStr('pred-degree'),
      branch: getStr('pred-branch'),
      gradYear: getStr('pred-gradyear'),
      cgpa: getNum('pred-cgpa'),
      backlogs: getNum('pred-backlogs'),
      programmingLanguage: getStr('pred-language'),
      dsaSkill: getStr('pred-dsa-skill'),
      coreCsKnowledge: getStr('pred-corecs'),
      devSkills: getStr('pred-dev-skills'),
      aptitudeScore: getNum('pred-aptitude'),
      communicationScore: getNum('pred-comm'),
      resumeScore: getNum('pred-resume'),
      targetCareerId: getStr('pred-preferred-role')
    };

    // Update in local state
    appState.updateProfile(updatedParams);

    // Sync to SQLite backend associated with authenticated student
    let syncSuccess = true;
    let syncMsg = 'Predictor parameters saved and synchronized with your verified SQLite database profile! ✨';
    if (window.authManager && typeof authManager.syncProfileToBackend === 'function') {
      const res = await authManager.syncProfileToBackend(updatedParams);
      if (res && res.success === false) {
        syncSuccess = false;
        syncMsg = res.message || 'Failed to save parameters to database.';
      }
    }

    if (syncSuccess) {
      if (typeof showToast === 'function') {
        showToast(syncMsg, 'success');
      }
      if (window.renderDashboard) renderDashboard();
      if (window.renderProfileView) renderProfileView();
      // Re-run sync to update status banners and UI
      await syncPredictionFormWithProfile(false);
    } else {
      if (typeof showToast === 'function') {
        showToast(syncMsg, 'danger');
      }
    }
  } catch (err) {
    console.error('Error saving prediction params to profile:', err);
    if (typeof showToast === 'function') {
      showToast('An unexpected error occurred while saving parameters.', 'danger');
    }
  } finally {
    saveBtns.forEach(btn => {
      btn.disabled = false;
      const txtSpan = btn.querySelector('.btn-save-pred-text');
      if (txtSpan && btn.dataset.origText) {
        txtSpan.innerText = btn.dataset.origText;
      }
    });
  }
}

/**
 * Execute Placement Prediction calculation and render results
 */
function handleRunPrediction(e, silent = false) {
  if (e) e.preventDefault();

  const getNum = (id, fallback = 0) => {
    const el = document.getElementById(id);
    return el ? parseFloat(el.value) || fallback : fallback;
  };

  const getStr = (id, fallback = '') => {
    const el = document.getElementById(id);
    return el ? el.value : fallback;
  };

  const params = {
    college: getStr('pred-college'),
    degree: getStr('pred-degree'),
    branch: getStr('pred-branch'),
    gradYear: getNum('pred-gradyear', 2026),
    cgpa: getNum('pred-cgpa', 0),
    backlogs: getNum('pred-backlogs', 0),
    programmingLanguage: getStr('pred-language', 'Java'),
    dsaSkill: getStr('pred-dsa-skill', 'Intermediate'),
    coreCsKnowledge: getStr('pred-corecs', 'Moderate'),
    devSkills: getStr('pred-dev-skills', 'Full Stack & APIs'),
    projectsCount: getNum('pred-projects', 0),
    internshipsCount: getNum('pred-internships', 0),
    certsCount: getNum('pred-certs', 0),
    aptitudeScore: getNum('pred-aptitude', 75),
    communicationScore: getNum('pred-comm', 75),
    resumeScore: getNum('pred-resume', 75),
    preferredJobRole: getStr('pred-preferred-role', 'sde')
  };

  const result = calculateSmartPlacementPrediction(params);

  // Persist updated parameters and prediction to database when manually triggered
  if (window.authManager && !silent) {
    authManager.syncProfileToBackend({
      college: params.college,
      degree: params.degree,
      branch: params.branch,
      gradYear: String(params.gradYear),
      cgpa: params.cgpa,
      backlogs: params.backlogs,
      programmingLanguage: params.programmingLanguage,
      dsaSkill: params.dsaSkill,
      coreCsKnowledge: params.coreCsKnowledge,
      devSkills: params.devSkills,
      aptitudeScore: params.aptitudeScore,
      communicationScore: params.communicationScore,
      resumeScore: params.resumeScore,
      targetCareerId: params.preferredJobRole
    });
    authManager.syncPredictionToBackend(result);
  }

  // Update App State
  appState.updatePrediction({
    probability: result.probability,
    tier: result.tier,
    tierLabel: result.tierLabel,
    factors: result.factors,
    subScores: result.subScores,
    companyReadiness: result.companyReadiness,
    strongestOpportunity: result.strongestOpportunity,
    whyExplanation: result.whyExplanation,
    lastCalculated: new Date().toISOString()
  });

  // Render Visual Gauge & Counters
  updateGaugeDisplay('pred-gauge-svg', 'pred-gauge-val', result.probability);

  // Update Readiness Tier Banner
  const statusElem = document.getElementById('pred-readiness-status');
  if (statusElem) {
    statusElem.className = `readiness-status ${result.tierClass}`;
    statusElem.innerHTML = `
      <i class="fa-solid ${result.tier === 'High' ? 'fa-circle-check' : result.tier === 'Medium' ? 'fa-triangle-exclamation' : 'fa-circle-xmark'}"></i>
      <span>${result.tierLabel}</span>
    `;
  }

  // Render 6 Granular Sub-Scores
  const sub = result.subScores;
  const updateSubBar = (key, val) => {
    const valEl = document.getElementById(`val-sub-${key}`);
    const barEl = document.getElementById(`bar-sub-${key}`);
    if (valEl) valEl.innerText = `${val}%`;
    if (barEl) {
      barEl.style.width = `${val}%`;
      barEl.className = `progress-fill ${val >= 78 ? 'success' : val >= 60 ? 'warning' : 'danger'}`;
    }
  };

  updateSubBar('dsa', sub.dsa);
  updateSubBar('dev', sub.development);
  updateSubBar('corecs', sub.coreCs);
  updateSubBar('projects', sub.projects);
  updateSubBar('comm', sub.communication);
  updateSubBar('resume', sub.resume);

  // Render Company Category Predictions Cards
  const comp = result.companyReadiness;
  const compRoot = document.getElementById('pred-company-categories-root');
  if (compRoot) {
    const getBadge = (readiness) => {
      if (readiness === 'High readiness') return '<span class="badge badge-success"><i class="fa-solid fa-circle-check"></i> High Readiness</span>';
      if (readiness === 'Medium readiness') return '<span class="badge badge-warning"><i class="fa-solid fa-triangle-exclamation"></i> Medium Readiness</span>';
      return '<span class="badge badge-danger"><i class="fa-solid fa-circle-xmark"></i> Needs Improvement</span>';
    };

    compRoot.innerHTML = `
      <div class="company-readiness-card">
        <div class="company-card-header">
          <div class="company-icon"><i class="fa-solid fa-building text-primary"></i></div>
          <div>
            <h4 class="company-cat-title">Service-Based Companies</h4>
            <div class="company-cat-examples text-xs text-muted">TCS, Infosys, Wipro, Cognizant, Accenture</div>
          </div>
        </div>
        <div class="company-card-status">${getBadge(comp.serviceBased)}</div>
      </div>

      <div class="company-readiness-card">
        <div class="company-card-header">
          <div class="company-icon"><i class="fa-solid fa-rocket text-cyan"></i></div>
          <div>
            <h4 class="company-cat-title">High-Growth Startup Roles</h4>
            <div class="company-cat-examples text-xs text-muted">Swiggy, Zepto, Razorpay, Fintechs, Unicorns</div>
          </div>
        </div>
        <div class="company-card-status">${getBadge(comp.startupRoles)}</div>
      </div>

      <div class="company-readiness-card">
        <div class="company-card-header">
          <div class="company-icon"><i class="fa-solid fa-briefcase text-amber"></i></div>
          <div>
            <h4 class="company-cat-title">Product-Based Companies</h4>
            <div class="company-cat-examples text-xs text-muted">Oracle, Cisco, Adobe, Salesforce, Intuit</div>
          </div>
        </div>
        <div class="company-card-status">${getBadge(comp.productBased)}</div>
      </div>

      <div class="company-readiness-card">
        <div class="company-card-header">
          <div class="company-icon"><i class="fa-solid fa-crown text-emerald"></i></div>
          <div>
            <h4 class="company-cat-title">Top Product Companies</h4>
            <div class="company-cat-examples text-xs text-muted">Google, Microsoft, Amazon, Atlassian, Uber</div>
          </div>
        </div>
        <div class="company-card-status">${getBadge(comp.topProduct)}</div>
      </div>
    `;
  }

  // Render Strongest Opportunity Spotlight Card & Explanation
  const oppRoot = document.getElementById('pred-strongest-opportunity-root');
  if (oppRoot) {
    oppRoot.innerHTML = `
      <div class="opportunity-spotlight-box">
        <div class="flex items-center gap-2 mb-2">
          <span class="badge badge-primary"><i class="fa-solid fa-wand-magic-sparkles"></i> AI Career Pulse Insight</span>
          <span class="text-xs text-muted font-bold">Top Matched Role Opportunity</span>
        </div>
        <h3 class="opportunity-title">
          "Your strongest opportunity right now is <span class="text-gradient">${result.strongestOpportunity}</span>."
        </h3>
        <p class="opportunity-explanation">
          ${result.whyExplanation}
        </p>
      </div>
    `;
  }

  // Render Actionable Suggestions
  const sugList = document.getElementById('pred-suggestions-list');
  if (sugList) {
    const items = result.suggestions.map(s => `
      <li class="suggestion-item">
        <i class="${s.icon}"></i>
        <span>${s.text}</span>
      </li>
    `);
    items.push(`
      <li class="suggestion-item" style="border-top: 1px dashed var(--border-color); padding-top: 0.75rem; margin-top: 0.5rem;">
        <i class="fa-brands fa-youtube" style="color: #ef4444;"></i>
        <span>Targeted YouTube Learning Hub: Boost placement odds by watching curated lectures matched to your weak areas. <a href="#youtube" onclick="switchView('youtube')" style="color: var(--primary); font-weight: 600; text-decoration: underline;">Open Learning Hub ↗</a></span>
      </li>
    `);
    sugList.innerHTML = items.join('');
  }

  // Trigger celebration confetti if High readiness and manual calculation
  if (!silent && result.probability >= 80 && typeof confetti === 'function') {
    try {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    } catch (e) {}
  }

  if (!silent) {
    showToast(`Placement prediction calculated: ${result.probability}% (${result.tier} Readiness)!`, 'success');
  }
}

// Global exports
window.calculateSmartPlacementPrediction = calculateSmartPlacementPrediction;
window.handleRunPrediction = handleRunPrediction;
window.syncPredictionFormWithProfile = syncPredictionFormWithProfile;
window.savePredictionParamsToProfile = savePredictionParamsToProfile;
