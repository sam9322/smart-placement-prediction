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
    programmingLanguage: 'Java',
    dsaSkill: 'Advanced',
    coreCsKnowledge: 'Strong',
    devSkills: 'Full Stack & APIs',
    communicationScore: 85,
    resumeScore: 88,
    targetCareerId: 'sde',
    targetCareerTitle: 'Software Engineer / SDE',
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

// Careers Master Catalog – Complete Career Mapping Engine Specification
const CAREERS_CATALOG = [
  {
    id: 'sde',
    title: 'Software Engineer / SDE',
    category: 'Core Engineering',
    icon: 'fa-solid fa-code',
    salary: '₹12 - 36 LPA',
    desc: 'Designs robust system algorithms, develops high-scale software architectures, and solves challenging algorithmic problems.',
    requiredSkills: [
      'C++ / Java / Python',
      'Data Structures',
      'Algorithms',
      'Problem Solving',
      'OOP',
      'DBMS',
      'Operating Systems',
      'Computer Networks',
      'System Design'
    ],
    skillDifficulty: {
      'C++ / Java / Python': 'Beginner',
      'OOP': 'Beginner',
      'DBMS': 'Intermediate',
      'Computer Networks': 'Intermediate',
      'Operating Systems': 'Intermediate',
      'Data Structures': 'Intermediate',
      'Algorithms': 'Advanced',
      'Problem Solving': 'Advanced',
      'System Design': 'Advanced'
    },
    skillPriority: {
      'Data Structures': 'High Priority',
      'Algorithms': 'High Priority',
      'Problem Solving': 'High Priority',
      'Operating Systems': 'Critical',
      'DBMS': 'High Priority',
      'System Design': 'Critical',
      'C++ / Java / Python': 'Medium',
      'OOP': 'Medium',
      'Computer Networks': 'Medium'
    },
    youtubeSearchTopics: [
      'DSA roadmap for placements',
      'Data Structures and Algorithms',
      'LeetCode interview preparation',
      'OOP interview preparation',
      'DBMS interview preparation'
    ],
    topCompanies: ['Google', 'Microsoft', 'Amazon', 'Atlassian', 'Adobe', 'Uber', 'Cisco'],
    learningPath: 'Master DSA (LeetCode 150) → Core CS (OS, DBMS, Networks) → Low-Level & High-Level System Design → 2 Scalable Full-Stack Microservices',
    recommendedProjects: [
      {
        title: 'Distributed Fault-Tolerant Key-Value Store',
        stack: 'Java / Go, gRPC, Raft Consensus, Docker',
        desc: 'Implemented distributed consensus algorithm with leader election, log replication, and 99.99% fault tolerance.',
        recruiterNote: 'Demonstrates concurrency, network protocol design, and distributed systems understanding.'
      },
      {
        title: 'High-Concurrency Campus Placement Engine',
        stack: 'Spring Boot / Node.js, Redis, PostgreSQL, Kafka',
        desc: 'Automates student eligibility filtration and handles 10,000 concurrent drive registrations with message queue throttling.',
        recruiterNote: 'Proves high-load backend architecture and real-world database design.'
      }
    ],
    interviewTopics: [
      'Arrays, HashMaps, Two Pointers & Binary Search',
      'Trees, Graphs, BFS/DFS, Dijkstra & Topological Sort',
      'Dynamic Programming & Recursion Memoization',
      'Operating Systems: Process Synchronization, Deadlocks, Paging',
      'DBMS: ACID, Indexing, B-Trees, Normalization & Sharding',
      'System Design: Caching, Load Balancing & Microservices'
    ],
    placementPrep: [
      'Speed Coding (HackerRank & LeetCode 60-min assessments)',
      'CS Core Fundamentals Multiple Choice & Technical Viva',
      'Live Coding Walkthrough & Behavioral STAR Interviews'
    ]
  },
  {
    id: 'webdev',
    title: 'Frontend Developer / Full Stack Developer',
    category: 'Web & Applications',
    icon: 'fa-solid fa-laptop-code',
    salary: '₹8 - 24 LPA',
    desc: 'Crafts responsive user interfaces, interactive web apps, modern component systems, and scalable backend REST/GraphQL services.',
    requiredSkills: [
      'HTML',
      'CSS',
      'JavaScript',
      'React',
      'TypeScript',
      'Node.js',
      'Express',
      'REST APIs',
      'Git/GitHub',
      'SQL/MongoDB'
    ],
    skillDifficulty: {
      'HTML': 'Beginner',
      'CSS': 'Beginner',
      'JavaScript': 'Intermediate',
      'Git/GitHub': 'Beginner',
      'React': 'Intermediate',
      'REST APIs': 'Intermediate',
      'Node.js': 'Intermediate',
      'Express': 'Intermediate',
      'SQL/MongoDB': 'Intermediate',
      'TypeScript': 'Advanced'
    },
    skillPriority: {
      'JavaScript': 'High Priority',
      'React': 'High Priority',
      'TypeScript': 'Critical',
      'REST APIs': 'High Priority',
      'Node.js': 'High Priority',
      'HTML': 'Medium',
      'CSS': 'Medium',
      'SQL/MongoDB': 'Medium',
      'Git/GitHub': 'Medium'
    },
    youtubeSearchTopics: [
      'HTML CSS JavaScript full course',
      'JavaScript placement preparation',
      'React JS full course',
      'React projects',
      'Node.js full course',
      'Full stack development roadmap'
    ],
    topCompanies: ['Swiggy', 'Zomato', 'Paytm', 'Razorpay', 'Flipkart', 'Zepto', 'Intuit'],
    learningPath: 'Modern JS (ES6+, Event Loop) → React 19 & Component Architecture → Node.js / Express APIs → TypeScript & Cloud Deployment',
    recommendedProjects: [
      {
        title: 'Real-Time Collaborative Code Editor with Live Execution',
        stack: 'React, TypeScript, Node.js, WebSockets, Redis',
        desc: 'Built multi-cursor synchronized code editor with room management, syntax highlighting, and live containerized compilation.',
        recruiterNote: 'Demonstrates WebSocket real-time state sync and sophisticated frontend component architecture.'
      },
      {
        title: 'High-Performance E-Commerce Platform with Stripe Checkout',
        stack: 'Next.js, Tailwind CSS, Express, MongoDB, Redis',
        desc: 'Includes JWT auth, optimistic UI updates, Redis product caching, and webhooks for payment verification.',
        recruiterNote: 'Proves complete full-stack mastery and payment integration experience.'
      }
    ],
    interviewTopics: [
      'JavaScript Engine: Call Stack, Event Loop, Closures, Hoisting',
      'React: Virtual DOM, Reconciliation, Hooks Internals, State Management',
      'Asynchronous Programming: Promises, Async/Await, Microtasks',
      'API Design: Idempotency, Rate Limiting, CORS, Authentication Tokens',
      'Web Performance: Bundle Splitting, Lazy Loading, Core Web Vitals'
    ],
    placementPrep: [
      'Machine Coding Round: Build a complex component (e.g., Infinite Scroll or Autocomplete) in 90 minutes',
      'Frontend System Design: Architecture of Pinterest / Netflix homepage',
      'Live Debugging & Refactoring Exercise'
    ]
  },
  {
    id: 'data-analyst',
    title: 'Data Analyst / Data Scientist',
    category: 'Data & Analytics',
    icon: 'fa-solid fa-chart-pie',
    salary: '₹7 - 20 LPA',
    desc: 'Uncovers trends, patterns, and insights from massive datasets to drive commercial decisions and executive strategy.',
    requiredSkills: [
      'Python',
      'SQL',
      'Statistics',
      'Pandas',
      'NumPy',
      'Data Visualization',
      'Power BI / Tableau',
      'Excel',
      'Machine Learning fundamentals'
    ],
    skillDifficulty: {
      'Excel': 'Beginner',
      'SQL': 'Intermediate',
      'Python': 'Intermediate',
      'Pandas': 'Intermediate',
      'NumPy': 'Intermediate',
      'Data Visualization': 'Beginner',
      'Power BI / Tableau': 'Intermediate',
      'Statistics': 'Advanced',
      'Machine Learning fundamentals': 'Advanced'
    },
    skillPriority: {
      'SQL': 'High Priority',
      'Statistics': 'Critical',
      'Python': 'High Priority',
      'Pandas': 'High Priority',
      'Power BI / Tableau': 'Medium',
      'Data Visualization': 'Medium',
      'NumPy': 'Medium',
      'Excel': 'Medium',
      'Machine Learning fundamentals': 'Critical'
    },
    youtubeSearchTopics: [
      'SQL for data analysis',
      'Python for data science',
      'Pandas full course',
      'Statistics for data science',
      'Power BI full course',
      'Data analyst roadmap'
    ],
    topCompanies: ['Deloitte', 'EY', 'Fractal Analytics', 'Mu Sigma', 'JPMorgan Chase', 'Accenture', 'Tiger Analytics'],
    learningPath: 'Advanced Analytical SQL → Statistical Foundations & Hypothesis Testing → Python Pandas/NumPy → Interactive BI Dashboards',
    recommendedProjects: [
      {
        title: 'Executive Healthcare Outcomes & Readmission Predictive Dashboard',
        stack: 'Python, SQL, Power BI, Scikit-Learn',
        desc: 'Processed 150,000+ patient records, uncovered core readmission indicators, and built interactive hospital executive dashboard.',
        recruiterNote: 'Demonstrates end-to-end analytical pipeline from raw queries to business storytelling.'
      },
      {
        title: 'Customer Lifetime Value & Churn Prediction Pipeline',
        stack: 'Python, Pandas, Seaborn, XGBoost, Streamlit',
        desc: 'Engineered cohort retention models and identified key customer friction drivers, increasing simulated retention by 22%.',
        recruiterNote: 'Proves statistical modeling and machine learning fundamentals.'
      }
    ],
    interviewTopics: [
      'Complex SQL: Windows Functions (DENSE_RANK, LEAD/LAG), CTEs, Self Joins',
      'Statistical Inference: P-Values, Confidence Intervals, Central Limit Theorem, A/B Testing',
      'Data Wrangling: Handling Missing Data, Outliers, Feature Scaling',
      'Business Metrics: LTV, CAC, Retention Cohorts, Churn Rate calculation'
    ],
    placementPrep: [
      'Live SQL Query Screenings on HackerRank/StrataScratch',
      'Case Study Analysis: "How would you diagnose a 15% drop in user engagement?"',
      'Portfolio Presentation of Business Intelligence Dashboards'
    ]
  },
  {
    id: 'aiml',
    title: 'AI/ML Engineer',
    category: 'Artificial Intelligence',
    icon: 'fa-solid fa-brain',
    salary: '₹14 - 40 LPA',
    desc: 'Builds neural networks, deep learning models, natural language processing (NLP), and intelligent generative AI pipelines.',
    requiredSkills: [
      'Python',
      'NumPy',
      'Pandas',
      'Statistics',
      'Machine Learning',
      'Deep Learning',
      'Neural Networks',
      'NLP',
      'TensorFlow/PyTorch',
      'Generative AI'
    ],
    skillDifficulty: {
      'Python': 'Beginner',
      'NumPy': 'Intermediate',
      'Pandas': 'Intermediate',
      'Statistics': 'Intermediate',
      'Machine Learning': 'Intermediate',
      'Neural Networks': 'Advanced',
      'Deep Learning': 'Advanced',
      'NLP': 'Advanced',
      'TensorFlow/PyTorch': 'Advanced',
      'Generative AI': 'Advanced'
    },
    skillPriority: {
      'Machine Learning': 'High Priority',
      'Deep Learning': 'High Priority',
      'Neural Networks': 'Critical',
      'TensorFlow/PyTorch': 'Critical',
      'Statistics': 'High Priority',
      'NLP': 'High Priority',
      'Generative AI': 'Critical',
      'Python': 'Medium',
      'NumPy': 'Medium',
      'Pandas': 'Medium'
    },
    youtubeSearchTopics: [
      'Machine learning full course',
      'Deep learning full course',
      'Neural networks explained',
      'NLP full course',
      'Generative AI roadmap',
      'AI ML placement preparation'
    ],
    topCompanies: ['NVIDIA', 'Microsoft AI', 'Google DeepMind', 'InMobi', 'Flipkart', 'Wadhwani AI', 'Ola Krutrim'],
    learningPath: 'Linear Algebra & Calculus → Classical ML from Scratch → PyTorch Deep Learning & CNNs → Transformers, NLP & Generative AI',
    recommendedProjects: [
      {
        title: 'Multimodal Medical MRI Diagnostic Classifier',
        stack: 'Python, PyTorch, TorchVision, FastAPI, Docker',
        desc: 'Trained Convolutional Neural Network (DenseNet) with attention gates achieving 95.2% accuracy on 40,000 clinical scans.',
        recruiterNote: 'Demonstrates deep learning model architecture, loss optimization, and medical AI ethics.'
      },
      {
        title: 'Enterprise Enterprise RAG Assistant with Hybrid Search',
        stack: 'LangChain, LlamaIndex, Pinecone, OpenAI / Ollama, FastAPI',
        desc: 'Implemented semantic vector indexing, re-ranking algorithms, and conversational memory with sub-second response times.',
        recruiterNote: 'Proves modern Generative AI engineering and vector database integration.'
      }
    ],
    interviewTopics: [
      'Math of Backpropagation, Gradient Descent variants (Adam, RMSProp)',
      'Regularization: L1/L2, Dropout, Batch Normalization, Data Augmentation',
      'Transformers: Self-Attention mechanism, Positional Encodings, BERT vs GPT',
      'Model Evaluation: ROC-AUC, F1-Score, Bias-Variance Tradeoff, Confusion Matrix',
      'ML System Design: Recommendation systems, embedding generation, GPU latency'
    ],
    placementPrep: [
      'Mathematical Derivations on Whiteboard (Linear Regression, SVMs)',
      'PyTorch / TensorFlow Coding Test',
      'Research Paper Discussion and Thesis Viva'
    ]
  },
  {
    id: 'cloud-devops',
    title: 'DevOps Engineer / Cloud Engineer',
    category: 'Infrastructure & Cloud',
    icon: 'fa-solid fa-cloud',
    salary: '₹9 - 28 LPA',
    desc: 'Automates server infrastructure, containerizes applications, provisions cloud architectures, and orchestrates CI/CD pipelines.',
    requiredSkills: [
      'Linux',
      'Networking',
      'Git',
      'Docker',
      'Kubernetes',
      'CI/CD',
      'AWS/Azure/GCP',
      'Terraform',
      'Monitoring',
      'Cloud Security'
    ],
    skillDifficulty: {
      'Git': 'Beginner',
      'Linux': 'Intermediate',
      'Networking': 'Intermediate',
      'Docker': 'Intermediate',
      'CI/CD': 'Intermediate',
      'AWS/Azure/GCP': 'Intermediate',
      'Kubernetes': 'Advanced',
      'Terraform': 'Advanced',
      'Monitoring': 'Intermediate',
      'Cloud Security': 'Advanced'
    },
    skillPriority: {
      'Docker': 'High Priority',
      'Kubernetes': 'Critical',
      'CI/CD': 'High Priority',
      'AWS/Azure/GCP': 'High Priority',
      'Linux': 'High Priority',
      'Terraform': 'Critical',
      'Cloud Security': 'Medium',
      'Networking': 'Medium',
      'Monitoring': 'Medium',
      'Git': 'Medium'
    },
    youtubeSearchTopics: [
      'DevOps roadmap',
      'Docker Kubernetes full course',
      'AWS cloud full course',
      'Linux for DevOps',
      'CI/CD pipeline',
      'Kubernetes for beginners'
    ],
    topCompanies: ['Amazon Web Services', 'Red Hat', 'Microsoft Azure', 'Infosys Cloud', 'Wipro', 'Capgemini', 'Cisco'],
    learningPath: 'Linux Administration & Bash → Cloud Architecture (AWS) → Docker Containerization → Kubernetes Orchestration & Terraform IaC',
    recommendedProjects: [
      {
        title: 'End-to-End Automated GitOps Pipeline with ArgoCD & Kubernetes',
        stack: 'Kubernetes (k8s), ArgoCD, GitHub Actions, Docker, Helm',
        desc: 'Automated continuous integration and deployment with canary rollouts, automated rollback, and zero-downtime deployments.',
        recruiterNote: 'Demonstrates modern cloud-native GitOps deployment practices.'
      },
      {
        title: 'Multi-Region High-Availability Cloud Infrastructure as Code',
        stack: 'Terraform, AWS (VPC, EKS, RDS, S3, Route53), Prometheus & Grafana',
        desc: 'Provisioned fault-tolerant infrastructure with automated auto-scaling groups, alerting metrics, and centralized logging.',
        recruiterNote: 'Proves enterprise cloud architecture and infrastructure provisioning.'
      }
    ],
    interviewTopics: [
      'Linux Troubleshooting: top, netstat, systemd, strace, file permissions',
      'Docker: Multi-stage builds, container isolation, cgroups, volume persistence',
      'Kubernetes: Pods, ReplicaSets, Services (ClusterIP vs NodePort), Ingress controllers',
      'CI/CD: Blue-Green vs Canary deployments, security scanning in pipelines',
      'Cloud Networking: VPC Peering, CIDR blocks, Subnets, NAT Gateways'
    ],
    placementPrep: [
      'Live Linux Shell Terminal Assessment',
      'Kubernetes Cluster Configuration Debugging',
      'Cloud Infrastructure Whiteboard Design'
    ]
  },
  {
    id: 'cybersecurity',
    title: 'Cybersecurity Engineer / Security Analyst',
    category: 'Security & Defense',
    icon: 'fa-solid fa-shield-halved',
    salary: '₹8 - 26 LPA',
    desc: 'Audits vulnerabilities, performs ethical penetration testing, monitors SIEM security operation centers, and analyzes digital forensics.',
    requiredSkills: [
      'Networking',
      'Linux',
      'Cybersecurity fundamentals',
      'Ethical Hacking',
      'Penetration Testing',
      'Web Security',
      'SOC',
      'Digital Forensics',
      'SIEM',
      'Incident Response'
    ],
    skillDifficulty: {
      'Linux': 'Intermediate',
      'Networking': 'Intermediate',
      'Cybersecurity fundamentals': 'Beginner',
      'Web Security': 'Intermediate',
      'Ethical Hacking': 'Intermediate',
      'SIEM': 'Intermediate',
      'SOC': 'Intermediate',
      'Penetration Testing': 'Advanced',
      'Digital Forensics': 'Advanced',
      'Incident Response': 'Advanced'
    },
    skillPriority: {
      'Networking': 'High Priority',
      'Ethical Hacking': 'High Priority',
      'Web Security': 'High Priority',
      'Penetration Testing': 'Critical',
      'SIEM': 'Critical',
      'Digital Forensics': 'Critical',
      'Linux': 'Medium',
      'Cybersecurity fundamentals': 'Medium',
      'SOC': 'Medium',
      'Incident Response': 'Medium'
    },
    youtubeSearchTopics: [
      'Cybersecurity roadmap',
      'Ethical hacking full course',
      'Networking for cybersecurity',
      'Linux for cybersecurity',
      'SOC analyst roadmap',
      'Digital forensics course'
    ],
    topCompanies: ['Palo Alto Networks', 'CrowdStrike', 'TCS Cyber Security', 'Wipro Cyber', 'PwC', 'KPMG', 'Quick Heal'],
    learningPath: 'TCP/IP Network Forensics → Kali Linux & Bash → OWASP Web Security & Pentesting → SOC Operations & SIEM Splunk Triage',
    recommendedProjects: [
      {
        title: 'Automated Web Vulnerability Scanner & Exploit Reporter',
        stack: 'Python, Scapy, Requests, OWASP ZAP API, Beautiful Soup',
        desc: 'Discovers SQL Injection, XSS, and insecure direct object references (IDOR) with automated CVSS severity score generation.',
        recruiterNote: 'Demonstrates penetration testing automation and defensive coding.'
      },
      {
        title: 'Enterprise SOC SIEM Detection & Brute-Force Incident Response Lab',
        stack: 'Splunk SIEM, Wireshark, Snort IDS, Suricata, Kali Linux',
        desc: 'Simulated multi-stage cyber attacks, configured custom IDS alert rules, and generated forensic incident reports.',
        recruiterNote: 'Proves security monitoring, alert triage, and threat hunting.'
      }
    ],
    interviewTopics: [
      'OWASP Top 10: In-depth mitigation of SQL Injection, XSS, CSRF, and SSRF',
      'Network Security: TCP 3-Way Handshake, SYN Flood attacks, ARP Poisoning, DNS Spoofing',
      'Cryptography: Symmetric vs Asymmetric ciphers, Hashing (SHA vs MD5), Public Key Infrastructure (PKI)',
      'Incident Response: Preparation, Identification, Containment, Eradication, Recovery, Lessons Learned'
    ],
    placementPrep: [
      'Capture The Flag (CTF) Web Security Challenges (TryHackMe/HackTheBox)',
      'Wireshark .pcap File Packet Analysis Assessment',
      'Security Incident Playbook Discussion'
    ]
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
      programmingLanguage: user.programmingLanguage || user.programming_language || 'Java',
      dsaSkill: user.dsaSkill || user.dsa_skill || 'Advanced',
      coreCsKnowledge: user.coreCsKnowledge || user.core_cs_knowledge || 'Strong',
      devSkills: user.devSkills || user.dev_skills || 'Full Stack & APIs',
      communicationScore: parseInt(user.communicationScore !== undefined ? user.communicationScore : (user.communication_score || 85)),
      resumeScore: parseInt(user.resumeScore !== undefined ? user.resumeScore : (user.resume_score || 85)),
      targetCareerId: user.targetCareerId || user.target_career_id || 'sde',
      targetCareerTitle: user.targetCareerTitle || user.target_career_title || 'Software Engineer / SDE',
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
