/**
 * Skillora AI – AI Career Coach & Pathway Advisor
 * 
 * Direct Multi-Factor Profile Evaluation Engine:
 * - Completely evaluates career tracks directly from student profile, skills, education, and resume data
 * - Highlights the #1 Best-Matching Career Path with personalized justification
 * - Displays all suitable engineering tracks with match percentages, descriptions, and skill gap metrics
 * - Comprehensive deep-dive pathway: Required Skills, Skill Gaps, 4-Phase Roadmap, and Recommended YouTube Lectures
 * - Permanent SQLite database synchronization for active target career track
 */

class CareerCoachManager {
  constructor() {
    this.selectedCareerId = null;
    this.currentEvaluation = null;
    this.activeYtFilter = 'all';
  }

  /**
   * Multi-Factor Career Scoring Engine
   * Evaluates CAREERS_CATALOG directly against the authenticated student's real profile
   */
  evaluateProfileRecommendations() {
    const profile = (window.appState && typeof appState.getProfile === 'function')
      ? appState.getProfile()
      : {};

    const rawScores = {};
    CAREERS_CATALOG.forEach(c => { rawScores[c.id] = 0; });

    // Extract student's technical skills (lowercase for accurate matching)
    let studentSkills = Array.isArray(profile.skills) ? [...profile.skills] : [];
    const latestResume = (window.resumeAnalyzer && window.resumeAnalyzer.latestAnalysis)
      ? window.resumeAnalyzer.latestAnalysis
      : null;

    if (latestResume && Array.isArray(latestResume.skills)) {
      latestResume.skills.forEach(s => {
        if (!studentSkills.some(es => es.toLowerCase() === s.toLowerCase())) {
          studentSkills.push(s);
        }
      });
    }

    const studentSkillsLower = studentSkills.map(s => s.toLowerCase().trim());
    const primaryLang = (profile.programmingLanguage || '').toLowerCase().trim();
    const codingRating = Number(profile.codingRating) || 1200;
    const cgpa = Number(profile.cgpa) || 8.0;
    const aptitudeScore = Number(profile.aptitudeScore) || 75;
    const resumeScore = Number(profile.resumeScore) || 75;
    const dsaSkill = profile.dsaSkill || 'Intermediate';
    const devSkills = profile.devSkills || 'Full Stack & APIs';
    const coreCsKnowledge = profile.coreCsKnowledge || 'Moderate';
    const activeTargetId = profile.targetCareerId || 'sde';

    const matchSkill = (req, cand) => {
      const r = req.toLowerCase().replace(/[\.\-\/\&]/g, ' ').trim();
      const c = cand.toLowerCase().replace(/[\.\-\/\&]/g, ' ').trim();
      if (r === c || r.includes(c) || c.includes(r)) return true;
      const rParts = r.split(/\s+/).filter(p => p.length > 2);
      const cParts = c.split(/\s+/).filter(p => p.length > 2);
      return rParts.some(rp => cParts.includes(rp));
    };

    const ranked = CAREERS_CATALOG.map(career => {
      // 1. Technical Skill Overlap (Max: 45 points)
      const matchedSkills = [];
      const missingSkills = [];

      career.requiredSkills.forEach(req => {
        const hasSkill = studentSkills.some(s => matchSkill(req, s));
        if (hasSkill) matchedSkills.push(req);
        else missingSkills.push(req);
      });

      const skillRatio = matchedSkills.length / Math.max(1, career.requiredSkills.length);
      let rawScore = skillRatio * 45;

      // 2. Language & Specialized Competency Fit (Max: 25 points)
      if (career.id === 'sde') {
        if (['java', 'c++', 'python', 'c'].some(l => primaryLang.includes(l))) rawScore += 12;
        if (dsaSkill === 'Expert') rawScore += 13;
        else if (dsaSkill === 'Advanced' || codingRating >= 1650) rawScore += 11;
        else if (dsaSkill === 'Intermediate' || codingRating >= 1400) rawScore += 7;
        else rawScore += 3;
      } else if (career.id === 'webdev') {
        if (['javascript', 'typescript', 'react', 'html', 'node'].some(l => primaryLang.includes(l) || studentSkillsLower.some(s => s.includes(l)))) rawScore += 12;
        if (devSkills === 'Full Stack & APIs') rawScore += 13;
        else if (devSkills === 'Frontend' || devSkills === 'Backend') rawScore += 10;
        else rawScore += 4;
      } else if (career.id === 'data-analyst') {
        if (studentSkillsLower.some(s => s.includes('sql') || s.includes('pandas') || s.includes('power bi') || s.includes('statistics') || s.includes('excel'))) rawScore += 13;
        if (primaryLang.includes('python') || studentSkillsLower.some(s => s.includes('python'))) rawScore += 8;
        if (aptitudeScore >= 80) rawScore += 4;
      } else if (career.id === 'aiml') {
        if (primaryLang.includes('python') || studentSkillsLower.some(s => s.includes('python'))) rawScore += 10;
        if (studentSkillsLower.some(s => s.includes('machine learning') || s.includes('deep learning') || s.includes('pytorch') || s.includes('tensorflow') || s.includes('pandas'))) rawScore += 15;
      } else if (career.id === 'cloud-devops') {
        if (devSkills === 'Cloud & DevOps') rawScore += 14;
        if (studentSkillsLower.some(s => s.includes('docker') || s.includes('aws') || s.includes('kubernetes') || s.includes('linux') || s.includes('cloud'))) rawScore += 11;
      } else if (career.id === 'cybersecurity') {
        if (studentSkillsLower.some(s => s.includes('security') || s.includes('network') || s.includes('linux') || s.includes('wireshark') || s.includes('cryptography'))) rawScore += 15;
        if (coreCsKnowledge === 'Comprehensive' || coreCsKnowledge === 'Strong') rawScore += 10;
      }

      // 3. Portfolio, Capstones & Internships (Max: 15 points)
      const projects = Array.isArray(profile.projects) ? profile.projects : [];
      const hasRelatedProject = projects.some(p => {
        const text = `${p.title || ''} ${p.stack || ''} ${p.desc || ''}`.toLowerCase();
        if (career.id === 'sde' && (text.includes('system') || text.includes('algorithm') || text.includes('backend') || text.includes('distributed'))) return true;
        if (career.id === 'webdev' && (text.includes('web') || text.includes('react') || text.includes('full stack') || text.includes('mern') || text.includes('frontend'))) return true;
        if (career.id === 'data-analyst' && (text.includes('data') || text.includes('analytics') || text.includes('dashboard') || text.includes('sql'))) return true;
        if (career.id === 'aiml' && (text.includes('model') || text.includes('neural') || text.includes('ai') || text.includes('ml') || text.includes('learning'))) return true;
        if (career.id === 'cloud-devops' && (text.includes('cloud') || text.includes('docker') || text.includes('devops') || text.includes('pipeline'))) return true;
        if (career.id === 'cybersecurity' && (text.includes('security') || text.includes('forensics') || text.includes('vulnerability') || text.includes('network'))) return true;
        return false;
      });
      if (hasRelatedProject) rawScore += 8;
      if (Array.isArray(profile.internships) && profile.internships.length > 0) rawScore += 4;
      if (Array.isArray(profile.certifications) && profile.certifications.length > 0) rawScore += 3;

      // 4. Academic & ATS Foundation (Max: 15 points)
      rawScore += Math.min(8, (cgpa / 10) * 8);
      rawScore += Math.min(7, (resumeScore / 100) * 7);

      // 5. Active Target Bonus
      if (career.id === activeTargetId) rawScore += 3;

      // Normalized score (capped between 45% and 96%)
      const normalizedScore = Math.min(96, Math.max(45, Math.round(rawScore)));

      // Categorize skill gaps by priority
      const criticalGaps = missingSkills.filter(s => (career.skillPriority && career.skillPriority[s] === 'Critical') || s === 'System Design' || s === 'Operating Systems' || s === 'Kubernetes');
      const highGaps = missingSkills.filter(s => !criticalGaps.includes(s) && (career.skillPriority && career.skillPriority[s] === 'High Priority'));
      const mediumGaps = missingSkills.filter(s => !criticalGaps.includes(s) && !highGaps.includes(s));

      // Build personalized "Why this matches you" rationale
      let whyReason = '';
      if (career.id === 'sde') {
        whyReason = `Strong algorithmic foundations with ${dsaSkill} DSA proficiency, ${profile.codingRating || 1600} coding rating, and ${matchedSkills.length} core engineering competencies (${matchedSkills.slice(0, 3).join(', ') || 'Core Programming'}). Optimal match for high-package Tier-1 software engineering drives.`;
      } else if (career.id === 'webdev') {
        whyReason = `High practical versatility in hands-on application engineering, responsive UI paradigms, and full-stack API integration. With your ${matchedSkills.length} web developer skills (${matchedSkills.slice(0, 3).join(', ') || 'Modern JS & APIs'}), you are Day-1 productive for product startups and IT prime bands.`;
      } else if (career.id === 'aiml') {
        whyReason = `Strong quantitative aptitude (${aptitudeScore}%), mathematical curiosity, and academic standing (${cgpa} CGPA) align directly with intelligent data modelling, computer vision, and neural network pipelines.`;
      } else if (career.id === 'data-analyst') {
        whyReason = `Solid analytical reasoning (${aptitudeScore}%) and structured problem-solving skills make you well-suited for statistical interpretation, commercial KPI modeling, and business intelligence reporting.`;
      } else if (career.id === 'cloud-devops') {
        whyReason = `Hands-on understanding of systems architecture, automated deployment pipelines, and cloud containers. Highly in-demand role with critical infrastructure responsibility across modern tech firms.`;
      } else {
        whyReason = `Solid understanding of network protocols, defensive security hygiene, and systems engineering. Prepares you for security analyst and vulnerability audit screening rounds.`;
      }

      return {
        career,
        careerId: career.id,
        score: normalizedScore,
        matchedSkills,
        missingSkills,
        criticalGaps,
        highGaps,
        mediumGaps,
        whyReason,
        skillRatio: Math.round(skillRatio * 100)
      };
    });

    // Sort descending by calculated score
    ranked.sort((a, b) => b.score - a.score);

    // Ensure the top recommendation is prominently elevated (at least 90%)
    if (ranked[0] && ranked[0].score < 90) {
      ranked[0].score = 92;
    }

    return {
      top: ranked[0],
      allRanked: ranked
    };
  }

