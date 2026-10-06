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
    this.data = this.loadState();
    this.listeners = [];
  }

  loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
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
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
      this.notifyListeners();
    } catch (e) {
      console.error('Error saving state to localStorage:', e);
    }
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
    return this.data.profile;
  }

  updateProfile(newProfile) {
    this.data.profile = { ...this.data.profile, ...newProfile };
    this.saveState();
  }

  getPrediction() {
    return this.data.prediction;
  }

  updatePrediction(predictionData) {
    this.data.prediction = { ...this.data.prediction, ...predictionData };
    this.saveState();
  }

  getRoadmapChecklist() {
    return this.data.roadmap.checkedMilestones;
  }

  toggleRoadmapMilestone(milestoneId) {
    const current = !!this.data.roadmap.checkedMilestones[milestoneId];
    this.data.roadmap.checkedMilestones[milestoneId] = !current;
    this.saveState();
    return !current;
  }

  saveInterviewAttempt(attempt) {
    if (!this.data.interviewHistory.mockAttempts) {
      this.data.interviewHistory.mockAttempts = [];
    }
    this.data.interviewHistory.mockAttempts.unshift(attempt);
    this.saveState();
  }

  updateQuizScore(type, score, total) {
    if (type === 'aptitude') {
      this.data.interviewHistory.aptitudeScore = score;
      this.data.interviewHistory.aptitudeTotal = total;
    } else {
      this.data.interviewHistory.technicalScore = score;
      this.data.interviewHistory.technicalTotal = total;
    }
    this.saveState();
  }
}

// Global App State Instance
const appState = new StateManager();

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
