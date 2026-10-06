# 🎓 Smart Placement Prediction & Career Coach
> **Final Year Engineering Project (Academic Year 2026–2027)**  
> **Department of Computer Science & Engineering**

---

## 📌 Project Overview
**Smart Placement Prediction & Career Coach** is a modern, data-driven web application designed to help engineering students evaluate their campus placement readiness, uncover technical skill gaps, and follow structured roadmaps toward dream tech offers.

The project operates entirely client-side using **pure HTML5, CSS3, and modern JavaScript**, eliminating the need for backend servers or third-party databases while persisting all user data, test attempts, and progress using the browser's **LocalStorage API**.

---

## 🚀 Key Modules & Features

### 1. 🌐 Landing Page (`index.html`)
- **Hero Section**: Modern hero with value proposition, responsive CTA buttons, and a live interactive placement estimator widget.
- **Statistics Counters**: Animated metrics showcasing historical training dataset scale and prediction accuracy.
- **Features Showcase**: Breakdown of the 6 core components of the platform.
- **Career Categories**: High-paying engineering roles with CTC package bands, key skills, and hiring companies.
- **How It Works**: 4-step progressive timeline from profile creation to mock interview mastery.
- **Placed Alumni Testimonials**: Realistic testimonials from students placed at Amazon, Microsoft, and TCS Digital.
- **Academic Project Acknowledgement**: Department, academic year, and faculty guide details.

### 2. 📊 SaaS Student Dashboard (`app.html#dashboard`)
- **KPI Summary Cards**: Real-time Placement Probability, Target Career Match, Roadmap Milestone Progress, and Interview Aptitude Score.
- **Chart.js Visualizations**:
  - **Candidate Competency Radar Chart**: Compares candidate's skills against Tier-1 Product Company benchmarks.
  - **Factor Weight Breakdown Bar Chart**: Visualizes score contribution across academics, DSA, projects, internships, and aptitude.
- **Upcoming Campus Placement Drives Table**: List of top hiring companies (Google, Amazon, Microsoft, TCS, Deloitte) with eligibility criteria, CTC, and alert toggles.
- **Personalized Recommended Actions**: Dynamic to-do checklist to boost placement readiness.

### 3. 📄 Resume Upload & ATS Analyzer (`app.html#resume`)
- **Multi-Format Document Upload**:
  - Supports uploading `.pdf`, `.docx`, `.doc`, and `.txt` files via drag-and-drop or file selector.
  - Quick test buttons: **"Test with Sample SDE Resume"** and **"Test with Sample AI/ML Resume"**.
- **Python NLP Parsing Engine** (`PyPDF2` + `python-docx`):
  - **Technical Skills**: Extracts languages, frameworks, developer tools, and cloud platforms against 150+ keyword dictionary.
  - **Projects Detected**: Identifies capstone project titles and architectural details.
  - **Internships & Experience**: Detects company names, roles, and work summaries.
  - **Education & Credentials**: Detects degrees, CGPA/GPA, and recognized certifications.
- **ATS Resume Scoring (0–100)**:
  - Evaluates layout completeness, keyword density, quantifiable metrics, section headers, and action verbs.
- **Target Role Alignment**:
  - Compares candidate's resume directly against target career benchmarks (SDE, Web Dev, Data Analyst, AI/ML, Cloud, Cyber).
  - Displays match percentage, matched skills, and missing skills.
- **1-Click Profile Import**:
  - Click **"Auto-Import Extracted Data into My Profile"** to seamlessly merge parsed skills and projects into the student profile and SQLite database.

### 4. 👤 Student Academic & Skills Profile (`app.html#profile`)
- **Comprehensive Profile Management**:
  - Personal details (Name, Email, Phone, College, Degree, Branch, Graduation Year, Roll Number).
  - Academic scores (CGPA, 10th & 12th percentages, standing backlogs).
  - Coding & Aptitude metrics (LeetCode rating, Aptitude score %).
- **Interactive Skills Matrix**: Tag addition and deletion with instant tag pill rendering.
- **Portfolio Managers**: Add and remove Capstone Projects, Industry Certifications, and Internship experiences.
- **Local Persistence & Demo Reset**: Saves directly to `localStorage` and syncs with SQLite database.

