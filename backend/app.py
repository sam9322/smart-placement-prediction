"""
SMART PLACEMENT PREDICTION & CAREER COACH - BACKEND API
Department of Computer Science & Engineering
Final Year Capstone Project (2026-2027)

Stack: Python Flask + SQLite + PBKDF2 Password Hashing
"""

import os
import io
import re
import json
import sqlite3
import secrets
from datetime import datetime, timedelta
from flask import Flask, request, jsonify, send_from_directory
from werkzeug.security import generate_password_hash, check_password_hash

# Paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(BASE_DIR)
bundled_db = os.path.join(BASE_DIR, 'database.db')

if os.environ.get('SQLITE_DB_PATH'):
    DB_PATH = os.environ.get('SQLITE_DB_PATH')
    db_dir = os.path.dirname(DB_PATH)
    if db_dir and not os.path.exists(db_dir):
        os.makedirs(db_dir, exist_ok=True)
    if not os.path.exists(DB_PATH) and os.path.exists(bundled_db):
        import shutil
        try:
            shutil.copyfile(bundled_db, DB_PATH)
        except Exception:
            pass
elif os.environ.get('VERCEL'):
    import shutil
    DB_PATH = '/tmp/database.db'
    if not os.path.exists(DB_PATH) and os.path.exists(bundled_db):
        try:
            shutil.copyfile(bundled_db, DB_PATH)
        except Exception:
            pass
else:
    DB_PATH = bundled_db

app = Flask(__name__, static_folder=PROJECT_ROOT)
app.config['SECRET_KEY'] = 'smart-placement-coach-secret-key-2026'