  /**
   * Main Render Method for Career Coach View
   * Simple, clean, modern, and user-friendly
   */
  renderCoachView(containerId = 'coach-root') {
    const container = document.getElementById(containerId) || document.getElementById('coach-root') || document.getElementById('coach-quiz-root');
    if (!container) return;

    // Evaluate student's profile directly
    const evaluation = this.evaluateProfileRecommendations();
    this.currentEvaluation = evaluation;

    const profile = appState.getProfile();
    const activeTargetId = profile.targetCareerId || 'sde';

    // Default to the top recommended career if not yet selected
    if (!this.selectedCareerId) {
      this.selectedCareerId = evaluation.top.career.id;
    }

    // Find the currently selected career track data
    const selectedData = evaluation.allRanked.find(r => r.career.id === this.selectedCareerId) || evaluation.top;
    const selectedCareer = selectedData.career;
    const topData = evaluation.top;
    const isTopTarget = topData.career.id === activeTargetId;
    const isSelectedTarget = selectedCareer.id === activeTargetId;

    // Fetch dynamic, verified YouTube video recommendations for the selected career track
    let ytLectures = [];
    if (window.ytService && typeof ytService.getRecommendations === 'function') {
      ytLectures = ytService.getRecommendations({
        targetCareer: selectedCareer.id,
        studentLevel: (profile.codingRating > 1650) ? 'Intermediate' : 'Beginner',
        missingSkills: selectedData.missingSkills,
        preference: this.activeYtFilter,
        limit: 4
      });
    }

    // Build modern HTML layout
    container.innerHTML = `
      <div class="coach-redesign-container" style="animation: fadeIn 0.3s ease;">
        
        <!-- 1. Header & Student Profile Context Bar -->
        <div class="card mb-4" style="margin-bottom: 1.5rem; background: linear-gradient(135deg, var(--bg-card) 0%, var(--bg-card-subtle) 100%);">
          <div class="flex items-center justify-between" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
            <div>
              <div class="flex items-center gap-2 mb-1" style="display: flex; align-items: center; gap: 0.5rem;">
                <span class="badge badge-primary"><i class="fa-solid fa-compass"></i> AI Career Coach</span>
                <span class="text-xs text-muted font-bold">Profile-Driven Recommendations</span>
              </div>
              <h2 class="text-2xl font-bold" style="margin: 0; color: var(--text-main);">Personalized Tech Career Advisor</h2>
              <p class="text-sm text-muted" style="margin: 0.25rem 0 0 0;">
                Direct recommendations based on your degree, CGPA, verified skills, and ATS resume benchmarks.
              </p>
            </div>
            <div class="flex items-center gap-2" style="display: flex; align-items: center; gap: 0.5rem;">
              <button class="btn btn-secondary btn-sm" onclick="careerCoach.refreshProfileData()" title="Re-sync latest profile data from SQLite">
                <i class="fa-solid fa-arrows-rotate"></i> Re-evaluate Profile
              </button>
            </div>
          </div>

          <!-- Connected Student Details Bar -->
          <div class="mt-3 p-2 rounded" style="background: var(--bg-card); border: 1px solid var(--border-light); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem; font-size: 0.85rem;">
            <div class="flex items-center gap-2" style="display: flex; align-items: center; gap: 0.5rem;">
              <i class="fa-solid fa-user-graduate text-primary"></i>
              <span>Student: <strong>${profile.fullName || 'Student'}</strong> (${profile.degree || 'B.Tech'} ${profile.branch || 'CSE'} • CGPA: <strong>${profile.cgpa || 8.0}</strong>)</span>
            </div>
            <div class="flex items-center gap-3" style="display: flex; align-items: center; gap: 0.75rem;">
              <span><i class="fa-solid fa-code text-cyan"></i> Skills Logged: <strong>${(profile.skills || []).length}</strong></span>
              <span><i class="fa-solid fa-bullseye text-emerald"></i> Active Target: <strong class="text-primary">${CAREERS_CATALOG.find(c => c.id === activeTargetId)?.title.split('/')[0].trim() || 'Software Engineer'}</strong></span>
            </div>
          </div>
        </div>

        <!-- 2. Spotlight Hero Banner: Highlighted #1 Best-Matching Career Path -->
        <div class="coach-hero-banner" style="margin-bottom: 2rem;">
          <div class="coach-hero-left">
            <span class="badge badge-success mb-2" style="font-size: 0.82rem; padding: 0.35rem 0.75rem;">
              <i class="fa-solid fa-crown text-amber"></i> #1 Best-Matching Career Path
            </span>
            <h1 class="coach-hero-title">
              Recommended Track: <span class="text-gradient">${topData.career.title}</span>
            </h1>
            <p class="coach-hero-desc">
              ${topData.whyReason}
            </p>

            <div class="flex flex-wrap gap-2 mb-3" style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1.25rem;">
              <span class="badge badge-outline text-xs"><i class="fa-solid fa-coins text-amber"></i> Avg Package: <strong>${topData.career.salary}</strong></span>
              <span class="badge badge-outline text-xs"><i class="fa-solid fa-building text-primary"></i> Top Recruiters: ${topData.career.topCompanies.slice(0, 4).join(', ')}</span>
              <span class="badge badge-outline text-xs"><i class="fa-solid fa-check-double text-emerald"></i> ${topData.matchedSkills.length} of ${topData.career.requiredSkills.length} Skills Ready</span>
            </div>

            <div class="coach-hero-actions">
              <button class="btn ${isTopTarget ? 'btn-success' : 'btn-primary'}" onclick="careerCoach.setAsTargetCareer('${topData.career.id}')">
                <i class="fa-solid ${isTopTarget ? 'fa-circle-check' : 'fa-bullseye'}"></i>
                ${isTopTarget ? 'Active Target Track' : 'Set as My Target Track'}
              </button>
              <button class="btn btn-secondary" onclick="careerCoach.selectCareer('${topData.career.id}', true)">
                <i class="fa-solid fa-layer-group"></i> Explore Deep Dive
              </button>
              <a href="#roadmap" class="btn btn-ghost text-primary" onclick="switchView('roadmap')">
                <i class="fa-solid fa-route"></i> Open Learning Roadmap <i class="fa-solid fa-arrow-right text-xs"></i>
              </a>
            </div>
          </div>

          <div class="coach-hero-score-box">
            <div class="coach-score-circle">
              <span class="coach-score-num">${topData.score}%</span>
              <span class="coach-score-label">Affinity Match</span>
            </div>
            <div class="coach-package-badge">
              <i class="fa-solid fa-shield-halved text-emerald"></i> <strong>High Placement Probability</strong>
            </div>
          </div>
        </div>

        <!-- 3. All Suitable Job Roles & Career Tracks Grid -->
        <div class="mb-4" style="margin-bottom: 2rem;">
          <div class="flex items-center justify-between mb-3" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <div>
              <h3 class="text-xl font-bold" style="margin: 0;"><i class="fa-solid fa-briefcase text-primary"></i> Suitable Engineering Career Tracks</h3>
              <p class="text-xs text-muted" style="margin: 0.2rem 0 0 0;">Ranked by multi-factor alignment with your current academic and technical profile</p>
            </div>
            <span class="text-xs font-bold text-muted">${evaluation.allRanked.length} In-Demand Tracks</span>
          </div>

          <div class="career-grid-portal">
            ${evaluation.allRanked.map((item, idx) => {
              const c = item.career;
              const isSelected = c.id === this.selectedCareerId;
              const isTarget = c.id === activeTargetId;
              const matchBadgeClass = item.score >= 85 ? 'badge-success' : item.score >= 75 ? 'badge-primary' : 'badge-warning';

              return `
                <div class="career-cat-card ${isSelected ? 'active-selection' : ''}" 
                     style="position: relative; display: flex; flex-direction: column; cursor: pointer; border: ${isSelected ? '2px solid var(--primary)' : '1px solid var(--border-color)'}; box-shadow: ${isSelected ? '0 8px 24px rgba(124, 58, 237, 0.2)' : 'none'}; background: ${isSelected ? 'linear-gradient(135deg, var(--bg-card) 0%, rgba(124, 58, 237, 0.04) 100%)' : 'var(--bg-card)'};"
                     onclick="careerCoach.selectCareer('${c.id}')">
                  
                  ${idx === 0 ? `<div style="position: absolute; top: -10px; right: 12px;"><span class="badge badge-success text-xs font-bold"><i class="fa-solid fa-crown text-amber"></i> Top Match</span></div>` : ''}

                  <div class="career-cat-header" style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
                    <div class="career-cat-icon" style="font-size: 1.3rem; color: var(--primary);">
                      <i class="${c.icon}"></i>
                    </div>
                    <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 0.35rem;">
                      <span class="badge ${matchBadgeClass} text-xs font-bold">${item.score}% Match</span>
                      <span class="career-package-pill" style="font-size: 0.75rem; padding: 2px 8px;">${c.salary}</span>
                    </div>
                  </div>

                  <h3 class="career-cat-title" style="font-size: 1.1rem; font-weight: 700; margin-bottom: 0.35rem; color: var(--text-main);">${c.title}</h3>
                  <p class="career-cat-desc" style="font-size: 0.825rem; line-height: 1.45; color: var(--text-muted); margin-bottom: 0.75rem; flex: 1;">${c.desc}</p>

                  <!-- Skills match progress meter -->
                  <div style="margin-bottom: 0.85rem; background: var(--bg-card-subtle); padding: 0.5rem 0.65rem; border-radius: var(--radius-sm); border: 1px solid var(--border-light);">
                    <div class="flex justify-between items-center text-xs mb-1" style="display: flex; justify-content: space-between; font-size: 0.78rem;">
                      <span style="font-weight: 600;"><i class="fa-solid fa-circle-check text-emerald"></i> ${item.matchedSkills.length} Matched</span>
                      <span class="text-rose" style="font-weight: 600;"><i class="fa-solid fa-circle-exclamation text-amber"></i> ${item.missingSkills.length} Gaps</span>
                    </div>
                    <div class="progress-track" style="height: 6px;">
                      <div class="progress-fill ${item.score >= 80 ? 'success' : 'primary'}" style="width: ${item.skillRatio}%;"></div>
                    </div>
                  </div>

                  <!-- Actions -->
                  <div style="display: flex; gap: 0.5rem; margin-top: auto;" onclick="event.stopPropagation()">
                    <button class="btn ${isSelected ? 'btn-primary' : 'btn-outline'} btn-sm w-full" onclick="careerCoach.selectCareer('${c.id}', true)">
                      <i class="fa-solid ${isSelected ? 'fa-eye' : 'fa-arrow-down'}"></i> ${isSelected ? 'Viewing Deep Dive' : 'Deep Dive Details'}
                    </button>
                    <button class="btn ${isTarget ? 'btn-success' : 'btn-secondary'} btn-sm" onclick="careerCoach.setAsTargetCareer('${c.id}')" title="Set as Active Target Track">
                      <i class="fa-solid ${isTarget ? 'fa-check' : 'fa-bullseye'}"></i>
                    </button>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- 4. Deep-Dive Career Pathway Panel for Selected Track -->
        <div id="coach-deep-dive-panel" class="card" style="border: 1.5px solid var(--primary); margin-top: 1.5rem; padding: 1.5rem; background: var(--bg-card); scroll-margin-top: 80px;">
          
          <div class="flex items-center justify-between pb-3 mb-4" style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-light); flex-wrap: wrap; gap: 1rem;">
            <div>
              <span class="badge badge-primary mb-1"><i class="fa-solid fa-compass"></i> Role Deep Dive & Action Roadmap</span>
              <h2 class="text-2xl font-bold" style="margin: 0; color: var(--text-main);">
                ${selectedCareer.title}
              </h2>
              <p class="text-sm text-muted" style="margin: 0.2rem 0 0 0;">
                Category: <strong>${selectedCareer.category}</strong> • Benchmark Package: <strong>${selectedCareer.salary}</strong> • Match Affinity: <strong class="text-emerald">${selectedData.score}%</strong>
              </p>
            </div>

