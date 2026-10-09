/**
 * CareerPulse.AI – Personalized Career Roadmap Module
 * 
 * Generates an end-to-end 6-Month Structured Timeline based on:
 * - Current Student Skills
 * - Target Role (SDE, Web Dev, Data, AI/ML, DevOps, Cyber)
 * - Placement Date / Timeline
 * - Weekly Study Hours (10h, 15h, 25h)
 * 
 * Each roadmap milestone contains:
 * - Learning objective
 * - Skills covered
 * - Recommended YouTube lectures (with direct links)
 * - Practice problems (with LeetCode / GFG practice links)
 * - Capstone project to build
 * - High-frequency interview questions
 * - Interactive completion status checkbox
 */

const SIX_MONTH_ROADMAP_MASTER = [
  {
    monthNum: 1,
    title: 'MONTH 1: Programming & DSA Fundamentals',
    duration: 'Month 1 (Weeks 1 - 4)',
    objective: 'Establish deep programming syntax fluency, memory management, and fundamental problem-solving habits.',
    skills: ['C++ / Java / Python', 'OOP Principles', 'Basic Math for Coding', 'Time & Space Complexity', 'Git & GitHub'],
    youtubeLectures: [
      { title: 'DSA Roadmap & Asymptotic Notations', url: 'https://www.youtube.com/watch?v=0bHoB35fCmg', channel: 'take U forward' },
      { title: 'OOP Principles in Depth with Real Code', url: 'https://www.youtube.com/watch?v=SiBw7HN_tOI', channel: 'freeCodeCamp' }
    ],
    practiceProblems: [
      { name: 'Two Sum (LeetCode #1)', link: 'https://leetcode.com/problems/two-sum/' },
      { name: 'Valid Palindrome (LeetCode #125)', link: 'https://leetcode.com/problems/valid-palindrome/' },
      { name: 'Fibonacci Number (LeetCode #509)', link: 'https://leetcode.com/problems/fibonacci-number/' }
    ],
    project: {
      title: 'Console-Based Banking / Management System',
      desc: 'Build OOP-structured console app implementing encapsulation, file persistence, and robust exception handling.'
    },
    interviewQuestions: [
      'Explain difference between Stack and Heap memory.',
      'What are the 4 pillars of Object Oriented Programming?',
      'Why is Time Complexity important for campus online screenings?'
    ],
    milestones: [
      { id: 'm1_1', title: 'Master Language Syntax & Standard Libraries (STL / Collections)' },
      { id: 'm1_2', title: 'Solve 25 Easy Problems on Arrays, Strings & Math' },
      { id: 'm1_3', title: 'Configure Git version control and publish 1st repository to GitHub' }
    ]
  },
  {
    monthNum: 2,
    title: 'MONTH 2: Arrays + Strings + Linked Lists',
    duration: 'Month 2 (Weeks 5 - 8)',
    objective: 'Master linear data structures, two-pointer techniques, sliding windows, and fast-slow pointer algorithms.',
    skills: ['Arrays', 'Strings', 'HashMaps', 'Two Pointers', 'Sliding Window', 'Linked Lists'],
    youtubeLectures: [
      { title: 'Arrays & Two Pointers Masterclass', url: 'https://www.youtube.com/watch?v=KLlXCFG5TnA', channel: 'NeetCode' },
      { title: 'Linked Lists from Scratch to Advanced', url: 'https://www.youtube.com/watch?v=0IAPZzGSbME', channel: 'Abdul Bari' }
    ],
    practiceProblems: [
      { name: 'Best Time to Buy and Sell Stock (LeetCode #121)', link: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/' },
      { name: 'Longest Substring Without Repeating Characters (LeetCode #3)', link: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/' },
      { name: 'Reverse Linked List (LeetCode #206)', link: 'https://leetcode.com/problems/reverse-linked-list/' },
      { name: 'Linked List Cycle Detection (LeetCode #141)', link: 'https://leetcode.com/problems/linked-list-cycle/' }
    ],
    project: {
      title: 'Custom In-Memory Cache with LRU Eviction',
      desc: 'Implement Least Recently Used (LRU) Cache using Doubly Linked List and HashMap with O(1) operations.'
    },
    interviewQuestions: [
      'How does HashMap handle collisions internally (Separate Chaining vs Open Addressing)?',
      'Explain Floyd Cycle-Finding Algorithm (Tortoise and Hare).',
      'Compare Array vs Linked List in terms of memory cache locality.'
    ],
    milestones: [
      { id: 'm2_1', title: 'Solve 30 LeetCode Mediums on Two Pointers & Sliding Window' },
      { id: 'm2_2', title: 'Implement Singly & Doubly Linked List operations from scratch' },
      { id: 'm2_3', title: 'Complete LRU Cache Implementation (LeetCode #146)' }
    ]
  },
  {
    monthNum: 3,
    title: 'MONTH 3: Trees + Graphs + Recursion',
    duration: 'Month 3 (Weeks 9 - 12)',
    objective: 'Conquer hierarchical and network structures: Binary Trees, BSTs, Graph traversals (BFS, DFS), and backtracking.',
    skills: ['Binary Trees', 'Binary Search Trees', 'Graphs (BFS/DFS)', 'Dijkstra Algorithm', 'Backtracking'],
    youtubeLectures: [
      { title: 'Binary Trees & Traversals Complete Course', url: 'https://www.youtube.com/watch?v=0bHoB35fCmg', channel: 'take U forward' },
      { title: 'Graph Algorithms: BFS, DFS, Dijkstra, Topo Sort', url: 'https://www.youtube.com/watch?v=0IAPZzGSbME', channel: 'Abdul Bari' }
    ],
    practiceProblems: [
      { name: 'Invert Binary Tree (LeetCode #226)', link: 'https://leetcode.com/problems/invert-binary-tree/' },
      { name: 'Lowest Common Ancestor in BST (LeetCode #235)', link: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/' },
      { name: 'Number of Islands (LeetCode #200)', link: 'https://leetcode.com/problems/number-of-islands/' },
      { name: 'Course Schedule Topological Sort (LeetCode #207)', link: 'https://leetcode.com/problems/course-schedule/' }
    ],
    project: {
      title: 'Social Network Graph Visualizer & Shortest Path Engine',
      desc: 'Interactive network graph finding mutual connections, degrees of separation, and shortest path using Dijkstra algorithm.'
    },
    interviewQuestions: [
      'Difference between Pre-order, In-order, and Post-order Tree Traversals.',
      'Explain when to choose BFS over DFS in graph problem scenarios.',
      'What is a Self-Balancing BST (AVL / Red-Black Tree) and why is it needed?'
    ],
    milestones: [
      { id: 'm3_1', title: 'Master In-order, Pre-order, Post-order & Level Order Tree Traversals' },
      { id: 'm3_2', title: 'Solve 25 Graph problems (BFS, DFS, Cycle Detection, Topological Sort)' },
      { id: 'm3_3', title: 'Implement Backtracking for N-Queens or Sudoku Solver' }
    ]
  },
  {
    monthNum: 4,
    title: 'MONTH 4: Advanced DSA + Core CS Subjects',
    duration: 'Month 4 (Weeks 13 - 16)',
    objective: 'Master Dynamic Programming patterns and master the 4 core CS subjects: OS, DBMS, Computer Networks, and System Design basics.',
    skills: ['Dynamic Programming', 'Operating Systems', 'DBMS & SQL', 'Computer Networks', 'System Design Basics'],
    youtubeLectures: [
      { title: 'Dynamic Programming Patterns Explained', url: 'https://www.youtube.com/watch?v=KLlXCFG5TnA', channel: 'NeetCode' },
      { title: 'Operating Systems & DBMS for Placements', url: 'https://www.youtube.com/watch?v=kBdlM6hNDAE', channel: 'Gate Smashers' }
    ],
    practiceProblems: [
      { name: 'Climbing Stairs (LeetCode #70)', link: 'https://leetcode.com/problems/climbing-stairs/' },
      { name: 'Coin Change (LeetCode #322)', link: 'https://leetcode.com/problems/coin-change/' },
      { name: 'Longest Common Subsequence (LeetCode #1143)', link: 'https://leetcode.com/problems/longest-common-subsequence/' },
      { name: 'SQL Query Challenges (HackerRank)', link: 'https://www.hackerrank.com/domains/sql' }
    ],
    project: {
      title: 'Relational Database Schema & Query Optimization Engine',
      desc: 'Design normalized schema (3NF) for e-commerce, add indexes, write complex subqueries, and benchmark latency.'
    },
    interviewQuestions: [
      'Explain ACID properties and transaction isolation levels in DBMS.',
      'What is a Deadlock and what are the 4 Coffman conditions?',
      'Explain the TCP 3-Way Handshake and differences between TCP and UDP.'
    ],
    milestones: [
      { id: 'm4_1', title: 'Solve 20 Dynamic Programming problems (1D & 2D Memoization)' },
      { id: 'm4_2', title: 'Complete revision of OS (Processes, Threads, Semaphores, Paging)' },
      { id: 'm4_3', title: 'Complete revision of DBMS (Normalization, Indexes, ACID, Joins)' }
    ]
  },
  {
    monthNum: 5,
    title: 'MONTH 5: Capstone Projects + ATS Resume',
    duration: 'Month 5 (Weeks 17 - 20)',
    objective: 'Build 2 full-scale portfolio projects with live deployments, optimize ATS resume keyword density, and configure GitHub showcases.',
    skills: ['Full Stack Development', 'REST APIs', 'Cloud Deployment (AWS/Vercel)', 'ATS Resume Formatting', 'Portfolio Polish'],
    youtubeLectures: [
      { title: 'Build Full-Stack MERN / Spring Boot Project', url: 'https://www.youtube.com/watch?v=-0exw-9YJBo', channel: 'Traversy Media' },
      { title: 'ATS Resume Secrets for Software Engineers', url: 'https://www.youtube.com/watch?v=nu_pCVPKzTk', channel: 'Hitesh Choudhary' }
    ],
    practiceProblems: [
      { name: 'Design Twitter (LeetCode #355)', link: 'https://leetcode.com/problems/design-twitter/' },
      { name: 'LRU Cache Design (LeetCode #146)', link: 'https://leetcode.com/problems/lru-cache/' }
    ],
    project: {
      title: 'Production Full-Stack Capstone Project',
      desc: 'Deploy full-stack web/mobile app with JWT auth, database persistence, and live domain on Vercel/AWS.'
    },
    interviewQuestions: [
      'Walk me through the architecture of your primary capstone project.',
      'How did you handle authentication and database security in your application?',
      'If your application experienced a 100x traffic spike, what would break first?'
    ],
    milestones: [
      { id: 'm5_1', title: 'Deploy Capstone Project 1 with live URL and clear README' },
      { id: 'm5_2', title: 'Deploy Capstone Project 2 with CI/CD automated pipeline' },
      { id: 'm5_3', title: 'Score 80+ on CareerPulse.AI ATS Resume Analyzer' }
    ]
  },
  {
    monthNum: 6,
    title: 'MONTH 6: Mock Interviews + Placement Applications',
    duration: 'Month 6 (Weeks 21 - 24)',
    objective: 'Conduct simulated technical mock interviews, master speed aptitude tests, and convert campus placement opportunities into dream offers.',
    skills: ['Live Coding Speed', 'Mock Technical Rounds', 'HR STAR Framework', 'Aptitude Tests', 'Salary Negotiation'],
    youtubeLectures: [
      { title: 'Google & Amazon Mock Coding Interview', url: 'https://www.youtube.com/watch?v=KLlXCFG5TnA', channel: 'NeetCode' },
      { title: 'HR & Behavioral Interview STAR Framework', url: 'https://www.youtube.com/watch?v=0bHoB35fCmg', channel: 'Career Coach' }
    ],
    practiceProblems: [
      { name: 'Simulate 60-min HackerRank Timed Test', link: 'https://www.hackerrank.com/' },
      { name: 'Take CareerPulse.AI Aptitude Drill', link: '#interview' }
    ],
    project: {
      title: 'Interview System Whiteboard & STAR Response Playbook',
      desc: 'Compiled document of 20 STAR behavioral responses and 5 system design blueprints ready for live defense.'
    },
    interviewQuestions: [
      'Tell me about a time you resolved a difficult technical bug under pressure.',
      'Why should our company hire you over other qualified candidates?',
      'Where do you see yourself in 3 years as a software engineer?'
    ],
    milestones: [
      { id: 'm6_1', title: 'Complete 5 simulated full-length technical mock interviews' },
      { id: 'm6_2', title: 'Score 85%+ on timed aptitude drills in Interview Prep Hub' },
      { id: 'm6_3', title: 'Submit 20+ verified applications for campus & off-campus drives' }
    ]
  }
];

class RoadmapManager {
  constructor() {
    this.selectedHours = 15; // 10, 15, 25 hours per week
    this.selectedMonths = 6;
  }

  renderRoadmapView() {
    const container = document.getElementById('roadmap-timeline-root');
    if (!container) return;

    const checkedState = appState.getRoadmapChecklist();
    const profile = appState.getProfile();
    const targetCareer = CAREERS_CATALOG.find(c => c.id === profile.targetCareerId) || CAREERS_CATALOG[0];

    // Compute progress
    let totalMilestones = 0;
    let completedMilestones = 0;

    SIX_MONTH_ROADMAP_MASTER.forEach(month => {
      month.milestones.forEach(m => {
        totalMilestones++;
        if (checkedState[m.id]) completedMilestones++;
      });
    });

    const percent = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;

    // Update Progress header
    const progressText = document.getElementById('roadmap-progress-text');
    if (progressText) progressText.innerText = `${completedMilestones} of ${totalMilestones} Completed (${percent}%)`;

    const progressBar = document.getElementById('roadmap-overall-bar');
    if (progressBar) {
      progressBar.style.width = `${percent}%`;
      progressBar.className = percent >= 80 ? 'progress-fill success' : percent >= 45 ? 'progress-fill' : 'progress-fill warning';
    }

    container.innerHTML = `
      <!-- Personalized Configuration Controls Bar -->
      <div class="card p-3 mb-4 roadmap-config-bar">
        <div class="flex items-center justify-between flex-wrap gap-3">
          <div class="flex items-center gap-2">
            <span class="badge badge-primary"><i class="fa-solid fa-bullseye"></i> Track:</span>
            <strong class="text-sm">${targetCareer.title}</strong>
          </div>

          <div class="flex items-center gap-3 flex-wrap">
            <div class="flex items-center gap-2 flex-wrap">
              <label class="text-xs text-muted font-semibold">Weekly Study Hours:</label>
              <select id="roadmap-hours-select" class="form-control form-control-sm" onchange="roadmapManager.setHours(this.value)">
                <option value="10" ${this.selectedHours === 10 ? 'selected' : ''}>10 hrs / week (Moderate)</option>
                <option value="15" ${this.selectedHours === 15 ? 'selected' : ''}>15 hrs / week (Recommended)</option>
                <option value="25" ${this.selectedHours === 25 ? 'selected' : ''}>25 hrs / week (Sprint)</option>
              </select>
            </div>

            <div class="flex items-center gap-2 flex-wrap">
              <label class="text-xs text-muted font-semibold">Target Season:</label>
              <span class="badge badge-info">Campus Drives ${profile.gradYear || '2026'}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 6-Month Structured Timeline Cards -->
      <div class="roadmap-six-month-container">
        ${SIX_MONTH_ROADMAP_MASTER.map(m => {
          const monthCheckedCount = m.milestones.filter(item => checkedState[item.id]).length;
          const monthPercent = Math.round((monthCheckedCount / m.milestones.length) * 100);
          const isMonthDone = monthPercent === 100;

          return `
            <div class="roadmap-month-card ${isMonthDone ? 'month-completed' : ''}">
              <div class="roadmap-month-header">
                <div class="roadmap-month-badge-col">
                  <span class="badge ${isMonthDone ? 'badge-success' : 'badge-primary'}">${m.duration}</span>
                  <h3 class="roadmap-month-title">${m.title}</h3>
                </div>
                <div class="roadmap-month-progress-badge">
                  <span class="badge ${isMonthDone ? 'badge-success' : 'badge-outline'}">
                    ${monthCheckedCount}/${m.milestones.length} Milestones (${monthPercent}%)
                  </span>
                </div>
              </div>

              <!-- Learning Objective -->
              <div class="roadmap-objective-box">
                <i class="fa-solid fa-flag text-primary"></i>
                <div>
                  <strong>Learning Objective:</strong> ${m.objective}
                </div>
              </div>

              <!-- Skills Covered Chips -->
              <div class="roadmap-skills-row">
                <span class="text-xs text-muted font-bold uppercase mr-2">Skills Covered:</span>
                ${m.skills.map(s => `<span class="badge badge-outline text-xs">${s}</span>`).join('')}
              </div>

              <!-- 2-Column Content: Recommended Lectures + Practice Problems -->
              <div class="grid-responsive-2 gap-3 mb-3">
                
                <!-- Recommended YouTube Lectures -->
                <div class="roadmap-inner-box">
                  <div class="text-xs font-bold text-muted mb-2 uppercase flex items-center gap-1">
                    <i class="fa-brands fa-youtube text-rose"></i> Recommended YouTube Lectures:
                  </div>
                  <div class="roadmap-lectures-list">
                    ${m.youtubeLectures.map(yt => `
                      <a href="${yt.url}" target="_blank" rel="noopener noreferrer" class="roadmap-lecture-link">
                        <i class="fa-solid fa-play text-primary"></i>
                        <div style="flex: 1; min-width: 0;">
                          <div class="text-xs font-bold text-main truncate">${yt.title}</div>
                          <div class="text-xs text-muted">${yt.channel}</div>
                        </div>
                        <i class="fa-solid fa-arrow-up-right-from-square text-xs text-muted"></i>
                      </a>
                    `).join('')}
                  </div>
                </div>

                <!-- Practice Problems -->
                <div class="roadmap-inner-box">
                  <div class="text-xs font-bold text-muted mb-2 uppercase flex items-center gap-1">
                    <i class="fa-solid fa-code text-cyan"></i> Practice Problems:
                  </div>
                  <div class="roadmap-problems-list">
                    ${m.practiceProblems.map(p => `
                      <a href="${p.link}" target="_blank" rel="noopener noreferrer" class="roadmap-problem-chip">
                        <i class="fa-solid fa-terminal text-emerald"></i>
                        <span>${p.name}</span>
                        <i class="fa-solid fa-arrow-up-right-from-square text-xs"></i>
                      </a>
                    `).join('')}
                  </div>
                </div>
              </div>

              <!-- Capstone Project & Interview Questions Row -->
              <div class="grid-responsive-2 gap-3 mb-3">
                <div class="roadmap-inner-box project-highlight">
                  <div class="text-xs font-bold text-primary mb-1 uppercase flex items-center gap-1">
                    <i class="fa-solid fa-folder-tree"></i> Hands-on Project to Build:
                  </div>
                  <div class="text-xs font-bold mb-1">${m.project.title}</div>
                  <p class="text-xs text-muted">${m.project.desc}</p>
                </div>

                <div class="roadmap-inner-box">
                  <div class="text-xs font-bold text-muted mb-1 uppercase flex items-center gap-1">
                    <i class="fa-solid fa-user-check text-amber"></i> Top Interview Questions:
                  </div>
                  <ul class="text-xs text-muted" style="padding-left: 1rem; margin: 0;">
                    ${m.interviewQuestions.map(q => `<li style="margin-bottom: 0.25rem;">${q}</li>`).join('')}
                  </ul>
                </div>
              </div>

              <!-- Interactive Milestone Checkboxes -->
              <div class="roadmap-milestones-checklist">
                <div class="text-xs font-bold text-muted mb-2 uppercase">Completion Milestones:</div>
                <div class="grid gap-2">
                  ${m.milestones.map(item => {
                    const isChecked = !!checkedState[item.id];
                    return `
                      <div class="checklist-item ${isChecked ? 'completed' : ''}" onclick="roadmapManager.toggleMilestone('${item.id}')">
                        <input type="checkbox" ${isChecked ? 'checked' : ''} onclick="event.stopPropagation(); roadmapManager.toggleMilestone('${item.id}')">
                        <span class="checklist-text">${item.title}</span>
                        ${isChecked ? '<i class="fa-solid fa-circle-check text-emerald"></i>' : '<i class="fa-regular fa-circle text-muted"></i>'}
                      </div>
                    `;
                  }).join('')}
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  toggleMilestone(milestoneId) {
    const isDone = appState.toggleRoadmapMilestone(milestoneId);
    showToast(isDone ? 'Milestone achieved! Your readiness is progressing.' : 'Milestone unchecked', isDone ? 'success' : 'info');
    this.renderRoadmapView();
    if (window.renderDashboard) window.renderDashboard();
  }

  setHours(val) {
    this.selectedHours = parseInt(val) || 15;
    showToast(`Roadmap schedule updated for ${this.selectedHours} study hours/week.`, 'info');
    this.renderRoadmapView();
  }
}

// Global instance & backward-compatible functions
const roadmapManager = new RoadmapManager();

function renderRoadmapView() {
  roadmapManager.renderRoadmapView();
}

function toggleRoadmapItem(id) {
  roadmapManager.toggleMilestone(id);
}

// Global Aliases & Exports
const ROADMAP_DATA = SIX_MONTH_ROADMAP_MASTER;
window.ROADMAP_DATA = SIX_MONTH_ROADMAP_MASTER;
window.SIX_MONTH_ROADMAP_MASTER = SIX_MONTH_ROADMAP_MASTER;
window.roadmapManager = roadmapManager;
window.renderRoadmapView = renderRoadmapView;
window.toggleRoadmapItem = toggleRoadmapItem;

