/**
 * SMART PLACEMENT PREDICTION & CAREER COACH
 * Interview Preparation Hub: Aptitude Quiz, Tech Flashcards, HR STAR Guide, & Mock Simulator
 */

// Aptitude Question Bank
const APTITUDE_BANK = [
  {
    id: 1,
    category: 'Quantitative',
    question: 'A train running at 72 km/hr crosses a bridge of length 250 meters in 25 seconds. What is the length of the train in meters?',
    options: [
      '200 meters',
      '250 meters',
      '300 meters',
      '150 meters'
    ],
    correctIndex: 1,
    explanation: 'Speed = 72 * (5/18) = 20 m/s. Total distance in 25 seconds = 20 * 25 = 500 meters. Length of train = Total distance - Bridge length = 500 - 250 = 250 meters.'
  },
  {
    id: 2,
    category: 'Logical Reasoning',
    question: 'Find the next number in the sequence: 4, 9, 25, 49, 121, ___ ?',
    options: [
      '144',
      '169',
      '196',
      '225'
    ],
    correctIndex: 1,
    explanation: 'The series consists of squares of consecutive prime numbers: 2²=4, 3²=9, 5²=25, 7²=49, 11²=121. The next prime number is 13, and 13² = 169.'
  },
  {
    id: 3,
    category: 'Quantitative',
    question: 'A and B can complete a work in 12 days and 18 days respectively. If they work together, in how many days will the work be finished?',
    options: [
      '6.8 days',
      '7.2 days',
      '8.0 days',
      '9.5 days'
    ],
    correctIndex: 1,
    explanation: 'Work done together per day = 1/12 + 1/18 = (3+2)/36 = 5/36. Total days = 36/5 = 7.2 days.'
  },
  {
    id: 4,
    category: 'Verbal Ability',
    question: 'Select the synonym of the word: "EPHEMERAL"',
    options: [
      'Permanent',
      'Transient',
      'Gigantic',
      'Fragile'
    ],
    correctIndex: 1,
    explanation: 'Ephemeral means lasting for a very short time. The exact synonym is "Transient" or fleeting.'
  },
  {
    id: 5,
    category: 'Logical Reasoning',
    question: 'In a code, COMPUTER is written as RFUVQNPC. How will MEDICINE be written in that code?',
    options: [
      'EOJDJEFM',
      'EOJDEJFM',
      'MFEJDJOE',
      'EOJDJFEM'
    ],
    correctIndex: 0,
    explanation: 'The first and last letters are swapped and written backwards with intermediate letters incremented by +1.'
  }
];

// Technical Interview Bank
const TECHNICAL_QUESTIONS = [
  {
    id: 'tech-1',
    subject: 'Data Structures & Algorithms',
    q: 'Explain the difference between HashMap and TreeMap in Java, and their time complexities.',
    a: 'HashMap is backed by a hash table with average O(1) time complexity for insertion, search, and deletion. It does not maintain key ordering. TreeMap is backed by a Red-Black Tree (Self-balancing BST) guaranteeing O(log N) time for operations and maintains keys in natural ascending sorted order.'
  },
  {
    id: 'tech-2',
    subject: 'Database Management Systems (DBMS)',
    q: 'What are the ACID properties in database transactions and why are they critical?',
    a: 'Atomicity (all or nothing execution), Consistency (database transitions from one valid state to another obeying all constraints), Isolation (concurrent transactions execute independently without interference), and Durability (committed transactions survive system crashes). Crucial for financial and high-concurrency systems.'
  },
  {
    id: 'tech-3',
    subject: 'Operating Systems (OS)',
    q: 'What is a Deadlock? Name the 4 Coffman conditions required for deadlock to occur.',
    a: 'A deadlock is a state where a set of processes are blocked because each holds a resource and waits for another resource held by another process. The 4 conditions are: 1) Mutual Exclusion, 2) Hold and Wait, 3) No Preemption, 4) Circular Wait. Deadlock can be avoided using Bankers Algorithm or resource ordering.'
  },
  {
    id: 'tech-4',
    subject: 'Computer Networks (CN)',
    q: 'What happens behind the scenes when you type a URL into a web browser and hit Enter?',
    a: '1) Browser checks DNS cache → 2) DNS resolver performs query to get IP address → 3) Browser establishes TCP 3-way handshake (SYN, SYN-ACK, ACK) with server (and TLS handshake for HTTPS) → 4) Browser sends HTTP GET request → 5) Server responds with HTTP status (e.g., 200 OK) and HTML payload → 6) Browser parses DOM/CSSOM and renders page.'
  },
  {
    id: 'tech-5',
    subject: 'Object Oriented Programming (OOP)',
    q: 'What is the difference between Method Overloading and Method Overriding?',
    a: 'Overloading (Compile-time / Static polymorphism): same method name with different argument lists within the same class. Overriding (Run-time / Dynamic polymorphism): a subclass provides a specific implementation of a method already defined in its parent class with the exact same method signature.'
  }
];