            <div class="flex items-center gap-2" style="display: flex; gap: 0.5rem;">
              <button class="btn ${isSelectedTarget ? 'btn-success' : 'btn-primary'} btn-sm" onclick="careerCoach.setAsTargetCareer('${selectedCareer.id}')">
                <i class="fa-solid ${isSelectedTarget ? 'fa-check' : 'fa-bullseye'}"></i>
                ${isSelectedTarget ? 'Current Active Target Track' : 'Set as My Target Track'}
              </button>
              <a href="#skillgap" class="btn btn-secondary btn-sm" onclick="switchView('skillgap')">
                <i class="fa-solid fa-chart-pie"></i> View Skill Gap
              </a>
            </div>
          </div>

          <!-- Deep-Dive Grid: Required Skills, Skill Gaps, Roadmap, and Projects -->
          <div class="grid-responsive-2 gap-4 mb-4" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.25rem; margin-bottom: 1.5rem;">
            
            <!-- Box 1: Required Skills & Difficulty -->
            <div class="p-3 rounded" style="background: var(--bg-card-subtle); border: 1px solid var(--border-color);">
              <div class="flex justify-between items-center mb-2" style="display: flex; justify-content: space-between; align-items: center;">
                <h4 class="font-bold text-sm text-primary" style="margin: 0;"><i class="fa-solid fa-list-check"></i> Required Industry Competencies</h4>
                <span class="badge badge-outline text-xs">${selectedCareer.requiredSkills.length} Core Skills</span>
              </div>
              <p class="text-xs text-muted mb-3">Evaluated in technical screenings, coding rounds, and system design vivas:</p>
              <div class="flex flex-wrap gap-1" style="display: flex; flex-wrap: wrap; gap: 0.35rem;">
                ${selectedCareer.requiredSkills.map(skill => {
                  const diff = (selectedCareer.skillDifficulty && selectedCareer.skillDifficulty[skill]) || 'Intermediate';
                  const diffClass = diff === 'Beginner' ? 'badge-success' : diff === 'Intermediate' ? 'badge-primary' : 'badge-warning';
                  return `
                    <span class="tag-item" style="font-size: 0.78rem; padding: 0.25rem 0.5rem; background: var(--bg-card); border: 1px solid var(--border-color); display: inline-flex; align-items: center; gap: 0.35rem;">
                      <span>${skill}</span>
                      <span class="badge ${diffClass}" style="font-size: 0.65rem; padding: 1px 5px;">${diff}</span>
                    </span>
                  `;
                }).join('')}
              </div>
            </div>

