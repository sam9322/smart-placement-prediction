/**
 * SMART PLACEMENT PREDICTION & CAREER COACH
 * Application State & LocalStorage Store
 */

const STORAGE_KEY = 'smart_placement_coach_state_v3';
const THEME_KEY = 'smart_placement_coach_theme';

// Default initial student data (rich realistic dummy data for final year project demonstration)
const DEFAULT_STUDENT_DATA = {
  profile: {
    fullName: 'Samiksha Walbe',
    email: 'samiksha@engg.edu',
    phone: '+91 98765 11052',
    college: 'National Institute of Engineering & Technology',
    degree: 'B.Tech',
    branch: 'Computer Science & Engineering',
    gradYear: '2026',
    rollNumber: 'CS22B1052',
    cgpa: 8.85,
    tenthMarks: 94.2,
    twelfthMarks: 91.0,
    backlogs: 0,
    aptitudeScore: 88,
    codingRating: 1740,
    targetCareerId: 'sde',
    targetCareerTitle: 'Software Development Engineer',
    skills: [
      'Java',
      'Python',
      'Data Structures & Algorithms',
      'C++',
      'Spring Boot',
      'SQL & DBMS',
      'Git & GitHub',
      'Docker Basics',
      'System Design',
      'REST APIs'
    ],
    certifications: [
      { id: 'c1', title: 'AWS Certified Solutions Architect - Associate', issuer: 'Amazon Web Services', year: '2025' },
      { id: 'c2', title: 'Problem Solving (Gold Badge)', issuer: 'HackerRank', year: '2024' }
    ],
    projects: [
      {
        id: 'p1',
        title: 'Campus Placement Management System',
        stack: 'Spring Boot, React, MySQL',
        desc: 'Automated student eligibility screening and placement drives for 1,200+ candidates.',
        link: 'https://github.com/samiksha/placement-system'
      },
      {
        id: 'p2',
        title: 'Distributed Key-Value Store',
        stack: 'Java, gRPC, Docker',
        desc: 'Built fault-tolerant storage using Raft consensus protocol with 99.9% uptime.',
        link: 'https://github.com/samiksha/kv-store'
      }
    ],
    internships: [
      {
        id: 'i1',
        company: 'Infosys Digital',
        role: 'Software Engineering Intern',
        duration: '3 Months (May - Jul 2025)',
        desc: 'Engineered scalable microservices and reduced backend API latency by 28%.'
      }
    ]
  },
  prediction: {
    probability: 92,
    tier: 'High',
    tierLabel: 'High Readiness - Tier 1 Product Company Candidate (16 - 32 LPA)',
    factors: {
      academics: 91,
      technicalDSA: 92,
      projects: 90,
      internships: 93,
      aptitude: 88
    },
    lastCalculated: '2026-10-06'
  },
  roadmap: {
    checkedMilestones: {
      's1_m1': true,
      's1_m2': true,
      's1_m3': true,
      's2_m1': true,
      's2_m2': false,
      's2_m3': false,
      's3_m1': false,
      's3_m2': false
    }
  },
  interviewHistory: {
    aptitudeScore: 8,
    aptitudeTotal: 10,
    technicalScore: 9,
    technicalTotal: 10,
    mockAttempts: [
      {
        date: '2026-10-05',
        role: 'Software Development Engineer',
        score: 88,
        feedback: 'Excellent explanation of indexing and tree traversal. Refine STAR format on teamwork questions.'
      }
    ]
  }
};