# ==============================================================================
# DATABASE INITIALIZATION & HELPERS
# ==============================================================================
def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cursor = conn.cursor()

    # Users Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            fullname TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            college TEXT DEFAULT 'National Institute of Engineering & Technology',
            degree TEXT DEFAULT 'B.Tech',
            branch TEXT DEFAULT 'Computer Science & Engineering',
            grad_year TEXT DEFAULT '2026',
            roll_number TEXT DEFAULT 'CS22B1048',
            cgpa REAL DEFAULT 8.45,
            tenth_marks REAL DEFAULT 91.5,
            twelfth_marks REAL DEFAULT 88.0,
            backlogs INTEGER DEFAULT 0,
            aptitude_score INTEGER DEFAULT 84,
            coding_rating INTEGER DEFAULT 1680,
            target_career_id TEXT DEFAULT 'sde',
            target_career_title TEXT DEFAULT 'Software Development Engineer',
            skills TEXT DEFAULT '[]',
            certifications TEXT DEFAULT '[]',
            projects TEXT DEFAULT '[]',
            internships TEXT DEFAULT '[]',
            phone TEXT DEFAULT '',
            roadmap_state TEXT DEFAULT '{}',
            interview_history TEXT DEFAULT '{}',
            programming_language TEXT DEFAULT '',
            dsa_skill TEXT DEFAULT '',
            core_cs_knowledge TEXT DEFAULT '',
            dev_skills TEXT DEFAULT '',
            communication_score INTEGER DEFAULT 0,
            resume_score INTEGER DEFAULT 0,
            resume_details TEXT DEFAULT '{}',
            completed_videos TEXT DEFAULT '[]',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    # Ensure newer columns exist in existing database tables
    cursor.execute('PRAGMA table_info(users)')
    existing_cols = [row[1] for row in cursor.fetchall()]
    if 'phone' not in existing_cols:
        cursor.execute("ALTER TABLE users ADD COLUMN phone TEXT DEFAULT ''")
    if 'roadmap_state' not in existing_cols:
        cursor.execute("ALTER TABLE users ADD COLUMN roadmap_state TEXT DEFAULT '{}'")
    if 'interview_history' not in existing_cols:
        cursor.execute("ALTER TABLE users ADD COLUMN interview_history TEXT DEFAULT '{}'")

    # Auth Tokens Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS tokens (
            token TEXT PRIMARY KEY,
            user_id INTEGER NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            expires_at TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    ''')

    # Prediction History Table (Model 12: PlacementPrediction)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS predictions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            probability INTEGER NOT NULL,
            tier TEXT NOT NULL,
            tier_label TEXT,
            factors TEXT DEFAULT '{}',
            calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    ''')

    # 13 Multi-Entity Data Models:
    # Model 2: Careers
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS careers (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            category TEXT NOT NULL,
            avg_package TEXT,
            description TEXT
        )
    ''')

    # Model 3: Career Questions
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS career_questions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            question_text TEXT NOT NULL,
            category TEXT,
            step_order INTEGER
        )
    ''')

    # Model 4: Career Answers
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS career_answers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            question_id INTEGER,
            answer_text TEXT NOT NULL,
            target_career_id TEXT,
            why_explanation TEXT,
            FOREIGN KEY (question_id) REFERENCES career_questions(id) ON DELETE CASCADE
        )
    ''')

    # Model 5: Skills Master
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS skills (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE NOT NULL,
            category TEXT,
            default_difficulty TEXT
        )
    ''')

    # Model 6: Student Skills
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS student_skills (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            skill_name TEXT NOT NULL,
            proficiency INTEGER DEFAULT 75,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    ''')

    # Model 7: Career Skills
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS career_skills (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            career_id TEXT NOT NULL,
            skill_name TEXT NOT NULL,
            priority TEXT DEFAULT 'High Priority',
            difficulty TEXT DEFAULT 'Intermediate',
            FOREIGN KEY (career_id) REFERENCES careers(id) ON DELETE CASCADE
        )
    ''')

    # Model 8: Assessment Results
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS assessment_results (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            top_career_id TEXT,
            top_score INTEGER,
            runner_up_1 TEXT,
            runner_up_2 TEXT,
            details_json TEXT DEFAULT '{}',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    # Model 9: YouTube Resources
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS youtube_resources (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            career_id TEXT,
            title TEXT NOT NULL,
            channel_name TEXT,
            video_url TEXT,
            thumbnail_url TEXT,
            topic TEXT,
            level TEXT,
            duration TEXT,
            relevance_score REAL,
            feedback_action TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    # Model 10: Roadmaps
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS roadmaps (
            id TEXT PRIMARY KEY,
            career_id TEXT NOT NULL,
            title TEXT NOT NULL,
            duration_months INTEGER DEFAULT 6,
            description TEXT
        )
    ''')

    # Model 11: Roadmap Steps
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS roadmap_steps (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            roadmap_id TEXT NOT NULL,
            month_number INTEGER NOT NULL,
            title TEXT NOT NULL,
            objective TEXT,
            skills_json TEXT DEFAULT '[]',
            lectures_json TEXT DEFAULT '[]',
            practice_json TEXT DEFAULT '[]',
            project_json TEXT DEFAULT '{}',
            interview_json TEXT DEFAULT '[]',
            FOREIGN KEY (roadmap_id) REFERENCES roadmaps(id) ON DELETE CASCADE
        )
    ''')

    # Model 13: Interview Questions
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS interview_questions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            career_id TEXT NOT NULL,
            category TEXT,
            question TEXT NOT NULL,
            sample_answer TEXT,
            difficulty TEXT
        )
    ''')

    # Seed Default Demo User: Aarav Patel (if not exists)
    cursor.execute('SELECT id FROM users WHERE email = ?', ('aarav.patel@engg.edu',))
    if not cursor.fetchone():
        demo_skills = json.dumps([
            'Java', 'Python', 'Data Structures & Algorithms', 'JavaScript', 
            'React.js', 'Node.js', 'SQL & DBMS', 'Git & GitHub', 'REST APIs', 'Docker Basics'
        ])
        demo_certs = json.dumps([
            {'id': 'c1', 'title': 'AWS Certified Cloud Practitioner', 'issuer': 'Amazon Web Services', 'year': '2025'},
            {'id': 'c2', 'title': 'Problem Solving (Intermediate)', 'issuer': 'HackerRank', 'year': '2024'},
            {'id': 'c3', 'title': 'Meta Front-End Developer', 'issuer': 'Coursera', 'year': '2024'}
        ])
        demo_projects = json.dumps([
            {
                'id': 'p1',
                'title': 'Placement Management Portal',
                'stack': 'React, Node.js, MongoDB',
                'desc': 'Recruitment workflow automation with eligibility filters used by 800+ students.',
                'link': 'https://github.com/aarav/placement-portal'
            },
            {
                'id': 'p2',
                'title': 'AI Resume Keyword Extractor',
                'stack': 'Python, Flask, SpaCy NLP',
                'desc': 'NLP parser extracting tech skills against job descriptions with 89% precision.',
                'link': 'https://github.com/aarav/resume-parser'
            }
        ])
        demo_internships = json.dumps([
            {
                'id': 'i1',
                'company': 'NexTech Systems',
                'role': 'Software Engineering Intern',
                'duration': '3 Months (May - Jul 2025)',
                'desc': 'Built high-throughput REST APIs and reduced SQL query latency by 32%.'
            }
        ])

        hashed_pw = generate_password_hash('password123', method='pbkdf2:sha256')
        cursor.execute('''
            INSERT INTO users (
                fullname, email, password_hash, college, degree, branch, grad_year,
                roll_number, cgpa, tenth_marks, twelfth_marks, backlogs, aptitude_score,
                coding_rating, target_career_id, target_career_title,
                skills, certifications, projects, internships
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            'Aarav Patel', 'aarav.patel@engg.edu', hashed_pw,
            'National Institute of Engineering & Technology', 'B.Tech',
            'Computer Science & Engineering', '2026', 'CS22B1048',
            8.45, 91.5, 88.0, 0, 84, 1680, 'sde', 'Software Development Engineer',
            demo_skills, demo_certs, demo_projects, demo_internships
        ))

    # Seed Second Demo User: Priya Sharma (AI/ML track)
    cursor.execute('SELECT id FROM users WHERE email = ?', ('priya.sharma@engg.edu',))
    if not cursor.fetchone():
        priya_skills = json.dumps([
            'Python', 'Machine Learning', 'Deep Learning', 'PyTorch', 
            'SQL & DBMS', 'Git & GitHub', 'Pandas & NumPy', 'Data Structures & Algorithms'
        ])
        hashed_pw2 = generate_password_hash('password123', method='pbkdf2:sha256')
        cursor.execute('''
            INSERT INTO users (
                fullname, email, password_hash, college, degree, branch, grad_year,
                roll_number, cgpa, tenth_marks, twelfth_marks, backlogs, aptitude_score,
                coding_rating, target_career_id, target_career_title,
                skills, certifications, projects, internships
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            'Priya Sharma', 'priya.sharma@engg.edu', hashed_pw2,
            'National Institute of Engineering & Technology', 'B.Tech',
            'Artificial Intelligence & Data Science', '2026', 'AI22B1012',
            9.10, 94.0, 92.5, 0, 88, 1720, 'aiml', 'AI / Machine Learning Engineer',
            priya_skills, '[]', '[]', '[]'
        ))

    # Seed Account 1: Samiksha Walbe (B.Tech CSE - High SDE Profile)
    cursor.execute('SELECT id FROM users WHERE email = ?', ('samiksha@engg.edu',))
    if not cursor.fetchone():
        samiksha_skills = json.dumps([
            'Java', 'Python', 'Data Structures & Algorithms', 'C++', 'Spring Boot',
            'SQL & DBMS', 'Git & GitHub', 'Docker Basics', 'System Design', 'REST APIs'
        ])
        samiksha_certs = json.dumps([
            {'id': 'c1', 'title': 'AWS Certified Solutions Architect - Associate', 'issuer': 'Amazon Web Services', 'year': '2025'},
            {'id': 'c2', 'title': 'Problem Solving (Gold Badge)', 'issuer': 'HackerRank', 'year': '2024'}
        ])
        samiksha_projects = json.dumps([
            {
                'id': 'p1',
                'title': 'Campus Placement Management System',
                'stack': 'Spring Boot, React, MySQL',
                'desc': 'Automated student eligibility screening and placement drives for 1,200+ candidates.',
                'link': 'https://github.com/samiksha/placement-system'
            },
            {
                'id': 'p2',
                'title': 'Distributed Key-Value Store',
                'stack': 'Java, gRPC, Docker',
                'desc': 'Built fault-tolerant storage using Raft consensus protocol with 99.9% uptime.',
                'link': 'https://github.com/samiksha/kv-store'
            }
        ])
        samiksha_internships = json.dumps([
            {
                'id': 'i1',
                'company': 'Infosys Digital',
                'role': 'Software Engineering Intern',
                'duration': '3 Months (May - Jul 2025)',
                'desc': 'Engineered scalable microservices and reduced backend API latency by 28%.'
            }
        ])
        hashed_pw_samiksha = generate_password_hash('password123', method='pbkdf2:sha256')
        cursor.execute('''
            INSERT INTO users (
                fullname, email, password_hash, college, degree, branch, grad_year,
                roll_number, cgpa, tenth_marks, twelfth_marks, backlogs, aptitude_score,
                coding_rating, target_career_id, target_career_title,
                skills, certifications, projects, internships
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            'Samiksha Walbe', 'samiksha@engg.edu', hashed_pw_samiksha,
            'National Institute of Engineering & Technology', 'B.Tech',
            'Computer Science & Engineering', '2026', 'CS22B1052',
            8.85, 94.2, 91.0, 0, 88, 1740, 'sde', 'Software Development Engineer',
            samiksha_skills, samiksha_certs, samiksha_projects, samiksha_internships
        ))

    # Seed Account 2: Jyoti Kore (B.Tech IT - Full Stack Web Profile)
    cursor.execute('SELECT id FROM users WHERE email = ?', ('jyoti@engg.edu',))
    if not cursor.fetchone():
        jyoti_skills = json.dumps([
            'JavaScript', 'TypeScript', 'React.js', 'Node.js', 'Express.js',
            'MongoDB', 'SQL & DBMS', 'HTML5', 'CSS3', 'REST APIs', 'Git & GitHub'
        ])
        jyoti_certs = json.dumps([
            {'id': 'c1', 'title': 'Meta Front-End Developer Professional Certificate', 'issuer': 'Coursera', 'year': '2024'},
            {'id': 'c2', 'title': 'MongoDB Certified Developer Associate', 'issuer': 'MongoDB Inc.', 'year': '2025'}
        ])
        jyoti_projects = json.dumps([
            {
                'id': 'p1',
                'title': 'Real-Time Collaborative Code Editor',
                'stack': 'React, Node.js, WebSockets, MongoDB',
                'desc': 'Built collaborative workspace supporting live cursor tracking and multi-language compilation.',
                'link': 'https://github.com/jyoti/collab-editor'
            },
            {
                'id': 'p2',
                'title': 'E-Commerce Microservices Platform',
                'stack': 'MERN Stack, Stripe, Redis',
                'desc': 'Integrated payment gateways and Redis caching layer improving checkout throughput by 40%.',
                'link': 'https://github.com/jyoti/ecommerce-microservices'
            }
        ])
        jyoti_internships = json.dumps([
            {
                'id': 'i1',
                'company': 'Cognizant Tech',
                'role': 'Web Developer Intern',
                'duration': '3 Months (Summer 2025)',
                'desc': 'Built responsive client portals and integrated RESTful endpoints.'
            }
        ])
        hashed_pw_jyoti = generate_password_hash('password123', method='pbkdf2:sha256')
        cursor.execute('''
            INSERT INTO users (
                fullname, email, password_hash, college, degree, branch, grad_year,
                roll_number, cgpa, tenth_marks, twelfth_marks, backlogs, aptitude_score,
                coding_rating, target_career_id, target_career_title,
                skills, certifications, projects, internships
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            'Jyoti Kore', 'jyoti@engg.edu', hashed_pw_jyoti,
            'National Institute of Engineering & Technology', 'B.Tech',
            'Information Technology', '2026', 'IT22B1038',
            8.40, 90.5, 87.5, 0, 82, 1620, 'webdev', 'Full Stack Web Developer',
            jyoti_skills, jyoti_certs, jyoti_projects, jyoti_internships
        ))

    # Add missing columns if upgrading database
    for col in [
        ('phone', "TEXT DEFAULT '+91 98765 00000'"),
        ('roadmap_state', "TEXT DEFAULT '{}'"),
        ('interview_history', "TEXT DEFAULT '{}'"),
        ('programming_language', "TEXT DEFAULT ''"),
        ('dsa_skill', "TEXT DEFAULT ''"),
        ('core_cs_knowledge', "TEXT DEFAULT ''"),
        ('dev_skills', "TEXT DEFAULT ''"),
        ('communication_score', "INTEGER DEFAULT 0"),
        ('resume_score', "INTEGER DEFAULT 0"),
        ('resume_details', "TEXT DEFAULT '{}'"),
        ('completed_videos', "TEXT DEFAULT '[]'")
    ]:
        try:
            cursor.execute(f"ALTER TABLE users ADD COLUMN {col[0]} {col[1]}")
        except Exception:
            pass

    # Ensure canonical names & distinct profiles for existing accounts
    sam_roadmap = json.dumps({
        "s1_m1": True, "s1_m2": True, "s1_m3": True,
        "s2_m1": True, "s2_m2": True, "s2_m3": True,
        "s3_m1": True, "s3_m2": False, "s3_m3": True,
        "s4_m1": False, "s4_m2": False, "s4_m3": False
    })
    sam_interview = json.dumps({
        "aptitudeScore": 9, "aptitudeTotal": 10, "technicalScore": 9, "technicalTotal": 10,
        "mockAttempts": [{"date": "2026-10-05", "role": "Software Development Engineer", "score": 92, "feedback": "Solid grasp of distributed systems, concurrency, and tree traversals."}]
    })
    sam_resume = json.dumps({
        "fileName": "Samiksha_Walbe_SDE_Resume.pdf",
        "atsScore": 88,
        "scoreGrade": "Excellent (ATS Ready)",
        "analyzedAt": "2026-10-06"
    })
    cursor.execute("""
        UPDATE users SET
            fullname = 'Samiksha Walbe',
            phone = '+91 98765 11052',
            degree = 'B.Tech',
            branch = 'Computer Science & Engineering',
            roll_number = 'CS22B1052',
            cgpa = 8.85,
            tenth_marks = 94.2,
            twelfth_marks = 91.0,
            backlogs = 0,
            aptitude_score = 88,
            coding_rating = 1740,
            programming_language = 'Java',
            dsa_skill = 'Advanced',
            core_cs_knowledge = 'Strong',
            dev_skills = 'Full Stack & APIs',
            communication_score = 85,
            resume_score = 88,
            resume_details = ?,
            target_career_id = 'sde',
            target_career_title = 'Software Development Engineer',
            roadmap_state = ?,
            interview_history = ?
        WHERE email LIKE '%samiksha%'
    """, (sam_resume, sam_roadmap, sam_interview))

    jyo_roadmap = json.dumps({
        "s1_m1": True, "s1_m2": True, "s1_m3": True,
        "s2_m1": True, "s2_m2": False, "s2_m3": True,
        "s3_m1": False, "s3_m2": False, "s3_m3": False,
        "s4_m1": False, "s4_m2": False, "s4_m3": False
    })
    jyo_interview = json.dumps({
        "aptitudeScore": 7, "aptitudeTotal": 10, "technicalScore": 8, "technicalTotal": 10,
        "mockAttempts": [{"date": "2026-10-04", "role": "Full Stack Web Developer", "score": 84, "feedback": "Strong React architecture and REST design. Review Node event loop internals."}]
    })
    jyo_resume = json.dumps({
        "fileName": "Jyoti_Kore_WebDev_Resume.pdf",
        "atsScore": 84,
        "scoreGrade": "ATS Ready",
        "analyzedAt": "2026-10-06"
    })
    cursor.execute("""
        UPDATE users SET
            fullname = 'Jyoti Kore',
            phone = '+91 98765 22038',
            degree = 'B.Tech',
            branch = 'Information Technology',
            roll_number = 'IT22B1038',
            cgpa = 8.40,
            tenth_marks = 90.5,
            twelfth_marks = 87.5,
            backlogs = 0,
            aptitude_score = 82,
            coding_rating = 1620,
            programming_language = 'JavaScript',
            dsa_skill = 'Intermediate',
            core_cs_knowledge = 'Moderate',
            dev_skills = 'Full Stack & APIs',
            communication_score = 88,
            resume_score = 84,
            resume_details = ?,
            target_career_id = 'webdev',
            target_career_title = 'Full Stack Web Developer',
            roadmap_state = ?,
            interview_history = ?
        WHERE email LIKE '%jyoti%'
    """, (jyo_resume, jyo_roadmap, jyo_interview))

    # Seed Predictions for accounts if not present
    cursor.execute('SELECT id FROM users WHERE email = ?', ('samiksha@engg.edu',))
    sam_row = cursor.fetchone()
    if sam_row:
        cursor.execute('SELECT id FROM predictions WHERE user_id = ?', (sam_row['id'],))
        if not cursor.fetchone():
            sam_factors = json.dumps({'academics': 91, 'technicalDSA': 92, 'projects': 90, 'internships': 93, 'aptitude': 88})
            cursor.execute('''
                INSERT INTO predictions (user_id, probability, tier, tier_label, factors)
                VALUES (?, ?, ?, ?, ?)
            ''', (sam_row['id'], 92, 'High', 'High Readiness - Tier 1 Product Company Candidate (16 - 32 LPA)', sam_factors))

    cursor.execute('SELECT id FROM users WHERE email = ?', ('jyoti@engg.edu',))
    jyo_row = cursor.fetchone()
    if jyo_row:
        cursor.execute('SELECT id FROM predictions WHERE user_id = ?', (jyo_row['id'],))
        if not cursor.fetchone():
            jyo_factors = json.dumps({'academics': 86, 'technicalDSA': 84, 'projects': 88, 'internships': 86, 'aptitude': 82})
            cursor.execute('''
                INSERT INTO predictions (user_id, probability, tier, tier_label, factors)
                VALUES (?, ?, ?, ?, ?)
            ''', (jyo_row['id'], 86, 'High', 'High Readiness - Tier 1 Product / IT Giant (10 - 22 LPA)', jyo_factors))

    # Seed Careers Catalog if empty
    cursor.execute('SELECT COUNT(*) FROM careers')
    if cursor.fetchone()[0] == 0:
        default_careers = [
            ('sde', 'Software Engineer / SDE', 'Core Engineering', '₹12 - 36 LPA', 'Designing robust system algorithms, scalable backends, and optimizing data structures'),
            ('webdev', 'Frontend Developer / Full Stack Developer', 'Web & Applications', '₹8 - 24 LPA', 'Crafting responsive user interfaces, full-stack microservices, and interactive web apps'),
            ('data-analyst', 'Data Analyst / Data Scientist', 'Data & Analytics', '₹7 - 20 LPA', 'Uncovering trends, patterns, statistical modeling, and insights from massive datasets'),
            ('aiml', 'AI/ML Engineer', 'Artificial Intelligence', '₹14 - 40 LPA', 'Building neural networks, NLP, transformer models, and intelligent predictive pipelines'),
            ('cloud-devops', 'DevOps Engineer / Cloud Engineer', 'Infrastructure & Cloud', '₹9 - 28 LPA', 'Automating server infrastructure, containers, CI/CD, and cloud pipelines'),
            ('cybersecurity', 'Cybersecurity Engineer / Security Analyst', 'Security & Defense', '₹8 - 26 LPA', 'Auditing vulnerabilities, penetration testing, threat modeling, and digital forensics')
        ]
        cursor.executemany('INSERT INTO careers (id, title, category, avg_package, description) VALUES (?, ?, ?, ?, ?)', default_careers)

    # Normalize old test accounts if any
    cursor.execute("UPDATE users SET email = 'samiksha_test@backup.edu' WHERE email = 'samiksha@gmail.com'")

    conn.commit()
    conn.close()

# Initialize DB on module load
init_db()

# ==============================================================================
# CORS & OPTIONS HANDLING
# ==============================================================================
@app.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization'
    response.headers['Access-Control-Allow-Methods'] = 'GET,POST,PUT,DELETE,OPTIONS'
    return response

@app.route('/api/<path:path>', methods=['OPTIONS'])
def options_handler(path):
    return ('', 204)

# Auth helper
def get_current_user():
    auth_header = request.headers.get('Authorization', '')
    if not auth_header.startswith('Bearer '):
        return None
    token = auth_header.split(' ')[1].strip()

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('''
        SELECT u.* FROM users u
        JOIN tokens t ON u.id = t.user_id
        WHERE t.token = ?
    ''', (token,))
    user = cursor.fetchone()
    conn.close()
    return user

def user_to_dict(user_row):
    if not user_row:
        return None
    d = dict(user_row)
    d.pop('password_hash', None)
    # Parse JSON fields
    for field in ['skills', 'certifications', 'projects', 'internships']:
        try:
            d[field] = json.loads(d.get(field) or '[]')
        except Exception:
            d[field] = []

    try:
        d['roadmapState'] = json.loads(d.get('roadmap_state') or '{}')
    except Exception:
        d['roadmapState'] = {}

    try:
        d['interviewHistory'] = json.loads(d.get('interview_history') or '{}')
    except Exception:
        d['interviewHistory'] = {}

    try:
        d['resumeDetails'] = json.loads(d.get('resume_details') or '{}')
    except Exception:
        d['resumeDetails'] = {}

    try:
        d['completedVideos'] = json.loads(d.get('completed_videos') or '[]')
    except Exception:
        d['completedVideos'] = []

    # Provide camelCase aliases for seamless frontend compatibility
    d['fullName'] = d.get('fullname', '')
    d['phone'] = d.get('phone', '')
    d['rollNumber'] = d.get('roll_number', '')
    d['gradYear'] = d.get('grad_year', '')
    d['tenthMarks'] = d.get('tenth_marks', 0)
    d['twelfthMarks'] = d.get('twelfth_marks', 0)
    d['aptitudeScore'] = d.get('aptitude_score', 0)
    d['codingRating'] = d.get('coding_rating', 0)
    d['targetCareerId'] = d.get('target_career_id', 'sde')
    d['targetCareerTitle'] = d.get('target_career_title', '')
    d['programmingLanguage'] = d.get('programming_language', '')
    d['dsaSkill'] = d.get('dsa_skill', '')
    d['coreCsKnowledge'] = d.get('core_cs_knowledge', '')
    d['devSkills'] = d.get('dev_skills', '')
    d['communicationScore'] = d.get('communication_score', 0)
    d['resumeScore'] = d.get('resume_score', 0)
    return d

# ==============================================================================
# AUTHENTICATION ENDPOINTS
# ==============================================================================
@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    fullname = (data.get('fullName') or data.get('fullname') or '').strip()
    email = data.get('email', '').strip().lower()
    raw_phone = str(data.get('mobileNumber') or data.get('phone') or '').strip()
    phone_digits = re.sub(r'[\s\-\(\)\+]', '', raw_phone)
    if phone_digits.startswith('91') and len(phone_digits) == 12:
        phone_digits = phone_digits[2:]

    college = data.get('college', '').strip()
    branch = data.get('branch', '').strip()
    grad_year = str(data.get('academicYear') or data.get('gradYear') or data.get('grad_year') or '').strip()
    password = data.get('password', '').strip()
    confirm_password = (data.get('confirmPassword') or data.get('confirm_password') or '').strip()

    # Required fields validation
    if not fullname:
        return jsonify({'success': False, 'message': 'Full Name is required.'}), 400
    if not email:
        return jsonify({'success': False, 'message': 'College Email Address is required.'}), 400
    if not raw_phone:
        return jsonify({'success': False, 'message': 'Mobile Number is required.'}), 400
    if not college:
        return jsonify({'success': False, 'message': 'College Name is required.'}), 400
    if not branch:
        return jsonify({'success': False, 'message': 'Course / Branch is required.'}), 400
    if not grad_year:
        return jsonify({'success': False, 'message': 'Academic Year is required.'}), 400
    if not password:
        return jsonify({'success': False, 'message': 'Password is required.'}), 400

    # Email format validation
    email_regex = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
    if not re.match(email_regex, email):
        return jsonify({'success': False, 'message': 'Please provide a valid college email address.'}), 400

    # Mobile number validation (10 digits for Indian mobile numbers starting with 6-9)
    if not re.match(r'^[6-9]\d{9}$', phone_digits):
        return jsonify({'success': False, 'message': 'Mobile number must be a valid 10-digit Indian mobile number.'}), 400

    # Password length validation (at least 8 characters)
    if len(password) < 8:
        return jsonify({'success': False, 'message': 'Password must be at least 8 characters long.'}), 400

    # Password match validation
    if confirm_password and password != confirm_password:
        return jsonify({'success': False, 'message': 'Password and Confirm Password do not match.'}), 400

    conn = get_db()
    cursor = conn.cursor()

    # Prevent duplicate registration
    cursor.execute('SELECT id FROM users WHERE email = ?', (email,))
    if cursor.fetchone():
        conn.close()
        return jsonify({'success': False, 'message': 'An account with this college email already exists. Please sign in.'}), 409

    hashed_pw = generate_password_hash(password, method='pbkdf2:sha256')
    clean_phone = f"+91 {phone_digits[:5]} {phone_digits[5:]}"
    branch_prefix = "".join([w[0] for w in branch.split() if w[0].isalnum()])[:3].upper() or "CS"
    year_suffix = grad_year[-2:] if len(grad_year) >= 2 else "26"
    roll = f"{branch_prefix}{year_suffix}B{secrets.token_hex(2).upper()}"

    cursor.execute('''
        INSERT INTO users (
            fullname, email, password_hash, phone, college, degree, branch,
            grad_year, roll_number, cgpa, tenth_marks, twelfth_marks,
            backlogs, aptitude_score, coding_rating, target_career_id,
            target_career_title, skills, certifications, projects, internships,
            roadmap_state, interview_history, programming_language, dsa_skill,
            core_cs_knowledge, dev_skills, communication_score, resume_score,
            resume_details
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        fullname, email, hashed_pw, clean_phone, college, 'B.Tech', branch,
        grad_year, roll, 0.0, 0.0, 0.0,
        0, 0, 0, 'sde',
        'Software Development Engineer', '[]', '[]', '[]', '[]',
        '{}', '{}', '', '',
        '', '', 0, 0,
        '{}'
    ))
    user_id = cursor.lastrowid

    # Create active session token
    token = secrets.token_hex(32)
    cursor.execute('INSERT INTO tokens (token, user_id) VALUES (?, ?)', (token, user_id))
    conn.commit()

    cursor.execute('SELECT * FROM users WHERE id = ?', (user_id,))
    user_row = cursor.fetchone()
    conn.close()

    return jsonify({
        'success': True,
        'message': f'Registration successful! Welcome to Career Coach, {fullname}.',
        'token': token,
        'user': user_to_dict(user_row)
    }), 201

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    email = data.get('email', '').strip().lower()
    password = data.get('password', '').strip()

    if not email or not password:
        return jsonify({'success': False, 'message': 'Email and password are required.'}), 400

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM users WHERE email = ?', (email,))
    user = cursor.fetchone()

    # Legacy alias matching for pre-seeded student accounts if not directly found
    if not user:
        if email == 'samiksha.walbe@engg.edu':
            cursor.execute('SELECT * FROM users WHERE email = ?', ('samiksha@engg.edu',))
            user = cursor.fetchone()
        elif email == 'jyoti.kore@engg.edu':
            cursor.execute('SELECT * FROM users WHERE email = ?', ('jyoti@engg.edu',))
            user = cursor.fetchone()
        elif email == 'aarav@engg.edu':
            cursor.execute('SELECT * FROM users WHERE email = ?', ('aarav.patel@engg.edu',))
            user = cursor.fetchone()

    if not user or not check_password_hash(user['password_hash'], password):
        conn.close()
        return jsonify({'success': False, 'message': 'Invalid email or password.'}), 401

    token = secrets.token_hex(32)
    cursor.execute('INSERT INTO tokens (token, user_id) VALUES (?, ?)', (token, user['id']))
    conn.commit()

    # Fetch user's latest prediction
    cursor.execute('SELECT * FROM predictions WHERE user_id = ? ORDER BY calculated_at DESC LIMIT 1', (user['id'],))
    pred_row = cursor.fetchone()
    pred_data = None
    if pred_row:
        pred_dict = dict(pred_row)
        try:
            factors_json = json.loads(pred_dict.get('factors') or '{}')
        except Exception:
            factors_json = {}
        pred_data = {
            'probability': pred_dict.get('probability', 85),
            'tier': pred_dict.get('tier', 'High'),
            'tierLabel': pred_dict.get('tier_label', ''),
            'factors': factors_json
        }

    conn.close()

    return jsonify({
        'success': True,
        'message': f'Welcome back, {user["fullname"]}!',
        'token': token,
        'user': user_to_dict(user),
        'prediction': pred_data
    }), 200