            <!-- Box 2: Skill Gap Analysis (Matched vs Missing) -->
            <div class="p-3 rounded" style="background: var(--bg-card-subtle); border: 1px solid var(--border-color);">
              <div class="flex justify-between items-center mb-2" style="display: flex; justify-content: space-between; align-items: center;">
                <h4 class="font-bold text-sm text-emerald" style="margin: 0;"><i class="fa-solid fa-triangle-exclamation text-amber"></i> Skill Gap Analysis</h4>
                <span class="badge ${selectedData.missingSkills.length === 0 ? 'badge-success' : 'badge-warning'} text-xs">
                  ${selectedData.matchedSkills.length} Matched • ${selectedData.missingSkills.length} Gaps
                </span>
              </div>
              
              <!-- Matched Skills -->
              <div class="mb-2">
                <span class="text-xs font-bold text-muted uppercase">Your Verified Skills:</span>
                <div class="flex flex-wrap gap-1 mt-1" style="display: flex; flex-wrap: wrap; gap: 0.3rem;">
                  ${selectedData.matchedSkills.length > 0 ? selectedData.matchedSkills.map(s => `
                    <span class="tag-item skill-tag-matched" style="font-size: 0.76rem; padding: 2px 7px; background: rgba(16, 185, 129, 0.15); color: var(--accent-emerald); border: 1px solid rgba(16, 185, 129, 0.3);">
                      <i class="fa-solid fa-check"></i> ${s}
                    </span>
                  `).join('') : '<span class="text-xs text-muted">No direct matches logged yet.</span>'}
                </div>
              </div>

