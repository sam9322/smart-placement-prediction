/**
 * SMART PLACEMENT PREDICTION & CAREER COACH
 * Career Coach Module: Interest Assessment & Career Matching
 */

const COACH_QUIZ_QUESTIONS = [
  {
    id: 'q1',
    prompt: 'Which type of technical problem excites you the most?',
    options: [
      { text: 'Designing robust system algorithms and optimizing data structures', match: 'sde' },
      { text: 'Crafting responsive user interfaces and interactive web apps', match: 'webdev' },
      { text: 'Uncovering trends, patterns, and insights from massive datasets', match: 'data-analyst' },
      { text: 'Building neural networks, NLP, and intelligent predictive models', match: 'aiml' },
      { text: 'Automating server infrastructure, containers, and cloud pipelines', match: 'cloud-devops' },
      { text: 'Auditing vulnerabilities, penetration testing, and digital forensics', match: 'cybersecurity' }
    ]
  },
  {
    id: 'q2',
    prompt: 'How do you feel about mathematics, linear algebra, and probability?',
    options: [
      { text: 'I love rigorous math; I want it deeply integrated into my daily work', match: 'aiml' },
      { text: 'I enjoy statistical reasoning and interpreting charts & business KPIs', match: 'data-analyst' },
      { text: 'I prefer discrete math, boolean logic, and algorithmic efficiency', match: 'sde' },
      { text: 'I prefer product logic, UX aesthetics, and component architecture', match: 'webdev' },
      { text: 'I prefer systems thinking, networking topology, and Linux bash', match: 'cloud-devops' },
      { text: 'I prefer cryptographic proofs, security protocols, and threat modeling', match: 'cybersecurity' }
    ]
  },
  {
    id: 'q3',
    prompt: 'What is your preferred environment or technology stack?',
    options: [
      { text: 'Modern JavaScript, TypeScript, React, Next.js, and CSS frameworks', match: 'webdev' },
      { text: 'Python, PyTorch, TensorFlow, Scikit-Learn, and Jupyter notebooks', match: 'aiml' },
      { text: 'Java, C++, Low-level memory, Multithreading, and SQL engines', match: 'sde' },
      { text: 'SQL, Power BI, Excel, Tableau, and Pandas dataframes', match: 'data-analyst' },
      { text: 'Docker, Kubernetes, AWS Cloud, Terraform, and CI/CD runners', match: 'cloud-devops' },
      { text: 'Wireshark, Kali Linux, Metasploit, Burp Suite, and Firewalls', match: 'cybersecurity' }
    ]
  }
];

class CareerCoachManager {
  constructor() {
    this.quizAnswers = {};
    this.currentQuestionIndex = 0;
  }

  renderQuizContainer(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (this.currentQuestionIndex >= COACH_QUIZ_QUESTIONS.length) {
      this.renderQuizResults(container);
      return;
    }

    const q = COACH_QUIZ_QUESTIONS[this.currentQuestionIndex];
    container.innerHTML = `
      <div class="coach-quiz-box">
        <div class="flex items-center justify-between mb-3" style="margin-bottom: 1rem;">
          <span class="badge badge-primary">Assessment Question ${this.currentQuestionIndex + 1} of ${COACH_QUIZ_QUESTIONS.length}</span>
          <span class="text-sm" style="color: var(--text-muted);">Career Affinity Diagnostic</span>
        </div>
        <h3 class="text-xl mb-4" style="margin-bottom: 1.5rem;">${q.prompt}</h3>
        <div class="grid gap-3" style="display: grid; gap: 0.75rem; margin-bottom: 1.5rem;">
          ${q.options.map((opt, i) => `
            <div class="quiz-option-card ${this.quizAnswers[q.id] === opt.match ? 'selected' : ''}" 
                 onclick="careerCoach.selectAnswer('${q.id}', '${opt.match}')">
              <i class="fa-regular fa-circle-dot"></i>
              <span>${opt.text}</span>
            </div>
          `).join('')}
        </div>
        <div class="flex justify-between items-center" style="display: flex; justify-content: space-between;">
          <button class="btn btn-secondary btn-sm" onclick="careerCoach.prevQuestion()" ${this.currentQuestionIndex === 0 ? 'disabled' : ''}>
            <i class="fa-solid fa-arrow-left"></i> Previous
          </button>
          <button class="btn btn-primary btn-sm" onclick="careerCoach.nextQuestion()" ${!this.quizAnswers[q.id] ? 'disabled' : ''}>
            Next Question <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>
    `;
  }

  selectAnswer(qId, careerMatch) {
    this.quizAnswers[qId] = careerMatch;
    this.renderQuizContainer('coach-quiz-root');
  }

  nextQuestion() {
    if (this.currentQuestionIndex < COACH_QUIZ_QUESTIONS.length) {
      this.currentQuestionIndex++;
      this.renderQuizContainer('coach-quiz-root');
    }
  }

  prevQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      this.renderQuizContainer('coach-quiz-root');
    }
  }

  calculateBestMatch() {
    const scores = {};
    CAREERS_CATALOG.forEach(c => scores[c.id] = 0);

    // Tally answers
    Object.values(this.quizAnswers).forEach(cId => {
      if (scores[cId] !== undefined) scores[cId] += 30;
    });

    // Cross-reference with student profile skills
    const profile = appState.getProfile();
    CAREERS_CATALOG.forEach(career => {
      const matchCount = career.requiredSkills.filter(s => profile.skills.includes(s)).length;
      scores[career.id] += (matchCount * 10);
    });

    // Find highest score
    let bestCareerId = 'sde';
    let highestScore = -1;
    for (const [cId, score] of Object.entries(scores)) {
      if (score > highestScore) {
        highestScore = score;
        bestCareerId = cId;
      }
    }

    return CAREERS_CATALOG.find(c => c.id === bestCareerId) || CAREERS_CATALOG[0];
  }

  renderQuizResults(container) {
    const bestMatch = this.calculateBestMatch();

    container.innerHTML = `
      <div class="card p-4 text-center" style="border: 2px solid var(--primary); background: var(--bg-card); border-radius: var(--radius-xl); padding: 2rem;">
        <div class="badge badge-success mb-3" style="margin-bottom: 0.75rem;">AI Recommendation Result</div>
        <h2 class="text-2xl mb-2" style="margin-bottom: 0.5rem;">Your Top Career Match: <span class="text-gradient">${bestMatch.title}</span></h2>
        <p class="mb-4" style="max-width: 650px; margin: 0 auto 1.5rem auto;">${bestMatch.desc}</p>
        
        <div class="flex justify-center gap-3" style="display: flex; justify-content: center; gap: 1rem; margin-bottom: 1.5rem;">
          <button class="btn btn-primary" onclick="careerCoach.setAsTargetCareer('${bestMatch.id}')">
            <i class="fa-solid fa-bullseye"></i> Set as My Target Career
          </button>
          <button class="btn btn-secondary" onclick="careerCoach.resetQuiz()">
            <i class="fa-solid fa-rotate"></i> Retake Assessment
          </button>
        </div>
      </div>
    `;
  }

  resetQuiz() {
    this.quizAnswers = {};
    this.currentQuestionIndex = 0;
    this.renderQuizContainer('coach-quiz-root');
  }

  setAsTargetCareer(careerId) {
    const career = CAREERS_CATALOG.find(c => c.id === careerId);
    if (!career) return;

    appState.updateProfile({
      targetCareerId: career.id,
      targetCareerTitle: career.title
    });

    showToast(`Target career successfully updated to "${career.title}"!`, 'success');

    // Trigger updates
    if (window.renderSkillGapAnalysis) window.renderSkillGapAnalysis();
    if (window.renderDashboard) window.renderDashboard();
  }

  renderCareersCatalog(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const currentTargetId = appState.getProfile().targetCareerId;

    container.innerHTML = CAREERS_CATALOG.map(career => {
      const isTarget = career.id === currentTargetId;
      return `
        <div class="career-cat-card">
          <div class="career-cat-header">
            <div class="career-cat-icon">
              <i class="${career.icon}"></i>
            </div>
            <span class="career-package-pill">${career.salary}</span>
          </div>
          <h3 class="career-cat-title">${career.title}</h3>
          <p class="career-cat-desc">${career.desc}</p>
          
          <div style="margin-bottom: 1rem;">
            <div class="career-companies-label">Key Required Skills</div>
            <div class="career-skill-chips">
              ${career.requiredSkills.slice(0, 5).map(s => `<span class="career-skill-chip">${s}</span>`).join('')}
              ${career.requiredSkills.length > 5 ? `<span class="career-skill-chip">+${career.requiredSkills.length - 5} more</span>` : ''}
            </div>
          </div>

          <div style="margin-bottom: 1.25rem;">
            <div class="career-companies-label">Top Recruiters</div>
            <div class="career-companies-list">${career.topCompanies.join(', ')}</div>
          </div>

          <div style="margin-top: auto; display: flex; gap: 0.5rem;">
            <button class="btn ${isTarget ? 'btn-success' : 'btn-primary'} btn-sm w-full" 
                    onclick="careerCoach.setAsTargetCareer('${career.id}')">
              <i class="fa-solid ${isTarget ? 'fa-check' : 'fa-bullseye'}"></i>
              ${isTarget ? 'Current Target' : 'Set as Target'}
            </button>
            <button class="btn btn-secondary btn-sm" onclick="careerCoach.showCareerModal('${career.id}')" title="View Full Syllabus">
              <i class="fa-solid fa-circle-info"></i>
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  showCareerModal(careerId) {
    const career = CAREERS_CATALOG.find(c => c.id === careerId);
    if (!career) return;

    const modalBody = document.getElementById('career-modal-body');
    const modalTitle = document.getElementById('career-modal-title');
    if (!modalBody || !modalTitle) return;

    modalTitle.innerText = career.title;
    modalBody.innerHTML = `
      <div style="margin-bottom: 1.25rem;">
        <span class="badge badge-primary">${career.category}</span>
        <span class="badge badge-success" style="margin-left: 0.5rem;">Avg Package: ${career.salary}</span>
      </div>
      <p style="margin-bottom: 1.25rem;">${career.desc}</p>
      
      <h4 style="margin-bottom: 0.5rem; font-size: 1rem;">All Required Competencies</h4>
      <div class="flex flex-wrap gap-2" style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1.5rem;">
        ${career.requiredSkills.map(s => `<span class="tag-item"><i class="fa-solid fa-code text-primary"></i> ${s}</span>`).join('')}
      </div>

      <h4 style="margin-bottom: 0.5rem; font-size: 1rem;">Recommended Learning Roadmap</h4>
      <div class="card p-3" style="background: var(--bg-card-subtle); border-radius: var(--radius-md); padding: 1rem; margin-bottom: 1.5rem;">
        <p style="font-weight: 600; color: var(--text-main); font-size: 0.9rem;">${career.learningPath}</p>
      </div>

      <h4 style="margin-bottom: 0.5rem; font-size: 1rem;">Campus Hiring Majors</h4>
      <p style="color: var(--text-muted); font-size: 0.9rem;">${career.topCompanies.join(' • ')}</p>
    `;

    document.getElementById('career-detail-modal').classList.add('open');
  }
}

const careerCoach = new CareerCoachManager();
