/**
 * SMART PLACEMENT PREDICTION & CAREER COACH
 * Skill Gap Analysis Module: Gap Comparator & Bridging Recommendations
 */

function renderSkillGapAnalysis() {
  const profile = appState.getProfile();
  const targetCareerId = profile.targetCareerId || 'sde';
  const targetCareer = CAREERS_CATALOG.find(c => c.id === targetCareerId) || CAREERS_CATALOG[0];

  const selectorElem = document.getElementById('skillgap-career-select');
  if (selectorElem) {
    selectorElem.innerHTML = CAREERS_CATALOG.map(c => `
      <option value="${c.id}" ${c.id === targetCareer.id ? 'selected' : ''}>${c.title}</option>
    `).join('');
  }

  // Normalize skills for comparison
  const studentSkills = (profile.skills || []).map(s => s.toLowerCase().trim());
  const requiredSkills = targetCareer.requiredSkills;

  const matchedSkills = [];
  const missingSkills = [];

  requiredSkills.forEach(req => {
    const isMatched = studentSkills.some(s => s === req.toLowerCase().trim() || s.includes(req.toLowerCase().trim()) || req.toLowerCase().trim().includes(s));
    if (isMatched) {
      matchedSkills.push(req);
    } else {
      missingSkills.push(req);
    }
  });

  const totalReq = requiredSkills.length;
  const matchPercentage = Math.round((matchedSkills.length / totalReq) * 100);

  // Update UI Elements
  const matchPercentElem = document.getElementById('skillgap-match-percent');
  if (matchPercentElem) matchPercentElem.innerText = `${matchPercentage}%`;

  const matchBarElem = document.getElementById('skillgap-match-bar');
  if (matchBarElem) {
    matchBarElem.style.width = `${matchPercentage}%`;
    if (matchPercentage >= 75) {
      matchBarElem.className = 'progress-fill success';
    } else if (matchPercentage >= 50) {
      matchBarElem.className = 'progress-fill warning';
    } else {
      matchBarElem.className = 'progress-fill';
    }
  }

  const roleTitleElem = document.getElementById('skillgap-role-title');
  if (roleTitleElem) roleTitleElem.innerText = targetCareer.title;

  // Render Matched Skills
  const matchedContainer = document.getElementById('skillgap-matched-container');
  if (matchedContainer) {
    if (matchedSkills.length === 0) {
      matchedContainer.innerHTML = `<p class="text-sm text-muted">No skills matched yet. Review the required skills list below to start learning.</p>`;
    } else {
      matchedContainer.innerHTML = matchedSkills.map(skill => `
        <span class="tag-item skill-tag-matched">
          <i class="fa-solid fa-circle-check"></i> ${skill}
        </span>
      `).join('');
    }
  }

  // Render Missing Skills
  const missingContainer = document.getElementById('skillgap-missing-container');
  if (missingContainer) {
    if (missingSkills.length === 0) {
      missingContainer.innerHTML = `
        <div class="p-3" style="background: rgba(16, 185, 129, 0.1); border-radius: var(--radius-md); color: var(--accent-emerald);">
          <i class="fa-solid fa-award"></i> Exceptional! You possess all primary technical skills required for this role.
        </div>
      `;
    } else {
      missingContainer.innerHTML = missingSkills.map(skill => `
        <div class="flex items-center justify-between p-2" style="background: var(--bg-card-subtle); border: 1px solid var(--border-color); border-radius: var(--radius-md); margin-bottom: 0.5rem; display: flex; justify-content: space-between; align-items: center;">
          <span class="tag-item skill-tag-missing">
            <i class="fa-solid fa-triangle-exclamation"></i> ${skill}
          </span>
          <button class="btn btn-secondary btn-sm" onclick="addSkillToProfile('${skill}')" title="Mark as acquired">
            <i class="fa-solid fa-plus"></i> Add to Profile
          </button>
        </div>
      `).join('');
    }
  }

  // Recommendations to bridge gap
  const recContainer = document.getElementById('skillgap-recommendations');
  if (recContainer) {
    if (missingSkills.length > 0) {
      const topPriority = missingSkills[0];
      recContainer.innerHTML = `
        <div class="card p-4" style="background: var(--bg-card); border-left: 4px solid var(--primary); border-radius: var(--radius-lg); padding: 1.25rem;">
          <h4 style="font-size: 1rem; margin-bottom: 0.5rem;"><i class="fa-solid fa-lightbulb text-primary"></i> Highest Priority Skill Gap: <strong class="text-gradient">${topPriority}</strong></h4>
          <p class="text-sm mb-3" style="margin-bottom: 0.75rem;">
            Acquiring <strong>${topPriority}</strong> will immediately raise your role readiness to <strong>${Math.round(((matchedSkills.length + 1) / totalReq) * 100)}%</strong>.
          </p>
          <div class="flex gap-2" style="display: flex; gap: 0.5rem;">
            <a href="#roadmap" class="btn btn-primary btn-sm" onclick="switchView('roadmap')">
              <i class="fa-solid fa-route"></i> Open Learning Roadmap
            </a>
            <button class="btn btn-outline btn-sm" onclick="addSkillToProfile('${topPriority}')">
              <i class="fa-solid fa-check"></i> Mark Learned
            </button>
          </div>
        </div>
      `;
    } else {
      recContainer.innerHTML = `
        <div class="card p-3 text-center" style="background: var(--bg-card); border-radius: var(--radius-lg); padding: 1rem;">
          <p class="text-sm text-muted">Zero critical skill gaps detected for this career profile! Hone your mock interview practice.</p>
        </div>
      `;
    }
  }
}

function handleCareerSelectChange(e) {
  const selectedId = e.target.value;
  const career = CAREERS_CATALOG.find(c => c.id === selectedId);
  if (career) {
    appState.updateProfile({
      targetCareerId: career.id,
      targetCareerTitle: career.title
    });
    renderSkillGapAnalysis();
  }
}

function addSkillToProfile(skillName) {
  const profile = appState.getProfile();
  if (!profile.skills.includes(skillName)) {
    profile.skills.push(skillName);
    appState.updateProfile({ skills: profile.skills });
    showToast(`Added "${skillName}" to your skills!`, 'success');
    renderSkillGapAnalysis();
    if (window.renderProfileView) window.renderProfileView();
    if (window.renderDashboard) window.renderDashboard();
  }
}