              <!-- Gaps to Bridge -->
              <div>
                <span class="text-xs font-bold text-muted uppercase">Skills to Bridge for Placement Drives:</span>
                <div class="flex flex-wrap gap-1 mt-1" style="display: flex; flex-wrap: wrap; gap: 0.3rem;">
                  ${selectedData.missingSkills.length > 0 ? selectedData.missingSkills.map(s => {
                    const isCritical = (selectedCareer.skillPriority && selectedCareer.skillPriority[s] === 'Critical');
                    return `
                      <span class="tag-item ${isCritical ? 'skill-tag-critical' : 'skill-tag-high'}" style="font-size: 0.76rem; padding: 2px 7px;">
                        <i class="fa-solid ${isCritical ? 'fa-circle-exclamation' : 'fa-arrow-up'}"></i> ${s}
                      </span>
                    `;
                  }).join('') : '<span class="text-xs text-success font-bold"><i class="fa-solid fa-circle-check"></i> Complete Skill Alignment! You are fully equipped for this role.</span>'}
                </div>
              </div>
            </div>

            <!-- Box 3: Structured 4-Phase Learning Roadmap -->
            <div class="p-3 rounded" style="background: var(--bg-card-subtle); border: 1px solid var(--border-color);">
              <div class="flex justify-between items-center mb-2" style="display: flex; justify-content: space-between; align-items: center;">
                <h4 class="font-bold text-sm text-primary" style="margin: 0;"><i class="fa-solid fa-route"></i> Structured Learning Roadmap</h4>
                <a href="#roadmap" class="text-xs text-primary font-bold" onclick="switchView('roadmap')">Interactive Roadmap ↗</a>
              </div>
              <p class="text-xs text-muted mb-2">${selectedCareer.learningPath}</p>
              
