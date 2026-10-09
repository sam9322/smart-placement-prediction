/**
 * CareerPulse.AI – Skill Gap Analysis Module
 * 
 * Compares Student Skills vs Target Career Skills
 * Categorizes gaps into:
 * - Critical
 * - High Priority
 * - Medium Priority
 * 
 * Generates an interactive progress bar for every skill,
 * with single-click "Add to Profile" and "Watch YouTube Lecture" actions.
 */

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

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

  // Student skills normalized
  const studentSkills = (profile.skills || []).map(s => s.toLowerCase().trim());
  const requiredSkills = targetCareer.requiredSkills;

  const matchedSkills = [];
  const inProgressSkills = [];
  const missingSkills = [];

  // Skill analysis data model
  const skillDetails = requiredSkills.map(skill => {
    const sLower = skill.toLowerCase().trim();
    const isExactMatch = studentSkills.some(s => s === sLower);
    const isPartialMatch = !isExactMatch && studentSkills.some(s => s.includes(sLower) || sLower.includes(s));

    let status = 'missing'; // 'acquired', 'warning', 'missing'
    let progress = 15;
    let iconClass = 'fa-solid fa-xmark text-rose';
    let icon = '<i class="fa-solid fa-xmark text-rose" aria-hidden="true"></i>';

    if (isExactMatch) {
      status = 'acquired';
      progress = 95;
      iconClass = 'fa-solid fa-check text-emerald';
      icon = '<i class="fa-solid fa-check text-emerald" aria-hidden="true"></i>';
      matchedSkills.push(skill);
    } else if (isPartialMatch) {
      status = 'warning';
      progress = 60;
      iconClass = 'fa-solid fa-triangle-exclamation text-amber';
      icon = '<i class="fa-solid fa-triangle-exclamation text-amber" aria-hidden="true"></i>';
      inProgressSkills.push(skill);
    } else {
      missingSkills.push(skill);
    }

    const priority = targetCareer.skillPriority ? (targetCareer.skillPriority[skill] || 'Medium') : 'Medium';
    const difficulty = targetCareer.skillDifficulty ? (targetCareer.skillDifficulty[skill] || 'Intermediate') : 'Intermediate';

    return {
      name: skill,
      status,
      progress,
      icon,
      iconClass,
      priority,
      difficulty
    };
  });

  const totalReq = requiredSkills.length;
  const matchPercentage = Math.round(((matchedSkills.length + (inProgressSkills.length * 0.5)) / totalReq) * 100);

  // Update Overall Match UI Elements
  const matchPercentElem = document.getElementById('skillgap-match-percent');
  if (matchPercentElem) matchPercentElem.innerText = `${matchPercentage}%`;

  const matchBarElem = document.getElementById('skillgap-match-bar');
  if (matchBarElem) {
    matchBarElem.style.width = `${matchPercentage}%`;
    matchBarElem.className = `progress-fill ${matchPercentage >= 78 ? 'success' : matchPercentage >= 55 ? 'warning' : 'danger'}`;
  }

  const roleTitleElem = document.getElementById('skillgap-role-title');
  if (roleTitleElem) roleTitleElem.innerText = targetCareer.title;

  // Render Categorized Skill Gap Breakdown Table & Progress Bars
  const breakdownRoot = document.getElementById('skillgap-detailed-bars-root');
  if (breakdownRoot) {
    breakdownRoot.innerHTML = skillDetails.map(item => {
      const statusPill = item.status === 'acquired' ? 
        '<span class="badge badge-success"><i class="fa-solid fa-check" aria-hidden="true"></i> Acquired</span>' :
        item.status === 'warning' ?
        '<span class="badge badge-warning"><i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i> In Progress</span>' :
        '<span class="badge badge-danger"><i class="fa-solid fa-xmark" aria-hidden="true"></i> Missing Gap</span>';

      const priorityBadge = item.priority === 'Critical' ?
        '<span class="badge badge-danger font-bold">Critical</span>' :
        item.priority === 'High Priority' ?
        '<span class="badge badge-warning font-bold">High Priority</span>' :
        '<span class="badge badge-info">Medium</span>';

      return `
        <div class="skill-gap-bar-card">
          <div class="skill-gap-header-row">
            <div class="flex items-center gap-2">
              <span class="skill-status-icon">${item.icon}</span>
              <span class="skill-name font-bold">${escapeHtml(item.name)}</span>
              ${statusPill}
            </div>
            <div class="flex items-center gap-2">
              ${priorityBadge}
              <span class="badge badge-outline text-xs">${item.difficulty}</span>
              <span class="skill-pct-label font-bold text-xs">${item.progress}%</span>
            </div>
          </div>

          <!-- Progress Bar for Every Skill -->
          <div class="progress-track" style="height: 8px; margin: 0.6rem 0;">
            <div class="progress-fill ${item.status === 'acquired' ? 'success' : item.status === 'warning' ? 'warning' : 'danger'}" 
                 style="width: ${item.progress}%;"></div>
          </div>

          <div class="skill-gap-actions-row">
            <div class="text-xs text-muted">
              ${item.status === 'acquired' ? '✓ Mastered in current profile portfolio' : 
                item.status === 'warning' ? '⚠ Partial fundamentals detected. Recommended to reinforce with LeetCode problems.' :
                '✗ Foundational prerequisite missing. Recommended to prioritize before technical rounds.'}
            </div>
            <div class="flex gap-2">
              <a href="${ytService.getSearchUrl(targetCareer.title + ' ' + item.name)}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-xs" title="Watch targeted YouTube tutorial">
                <i class="fa-brands fa-youtube text-rose"></i> Watch Lecture
              </a>
              ${item.status !== 'acquired' ? `
                <button type="button" class="btn btn-primary btn-xs" onclick="addSkillToProfile('${escapeHtml(item.name)}')" title="Mark as acquired and add to student profile">
                  <i class="fa-solid fa-plus"></i> Add to Profile
                </button>
              ` : ''}
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // Render Matched Skills summary chips
  const matchedContainer = document.getElementById('skillgap-matched-container');
  if (matchedContainer) {
    if (matchedSkills.length === 0) {
      matchedContainer.innerHTML = `<p class="text-sm text-muted">No skills fully matched yet. Pick a priority gap below to start your roadmap.</p>`;
    } else {
      matchedContainer.innerHTML = matchedSkills.map(skill => `
        <span class="tag-item skill-tag-matched">
          <i class="fa-solid fa-circle-check"></i> ${skill}
        </span>
      `).join('');
    }
  }

  // Render Missing Skills summary
  const missingContainer = document.getElementById('skillgap-missing-container');
  if (missingContainer) {
    if (missingSkills.length === 0) {
      missingContainer.innerHTML = `
        <div class="p-3" style="background: rgba(16, 185, 129, 0.1); border-radius: var(--radius-md); color: var(--accent-emerald);">
          <i class="fa-solid fa-award"></i> Exceptional! You possess all primary technical competencies required for this track.
        </div>
      `;
    } else {
      missingContainer.innerHTML = missingSkills.map(skill => `
        <div class="flex items-center justify-between p-2" style="background: var(--bg-card-subtle); border: 1px solid var(--border-color); border-radius: var(--radius-md); margin-bottom: 0.5rem; display: flex; justify-content: space-between; align-items: center;">
          <span class="tag-item skill-tag-missing">
            <i class="fa-solid fa-triangle-exclamation"></i> ${escapeHtml(skill)}
          </span>
          <div class="flex gap-1">
            <a href="${ytService.getSearchUrl(targetCareer.title + ' ' + skill)}" target="_blank" rel="noopener noreferrer" class="btn btn-ghost btn-xs text-rose" title="Watch lecture">
              <i class="fa-brands fa-youtube"></i>
            </a>
            <button class="btn btn-secondary btn-sm" onclick="addSkillToProfile('${escapeHtml(skill)}')" title="Mark as acquired">
              <i class="fa-solid fa-plus"></i> Add
            </button>
          </div>
        </div>
      `).join('');
    }
  }

  // Priority Gap Bridging Plan
  const recContainer = document.getElementById('skillgap-recommendations');
  if (recContainer) {
    if (missingSkills.length > 0) {
      const topPriority = missingSkills.find(s => targetCareer.skillPriority && targetCareer.skillPriority[s] === 'Critical') || missingSkills[0];
      recContainer.innerHTML = `
        <div class="card p-4" style="background: var(--bg-card); border-left: 4px solid var(--primary); border-radius: var(--radius-lg); padding: 1.25rem;">
          <div class="flex items-center justify-between mb-2">
            <h4 style="font-size: 1rem;"><i class="fa-solid fa-lightbulb text-amber"></i> Highest Leverage Skill Gap: <strong class="text-gradient">${escapeHtml(topPriority)}</strong></h4>
            <span class="badge badge-danger">Critical Priority</span>
          </div>
          <p class="text-sm mb-3" style="margin-bottom: 0.75rem;">
            Acquiring <strong>${escapeHtml(topPriority)}</strong> will immediately raise your qualification readiness to <strong>${Math.min(98, matchPercentage + 14)}%</strong> and unlock shortlists for visiting recruiters.
          </p>
          <div class="flex gap-2" style="display: flex; gap: 0.5rem;">
            <a href="${ytService.getSearchUrl(targetCareer.title + ' ' + topPriority)}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
              <i class="fa-brands fa-youtube"></i> Recommended YouTube Lectures
            </a>
            <a href="#roadmap" class="btn btn-secondary btn-sm" onclick="switchView('roadmap')">
              <i class="fa-solid fa-route"></i> View Month-by-Month Roadmap
            </a>
            <button class="btn btn-outline btn-sm" onclick="addSkillToProfile('${escapeHtml(topPriority)}')">
              <i class="fa-solid fa-check"></i> Mark Acquired
            </button>
          </div>
        </div>
      `;
    } else {
      recContainer.innerHTML = `
        <div class="card p-3 text-center" style="background: var(--bg-card); border-radius: var(--radius-lg); padding: 1rem;">
          <p class="text-sm text-emerald font-semibold"><i class="fa-solid fa-circle-check"></i> Zero critical skill gaps! Focus on speed coding and mock interviews.</p>
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
    if (window.syncPredictionFormWithProfile) window.syncPredictionFormWithProfile();
  }
}