// HR & Behavioral Star Framework Guide
const HR_QUESTIONS = [
  {
    id: 'hr-1',
    question: 'Tell me about yourself and your journey so far.',
    strategy: 'Present-Past-Future Model',
    tip: 'Keep it to 90 seconds. Focus 50% on your current technical strengths & projects, 30% on key academic milestones, and 20% on why you are excited for this specific company.',
    sample: '"I am a final-year Computer Science student passionate about building scalable web applications and solving algorithmic problems. Over the past year, I have completed an internship at NexTech where I optimized backend REST services, and built a full-stack campus portal used by over 800 students. I am excited about joining your team because of your innovative work in high-scale cloud infrastructure."'
  },
  {
    id: 'hr-2',
    question: 'Tell me about a time you faced a difficult conflict within a team project and how you resolved it.',
    strategy: 'STAR Technique (Situation, Task, Action, Result)',
    tip: 'Never blame teammates. Focus on communication, objective decision-making, and collective delivery.',
    sample: '"(Situation) During our 36-hour hackathon, our team was divided on choosing between MongoDB and PostgreSQL. (Task) As the backend lead, I needed to align everyone quickly to avoid missing the submission deadline. (Action) I listed our read/write performance needs on a whiteboard and conducted a 10-minute vote based on technical requirements rather than preference. (Result) We agreed on PostgreSQL, finished the prototype 2 hours early, and won 2nd place in the competition."'
  },
  {
    id: 'hr-3',
    question: 'Why should we hire you over other candidates with higher CGPAs?',
    strategy: 'Value-Proposition & Practical Impact',
    tip: 'Acknowledge academic importance, then highlight your self-driven curiosity, production-ready code, and speed of learning.',
    sample: '"While strong academic grades are important, my greatest strength is transforming theoretical CS concepts into production-grade applications. Beyond coursework, I have built real deployed projects, contributed to open-source libraries, and consistently solved 200+ LeetCode problems. I can hit the ground running with minimal hand-holding."'
  }
];

// Mock Simulator Questions
const MOCK_QUESTIONS = [
  {
    id: 1,
    role: 'Technical',
    question: 'Explain how indexing improves database search performance, and what are the trade-offs on INSERT and UPDATE operations?',
    keywords: ['b-tree', 'lookup', 'latency', 'overhead', 'write', 'index', 'disk', 'slow', 'binary'],
    sampleGood: 'Indexes create data structures (like B-Trees) allowing logarithmic search time instead of full table scans. However, on INSERT or UPDATE, each index must also be recalculated and updated, adding write overhead and consuming additional disk storage.'
  },
  {
    id: 2,
    role: 'System Design',
    question: 'How would you handle sudden high traffic spikes in a web application without crashing the database?',
    keywords: ['cache', 'redis', 'queue', 'kafka', 'load balancer', 'rate limit', 'replica', 'connection pool'],
    sampleGood: 'Implement an in-memory caching layer using Redis for read queries, place an asynchronous message queue like RabbitMQ or Kafka for batching writes, utilize database read replicas, and apply API rate limiting.'
  },
  {
    id: 3,
    role: 'HR Behavioral',
    question: 'Describe a situation where a project requirement changed at the last minute. How did you adapt?',
    keywords: ['adapt', 'prioritize', 'communicate', 'deadline', 'agile', 'deliver', 'pivot', 'team'],
    sampleGood: 'I remained calm, immediately reassessed our remaining sprint tasks, communicated openly with stakeholders on trade-offs, and focused our team on delivering the highest-impact core features first.'
  }
];