### 5. 🧮 Placement Probability Predictor (`app.html#prediction`)
- **Multi-Factor Weighted Mathematical Algorithm**:
  $$\text{Placement Score} = (0.22 \times \text{Academics}) + (0.25 \times \text{Tech \& DSA}) + (0.18 \times \text{Projects}) + (0.15 \times \text{Internships}) + (0.12 \times \text{Aptitude}) + (0.08 \times \text{Certs}) - (12 \times \text{Backlogs})$$
- **Animated SVG Circular Gauge**: Smooth stroke-dashoffset transition and numeric counter.
- **Readiness Tier Classification**:
  - 🟢 **High Readiness (80%–100%)**: Tier-1 Product Companies (14 – 32 LPA)
  - 🟡 **Moderate Readiness (60%–79%)**: Tier-2 Tech & Mass Recruiters (6 – 12 LPA)
  - 🔴 **Needs Preparation (<60%)**: Needs targeted skill building (<6 LPA)
- **Personalized Recommendations**: Automatically generates improvement advice for weak factors.
- **Celebration Confetti**: Triggers celebratory visual confetti when High Readiness is achieved.

### 6. 🧭 AI Career Coach & Matcher (`app.html#coach`)
- **Diagnostic Affinity Quiz**: 3-question diagnostic assessment analyzing problem-solving preferences, math comfort, and preferred tech stacks.
- **Master Tech Career Catalog**:
  - Software Development Engineer (SDE)
  - Full Stack Web Developer
  - Data Analyst & BI Specialist
  - AI / Machine Learning Engineer
  - Cloud & DevOps Engineer
  - Cybersecurity Analyst
- **Role Details Modal**: In-depth syllabus, daily responsibilities, salary outlook, and recommended learning pathways.
- **"Set as Target" Action**: Automatically links the chosen career to the Skill Gap and Roadmap modules.

### 7. 🔍 Skill Gap Analysis (`app.html#skillgap`)
- **Dynamic Role Comparator**: Evaluates candidate's profile skills against standard industry requirements.
- **Role Match Percentage Bar**: Visual feedback on qualification fit.
- **Matched vs Missing Skill Chips**: Side-by-side comparison with single-click "Add to Profile" quick buttons.
- **Priority Gap Bridging Plan**: Identifies the single highest-leverage missing skill to acquire next.

### 8. 🗺️ Career Roadmap: Beginner → Job Ready (`app.html#roadmap`)
- **4-Stage Progressive Timeline**:
  - **Stage 1: Beginner Foundations** (Months 1–2) — Languages, Basic DSA, Git.
  - **Stage 2: Intermediate Industry Readiness** (Months 3–4) — Capstone Projects, Advanced DSA, CS Core.
  - **Stage 3: Advanced Placement Mastery** (Months 5–6) — System Design, Mock Interviews, ATS Resume.
  - **Stage 4: Job Ready** (Placement Season) — Campus Drive Preparation, Speed DSA Tests, Offer Evaluation & Pre-Joining Onboarding.
- **Interactive Milestone Checklists**: Toggleable checkboxes with saved progress percentage.

### 9. 🎯 Interview Preparation Hub (`app.html#interview`)
- **Timed Aptitude Drill**: Multiple-choice questions (Quantitative, Logical, Verbal) with instant answer verification and step-by-step explanations.
- **Core CS Technical Flashcards**: High-frequency questions across DSA, DBMS, OS, Computer Networks, and OOP with expandable code/explanation accordions.
- **HR STAR Playbook**: Behavioral question response templates using the Situation-Task-Action-Result methodology.
- **AI Mock Interview Simulator**: Interactive chat interface evaluating answer depth, technical buzzwords, and providing instant scores out of 100 with exemplary model answers.

---

## 🎨 UI / UX Design Highlights
- **SaaS Layout**: Sticky header, collapsible sidebar, fluid multi-view hash router (`#dashboard`, `#profile`, etc.).
- **Dual Theme Support**: Complete Dark & Light mode toggle with smooth CSS variable transitions.
- **Modern Aesthetics**: Curated indigo/violet palette (`#4F46E5`, `#7C3AED`, `#06B6D4`, `#10B981`), glassmorphism accents, card lift transitions, and clean typography via Google Fonts (`Plus Jakarta Sans` & `Inter`).
- **Responsive Layout**: Fluid flexbox and CSS grid structures tested across mobile, tablet, and desktop viewports.

---

## 📂 Project Structure