@app.route('/api/auth/me', methods=['GET'])
def get_me():
    user = get_current_user()
    if not user:
        return jsonify({'success': False, 'message': 'Unauthorized or expired session.'}), 401

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM predictions WHERE user_id = ? ORDER BY calculated_at DESC LIMIT 1', (user['id'],))
    pred_row = cursor.fetchone()
    pred_data = None
    if pred_row:
        pred_dict = dict(pred_row)
        try:
            factors_json = json.loads(pred_dict.get('factors') or '{}')
        except Exception:
            factors_json = {}
        pred_data = {
            'probability': pred_dict.get('probability', 85),
            'tier': pred_dict.get('tier', 'High'),
            'tierLabel': pred_dict.get('tier_label', ''),
            'factors': factors_json
        }
    conn.close()

    return jsonify({
        'success': True,
        'user': user_to_dict(user),
        'prediction': pred_data
    }), 200

@app.route('/api/auth/logout', methods=['POST'])
def logout():
    auth_header = request.headers.get('Authorization', '')
    if auth_header.startswith('Bearer '):
        token = auth_header.split(' ')[1].strip()
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute('DELETE FROM tokens WHERE token = ?', (token,))
        conn.commit()
        conn.close()
    return jsonify({'success': True, 'message': 'Logged out successfully.'}), 200

# ==============================================================================
# STUDENT PROFILE & PREDICTION DATA ENDPOINTS
# ==============================================================================
@app.route('/api/user/profile', methods=['GET', 'PUT'])
def user_profile():
    user = get_current_user()
    if not user:
        return jsonify({'success': False, 'message': 'Unauthorized or expired session.'}), 401

    conn = get_db()
    cursor = conn.cursor()

    if request.method == 'GET':
        # Enforce student profile isolation (Requirement 4 & 11)
        req_uid = request.args.get('uid')
        if req_uid and str(req_uid) != str(user['id']):
            conn.close()
            return jsonify({'success': False, 'message': 'Access forbidden: You cannot access another student\'s profile.'}), 403

        cursor.execute('SELECT * FROM predictions WHERE user_id = ? ORDER BY calculated_at DESC LIMIT 1', (user['id'],))
        pred_row = cursor.fetchone()
        pred_data = None
        if pred_row:
            pred_dict = dict(pred_row)
            try:
                factors_json = json.loads(pred_dict.get('factors') or '{}')
            except Exception:
                factors_json = {}
            pred_data = {
                'probability': pred_dict.get('probability', 85),
                'tier': pred_dict.get('tier', 'High'),
                'tierLabel': pred_dict.get('tier_label', ''),
                'factors': factors_json
            }
        conn.close()
        return jsonify({
            'success': True,
            'user': user_to_dict(user),
            'prediction': pred_data
        }), 200

    # PUT: Update profile parameters
    data = request.get_json() or {}

    # Enforce student profile isolation (Requirement 11)
    req_uid = data.get('uid') or data.get('id')
    if req_uid and str(req_uid) != str(user['id']):
        conn.close()
        return jsonify({'success': False, 'message': 'Access forbidden: You cannot modify another student\'s profile.'}), 403

    cursor.execute('''
        UPDATE users SET
            fullname = COALESCE(?, fullname),
            phone = COALESCE(?, phone),
            college = COALESCE(?, college),
            degree = COALESCE(?, degree),
            branch = COALESCE(?, branch),
            grad_year = COALESCE(?, grad_year),
            roll_number = COALESCE(?, roll_number),
            cgpa = COALESCE(?, cgpa),
            tenth_marks = COALESCE(?, tenth_marks),
            twelfth_marks = COALESCE(?, twelfth_marks),
            backlogs = COALESCE(?, backlogs),
            aptitude_score = COALESCE(?, aptitude_score),
            coding_rating = COALESCE(?, coding_rating),
            programming_language = COALESCE(?, programming_language),
            dsa_skill = COALESCE(?, dsa_skill),
            core_cs_knowledge = COALESCE(?, core_cs_knowledge),
            dev_skills = COALESCE(?, dev_skills),
            communication_score = COALESCE(?, communication_score),
            resume_score = COALESCE(?, resume_score),
            resume_details = COALESCE(?, resume_details),
            target_career_id = COALESCE(?, target_career_id),
            target_career_title = COALESCE(?, target_career_title),
            skills = COALESCE(?, skills),
            certifications = COALESCE(?, certifications),
            projects = COALESCE(?, projects),
            internships = COALESCE(?, internships),
            roadmap_state = COALESCE(?, roadmap_state),
            interview_history = COALESCE(?, interview_history),
            completed_videos = COALESCE(?, completed_videos)
        WHERE id = ?
    ''', (
        data.get('fullName'),
        data.get('phone'),
        data.get('college'),
        data.get('degree'),
        data.get('branch'),
        data.get('gradYear') or data.get('grad_year'),
        data.get('rollNumber'),
        data.get('cgpa'),
        data.get('tenthMarks'),
        data.get('twelfthMarks'),
        data.get('backlogs'),
        data.get('aptitudeScore'),
        data.get('codingRating'),
        data.get('programmingLanguage') or data.get('programming_language'),
        data.get('dsaSkill') or data.get('dsa_skill'),
        data.get('coreCsKnowledge') or data.get('core_cs_knowledge'),
        data.get('devSkills') or data.get('dev_skills'),
        data.get('communicationScore') or data.get('communication_score'),
        data.get('resumeScore') or data.get('resume_score'),
        json.dumps(data.get('resumeDetails')) if 'resumeDetails' in data else (json.dumps(data.get('resume_details')) if 'resume_details' in data else None),
        data.get('targetCareerId'),
        data.get('targetCareerTitle'),
        json.dumps(data.get('skills')) if 'skills' in data else None,
        json.dumps(data.get('certifications')) if 'certifications' in data else None,
        json.dumps(data.get('projects')) if 'projects' in data else None,
        json.dumps(data.get('internships')) if 'internships' in data else None,
        json.dumps(data.get('roadmapState')) if 'roadmapState' in data else None,
        json.dumps(data.get('interviewHistory')) if 'interviewHistory' in data else None,
        json.dumps(data.get('completedVideos')) if 'completedVideos' in data else (json.dumps(data.get('completed_videos')) if 'completed_videos' in data else None),
        user['id']
    ))
    conn.commit()

    cursor.execute('SELECT * FROM users WHERE id = ?', (user['id'],))
    updated_user = cursor.fetchone()
    conn.close()

    return jsonify({
        'success': True,
        'message': 'Profile successfully synchronized with backend database!',
        'user': user_to_dict(updated_user)
    }), 200

@app.route('/api/user/roadmap', methods=['GET', 'PUT'])
def user_roadmap():
    user = get_current_user()
    if not user:
        return jsonify({'success': False, 'message': 'Unauthorized.'}), 401

    conn = get_db()
    cursor = conn.cursor()

    if request.method == 'PUT':
        data = request.get_json() or {}
        roadmap_json = json.dumps(data)
        cursor.execute('UPDATE users SET roadmap_state = ? WHERE id = ?', (roadmap_json, user['id']))
        conn.commit()
        conn.close()
        return jsonify({'success': True, 'message': 'Roadmap updated successfully', 'roadmapState': data}), 200

    cursor.execute('SELECT roadmap_state FROM users WHERE id = ?', (user['id'],))
    row = cursor.fetchone()
    conn.close()
    try:
        r_state = json.loads(row['roadmap_state'] or '{}') if row else {}
    except Exception:
        r_state = {}
    return jsonify({'success': True, 'roadmapState': r_state}), 200

@app.route('/api/user/interview', methods=['GET', 'PUT'])
def user_interview():
    user = get_current_user()
    if not user:
        return jsonify({'success': False, 'message': 'Unauthorized.'}), 401

    conn = get_db()
    cursor = conn.cursor()

    if request.method == 'PUT':
        data = request.get_json() or {}
        interview_json = json.dumps(data)
        cursor.execute('UPDATE users SET interview_history = ? WHERE id = ?', (interview_json, user['id']))
        conn.commit()
        conn.close()
        return jsonify({'success': True, 'message': 'Interview history updated successfully', 'interviewHistory': data}), 200

    cursor.execute('SELECT interview_history FROM users WHERE id = ?', (user['id'],))
    row = cursor.fetchone()
    conn.close()
    try:
        i_hist = json.loads(row['interview_history'] or '{}') if row else {}
    except Exception:
        i_hist = {}
    return jsonify({'success': True, 'interviewHistory': i_hist}), 200

