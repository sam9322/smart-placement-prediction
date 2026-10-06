/**
 * SMART PLACEMENT PREDICTION & CAREER COACH
 * Authentication Client & Backend Bridge
 * Dedicated support for Samiksha Walbe (CSE) & Jyoti Kore (IT) accounts
 */

const TOKEN_KEY = 'smart_placement_auth_token';
const SESSION_KEY = 'smart_placement_auth_user';
const API_BASE_URL = (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'))
  ? (window.location.port === '5000' ? '' : 'http://localhost:5000')
  : '';

// Canonical Student Data for Samiksha & Jyoti
const SEEDED_STUDENTS = {
  samiksha: {
    fullName: 'Samiksha Walbe',
    email: 'samiksha.walbe@engg.edu',
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
      'Java', 'Python', 'Data Structures & Algorithms', 'C++', 'Spring Boot',
      'SQL & DBMS', 'Git & GitHub', 'Docker Basics', 'System Design', 'REST APIs'
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
    certifications: [
      { id: 'c1', title: 'AWS Certified Solutions Architect - Associate', issuer: 'Amazon Web Services', year: '2025' },
      { id: 'c2', title: 'Problem Solving (Gold Badge)', issuer: 'HackerRank', year: '2024' }
    ],
    internships: [
      {
        id: 'i1',
        company: 'Infosys Digital',
        role: 'Software Engineering Intern',
        duration: '3 Months (May - Jul 2025)',
        desc: 'Engineered scalable microservices and reduced backend API latency by 28%.'
      }
    ],
    prediction: {
      probability: 92,
      tier: 'High',
      tierLabel: 'High Readiness - Tier 1 Product Company Candidate (16 - 32 LPA)',
      factors: { academics: 91, technicalDSA: 92, projects: 90, internships: 93, aptitude: 88 },
      lastCalculated: '2026-10-06'
    }
  },
  jyoti: {
    fullName: 'Jyoti Kore',
    email: 'jyoti.kore@engg.edu',
    college: 'National Institute of Engineering & Technology',
    degree: 'B.Tech',
    branch: 'Information Technology',
    gradYear: '2026',
    rollNumber: 'IT22B1038',
    cgpa: 8.40,
    tenthMarks: 90.5,
    twelfthMarks: 87.5,
    backlogs: 0,
    aptitudeScore: 82,
    codingRating: 1620,
    targetCareerId: 'webdev',
    targetCareerTitle: 'Full Stack Web Developer',
    skills: [
      'JavaScript', 'TypeScript', 'React.js', 'Node.js', 'Express.js',
      'MongoDB', 'SQL & DBMS', 'HTML5', 'CSS3', 'REST APIs', 'Git & GitHub'
    ],
    projects: [
      {
        id: 'p1',
        title: 'Real-Time Collaborative Code Editor',
        stack: 'React, Node.js, WebSockets, MongoDB',
        desc: 'Built collaborative workspace supporting live cursor tracking and multi-language compilation.',
        link: 'https://github.com/jyoti/collab-editor'
      },
      {
        id: 'p2',
        title: 'E-Commerce Microservices Platform',
        stack: 'MERN Stack, Stripe, Redis',
        desc: 'Integrated payment gateways and Redis caching layer improving checkout throughput by 40%.',
        link: 'https://github.com/jyoti/ecommerce-microservices'
      }
    ],
    certifications: [
      { id: 'c1', title: 'Meta Front-End Developer Professional Certificate', issuer: 'Coursera', year: '2024' },
      { id: 'c2', title: 'MongoDB Certified Developer Associate', issuer: 'MongoDB Inc.', year: '2025' }
    ],
    internships: [
      {
        id: 'i1',
        company: 'Cognizant Tech',
        role: 'Web Developer Intern',
        duration: '3 Months (Summer 2025)',
        desc: 'Built responsive client portals and integrated RESTful endpoints.'
      }
    ],
    prediction: {
      probability: 86,
      tier: 'High',
      tierLabel: 'High Readiness - Tier 1 Product / IT Giant (10 - 22 LPA)',
      factors: { academics: 86, technicalDSA: 84, projects: 88, internships: 86, aptitude: 82 },
      lastCalculated: '2026-10-06'
    }
  }
};

class AuthManager {
  constructor() {
    this.token = localStorage.getItem(TOKEN_KEY) || null;
    this.currentUser = null;
    this.isBackendOnline = false;
  }

  isAuthenticated() {
    return !!(this.currentUser && (this.token || localStorage.getItem(SESSION_KEY)));
  }

  async checkBackendHealth() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);
      const res = await fetch(`${API_BASE_URL}/api/health`, { method: 'GET', signal: controller.signal });
      clearTimeout(timeoutId);
      if (res.ok) {
        this.isBackendOnline = true;
        const statusEl = document.getElementById('auth-backend-status');
        if (statusEl) {
          statusEl.innerHTML = '<i class="fa-solid fa-server text-success"></i> Backend: SQLite + Flask (Online)';
        }
        return true;
      }
    } catch (e) {
      this.isBackendOnline = false;
      const statusEl = document.getElementById('auth-backend-status');
      if (statusEl) {
        statusEl.innerHTML = '<i class="fa-solid fa-cloud text-amber"></i> Client Mode: LocalStorage Active';
      }
    }
    return false;
  }

  normalizeUser(user) {
    if (!user) return null;
    const norm = { ...user };
    norm.fullName = user.fullName || user.fullname || 'Student';
    norm.rollNumber = user.rollNumber || user.roll_number || 'CS22B1000';
    norm.gradYear = user.gradYear || user.grad_year || '2026';
    norm.college = user.college || 'National Institute of Engineering & Technology';
    norm.degree = user.degree || 'B.Tech';
    norm.branch = user.branch || 'Computer Science & Engineering';
    norm.cgpa = parseFloat(user.cgpa || 8.0);
    norm.tenthMarks = parseFloat(user.tenthMarks || user.tenth_marks || 90.0);
    norm.twelfthMarks = parseFloat(user.twelfthMarks || user.twelfth_marks || 88.0);
    norm.backlogs = parseInt(user.backlogs !== undefined ? user.backlogs : 0);
    norm.aptitudeScore = parseInt(user.aptitudeScore || user.aptitude_score || 80);
    norm.codingRating = parseInt(user.codingRating || user.coding_rating || 1600);
    norm.targetCareerId = user.targetCareerId || user.target_career_id || 'sde';
    norm.targetCareerTitle = user.targetCareerTitle || user.target_career_title || 'Software Development Engineer';

    // Parse array properties
    norm.skills = Array.isArray(user.skills) ? user.skills : (typeof user.skills === 'string' ? JSON.parse(user.skills || '[]') : []);
    norm.certifications = Array.isArray(user.certifications) ? user.certifications : (typeof user.certifications === 'string' ? JSON.parse(user.certifications || '[]') : []);
    norm.projects = Array.isArray(user.projects) ? user.projects : (typeof user.projects === 'string' ? JSON.parse(user.projects || '[]') : []);
    norm.internships = Array.isArray(user.internships) ? user.internships : (typeof user.internships === 'string' ? JSON.parse(user.internships || '[]') : []);

    return norm;
  }

  async init() {
    await this.checkBackendHealth();
    const savedUserJson = localStorage.getItem(SESSION_KEY);

    if (this.token && this.isBackendOnline) {
      await this.fetchCurrentUser();
    } else if (savedUserJson) {
      try {
        this.currentUser = JSON.parse(savedUserJson);
      } catch (e) {
        this.currentUser = null;
        localStorage.removeItem(SESSION_KEY);
      }
    } else {
      // User is a guest / not logged in!
      this.currentUser = null;
    }

    this.updateNavbarAuthUI();
  }

  async fetchCurrentUser() {
    if (!this.token) return null;
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
        headers: { 'Authorization': `Bearer ${this.token}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user) {
          const norm = this.normalizeUser(data.user);
          this.currentUser = norm;
          if (window.appState) {
            appState.updateProfile(norm);
            if (data.prediction) {
              appState.updatePrediction(data.prediction);
            }
          }
          this.updateNavbarAuthUI();
          return this.currentUser;
        }
      } else {
        this.logout(false);
      }
    } catch (err) {
      console.warn('Failed to verify token with backend:', err);
    }
    return null;
  }

  async login(email, password = 'password123') {
    const cleanEmail = email.trim().toLowerCase();
    await this.checkBackendHealth();

    if (this.isBackendOnline) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: cleanEmail, password })
        });
        const data = await res.json();

        if (res.ok && data.success) {
          this.token = data.token;
          localStorage.setItem(TOKEN_KEY, this.token);
          const norm = this.normalizeUser(data.user);
          this.currentUser = norm;
          localStorage.setItem(SESSION_KEY, JSON.stringify(norm));

          if (window.appState) {
            appState.updateProfile(norm);
            if (data.prediction) {
              appState.updatePrediction(data.prediction);
            }
          }

          this.updateNavbarAuthUI();
          if (typeof showToast === 'function') {
            showToast(`Welcome back, ${norm.fullName}!`, 'success');
          }
          return { success: true, user: norm };
        } else {
          return { success: false, message: data.message || 'Invalid credentials' };
        }
      } catch (e) {
        console.error('Login error:', e);
      }
    }

    // Offline / LocalStorage fallback with high-fidelity student data
    if (cleanEmail.includes('samiksha')) {
      const student = SEEDED_STUDENTS.samiksha;
      this.currentUser = { ...student };
      localStorage.setItem(SESSION_KEY, JSON.stringify(student));
      if (window.appState) {
        appState.updateProfile(student);
        appState.updatePrediction(student.prediction);
      }
      this.updateNavbarAuthUI();
      if (typeof showToast === 'function') {
        showToast('Signed in as Samiksha Walbe! (B.Tech CSE • SDE Profile)', 'success');
      }
      return { success: true, user: student };
    }

    if (cleanEmail.includes('jyoti')) {
      const student = SEEDED_STUDENTS.jyoti;
      this.currentUser = { ...student };
      localStorage.setItem(SESSION_KEY, JSON.stringify(student));
      if (window.appState) {
        appState.updateProfile(student);
        appState.updatePrediction(student.prediction);
      }
      this.updateNavbarAuthUI();
      if (typeof showToast === 'function') {
        showToast('Signed in as Jyoti Kore! (B.Tech IT • Web Dev Profile)', 'success');
      }
      return { success: true, user: student };
    }

    if (cleanEmail.includes('aarav') || cleanEmail === 'demo@student.edu') {
      const demoUser = appState.getProfile();
      this.currentUser = demoUser;
      localStorage.setItem(SESSION_KEY, JSON.stringify(demoUser));
      this.updateNavbarAuthUI();
      if (typeof showToast === 'function') {
        showToast(`Signed in as ${demoUser.fullName} (Demo Student)`, 'success');
      }
      return { success: true, user: demoUser };
    }

    return { success: false, message: 'Invalid credentials or user not found.' };
  }

  async switchTo(accountKey) {
    const key = accountKey.toLowerCase();
    const student = SEEDED_STUDENTS[key];
    if (!student) return;

    // Immediately replace full student profile in current user and appState
    this.currentUser = JSON.parse(JSON.stringify(student));
    if (window.appState) {
      appState.data.profile = JSON.parse(JSON.stringify(student));
      if (student.prediction) {
        appState.data.prediction = JSON.parse(JSON.stringify(student.prediction));
      }
      appState.saveState();
    }

    // Immediately update header badge, avatar, and sidebar
    this.updateNavbarAuthUI();

    // Immediately re-render all views (Dashboard, Welcome Banner, KPIs, Profile, Prediction, Skill Gap, Roadmap)
    if (window.renderAllAppViews) {
      window.renderAllAppViews();
    }

    if (typeof showToast === 'function') {
      showToast(`Active Account: ${student.fullName} (${student.branch} • CGPA: ${student.cgpa})`, 'success');
    }

    // Sync session token with backend SQLite in background
    if (this.isBackendOnline) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: student.email, password: 'password123' })
        });
        const data = await res.json();
        if (res.ok && data.token) {
          this.token = data.token;
          localStorage.setItem(TOKEN_KEY, this.token);
        }
      } catch (e) {
        console.warn('Backend session sync:', e);
      }
    }
  }

  async register(userData) {
    await this.checkBackendHealth();

    if (this.isBackendOnline) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData)
        });
        const data = await res.json();

        if (res.ok && data.success) {
          this.token = data.token;
          localStorage.setItem(TOKEN_KEY, this.token);
          const norm = this.normalizeUser(data.user);
          this.currentUser = norm;

          if (window.appState) {
            appState.updateProfile(norm);
          }

          this.updateNavbarAuthUI();
          if (typeof showToast === 'function') {
            showToast('Account registered and saved to SQLite database!', 'success');
          }
          return { success: true, user: norm };
        } else {
          return { success: false, message: data.message || 'Registration failed' };
        }
      } catch (e) {
        console.error('Registration network error:', e);
      }
    }

    // Offline fallback: save locally
    const fallbackUser = {
      fullName: userData.fullName,
      email: userData.email,
      branch: userData.branch || 'Computer Science & Engineering',
      degree: 'B.Tech',
      rollNumber: userData.rollNumber || 'CS22B' + Math.floor(Math.random() * 9000 + 1000),
      cgpa: parseFloat(userData.cgpa) || 8.0,
      aptitudeScore: 80,
      codingRating: 1600,
      targetCareerId: 'sde',
      targetCareerTitle: 'Software Development Engineer',
      skills: ['Python', 'Java', 'Data Structures & Algorithms', 'SQL & DBMS', 'Git & GitHub'],
      projects: [],
      certifications: [],
      internships: []
    };
    if (window.appState) appState.updateProfile(fallbackUser);
    this.currentUser = fallbackUser;
    this.updateNavbarAuthUI();
    if (typeof showToast === 'function') {
      showToast('Account registered locally (offline mode)', 'success');
    }
    return { success: true, user: fallbackUser };
  }

  logout(showNotice = true) {
    if (this.token && this.isBackendOnline) {
      fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${this.token}` }
      }).catch(() => {});
    }

    this.token = null;
    this.currentUser = null;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(SESSION_KEY);
    this.updateNavbarAuthUI();

    if (showNotice && typeof showToast === 'function') {
      showToast('Logged out successfully.', 'info');
    }
  }

  async syncProfileToBackend(profileData) {
    if (!this.token || !this.isBackendOnline) return;
    try {
      await fetch(`${API_BASE_URL}/api/user/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`
        },
        body: JSON.stringify(profileData)
      });
    } catch (e) {
      console.warn('Backend sync deferred:', e);
    }
  }

  async syncPredictionToBackend(predData) {
    if (!this.token || !this.isBackendOnline) return;
    try {
      await fetch(`${API_BASE_URL}/api/user/prediction`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`
        },
        body: JSON.stringify(predData)
      });
    } catch (e) {
      console.warn('Prediction sync deferred:', e);
    }
  }

  updateNavbarAuthUI() {
    const isAuth = this.isAuthenticated();

    // Landing nav elements
    const guestNavLinks = document.getElementById('landing-guest-nav');
    const authNavLinks = document.getElementById('landing-auth-nav');
    const authUserName = document.getElementById('landing-user-name');

    if (guestNavLinks && authNavLinks) {
      if (isAuth) {
        guestNavLinks.style.display = 'none';
        authNavLinks.style.display = 'flex';
        if (authUserName) {
          authUserName.innerText = this.currentUser ? (this.currentUser.fullName || this.currentUser.fullname || 'Student') : 'Student';
        }
      } else {
        guestNavLinks.style.display = 'flex';
        authNavLinks.style.display = 'none';
      }
    }

    // App shell user indicators
    const currentName = this.currentUser ? (this.currentUser.fullName || this.currentUser.fullname || 'Samiksha Walbe') : (window.appState ? appState.getProfile().fullName : 'Samiksha Walbe');
    const currentBranch = this.currentUser ? `${this.currentUser.degree || 'B.Tech'} ${this.currentUser.branch ? this.currentUser.branch.split(' ')[0] : 'CSE'} '26` : (window.appState ? `${appState.getProfile().degree || 'B.Tech'} ${appState.getProfile().branch ? appState.getProfile().branch.split(' ')[0] : 'CSE'} '26` : "B.Tech CSE '26");
    const initials = (currentName || 'SW').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

    const appUserName = document.getElementById('sidebar-user-name');
    const appUserBranch = document.querySelector('.user-meta-branch');
    const appUserAvatar = document.getElementById('sidebar-user-avatar');
    const headerAvatar = document.getElementById('header-user-avatar');

    if (appUserName) appUserName.innerText = currentName;
    if (appUserBranch) appUserBranch.innerText = currentBranch;
    if (appUserAvatar) appUserAvatar.innerText = initials;
    if (headerAvatar) headerAvatar.innerText = initials;

    // Highlight active switcher pill button in app.html
    const samBtn = document.getElementById('switch-account-samiksha-btn');
    const jyoBtn = document.getElementById('switch-account-jyoti-btn');
    if (samBtn && jyoBtn) {
      const isJyoti = currentName.toLowerCase().includes('jyoti');
      if (isJyoti) {
        jyoBtn.className = 'btn btn-xs btn-primary font-semibold';
        samBtn.className = 'btn btn-xs btn-ghost text-muted';
      } else {
        samBtn.className = 'btn btn-xs btn-primary font-semibold';
        jyoBtn.className = 'btn btn-xs btn-ghost text-muted';
      }
    }
  }
}

const authManager = new AuthManager();
window.authManager = authManager;
window.switchToAccount = (key) => authManager.switchTo(key);

document.addEventListener('DOMContentLoaded', () => {
  authManager.init();
});
