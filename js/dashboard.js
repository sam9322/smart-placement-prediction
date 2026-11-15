/**
 * SMART PLACEMENT PREDICTION & CAREER COACH
 * Dashboard Module: KPIs, Chart.js Integrations, Drives Table, and Action Recommendations
 */

let radarChartInstance = null;
let factorsChartInstance = null;

function renderDashboard() {
  const profile = appState.getProfile();
  const prediction = appState.getPrediction();
  const roadmapState = appState.getRoadmapChecklist();
  const interviewHistory = appState.data.interviewHistory;

  // 1. Update Student Welcome Banner
  const welcomeNameElem = document.getElementById('dash-welcome-name');
  if (welcomeNameElem) welcomeNameElem.innerText = profile.fullName || 'Student';

  const welcomeSubElem = document.getElementById('dash-welcome-sub');
  if (welcomeSubElem) {
    welcomeSubElem.innerText = `${profile.degree} in ${profile.branch} • Batch of ${profile.gradYear} • CGPA: ${profile.cgpa}`;
  }

  // 2. Update KPI Cards
  // KPI 1: Placement Probability
  const probValElem = document.getElementById('dash-kpi-prob');
  if (probValElem) probValElem.innerText = `${prediction.probability}%`;

  const probSubElem = document.getElementById('dash-kpi-prob-sub');
  if (probSubElem) {
    probSubElem.innerText = prediction.tier === 'High' ? 'Tier 1 Ready (14-32 LPA)' : prediction.tier === 'Medium' ? 'Tier 2 Ready (6-12 LPA)' : 'Needs Improvement (<6 LPA)';
  }
  const probBarElem = document.getElementById('dash-kpi-prob-bar');
  if (probBarElem) probBarElem.style.width = `${prediction.probability || 0}%`;

  // KPI 2: Target Career & Match
  const targetCareer = CAREERS_CATALOG.find(c => c.id === profile.targetCareerId) || CAREERS_CATALOG[0];
  const careerTitleElem = document.getElementById('dash-kpi-career');
  if (careerTitleElem) careerTitleElem.innerText = targetCareer.title;

  const studentSkills = (profile.skills || []).map(s => s.toLowerCase().trim());
  const matchedSkills = [];
  const missingSkills = [];
  (targetCareer.requiredSkills || []).forEach(req => {
    const reqLower = req.toLowerCase().trim();
    if (studentSkills.some(s => s === reqLower || s.includes(reqLower) || reqLower.includes(s))) {
      matchedSkills.push(req);
    } else {
      missingSkills.push(req);
    }
  });

  const matchedSkillsCount = matchedSkills.length;
  const totalRequired = (targetCareer.requiredSkills || []).length || 1;
  const matchPct = Math.round((matchedSkillsCount / totalRequired) * 100);

  const careerSubElem = document.getElementById('dash-kpi-career-sub');
  if (careerSubElem) careerSubElem.innerText = `${matchPct}% Skill Fit (${matchedSkillsCount}/${totalRequired} acquired)`;

  const careerBarElem = document.getElementById('dash-kpi-career-bar');
  if (careerBarElem) careerBarElem.style.width = `${matchPct}%`;

  // KPI 3: Milestones Completed
  let totalMilestones = 0;
  let doneMilestones = 0;
  const roadmapStages = (typeof SIX_MONTH_ROADMAP_MASTER !== 'undefined' ? SIX_MONTH_ROADMAP_MASTER : (typeof ROADMAP_DATA !== 'undefined' ? ROADMAP_DATA : (window.SIX_MONTH_ROADMAP_MASTER || window.ROADMAP_DATA || [])));
  roadmapStages.forEach(stage => {
    (stage.milestones || []).forEach(m => {
      totalMilestones++;
      if (roadmapState[m.id]) doneMilestones++;
    });
  });
  if (totalMilestones === 0) totalMilestones = 18;
  const roadmapPct = Math.round((doneMilestones / totalMilestones) * 100);

  const milestoneValElem = document.getElementById('dash-kpi-milestones');
  if (milestoneValElem) milestoneValElem.innerText = `${doneMilestones} / ${totalMilestones}`;

  const milestoneSubElem = document.getElementById('dash-kpi-milestones-sub');
  if (milestoneSubElem) milestoneSubElem.innerText = `${roadmapPct}% of Roadmap Completed`;

  const milestoneBarElem = document.getElementById('dash-kpi-milestones-bar');
  if (milestoneBarElem) milestoneBarElem.style.width = `${roadmapPct}%`;

  // KPI 4: Interview Readiness
  const interviewValElem = document.getElementById('dash-kpi-interview');
  if (interviewValElem) {
    interviewValElem.innerText = `${interviewHistory.aptitudeScore} / ${interviewHistory.aptitudeTotal}`;
  }

  const interviewSubElem = document.getElementById('dash-kpi-interview-sub');
  if (interviewSubElem) {
    const mockCount = (interviewHistory.mockAttempts || []).length;
    interviewSubElem.innerText = `${mockCount} Mock Simulation${mockCount === 1 ? '' : 's'} Logged`;
  }

  const interviewBarElem = document.getElementById('dash-kpi-interview-bar');
  if (interviewBarElem) {
    const interviewPct = Math.min(100, Math.round(((interviewHistory.aptitudeScore || 0) / (interviewHistory.aptitudeTotal || 10)) * 100));
    interviewBarElem.style.width = `${interviewPct}%`;
  }

  // 2b. Update Target Role & Skill Gap Overview Card
  const roleTitleElem = document.getElementById('dash-skillgap-role-title');
  if (roleTitleElem) roleTitleElem.innerText = targetCareer.title;

  const countPillElem = document.getElementById('dash-skillgap-count-pill');
  if (countPillElem) countPillElem.innerText = `${matchedSkills.length} of ${targetCareer.requiredSkills.length} Skills Acquired`;

  const percentElem = document.getElementById('dash-skillgap-percent');
  if (percentElem) percentElem.innerText = `${matchPct}%`;

  const progressBarElem = document.getElementById('dash-skillgap-progress-bar');
  if (progressBarElem) progressBarElem.style.width = `${matchPct}%`;

  const statusBadgeElem = document.getElementById('dash-skillgap-status-badge');
  if (statusBadgeElem) {
    if (matchPct >= 75) {
      statusBadgeElem.className = 'badge badge-success badge-xs font-bold';
      statusBadgeElem.innerHTML = '<i class="fa-solid fa-circle-check mr-1"></i> Strong Match';
    } else if (matchPct >= 50) {
      statusBadgeElem.className = 'badge badge-warning badge-xs font-bold';
      statusBadgeElem.innerHTML = '<i class="fa-solid fa-triangle-exclamation mr-1"></i> Moderate Fit';
    } else {
      statusBadgeElem.className = 'badge badge-danger badge-xs font-bold';
      statusBadgeElem.innerHTML = '<i class="fa-solid fa-circle-xmark mr-1"></i> Preparation Needed';
    }
  }

  const matchedCountElem = document.getElementById('dash-matched-count');
  if (matchedCountElem) matchedCountElem.innerText = `${matchedSkills.length} Acquired`;

  const matchedListElem = document.getElementById('dash-matched-skills-list');
  if (matchedListElem) {
    if (matchedSkills.length === 0) {
      matchedListElem.innerHTML = '<span class="text-xs text-muted" style="font-style: italic;">No matching skills logged yet. Add your skills in Profile.</span>';
    } else {
      matchedListElem.innerHTML = matchedSkills.map(s => `
        <span class="skill-tag skill-tag-matched">
          <i class="fa-solid fa-check" style="font-size: 0.65rem;"></i> ${s}
        </span>
      `).join('');
    }
  }

  const missingCountElem = document.getElementById('dash-missing-count');
  if (missingCountElem) missingCountElem.innerText = `${missingSkills.length} ${missingSkills.length === 1 ? 'Gap' : 'Gaps'}`;

  const missingListElem = document.getElementById('dash-missing-skills-list');
  if (missingListElem) {
    if (missingSkills.length === 0) {
      missingListElem.innerHTML = '<span class="text-xs text-emerald" style="font-weight: 600;"><i class="fa-solid fa-star mr-1"></i> All core target skills acquired! Outstanding readiness.</span>';
    } else {
      missingListElem.innerHTML = missingSkills.map(s => `
        <span class="skill-tag skill-tag-missing">
          <i class="fa-solid fa-plus" style="font-size: 0.65rem;"></i> ${s}
          <a href="#youtube" onclick="switchView('youtube')" title="Find video lectures for ${s}" class="skill-learn-link">Learn &nearr;</a>
        </span>
      `).join('');
    }
  }

  // 3. Render Upcoming Drives Table
  const drivesTbody = document.getElementById('dash-drives-tbody');
  if (drivesTbody) {
    drivesTbody.innerHTML = UPCOMING_DRIVES.map(drive => {
      const isEligible = profile.cgpa >= drive.minCgpa && profile.backlogs === 0;
      return `
        <tr>
          <td>
            <div style="font-weight: 700; color: var(--text-main);">${drive.company}</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">${drive.role}</div>
          </td>
          <td><span class="badge badge-success">${drive.ctc}</span></td>
          <td>${drive.date}</td>
          <td>
            ${isEligible 
              ? '<span class="badge badge-success"><i class="fa-solid fa-circle-check"></i> Eligible</span>' 
              : '<span class="badge badge-danger"><i class="fa-solid fa-ban"></i> CGPA Cutoff ' + drive.minCgpa + '</span>'}
          </td>
          <td>
            <button class="btn btn-secondary btn-sm" onclick="showToast('Applied for ${drive.company} drive alert!', 'success')">
              <i class="fa-regular fa-bell"></i> Set Alert
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }

  // 4. Render Recommended Action Items
  const actionsList = document.getElementById('dash-actions-list');
  if (actionsList) {
    const items = [];
    if (prediction.probability < 80) {
      items.push({
        icon: 'fa-solid fa-calculator',
        text: 'Re-run placement simulation after adding recent project achievements.',
        link: '#prediction',
        btnText: 'Predict Now'
      });
    }
    if (matchPct < 85) {
      items.push({
        icon: 'fa-solid fa-crosshairs',
        text: `Bridge the ${100 - matchPct}% skill gap in ${targetCareer.title}.`,
        link: '#skillgap',
        btnText: 'View Gaps'
      });
    }
    if (doneMilestones < totalMilestones) {
      items.push({
        icon: 'fa-solid fa-route',
        text: `Complete Stage ${doneMilestones < 3 ? '1' : doneMilestones < 6 ? '2' : '3'} milestones in your placement roadmap.`,
        link: '#roadmap',
        btnText: 'Open Roadmap'
      });
    }
    items.push({
      icon: 'fa-solid fa-user-tie',
      text: 'Take a simulated AI mock interview round to polish STAR responses.',
      link: '#interview',
      btnText: 'Start Mock'
    });

    actionsList.innerHTML = items.map(act => `
      <div class="flex items-center justify-between p-3" style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-md); margin-bottom: 0.5rem; display: flex; justify-content: space-between; align-items: center;">
        <div class="flex items-center gap-3" style="display: flex; align-items: center; gap: 0.75rem;">
          <i class="${act.icon} text-primary" style="font-size: 1.15rem; color: var(--primary);"></i>
          <span style="font-size: 0.875rem; font-weight: 500;">${act.text}</span>
        </div>
        <a href="${act.link}" class="btn btn-outline btn-sm" onclick="switchView('${act.link.substring(1)}')">
          ${act.btnText}
        </a>
      </div>
    `).join('');
  }

  // 5. Initialize or Update Chart.js Charts
  initDashboardCharts(profile, prediction);
}

function initDashboardCharts(profile, prediction) {
  if (typeof Chart === 'undefined') return;

  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const textColor = isDark ? '#94a3b8' : '#64748b';
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)';

  // 1. Radar Chart: Competency Profile vs Benchmark
  const radarCtx = document.getElementById('chart-radar');
  if (radarCtx) {
    if (radarChartInstance) radarChartInstance.destroy();

    const academicVal = Math.min(100, Math.round((profile.cgpa / 10) * 100));
    const dsaVal = Math.min(100, Math.round((profile.codingRating / 1800) * 100));
    const projectVal = Math.min(100, (profile.projects || []).length * 45);
    const internVal = (profile.internships || []).length > 0 ? 92 : 40;
    const aptitudeVal = profile.aptitudeScore || 75;
    const certVal = (profile.certifications || []).length * 35;

    radarChartInstance = new Chart(radarCtx, {
      type: 'radar',
      data: {
        labels: ['Academics (CGPA)', 'DSA & Coding', 'Project Depth', 'Internships', 'Aptitude & Logic', 'Certifications'],
        datasets: [
          {
            label: 'Your Current Score',
            data: [academicVal, dsaVal, projectVal, internVal, aptitudeVal, certVal],
            backgroundColor: 'rgba(79, 70, 229, 0.25)',
            borderColor: '#4f46e5',
            borderWidth: 2,
            pointBackgroundColor: '#4f46e5'
          },
          {
            label: 'Tier-1 Target Benchmark',
            data: [85, 90, 85, 80, 85, 75],
            backgroundColor: 'rgba(16, 185, 129, 0.12)',
            borderColor: '#10b981',
            borderWidth: 2,
            pointBackgroundColor: '#10b981',
            borderDash: [4, 4]
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            angleLines: { color: gridColor },
            grid: { color: gridColor },
            suggestedMin: 30,
            suggestedMax: 100,
            ticks: { display: false },
            pointLabels: {
              color: textColor,
              font: { family: 'Plus Jakarta Sans', size: 11, weight: '600' }
            }
          }
        },
        plugins: {
          legend: {
            labels: { color: textColor, font: { family: 'Inter', size: 12 } }
          }
        }
      }
    });
  }

  // 2. Bar / Doughnut Chart: Factor Weights in Placement Success
  const factorsCtx = document.getElementById('chart-factors');
  if (factorsCtx) {
    if (factorsChartInstance) factorsChartInstance.destroy();

    const factors = prediction.factors || {
      academics: 88,
      technicalDSA: 86,
      projects: 85,
      internships: 90,
      aptitude: 84
    };

    factorsChartInstance = new Chart(factorsCtx, {
      type: 'bar',
      data: {
        labels: ['Academics (22%)', 'Tech & DSA (25%)', 'Projects (18%)', 'Internships (15%)', 'Aptitude (12%)'],
        datasets: [{
          label: 'Factor Readiness Score (%)',
          data: [
            factors.academics || 80,
            factors.technicalDSA || 82,
            factors.projects || 85,
            factors.internships || 88,
            factors.aptitude || 84
          ],
          backgroundColor: [
            '#4f46e5',
            '#7c3aed',
            '#06b6d4',
            '#10b981',
            '#f59e0b'
          ],
          borderRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: textColor, font: { family: 'Inter', size: 10 } }
          },
          y: {
            grid: { color: gridColor },
            suggestedMin: 0,
            suggestedMax: 100,
            ticks: { color: textColor }
          }
        },
        plugins: {
          legend: { display: false }
        }
      }
    });
  }

  // 3. Render Top Recommended YouTube Picks on Dashboard
  if (typeof renderDashboardYouTubeWidget === 'function') {
    renderDashboardYouTubeWidget();
  }
}