class InterviewPrepManager {
  constructor() {
    this.currentAptitudeIndex = 0;
    this.aptitudeScore = 0;
    this.aptitudeAnswered = {};
    this.currentMockIndex = 0;
  }

  init() {
    this.renderAptitudeQuiz();
    this.renderTechnicalCards();
    this.renderHRAccordion();
    this.setupMockSimulator();
  }

  // --- APTITUDE QUIZ ---
  renderAptitudeQuiz() {
    const root = document.getElementById('aptitude-quiz-root');
    if (!root) return;

    if (this.currentAptitudeIndex >= APTITUDE_BANK.length) {
      root.innerHTML = `
        <div class="card p-4 text-center" style="border: 2px solid var(--accent-emerald); background: var(--bg-card); border-radius: var(--radius-xl); padding: 2rem;">
          <div class="badge badge-success mb-2" style="margin-bottom: 0.5rem;">Quiz Completed</div>
          <h2 class="text-2xl mb-2" style="margin-bottom: 0.5rem;">Your Aptitude Score: <span class="text-gradient">${this.aptitudeScore} / ${APTITUDE_BANK.length}</span></h2>
          <p class="text-muted mb-4" style="margin-bottom: 1.5rem;">
            ${this.aptitudeScore >= 4 ? '🎉 Great aptitude readiness! You meet the cutoff for 90% of campus testing portals.' : '⚠️ Aptitude needs more practice. Try solving 10 speed math questions daily.'}
          </p>
          <button class="btn btn-primary" onclick="interviewManager.restartAptitudeQuiz()">
            <i class="fa-solid fa-rotate"></i> Retake Practice Quiz
          </button>
        </div>
      `;
      // Save score
      appState.updateQuizScore('aptitude', this.aptitudeScore, APTITUDE_BANK.length);
      return;
    }

    const q = APTITUDE_BANK[this.currentAptitudeIndex];
    const isAnswered = this.aptitudeAnswered[q.id] !== undefined;
    const selectedIdx = this.aptitudeAnswered[q.id];

    root.innerHTML = `
      <div class="quiz-card-box">
        <div class="flex items-center justify-between mb-3" style="display: flex; justify-content: space-between; margin-bottom: 1rem;">
          <span class="badge badge-info">${q.category}</span>
          <span class="text-sm font-semibold" style="color: var(--text-muted);">Question ${this.currentAptitudeIndex + 1} of ${APTITUDE_BANK.length}</span>
        </div>
        <h3 class="text-lg mb-4" style="margin-bottom: 1.5rem;">${q.question}</h3>
        
        <div class="grid gap-2 mb-4" style="display: grid; gap: 0.75rem; margin-bottom: 1.5rem;">
          ${q.options.map((opt, idx) => {
            let stateClass = '';
            let icon = '<i class="fa-regular fa-circle"></i>';
            if (isAnswered) {
              if (idx === q.correctIndex) {
                stateClass = 'correct';
                icon = '<i class="fa-solid fa-circle-check"></i>';
              } else if (idx === selectedIdx) {
                stateClass = 'incorrect';
                icon = '<i class="fa-solid fa-circle-xmark"></i>';
              }
            }
            return `
              <button class="quiz-option-btn ${stateClass}" 
                      ${isAnswered ? 'disabled' : ''} 
                      onclick="interviewManager.answerAptitude(${idx})">
                <span>${opt}</span>
                ${icon}
              </button>
            `;
          }).join('')}
        </div>

        ${isAnswered ? `
          <div class="card p-3 mb-4" style="background: var(--bg-card-subtle); border-radius: var(--radius-md); padding: 1rem; margin-bottom: 1.25rem;">
            <h5 style="font-size: 0.85rem; font-weight: 700; color: var(--primary); margin-bottom: 0.35rem;"><i class="fa-solid fa-circle-info"></i> Explanation:</h5>
            <p style="font-size: 0.85rem; color: var(--text-muted);">${q.explanation}</p>
          </div>
          <div class="flex justify-end" style="display: flex; justify-content: flex-end;">
            <button class="btn btn-primary btn-sm" onclick="interviewManager.nextAptitudeQuestion()">
              ${this.currentAptitudeIndex + 1 === APTITUDE_BANK.length ? 'View Final Results' : 'Next Question <i class="fa-solid fa-arrow-right"></i>'}
            </button>
          </div>
        ` : ''}
      </div>
    `;
  }

