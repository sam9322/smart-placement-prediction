/**
 * SMART PLACEMENT PREDICTION & CAREER COACH
 * Career Roadmap Module: 3-Stage Milestone Tracker with Interactive Checklists
 */

const ROADMAP_DATA = [
  {
    stageId: 'stage-1',
    stageName: 'Stage 1: Beginner Foundations',
    stageDuration: 'Months 1 - 2 (Semester 7 Start)',
    description: 'Establish core engineering depth, language proficiency, and essential problem-solving habits.',
    milestones: [
      {
        id: 's1_m1',
        title: 'Master Core Language & OOP Principles',
        detail: 'Proficiency in Java / C++ / Python: memory management, classes, inheritance, polymorphism, and standard libraries (STL / Java Collections).'
      },
      {
        id: 's1_m2',
        title: 'Data Structures Foundation (Easy → Medium)',
        detail: 'Implement Arrays, Strings, HashMaps, Linked Lists, Stacks, and Queues from scratch. Solve 50+ basic LeetCode questions.'
      },
      {
        id: 's1_m3',
        title: 'Version Control & Git Workflow',
        detail: 'Master Git branching, pull requests, resolving merge conflicts, and publishing repos to GitHub.'
      }
    ]
  },
  {
    stageId: 'stage-2',
    stageName: 'Stage 2: Intermediate Industry Readiness',
    stageDuration: 'Months 3 - 4 (Mid-Semester Preparation)',
    description: 'Build real-world application architectures, master database queries, and solve complex algorithms.',
    milestones: [
      {
        id: 's2_m1',
        title: 'Full-Scale Capstone Project 1',
        detail: 'Architect a full-stack web/mobile application with authentication, database models (SQL/NoSQL), and secure REST APIs.'
      },
      {
        id: 's2_m2',
        title: 'Advanced DSA (Trees, Graphs, DP)',
        detail: 'Master Binary Trees, BSTs, Graph Traversals (BFS/DFS, Dijkstra), and Dynamic Programming patterns. Target LeetCode 150.'
      },
      {
        id: 's2_m3',
        title: 'CS Core Subjects Review',
        detail: 'Review OS (Processes, Threads, Deadlocks, Paging), DBMS (Normalization, ACID, Indexing), and Computer Networks (OSI, TCP/IP, HTTP/HTTPS).'
      }
    ]
  },
  {
    stageId: 'stage-3',
    stageName: 'Stage 3: Advanced Placement Mastery',
    stageDuration: 'Months 5 - 6 (Placement Drive Season)',
    description: 'Fine-tune live technical interviews, System Design basics, ATS resume polishing, and mock assessments.',
    milestones: [
      {
        id: 's3_m1',
        title: 'System Design & Scalability Basics',
        detail: 'Understand caching (Redis), load balancing, microservices vs monolith, database sharding, and latency vs throughput.'
      },
      {
        id: 's3_m2',
        title: 'Mock Technical & HR STAR Interviews',
        detail: 'Complete at least 5 simulated technical mock interviews with peer review, practicing code walkthroughs and STAR behavioral responses.'
      },
      {
        id: 's3_m3',
        title: 'ATS-Optimized Resume & Cloud Portfolio',
        detail: 'Format single-page ATS-friendly resume highlighting measurable metrics, deploy projects on AWS/Vercel with live URLs.'
      }
    ]
  },
  {
    stageId: 'stage-4',
    stageName: 'Stage 4: Job Ready (Placement Drives & Offers)',
    stageDuration: 'Final Phase (Offer Conversion & Onboarding)',
    description: 'Crush live campus drive screening tests, technical coding rounds, and secure multiple offers.',
    milestones: [
      {
        id: 's4_m1',
        title: 'Target Company Research & Criteria Alignment',
        detail: 'Analyze company-specific past placement papers, hiring patterns, tech stacks, and cutoff eligibility.'
      },
      {
        id: 's4_m2',
        title: 'Timed Coding Rounds & Speed DSA Drills',
        detail: 'Simulate high-pressure 60-minute coding tests on HackerRank/Mettl, solving 2 medium problems under 45 minutes.'
      },
      {
        id: 's4_m3',
        title: 'Offer Evaluation & Pre-Joining Onboarding',
        detail: 'Evaluate compensation packages (Fixed CTC, ESOPs, Joining Bonuses), complete background verification, and prepare for day-1 engineering onboarding.'
      }
    ]
  }
];