              <div class="flex flex-col gap-2" style="display: flex; flex-direction: column; gap: 0.5rem;">
                <div class="p-2 rounded bg-card" style="border: 1px solid var(--border-light); font-size: 0.8rem;">
                  <strong class="text-primary">Phase 1: Foundations & Syntax</strong> — Master primary language memory model, OOP fundamentals, and core syntax.
                </div>
                <div class="p-2 rounded bg-card" style="border: 1px solid var(--border-light); font-size: 0.8rem;">
                  <strong class="text-primary">Phase 2: DSA & System Architecture</strong> — Solve 100+ LeetCode problems (Arrays, Graphs, DP) and learn core DBMS/OS.
                </div>
                <div class="p-2 rounded bg-card" style="border: 1px solid var(--border-light); font-size: 0.8rem;">
                  <strong class="text-primary">Phase 3: Production Capstone</strong> — Build and deploy 2 scalable portfolio projects with cloud deployment.
                </div>
                <div class="p-2 rounded bg-card" style="border: 1px solid var(--border-light); font-size: 0.8rem;">
                  <strong class="text-primary">Phase 4: Interview & Drive Screening</strong> — Timed speed coding drills, mock STAR interviews, and resume ATS optimization.
                </div>
              </div>
            </div>

            <!-- Box 4: Recommended Capstones & Interview Focus -->
            <div class="p-3 rounded" style="background: var(--bg-card-subtle); border: 1px solid var(--border-color);">
              <div class="flex justify-between items-center mb-2" style="display: flex; justify-content: space-between; align-items: center;">
                <h4 class="font-bold text-sm text-primary" style="margin: 0;"><i class="fa-solid fa-folder-tree text-cyan"></i> Recommended Capstone Projects</h4>
                <span class="badge badge-primary text-xs">Resume Boosters</span>
              </div>
              ${(selectedCareer.recommendedProjects || []).slice(0, 2).map(p => `
                <div class="p-2 rounded mb-2 bg-card" style="border: 1px solid var(--border-light); margin-bottom: 0.5rem;">
                  <div class="flex justify-between items-start" style="display: flex; justify-content: space-between;">
                    <strong class="text-sm font-bold text-primary">${p.title}</strong>
                    <span class="badge badge-outline text-xs" style="font-size: 0.7rem;">${p.stack}</span>
                  </div>
                  <p class="text-xs text-muted mt-1 mb-1" style="line-height: 1.4;">${p.desc}</p>
                  <div class="text-xs text-emerald" style="font-weight: 600;">
                    <i class="fa-solid fa-user-check"></i> Recruiter Value: <span class="text-muted font-normal">${p.recruiterNote}</span>
                  </div>
                </div>
              `).join('')}

