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
function syncPredictionFormWithProfile() {
  const profile = appState.getProfile();
  if (!profile) return;

  const setVal = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.value = val;
  };

  const setSlider = (id, valId, val) => {
    const el = document.getElementById(id);
    const valEl = document.getElementById(valId);
    if (el) el.value = val;
    if (valEl) valEl.innerText = val;
  };

  // Basic inputs
  setVal('pred-college', profile.college || 'National Institute of Engineering & Technology');
  setVal('pred-degree', profile.degree || 'B.Tech');
  setVal('pred-branch', profile.branch || 'Computer Science & Engineering');
  setVal('pred-gradyear', profile.gradYear || '2026');
  setSlider('pred-cgpa', 'pred-cgpa-val', profile.cgpa || 8.45);
  setVal('pred-backlogs', profile.backlogs || 0);

  // Technical & Skill inputs
  setVal('pred-language', profile.programmingLanguage || 'Java');
  setVal('pred-dsa-skill', profile.dsaSkill || 'Advanced');
  setVal('pred-corecs', profile.coreCsKnowledge || 'Strong');
  setVal('pred-dev-skills', profile.devSkills || 'Full Stack & APIs');
  setVal('pred-projects', Math.min(3, (profile.projects || []).length || 2));
  setVal('pred-internships', Math.min(2, (profile.internships || []).length || 1));
  setVal('pred-certs', Math.min(3, (profile.certifications || []).length || 2));
  
  // Aptitude, Soft skills & ATS Resume scores
  setSlider('pred-aptitude', 'pred-aptitude-val', profile.aptitudeScore || 84);
  setSlider('pred-coding', 'pred-coding-val', profile.codingRating || 1680);
  setSlider('pred-comm', 'pred-comm-val', profile.communicationScore || 85);
  setSlider('pred-resume', 'pred-resume-val', profile.resumeScore || 82);
  setVal('pred-preferred-role', profile.targetCareerId || 'sde');

  showToast('Scoring parameters synchronized with your active student profile.', 'info');
}

/**
 * Execute Placement Prediction calculation and render results
 */
function handleRunPrediction(e) {
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
    college: getStr('pred-college', 'National Institute of Engineering & Technology'),
    degree: getStr('pred-degree', 'B.Tech'),
    branch: getStr('pred-branch', 'Computer Science & Engineering'),
    gradYear: getNum('pred-gradyear', 2026),
    cgpa: getNum('pred-cgpa', 8.45),
    backlogs: getNum('pred-backlogs', 0),
    programmingLanguage: getStr('pred-language', 'Java'),
    dsaSkill: getStr('pred-dsa-skill', 'Advanced'),
    coreCsKnowledge: getStr('pred-corecs', 'Strong'),
    devSkills: getStr('pred-dev-skills', 'Full Stack & APIs'),
    projectsCount: getNum('pred-projects', 2),
    internshipsCount: getNum('pred-internships', 1),
    certsCount: getNum('pred-certs', 2),
    aptitudeScore: getNum('pred-aptitude', 84),
    communicationScore: getNum('pred-comm', 85),
    resumeScore: getNum('pred-resume', 82),
    preferredJobRole: getStr('pred-preferred-role', 'sde')
  };

  const result = calculateSmartPlacementPrediction(params);

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
    sugList.innerHTML = result.suggestions.map(s => `
      <li class="suggestion-item">
        <i class="${s.icon}"></i>
        <span>${s.text}</span>
      </li>
    `).join('');
  }

  // Trigger celebration confetti if High readiness
  if (result.probability >= 80 && typeof confetti === 'function') {
    try {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    } catch (e) {}
  }

  showToast(`Placement prediction calculated: ${result.probability}% (${result.tier} Readiness)!`, 'success');
}

// Global exports
window.calculateSmartPlacementPrediction = calculateSmartPlacementPrediction;
window.handleRunPrediction = handleRunPrediction;
window.syncPredictionFormWithProfile = syncPredictionFormWithProfile;