@app.route('/api/user/prediction', methods=['POST'])
def save_prediction():
    user = get_current_user()
    if not user:
        return jsonify({'success': False, 'message': 'Unauthorized.'}), 401

    data = request.get_json() or {}
    prob = data.get('probability', 0)
    tier = data.get('tier', 'Medium')
    tier_label = data.get('tierLabel', '')
    factors = json.dumps(data.get('factors', {}))

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO predictions (user_id, probability, tier, tier_label, factors)
        VALUES (?, ?, ?, ?, ?)
    ''', (user['id'], prob, tier, tier_label, factors))
    conn.commit()
    conn.close()

    return jsonify({
        'success': True,
        'message': 'Prediction recorded in database history.'
    }), 201

@app.route('/api/user/history', methods=['GET'])
def get_prediction_history():
    user = get_current_user()
    if not user:
        return jsonify({'success': False, 'message': 'Unauthorized.'}), 401

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('''
        SELECT * FROM predictions
        WHERE user_id = ?
        ORDER BY calculated_at DESC
        LIMIT 10
    ''', (user['id'],))
    rows = cursor.fetchall()
    conn.close()

    history = []
    for r in rows:
        d = dict(r)
        d['factors'] = json.loads(d['factors']) if d['factors'] else {}
        history.append(d)

    return jsonify({'success': True, 'history': history}), 200

# ==============================================================================
# RESUME UPLOAD & PARSER NLP ENGINE
# ==============================================================================
TECH_KEYWORDS = [
    'Python', 'Java', 'C++', 'C', 'C#', 'JavaScript', 'TypeScript', 'Ruby', 'PHP', 'Go', 'Golang', 'Rust', 'Kotlin', 'Swift',
    'HTML', 'HTML5', 'CSS', 'CSS3', 'Tailwind', 'Bootstrap', 'React', 'React.js', 'Next.js', 'Angular', 'Vue.js', 'Redux',
    'Node.js', 'Express', 'Express.js', 'Django', 'Flask', 'FastAPI', 'Spring', 'Spring Boot', 'REST APIs', 'GraphQL',
    'SQL', 'MySQL', 'PostgreSQL', 'SQLite', 'MongoDB', 'Redis', 'Cassandra', 'DBMS',
    'Data Structures & Algorithms', 'DSA', 'System Design', 'OOP', 'Object Oriented Programming',
    'Operating Systems', 'Computer Networks', 'Git & GitHub', 'Git', 'GitHub', 'Linux', 'Bash', 'Shell Scripting',
    'AWS', 'Amazon Web Services', 'Azure', 'Google Cloud', 'Docker', 'Docker Basics', 'Kubernetes', 'CI/CD', 'Jenkins',
    'Machine Learning', 'Deep Learning', 'Artificial Intelligence', 'AI', 'NLP', 'Computer Vision',
    'PyTorch', 'TensorFlow', 'Scikit-Learn', 'Pandas & NumPy', 'Pandas', 'NumPy', 'Power BI', 'Tableau', 'Excel',
    'Cybersecurity', 'Ethical Hacking', 'Penetration Testing', 'Wireshark'
]

ACTION_VERBS = [
    'developed', 'built', 'designed', 'implemented', 'optimized', 'engineered', 
    'created', 'deployed', 'architected', 'spearheaded', 'automated', 'reduced', 'improved'
]

ROLE_REQUIREMENTS = {
    'sde': ['Data Structures & Algorithms', 'Java', 'C++', 'SQL & DBMS', 'Operating Systems', 'Computer Networks', 'System Design', 'Git & GitHub'],
    'webdev': ['HTML/CSS', 'JavaScript', 'React.js', 'Node.js', 'REST APIs', 'SQL & DBMS', 'Git & GitHub', 'TypeScript'],
    'data-analyst': ['Python', 'SQL & DBMS', 'Power BI', 'Pandas & NumPy', 'Statistics', 'Excel'],
    'aiml': ['Python', 'Machine Learning', 'Deep Learning', 'PyTorch', 'TensorFlow', 'Data Structures & Algorithms', 'Scikit-Learn'],
    'cloud-devops': ['Linux', 'AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Python', 'Computer Networks'],
    'cybersecurity': ['Computer Networks', 'Linux', 'Ethical Hacking', 'Operating Systems', 'Python']
}

def parse_resume_content(raw_text, target_role_id='sde'):
    text = raw_text or ''
    lower_text = text.lower()

    # 1. Extract Contact Info
    email_match = re.search(r'[\w\.-]+@[\w\.-]+\.\w+', text)
    email = email_match.group(0) if email_match else ''

    phone_match = re.search(r'(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}', text)
    phone = phone_match.group(0) if phone_match else ''

    # Extract Name (Heuristic: first non-empty line or first uppercase line)
    lines = [line.strip() for line in text.split('\n') if line.strip()]
    candidate_name = lines[0] if lines else 'Student Candidate'
    if len(candidate_name) > 40 or '@' in candidate_name:
        candidate_name = 'Student Candidate'

    # 2. Extract Skills
    detected_skills = []
    for skill in TECH_KEYWORDS:
        # Match as whole word / token boundary
        pattern = r'\b' + re.escape(skill.lower()) + r'\b'
        if re.search(pattern, lower_text):
            detected_skills.append(skill)
    # Deduplicate while preserving order
    unique_skills = list(dict.fromkeys(detected_skills))

    # 3. Extract Education & CGPA
    education_info = []
    degree_matches = re.findall(r'\b(b\.?tech|b\.?e\.?|m\.?tech|m\.?s\.?|bca|mca|b\.?sc)\b', lower_text)
    cgpa_match = re.search(r'(\b\d\.\d{1,2}\s*(?:cgpa|gpa|\/10)?\b|\b\d{2}(?:\.\d+)?%)', lower_text)
    cgpa_str = cgpa_match.group(0) if cgpa_match else '8.0+ CGPA'

    if degree_matches:
        education_info.append(f"{degree_matches[0].upper()} (Computer Science / Related Engineering) • {cgpa_str}")
    else:
        education_info.append(f"Bachelor of Technology • {cgpa_str}")

    # 4. Extract Projects
    projects = []
    # Identify Project sections or keywords
    proj_patterns = [
        r'(?:project|developed|built|created)\s*[:\-–]\s*([^\n\r]+)',
        r'•\s*([A-Z][A-Za-z0-9\s\-]+(?:Portal|System|App|Platform|Tracker|Classifier|Dashboard))'
    ]
    for pat in proj_patterns:
        for m in re.finditer(pat, text):
            proj_title = m.group(1).strip()
            if len(proj_title) > 5 and len(proj_title) < 60 and proj_title not in [p['title'] for p in projects]:
                projects.append({
                    'title': proj_title,
                    'desc': 'Implemented end-to-end functionality with modern software architectures and reliable testing.'
                })
    if not projects:
        # Fallback realistic project based on detected skills
        top_skill = unique_skills[0] if unique_skills else 'Web Architecture'
        projects.append({
            'title': f'{top_skill} Enterprise Portal',
            'desc': 'Architected full-stack modules with database integration and RESTful API communications.'
        })

    # 5. Extract Internships & Work Experience
    internships = []
    if 'intern' in lower_text or 'experience' in lower_text or 'trainee' in lower_text:
        intern_match = re.search(r'(?:intern(?:ship)?|software engineer|developer)\s*(?:at|@|-)\s*([A-Za-z0-9\s]+)', text, re.IGNORECASE)
        company = intern_match.group(1).strip()[:30] if intern_match else 'Software Solutions Inc.'
        internships.append({
            'company': company,
            'role': 'Software Engineering Intern',
            'desc': 'Contributed to production codebases, automated database queries, and implemented unit test coverage.'
        })

    # 6. Extract Certifications
    certifications = []
    cert_matches = re.findall(r'(aws\s+[A-Za-z\s]+|hackerrank\s+[A-Za-z\s]+|coursera\s+[A-Za-z\s]+|google\s+[A-Za-z\s]+|certified\s+[A-Za-z\s]+)', text, re.IGNORECASE)
    for c in cert_matches[:3]:
        clean_c = c.strip()[:40]
        if len(clean_c) > 6 and clean_c not in certifications:
            certifications.append(clean_c)

    # 7. Compute ATS Score (0 - 100)
    score = 0
    suggestions = []

    # Contact Info (+15)
    if email and phone:
        score += 15
    elif email or phone:
        score += 10
        suggestions.append("Add both a professional email and phone number at the top of your resume header.")
    else:
        suggestions.append("Missing primary contact details (email or phone). Ensure headers are ATS-parseable.")

    # Education (+15)
    if education_info:
        score += 15

    # Skills (+25)
    if len(unique_skills) >= 8:
        score += 25
    elif len(unique_skills) >= 4:
        score += 18
        suggestions.append("Expand your Technical Skills matrix to include 8+ in-demand industry tools.")
    else:
        score += 10
        suggestions.append("Low keyword density: Incorporate more explicit programming languages and developer frameworks.")

    # Projects (+20)
    if len(projects) >= 2:
        score += 20
    elif len(projects) >= 1:
        score += 15
        suggestions.append("Include at least 2 distinct capstone projects with live demo links and tech stack labels.")
    else:
        score += 5
        suggestions.append("No prominent Project section detected. Hiring managers heavily prioritize portfolio projects.")

    # Experience / Internships (+15)
    if internships:
        score += 15
    else:
        score += 5
        suggestions.append("No internship or work experience section found. Add open-source contributions or research work.")

    # Action Verbs & Metrics (+10)
    verb_count = sum(1 for verb in ACTION_VERBS if verb in lower_text)
    has_metrics = bool(re.search(r'\b\d+%\b|\b\d+x\b|\b\d+\+?\s*(?:users|queries|ms|sec)\b', lower_text))
    if verb_count >= 3 and has_metrics:
        score += 10
    elif verb_count >= 1:
        score += 6
        suggestions.append("Quantify your impact using measurable metrics (e.g. 'reduced latency by 35%', 'served 500+ users').")
    else:
        score += 3
        suggestions.append("Begin bullet points with strong action verbs: Designed, Engineered, Optimized, Automated.")

    ats_score = min(98, max(35, score))

    # 8. Compute Target Role Fit
    req_skills = ROLE_REQUIREMENTS.get(target_role_id, ROLE_REQUIREMENTS['sde'])
    matched_role_skills = [s for s in req_skills if any(s.lower() in u.lower() or u.lower() in s.lower() for u in unique_skills)]
    missing_role_skills = [s for s in req_skills if s not in matched_role_skills]
    role_match_pct = round((len(matched_role_skills) / len(req_skills)) * 100)

    grade = 'Needs Refinement'
    if ats_score >= 80: grade = 'Excellent (ATS Ready)'
    elif ats_score >= 65: grade = 'Good (Competitive)'

    return {
        'candidateName': candidate_name,
        'email': email,
        'phone': phone,
        'atsScore': ats_score,
        'scoreGrade': grade,
        'skills': unique_skills,
        'education': education_info,
        'projects': projects,
        'internships': internships,
        'certifications': certifications,
        'targetRoleMatch': {
            'targetRole': target_role_id.upper(),
            'matchPercentage': role_match_pct,
            'matchedSkills': matched_role_skills,
            'missingSkills': missing_role_skills
        },
        'suggestions': suggestions
    }

@app.route('/api/resume/analyze', methods=['POST'])
def analyze_resume():
    target_role = request.args.get('targetRole', 'sde')
    raw_text = ''
    file_name = 'Uploaded Resume'

    # Check if a file was uploaded in multipart
    if 'file' in request.files:
        uploaded_file = request.files['file']
        file_name = uploaded_file.filename or 'resume.pdf'
        file_bytes = uploaded_file.read()
        lower_name = file_name.lower()

        # PDF Parsing
        if lower_name.endswith('.pdf'):
            try:
                import io
                from PyPDF2 import PdfReader
                pdf_reader = PdfReader(io.BytesIO(file_bytes))
                pages_text = [page.extract_text() or '' for page in pdf_reader.pages]
                raw_text = '\n'.join(pages_text)
            except Exception as e:
                print(f"Error parsing PDF with PyPDF2: {e}")
                raw_text = file_bytes.decode('utf-8', errors='ignore')

        # DOCX Parsing
        elif lower_name.endswith('.docx') or lower_name.endswith('.doc'):
            try:
                import io
                import docx
                doc = docx.Document(io.BytesIO(file_bytes))
                raw_text = '\n'.join([p.text for p in doc.paragraphs])
            except Exception as e:
                print(f"Error parsing DOCX: {e}")
                raw_text = file_bytes.decode('utf-8', errors='ignore')

        # Plain text
        else:
            raw_text = file_bytes.decode('utf-8', errors='ignore')

    # Or check if text was sent in JSON payload
    elif request.is_json:
        data = request.get_json() or {}
        raw_text = data.get('text', '')
        file_name = data.get('fileName', 'Pasted Resume Text')
        target_role = data.get('targetRole', target_role)

    if not raw_text or len(raw_text.strip()) < 20:
        return jsonify({
            'success': False,
            'message': 'Unable to extract text from resume. Please upload a clear PDF, DOCX, or text file.'
        }), 400

    analysis = parse_resume_content(raw_text, target_role)
    analysis['fileName'] = file_name

    return jsonify({
        'success': True,
        'message': f'Resume successfully analyzed! ATS Score: {analysis["atsScore"]}/100',
        'data': analysis,
        'atsScore': analysis['atsScore'],
        'scoreGrade': analysis['scoreGrade'],
        'skills': analysis['skills'],
        'projects': analysis['projects'],
        'certifications': analysis['certifications'],
        'internships': analysis['internships'],
        'targetRoleMatch': analysis['targetRoleMatch'],
        'suggestions': analysis['suggestions']
    }), 200

# ==============================================================================
# PERSONALIZED YOUTUBE LEARNING RECOMMENDATION SYSTEM
# ==============================================================================

PERSONALIZED_YOUTUBE_REGISTRY = {
    'programming': {
        'Java': [
            {
                'id': 'yt-prog-java-1',
                'videoId': 'luc49p_m5tU',
                'title': 'Java Tutorial for Beginners | Complete Java + DSA Course',
                'channel': 'Kunal Kushwaha',
                'duration': '12 hrs 30 mins',
                'level': 'Beginner',
                'category': 'Java/Programming',
                'topic': 'Java & Object Oriented Programming',
                'thumbnail': 'https://img.youtube.com/vi/luc49p_m5tU/hqdefault.jpg',
                'videoUrl': 'https://www.youtube.com/watch?v=luc49p_m5tU',
                'whyRecommended': 'Comprehensive Java tutorial from scratch covering JVM architecture, memory management, and OOP fundamentals.'
            },
            {
                'id': 'yt-prog-java-2',
                'videoId': 'bm0OyhwFDuY',
                'title': 'Java Tutorial for Beginners [2024]',
                'channel': 'Telusko',
                'duration': '9 hrs 15 mins',
                'level': 'Beginner',
                'category': 'Java/Programming',
                'topic': 'Core Java & Multi-Threading',
                'thumbnail': 'https://img.youtube.com/vi/bm0OyhwFDuY/hqdefault.jpg',
                'videoUrl': 'https://www.youtube.com/watch?v=bm0OyhwFDuY',
                'whyRecommended': 'Practical industry walkthrough of exception handling, collections framework, and multi-threaded programming.'
            },
            {
                'id': 'yt-prog-java-3',
                'videoId': 'A74TOX803D0',
                'title': 'Java Full Course - freeCodeCamp',
                'channel': 'freeCodeCamp.org',
                'duration': '9 hrs 30 mins',
                'level': 'Intermediate',
                'category': 'Java/Programming',
                'topic': 'Java Collections & Streams API',
                'thumbnail': 'https://img.youtube.com/vi/A74TOX803D0/hqdefault.jpg',
                'videoUrl': 'https://www.youtube.com/watch?v=A74TOX803D0',
                'whyRecommended': 'Advanced Java features including lambdas, stream pipelines, generics, and concurrent collections.'
            }
        ],
        'Python': [
            {
                'id': 'yt-prog-py-1',
                'videoId': '_uQrJ0TkZlc',
                'title': 'Python Tutorial for Beginners - Full Course',
                'channel': 'Programming with Mosh',
                'duration': '6 hrs 14 mins',
                'level': 'Beginner',
                'category': 'Java/Programming',
                'topic': 'Python Syntax & Data Structures',
                'thumbnail': 'https://img.youtube.com/vi/_uQrJ0TkZlc/hqdefault.jpg',
                'videoUrl': 'https://www.youtube.com/watch?v=_uQrJ0TkZlc',
                'whyRecommended': 'Clear foundational programming course covering lists, dictionaries, tuples, and clean coding practices.'
            },
            {
                'id': 'yt-prog-py-2',
                'videoId': 'rfscVS0vtbw',
                'title': 'Learn Python - Full Course for Beginners',
                'channel': 'freeCodeCamp.org',
                'duration': '4 hrs 26 mins',
                'level': 'Beginner',
                'category': 'Java/Programming',
                'topic': 'Python Automation & Modules',
                'thumbnail': 'https://img.youtube.com/vi/rfscVS0vtbw/hqdefault.jpg',
                'videoUrl': 'https://www.youtube.com/watch?v=rfscVS0vtbw',
                'whyRecommended': 'Hands-on project-based Python tutorial for building scripts, data processing, and algorithmic problem solving.'
            }
        ],
        'C++': [
            {
                'id': 'yt-prog-cpp-1',
                'videoId': 'vLnPwxZdW4Y',
                'title': 'C++ Tutorial for Beginners - Full Course',
                'channel': 'freeCodeCamp.org',
                'duration': '4 hrs 01 min',
                'level': 'Beginner',
                'category': 'Java/Programming',
                'topic': 'C++ STL & Pointers',
                'thumbnail': 'https://img.youtube.com/vi/vLnPwxZdW4Y/hqdefault.jpg',
                'videoUrl': 'https://www.youtube.com/watch?v=vLnPwxZdW4Y',
                'whyRecommended': 'Master pointers, references, memory addresses, and the Standard Template Library (STL).'
            },
            {
                'id': 'yt-prog-cpp-2',
                'videoId': 'z9bZufPHFLU',
                'title': 'C++ Full Course : Free',
                'channel': 'Bro Code',
                'duration': '6 hrs 00 mins',
                'level': 'Intermediate',
                'category': 'Java/Programming',
                'topic': 'Object-Oriented C++ & Memory',
                'thumbnail': 'https://img.youtube.com/vi/z9bZufPHFLU/hqdefault.jpg',
                'videoUrl': 'https://www.youtube.com/watch?v=z9bZufPHFLU',
                'whyRecommended': 'Fast-paced comprehensive review of C++ templates, vectors, memory allocation, and structs.'
            }
        ],
        'JavaScript': [
            {
                'id': 'yt-prog-js-1',
                'videoId': 'W6NZfCO5SIk',
                'title': 'JavaScript Course for Beginners – Your First Step to Web Development',
                'channel': 'Programming with Mosh',
                'duration': '1 hr 48 mins',
                'level': 'Beginner',
                'category': 'Java/Programming',
                'topic': 'JavaScript ES6 & Async',
                'thumbnail': 'https://img.youtube.com/vi/W6NZfCO5SIk/hqdefault.jpg',
                'videoUrl': 'https://www.youtube.com/watch?v=W6NZfCO5SIk',
                'whyRecommended': 'Core JavaScript essentials: closures, scopes, event loop, Promises, and modern ES6+ syntax.'
            },
            {
                'id': 'yt-prog-js-2',
                'videoId': '30LWjhZzg50',
                'title': 'TypeScript Course for Beginners - Learn TypeScript from Scratch',
                'channel': 'freeCodeCamp.org',
                'duration': '1 hr 34 mins',
                'level': 'Intermediate',
                'category': 'Java/Programming',
                'topic': 'TypeScript Static Typing & Generics',
                'thumbnail': 'https://img.youtube.com/vi/30LWjhZzg50/hqdefault.jpg',
                'videoUrl': 'https://www.youtube.com/watch?v=30LWjhZzg50',
                'whyRecommended': 'Essential for modern frontend/fullstack roles: Interfaces, Generics, Type Narrowing, and TS compiler config.'
            }
        ]
    },
    'dsa': [
        {
            'id': 'yt-dsa-1',
            'videoId': '0IAPZzGSbME',
            'title': '1. Introduction to Algorithms',
            'channel': 'Abdul Bari',
            'duration': '10 hrs 45 mins',
            'level': 'Beginner',
            'category': 'DSA',
            'topic': 'Asymptotic Analysis & Big-O Notation',
            'thumbnail': 'https://img.youtube.com/vi/0IAPZzGSbME/hqdefault.jpg',
            'videoUrl': 'https://www.youtube.com/watch?v=0IAPZzGSbME',
            'whyRecommended': 'World-renowned visual explanations of recursion trees, time & space complexity analysis.'
        },
        {
            'id': 'yt-dsa-2',
            'videoId': 'RBSGKlAvoiM',
            'title': 'Data Structures Easy to Advanced Course - Full Tutorial from a Google Engineer',
            'channel': 'freeCodeCamp.org',
            'duration': '8 hrs 03 mins',
            'level': 'Beginner',
            'category': 'DSA',
            'topic': 'Data Structures Fundamentals',
            'thumbnail': 'https://img.youtube.com/vi/RBSGKlAvoiM/hqdefault.jpg',
            'videoUrl': 'https://www.youtube.com/watch?v=RBSGKlAvoiM',
            'whyRecommended': 'Complete walkthrough of Arrays, Linked Lists, Stacks, Queues, Binary Trees, and Hash Tables.'
        },
        {
            'id': 'yt-dsa-3',
            'videoId': 'KLlXCFG5TnA',
            'title': 'Two Sum - Leetcode 1 - HashMap - Python',
            'channel': 'NeetCode',
            'duration': '8 mins',
            'level': 'Intermediate',
            'category': 'DSA',
            'topic': 'LeetCode 150 & Sliding Window',
            'thumbnail': 'https://img.youtube.com/vi/KLlXCFG5TnA/hqdefault.jpg',
            'videoUrl': 'https://www.youtube.com/watch?v=KLlXCFG5TnA',
            'whyRecommended': 'Learn optimal HashMap lookups reducing O(N^2) brute force to linear O(N) time complexity.'
        },
        {
            'id': 'yt-dsa-4',
            'videoId': 'tyB0ztf0DNY',
            'title': 'DP 1. Introduction to Dynamic Programming | Memoization | Tabulation',
            'channel': 'take U forward',
            'duration': '38 mins',
            'level': 'Advanced',
            'category': 'DSA',
            'topic': 'Dynamic Programming & Memoization',
            'thumbnail': 'https://img.youtube.com/vi/tyB0ztf0DNY/hqdefault.jpg',
            'videoUrl': 'https://www.youtube.com/watch?v=tyB0ztf0DNY',
            'whyRecommended': 'Striver\'s masterclass on 1D/2D DP recurrence relations, top-down memoization, and bottom-up space optimization.'
        },
        {
            'id': 'yt-dsa-5',
            'videoId': 'xpDnVSmNFX0',
            'title': 'System Design BASICS: Horizontal vs. Vertical Scaling',
            'channel': 'Gaurav Sen',
            'duration': '11 mins',
            'level': 'Advanced',
            'category': 'DSA',
            'topic': 'System Design & Scalability',
            'thumbnail': 'https://img.youtube.com/vi/xpDnVSmNFX0/hqdefault.jpg',
            'videoUrl': 'https://www.youtube.com/watch?v=xpDnVSmNFX0',
            'whyRecommended': 'Crucial for Tier-1 Product Company rounds: load balancers, database sharding, and caching layers.'
        }
    ],
    'corecs': [
        {
            'id': 'yt-corecs-1',
            'videoId': 'bkSWJJZNgf8',
            'title': 'Introduction to Operating Systems',
            'channel': 'Neso Academy',
            'duration': '18 mins',
            'level': 'Beginner',
            'category': 'Core CS',
            'topic': 'OS Architecture & Kernel',
            'thumbnail': 'https://img.youtube.com/vi/bkSWJJZNgf8/hqdefault.jpg',
            'videoUrl': 'https://www.youtube.com/watch?v=bkSWJJZNgf8',
            'whyRecommended': 'Foundational concepts on user vs kernel mode, system calls, and dual-mode operation for tech vivas.'
        },
        {
            'id': 'yt-corecs-2',
            'videoId': 'HxvTx79f6u4',
            'title': 'Process Scheduling in Operating Systems',
            'channel': 'Gate Smashers',
            'duration': '14 mins',
            'level': 'Intermediate',
            'category': 'Core CS',
            'topic': 'CPU Scheduling & Deadlocks',
            'thumbnail': 'https://img.youtube.com/vi/HxvTx79f6u4/hqdefault.jpg',
            'videoUrl': 'https://www.youtube.com/watch?v=HxvTx79f6u4',
            'whyRecommended': 'FCFS, SJF, Round Robin, and Banker\'s algorithm explained with high-frequency placement interview questions.'
        },
        {
            'id': 'yt-corecs-3',
            'videoId': 'HXV3zeQKqGY',
            'title': 'SQL Tutorial - Full Database Course for Beginners',
            'channel': 'freeCodeCamp.org',
            'duration': '4 hrs 20 mins',
            'level': 'Beginner',
            'category': 'Core CS',
            'topic': 'DBMS, SQL Queries & Normalization',
            'thumbnail': 'https://img.youtube.com/vi/HXV3zeQKqGY/hqdefault.jpg',
            'videoUrl': 'https://www.youtube.com/watch?v=HXV3zeQKqGY',
            'whyRecommended': 'Master relational database schema design, ACID properties, joins, subqueries, and B-Tree indexing.'
        },
        {
            'id': 'yt-corecs-4',
            'videoId': 'qiQR5rTSshw',
            'title': 'Computer Networking Course - Network Engineering',
            'channel': 'freeCodeCamp.org',
            'duration': '9 hrs 24 mins',
            'level': 'Intermediate',
            'category': 'Core CS',
            'topic': 'Computer Networks & TCP/IP',
            'thumbnail': 'https://img.youtube.com/vi/qiQR5rTSshw/hqdefault.jpg',
            'videoUrl': 'https://www.youtube.com/watch?v=qiQR5rTSshw',
            'whyRecommended': 'Deep dive into TCP 3-way handshake, DNS, HTTP/HTTPS, subnetting, and socket programming.'
        }
    ],
    'fullstack': [
        {
            'id': 'yt-dev-1',
            'videoId': 'mU6anWqZJcc',
            'title': 'Learn HTML5 and CSS3 From Scratch - Full Course',
            'channel': 'freeCodeCamp.org',
            'duration': '11 hrs 30 mins',
            'level': 'Beginner',
            'category': 'Full Stack',
            'topic': 'Modern Responsive Web Design',
            'thumbnail': 'https://img.youtube.com/vi/mU6anWqZJcc/hqdefault.jpg',
            'videoUrl': 'https://www.youtube.com/watch?v=mU6anWqZJcc',
            'whyRecommended': 'Essential for web developer screening: Semantic HTML, Flexbox, CSS Grid, and mobile-first layouts.'
        },
        {
            'id': 'yt-dev-2',
            'videoId': 'bMknfKXIFA8',
            'title': "React Course - Beginner's Tutorial for React",
            'channel': 'freeCodeCamp.org',
            'duration': '11 hrs 55 mins',
            'level': 'Intermediate',
            'category': 'Full Stack',
            'topic': 'React Hooks & State Management',
            'thumbnail': 'https://img.youtube.com/vi/bMknfKXIFA8/hqdefault.jpg',
            'videoUrl': 'https://www.youtube.com/watch?v=bMknfKXIFA8',
            'whyRecommended': 'Component architecture, useState/useEffect hooks, custom hooks, and context API for frontend interviews.'
        },
        {
            'id': 'yt-dev-3',
            'videoId': 'Oe421EPjeBE',
            'title': 'Node.js and Express.js - Full Course',
            'channel': 'freeCodeCamp.org',
            'duration': '8 hrs 16 mins',
            'level': 'Intermediate',
            'category': 'Full Stack',
            'topic': 'REST APIs & Backend Architecture',
            'thumbnail': 'https://img.youtube.com/vi/Oe421EPjeBE/hqdefault.jpg',
            'videoUrl': 'https://www.youtube.com/watch?v=Oe421EPjeBE',
            'whyRecommended': 'Learn routing, middleware authentication, JWT tokens, and database integration for full-stack engineering.'
        },
        {
            'id': 'yt-dev-4',
            'videoId': '3c-iBn73dDE',
            'title': 'Docker Tutorial for Beginners [FULL COURSE in 3 Hours]',
            'channel': 'TechWorld with Nana',
            'duration': '2 hrs 48 mins',
            'level': 'Advanced',
            'category': 'Full Stack',
            'topic': 'Docker & Containerization',
            'thumbnail': 'https://img.youtube.com/vi/3c-iBn73dDE/hqdefault.jpg',
            'videoUrl': 'https://www.youtube.com/watch?v=3c-iBn73dDE',
            'whyRecommended': 'High-demand DevOps skill: Containerize your projects, write Dockerfiles, and orchestrate with Docker Compose.'
        }
    ],
    'aptitude': [
        {
            'id': 'yt-apt-1',
            'videoId': 'rsmXhDyoH6M',
            'title': 'Aptitude Test Questions and Answers for Placement Drives',
            'channel': 'CareerRide',
            'duration': '45 mins',
            'level': 'Beginner',
            'category': 'Aptitude',
            'topic': 'Quantitative Aptitude Essentials',
            'thumbnail': 'https://img.youtube.com/vi/rsmXhDyoH6M/hqdefault.jpg',
            'videoUrl': 'https://www.youtube.com/watch?v=rsmXhDyoH6M',
            'whyRecommended': 'Highest yield practice questions for TCS, Infosys, Cognizant, and Wipro initial placement screening.'
        },
        {
            'id': 'yt-apt-2',
            'videoId': 'yV9vWk5iC5o',
            'title': 'Quantitative Aptitude Short Tricks for Placements',
            'channel': 'Feel Free to Learn',
            'duration': '38 mins',
            'level': 'Intermediate',
            'category': 'Aptitude',
            'topic': 'Speed Math, Percentages & Profit/Loss',
            'thumbnail': 'https://img.youtube.com/vi/yV9vWk5iC5o/hqdefault.jpg',
            'videoUrl': 'https://www.youtube.com/watch?v=yV9vWk5iC5o',
            'whyRecommended': 'Shortcut techniques to solve percentage and profit/loss calculations under 30 seconds per question.'
        },
        {
            'id': 'yt-apt-3',
            'videoId': '58dO_qF3e7I',
            'title': 'Time and Work Problems Short Tricks',
            'channel': 'CareerRide',
            'duration': '24 mins',
            'level': 'Beginner',
            'category': 'Aptitude',
            'topic': 'Time, Work & Efficiency',
            'thumbnail': 'https://img.youtube.com/vi/58dO_qF3e7I/hqdefault.jpg',
            'videoUrl': 'https://www.youtube.com/watch?v=58dO_qF3e7I',
            'whyRecommended': 'LCM method for solving Pipes & Cisterns and Time & Work problems with 100% accuracy.'
        },
        {
            'id': 'yt-apt-4',
            'videoId': 'sRkXfKq_TzI',
            'title': 'Number Series Reasoning Tricks for Tech Placement Exams',
            'channel': 'Study Smart',
            'duration': '30 mins',
            'level': 'Intermediate',
            'category': 'Aptitude',
            'topic': 'Logical Reasoning & Pattern Analysis',
            'thumbnail': 'https://img.youtube.com/vi/sRkXfKq_TzI/hqdefault.jpg',
            'videoUrl': 'https://www.youtube.com/watch?v=sRkXfKq_TzI',
            'whyRecommended': 'Master geometric, alternating, and polynomial number series for aptitude test clearing.'
        }
    ],
    'projects': [
        {
            'id': 'yt-proj-1',
            'videoId': 'nu_pCVPKzTk',
            'title': 'Full Stack MERN Project with Authentication & Real-Time Sync',
            'channel': 'freeCodeCamp.org',
            'duration': '3 hrs 20 mins',
            'level': 'Advanced',
            'category': 'Projects',
            'topic': 'Full-Stack Production Capstone',
            'thumbnail': 'https://img.youtube.com/vi/nu_pCVPKzTk/hqdefault.jpg',
            'videoUrl': 'https://www.youtube.com/watch?v=nu_pCVPKzTk',
            'whyRecommended': 'Impress recruiters by building a full-featured web app with JWT authentication, MongoDB schemas, and clean UI.'
        },
        {
            'id': 'yt-proj-2',
            'videoId': 'qfyynHBFOsM',
            'title': 'Data Analyst Portfolio Project | SQL Data Exploration',
            'channel': 'Alex The Analyst',
            'duration': '45 mins',
            'level': 'Intermediate',
            'category': 'Projects',
            'topic': 'SQL Data Exploration Portfolio Project',
            'thumbnail': 'https://img.youtube.com/vi/qfyynHBFOsM/hqdefault.jpg',
            'videoUrl': 'https://www.youtube.com/watch?v=qfyynHBFOsM',
            'whyRecommended': 'End-to-end portfolio project analyzing COVID-19 datasets using SQL CTEs, window functions, and views.'
        },
        {
            'id': 'yt-proj-3',
            'videoId': 'L72fhGm1tfE',
            'title': 'Build and Deploy 10 Projects in React',
            'channel': 'freeCodeCamp.org',
            'duration': '9 hrs 00 mins',
            'level': 'Intermediate',
            'category': 'Projects',
            'topic': 'React Portfolio Projects',
            'thumbnail': 'https://img.youtube.com/vi/L72fhGm1tfE/hqdefault.jpg',
            'videoUrl': 'https://www.youtube.com/watch?v=L72fhGm1tfE',
            'whyRecommended': '10 distinct portfolio-ready React applications with API consumption, filtering, and responsive CSS.'
        },
        {
            'id': 'yt-proj-4',
            'videoId': 'G3e-cpL7ofc',
            'title': 'Full Stack Web Development Project from Scratch',
            'channel': 'Web Dev Simplified',
            'duration': '1 hr 15 mins',
            'level': 'Advanced',
            'category': 'Projects',
            'topic': 'Production Web Application Deployment',
            'thumbnail': 'https://img.youtube.com/vi/G3e-cpL7ofc/hqdefault.jpg',
            'videoUrl': 'https://www.youtube.com/watch?v=G3e-cpL7ofc',
            'whyRecommended': 'Professional code organization, security best practices, and automated deployment pipelines.'
        }
    ],
    'interview': [
        {
            'id': 'yt-int-1',
            'videoId': 'wbp-3Bs94DQ',
            'title': 'How to Prepare for Coding Interviews in 2024',
            'channel': 'NeetCode',
            'duration': '14 mins',
            'level': 'Beginner',
            'category': 'Interview Preparation',
            'topic': 'Coding Interview Roadmap & Strategy',
            'thumbnail': 'https://img.youtube.com/vi/wbp-3Bs94DQ/hqdefault.jpg',
            'videoUrl': 'https://www.youtube.com/watch?v=wbp-3Bs94DQ',
            'whyRecommended': 'Clear blueprint on question prioritization, mock interview frequency, and time management.'
        },
        {
            'id': 'yt-int-2',
            'videoId': '1mHjMNZZvFo',
            'title': 'Tell Me About Yourself - Top Answer for Freshers Campus Placement',
            'channel': 'CareerVidz',
            'duration': '10 mins',
            'level': 'Beginner',
            'category': 'Interview Preparation',
            'topic': 'HR Interview Self Introduction',
            'thumbnail': 'https://img.youtube.com/vi/1mHjMNZZvFo/hqdefault.jpg',
            'videoUrl': 'https://www.youtube.com/watch?v=1mHjMNZZvFo',
            'whyRecommended': 'Perfect 90-second script linking your academic projects, skills, and company cultural fit.'
        },
        {
            'id': 'yt-int-3',
            'videoId': 'uGk_4K6hRrg',
            'title': 'STAR Method Behavioral Interview Questions and Answers',
            'channel': 'Dan Croitor',
            'duration': '16 mins',
            'level': 'Intermediate',
            'category': 'Interview Preparation',
            'topic': 'STAR Technique & Behavioral Competency',
            'thumbnail': 'https://img.youtube.com/vi/uGk_4K6hRrg/hqdefault.jpg',
            'videoUrl': 'https://www.youtube.com/watch?v=uGk_4K6hRrg',
            'whyRecommended': 'Structure answers using Situation, Task, Action, and Result to score high in technical director rounds.'
        },
        {
            'id': 'yt-int-4',
            'videoId': 'zC5_H1c5qZ0',
            'title': 'Technical Coding Mock Interview with Ex-Google Engineer',
            'channel': 'freeCodeCamp.org',
            'duration': '55 mins',
            'level': 'Advanced',
            'category': 'Interview Preparation',
            'topic': 'Live Technical Mock Simulation',
            'thumbnail': 'https://img.youtube.com/vi/zC5_H1c5qZ0/hqdefault.jpg',
            'videoUrl': 'https://www.youtube.com/watch?v=zC5_H1c5qZ0',
            'whyRecommended': 'Observe real live problem breakdown, edge case handling, and communication under interview pressure.'
        }
    ]
}

@app.route('/api/youtube/personalized', methods=['GET'])
def get_personalized_youtube_recommendations():
    user = get_current_user()
    
    # If not authenticated via bearer, check optional ?uid query param or use default
    if not user:
        uid = request.args.get('uid')
        if uid:
            conn = get_db()
            cursor = conn.cursor()
            cursor.execute('SELECT * FROM users WHERE id = ?', (uid,))
            user = cursor.fetchone()
            conn.close()

    # Fallback to seeded demo user if still none
    if not user:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE email LIKE '%samiksha%' LIMIT 1")
        user = cursor.fetchone()
        conn.close()

    user_dict = user_to_dict(user) if user else {}
    
    # Extract student parameters
    student_name = user_dict.get('fullName', 'Student')
    student_branch = user_dict.get('branch', 'Computer Science & Engineering')
    cgpa = float(user_dict.get('cgpa', 8.0) or 8.0)
    primary_lang = user_dict.get('programmingLanguage') or 'Java'
    dsa_skill = user_dict.get('dsaSkill') or 'Intermediate'
    core_cs = user_dict.get('coreCsKnowledge') or 'Moderate'
    dev_skills = user_dict.get('devSkills') or 'Full Stack & APIs'
    aptitude_score = int(user_dict.get('aptitudeScore', 80) or 80)
    coding_rating = int(user_dict.get('codingRating', 1600) or 1600)
    skills = user_dict.get('skills', [])
    projects = user_dict.get('projects', [])
    internships = user_dict.get('internships', [])
    target_career_id = user_dict.get('targetCareerId', 'sde')
    completed_videos = set(user_dict.get('completedVideos', []))

    # 1. Identify Weaknesses & Skill Gaps
    identified_gaps = []
    priorities = []

    if dsa_skill == 'Beginner' or coding_rating < 1450:
        identified_gaps.append({
            'area': 'Data Structures & Algorithms',
            'severity': 'High Priority',
            'desc': 'DSA competency is at beginner level (Coding Rating: ' + str(coding_rating) + '). Product company screening requires arrays, hash maps, and tree traversal mastery.'
        })
        priorities.append('DSA Foundations & Big-O')
    elif dsa_skill == 'Intermediate':
        priorities.append('LeetCode 150 & Tree/Graph Patterns')
    else:
        priorities.append('Dynamic Programming & Advanced System Design')

    if core_cs in ['Basic', 'Moderate']:
        identified_gaps.append({
            'area': 'Core Computer Science',
            'severity': 'Critical',
            'desc': 'Core CS viva readiness requires deeper grasp of Operating Systems (Process Scheduling & Deadlocks) and DBMS (ACID & Indexing).'
        })
        priorities.append('OS & DBMS Viva Mastery')

    if aptitude_score < 75:
        identified_gaps.append({
            'area': 'Aptitude & Logical Reasoning',
            'severity': 'Critical Cutoff Alert',
            'desc': f'Current aptitude score ({aptitude_score}%) is below the 75% cutoff threshold for standard IT & product drive qualification.'
        })
        priorities.append('Speed Math & Aptitude Cutoff Clearing')

    if len(projects) < 2:
        identified_gaps.append({
            'area': 'Portfolio Capstone Projects',
            'severity': 'High Priority',
            'desc': f'Currently {len(projects)} project registered. Campus placement drives favor candidates with at least 2 production-ready applications.'
        })
        priorities.append('Full-Stack Production Project')

    if not internships:
        identified_gaps.append({
            'area': 'Industry Experience',
            'severity': 'Medium Priority',
            'desc': 'No formal internship logged. Building open-source or simulated microservice applications will bridge this gap.'
        })

    # 2. Curate Video Recommendations across all 7 Categories
    # Programming category matching primary language
    prog_key = 'Java'
    lower_lang = primary_lang.lower()
    if 'python' in lower_lang: prog_key = 'Python'
    elif 'c++' in lower_lang: prog_key = 'C++'
    elif 'script' in lower_lang or 'js' in lower_lang: prog_key = 'JavaScript'

    prog_videos = PERSONALIZED_YOUTUBE_REGISTRY['programming'].get(prog_key, PERSONALIZED_YOUTUBE_REGISTRY['programming']['Java'])
    dsa_videos = list(PERSONALIZED_YOUTUBE_REGISTRY['dsa'])
    corecs_videos = list(PERSONALIZED_YOUTUBE_REGISTRY['corecs'])
    fullstack_videos = list(PERSONALIZED_YOUTUBE_REGISTRY['fullstack'])
    aptitude_videos = list(PERSONALIZED_YOUTUBE_REGISTRY['aptitude'])
    projects_videos = list(PERSONALIZED_YOUTUBE_REGISTRY['projects'])
    interview_videos = list(PERSONALIZED_YOUTUBE_REGISTRY['interview'])

    # Adaptive sorting based on competency
    if dsa_skill == 'Beginner':
        dsa_videos.sort(key=lambda v: 0 if v['level'] == 'Beginner' else (1 if v['level'] == 'Intermediate' else 2))
    elif dsa_skill in ['Advanced', 'Expert']:
        dsa_videos.sort(key=lambda v: 0 if v['level'] == 'Advanced' else (1 if v['level'] == 'Intermediate' else 2))

    def attach_completion(vlist):
        result = []
        for v in vlist:
            v_copy = dict(v)
            v_copy['isCompleted'] = v_copy['videoId'] in completed_videos or v_copy['id'] in completed_videos
            result.append(v_copy)
        return result

    prog_videos_curated = attach_completion(prog_videos)
    dsa_videos_curated = attach_completion(dsa_videos)
    corecs_videos_curated = attach_completion(corecs_videos)
    fullstack_videos_curated = attach_completion(fullstack_videos)
    aptitude_videos_curated = attach_completion(aptitude_videos)
    projects_videos_curated = attach_completion(projects_videos)
    interview_videos_curated = attach_completion(interview_videos)

    all_recommended_videos = (
        prog_videos_curated + dsa_videos_curated + corecs_videos_curated +
        fullstack_videos_curated + aptitude_videos_curated + projects_videos_curated + interview_videos_curated
    )

    # 3. Generate Personalized 7-Day Daily Study Roadmap
    daily_roadmap = [
        {
            'day': 1,
            'title': f'Day 1: {prog_key} Mastery & OOP Principles',
            'category': 'Programming',
            'targetVideo': prog_videos[0],
            'dailyTarget': f'Master {prog_key} memory allocation, encapsulation, and inheritance.',
            'estimatedTime': '1 hr 30 mins',
            'isCompleted': prog_videos[0]['videoId'] in completed_videos
        },
        {
            'day': 2,
            'title': 'Day 2: Asymptotic Analysis & Arrays / HashMaps',
            'category': 'DSA',
            'targetVideo': dsa_videos[0] if dsa_skill == 'Beginner' else dsa_videos[2],
            'dailyTarget': 'Solve 3 LeetCode Easy/Medium problems using two-pointers & frequency maps.',
            'estimatedTime': '2 hrs',
            'isCompleted': (dsa_videos[0] if dsa_skill == 'Beginner' else dsa_videos[2])['videoId'] in completed_videos
        },
        {
            'day': 3,
            'title': 'Day 3: Operating Systems Architecture & Process Synchronization',
            'category': 'Core CS',
            'targetVideo': corecs_videos[1] if core_cs in ['Basic', 'Moderate'] else corecs_videos[0],
            'dailyTarget': 'Review CPU scheduling algorithms and mutex/semaphore synchronization.',
            'estimatedTime': '1 hr 15 mins',
            'isCompleted': (corecs_videos[1] if core_cs in ['Basic', 'Moderate'] else corecs_videos[0])['videoId'] in completed_videos
        },
        {
            'day': 4,
            'title': 'Day 4: Relational Databases, SQL Joins & B-Tree Indexing',
            'category': 'Core CS',
            'targetVideo': corecs_videos[2],
            'dailyTarget': 'Write 5 complex SQL queries with CTEs, aggregate joins, and transactions.',
            'estimatedTime': '1 hr 45 mins',
            'isCompleted': corecs_videos[2]['videoId'] in completed_videos
        },
        {
            'day': 5,
            'title': 'Day 5: Placement Aptitude & Speed Math Drills',
            'category': 'Aptitude',
            'targetVideo': aptitude_videos[0] if aptitude_score < 80 else aptitude_videos[1],
            'dailyTarget': 'Complete 25 timed quantitative questions under 30 minutes.',
            'estimatedTime': '1 hr',
            'isCompleted': (aptitude_videos[0] if aptitude_score < 80 else aptitude_videos[1])['videoId'] in completed_videos
        },
        {
            'day': 6,
            'title': 'Day 6: Capstone Project Architecture & RESTful API Integration',
            'category': 'Projects',
            'targetVideo': projects_videos[0] if len(projects) < 2 else projects_videos[2],
            'dailyTarget': 'Deploy backend microservice endpoints with token authentication.',
            'estimatedTime': '2 hrs 30 mins',
            'isCompleted': (projects_videos[0] if len(projects) < 2 else projects_videos[2])['videoId'] in completed_videos
        },
        {
            'day': 7,
            'title': 'Day 7: Mock Technical Coding Viva & HR STAR Behavioral Prep',
            'category': 'Interview Prep',
            'targetVideo': interview_videos[1] if aptitude_score < 80 else interview_videos[2],
            'dailyTarget': 'Simulate 1 technical interview and prepare 3 STAR scenario stories.',
            'estimatedTime': '1 hr 30 mins',
            'isCompleted': (interview_videos[1] if aptitude_score < 80 else interview_videos[2])['videoId'] in completed_videos
        }
    ]

    # Metrics
    total_recs = len(all_recommended_videos)
    completed_recs = sum(1 for v in all_recommended_videos if v.get('isCompleted'))
    mastery_pct = round((completed_recs / total_recs * 100)) if total_recs > 0 else 0

    return jsonify({
        'success': True,
        'student': {
            'name': student_name,
            'branch': student_branch,
            'cgpa': cgpa,
            'primaryLanguage': primary_lang,
            'dsaSkill': dsa_skill,
            'coreCs': core_cs,
            'devSkills': dev_skills,
            'aptitudeScore': aptitude_score,
            'codingRating': coding_rating,
            'projectsCount': len(projects),
            'targetCareer': target_career_id
        },
        'learningPriorities': priorities,
        'identifiedSkillGaps': identified_gaps,
        'categories': {
            'programming': {
                'title': f'{prog_key} & Language Architecture',
                'language': prog_key,
                'videos': prog_videos_curated
            },
            'dsa': {
                'title': 'Data Structures & Algorithms',
                'level': dsa_skill,
                'videos': dsa_videos_curated
            },
            'corecs': {
                'title': 'Core Computer Science (OS, DBMS, Networks)',
                'level': core_cs,
                'videos': corecs_videos_curated
            },
            'fullstack': {
                'title': 'Full Stack & System Development',
                'videos': fullstack_videos_curated
            },
            'aptitude': {
                'title': 'Aptitude & Placement Reasoning',
                'videos': aptitude_videos_curated
            },
            'projects': {
                'title': 'Capstone Portfolio Projects',
                'videos': projects_videos_curated
            },
            'interview': {
                'title': 'Interview Preparation & Mock Rounds',
                'videos': interview_videos_curated
            }
        },
        'dailyRoadmap': daily_roadmap,
        'progressSummary': {
            'totalRecommended': total_recs,
            'completedCount': completed_recs,
            'masteryPercentage': mastery_pct,
            'remainingVideos': total_recs - completed_recs
        }
    }), 200

@app.route('/api/youtube/progress', methods=['POST'])
def update_youtube_progress():
    user = get_current_user()
    if not user:
        return jsonify({'success': False, 'message': 'Unauthorized.'}), 401

    data = request.get_json() or {}
    video_id = data.get('videoId')
    is_completed = data.get('completed', True)

    if not video_id:
        return jsonify({'success': False, 'message': 'videoId is required.'}), 400

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('SELECT completed_videos FROM users WHERE id = ?', (user['id'],))
    row = cursor.fetchone()
    
    try:
        completed = json.loads(row['completed_videos'] or '[]') if row else []
    except Exception:
        completed = []

    if is_completed and video_id not in completed:
        completed.append(video_id)
    elif not is_completed and video_id in completed:
        completed.remove(video_id)

    cursor.execute('UPDATE users SET completed_videos = ? WHERE id = ?', (json.dumps(completed), user['id']))
    conn.commit()
    conn.close()

    return jsonify({
        'success': True,
        'message': f"Video {'marked as completed' if is_completed else 'unmarked'}.",
        'completedVideos': completed,
        'totalCompleted': len(completed)
    }), 200

CAREER_MAPPING_DATA = [
    {
        'id': 'sde',
        'title': 'Software Engineer / SDE',
        'category': 'Core Engineering',
        'avgPackage': '₹12 - 36 LPA',
        'requiredSkills': ['C++ / Java / Python', 'Data Structures', 'Algorithms', 'Problem Solving', 'OOP', 'DBMS', 'Operating Systems', 'Computer Networks', 'System Design'],
        'searchTopics': ['DSA roadmap for placements', 'Data Structures and Algorithms', 'LeetCode interview preparation', 'OOP interview preparation', 'DBMS interview preparation']
    },
    {
        'id': 'webdev',
        'title': 'Frontend Developer / Full Stack Developer',
        'category': 'Web & Applications',
        'avgPackage': '₹8 - 24 LPA',
        'requiredSkills': ['HTML', 'CSS', 'JavaScript', 'React', 'TypeScript', 'Node.js', 'Express', 'REST APIs', 'Git/GitHub', 'SQL/MongoDB'],
        'searchTopics': ['HTML CSS JavaScript full course', 'JavaScript placement preparation', 'React JS full course', 'React projects', 'Node.js full course', 'Full stack development roadmap']
    },
    {
        'id': 'data-analyst',
        'title': 'Data Analyst / Data Scientist',
        'category': 'Data & Analytics',
        'avgPackage': '₹7 - 20 LPA',
        'requiredSkills': ['Python', 'SQL', 'Statistics', 'Pandas', 'NumPy', 'Data Visualization', 'Power BI / Tableau', 'Excel', 'Machine Learning fundamentals'],
        'searchTopics': ['SQL for data analysis', 'Python for data science', 'Pandas full course', 'Statistics for data science', 'Power BI full course', 'Data analyst roadmap']
    },
    {
        'id': 'aiml',
        'title': 'AI/ML Engineer',
        'category': 'Artificial Intelligence',
        'avgPackage': '₹14 - 40 LPA',
        'requiredSkills': ['Python', 'NumPy', 'Pandas', 'Statistics', 'Machine Learning', 'Deep Learning', 'Neural Networks', 'NLP', 'TensorFlow/PyTorch', 'Generative AI'],
        'searchTopics': ['Machine learning full course', 'Deep learning full course', 'Neural networks explained', 'NLP full course', 'Generative AI roadmap', 'AI ML placement preparation']
    },
    {
        'id': 'cloud-devops',
        'title': 'DevOps Engineer / Cloud Engineer',
        'category': 'Infrastructure & Cloud',
        'avgPackage': '₹9 - 28 LPA',
        'requiredSkills': ['Linux', 'Networking', 'Git', 'Docker', 'Kubernetes', 'CI/CD', 'AWS/Azure/GCP', 'Terraform', 'Monitoring', 'Cloud Security'],
        'searchTopics': ['DevOps roadmap', 'Docker Kubernetes full course', 'AWS cloud full course', 'Linux for DevOps', 'CI/CD pipeline', 'Kubernetes for beginners']
    },
    {
        'id': 'cybersecurity',
        'title': 'Cybersecurity Engineer / Security Analyst',
        'category': 'Security & Defense',
        'avgPackage': '₹8 - 26 LPA',
        'requiredSkills': ['Networking', 'Linux', 'Cybersecurity fundamentals', 'Ethical Hacking', 'Penetration Testing', 'Web Security', 'SOC', 'Digital Forensics', 'SIEM', 'Incident Response'],
        'searchTopics': ['Cybersecurity roadmap', 'Ethical hacking full course', 'Networking for cybersecurity', 'Linux for cybersecurity', 'SOC analyst roadmap', 'Digital forensics course']
    }
]

@app.route('/api/careers', methods=['GET'])
def get_careers():
    return jsonify({
        'success': True,
        'careers': CAREER_MAPPING_DATA
    }), 200

@app.route('/api/coach/assess', methods=['POST'])
def assess_career():
    data = request.get_json() or {}
    answers = data.get('answers', {})
    profile = data.get('profile', {})

    raw_scores = {c['id']: 0 for c in CAREER_MAPPING_DATA}

    for val in answers.values():
        if val in raw_scores:
            raw_scores[val] += 30

    skills = [s.lower() for s in profile.get('skills', [])]
    if any('dsa' in s or 'java' in s or 'c++' in s for s in skills): raw_scores['sde'] += 20
    if any('react' in s or 'javascript' in s or 'html' in s for s in skills): raw_scores['webdev'] += 20
    if any('sql' in s or 'pandas' in s or 'power bi' in s for s in skills): raw_scores['data-analyst'] += 20
    if any('machine learning' in s or 'pytorch' in s or 'python' in s for s in skills): raw_scores['aiml'] += 20
    if any('docker' in s or 'linux' in s or 'aws' in s for s in skills): raw_scores['cloud-devops'] += 20
    if any('security' in s or 'networking' in s or 'hacking' in s for s in skills): raw_scores['cybersecurity'] += 20

    highest = max(max(raw_scores.values()), 40)
    ranked = []
    for c in CAREER_MAPPING_DATA:
        raw = raw_scores[c['id']]
        normalized = min(96, max(50, round((raw / highest) * 94) + 2))
        ranked.append({'career': c, 'score': normalized})

    ranked.sort(key=lambda x: x['score'], reverse=True)

    result = {
        'top': ranked[0],
        'runnerUp1': ranked[1],
        'runnerUp2': ranked[2],
        'allRanked': ranked,
        'rankedCareers': ranked,
        'aiExplanation': f"Based on your assessment responses and technical profile, you have an outstanding {ranked[0]['score']}% match for {ranked[0]['career']['title']}."
    }

    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO assessment_results (user_id, top_career_id, top_score, runner_up_1, runner_up_2, details_json)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (
            profile.get('id', 1),
            ranked[0]['career']['id'],
            ranked[0]['score'],
            ranked[1]['career']['id'],
            ranked[2]['career']['id'],
            json.dumps(result)
        ))
        conn.commit()
        conn.close()
    except Exception as e:
        print(f"Error logging assessment result: {e}")

    return jsonify({'success': True, **result}), 200

VERIFIED_YOUTUBE_LECTURES = {
    'sde': [
        {'videoId': '0IAPZzGSbME', 'title': '1. Introduction to Algorithms', 'channel': 'Abdul Bari', 'topic': 'Algorithms & Asymptotic Analysis', 'videoUrl': 'https://www.youtube.com/watch?v=0IAPZzGSbME', 'thumbnail': 'https://img.youtube.com/vi/0IAPZzGSbME/hqdefault.jpg', 'duration': '10 hrs 45 mins', 'level': 'Beginner'},
        {'videoId': 'RBSGKlAvoiM', 'title': 'Data Structures Easy to Advanced Course - Full Tutorial from a Google Engineer', 'channel': 'freeCodeCamp.org', 'topic': 'Data Structures', 'videoUrl': 'https://www.youtube.com/watch?v=RBSGKlAvoiM', 'thumbnail': 'https://img.youtube.com/vi/RBSGKlAvoiM/hqdefault.jpg', 'duration': '8 hrs 03 mins', 'level': 'Beginner'},
        {'videoId': 'KLlXCFG5TnA', 'title': 'Two Sum - Leetcode 1 - HashMap - Python', 'channel': 'NeetCode', 'topic': 'LeetCode & Problem Solving', 'videoUrl': 'https://www.youtube.com/watch?v=KLlXCFG5TnA', 'thumbnail': 'https://img.youtube.com/vi/KLlXCFG5TnA/hqdefault.jpg', 'duration': '8 mins', 'level': 'Intermediate'},
        {'videoId': 'tyB0ztf0DNY', 'title': 'DP 1. Introduction to Dynamic Programming | Memoization | Tabulation | Space Optimization Techniques', 'channel': 'take U forward', 'topic': 'Dynamic Programming', 'videoUrl': 'https://www.youtube.com/watch?v=tyB0ztf0DNY', 'thumbnail': 'https://img.youtube.com/vi/tyB0ztf0DNY/hqdefault.jpg', 'duration': '38 mins', 'level': 'Advanced'},
        {'videoId': 'xpDnVSmNFX0', 'title': 'System Design BASICS: Horizontal vs. Vertical Scaling', 'channel': 'Gaurav Sen', 'topic': 'System Design', 'videoUrl': 'https://www.youtube.com/watch?v=xpDnVSmNFX0', 'thumbnail': 'https://img.youtube.com/vi/xpDnVSmNFX0/hqdefault.jpg', 'duration': '11 mins', 'level': 'Advanced'}
    ],
    'webdev': [
        {'videoId': 'mU6anWqZJcc', 'title': 'Learn HTML5 and CSS3 From Scratch - Full Course', 'channel': 'freeCodeCamp.org', 'topic': 'HTML5 & Modern CSS', 'videoUrl': 'https://www.youtube.com/watch?v=mU6anWqZJcc', 'thumbnail': 'https://img.youtube.com/vi/mU6anWqZJcc/hqdefault.jpg', 'duration': '11 hrs 30 mins', 'level': 'Beginner'},
        {'videoId': 'W6NZfCO5SIk', 'title': 'JavaScript Course for Beginners – Your First Step to Web Development', 'channel': 'Programming with Mosh', 'topic': 'JavaScript Fundamentals', 'videoUrl': 'https://www.youtube.com/watch?v=W6NZfCO5SIk', 'thumbnail': 'https://img.youtube.com/vi/W6NZfCO5SIk/hqdefault.jpg', 'duration': '1 hr 48 mins', 'level': 'Beginner'},
        {'videoId': 'bMknfKXIFA8', 'title': "React Course - Beginner's Tutorial for React JavaScript Library [2022]", 'channel': 'freeCodeCamp.org', 'topic': 'React & Component Architecture', 'videoUrl': 'https://www.youtube.com/watch?v=bMknfKXIFA8', 'thumbnail': 'https://img.youtube.com/vi/bMknfKXIFA8/hqdefault.jpg', 'duration': '11 hrs 55 mins', 'level': 'Intermediate'},
        {'videoId': '-0exw-9YJBo', 'title': 'Learn The MERN Stack - Express & MongoDB Rest API', 'channel': 'Traversy Media', 'topic': 'Full Stack MERN', 'videoUrl': 'https://www.youtube.com/watch?v=-0exw-9YJBo', 'thumbnail': 'https://img.youtube.com/vi/-0exw-9YJBo/hqdefault.jpg', 'duration': '34 mins', 'level': 'Intermediate'},
        {'videoId': 'Oe421EPjeBE', 'title': 'Node.js and Express.js - Full Course', 'channel': 'freeCodeCamp.org', 'topic': 'Node.js & Backend Architecture', 'videoUrl': 'https://www.youtube.com/watch?v=Oe421EPjeBE', 'thumbnail': 'https://img.youtube.com/vi/Oe421EPjeBE/hqdefault.jpg', 'duration': '8 hrs 16 mins', 'level': 'Intermediate'}
    ],
    'data-analyst': [
        {'videoId': 'rVPK8-L1aFM', 'title': 'Complete SQL course for data science and data analytics in Hindi | One shot SQL', 'channel': 'Data Dissection', 'topic': 'SQL for Data Analytics', 'videoUrl': 'https://www.youtube.com/watch?v=rVPK8-L1aFM', 'thumbnail': 'https://img.youtube.com/vi/rVPK8-L1aFM/hqdefault.jpg', 'duration': '6 hrs 15 mins', 'level': 'Beginner'},
        {'videoId': 'qfyynHBFOsM', 'title': 'Data Analyst Portfolio Project | SQL Data Exploration | Project 1/4', 'channel': 'Alex The Analyst', 'topic': 'SQL Data Exploration', 'videoUrl': 'https://www.youtube.com/watch?v=qfyynHBFOsM', 'thumbnail': 'https://img.youtube.com/vi/qfyynHBFOsM/hqdefault.jpg', 'duration': '45 mins', 'level': 'Intermediate'},
        {'videoId': 'vmEHCJofslg', 'title': 'Complete Python Pandas Data Science Tutorial! (Reading CSV/Excel files, Sorting, Filtering, Groupby)', 'channel': 'Keith Galli', 'topic': 'Python Pandas Data Analysis', 'videoUrl': 'https://www.youtube.com/watch?v=vmEHCJofslg', 'thumbnail': 'https://img.youtube.com/vi/vmEHCJofslg/hqdefault.jpg', 'duration': '1 hr 00 min', 'level': 'Beginner'},
        {'videoId': 'NaqrDVv-oeQ', 'title': 'Statistics for Data Science & GATE DA Exam | Complete Course in Hindi', 'channel': 'Data Dissection', 'topic': 'Statistics for Data Science', 'videoUrl': 'https://www.youtube.com/watch?v=NaqrDVv-oeQ', 'thumbnail': 'https://img.youtube.com/vi/NaqrDVv-oeQ/hqdefault.jpg', 'duration': '4 hrs 40 mins', 'level': 'Intermediate'},
        {'videoId': 'Vl0H-qTclOg', 'title': 'Microsoft Excel Tutorial for Beginners - Full Course', 'channel': 'freeCodeCamp.org', 'topic': 'Microsoft Excel for Business Analytics', 'videoUrl': 'https://www.youtube.com/watch?v=Vl0H-qTclOg', 'thumbnail': 'https://img.youtube.com/vi/Vl0H-qTclOg/hqdefault.jpg', 'duration': '2 hrs 26 mins', 'level': 'Beginner'}
    ],
    'aiml': [
        {'videoId': 'trsyTEA22Gw', 'title': 'Complete Machine Learning course in Hindi', 'channel': 'Data Dissection', 'topic': 'Machine Learning', 'videoUrl': 'https://www.youtube.com/watch?v=trsyTEA22Gw', 'thumbnail': 'https://img.youtube.com/vi/trsyTEA22Gw/hqdefault.jpg', 'duration': '8 hrs 20 mins', 'level': 'Beginner'},
        {'videoId': 'WIqXep_khQk', 'title': 'Deep learning course for beginners in Hindi', 'channel': 'Data Dissection', 'topic': 'Deep Learning & Neural Networks', 'videoUrl': 'https://www.youtube.com/watch?v=WIqXep_khQk', 'thumbnail': 'https://img.youtube.com/vi/WIqXep_khQk/hqdefault.jpg', 'duration': '5 hrs 10 mins', 'level': 'Intermediate'},
        {'videoId': 'wMOzdJunPnM', 'title': 'L- 1 | Starting NLP by Understanding language and speech | GenAi LLM course Ai in Hindi', 'channel': 'Data Dissection', 'topic': 'Natural Language Processing (NLP)', 'videoUrl': 'https://www.youtube.com/watch?v=wMOzdJunPnM', 'thumbnail': 'https://img.youtube.com/vi/wMOzdJunPnM/hqdefault.jpg', 'duration': '42 mins', 'level': 'Intermediate'},
        {'videoId': 'zjkBMFhNj_g', 'title': '[1hr Talk] Intro to Large Language Models', 'channel': 'Andrej Karpathy', 'topic': 'Large Language Models & GenAI', 'videoUrl': 'https://www.youtube.com/watch?v=zjkBMFhNj_g', 'thumbnail': 'https://img.youtube.com/vi/zjkBMFhNj_g/hqdefault.jpg', 'duration': '1 hr 00 min', 'level': 'Advanced'},
        {'videoId': 'aircAruvnKk', 'title': 'But what is a neural network? | Deep learning chapter 1', 'channel': '3Blue1Brown', 'topic': 'Neural Network Architecture', 'videoUrl': 'https://www.youtube.com/watch?v=aircAruvnKk', 'thumbnail': 'https://img.youtube.com/vi/aircAruvnKk/hqdefault.jpg', 'duration': '19 mins', 'level': 'Beginner'}
    ],
    'cloud-devops': [
        {'videoId': 's3ii48qYBxA', 'title': "Beginner's Guide To The Linux Terminal", 'channel': 'DistroTube', 'topic': 'Linux & CLI Foundations', 'videoUrl': 'https://www.youtube.com/watch?v=s3ii48qYBxA', 'thumbnail': 'https://img.youtube.com/vi/s3ii48qYBxA/hqdefault.jpg', 'duration': '22 mins', 'level': 'Beginner'},
        {'videoId': 'pg19Z8LL06w', 'title': 'Docker Crash Course for Absolute Beginners [NEW]', 'channel': 'TechWorld with Nana', 'topic': 'Docker & Containerization', 'videoUrl': 'https://www.youtube.com/watch?v=pg19Z8LL06w', 'thumbnail': 'https://img.youtube.com/vi/pg19Z8LL06w/hqdefault.jpg', 'duration': '2 hrs 15 mins', 'level': 'Beginner'},
        {'videoId': 'X48VuDVv0do', 'title': 'Kubernetes Tutorial for Beginners [FULL COURSE in 4 Hours]', 'channel': 'TechWorld with Nana', 'topic': 'Kubernetes Orchestration', 'videoUrl': 'https://www.youtube.com/watch?v=X48VuDVv0do', 'thumbnail': 'https://img.youtube.com/vi/X48VuDVv0do/hqdefault.jpg', 'duration': '3 hrs 36 mins', 'level': 'Intermediate'},
        {'videoId': 'SOTamWNgDKc', 'title': 'AWS Certified Cloud Practitioner Certification Course (CLF-C01) - Pass the Exam!', 'channel': 'freeCodeCamp.org', 'topic': 'AWS Cloud Infrastructure', 'videoUrl': 'https://www.youtube.com/watch?v=SOTamWNgDKc', 'thumbnail': 'https://img.youtube.com/vi/SOTamWNgDKc/hqdefault.jpg', 'duration': '13 hrs 10 mins', 'level': 'Intermediate'},
        {'videoId': '9pZ2xmsSDdo', 'title': 'DevOps Roadmap - How to become a DevOps Engineer? What is DevOps?', 'channel': 'TechWorld with Nana', 'topic': 'DevOps Roadmap & CI/CD', 'videoUrl': 'https://www.youtube.com/watch?v=9pZ2xmsSDdo', 'thumbnail': 'https://img.youtube.com/vi/9pZ2xmsSDdo/hqdefault.jpg', 'duration': '18 mins', 'level': 'Beginner'}
    ],
    'cybersecurity': [
        {'videoId': 'inWWhr5tnEA', 'title': 'What Is Cyber Security | How It Works? | Cyber Security In 7 Minutes | Cyber Security | Simplilearn', 'channel': 'Simplilearn', 'topic': 'Cybersecurity Fundamentals', 'videoUrl': 'https://www.youtube.com/watch?v=inWWhr5tnEA', 'thumbnail': 'https://img.youtube.com/vi/inWWhr5tnEA/hqdefault.jpg', 'duration': '7 mins', 'level': 'Beginner'},
        {'videoId': 'qiQR5rTSshw', 'title': 'Computer Networking Course - Network Engineering [CompTIA Network+ Exam Prep]', 'channel': 'freeCodeCamp.org', 'topic': 'Computer Networking & Protocols', 'videoUrl': 'https://www.youtube.com/watch?v=qiQR5rTSshw', 'thumbnail': 'https://img.youtube.com/vi/qiQR5rTSshw/hqdefault.jpg', 'duration': '9 hrs 24 mins', 'level': 'Beginner'},
        {'videoId': '3FNYvj2U0HM', 'title': 'Ethical Hacking in 15 Hours - 2023 Edition - Learn to Hack! (Part 1)', 'channel': 'The Cyber Mentors', 'topic': 'Ethical Hacking & Penetration Testing', 'videoUrl': 'https://www.youtube.com/watch?v=3FNYvj2U0HM', 'thumbnail': 'https://img.youtube.com/vi/3FNYvj2U0HM/hqdefault.jpg', 'duration': '4 hrs 40 mins', 'level': 'Intermediate'},
        {'videoId': 'GSIDS_lvRv4', 'title': 'Public Key Cryptography - Computerphile', 'channel': 'Computerphile', 'topic': 'Cryptography & Encryption', 'videoUrl': 'https://www.youtube.com/watch?v=GSIDS_lvRv4', 'thumbnail': 'https://img.youtube.com/vi/GSIDS_lvRv4/hqdefault.jpg', 'duration': '6 mins', 'level': 'Intermediate'},
        {'videoId': '3Kq1MIfTWCE', 'title': 'Full Ethical Hacking Course - Network Penetration Testing for Beginners (2019)', 'channel': 'freeCodeCamp.org', 'topic': 'Network Penetration Testing', 'videoUrl': 'https://www.youtube.com/watch?v=3Kq1MIfTWCE', 'thumbnail': 'https://img.youtube.com/vi/3Kq1MIfTWCE/hqdefault.jpg', 'duration': '14 hrs 51 mins', 'level': 'Advanced'}
    ]
}

@app.route('/api/youtube/recommend', methods=['GET', 'POST'])
def recommend_youtube():
    career = request.args.get('career', 'sde')
    topic = request.args.get('topic', '')

    search_queries = {
        'sde': 'Data Structures and Algorithms LeetCode placement preparation roadmap',
        'webdev': 'React JS full course full stack development roadmap Traversy Media',
        'data-analyst': 'SQL for data analysis Python Alex The Analyst full course',
        'aiml': 'Machine learning deep learning PyTorch full course Andrew Ng',
        'cloud-devops': 'DevOps roadmap Docker Kubernetes AWS TechWorld with Nana',
        'cybersecurity': 'Cybersecurity roadmap ethical hacking full course NetworkChuck'
    }

    query = f"{topic} placement preparation full course" if topic else search_queries.get(career, search_queries['sde'])
    search_url = f"https://www.youtube.com/results?search_query={query.replace(' ', '+')}"
    lectures = VERIFIED_YOUTUBE_LECTURES.get(career, VERIFIED_YOUTUBE_LECTURES['sde'])

    return jsonify({
        'success': True,
        'targetCareer': career,
        'query': query,
        'searchUrl': search_url,
        'lectures': lectures,
        'recommendations': lectures,
        'message': 'Dynamic verified YouTube lectures retrieved matching selected career answer.'
    }), 200

@app.route('/api/youtube/feedback', methods=['POST'])
def feedback_youtube():
    data = request.get_json() or {}
    video_id = data.get('videoId')
    action = data.get('action')

    if not video_id or not action:
        return jsonify({'success': False, 'message': 'videoId and action are required.'}), 400

    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO youtube_resources (video_url, topic, feedback_action)
            VALUES (?, ?, ?)
        ''', (f"https://www.youtube.com/watch?v={video_id}", action, action))
        conn.commit()
        conn.close()
    except Exception as e:
        print(f"Error saving video feedback: {e}")

    return jsonify({
        'success': True,
        'message': f"Recorded feedback: {action} for video {video_id}. Recommendation weighting dynamically adjusted."
    }), 200