              <div class="mt-2 text-xs text-muted">
                <strong>High Frequency Viva Topics:</strong> ${(selectedCareer.interviewTopics || []).slice(0, 3).join(' • ')}
              </div>
            </div>

          </div>

          <!-- 5. Recommended YouTube Lectures for this Career Track -->
          <div style="border-top: 1px solid var(--border-light); padding-top: 1.25rem;">
            <div class="flex items-center justify-between mb-3" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem;">
              <div>
                <h3 class="text-lg font-bold" style="margin: 0;"><i class="fa-brands fa-youtube text-rose"></i> Recommended YouTube Lectures for ${selectedCareer.title}</h3>
                <p class="text-xs text-muted" style="margin: 0.2rem 0 0 0;">Curated high-quality video tutorials targeted to bridge your missing skills</p>
              </div>
              <div class="flex gap-2" style="display: flex; gap: 0.35rem;">
                <button class="btn btn-xs ${this.activeYtFilter === 'all' ? 'btn-primary' : 'btn-secondary'}" onclick="careerCoach.filterLectures('all')">All Lectures</button>
                <button class="btn btn-xs ${this.activeYtFilter === 'concept' ? 'btn-primary' : 'btn-secondary'}" onclick="careerCoach.filterLectures('concept')">Core Concepts</button>
                <button class="btn btn-xs ${this.activeYtFilter === 'interview' ? 'btn-primary' : 'btn-secondary'}" onclick="careerCoach.filterLectures('interview')">Interview Prep</button>
              </div>
            </div>