  answerAptitude(selectedOptionIdx) {
    const q = APTITUDE_BANK[this.currentAptitudeIndex];
    this.aptitudeAnswered[q.id] = selectedOptionIdx;
    if (selectedOptionIdx === q.correctIndex) {
      this.aptitudeScore++;
    }
    this.renderAptitudeQuiz();
  }

  nextAptitudeQuestion() {
    this.currentAptitudeIndex++;
    this.renderAptitudeQuiz();
  }

  restartAptitudeQuiz() {
    this.currentAptitudeIndex = 0;
    this.aptitudeScore = 0;
    this.aptitudeAnswered = {};
    this.renderAptitudeQuiz();
  }

  // --- TECHNICAL QUESTIONS ---
  renderTechnicalCards() {
    const root = document.getElementById('tech-questions-root');
    if (!root) return;

    root.innerHTML = TECHNICAL_QUESTIONS.map(item => `
      <div class="accordion-item" id="accordion-${item.id}">
        <div class="accordion-header" onclick="interviewManager.toggleAccordion('accordion-${item.id}')">
          <div>
            <span class="badge badge-primary text-xs" style="margin-bottom: 0.35rem;">${item.subject}</span>
            <div style="font-size: 1rem; font-weight: 600;">${item.q}</div>
          </div>
          <i class="fa-solid fa-chevron-down accordion-arrow"></i>
        </div>
        <div class="accordion-body">
          <p style="line-height: 1.6; margin-top: 0.5rem;">${item.a}</p>
        </div>
      </div>
    `).join('');
  }

  // --- HR GUIDE ---
  renderHRAccordion() {
    const root = document.getElementById('hr-questions-root');
    if (!root) return;

    root.innerHTML = HR_QUESTIONS.map(item => `
      <div class="accordion-item" id="accordion-${item.id}">
        <div class="accordion-header" onclick="interviewManager.toggleAccordion('accordion-${item.id}')">
          <div>
            <span class="badge badge-warning text-xs" style="margin-bottom: 0.35rem;">Strategy: ${item.strategy}</span>
            <div style="font-size: 1rem; font-weight: 600;">${item.question}</div>
          </div>
          <i class="fa-solid fa-chevron-down accordion-arrow"></i>
        </div>
        <div class="accordion-body">
          <div style="margin-bottom: 0.75rem; color: var(--primary); font-size: 0.85rem; font-weight: 600;">
            <i class="fa-solid fa-lightbulb"></i> Pro-Tip: ${item.tip}
          </div>
          <div class="card p-3" style="background: var(--bg-card-subtle); border-radius: var(--radius-md); padding: 0.85rem; font-style: italic; font-size: 0.875rem;">
            <strong>Sample Winning Answer:</strong><br>${item.sample}
          </div>
        </div>
      </div>
    `).join('');
  }

