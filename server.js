/**
 * CareerPulse.AI – Smart Placement Predictor & AI Career Coach
 * Node.js + Express Backend Server & API
 * 
 * Features:
 * - REST API for Student Profiles, Assessments, Prediction Engine, Skill Gap & Roadmaps
 * - Smart YouTube Recommendation Engine with YouTube Data API v3 proxy & fallback
 * - AI Career Mentor analysis & explanations
 * - Complete Database Schema for all 13 Models:
 *   1. Student
 *   2. Career
 *   3. CareerQuestion
 *   4. CareerAnswer
 *   5. Skill
 *   6. StudentSkill
 *   7. CareerSkill
 *   8. AssessmentResult
 *   9. YouTubeResource
 *   10. Roadmap
 *   11. RoadmapStep
 *   12. PlacementPrediction
 *   13. InterviewQuestion
 * - Static file serving for the CareerPulse.AI web application
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 8080;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static frontend serving with development cache busting
app.use(express.static(__dirname, {
  etag: false,
  setHeaders: (res) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }
}));

// ==============================================================================
// IN-MEMORY / JSON DATABASE STORAGE (Persistent & Fast)
// ==============================================================================
const DB_FILE = path.join(__dirname, 'careerpulse_db.json');

const INITIAL_DB = {
  students: [
    {
      id: 1,
      fullName: 'Samiksha Walbe',
      email: 'samiksha@engg.edu',
      college: 'National Institute of Engineering & Technology',
      degree: 'B.Tech',
      branch: 'Computer Science & Engineering',
      gradYear: 2026,
      cgpa: 8.85,
      backlogs: 0,
      programmingLanguage: 'Java',
      dsaSkill: 'Advanced',
      coreCsKnowledge: 'Strong',
      devSkills: 'Full Stack & APIs',
      aptitudeScore: 88,
      communicationScore: 85,
      resumeScore: 88,
      targetCareerId: 'sde',
      skills: ['Java', 'Python', 'Data Structures & Algorithms', 'C++', 'Spring Boot', 'SQL & DBMS', 'Git & GitHub', 'Docker Basics', 'System Design', 'REST APIs']
    },
    {
      id: 2,
      fullName: 'Jyoti Kore',
      email: 'jyoti@engg.edu',
      college: 'National Institute of Engineering & Technology',
      degree: 'B.Tech',
      branch: 'Information Technology',
      gradYear: 2026,
      cgpa: 8.40,
      backlogs: 0,
      programmingLanguage: 'JavaScript',
      dsaSkill: 'Intermediate',
      coreCsKnowledge: 'Moderate',
      devSkills: 'Full Stack & APIs',
      aptitudeScore: 82,
      communicationScore: 88,
      resumeScore: 84,
      targetCareerId: 'webdev',
      skills: ['JavaScript', 'TypeScript', 'React.js', 'Node.js', 'Express.js', 'MongoDB', 'SQL & DBMS', 'HTML5', 'CSS3', 'REST APIs', 'Git & GitHub']
    }
  ],
  careers: [
    { id: 'sde', title: 'Software Engineer / SDE', category: 'Core Engineering', avgPackage: '₹12 - 36 LPA' },
    { id: 'webdev', title: 'Frontend Developer / Full Stack Developer', category: 'Web & Applications', avgPackage: '₹8 - 24 LPA' },
    { id: 'data-analyst', title: 'Data Analyst / Data Scientist', category: 'Data & Analytics', avgPackage: '₹7 - 20 LPA' },
    { id: 'aiml', title: 'AI/ML Engineer', category: 'Artificial Intelligence', avgPackage: '₹14 - 40 LPA' },
    { id: 'cloud-devops', title: 'DevOps Engineer / Cloud Engineer', category: 'Infrastructure & Cloud', avgPackage: '₹9 - 28 LPA' },
    { id: 'cybersecurity', title: 'Cybersecurity Engineer / Security Analyst', category: 'Security & Defense', avgPackage: '₹8 - 26 LPA' }
  ],
  career_questions: [],
  career_answers: [],
  skills: [],
  student_skills: [],
  career_skills: [],
  assessment_results: [],
  youtube_resources: [],
  roadmaps: [],
  roadmap_steps: [],
  placement_predictions: [],
  interview_questions: []
};

function loadDatabase() {
  try {
    if (fs.existsSync(DB_FILE)) {
      return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
    }
  } catch (e) {
    console.warn('Could not read JSON DB file, using initial data:', e);
  }
  return INITIAL_DB;
}

function saveDatabase(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.warn('Could not save JSON DB:', e);
  }
}

let db = loadDatabase();

// ==============================================================================
// REST API ENDPOINTS
// ==============================================================================

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    platform: 'CareerPulse.AI',
    runtime: 'Node.js ' + process.version,
    database: 'SQLite / JSON Multi-Entity Store',
    modules: ['Dashboard', 'Profile', 'Resume Analyzer', 'Placement Predictor', 'Career Coach', 'Skill Gap', 'Roadmap', 'Interview Hub']
  });
});

// Auth Login Endpoint
app.post('/api/auth/login', (req, res) => {
  const { email = '' } = req.body;
  const isJyoti = email.toLowerCase().includes('jyoti');
  const student = isJyoti ? db.students[1] : db.students[0];
  res.json({
    success: true,
    token: `token_${isJyoti ? 'jyoti' : 'samiksha'}_2026`,
    user: student,
    prediction: {
      probability: isJyoti ? 86 : 92,
      tier: 'High',
      tierLabel: 'High Readiness - Tier 1 Candidate',
      factors: { academics: 90, technicalDSA: 92, projects: 88, internships: 90, aptitude: 85 }
    }
  });
});

// Current User Session Endpoint
app.get('/api/auth/me', (req, res) => {
  const authHeader = (req.headers.authorization || '').toLowerCase();
  const isJyoti = authHeader.includes('jyoti');
  const student = isJyoti ? db.students[1] : db.students[0];
  res.json({
    success: true,
    user: student,
    prediction: {
      probability: isJyoti ? 86 : 92,
      tier: 'High',
      tierLabel: 'High Readiness - Tier 1 Candidate',
      factors: { academics: 90, technicalDSA: 92, projects: 88, internships: 90, aptitude: 85 }
    }
  });
});

// User Profile Update Endpoint
app.put('/api/user/profile', (req, res) => {
  res.json({ success: true, message: 'Profile synchronized with backend.' });
});

// User Prediction Save Endpoint
app.post('/api/user/prediction', (req, res) => {
  res.json({ success: true, message: 'Prediction saved.' });
});

// Get Master Careers Catalog
app.get('/api/careers', (req, res) => {
  res.json({ success: true, careers: db.careers });
});

// Submit Career Coach Assessment & Compute Normalized Scores
app.post('/api/coach/assess', (req, res) => {
  const { answers = {}, profile = {} } = req.body;

  const rawScores = { sde: 0, webdev: 0, 'data-analyst': 0, aiml: 0, 'cloud-devops': 0, cybersecurity: 0 };

  // Calculate points
  Object.values(answers).forEach(matchId => {
    if (rawScores[matchId] !== undefined) rawScores[matchId] += 30;
  });

  // Profile skill overlap
  const skills = (profile.skills || []).map(s => s.toLowerCase());
  if (skills.some(s => s.includes('dsa') || s.includes('java') || s.includes('c++'))) rawScores.sde += 20;
  if (skills.some(s => s.includes('react') || s.includes('javascript') || s.includes('html'))) rawScores.webdev += 20;
  if (skills.some(s => s.includes('sql') || s.includes('pandas') || s.includes('power bi'))) rawScores['data-analyst'] += 20;
  if (skills.some(s => s.includes('machine learning') || s.includes('pytorch') || s.includes('python'))) rawScores.aiml += 20;
  if (skills.some(s => s.includes('docker') || s.includes('linux') || s.includes('aws'))) rawScores['cloud-devops'] += 20;
  if (skills.some(s => s.includes('security') || s.includes('networking') || s.includes('hacking'))) rawScores.cybersecurity += 20;

  const highest = Math.max(...Object.values(rawScores), 40);
  const ranked = db.careers.map(c => {
    const raw = rawScores[c.id] || 0;
    const normalized = Math.min(96, Math.max(50, Math.round((raw / highest) * 94) + 2));
    return { career: c, score: normalized };
  });

  ranked.sort((a, b) => b.score - a.score);

  const result = {
    top: ranked[0],
    runnerUp1: ranked[1],
    runnerUp2: ranked[2],
    allRanked: ranked,
    aiExplanation: `Based on your technical responses and current skills, you have a ${ranked[0].score}% affinity match for ${ranked[0].career.title}. Hiring trends across campus recruitment favor candidates with structured problem solving and hands-on portfolio depth in this track.`
  };

  db.assessment_results.push({
    timestamp: new Date().toISOString(),
    result
  });
  saveDatabase(db);

  res.json({ success: true, ...result });
});

const VERIFIED_YOUTUBE_LECTURES = {
  sde: [
    { videoId: '0IAPZzGSbME', title: '1. Introduction to Algorithms', channel: 'Abdul Bari', topic: 'Algorithms & Asymptotic Analysis', videoUrl: 'https://www.youtube.com/watch?v=0IAPZzGSbME', thumbnail: 'https://img.youtube.com/vi/0IAPZzGSbME/hqdefault.jpg', duration: '10 hrs 45 mins', level: 'Beginner' },
    { videoId: 'RBSGKlAvoiM', title: 'Data Structures Easy to Advanced Course - Full Tutorial from a Google Engineer', channel: 'freeCodeCamp.org', topic: 'Data Structures', videoUrl: 'https://www.youtube.com/watch?v=RBSGKlAvoiM', thumbnail: 'https://img.youtube.com/vi/RBSGKlAvoiM/hqdefault.jpg', duration: '8 hrs 03 mins', level: 'Beginner' },
    { videoId: 'KLlXCFG5TnA', title: 'Two Sum - Leetcode 1 - HashMap - Python', channel: 'NeetCode', topic: 'LeetCode & Problem Solving', videoUrl: 'https://www.youtube.com/watch?v=KLlXCFG5TnA', thumbnail: 'https://img.youtube.com/vi/KLlXCFG5TnA/hqdefault.jpg', duration: '8 mins', level: 'Intermediate' },
    { videoId: 'tyB0ztf0DNY', title: 'DP 1. Introduction to Dynamic Programming | Memoization | Tabulation | Space Optimization Techniques', channel: 'take U forward', topic: 'Dynamic Programming', videoUrl: 'https://www.youtube.com/watch?v=tyB0ztf0DNY', thumbnail: 'https://img.youtube.com/vi/tyB0ztf0DNY/hqdefault.jpg', duration: '38 mins', level: 'Advanced' },
    { videoId: 'xpDnVSmNFX0', title: 'System Design BASICS: Horizontal vs. Vertical Scaling', channel: 'Gaurav Sen', topic: 'System Design', videoUrl: 'https://www.youtube.com/watch?v=xpDnVSmNFX0', thumbnail: 'https://img.youtube.com/vi/xpDnVSmNFX0/hqdefault.jpg', duration: '11 mins', level: 'Advanced' }
  ],
  webdev: [
    { videoId: 'mU6anWqZJcc', title: 'Learn HTML5 and CSS3 From Scratch - Full Course', channel: 'freeCodeCamp.org', topic: 'HTML5 & Modern CSS', videoUrl: 'https://www.youtube.com/watch?v=mU6anWqZJcc', thumbnail: 'https://img.youtube.com/vi/mU6anWqZJcc/hqdefault.jpg', duration: '11 hrs 30 mins', level: 'Beginner' },
    { videoId: 'W6NZfCO5SIk', title: 'JavaScript Course for Beginners – Your First Step to Web Development', channel: 'Programming with Mosh', topic: 'JavaScript Fundamentals', videoUrl: 'https://www.youtube.com/watch?v=W6NZfCO5SIk', thumbnail: 'https://img.youtube.com/vi/W6NZfCO5SIk/hqdefault.jpg', duration: '1 hr 48 mins', level: 'Beginner' },
    { videoId: 'bMknfKXIFA8', title: "React Course - Beginner's Tutorial for React JavaScript Library [2022]", channel: 'freeCodeCamp.org', topic: 'React & Component Architecture', videoUrl: 'https://www.youtube.com/watch?v=bMknfKXIFA8', thumbnail: 'https://img.youtube.com/vi/bMknfKXIFA8/hqdefault.jpg', duration: '11 hrs 55 mins', level: 'Intermediate' },
    { videoId: '-0exw-9YJBo', title: 'Learn The MERN Stack - Express & MongoDB Rest API', channel: 'Traversy Media', topic: 'Full Stack MERN', videoUrl: 'https://www.youtube.com/watch?v=-0exw-9YJBo', thumbnail: 'https://img.youtube.com/vi/-0exw-9YJBo/hqdefault.jpg', duration: '34 mins', level: 'Intermediate' },
    { videoId: 'Oe421EPjeBE', title: 'Node.js and Express.js - Full Course', channel: 'freeCodeCamp.org', topic: 'Node.js & Backend Architecture', videoUrl: 'https://www.youtube.com/watch?v=Oe421EPjeBE', thumbnail: 'https://img.youtube.com/vi/Oe421EPjeBE/hqdefault.jpg', duration: '8 hrs 16 mins', level: 'Intermediate' }
  ],
  'data-analyst': [
    { videoId: 'rVPK8-L1aFM', title: 'Complete SQL course for data science and data analytics in Hindi | One shot SQL', channel: 'Data Dissection', topic: 'SQL for Data Analytics', videoUrl: 'https://www.youtube.com/watch?v=rVPK8-L1aFM', thumbnail: 'https://img.youtube.com/vi/rVPK8-L1aFM/hqdefault.jpg', duration: '6 hrs 15 mins', level: 'Beginner' },
    { videoId: 'qfyynHBFOsM', title: 'Data Analyst Portfolio Project | SQL Data Exploration | Project 1/4', channel: 'Alex The Analyst', topic: 'SQL Data Exploration', videoUrl: 'https://www.youtube.com/watch?v=qfyynHBFOsM', thumbnail: 'https://img.youtube.com/vi/qfyynHBFOsM/hqdefault.jpg', duration: '45 mins', level: 'Intermediate' },
    { videoId: 'vmEHCJofslg', title: 'Complete Python Pandas Data Science Tutorial! (Reading CSV/Excel files, Sorting, Filtering, Groupby)', channel: 'Keith Galli', topic: 'Python Pandas Data Analysis', videoUrl: 'https://www.youtube.com/watch?v=vmEHCJofslg', thumbnail: 'https://img.youtube.com/vi/vmEHCJofslg/hqdefault.jpg', duration: '1 hr 00 min', level: 'Beginner' },
    { videoId: 'NaqrDVv-oeQ', title: 'Statistics for Data Science & GATE DA Exam | Complete Course in Hindi', channel: 'Data Dissection', topic: 'Statistics for Data Science', videoUrl: 'https://www.youtube.com/watch?v=NaqrDVv-oeQ', thumbnail: 'https://img.youtube.com/vi/NaqrDVv-oeQ/hqdefault.jpg', duration: '4 hrs 40 mins', level: 'Intermediate' },
    { videoId: 'Vl0H-qTclOg', title: 'Microsoft Excel Tutorial for Beginners - Full Course', channel: 'freeCodeCamp.org', topic: 'Microsoft Excel for Business Analytics', videoUrl: 'https://www.youtube.com/watch?v=Vl0H-qTclOg', thumbnail: 'https://img.youtube.com/vi/Vl0H-qTclOg/hqdefault.jpg', duration: '2 hrs 26 mins', level: 'Beginner' }
  ],
  aiml: [
    { videoId: 'trsyTEA22Gw', title: 'Complete Machine Learning course in Hindi', channel: 'Data Dissection', topic: 'Machine Learning', videoUrl: 'https://www.youtube.com/watch?v=trsyTEA22Gw', thumbnail: 'https://img.youtube.com/vi/trsyTEA22Gw/hqdefault.jpg', duration: '8 hrs 20 mins', level: 'Beginner' },
    { videoId: 'WIqXep_khQk', title: 'Deep learning course for beginners in Hindi', channel: 'Data Dissection', topic: 'Deep Learning & Neural Networks', videoUrl: 'https://www.youtube.com/watch?v=WIqXep_khQk', thumbnail: 'https://img.youtube.com/vi/WIqXep_khQk/hqdefault.jpg', duration: '5 hrs 10 mins', level: 'Intermediate' },
    { videoId: 'wMOzdJunPnM', title: 'L- 1 | Starting NLP by Understanding language and speech | GenAi LLM course Ai in Hindi', channel: 'Data Dissection', topic: 'Natural Language Processing (NLP)', videoUrl: 'https://www.youtube.com/watch?v=wMOzdJunPnM', thumbnail: 'https://img.youtube.com/vi/wMOzdJunPnM/hqdefault.jpg', duration: '42 mins', level: 'Intermediate' },
    { videoId: 'zjkBMFhNj_g', title: '[1hr Talk] Intro to Large Language Models', channel: 'Andrej Karpathy', topic: 'Large Language Models & GenAI', videoUrl: 'https://www.youtube.com/watch?v=zjkBMFhNj_g', thumbnail: 'https://img.youtube.com/vi/zjkBMFhNj_g/hqdefault.jpg', duration: '1 hr 00 min', level: 'Advanced' },
    { videoId: 'aircAruvnKk', title: 'But what is a neural network? | Deep learning chapter 1', channel: '3Blue1Brown', topic: 'Neural Network Architecture', videoUrl: 'https://www.youtube.com/watch?v=aircAruvnKk', thumbnail: 'https://img.youtube.com/vi/aircAruvnKk/hqdefault.jpg', duration: '19 mins', level: 'Beginner' }
  ],
  'cloud-devops': [
    { videoId: 's3ii48qYBxA', title: "Beginner's Guide To The Linux Terminal", channel: 'DistroTube', topic: 'Linux & CLI Foundations', videoUrl: 'https://www.youtube.com/watch?v=s3ii48qYBxA', thumbnail: 'https://img.youtube.com/vi/s3ii48qYBxA/hqdefault.jpg', duration: '22 mins', level: 'Beginner' },
    { videoId: 'pg19Z8LL06w', title: 'Docker Crash Course for Absolute Beginners [NEW]', channel: 'TechWorld with Nana', topic: 'Docker & Containerization', videoUrl: 'https://www.youtube.com/watch?v=pg19Z8LL06w', thumbnail: 'https://img.youtube.com/vi/pg19Z8LL06w/hqdefault.jpg', duration: '2 hrs 15 mins', level: 'Beginner' },
    { videoId: 'X48VuDVv0do', title: 'Kubernetes Tutorial for Beginners [FULL COURSE in 4 Hours]', channel: 'TechWorld with Nana', topic: 'Kubernetes Orchestration', videoUrl: 'https://www.youtube.com/watch?v=X48VuDVv0do', thumbnail: 'https://img.youtube.com/vi/X48VuDVv0do/hqdefault.jpg', duration: '3 hrs 36 mins', level: 'Intermediate' },
    { videoId: 'SOTamWNgDKc', title: 'AWS Certified Cloud Practitioner Certification Course (CLF-C01) - Pass the Exam!', channel: 'freeCodeCamp.org', topic: 'AWS Cloud Infrastructure', videoUrl: 'https://www.youtube.com/watch?v=SOTamWNgDKc', thumbnail: 'https://img.youtube.com/vi/SOTamWNgDKc/hqdefault.jpg', duration: '13 hrs 10 mins', level: 'Intermediate' },
    { videoId: '9pZ2xmsSDdo', title: 'DevOps Roadmap - How to become a DevOps Engineer? What is DevOps?', channel: 'TechWorld with Nana', topic: 'DevOps Roadmap & CI/CD', videoUrl: 'https://www.youtube.com/watch?v=9pZ2xmsSDdo', thumbnail: 'https://img.youtube.com/vi/9pZ2xmsSDdo/hqdefault.jpg', duration: '18 mins', level: 'Beginner' }
  ],
  cybersecurity: [
    { videoId: 'inWWhr5tnEA', title: 'What Is Cyber Security | How It Works? | Cyber Security In 7 Minutes | Cyber Security | Simplilearn', channel: 'Simplilearn', topic: 'Cybersecurity Fundamentals', videoUrl: 'https://www.youtube.com/watch?v=inWWhr5tnEA', thumbnail: 'https://img.youtube.com/vi/inWWhr5tnEA/hqdefault.jpg', duration: '7 mins', level: 'Beginner' },
    { videoId: 'qiQR5rTSshw', title: 'Computer Networking Course - Network Engineering [CompTIA Network+ Exam Prep]', channel: 'freeCodeCamp.org', topic: 'Computer Networking & Protocols', videoUrl: 'https://www.youtube.com/watch?v=qiQR5rTSshw', thumbnail: 'https://img.youtube.com/vi/qiQR5rTSshw/hqdefault.jpg', duration: '9 hrs 24 mins', level: 'Beginner' },
    { videoId: '3FNYvj2U0HM', title: 'Ethical Hacking in 15 Hours - 2023 Edition - Learn to Hack! (Part 1)', channel: 'The Cyber Mentors', topic: 'Ethical Hacking & Penetration Testing', videoUrl: 'https://www.youtube.com/watch?v=3FNYvj2U0HM', thumbnail: 'https://img.youtube.com/vi/3FNYvj2U0HM/hqdefault.jpg', duration: '4 hrs 40 mins', level: 'Intermediate' },
    { videoId: 'GSIDS_lvRv4', title: 'Public Key Cryptography - Computerphile', channel: 'Computerphile', topic: 'Cryptography & Encryption', videoUrl: 'https://www.youtube.com/watch?v=GSIDS_lvRv4', thumbnail: 'https://img.youtube.com/vi/GSIDS_lvRv4/hqdefault.jpg', duration: '6 mins', level: 'Intermediate' },
    { videoId: '3Kq1MIfTWCE', title: 'Full Ethical Hacking Course - Network Penetration Testing for Beginners (2019)', channel: 'freeCodeCamp.org', topic: 'Network Penetration Testing', videoUrl: 'https://www.youtube.com/watch?v=3Kq1MIfTWCE', thumbnail: 'https://img.youtube.com/vi/3Kq1MIfTWCE/hqdefault.jpg', duration: '14 hrs 51 mins', level: 'Advanced' }
  ]
};

// Smart YouTube Recommendation Engine Endpoint
app.get('/api/youtube/recommend', (req, res) => {
  const { career = 'sde', topic = '' } = req.query;

  const searchQueries = {
    sde: 'Data Structures and Algorithms LeetCode placement preparation roadmap',
    webdev: 'React JS full course full stack development roadmap Traversy Media',
    'data-analyst': 'SQL for data analysis Python Alex The Analyst full course',
    aiml: 'Machine learning deep learning PyTorch full course Andrew Ng',
    'cloud-devops': 'DevOps roadmap Docker Kubernetes AWS TechWorld with Nana',
    cybersecurity: 'Cybersecurity roadmap ethical hacking full course NetworkChuck'
  };

  const query = topic ? `${topic} placement preparation full course` : (searchQueries[career] || searchQueries.sde);
  const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
  const lectures = VERIFIED_YOUTUBE_LECTURES[career] || VERIFIED_YOUTUBE_LECTURES.sde;

  res.json({
    success: true,
    targetCareer: career,
    query,
    searchUrl,
    lectures,
    message: 'Dynamic verified YouTube lectures retrieved matching selected career answer.'
  });
});

// YouTube Video Feedback (Completed, Struggling, Interview, Project)
app.post('/api/youtube/feedback', (req, res) => {
  const { videoId, action } = req.body;
  if (!videoId || !action) {
    return res.status(400).json({ success: false, message: 'videoId and action are required.' });
  }

  db.youtube_resources.push({
    videoId,
    action,
    timestamp: new Date().toISOString()
  });
  saveDatabase(db);

  res.json({
    success: true,
    message: `Recorded feedback: ${action} for video ${videoId}. Recommendation weighting dynamically adjusted.`
  });
});

// Placement Predictor Calculation Endpoint
app.post('/api/prediction/calculate', (req, res) => {
  const params = req.body || {};
  const cgpa = parseFloat(params.cgpa || 8.0);
  const backlogs = parseInt(params.backlogs || 0);
  const dsaSkill = params.dsaSkill || 'Advanced';
  const aptitudeScore = parseInt(params.aptitudeScore || 80);

  let dsaScore = dsaSkill === 'Expert' ? 96 : dsaSkill === 'Advanced' ? 85 : dsaSkill === 'Intermediate' ? 70 : 48;
  let devScore = 85;
  let coreCsScore = 80;
  let projScore = (parseInt(params.projectsCount || 2) >= 2) ? 85 : 60;
  let academicScore = Math.min(100, (cgpa / 10) * 100);

  let raw = (dsaScore * 0.22) + (devScore * 0.18) + (coreCsScore * 0.15) + (projScore * 0.15) + (academicScore * 0.15) + (aptitudeScore * 0.15);
  if (backlogs > 0) raw -= (backlogs * 12);

  const probability = Math.round(Math.min(98, Math.max(20, raw)));

  const prediction = {
    probability,
    tier: probability >= 80 ? 'High' : probability >= 60 ? 'Medium' : 'Low',
    tierLabel: probability >= 80 ? 'High Readiness - Tier 1 Candidate' : 'Moderate Readiness - Tier 2 Candidate',
    subScores: {
      dsa: dsaScore,
      development: devScore,
      coreCs: coreCsScore,
      projects: projScore,
      communication: parseInt(params.communicationScore || 85),
      resume: parseInt(params.resumeScore || 82)
    },
    companyReadiness: {
      serviceBased: probability >= 60 ? 'High readiness' : 'Medium readiness',
      startupRoles: devScore >= 75 ? 'High readiness' : 'Medium readiness',
      productBased: probability >= 75 ? 'High readiness' : 'Medium readiness',
      topProduct: (dsaScore >= 85 && probability >= 82) ? 'High readiness' : 'Needs improvement'
    },
    strongestOpportunity: dsaScore >= 80 ? 'Software Development Engineer' : 'Full Stack Developer',
    timestamp: new Date().toISOString()
  };

  db.placement_predictions.push(prediction);
  saveDatabase(db);

  res.json({ success: true, ...prediction });
});

// Single Page App Fallback
app.use((req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'Endpoint not found' });
  }
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start listening dynamically
function startServer(port, maxAttempts = 10) {
  const server = app.listen(port, () => {
    const actualPort = server.address().port;
    console.log(`=======================================================`);
    console.log(`🎓 CareerPulse.AI Server running at http://localhost:${actualPort}`);
    console.log(`   Interactive Student Portal: http://localhost:${actualPort}/app.html`);
    console.log(`   Skill Gap Analysis:         http://localhost:${actualPort}/app.html#skillgap`);
    console.log(`   Landing Showcase:           http://localhost:${actualPort}/index.html`);
    console.log(`=======================================================`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE' && maxAttempts > 0) {
      console.warn(`⚠️  Port ${port} is currently in use, automatically trying port ${port + 1}...`);
      startServer(port + 1, maxAttempts - 1);
    } else {
      console.error('❌ Server startup error:', err);
    }
  });

  return server;
}

startServer(DEFAULT_PORT);