// Careers Master Catalog
const CAREERS_CATALOG = [
  {
    id: 'sde',
    title: 'Software Development Engineer',
    category: 'Core Engineering',
    icon: 'fa-solid fa-code',
    salary: '₹8 - 28 LPA',
    desc: 'Designs, develops, tests, and deploys high-scale software systems and resilient backend architectures.',
    requiredSkills: [
      'Data Structures & Algorithms',
      'Java',
      'C++',
      'SQL & DBMS',
      'Operating Systems',
      'Computer Networks',
      'System Design',
      'Git & GitHub'
    ],
    topCompanies: ['Google', 'Microsoft', 'Amazon', 'Adobe', 'Uber', 'Cisco'],
    learningPath: 'Master DSA (LeetCode 150) → Core CS Fundamentals → Low Level Design → Build 2 Full-Stack Projects'
  },
  {
    id: 'webdev',
    title: 'Full Stack Web Developer',
    category: 'Web & Applications',
    icon: 'fa-solid fa-laptop-code',
    salary: '₹6 - 20 LPA',
    desc: 'Builds end-to-end responsive web applications with interactive frontends and scalable backend APIs.',
    requiredSkills: [
      'HTML/CSS',
      'JavaScript',
      'React.js',
      'Node.js',
      'REST APIs',
      'SQL & DBMS',
      'Git & GitHub',
      'TypeScript'
    ],
    topCompanies: ['Swiggy', 'Zomato', 'Paytm', 'Razorpay', 'Atlassian', 'Flipkart'],
    learningPath: 'Modern JS (ES6+) → Frontend Framework (React/Next.js) → Backend (Node/Express) → Database & Cloud Deployment'
  },
  {
    id: 'data-analyst',
    title: 'Data Analyst & BI Specialist',
    category: 'Data & Analytics',
    icon: 'fa-solid fa-chart-pie',
    salary: '₹6 - 16 LPA',
    desc: 'Transforms complex raw datasets into actionable executive insights, dashboards, and growth metrics.',
    requiredSkills: [
      'Python',
      'SQL & DBMS',
      'Power BI / Tableau',
      'Pandas & NumPy',
      'Statistics',
      'Data Visualization',
      'Excel (Advanced)'
    ],
    topCompanies: ['Deloitte', 'EY', 'Fractal', 'Mu Sigma', 'Accenture', 'JPMorgan'],
    learningPath: 'Advanced SQL Queries → Python for Data Analysis → Power BI Dashboards → Statistical Modeling'
  },
  {
    id: 'aiml',
    title: 'AI / Machine Learning Engineer',
    category: 'Artificial Intelligence',
    icon: 'fa-solid fa-brain',
    salary: '₹10 - 32 LPA',
    desc: 'Engineers predictive mathematical models, deep learning architectures, and generative AI pipelines.',
    requiredSkills: [
      'Python',
      'Mathematics & Linear Algebra',
      'Scikit-Learn',
      'Deep Learning (PyTorch/TensorFlow)',
      'Data Structures & Algorithms',
      'SQL & DBMS',
      'Git & GitHub'
    ],
    topCompanies: ['NVIDIA', 'Microsoft', 'Google DeepMind', 'InMobi', 'Flipkart', 'Wadhwani AI'],
    learningPath: 'Math & Stats Foundations → ML Algorithms from scratch → Deep Learning Frameworks → Deploy models via FastAPI & Docker'
  },
  {
    id: 'cloud-devops',
    title: 'Cloud & DevOps Engineer',
    category: 'Infrastructure & Cloud',
    icon: 'fa-solid fa-cloud',
    salary: '₹7 - 22 LPA',
    desc: 'Automates continuous deployment pipelines and orchestrates resilient multi-cloud infrastructure.',
    requiredSkills: [
      'Linux & Shell Scripting',
      'AWS / Azure',
      'Docker Basics',
      'Kubernetes',
      'CI/CD Pipelines (GitHub Actions/Jenkins)',
      'Computer Networks',
      'Python'
    ],
    topCompanies: ['Amazon Web Services', 'Red Hat', 'Infosys', 'Wipro', 'Capgemini', 'IBM'],
    learningPath: 'Linux Administration → Cloud Foundations (AWS/Azure) → Containerization (Docker) → CI/CD & Terraform'
  },
  {
    id: 'cybersecurity',
    title: 'Cybersecurity Analyst',
    category: 'Security & Defense',
    icon: 'fa-solid fa-shield-halved',
    salary: '₹7 - 24 LPA',
    desc: 'Protects enterprise digital assets through vulnerability assessments, penetration testing, and incident audits.',
    requiredSkills: [
      'Computer Networks',
      'Linux & Shell Scripting',
      'Ethical Hacking & Pentesting',
      'Cryptography',
      'Operating Systems',
      'SIEM Tools (Splunk/Wireshark)',
      'Python'
    ],
    topCompanies: ['Palo Alto Networks', 'CrowdStrike', 'TCS Cyber', 'Wipro', 'QuickHeal', 'PwC'],
    learningPath: 'Networking Protocols (TCP/IP) → Linux Security → CompTIA Security+ prep → CTF & TryHackMe Labs'
  }
];

// Upcoming Campus Placement Drives
const UPCOMING_DRIVES = [
  { company: 'Google', role: 'Software Engineer (L3)', date: 'Nov 12, 2026', ctc: '32 LPA', minCgpa: 8.0, status: 'Registration Open' },
  { company: 'Amazon', role: 'SDE-1', date: 'Nov 18, 2026', ctc: '28 LPA', minCgpa: 7.5, status: 'Registration Open' },
  { company: 'Microsoft', role: 'Software Engineer', date: 'Nov 24, 2026', ctc: '26 LPA', minCgpa: 7.5, status: 'Upcoming' },
  { company: 'TCS Digital', role: 'Systems Engineer (Prime)', date: 'Dec 02, 2026', ctc: '9 LPA', minCgpa: 7.0, status: 'Upcoming' },
  { company: 'Deloitte USI', role: 'Analyst - Advisory', date: 'Dec 08, 2026', ctc: '8.5 LPA', minCgpa: 6.5, status: 'Upcoming' }
];