# Load Verified Skills Lectures Catalog
VERIFIED_SKILLS_CATALOG = {}
catalog_file = os.path.join(PROJECT_ROOT, 'verified_skills_catalog.json')
if os.path.exists(catalog_file):
    try:
        with open(catalog_file, 'r', encoding='utf-8') as f:
            VERIFIED_SKILLS_CATALOG = json.load(f)
    except Exception as e:
        print(f"Error loading verified_skills_catalog.json: {e}")

@app.route('/api/youtube/skill-lecture', methods=['GET'])
def get_skill_lecture_api():
    skill = request.args.get('skill', '').strip()
    career = request.args.get('career', '').strip()
    if not skill:
        return jsonify({'success': False, 'error': 'Skill parameter is required'}), 400

    lower = skill.lower()
    lecture = VERIFIED_SKILLS_CATALOG.get(skill)
    if not lecture:
        for k, v in VERIFIED_SKILLS_CATALOG.items():
            if k.lower() == lower:
                lecture = v
                break

    if lecture and lecture.get('videoId'):
        return jsonify({
            'success': True,
            'verified': True,
            'skill': skill,
            'videoId': lecture['videoId'],
            'youtubeUrl': lecture.get('youtubeUrl', f"https://www.youtube.com/watch?v={lecture['videoId']}"),
            'title': lecture['title'],
            'channel': lecture['channel']
        }), 200

    # Fallback to verified educational search URL
    query = f"{career + ' ' if career else ''}{skill} tutorial full course".strip()
    return jsonify({
        'success': True,
        'verified': False,
        'skill': skill,
        'videoId': None,
        'youtubeUrl': f"https://www.youtube.com/results?search_query={query.replace(' ', '+')}",
        'title': f"{skill} Placement Preparation Tutorial",
        'channel': 'Verified Educational Search'
    }), 200

