/**
 * SMART PLACEMENT PREDICTION & CAREER COACH
 * Prediction Engine: Weighted Multi-Factor Algorithm & Gauge Visualizer
 */

function calculatePlacementProbability(params) {
  const {
    cgpa,
    skillsCount,
    internshipsCount,
    projectsCount,
    certsCount,
    aptitudeScore,
    codingRating,
    backlogs
  } = params;

  // 1. Academic Metric (Weight: 22%)
  // Normalized: CGPA of 9.5+ gives ~98, 8.0 gives ~80, 6.5 gives ~60
  const normalizedCgpa = Math.min(100, Math.max(0, (cgpa / 10) * 100));
  const academicScore = normalizedCgpa;

  // 2. Technical & Coding Skills (Weight: 25%)
  // Skill count (max 8) + Coding rating (1200 - 2000)
  const skillCountScore = Math.min(100, (skillsCount / 8) * 100);
  const codingScore = Math.min(100, Math.max(20, ((codingRating - 1200) / 800) * 100));
  const technicalScore = (skillCountScore * 0.4) + (codingScore * 0.6);

  // 3. Projects Quality (Weight: 18%)
  // 0 projects = 25, 1 project = 65, 2 projects = 88, 3+ = 98
  let projectsScore = 25;
  if (projectsCount === 1) projectsScore = 65;
  else if (projectsCount === 2) projectsScore = 88;
  else if (projectsCount >= 3) projectsScore = 98;

  // 4. Industry Internships (Weight: 15%)
  // 0 internships = 35, 1 internship = 82, 2+ = 98
  let internshipScore = 35;
  if (internshipsCount === 1) internshipScore = 82;
  else if (internshipsCount >= 2) internshipScore = 98;

  // 5. Aptitude & Reasoning (Weight: 12%)
  const aptitudeClean = Math.min(100, Math.max(0, aptitudeScore));

  // 6. Certifications (Weight: 8%)
  let certsScore = 30;
  if (certsCount === 1) certsScore = 70;
  else if (certsCount >= 2) certsScore = 95;

  // Weighted Sum Calculation
  let rawProbability = 
    (academicScore * 0.22) +
    (technicalScore * 0.25) +
    (projectsScore * 0.18) +
    (internshipScore * 0.15) +
    (aptitudeClean * 0.12) +
    (certsScore * 0.08);

  // Backlog Penalty (12% per active backlog)
  if (backlogs > 0) {
    rawProbability -= (backlogs * 12);
  }

  // Clamp probability between 15% and 98%
  const finalProbability = Math.round(Math.min(98, Math.max(15, rawProbability)));

  // Readiness Tier Classification
  let tier = 'Medium';
  let tierLabel = 'Moderate Readiness - High Probability for Mass/Tier-2 Tech (6 - 12 LPA)';
  let tierClass = 'medium';

  if (finalProbability >= 80) {
    tier = 'High';
    tierLabel = 'High Readiness - Tier 1 Product Company Candidate (14 - 32 LPA)';
    tierClass = 'high';
  } else if (finalProbability < 60) {
    tier = 'Low';
    tierLabel = 'Needs Targeted Preparation - At Risk for First-Round Screenings (<6 LPA)';
    tierClass = 'low';
  }

  // Generate Personalized Improvement Suggestions
  const suggestions = [];

  if (backlogs > 0) {
    suggestions.push({
      icon: 'fa-solid fa-triangle-exclamation',
      text: 'Prioritize clearing active backlogs immediately. 85% of product companies mandate zero active backlogs during registration.'
    });
  }

  if (cgpa < 7.5) {
    suggestions.push({
      icon: 'fa-solid fa-graduation-cap',
      text: `Your CGPA (${cgpa}) is below typical 7.5+ cutoffs. Compensate by reaching LeetCode rating 1750+ and participating in open-source hackathons.`
    });
  } else {
    suggestions.push({
      icon: 'fa-solid fa-circle-check',
      text: `Strong academic standing (${cgpa} CGPA) clears the initial eligibility threshold for 96% of campus visiting firms.`
    });
  }

  if (internshipsCount === 0) {
    suggestions.push({
      icon: 'fa-solid fa-briefcase',
      text: 'Acquiring at least one relevant software or research internship increases your interview shortlist rate by over 60%.'
    });
  }

  if (aptitudeScore < 75) {
    suggestions.push({
      icon: 'fa-solid fa-stopwatch',
      text: 'Aptitude score is under 75%. Over 65% of campus test rejections occur in Round 1 Online Aptitude Tests. Practice 20 questions daily.'
    });
  }

  if (projectsCount < 2) {
    suggestions.push({
      icon: 'fa-solid fa-folder-tree',
      text: 'Build and deploy at least 2 full-scale portfolio projects with live URLs, clean READMEs, and GitHub CI/CD badges.'
    });
  }

  if (certsCount === 0) {
    suggestions.push({
      icon: 'fa-solid fa-certificate',
      text: 'Consider completing an industry-recognized cloud credential (such as AWS Cloud Practitioner) to stand out on resumes.'
    });
  }

  return {
    probability: finalProbability,
    tier,
    tierLabel,
    tierClass,
    factors: {
      academics: Math.round(academicScore),
      technicalDSA: Math.round(technicalScore),
      projects: Math.round(projectsScore),
      internships: Math.round(internshipScore),
      aptitude: Math.round(aptitudeClean)
    },
    suggestions
  };
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
  const step = Math.ceil(targetPercent / 30);
  const interval = setInterval(() => {
    currentVal += step;
    if (currentVal >= targetPercent) {
      currentVal = targetPercent;
      clearInterval(interval);
    }
    textElem.innerText = `${currentVal}%`;
  }, 25);
}
