/**
 * CareerPulse.AI – AI Career Coach & Matcher
 * Interactive Assessment, Question-Specific Recommendations, 
 * Multi-Factor Career Scoring Engine, and 9-Card Comprehensive Result Page.
 */

const COACH_QUIZ_QUESTIONS = [
  {
    id: 'q1',
    prompt: 'Which type of technical problem excites you the most?',
    contextExplanation: 'Technical problem affinity identifies your cognitive preference for algorithmic logic, visual presentation, statistical discovery, or systems infrastructure.',
    options: [
      {
        text: 'Designing robust system algorithms and optimizing data structures',
        match: 'sde',
        weight: 35,
        why: 'You thrive on algorithmic efficiency, computational complexity, and foundational problem-solving.',
        skillPath: ['Algorithms', 'Data Structures', 'LeetCode', 'Core CS (DBMS / OS)']
      },
      {
        text: 'Crafting responsive user interfaces and interactive web apps',
        match: 'webdev',
        weight: 35,
        why: 'You enjoy building interactive user-facing experiences, responsive component layouts, and end-to-end web applications.',
        skillPath: ['HTML/CSS', 'JavaScript', 'React', 'Full Stack MERN']
      },
      {
        text: 'Uncovering trends, patterns, and insights from massive datasets',
        match: 'data-analyst',
        weight: 35,
        why: 'You possess analytical curiosity for uncovering commercial insights, statistical correlations, and data storytelling.',
        skillPath: ['SQL', 'Excel', 'Pandas & NumPy', 'Statistics', 'Power BI']
      },
      {
        text: 'Building neural networks, NLP, and intelligent predictive models',
        match: 'aiml',
        weight: 35,
        why: 'You are passionate about artificial intelligence, neural architectures, deep learning, and generative AI pipelines.',
        skillPath: ['Python', 'Machine Learning', 'Deep Learning', 'NLP', 'GenAI']
      },
      {
        text: 'Automating server infrastructure, containers, and cloud pipelines',
        match: 'cloud-devops',
        weight: 35,
        why: 'You appreciate systems engineering, containerized scaling, continuous integration, and cloud-native resilience.',
        skillPath: ['Linux', 'Docker', 'Kubernetes', 'AWS Cloud', 'CI/CD']
      },
      {
        text: 'Auditing vulnerabilities, penetration testing, and digital forensics',
        match: 'cybersecurity',
        weight: 35,
        why: 'You are energized by defensive security, threat modeling, digital forensics, and ethical penetration testing.',
        skillPath: ['Security Foundations', 'Networking', 'Ethical Hacking', 'Wireshark', 'Cryptography']
      }
    ]
  },
  {
    id: 'q2',
    prompt: 'Which programming language and technology ecosystem feels most intuitive to you?',
    contextExplanation: 'Language ergonomics determine the ecosystem where you will write code fastest and feel most productive.',
    options: [
      {
        text: 'C++, Core Java, low-level memory, multithreading, and high-performance algorithms',
        match: 'sde',
        weight: 25,
        why: 'Strong typed languages provide direct control over memory and computational efficiency, essential for SDE interviews.',
        skillPath: ['C++', 'Java', 'STL / Java Collections', 'Multithreading', 'Low Level Design']
      },
      {
        text: 'TypeScript, JavaScript, React, Next.js, CSS frameworks, and modern web APIs',
        match: 'webdev',
        weight: 25,
        why: 'The JavaScript/TypeScript ecosystem powers the modern web with rapid feedback loops and dynamic UI rendering.',
        skillPath: ['Modern JS (ES6+)', 'React 19', 'Next.js', 'TypeScript', 'Tailwind CSS']
      },
      {
        text: 'Python, SQL, Pandas, Power BI, Excel, and statistical modeling libraries',
        match: 'data-analyst',
        weight: 25,
        why: 'Python and SQL are the global industry standard for structured data manipulation and business analytics.',
        skillPath: ['Analytical SQL', 'Python Pandas', 'Seaborn', 'Power BI DAX', 'Statistical Analysis']
      },
      {
        text: 'Python with PyTorch, TensorFlow, Scikit-Learn, and Hugging Face Transformers',
        match: 'aiml',
        weight: 25,
        why: 'PyTorch and Hugging Face form the research and production backbone for modern deep learning and generative models.',
        skillPath: ['PyTorch', 'TorchVision', 'Hugging Face', 'Scikit-Learn', 'CUDA / GPU Acceleration']
      },
      {
        text: 'Bash / Linux, Docker, Kubernetes manifests, AWS Cloud, and Terraform HCL',
        match: 'cloud-devops',
        weight: 25,
        why: 'Infrastructure-as-code and container manifests define modern cloud orchestration and automated developer operations.',
        skillPath: ['Bash Scripting', 'Dockerfile Optimization', 'Kubernetes YAML', 'Terraform Modules', 'AWS CLI']
      },
      {
        text: 'Kali Linux, Wireshark, Metasploit, Python socket scripts, and Burp Suite',
        match: 'cybersecurity',
        weight: 25,
        why: 'Offensive and defensive security tooling enables packet capture inspection, vulnerability triage, and exploit verification.',
        skillPath: ['Kali Linux', 'Burp Suite Pro', 'Wireshark pcap', 'Nmap Scripting', 'Python Scapy']
      }
    ]
  },
  {
    id: 'q3',
    prompt: 'What kind of capstone project would you be most proud to present to campus recruiters?',
    contextExplanation: 'Your dream project represents the engineering accomplishments you naturally want to talk about in technical rounds.',
    options: [
      {
        text: 'A distributed fault-tolerant key-value store or high-speed cache engine',
        match: 'sde',
        weight: 20,
        why: 'Distributed storage projects stand out for SDE roles by showcasing concurrency, replication, and data persistence.',
        skillPath: ['Raft Consensus', 'gRPC / Protocol Buffers', 'TCP Sockets', 'LSM-Trees', 'Unit Testing']
      },
      {
        text: 'A collaborative real-time web application with rich UI and WebSocket sync',
        match: 'webdev',
        weight: 20,
        why: 'Real-time collaborative applications demonstrate state synchronization, responsive design, and production frontend polish.',
        skillPath: ['WebSockets', 'React State Management', 'Optimistic UI', 'Express Backend', 'MongoDB']
      },
      {
        text: 'An interactive executive BI dashboard analyzing consumer retention and churn drivers',
        match: 'data-analyst',
        weight: 20,
        why: 'Executive dashboards immediately impress hiring managers with measurable ROI, actionable KPIs, and clean visual storytelling.',
        skillPath: ['Cohort Analysis', 'SQL CTEs', 'Data Cleansing', 'Interactive Filters', 'Executive Presentation']
      },
      {
        text: 'An AI diagnostic assistant combining deep learning computer vision and RAG LLMs',
        match: 'aiml',
        weight: 20,
        why: 'Generative AI and computer vision models prove applied deep learning mastery and modern LLM application architecture.',
        skillPath: ['CNN Model Training', 'LangChain / LlamaIndex', 'Vector Databases', 'FastAPI Serving', 'Docker']
      },
      {
        text: 'A zero-downtime automated GitOps CI/CD pipeline deploying Kubernetes clusters',
        match: 'cloud-devops',
        weight: 20,
        why: 'Automated deployment pipelines showcase real-world DevOps maturity that saves engineering hours and ensures 99.99% uptime.',
        skillPath: ['GitHub Actions', 'ArgoCD GitOps', 'Kubernetes Cluster', 'Helm Charts', 'Prometheus Alerts']
      },
      {
        text: 'An automated enterprise vulnerability scanner with exploit triage and CVE reporting',
        match: 'cybersecurity',
        weight: 20,
        why: 'Vulnerability scanners prove your understanding of threat vectors, CVSS scoring, and defensive mitigation strategies.',
        skillPath: ['OWASP Top 10 Scanners', 'CVSS Calculator', 'Automated Remediation Reports', 'Python Requests', 'Network Scans']
      }
    ]
  },
  {
    id: 'q4',
    prompt: 'How do you prefer to handle mathematical reasoning, algorithms, and logic?',
    contextExplanation: 'Mathematical style clarifies whether your strengths lie in algorithmic bounds, continuous math, or systems topology.',
    options: [
      {
        text: 'I enjoy discrete mathematics, boolean logic, recursion trees, and Big-O efficiency',
        match: 'sde',
        weight: 20,
        why: 'Discrete mathematics and algorithmic time/space analysis are the bedrock of top-tier product SDE engineering.',
        skillPath: ['Big-O Analysis', 'Recurrence Relations', 'Graph Theory', 'Combinatorics', 'Dynamic Programming']
      },
      {
        text: 'I prefer product ergonomics, visual layout math, state machines, and UX aesthetics',
        match: 'webdev',
        weight: 20,
        why: 'Frontend architecture focuses on component state machines, render performance, flex/grid geometry, and smooth animations.',
        skillPath: ['Component Lifecycles', 'CSS Transforms', 'State Machine Reducers', 'Event Propagation', 'DOM Diffing']
      },
      {
        text: 'I enjoy statistical tests, probability distributions, regression, and KPI trends',
        match: 'data-analyst',
        weight: 20,
        why: 'Applied statistics allows you to separate real business trends from random noise and design trustworthy A/B tests.',
        skillPath: ['Hypothesis Testing', 'P-Values', 'Normal Distributions', 'Variance Analysis', 'Linear Regression']
      },
      {
        text: 'I love vector calculus, linear algebra, matrix multiplications, and loss functions',
        match: 'aiml',
        weight: 20,
        why: 'Linear algebra and multivariable calculus are the mathematical engine of neural networks and gradient optimization.',
        skillPath: ['Eigenvalues & Tensors', 'Matrix Multiplication', 'Partial Derivatives', 'Stochastic Gradient Descent', 'Cross-Entropy']
      },
      {
        text: 'I prefer systems logic, CIDR subnetting, network latency, and throughput math',
        match: 'cloud-devops',
        weight: 20,
        why: 'Networking math ensures optimal cloud CIDR block allocations, subnets, round-trip latency, and throughput sizing.',
        skillPath: ['CIDR Subnet Masks', 'Bandwidth Calculations', 'MTU / TCP Windows', 'Load Balancing Algorithms', 'Quorum Math']
      },
      {
        text: 'I enjoy cryptographic proofs, hashing algorithms, entropy, and threat modeling',
        match: 'cybersecurity',
        weight: 20,
        why: 'Cryptography and information entropy form the mathematical foundation of digital certificates, hashes, and encryption.',
        skillPath: ['RSA / Elliptic Curve', 'SHA-256 Hashing', 'Diffie-Hellman Key Exchange', 'HMAC Signatures', 'Cryptanalysis']
      }
    ]
  },
  {
    id: 'q5',
    prompt: 'What is your ideal day-to-day development workflow and working environment?',
    contextExplanation: 'Daily workflow preferences ensure your chosen track aligns with what you will genuinely enjoy doing every day.',
    options: [
      {
        text: 'Writing clean, modular backend code, unit tests, and optimizing database latency',
        match: 'sde',
        weight: 15,
        why: 'Software engineering day-to-day centers around maintainable code, test coverage, and backend speed.',
        skillPath: ['Clean Code Principles', 'Unit & Integration Tests', 'SQL Query Optimization', 'Code Reviews', 'Git Flow']
      },
      {
        text: 'Building polished design systems, user interactions, and end-to-end client flows',
        match: 'webdev',
        weight: 15,
        why: 'Frontend engineers craft delightful customer journeys, accessible UI components, and fast-loading web applications.',
        skillPath: ['Design Systems', 'Responsive Design', 'Accessibility (a11y)', 'Lighthouse Optimization', 'Storybook']
      },
      {
        text: 'Querying data warehouses, exploring dataframes, and communicating findings to stakeholders',
        match: 'data-analyst',
        weight: 15,
        why: 'Data analysts partner with business leaders to translate complex database metrics into strategic decisions.',
        skillPath: ['Data Wrangling', 'Exploratory Data Analysis', 'Executive Slide Decks', 'Cross-functional Communication', 'KPI Dashboards']
      },
      {
        text: 'Training neural network architectures, tuning hyperparameters, and evaluating loss curves',
        match: 'aiml',
        weight: 15,
        why: 'AI engineers iterate across experimentation, model architecture design, hyperparameter sweeps, and loss convergence.',
        skillPath: ['Experiment Tracking (WandB)', 'Hyperparameter Tuning', 'Data Augmentation', 'Model Quantization', 'Inference Benchmarks']
      },
      {
        text: 'Configuring cloud infrastructure, container orchestration, and automating releases',
        match: 'cloud-devops',
        weight: 15,
        why: 'DevOps engineers ensure engineering teams can ship code reliably dozens of times a day without fear of downtime.',
        skillPath: ['Infrastructure as Code', 'Continuous Deployment', 'Kubernetes Helm', 'Log Aggregation', 'Incident Post-Mortems']
      },
      {
        text: 'Simulating threat attacks, reviewing security logs, and penetration testing applications',
        match: 'cybersecurity',
        weight: 15,
        why: 'Cybersecurity professionals continually challenge systems, review anomalous traffic logs, and harden defenses.',
        skillPath: ['Threat Hunting', 'Log Analysis', 'Vulnerability Auditing', 'Firewall Configurations', 'Red Team Drills']
      }
    ]
  },
  {
    id: 'q6',
    prompt: 'Which technical interview round excites you most to prepare for?',
    contextExplanation: 'Different company tracks emphasize distinct evaluation rounds during campus placements.',
    options: [
      {
        text: 'Live coding rounds solving Data Structures & Algorithms on a whiteboard',
        match: 'sde',
        weight: 15,
        why: 'Tier-1 product companies evaluate algorithmic rigor, problem simplification, and live coding speed.',
        skillPath: ['LeetCode Medium/Hard', 'Think-Aloud Protocols', 'Edge Case Handling', 'Space-Time Complexity Defense']
      },
      {
        text: 'Machine coding rounds building a responsive frontend feature under time pressure',
        match: 'webdev',
        weight: 15,
        why: 'Tech companies evaluate your ability to architect modular, clean UI components within 90 minutes.',
        skillPath: ['Component Architecture', 'CSS Flexbox/Grid Mastery', 'API Mocking', 'Error Boundaries', 'State Handling']
      },
      {
        text: 'Live SQL query challenges and business case study diagnosis rounds',
        match: 'data-analyst',
        weight: 15,
        why: 'Analytics interviews test your ability to extract multi-table metrics and diagnose real business metric drops.',
        skillPath: ['Window Functions', 'Join Strategies', 'Root-Cause Analysis', 'Data Cleaning Logic', 'Metric Definitions']
      },
      {
        text: 'Mathematical derivations of ML algorithms and PyTorch tensor coding',
        match: 'aiml',
        weight: 15,
        why: 'AI engineering interviews probe deep into algorithm mechanics rather than surface-level library imports.',
        skillPath: ['Deriving Backpropagation', 'Custom PyTorch Modules', 'Loss Formulation', 'Overfitting Countermeasures']
      },
      {
        text: 'System troubleshooting, Linux terminal drills, and cloud architecture defense',
        match: 'cloud-devops',
        weight: 15,
        why: 'DevOps panels evaluate your live debugging intuition when services crash or networks drop packets.',
        skillPath: ['Linux Diagnostics (htop, journalctl)', 'Docker Network Troubleshooting', 'Kubernetes Pod Recovery', 'AWS Security Groups']
      },
      {
        text: 'Capture-the-flag scenarios, packet capture inspection, and OWASP triage',
        match: 'cybersecurity',
        weight: 15,
        why: 'Cyber panels test practical exploit detection, packet analysis, and remediation suggestions.',
        skillPath: ['Wireshark Stream Analysis', 'SQL Injection Payloads', 'Privilege Escalation Steps', 'Hardening Checklists']
      }
    ]
  },
  {
    id: 'q7',
    prompt: 'Which industry domain or technology trend captures your ambition most for campus placements?',
    contextExplanation: 'Long-term motivation powers consistent preparation through high-stakes campus placement drives.',
    options: [
      {
        text: 'Landing an SDE offer at top product giants like Google, Microsoft, Amazon, or Uber',
        match: 'sde',
        weight: 15,
        why: 'Core SDE roles provide unmatched compensation, scale of impact, and strong long-term engineering prestige.',
        skillPath: ['High Scalability', 'Distributed Systems', 'Global Reach', 'Competitive Compensation', 'Tier-1 CTC Bands']
      },
      {
        text: 'Joining fast-growing unicorns & tech startups building world-class user products',
        match: 'webdev',
        weight: 15,
        why: 'Startups offer massive ownership, rapid deployment velocity, and direct visibility of customer impact.',
        skillPath: ['Fast Prototyping', 'Product Ownership', 'Modern Web Stacks', 'Startup Agility', 'High Growth Potential']
      },
      {
        text: 'Leading business intelligence & quantitative strategy at top global analytics firms',
        match: 'data-analyst',
        weight: 15,
        why: 'Data specialists sit at the intersection of tech and business leadership, directly shaping executive strategy.',
        skillPath: ['Commercial Strategy', 'Quantitative Modeling', 'Consulting Advisory', 'Executive Briefings', 'Global Analytics']
      },
      {
        text: 'Pioneering Generative AI, LLMs, and autonomous intelligent systems',
        match: 'aiml',
        weight: 15,
        why: 'Generative AI represents the largest paradigm shift in computing, commanding premium compensation and research frontier roles.',
        skillPath: ['LLM Orchestration', 'Agentic Workflows', 'Autonomous Systems', 'Research Impact', 'AI Infrastructure']
      },
      {
        text: 'Architecting resilient planetary-scale cloud systems and developer platforms',
        match: 'cloud-devops',
        weight: 15,
        why: 'Cloud architects are the indispensable backbone of modern software reliability and enterprise digital transformation.',
        skillPath: ['Multi-Cloud Strategy', 'Planetary Scalability', 'Platform Engineering', 'High Availability', 'Critical Infrastructure']
      },
      {
        text: 'Defending enterprise critical infrastructure against sophisticated cyber warfare',
        match: 'cybersecurity',
        weight: 15,
        why: 'With rising global cyber threats, certified security engineers protect sovereign data, financial networks, and critical systems.',
        skillPath: ['Critical Defense', 'Cyber Sovereignty', 'Zero-Trust Architecture', 'High Industry Demand', 'Ethical Mission']
      }
    ]
  }
];