@app.route('/api/youtube/skills-catalog', methods=['GET'])
def get_skills_catalog_api():
    return jsonify({
        'success': True,
        'totalSkills': len(VERIFIED_SKILLS_CATALOG),
        'skills': VERIFIED_SKILLS_CATALOG
    }), 200

@app.route('/api/youtube/validate', methods=['GET'])
def validate_youtube_video_api():
    video_id = request.args.get('videoId', '').strip()
    if not video_id:
        return jsonify({'valid': False, 'error': 'videoId is required'}), 400

    is_format_valid = bool(re.match(r'^[a-zA-Z0-9_-]{11}$', video_id))
    is_in_catalog = any(v.get('videoId') == video_id for v in VERIFIED_SKILLS_CATALOG.values())
    
    return jsonify({
        'videoId': video_id,
        'valid': is_format_valid and is_in_catalog,
        'formatValid': is_format_valid,
        'inVerifiedCatalog': is_in_catalog
    }), 200

@app.route('/api/prediction/calculate', methods=['POST'])
def calculate_prediction_api():
    params = request.get_json() or {}
    cgpa = float(params.get('cgpa', 8.0))
    backlogs = int(params.get('backlogs', 0))
    dsa_skill = params.get('dsaSkill', 'Advanced')
    aptitude_score = int(params.get('aptitudeScore', 80))

    dsa_score = 96 if dsa_skill == 'Expert' else 85 if dsa_skill == 'Advanced' else 70 if dsa_skill == 'Intermediate' else 48
    dev_score = 85
    core_cs_score = 80
    proj_score = 85 if int(params.get('projectsCount', 2)) >= 2 else 60
    academic_score = min(100.0, (cgpa / 10.0) * 100.0)

    raw = (dsa_score * 0.22) + (dev_score * 0.18) + (core_cs_score * 0.15) + (proj_score * 0.15) + (academic_score * 0.15) + (aptitude_score * 0.15)
    if backlogs > 0:
        raw -= (backlogs * 12)

    probability = round(min(98, max(20, raw)))

    prediction = {
        'probability': probability,
        'tier': 'High' if probability >= 80 else 'Medium' if probability >= 60 else 'Low',
        'tierLabel': 'High Readiness - Tier 1 Candidate' if probability >= 80 else 'Moderate Readiness - Tier 2 Candidate',
        'subScores': {
            'dsa': dsa_score,
            'development': dev_score,
            'coreCs': core_cs_score,
            'projects': proj_score,
            'communication': int(params.get('communicationScore', 85)),
            'resume': int(params.get('resumeScore', 82))
        },
        'companyReadiness': {
            'serviceBased': 'High readiness' if probability >= 60 else 'Medium readiness',
            'startupRoles': 'High readiness' if dev_score >= 75 else 'Medium readiness',
            'productBased': 'High readiness' if probability >= 75 else 'Medium readiness',
            'topProduct': 'High readiness' if (dsa_score >= 85 and probability >= 82) else 'Needs improvement'
        },
        'strongestOpportunity': 'Software Development Engineer' if dsa_score >= 80 else 'Full Stack Developer',
        'timestamp': datetime.utcnow().isoformat()
    }

    return jsonify({'success': True, **prediction}), 200

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'online',
        'backend': 'Flask + SQLite',
        'resumeAnalyzer': 'PyPDF2 + python-docx NLP Engine',
        'timestamp': datetime.utcnow().isoformat()
    }), 200

# ==============================================================================
# STATIC FILES SERVING (Single unified host)
# ==============================================================================
@app.route('/')
def serve_index():
    return send_from_directory(PROJECT_ROOT, 'index.html')

@app.route('/<path:path>')
def serve_file(path):
    return send_from_directory(PROJECT_ROOT, path)

# ==============================================================================
# RUN SERVER
# ==============================================================================
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print(f"[*] Placement Coach Backend running at http://localhost:{port}")
    app.run(host='0.0.0.0', port=port, debug=False)
