/**
 * SMART PLACEMENT PREDICTION & CAREER COACH
 * Authentication Client & Backend Bridge
 * Dedicated support for Samiksha Walbe (CSE) & Jyoti Kore (IT) accounts
 */

const TOKEN_KEY = 'smart_placement_auth_token';
const SESSION_KEY = 'smart_placement_auth_user';
const USER_ID_KEY = 'smart_placement_user_id';
const USER_EMAIL_KEY = 'smart_placement_user_email';
const API_BASE_URL = (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'))
  ? (window.location.port === '5000' ? '' : 'http://localhost:5000')
  : '';

function getAppState() {
  if (typeof window !== 'undefined' && window.appState) return window.appState;
  if (typeof appState !== 'undefined') return appState;
  return null;
}

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
    this.token = localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY) || null;
    this.currentUser = null;
    this.isBackendOnline = false;
    this.apiBaseUrl = API_BASE_URL;
  }

  isAuthenticated() {
    return !!(this.currentUser && (this.token || localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY)));
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
    norm.id = user.id || null;
    norm.fullName = user.fullName || user.fullname || 'Student';
    norm.rollNumber = user.rollNumber || user.roll_number || 'CS22B1000';
    norm.gradYear = user.gradYear || user.grad_year || '2026';
    norm.college = user.college || 'National Institute of Engineering & Technology';
    norm.degree = user.degree || 'B.Tech';
    norm.branch = user.branch || 'Computer Science & Engineering';
    norm.phone = user.phone || '+91 98765 00000';
    norm.cgpa = parseFloat(user.cgpa !== undefined ? user.cgpa : 8.0);
    norm.tenthMarks = parseFloat(user.tenthMarks !== undefined ? user.tenthMarks : (user.tenth_marks || 90.0));
    norm.twelfthMarks = parseFloat(user.twelfthMarks !== undefined ? user.twelfthMarks : (user.twelfth_marks || 88.0));
    norm.backlogs = parseInt(user.backlogs !== undefined ? user.backlogs : 0);
    norm.aptitudeScore = parseInt(user.aptitudeScore !== undefined ? user.aptitudeScore : (user.aptitude_score || 80));
    norm.codingRating = parseInt(user.codingRating !== undefined ? user.codingRating : (user.coding_rating || 1600));
    norm.targetCareerId = user.targetCareerId || user.target_career_id || 'sde';
    norm.targetCareerTitle = user.targetCareerTitle || user.target_career_title || 'Software Development Engineer';

    // Parse array and object properties
    norm.skills = Array.isArray(user.skills) ? user.skills : (typeof user.skills === 'string' ? JSON.parse(user.skills || '[]') : []);
    norm.certifications = Array.isArray(user.certifications) ? user.certifications : (typeof user.certifications === 'string' ? JSON.parse(user.certifications || '[]') : []);
    norm.projects = Array.isArray(user.projects) ? user.projects : (typeof user.projects === 'string' ? JSON.parse(user.projects || '[]') : []);
    norm.internships = Array.isArray(user.internships) ? user.internships : (typeof user.internships === 'string' ? JSON.parse(user.internships || '[]') : []);
    norm.roadmapState = user.roadmapState || (typeof user.roadmap_state === 'string' ? JSON.parse(user.roadmap_state || '{}') : (user.roadmap_state || {}));
    norm.interviewHistory = user.interviewHistory || (typeof user.interview_history === 'string' ? JSON.parse(user.interview_history || '{}') : (user.interview_history || {}));

    return norm;
  }

  async init() {
    this.token = localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY) || null;
    const isAppPage = window.location.pathname.endsWith('app.html') || window.location.pathname.includes('app.html');

    if (isAppPage && !this.token) {
      window.location.replace('index.html');
      return;
    }

    await this.checkBackendHealth();
    const savedUserJson = localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY);

    if (this.token && this.isBackendOnline) {
      const user = await this.fetchCurrentUser();
      if (!user && isAppPage) {
        this.logout(false);
        return;
      }
    } else if (savedUserJson) {
      try {
        const norm = this.normalizeUser(JSON.parse(savedUserJson));
        this.currentUser = norm;
        const state = getAppState();
        if (state) {
          state.initUser(norm);
        }
      } catch (e) {
        this.currentUser = null;
        this.logout(false);
        return;
      }
    } else {
      this.currentUser = null;
      if (isAppPage) {
        window.location.replace('index.html');
        return;
      }
    }

    this.updateNavbarAuthUI();
    if (isAppPage) {
      if (typeof renderAllAppViews === 'function') renderAllAppViews();
      else if (window.renderAllAppViews) window.renderAllAppViews();
    }
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

          localStorage.setItem(SESSION_KEY, JSON.stringify(norm));
          localStorage.setItem(USER_ID_KEY, String(norm.id || ''));
          localStorage.setItem(USER_EMAIL_KEY, norm.email || '');

          sessionStorage.setItem(SESSION_KEY, JSON.stringify(norm));
          sessionStorage.setItem(USER_ID_KEY, String(norm.id || ''));
          sessionStorage.setItem(USER_EMAIL_KEY, norm.email || '');

          const state = getAppState();
          if (state) {
            state.initUser(norm, data.prediction);
          }
          this.updateNavbarAuthUI();
          return this.currentUser;
        }
      } else if (res.status === 401) {
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
          const norm = this.normalizeUser(data.user);
          this.currentUser = norm;

          localStorage.setItem(TOKEN_KEY, this.token);
          localStorage.setItem(SESSION_KEY, JSON.stringify(norm));
          localStorage.setItem(USER_ID_KEY, String(norm.id || ''));
          localStorage.setItem(USER_EMAIL_KEY, norm.email || '');

          sessionStorage.setItem(TOKEN_KEY, this.token);
          sessionStorage.setItem(SESSION_KEY, JSON.stringify(norm));
          sessionStorage.setItem(USER_ID_KEY, String(norm.id || ''));
          sessionStorage.setItem(USER_EMAIL_KEY, norm.email || '');

          const state = getAppState();
          if (state) {
            state.initUser(norm, data.prediction);
          }

          this.updateNavbarAuthUI();
          if (typeof renderAllAppViews === 'function') renderAllAppViews();
          else if (window.renderAllAppViews) window.renderAllAppViews();

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
      localStorage.setItem(TOKEN_KEY, 'demo_token_samiksha');
      localStorage.setItem(SESSION_KEY, JSON.stringify(student));
      localStorage.setItem(USER_ID_KEY, '5');
      localStorage.setItem(USER_EMAIL_KEY, student.email);
      sessionStorage.setItem(TOKEN_KEY, 'demo_token_samiksha');
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(student));
      sessionStorage.setItem(USER_ID_KEY, '5');
      sessionStorage.setItem(USER_EMAIL_KEY, student.email);

      const state = getAppState();
      if (state) {
        state.initUser(student, student.prediction);
      }
      this.updateNavbarAuthUI();
      if (typeof renderAllAppViews === 'function') renderAllAppViews();
      else if (window.renderAllAppViews) window.renderAllAppViews();
      if (typeof showToast === 'function') {
        showToast('Signed in as Samiksha Walbe! (B.Tech CSE • SDE Profile)', 'success');
      }
      return { success: true, user: student };
    }

    if (cleanEmail.includes('jyoti')) {
      const student = SEEDED_STUDENTS.jyoti;
      this.currentUser = { ...student };
      localStorage.setItem(TOKEN_KEY, 'demo_token_jyoti');
      localStorage.setItem(SESSION_KEY, JSON.stringify(student));
      localStorage.setItem(USER_ID_KEY, '6');
      localStorage.setItem(USER_EMAIL_KEY, student.email);
      sessionStorage.setItem(TOKEN_KEY, 'demo_token_jyoti');
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(student));
      sessionStorage.setItem(USER_ID_KEY, '6');
      sessionStorage.setItem(USER_EMAIL_KEY, student.email);

      const state = getAppState();
      if (state) {
        state.initUser(student, student.prediction);
      }
      this.updateNavbarAuthUI();
      if (typeof renderAllAppViews === 'function') renderAllAppViews();
      else if (window.renderAllAppViews) window.renderAllAppViews();
      if (typeof showToast === 'function') {
        showToast('Signed in as Jyoti Kore! (B.Tech IT • Web Dev Profile)', 'success');
      }
      return { success: true, user: student };
    }

    if (cleanEmail.includes('aarav') || cleanEmail === 'demo@student.edu') {
      const state = getAppState();
      const demoUser = state ? state.getProfile() : { fullName: 'Demo Student' };
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
    const targetEmail = key.includes('jyoti') ? 'jyoti@engg.edu' : 'samiksha@engg.edu';

    await this.checkBackendHealth();
    if (this.isBackendOnline) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: targetEmail, password: 'password123' })
        });
        const data = await res.json();
        if (res.ok && data.success) {
          this.token = data.token;
          const norm = this.normalizeUser(data.user);
          this.currentUser = norm;

          localStorage.setItem(TOKEN_KEY, this.token);
          localStorage.setItem(SESSION_KEY, JSON.stringify(norm));
          localStorage.setItem(USER_ID_KEY, String(norm.id || ''));
          localStorage.setItem(USER_EMAIL_KEY, norm.email || '');

          sessionStorage.setItem(TOKEN_KEY, this.token);
          sessionStorage.setItem(SESSION_KEY, JSON.stringify(norm));
          sessionStorage.setItem(USER_ID_KEY, String(norm.id || ''));
          sessionStorage.setItem(USER_EMAIL_KEY, norm.email || '');

          const state = getAppState();
          if (state) {
            state.initUser(norm, data.prediction);
          }

          this.updateNavbarAuthUI();
          if (typeof renderAllAppViews === 'function') renderAllAppViews();
          else if (window.renderAllAppViews) window.renderAllAppViews();

          if (typeof showToast === 'function') {
            showToast(`Active Account: ${norm.fullName} (${norm.branch} • CGPA: ${norm.cgpa})`, 'success');
          }
          return;
        }
      } catch (e) {
        console.warn('Backend login switch failed, falling back:', e);
      }
    }

    // Fallback if offline
    const student = SEEDED_STUDENTS[key.includes('jyoti') ? 'jyoti' : 'samiksha'];
    if (!student) return;
    this.currentUser = JSON.parse(JSON.stringify(student));
    localStorage.setItem(SESSION_KEY, JSON.stringify(this.currentUser));
    localStorage.setItem(USER_ID_KEY, String(this.currentUser.id || (key.includes('jyoti') ? '6' : '5')));
    localStorage.setItem(USER_EMAIL_KEY, this.currentUser.email);
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(this.currentUser));
    sessionStorage.setItem(USER_ID_KEY, String(this.currentUser.id || (key.includes('jyoti') ? '6' : '5')));
    sessionStorage.setItem(USER_EMAIL_KEY, this.currentUser.email);

    const state = getAppState();
    if (state) {
      state.initUser(this.currentUser, student.prediction);
    }
    this.updateNavbarAuthUI();
    if (typeof renderAllAppViews === 'function') renderAllAppViews();
    else if (window.renderAllAppViews) window.renderAllAppViews();
    if (typeof showToast === 'function') {
      showToast(`Active Account: ${student.fullName} (${student.branch} • CGPA: ${student.cgpa})`, 'success');
    }
  }

  async refreshUserProfile() {
    if (!this.token) {
      showToast('No active session token.', 'warning');
      return;
    }
    showToast('Syncing profile from SQLite database...', 'info');
    const user = await this.fetchCurrentUser();
    if (user) {
      if (window.renderAllAppViews) window.renderAllAppViews();
      showToast(`Profile re-synced from database for ${user.fullName}!`, 'success');
    } else {
      showToast('Failed to sync profile from database.', 'danger');
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
          const norm = this.normalizeUser(data.user);
          this.currentUser = norm;

          localStorage.setItem(TOKEN_KEY, this.token);
          localStorage.setItem(SESSION_KEY, JSON.stringify(norm));
          localStorage.setItem(USER_ID_KEY, String(norm.id || ''));
          localStorage.setItem(USER_EMAIL_KEY, norm.email || '');

          sessionStorage.setItem(TOKEN_KEY, this.token);
          sessionStorage.setItem(SESSION_KEY, JSON.stringify(norm));
          sessionStorage.setItem(USER_ID_KEY, String(norm.id || ''));
          sessionStorage.setItem(USER_EMAIL_KEY, norm.email || '');

          if (window.appState) {
            appState.initUser(norm);
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
    if (window.appState) appState.initUser(fallbackUser);
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
    localStorage.removeItem(USER_ID_KEY);
    localStorage.removeItem(USER_EMAIL_KEY);

    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(USER_ID_KEY);
    sessionStorage.removeItem(USER_EMAIL_KEY);

    this.updateNavbarAuthUI();

    if (showNotice && typeof showToast === 'function') {
      showToast('Logged out successfully.', 'info');
    }

    // Always redirect to Login / Landing page
    window.location.replace('index.html');
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

    // Mobile nav drawer elements
    const mobileGuestActions = document.getElementById('mobile-guest-actions');
    const mobileAuthActions = document.getElementById('mobile-auth-actions');
    const mobileUserName = document.getElementById('mobile-user-name');
    const mobileUserEmail = document.getElementById('mobile-user-email');
    const mobileUserAvatar = document.getElementById('mobile-user-avatar');

    if (mobileGuestActions && mobileAuthActions) {
      if (isAuth && this.currentUser) {
        mobileGuestActions.style.display = 'none';
        mobileAuthActions.style.display = 'flex';
        const name = this.currentUser.fullName || this.currentUser.fullname || 'Student';
        const email = this.currentUser.email || '';
        const inits = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
        if (mobileUserName) mobileUserName.innerText = name;
        if (mobileUserEmail) mobileUserEmail.innerText = email;
        if (mobileUserAvatar) mobileUserAvatar.innerText = inits;
      } else {
        mobileGuestActions.style.display = 'flex';
        mobileAuthActions.style.display = 'none';
      }
    }

    // App shell user indicators
    const state = getAppState();
    const currentName = this.currentUser ? (this.currentUser.fullName || this.currentUser.fullname || 'Student') : (state ? state.getProfile().fullName : 'Student');
    const currentBranch = this.currentUser ? `${this.currentUser.degree || 'B.Tech'} ${this.currentUser.branch ? this.currentUser.branch.split(' ')[0] : 'CSE'} '26` : (state ? `${state.getProfile().degree || 'B.Tech'} ${state.getProfile().branch ? state.getProfile().branch.split(' ')[0] : 'CSE'} '26` : "B.Tech '26");
    const initials = (currentName || 'ST').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

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