// State Manager Class
class StateManager {
  constructor() {
    this.userId = null;
    this.listeners = [];
    this.data = this.loadState();
  }

  getUserStorageKey(uid = null) {
    const id = uid || this.userId || (window.authManager && window.authManager.currentUser ? window.authManager.currentUser.id : null) || localStorage.getItem('smart_placement_user_id') || sessionStorage.getItem('smart_placement_user_id');
    return id ? `smart_placement_state_user_${id}` : STORAGE_KEY;
  }

  loadState() {
    try {
      const key = this.getUserStorageKey();
      const saved = localStorage.getItem(key);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Error reading from localStorage:', e);
    }
    // Return deep clone of default data
    return JSON.parse(JSON.stringify(DEFAULT_STUDENT_DATA));
  }

  saveState() {
    try {
      const key = this.getUserStorageKey();
      localStorage.setItem(key, JSON.stringify(this.data));
      this.notifyListeners();
    } catch (e) {
      console.error('Error saving state to localStorage:', e);
    }
  }

  initUser(user, prediction = null) {
    if (!user) return;
    this.userId = user.id || user.email;
    const key = this.getUserStorageKey(this.userId);
    let localData = null;
    try {
      const saved = localStorage.getItem(key);
      if (saved) localData = JSON.parse(saved);
    } catch (e) {
      console.warn('Error reading user state:', e);
    }

    const baseProfile = {
      id: user.id,
      fullName: user.fullName || user.fullname || 'Student',
      email: user.email || '',
      phone: user.phone || '+91 98765 00000',
      college: user.college || 'National Institute of Engineering & Technology',
      degree: user.degree || 'B.Tech',
      branch: user.branch || 'Computer Science & Engineering',
      gradYear: user.gradYear || user.grad_year || '2026',
      rollNumber: user.rollNumber || user.roll_number || 'CS22B1000',
      cgpa: parseFloat(user.cgpa !== undefined ? user.cgpa : 8.0),
      tenthMarks: parseFloat(user.tenthMarks !== undefined ? user.tenthMarks : (user.tenth_marks || 90.0)),
      twelfthMarks: parseFloat(user.twelfthMarks !== undefined ? user.twelfthMarks : (user.twelfth_marks || 88.0)),
      backlogs: parseInt(user.backlogs !== undefined ? user.backlogs : 0),
      aptitudeScore: parseInt(user.aptitudeScore !== undefined ? user.aptitudeScore : (user.aptitude_score || 80)),
      codingRating: parseInt(user.codingRating !== undefined ? user.codingRating : (user.coding_rating || 1600)),
      targetCareerId: user.targetCareerId || user.target_career_id || 'sde',
      targetCareerTitle: user.targetCareerTitle || user.target_career_title || 'Software Development Engineer',
      skills: Array.isArray(user.skills) ? user.skills : (typeof user.skills === 'string' ? JSON.parse(user.skills || '[]') : []),
      certifications: Array.isArray(user.certifications) ? user.certifications : (typeof user.certifications === 'string' ? JSON.parse(user.certifications || '[]') : []),
      projects: Array.isArray(user.projects) ? user.projects : (typeof user.projects === 'string' ? JSON.parse(user.projects || '[]') : []),
      internships: Array.isArray(user.internships) ? user.internships : (typeof user.internships === 'string' ? JSON.parse(user.internships || '[]') : [])
    };

    let activePrediction = prediction || (localData && localData.prediction ? localData.prediction : null);
    if (!activePrediction) {
      activePrediction = {
        probability: Math.round(Math.min(98, Math.max(45, (baseProfile.cgpa * 8) + (baseProfile.skills.length * 2)))),
        tier: baseProfile.cgpa >= 8.5 ? 'High' : 'Medium',
        tierLabel: baseProfile.cgpa >= 8.5 ? 'High Readiness - Tier 1 Candidate' : 'Moderate Readiness - Tier 2 Candidate',
        factors: {
          academics: Math.round(baseProfile.cgpa * 10),
          technicalDSA: Math.min(95, baseProfile.skills.length * 9),
          projects: Math.min(95, baseProfile.projects.length * 40 + 20),
          internships: Math.min(95, baseProfile.internships.length * 45 + 30),
          aptitude: baseProfile.aptitudeScore
        },
        lastCalculated: new Date().toISOString().split('T')[0]
      };
    }

    const roadmapMilestones = (user.roadmapState && Object.keys(user.roadmapState).length > 0)
      ? user.roadmapState
      : (localData && localData.roadmap && localData.roadmap.checkedMilestones ? localData.roadmap.checkedMilestones : {});

    const apt10 = Math.min(10, Math.max(0, Math.round(baseProfile.aptitudeScore / 10)));
    const interviewHist = (user.interviewHistory && (user.interviewHistory.aptitudeScore !== undefined || (user.interviewHistory.mockAttempts && user.interviewHistory.mockAttempts.length)))
      ? user.interviewHistory
      : (localData && localData.interviewHistory ? localData.interviewHistory : {
          aptitudeScore: apt10,
          aptitudeTotal: 10,
          technicalScore: Math.min(10, Math.max(5, apt10)),
          technicalTotal: 10,
          mockAttempts: []
        });

    this.data = {
      profile: baseProfile,
      prediction: activePrediction,
      roadmap: {
        checkedMilestones: roadmapMilestones
      },
      interviewHistory: interviewHist
    };

    this.saveState();
  }