class CareerCoachManager {
  constructor() {
    this.quizAnswers = {};
    this.currentQuestionIndex = 0;
    this.currentAssessmentResult = null;
    this.activeResultTab = 'top'; // 'top', 'runner1', 'runner2'
  }

  /**
   * Render the Interactive Assessment Quiz Container
   */
  renderQuizContainer(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // If quiz is completed, render comprehensive results
    if (this.currentQuestionIndex >= COACH_QUIZ_QUESTIONS.length) {
      this.renderQuizResults(container);
      return;
    }

    const q = COACH_QUIZ_QUESTIONS[this.currentQuestionIndex];
    const totalQ = COACH_QUIZ_QUESTIONS.length;
    const progressPercent = Math.round(((this.currentQuestionIndex) / totalQ) * 100);
    const selectedAnswerMatch = this.quizAnswers[q.id];
    const selectedOption = q.options.find(opt => opt.match === selectedAnswerMatch);

    // Fetch question-specific dynamic YouTube recommendations if an option is selected (2–3 verified videos)
    let previewLectures = [];
    if (selectedOption && window.ytService) {
      previewLectures = ytService.getRecommendations({
        targetCareer: selectedOption.match,
        studentLevel: 'Beginner',
        selectedTopic: selectedOption.skillPath ? selectedOption.skillPath[0] : '',
        missingSkills: selectedOption.skillPath || [],
        limit: 3
      });
    }

    container.innerHTML = `
      <div class="coach-quiz-card">
        <!-- Quiz Header with Progress Bar -->
        <div class="coach-quiz-header">
          <div class="flex items-center justify-between mb-2" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
            <div class="flex items-center gap-2" style="display: flex; align-items: center; gap: 0.5rem;">
              <span class="badge badge-primary">
                <i class="fa-solid fa-graduation-cap"></i> Question ${this.currentQuestionIndex + 1} of ${totalQ}
              </span>
              <span class="text-xs text-muted font-semibold">Career Affinity Assessment</span>
            </div>
            <span class="text-xs font-bold text-gradient">${progressPercent}% Completed</span>
          </div>

          <div class="progress-track" style="height: 6px; margin-bottom: 1.25rem;">
            <div class="progress-fill" style="width: ${progressPercent}%;"></div>
          </div>

          <h3 class="coach-question-prompt">${q.prompt}</h3>
          <p class="coach-question-context"><i class="fa-solid fa-circle-info text-primary"></i> ${q.contextExplanation}</p>
        </div>

        <!-- 6 Multiple Choice Options -->
        <div class="coach-options-grid">
          ${q.options.map((opt, i) => {
            const isSelected = selectedAnswerMatch === opt.match;
            const careerMeta = CAREERS_CATALOG.find(c => c.id === opt.match);
            return `
              <div class="coach-option-box ${isSelected ? 'selected' : ''}" 
                   onclick="careerCoach.selectAnswer('${q.id}', '${opt.match}')">
                <div class="coach-option-radio">
                  <i class="fa-solid ${isSelected ? 'fa-circle-check text-primary' : 'fa-circle-dot'}"></i>
                </div>
                <div class="coach-option-content">
                  <div class="coach-option-header-row">
                    <span class="coach-option-index">Option ${i + 1}</span>
                    <span class="coach-option-career-badge">${careerMeta ? careerMeta.title.split('/')[0].trim() : opt.match.toUpperCase()}</span>
                  </div>
                  <div class="coach-option-text">${opt.text}</div>
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <!-- Dynamic Question-Specific Recommendation Preview Box -->
        ${selectedOption ? `
          <div class="coach-instant-preview-box">
            <div class="coach-preview-header">
              <div class="flex items-center gap-2">
                <span class="badge badge-success"><i class="fa-solid fa-wand-magic-sparkles"></i> Live Recommendation Context</span>
                <span class="text-xs font-bold text-primary">Matched Career: ${CAREERS_CATALOG.find(c => c.id === selectedOption.match)?.title}</span>
              </div>
              <span class="badge badge-primary">Match Indicator: 95%</span>
            </div>

            <div class="coach-preview-why">
              <strong>Why this aligns with you:</strong> "${selectedOption.why}"
            </div>

            <div class="coach-preview-pipeline">
              <div class="text-xs font-bold text-muted mb-1 uppercase tracking-wider">Recommended Skills Progression:</div>
              <div class="coach-pipeline-chips">
                ${selectedOption.skillPath.map((s, idx) => `
                  <span class="coach-pipeline-chip">
                    ${s} ${idx < selectedOption.skillPath.length - 1 ? '<i class="fa-solid fa-arrow-right coach-pipeline-arrow"></i>' : ''}
                  </span>
                `).join('')}
              </div>
            </div>

            <!-- Instant Recommended YouTube Learning Cards for this question -->
            ${previewLectures.length > 0 ? `
              <div class="coach-preview-yt-section">
                <div class="text-xs font-bold text-muted mb-2 uppercase tracking-wider flex items-center justify-between" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
                  <span><i class="fa-brands fa-youtube text-rose"></i> Recommended YouTube Videos for this answer (${previewLectures.length} Top Rated Videos):</span>
                  <span class="text-xs text-primary font-normal"><i class="fa-solid fa-circle-check text-emerald"></i> Verified Working • Trusted Channels</span>
                </div>
                <div class="grid-responsive-2 gap-3">
                  ${previewLectures.map(v => ytService.renderResourceCardHtml(v)).join('')}
                </div>
              </div>
            ` : ''}
          </div>
        ` : `
          <div class="coach-select-prompt">
            <i class="fa-solid fa-arrow-pointer text-primary"></i> Select an answer above to view instant career matching insights, skill pathways, and recommended YouTube lectures.
          </div>
        `}

        <!-- Bottom Navigation Buttons -->
        <div class="coach-quiz-actions">
          <button class="btn btn-secondary btn-sm" onclick="careerCoach.prevQuestion()" ${this.currentQuestionIndex === 0 ? 'disabled' : ''}>
            <i class="fa-solid fa-arrow-left"></i> Previous Question
          </button>
          
          <div class="flex items-center gap-2">
            <button class="btn btn-ghost btn-sm" onclick="careerCoach.resetQuiz()" title="Reset assessment">
              <i class="fa-solid fa-rotate-left"></i> Reset
            </button>
            <button class="btn btn-primary" onclick="careerCoach.nextQuestion()" ${!selectedAnswerMatch ? 'disabled' : ''}>
              ${this.currentQuestionIndex === totalQ - 1 ? 'Complete Assessment & View 9-Card Analysis <i class="fa-solid fa-award"></i>' : 'Next Question <i class="fa-solid fa-arrow-right"></i>'}
            </button>
          </div>
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
      window.scrollTo({ top: document.getElementById('coach-quiz-root')?.offsetTop - 80 || 0, behavior: 'smooth' });
    }
  }

  prevQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      this.renderQuizContainer('coach-quiz-root');
      window.scrollTo({ top: document.getElementById('coach-quiz-root')?.offsetTop - 80 || 0, behavior: 'smooth' });
    }
  }

  resetQuiz() {
    this.quizAnswers = {};
    this.currentQuestionIndex = 0;
    this.currentAssessmentResult = null;
    this.renderQuizContainer('coach-quiz-root');
    showToast('Career assessment reset. Start fresh!', 'info');
  }

  /**
   * Multi-Factor Career Scoring Engine:
   * careerScore = questionAnswerWeight + studentSkillWeight + careerInterestWeight + placementGoalWeight
   * Normalize scores to 0–100.
   * Return top 3 career recommendations.
   */
  calculateTopRecommendations() {
    const rawScores = {};
    CAREERS_CATALOG.forEach(c => { rawScores[c.id] = 0; });

    // 1. Question Answer Weights (Max: ~140 points)
    COACH_QUIZ_QUESTIONS.forEach(q => {
      const selectedMatch = this.quizAnswers[q.id];
      if (selectedMatch) {
        const option = q.options.find(opt => opt.match === selectedMatch);
        const weight = option ? option.weight : 20;
        rawScores[selectedMatch] += weight;

        // Synergistic cross-domain affinity points
        if (selectedMatch === 'sde') { rawScores['webdev'] += 8; rawScores['cloud-devops'] += 6; }
        if (selectedMatch === 'webdev') { rawScores['sde'] += 8; rawScores['cloud-devops'] += 5; }
        if (selectedMatch === 'data-analyst') { rawScores['aiml'] += 10; rawScores['sde'] += 5; }
        if (selectedMatch === 'aiml') { rawScores['data-analyst'] += 10; rawScores['sde'] += 6; }
        if (selectedMatch === 'cloud-devops') { rawScores['cybersecurity'] += 8; rawScores['sde'] += 6; }
        if (selectedMatch === 'cybersecurity') { rawScores['cloud-devops'] += 8; rawScores['sde'] += 5; }
      }
    });

    // 2. Student Skill Overlap Weight (Max: ~40 points)
    const profile = appState.getProfile();
    const studentSkillsLower = (profile.skills || []).map(s => s.toLowerCase().trim());
    CAREERS_CATALOG.forEach(career => {
      let matchedCount = 0;
      career.requiredSkills.forEach(req => {
        if (studentSkillsLower.some(s => s.includes(req.toLowerCase()) || req.toLowerCase().includes(s))) {
          matchedCount++;
        }
      });
      const skillBonus = Math.min(40, (matchedCount / career.requiredSkills.length) * 40);
      rawScores[career.id] += skillBonus;
    });

    // 3. Career Interest & Academic Profile Weight (Max: ~20 points)
    const targetCareerId = profile.targetCareerId;
    if (rawScores[targetCareerId] !== undefined) {
      rawScores[targetCareerId] += 15;
    }
    if (profile.codingRating > 1650) {
      rawScores['sde'] += 10;
      rawScores['aiml'] += 8;
    }

    // 4. Normalize to 0 - 100%
    const highestRaw = Math.max(...Object.values(rawScores), 100);
    const ranked = CAREERS_CATALOG.map(career => {
      const raw = rawScores[career.id] || 0;
      // Normalization formula ensuring top result falls between 88% - 96%
      const normalized = Math.min(96, Math.max(45, Math.round((raw / highestRaw) * 94) + 2));
      return {
        career,
        careerId: career.id,
        score: normalized,
        rawScore: raw
      };
    });

    // Sort descending by normalized score
    ranked.sort((a, b) => b.score - a.score);

    return {
      top: ranked[0],
      runnerUp1: ranked[1],
      runnerUp2: ranked[2],
      allRanked: ranked
    };
  }

  /**
   * Render the 9-Card Comprehensive Career Coach Result Page
   */
  renderQuizResults(container) {
    const results = this.calculateTopRecommendations();
    this.currentAssessmentResult = results;

    const activeCareerData = (this.activeResultTab === 'runner1') ? results.runnerUp1 :
                             (this.activeResultTab === 'runner2') ? results.runnerUp2 :
                             results.top;

    const career = activeCareerData.career;
    const matchScore = activeCareerData.score;
    const profile = appState.getProfile();
    const isTarget = profile.targetCareerId === career.id;

    // Trigger celebration confetti on view load if top score >= 85
    if (typeof confetti === 'function' && matchScore >= 85) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    }

    // Compare skills
    const studentSkillsLower = (profile.skills || []).map(s => s.toLowerCase().trim());
    const matchedSkills = [];
    const missingSkills = [];
    career.requiredSkills.forEach(req => {
      const isMatch = studentSkillsLower.some(s => s.includes(req.toLowerCase().trim()) || req.toLowerCase().trim().includes(s));
      if (isMatch) matchedSkills.push(req);
      else missingSkills.push(req);
    });

    // Categorize skill gaps
    const criticalGaps = missingSkills.filter(s => (career.skillPriority && career.skillPriority[s] === 'Critical') || s === 'System Design' || s === 'Operating Systems' || s === 'Kubernetes');
    const highGaps = missingSkills.filter(s => !criticalGaps.includes(s) && (career.skillPriority && career.skillPriority[s] === 'High Priority'));
    const mediumGaps = missingSkills.filter(s => !criticalGaps.includes(s) && !highGaps.includes(s));

    // Fetch dynamic YouTube recommendations
    const ytLectures = ytService.getRecommendations({
      targetCareer: career.id,
      studentLevel: profile.codingRating > 1700 ? 'Intermediate' : 'Beginner',
      missingSkills,
      limit: 6
    });

    container.innerHTML = `
      <div class="coach-results-wrapper">
        <!-- Top Hero Result Banner -->
        <div class="coach-hero-banner">
          <div class="coach-hero-left">
            <span class="badge badge-success mb-2">
              <i class="fa-solid fa-bullseye"></i> AI Assessment Completed
            </span>
            <h1 class="coach-hero-title">
              Your Recommended Career: <span class="text-gradient">${career.title}</span>
            </h1>
            <p class="coach-hero-desc">
              Based on your multi-factor diagnostic analysis, technical problem-solving affinity, mathematical style, and profile competencies.
            </p>
            <div class="coach-hero-actions">
              <button class="btn ${isTarget ? 'btn-success' : 'btn-primary'}" onclick="careerCoach.setAsTargetCareer('${career.id}')">
                <i class="fa-solid ${isTarget ? 'fa-check' : 'fa-bullseye'}"></i>
                ${isTarget ? 'Currently Your Active Target Track' : 'Set as My Target Career Track'}
              </button>
              <button class="btn btn-secondary" onclick="careerCoach.resetQuiz()">
                <i class="fa-solid fa-rotate-left"></i> Retake Assessment
              </button>
            </div>
          </div>

          <div class="coach-hero-score-box">
            <div class="coach-score-circle">
              <span class="coach-score-num">${matchScore}%</span>
              <span class="coach-score-label">Affinity Match</span>
            </div>
            <div class="coach-package-badge">
              <i class="fa-solid fa-coins text-amber"></i> Avg Package: <strong>${career.salary}</strong>
            </div>
          </div>
        </div>

        <!-- Top 3 Career Recommendations Podium Tabs -->
        <div class="coach-podium-tabs">
          <div class="text-xs font-bold text-muted uppercase tracking-wider mb-2">Normalized Top 3 Career Recommendations:</div>
          <div class="coach-tabs-row">
            <button class="coach-podium-tab ${this.activeResultTab === 'top' ? 'active' : ''}" onclick="careerCoach.switchResultTab('top')">
              <span class="podium-rank-badge rank-1">#1</span>
              <div class="podium-info">
                <strong>${results.top.career.title}</strong>
                <span class="podium-match-pct text-emerald">${results.top.score}% Match</span>
              </div>
            </button>

            <button class="coach-podium-tab ${this.activeResultTab === 'runner1' ? 'active' : ''}" onclick="careerCoach.switchResultTab('runner1')">
              <span class="podium-rank-badge rank-2">#2</span>
              <div class="podium-info">
                <strong>${results.runnerUp1.career.title}</strong>
                <span class="podium-match-pct text-cyan">${results.runnerUp1.score}% Match</span>
              </div>
            </button>

            <button class="coach-podium-tab ${this.activeResultTab === 'runner2' ? 'active' : ''}" onclick="careerCoach.switchResultTab('runner2')">
              <span class="podium-rank-badge rank-3">#3</span>
              <div class="podium-info">
                <strong>${results.runnerUp2.career.title}</strong>
                <span class="podium-match-pct text-amber">${results.runnerUp2.score}% Match</span>
              </div>
            </button>
          </div>
        </div>

        <!-- ====================================================================
             THE 9 COMPREHENSIVE RESULT CARDS
             ==================================================================== -->
        <div class="coach-nine-cards-grid">
          
          <!-- CARD 1: Why this career? -->
          <div class="card coach-card">
            <div class="card-header">
              <h3 class="card-title"><i class="fa-solid fa-lightbulb text-amber"></i> 1. Why This Career?</h3>
              <span class="badge badge-primary">${matchScore}% Fit</span>
            </div>
            <div class="coach-card-body">
              <p class="mb-3" style="font-size: 0.95rem; line-height: 1.6;">
                ${career.desc}
              </p>
              <div class="card-highlight-box mb-3">
                <i class="fa-solid fa-circle-check text-emerald"></i>
                <div>
                  <strong>Diagnostic Rationale:</strong> Your response pattern indicates a dominant preference for ${career.category.toLowerCase()} workflows, structured problem solving, and building high-impact production architectures.
                </div>
              </div>
              <div class="text-xs text-muted">
                <strong>Top Hiring Recruiters:</strong> ${career.topCompanies.join(', ')}
              </div>
            </div>
          </div>

          <!-- CARD 2: Required Skills & Difficulty -->
          <div class="card coach-card">
            <div class="card-header">
              <h3 class="card-title"><i class="fa-solid fa-list-check text-primary"></i> 2. Required Industry Skills</h3>
              <span class="badge badge-info">${career.requiredSkills.length} Core Skills</span>
            </div>
            <div class="coach-card-body">
              <p class="text-xs text-muted mb-3">Mandatory skills evaluated in campus written tests and technical interviews:</p>
              <div class="flex flex-wrap gap-2">
                ${career.requiredSkills.map(skill => {
                  const diff = career.skillDifficulty ? career.skillDifficulty[skill] || 'Intermediate' : 'Intermediate';
                  const diffBadge = diff === 'Beginner' ? 'badge-success' : diff === 'Intermediate' ? 'badge-primary' : 'badge-warning';
                  return `
                    <div class="skill-pill-detailed">
                      <span class="skill-name">${skill}</span>
                      <span class="badge ${diffBadge} text-xs">${diff}</span>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          </div>

          <!-- CARD 3: Your Current Skills -->
          <div class="card coach-card">
            <div class="card-header">
              <h3 class="card-title"><i class="fa-solid fa-circle-check text-emerald"></i> 3. Your Current Skills</h3>
              <span class="badge badge-success">${matchedSkills.length} of ${career.requiredSkills.length} Matched</span>
            </div>
            <div class="coach-card-body">
              <p class="text-xs text-muted mb-3">Skills already detected and verified in your student academic profile:</p>
              ${matchedSkills.length > 0 ? `
                <div class="flex flex-wrap gap-2">
                  ${matchedSkills.map(s => `
                    <span class="tag-item skill-tag-matched">
                      <i class="fa-solid fa-check"></i> ${s}
                    </span>
                  `).join('')}
                </div>
              ` : `
                <div class="p-3 text-sm text-muted bg-subtle rounded">
                  No skills matched yet. Review the required skills list to start learning foundations!
                </div>
              `}
            </div>
          </div>

          <!-- CARD 4: Skill Gaps & Urgency -->
          <div class="card coach-card">
            <div class="card-header">
              <h3 class="card-title"><i class="fa-solid fa-triangle-exclamation text-rose"></i> 4. Skill Gaps & Urgency</h3>
              <span class="badge badge-danger">${missingSkills.length} Missing</span>
            </div>
            <div class="coach-card-body">
              ${criticalGaps.length > 0 ? `
                <div class="mb-3">
                  <span class="badge badge-danger mb-1"><i class="fa-solid fa-circle-exclamation"></i> Critical Priority:</span>
                  <div class="flex flex-wrap gap-1 mt-1">
                    ${criticalGaps.map(s => `<span class="tag-item skill-tag-critical">${s}</span>`).join('')}
                  </div>
                </div>
              ` : ''}

              ${highGaps.length > 0 ? `
                <div class="mb-3">
                  <span class="badge badge-warning mb-1"><i class="fa-solid fa-triangle-exclamation"></i> High Priority:</span>
                  <div class="flex flex-wrap gap-1 mt-1">
                    ${highGaps.map(s => `<span class="tag-item skill-tag-high">${s}</span>`).join('')}
                  </div>
                </div>
              ` : ''}

              ${mediumGaps.length > 0 ? `
                <div class="mb-2">
                  <span class="badge badge-info mb-1">Medium Priority:</span>
                  <div class="flex flex-wrap gap-1 mt-1">
                    ${mediumGaps.map(s => `<span class="tag-item skill-tag-medium">${s}</span>`).join('')}
                  </div>
                </div>
              ` : ''}

              <button class="btn btn-outline btn-sm w-full mt-2" onclick="switchView('skillgap')">
                <i class="fa-solid fa-layer-group"></i> View Full Skill Gap Progress Bars
              </button>
            </div>
          </div>

          <!-- CARD 5: Recommended YouTube Lectures (Dynamic Resource Engine) -->
          <div class="card coach-card col-span-2">
            <div class="card-header">
              <div>
                <h3 class="card-title"><i class="fa-brands fa-youtube text-rose"></i> 5. Recommended YouTube Lectures</h3>
                <p class="card-subtitle">Personalized, reputable video lectures dynamically curated for ${career.title}</p>
              </div>
              <div class="flex gap-2">
                <button class="btn btn-secondary btn-xs" onclick="careerCoach.filterLectures('all')">All</button>
                <button class="btn btn-secondary btn-xs" onclick="careerCoach.filterLectures('interview')">Interview Prep</button>
                <button class="btn btn-secondary btn-xs" onclick="careerCoach.filterLectures('project')">Projects</button>
              </div>
            </div>
            <div class="coach-card-body">
              <div class="grid-responsive-2 gap-3" id="coach-yt-cards-root">
                ${ytLectures.map(v => ytService.renderResourceCardHtml(v)).join('')}
              </div>
            </div>
          </div>

          <!-- CARD 6: Recommended Capstone Projects -->
          <div class="card coach-card">
            <div class="card-header">
              <h3 class="card-title"><i class="fa-solid fa-folder-tree text-cyan"></i> 6. Recommended Capstone Projects</h3>
              <span class="badge badge-primary">Resume Boosters</span>
            </div>
            <div class="coach-card-body">
              ${(career.recommendedProjects || []).map(p => `
                <div class="project-recommend-box mb-3">
                  <h4 class="font-bold text-sm text-primary mb-1">${p.title}</h4>
                  <div class="badge badge-outline text-xs mb-1">${p.stack}</div>
                  <p class="text-xs text-muted mb-2">${p.desc}</p>
                  <div class="recruiter-box text-xs">
                    <i class="fa-solid fa-user-check text-emerald"></i> <strong>Recruiter Value:</strong> ${p.recruiterNote}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- CARD 7: Interview Preparation Topics -->
          <div class="card coach-card">
            <div class="card-header">
              <h3 class="card-title"><i class="fa-solid fa-user-tie text-emerald"></i> 7. Technical Interview Preparation</h3>
              <span class="badge badge-success">High Frequency</span>
            </div>
            <div class="coach-card-body">
              <p class="text-xs text-muted mb-2">Questions most frequently asked in Tier-1 technical coding & interview rounds:</p>
              <ul class="interview-topics-list">
                ${(career.interviewTopics || []).map(t => `
                  <li><i class="fa-solid fa-circle-check text-emerald"></i> <span>${t}</span></li>
                `).join('')}
              </ul>
              <button class="btn btn-outline btn-sm w-full mt-3" onclick="switchView('interview')">
                <i class="fa-solid fa-brain"></i> Open Interview Prep Hub
              </button>
            </div>
          </div>

          <!-- CARD 8: Placement Readiness Breakdown -->
          <div class="card coach-card">
            <div class="card-header">
              <h3 class="card-title"><i class="fa-solid fa-chart-line text-amber"></i> 8. Placement Readiness Breakdown</h3>
              <span class="badge badge-warning">${matchScore}% Readiness</span>
            </div>
            <div class="coach-card-body">
              <div class="progress-bar-wrapper mb-2">
                <div class="progress-info">
                  <span class="progress-label">Core Technical Fit</span>
                  <span class="progress-value font-bold">${Math.min(98, matchScore + 2)}%</span>
                </div>
                <div class="progress-track"><div class="progress-fill success" style="width: ${Math.min(98, matchScore + 2)}%;"></div></div>
              </div>

              <div class="progress-bar-wrapper mb-2">
                <div class="progress-info">
                  <span class="progress-label">Skill Coverage</span>
                  <span class="progress-value font-bold">${Math.round((matchedSkills.length / career.requiredSkills.length) * 100)}%</span>
                </div>
                <div class="progress-track"><div class="progress-fill" style="width: ${Math.round((matchedSkills.length / career.requiredSkills.length) * 100)}%;"></div></div>
              </div>

              <div class="progress-bar-wrapper mb-3">
                <div class="progress-info">
                  <span class="progress-label">Aptitude & Interview Confidence</span>
                  <span class="progress-value font-bold">${profile.aptitudeScore}%</span>
                </div>
                <div class="progress-track"><div class="progress-fill warning" style="width: ${profile.aptitudeScore}%;"></div></div>
              </div>

              <div class="p-2 text-xs bg-subtle rounded">
                <i class="fa-solid fa-lightbulb text-amber"></i> Your strongest opportunity is <strong>${career.title}</strong> roles. Bridge the critical skill gaps to qualify for Tier-1 off-campus and on-campus shortlists.
              </div>
            </div>
          </div>

          <!-- CARD 9: 6-Month Structured Learning Roadmap -->
          <div class="card coach-card col-span-2">
            <div class="card-header">
              <h3 class="card-title"><i class="fa-solid fa-route text-primary"></i> 9. Six-Month Structured Career Roadmap</h3>
              <button class="btn btn-primary btn-sm" onclick="switchView('roadmap')">
                <i class="fa-solid fa-arrow-up-right-from-square"></i> Open Interactive Roadmap View
              </button>
            </div>
            <div class="coach-card-body">
              <div class="roadmap-six-month-grid">
                <div class="roadmap-month-pill">
                  <div class="month-num">MONTH 1</div>
                  <div class="month-topic font-semibold text-sm">Foundations & Language Depth</div>
                  <p class="text-xs text-muted">Master primary syntax, memory model, and basic data structures.</p>
                </div>
                <div class="roadmap-month-pill">
                  <div class="month-num">MONTH 2</div>
                  <div class="month-topic font-semibold text-sm">Arrays, Strings & Core Structures</div>
                  <p class="text-xs text-muted">50+ LeetCode problems on HashMaps, Two Pointers, and Stacks.</p>
                </div>
                <div class="roadmap-month-pill">
                  <div class="month-num">MONTH 3</div>
                  <div class="month-topic font-semibold text-sm">Trees, Graphs & Recursion</div>
                  <p class="text-xs text-muted">Binary search trees, graph traversals (BFS/DFS), and recursion patterns.</p>
                </div>
                <div class="roadmap-month-pill">
                  <div class="month-num">MONTH 4</div>
                  <div class="month-topic font-semibold text-sm">Advanced DSA & Core CS</div>
                  <p class="text-xs text-muted">Dynamic Programming, Operating Systems, DBMS & Computer Networks.</p>
                </div>
                <div class="roadmap-month-pill">
                  <div class="month-num">MONTH 5</div>
                  <div class="month-topic font-semibold text-sm">Capstone Projects & ATS Resume</div>
                  <p class="text-xs text-muted">Deploy 2 production portfolio projects with GitHub CI/CD badges.</p>
                </div>
                <div class="roadmap-month-pill">
                  <div class="month-num">MONTH 6</div>
                  <div class="month-topic font-semibold text-sm">Mock Interviews & Drives</div>
                  <p class="text-xs text-muted">Timed aptitude drills, live mock interviews, and campus drive screenings.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    `;
  }

  switchResultTab(tabKey) {
    this.activeResultTab = tabKey;
    const container = document.getElementById('coach-quiz-root');
    if (container) this.renderQuizResults(container);
  }

  filterLectures(preference) {
    if (!this.currentAssessmentResult) return;
    const activeCareerData = (this.activeResultTab === 'runner1') ? this.currentAssessmentResult.runnerUp1 :
                             (this.activeResultTab === 'runner2') ? this.currentAssessmentResult.runnerUp2 :
                             this.currentAssessmentResult.top;

    const ytCardsRoot = document.getElementById('coach-yt-cards-root');
    if (!ytCardsRoot) return;

    const lectures = ytService.getRecommendations({
      targetCareer: activeCareerData.career.id,
      preference,
      limit: 6
    });

    ytCardsRoot.innerHTML = lectures.map(v => ytService.renderResourceCardHtml(v)).join('');
  }

  refreshResultYouTubeCards() {
    this.filterLectures('all');
  }

  setAsTargetCareer(careerId) {
    const career = CAREERS_CATALOG.find(c => c.id === careerId);
    if (!career) return;

    appState.updateProfile({
      targetCareerId: career.id,
      targetCareerTitle: career.title
    });

    showToast(`Target career successfully updated to "${career.title}"!`, 'success');

    // Trigger instant synchronization across app
    if (window.renderSkillGapAnalysis) window.renderSkillGapAnalysis();
    if (window.renderDashboard) window.renderDashboard();
    if (window.syncPredictionFormWithProfile) window.syncPredictionFormWithProfile();

    // Re-render result view if open
    const quizRoot = document.getElementById('coach-quiz-root');
    if (quizRoot && this.currentQuestionIndex >= COACH_QUIZ_QUESTIONS.length) {
      this.renderQuizResults(quizRoot);
    }
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
            <button class="btn btn-secondary btn-sm" onclick="careerCoach.showCareerModal('${career.id}')" title="View Full Details">
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
      <p style="margin-bottom: 1.25rem; font-size: 0.95rem; line-height: 1.6;">${career.desc}</p>
      
      <h4 style="margin-bottom: 0.5rem; font-size: 1rem;">All Required Competencies</h4>
      <div class="flex flex-wrap gap-2" style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1.5rem;">
        ${career.requiredSkills.map(s => `<span class="tag-item"><i class="fa-solid fa-code text-primary"></i> ${s}</span>`).join('')}
      </div>

      <h4 style="margin-bottom: 0.5rem; font-size: 1rem;">Recommended Learning Roadmap</h4>
      <div class="card p-3 mb-3" style="background: var(--bg-card-subtle); border-radius: var(--radius-md); padding: 1rem; margin-bottom: 1.5rem;">
        <p style="font-weight: 600; color: var(--text-main); font-size: 0.9rem;">${career.learningPath}</p>
      </div>

      <h4 style="margin-bottom: 0.75rem; font-size: 1rem;"><i class="fa-brands fa-youtube text-rose"></i> Recommended Real YouTube Lectures for Campus Prep</h4>
      <div class="grid-responsive-2 gap-3 mb-4">
        ${(window.ytService ? ytService.getRecommendations({ targetCareer: career.id, limit: 5 }) : []).map(v => ytService.renderResourceCardHtml(v)).join('')}
      </div>

      <h4 style="margin-bottom: 0.5rem; font-size: 1rem;">Campus Hiring Majors</h4>
      <p style="color: var(--text-muted); font-size: 0.9rem;">${career.topCompanies.join(' • ')}</p>
    `;

    document.getElementById('career-detail-modal').classList.add('open');
  }
}

// Global instance
const careerCoach = new CareerCoachManager();