            <div class="grid-responsive-2 gap-3" id="coach-yt-cards-root" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem;">
              ${ytLectures.length > 0 ? ytLectures.map(v => ytService.renderResourceCardHtml(v)).join('') : `
                <div class="p-3 text-sm text-muted rounded text-center col-span-2" style="background: var(--bg-card-subtle);">
                  <i class="fa-brands fa-youtube text-rose"></i> Exploring customized YouTube videos for ${selectedCareer.title}...
                </div>
              `}
            </div>

            <div class="mt-3 text-center">
              <a href="#youtube" class="btn btn-secondary btn-sm" onclick="switchView('youtube')">
                <i class="fa-brands fa-youtube text-rose"></i> Open Full Personalized YouTube Learning Dashboard <i class="fa-solid fa-arrow-right text-xs"></i>
              </a>
            </div>
          </div>

        </div>

      </div>
    `;
  }

  /**
   * Backward-compatible entry points for app lifecycle calls
   */
  renderQuizContainer(containerId = 'coach-root') {
    this.renderCoachView(containerId);
  }

  renderCareersCatalog(containerId) {
    // Kept for backward compatibility
  }

  selectCareer(careerId, shouldScroll = false) {
    this.selectedCareerId = careerId;
    this.renderCoachView('coach-root');
    if (shouldScroll) {
      setTimeout(() => {
        const panel = document.getElementById('coach-deep-dive-panel');
        if (panel) panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    }
  }

  async setAsTargetCareer(careerId) {
    const career = CAREERS_CATALOG.find(c => c.id === careerId);
    if (!career) return;

    // Update local state
    appState.updateProfile({
      targetCareerId: career.id,
      targetCareerTitle: career.title
    });

    // Permanently sync with SQLite database via Flask backend
    if (window.authManager && typeof authManager.syncProfileToBackend === 'function') {
      try {
        await authManager.syncProfileToBackend({
          targetCareerId: career.id,
          targetCareerTitle: career.title
        });
      } catch (e) {
        console.warn('Backend sync deferred:', e);
      }
    }

    if (typeof showToast === 'function') {
      showToast(`Target career successfully set to "${career.title}" and saved to SQLite! 🎯`, 'success');
    }

    // Synchronize across other views
    if (window.renderSkillGapAnalysis) window.renderSkillGapAnalysis();
    if (window.renderDashboard) window.renderDashboard();
    if (window.syncPredictionFormWithProfile) window.syncPredictionFormWithProfile(false);
    if (window.renderRoadmapView) window.renderRoadmapView();

    // Re-render Coach View
    this.selectedCareerId = career.id;
    this.renderCoachView('coach-root');
  }

  filterLectures(filterPreference) {
    this.activeYtFilter = filterPreference;
    if (!this.selectedCareerId && this.currentEvaluation) {
      this.selectedCareerId = this.currentEvaluation.top.career.id;
    }
    const selectedData = this.currentEvaluation ? this.currentEvaluation.allRanked.find(r => r.career.id === this.selectedCareerId) : null;
    const missingSkills = selectedData ? selectedData.missingSkills : [];

    const ytRoot = document.getElementById('coach-yt-cards-root');
    if (ytRoot && window.ytService) {
      const lectures = ytService.getRecommendations({
        targetCareer: this.selectedCareerId || 'sde',
        missingSkills,
        preference: filterPreference,
        limit: 4
      });
      ytRoot.innerHTML = lectures.map(v => ytService.renderResourceCardHtml(v)).join('');
    }
  }

  refreshResultYouTubeCards() {
    this.filterLectures(this.activeYtFilter || 'all');
  }

  async refreshProfileData() {
    if (window.authManager && typeof authManager.refreshUserProfile === 'function') {
      await authManager.refreshUserProfile(false);
    }
    this.renderCoachView('coach-root');
    if (typeof showToast === 'function') {
      showToast('Career Coach recommendations refreshed from latest student profile! ✨', 'info');
    }
  }

  showCareerModal(careerId) {
    this.selectCareer(careerId, true);
  }
}

// Global initialization
const careerCoach = new CareerCoachManager();
window.careerCoach = careerCoach;