function renderRoadmapView() {
  const container = document.getElementById('roadmap-timeline-root');
  if (!container) return;

  const checkedState = appState.getRoadmapChecklist();

  // Calculate overall progress
  let totalMilestones = 0;
  let completedMilestones = 0;

  ROADMAP_DATA.forEach(stage => {
    stage.milestones.forEach(m => {
      totalMilestones++;
      if (checkedState[m.id]) completedMilestones++;
    });
  });

  const percent = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;

  // Update summary header
  const progressText = document.getElementById('roadmap-progress-text');
  if (progressText) progressText.innerText = `${completedMilestones} of ${totalMilestones} Completed (${percent}%)`;

  const progressBar = document.getElementById('roadmap-overall-bar');
  if (progressBar) {
    progressBar.style.width = `${percent}%`;
    progressBar.className = percent >= 80 ? 'progress-fill success' : percent >= 40 ? 'progress-fill' : 'progress-fill warning';
  }

  // Render stages
  container.innerHTML = ROADMAP_DATA.map((stage, sIdx) => {
    const stageCompleted = stage.milestones.filter(m => checkedState[m.id]).length;
    const stagePercent = Math.round((stageCompleted / stage.milestones.length) * 100);

    return `
      <div class="roadmap-stage">
        <div class="roadmap-stage-node"></div>
        <div class="flex items-center justify-between mb-2" style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
          <div>
            <span class="badge badge-primary">${stage.stageDuration}</span>
            <h3 class="text-xl mt-1" style="margin-top: 0.35rem;">${stage.stageName}</h3>
          </div>
          <span class="badge ${stagePercent === 100 ? 'badge-success' : 'badge-info'}">
            ${stageCompleted}/${stage.milestones.length} Completed
          </span>
        </div>
        
        <p class="text-sm mb-4" style="margin-bottom: 1.25rem;">${stage.description}</p>

        <div class="grid gap-2" style="display: grid; gap: 0.5rem;">
          ${stage.milestones.map(m => {
            const isDone = !!checkedState[m.id];
            return `
              <div class="checklist-item ${isDone ? 'completed' : ''}" 
                   onclick="toggleRoadmapItem('${m.id}')"
                   style="border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 0.85rem;">
                <input type="checkbox" ${isDone ? 'checked' : ''} style="transform: scale(1.2); cursor: pointer;" onclick="event.stopPropagation(); toggleRoadmapItem('${m.id}')">
                <div style="flex: 1;">
                  <h4 style="font-size: 0.95rem; font-weight: 600; color: ${isDone ? 'var(--text-muted)' : 'var(--text-main)'};">
                    ${m.title}
                  </h4>
                  <p class="text-xs" style="color: var(--text-muted); margin-top: 0.2rem;">${m.detail}</p>
                </div>
                ${isDone ? '<i class="fa-solid fa-circle-check text-success" style="color: var(--accent-emerald);"></i>' : '<i class="fa-regular fa-circle" style="color: var(--text-light);"></i>'}
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }).join('');
}

function toggleRoadmapItem(milestoneId) {
  const newState = appState.toggleRoadmapMilestone(milestoneId);
  showToast(newState ? 'Milestone completed! Keep going! 🚀' : 'Milestone unmarked', newState ? 'success' : 'info');
  renderRoadmapView();
  if (window.renderDashboard) window.renderDashboard();
}