  toggleAccordion(elemId) {
    const el = document.getElementById(elemId);
    if (el) el.classList.toggle('active');
  }

  // --- MOCK SIMULATOR ---
  setupMockSimulator() {
    const currentQ = MOCK_QUESTIONS[this.currentMockIndex];
    const qElem = document.getElementById('mock-current-question');
    if (qElem) qElem.innerText = currentQ.question;

    const roleElem = document.getElementById('mock-role-badge');
    if (roleElem) roleElem.innerText = `${currentQ.role} Round (${this.currentMockIndex + 1} of ${MOCK_QUESTIONS.length})`;
  }

  submitMockAnswer() {
    const inputElem = document.getElementById('mock-candidate-input');
    if (!inputElem) return;

    const text = inputElem.value.trim();
    if (text.length < 15) {
      showToast('Please provide a more detailed answer (at least 15 characters).', 'warning');
      return;
    }

    const currentQ = MOCK_QUESTIONS[this.currentMockIndex];
    const lowerText = text.toLowerCase();

    // Check keyword presence
    let matchedKeywords = 0;
    currentQ.keywords.forEach(kw => {
      if (lowerText.includes(kw)) matchedKeywords++;
    });

    const keywordRatio = matchedKeywords / Math.min(currentQ.keywords.length, 5);
    const lengthScore = Math.min(1, text.length / 180);
    const score = Math.round(Math.min(95, Math.max(45, (keywordRatio * 60) + (lengthScore * 40))));

    // Append to chat
    const chatContainer = document.getElementById('mock-chat-messages');
    if (chatContainer) {
      chatContainer.innerHTML += `
        <div class="mock-bubble candidate animate-fade-in">
          <strong>You:</strong><br>${escapeHtml(text)}
        </div>
        <div class="mock-bubble interviewer animate-fade-in">
          <div class="flex items-center gap-2 mb-1" style="display: flex; gap: 0.5rem; margin-bottom: 0.25rem;">
            <i class="fa-solid fa-robot text-primary"></i>
            <strong>AI Placement Evaluator Feedback (Score: ${score}/100):</strong>
          </div>
          <p style="font-size: 0.85rem; margin-bottom: 0.5rem;">
            ${score >= 80 ? '🌟 Outstanding response! You articulated core concepts and covered crucial terminology.' : '💡 Decent response, but you could enhance it by mentioning: ' + currentQ.keywords.slice(0, 3).join(', ') + '.'}
          </p>
          <div style="font-size: 0.8rem; background: var(--bg-card); padding: 0.5rem; border-radius: var(--radius-sm); border: 1px dashed var(--border-color);">
            <strong>Exemplary reference answer:</strong><br>${currentQ.sampleGood}
          </div>
        </div>
      `;
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    // Save attempt
    appState.saveInterviewAttempt({
      date: new Date().toISOString().split('T')[0],
      role: currentQ.role,
      score: score,
      feedback: `Score: ${score}/100. Keywords matched: ${matchedKeywords}.`
    });

    showToast(`Interview response evaluated: ${score}/100!`, 'success');
    inputElem.value = '';

    // Advance to next question after delay
    if (this.currentMockIndex + 1 < MOCK_QUESTIONS.length) {
      this.currentMockIndex++;
      setTimeout(() => {
        this.setupMockSimulator();
        const chatContainer = document.getElementById('mock-chat-messages');
        if (chatContainer) {
          chatContainer.innerHTML += `
            <div class="mock-bubble interviewer animate-fade-in" style="margin-top: 0.5rem;">
              <strong>Interviewer (Next Question):</strong><br>${MOCK_QUESTIONS[this.currentMockIndex].question}
            </div>
          `;
          chatContainer.scrollTop = chatContainer.scrollHeight;
        }
      }, 1500);
    } else {
      showToast('Mock session completed! All questions evaluated.', 'success');
    }
  }
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.innerText = text;
  return div.innerHTML;
}

const interviewManager = new InterviewPrepManager();