```
smart-placement-coach/
│
├── index.html              # Marketing Landing Page
├── app.html                # SaaS Application Portal (7 Core Modules)
│
├── css/
│   ├── style.css           # Core Design System, Variables & Base Reset
│   ├── components.css      # Reusable Components (Buttons, Gauges, Cards, Toasts)
│   ├── landing.css         # Landing Page Specific Layouts & Hero Styles
│   └── app.css             # SaaS Portal Layout, Sidebar, Charts & Module Styles
│
├── js/
│   ├── state.js            # LocalStorage State Manager & Master Data Stores
│   ├── auth.js             # Authentication Client & Backend Bridge
│   ├── landing.js          # Landing Page Teaser Calculator & Counter Animations
│   ├── prediction.js       # Weighted Multi-Factor Placement Engine
│   ├── coach.js            # Career Diagnostic Assessment & Career Catalog
│   ├── skillgap.js         # Automated Skill Gap Analysis Comparator
│   ├── roadmap.js          # 3-Stage Milestone Tracker with Checklists
│   ├── interview.js        # Aptitude Quiz, Flashcards, HR STAR & Mock Simulator
│   ├── dashboard.js        # KPI Cards, Chart.js Visualizations & Drives Table
│   └── app.js              # Hash Router, Sidebar, Modals, Forms & Toasts
│
├── backend/
│   ├── app.py              # Flask REST API Server & Static File Host
│   └── database.db         # SQLite Database (Auto-created & Seeded)
│
└── README.md               # Project Documentation & Architecture Guide
```

---

## 🔐 Backend Authentication Architecture

The system features a **Python Flask + SQLite** RESTful backend for student authentication and real-time database synchronization:

### Security & Database Features
- **Password Security**: Salted PBKDF2:SHA-256 password hashing via `werkzeug.security`.
- **Session Tokens**: Cryptographically secure 64-character hexadecimal bearer tokens with database tracking.
- **Relational Storage**: SQLite database (`backend/database.db`) with tables:
  - `users`: User profiles, credentials, academic scores, and serialized JSON skills/projects.
  - `tokens`: Active authentication sessions.
  - `predictions`: Calculated placement probabilities and timestamps.
- **Resilient Dual-Mode**: If the backend is running, it saves data to SQLite. If offline, the frontend seamlessly falls back to LocalStorage demo mode.

### REST API Endpoints
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register a new student account | No |
| `POST` | `/api/auth/login` | Authenticate with email & password | No |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | Bearer Token |
| `POST` | `/api/auth/logout` | Terminate session and invalidate token | Bearer Token |
| `PUT` | `/api/user/profile` | Update academic records and skills matrix | Bearer Token |
| `POST` | `/api/user/prediction` | Record placement probability calculation | Bearer Token |
| `GET` | `/api/user/history` | Retrieve historical predictions | Bearer Token |
| `GET` | `/api/health` | Service health status check | No |

### Pre-Seeded Student Accounts (Distinct Profiles)
| Email | Password | Student Name | Branch & CGPA | Track / Focus |
|---|---|---|---|---|
| `samiksha.walbe@engg.edu` | `password123` | **Samiksha Walbe** | B.Tech CSE (8.85 CGPA) | **SDE Track** (Java, Spring Boot, DSA, AWS SA, 92% Placement) |
| `jyoti.kore@engg.edu` | `password123` | **Jyoti Kore** | B.Tech IT (8.40 CGPA) | **Web Dev Track** (React, Node, MERN, Meta Cert, 86% Placement) |
| `aarav.patel@engg.edu` | `password123` | Aarav Patel | B.Tech CSE (8.45 CGPA) | General SDE Profile |
| `priya.sharma@engg.edu` | `password123` | Priya Sharma | B.Tech AI & DS (9.10 CGPA) | AI / ML Engineer Profile |

---

## 💻 How to Run Locally

### Option 1: Run with Python Flask Backend (Full Stack with SQLite DB)
```bash
python backend/app.py
```
Open **`http://localhost:5000`** in your browser. This serves both the frontend web app and the REST API.

### Option 2: Run Frontend Only (Static / LocalStorage Mode)
```bash
python -m http.server 8080
```
Open **`http://localhost:8080`** in your browser.

---

## 🎓 Academic Submission Metadata
- **Project Name**: Smart Placement Prediction & Career Coach
- **Academic Degree**: Bachelor of Technology (B.Tech)
- **Department**: Computer Science & Engineering
- **Semester**: 7th Semester (Mini Project / Capstone)
- **Academic Year**: 2026 – 2027