  resetToDefault() {
    this.data = JSON.parse(JSON.stringify(DEFAULT_STUDENT_DATA));
    this.saveState();
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notifyListeners() {
    this.listeners.forEach(fn => {
      try { fn(this.data); } catch (err) { console.error('Listener error:', err); }
    });
  }

  getProfile() {
    return this.data.profile || {};
  }

  updateProfile(newProfile) {
    this.data.profile = { ...this.data.profile, ...newProfile };
    this.saveState();
    if (window.authManager && authManager.syncProfileToBackend) {
      authManager.syncProfileToBackend(this.data.profile);
    }
  }

  getPrediction() {
    return this.data.prediction || { probability: 85, tier: 'High', factors: {} };
  }

  updatePrediction(predictionData) {
    this.data.prediction = { ...this.data.prediction, ...predictionData };
    this.saveState();
    if (window.authManager && authManager.syncPredictionToBackend) {
      authManager.syncPredictionToBackend(this.data.prediction);
    }
  }

  getRoadmapChecklist() {
    return (this.data.roadmap && this.data.roadmap.checkedMilestones) ? this.data.roadmap.checkedMilestones : {};
  }

  toggleRoadmapMilestone(milestoneId) {
    if (!this.data.roadmap) this.data.roadmap = { checkedMilestones: {} };
    if (!this.data.roadmap.checkedMilestones) this.data.roadmap.checkedMilestones = {};

    const current = !!this.data.roadmap.checkedMilestones[milestoneId];
    this.data.roadmap.checkedMilestones[milestoneId] = !current;
    this.saveState();

    const token = localStorage.getItem('smart_placement_auth_token') || sessionStorage.getItem('smart_placement_auth_token');
    const apiBase = (window.authManager && authManager.apiBaseUrl !== undefined) ? authManager.apiBaseUrl : (window.location.port === '5000' ? '' : 'http://localhost:5000');
    if (token) {
      fetch(`${apiBase}/api/user/roadmap`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(this.data.roadmap.checkedMilestones)
      }).catch(e => console.warn('Roadmap sync:', e));
    }

    return !current;
  }

  saveInterviewAttempt(attempt) {
    if (!this.data.interviewHistory) this.data.interviewHistory = { mockAttempts: [] };
    if (!this.data.interviewHistory.mockAttempts) {
      this.data.interviewHistory.mockAttempts = [];
    }
    this.data.interviewHistory.mockAttempts.unshift(attempt);
    this.saveState();

    const token = localStorage.getItem('smart_placement_auth_token') || sessionStorage.getItem('smart_placement_auth_token');
    const apiBase = (window.authManager && authManager.apiBaseUrl !== undefined) ? authManager.apiBaseUrl : (window.location.port === '5000' ? '' : 'http://localhost:5000');
    if (token) {
      fetch(`${apiBase}/api/user/interview`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(this.data.interviewHistory)
      }).catch(e => console.warn('Interview sync:', e));
    }
  }

  updateQuizScore(type, score, total) {
    if (!this.data.interviewHistory) this.data.interviewHistory = {};
    if (type === 'aptitude') {
      this.data.interviewHistory.aptitudeScore = score;
      this.data.interviewHistory.aptitudeTotal = total;
    } else {
      this.data.interviewHistory.technicalScore = score;
      this.data.interviewHistory.technicalTotal = total;
    }
    this.saveState();

    const token = localStorage.getItem('smart_placement_auth_token') || sessionStorage.getItem('smart_placement_auth_token');
    const apiBase = (window.authManager && authManager.apiBaseUrl !== undefined) ? authManager.apiBaseUrl : (window.location.port === '5000' ? '' : 'http://localhost:5000');
    if (token) {
      fetch(`${apiBase}/api/user/interview`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(this.data.interviewHistory)
      }).catch(e => console.warn('Interview quiz sync:', e));
    }
  }
}

// Global App State Instance
const appState = new StateManager();
window.appState = appState;

// Theme Controller
function initTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY) || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  return savedTheme;
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  const newTheme = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem(THEME_KEY, newTheme);
  return newTheme;
}
