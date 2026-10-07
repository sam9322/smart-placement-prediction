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

if os.environ.get('VERCEL'):
    import shutil
    DB_PATH = '/tmp/database.db'
    bundled_db = os.path.join(BASE_DIR, 'database.db')
    if not os.path.exists(DB_PATH) and os.path.exists(bundled_db):
        try:
            shutil.copyfile(bundled_db, DB_PATH)
        except Exception:
            pass
else:
    DB_PATH = os.path.join(BASE_DIR, 'database.db')

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
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

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

    # Prediction History Table
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
        ('interview_history', "TEXT DEFAULT '{}'")
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
            target_career_id = 'sde',
            target_career_title = 'Software Development Engineer',
            roadmap_state = ?,
            interview_history = ?
        WHERE email LIKE '%samiksha%'
    """, (sam_roadmap, sam_interview))

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
            target_career_id = 'webdev',
            target_career_title = 'Full Stack Web Developer',
            roadmap_state = ?,
            interview_history = ?
        WHERE email LIKE '%jyoti%'
    """, (jyo_roadmap, jyo_interview))

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

    # Provide camelCase aliases for seamless frontend compatibility
    d['fullName'] = d.get('fullname', '')
    d['phone'] = d.get('phone', '+91 98765 00000')
    d['rollNumber'] = d.get('roll_number', '')
    d['gradYear'] = d.get('grad_year', '')
    d['tenthMarks'] = d.get('tenth_marks', 0)
    d['twelfthMarks'] = d.get('twelfth_marks', 0)
    d['aptitudeScore'] = d.get('aptitude_score', 80)
    d['codingRating'] = d.get('coding_rating', 1600)
    d['targetCareerId'] = d.get('target_career_id', 'sde')
    d['targetCareerTitle'] = d.get('target_career_title', '')
    return d

# ==============================================================================
# AUTHENTICATION ENDPOINTS
# ==============================================================================
@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    fullname = data.get('fullName', '').strip()
    email = data.get('email', '').strip().lower()
    password = data.get('password', '').strip()

    if not fullname or not email or not password:
        return jsonify({'success': False, 'message': 'Full name, email, and password are required.'}), 400

    if len(password) < 6:
        return jsonify({'success': False, 'message': 'Password must be at least 6 characters long.'}), 400

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute('SELECT id FROM users WHERE email = ?', (email,))
    if cursor.fetchone():
        conn.close()
        return jsonify({'success': False, 'message': 'An account with this email already exists.'}), 409

    hashed_pw = generate_password_hash(password, method='pbkdf2:sha256')
    branch = data.get('branch', 'Computer Science & Engineering')
    roll = data.get('rollNumber', f'CS{secrets.token_hex(2).upper()}')
    cgpa = float(data.get('cgpa', 8.0))

    cursor.execute('''
        INSERT INTO users (fullname, email, password_hash, branch, roll_number, cgpa)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', (fullname, email, hashed_pw, branch, roll, cgpa))
    user_id = cursor.lastrowid

    # Create auth token
    token = secrets.token_hex(32)
    cursor.execute('INSERT INTO tokens (token, user_id) VALUES (?, ?)', (token, user_id))
    conn.commit()

    cursor.execute('SELECT * FROM users WHERE id = ?', (user_id,))
    user_row = cursor.fetchone()
    conn.close()

    return jsonify({
        'success': True,
        'message': 'Account created successfully!',
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

    # Flexible matching for usernames
    if 'samiksha' in email:
        email = 'samiksha@engg.edu'
    elif 'jyoti' in email:
        email = 'jyoti@engg.edu'
    elif 'aarav' in email:
        email = 'aarav.patel@engg.edu'

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM users WHERE email = ?', (email,))
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
@app.route('/api/user/profile', methods=['PUT'])
def update_profile():
    user = get_current_user()
    if not user:
        return jsonify({'success': False, 'message': 'Unauthorized.'}), 401

    data = request.get_json() or {}
    conn = get_db()
    cursor = conn.cursor()

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
            target_career_id = COALESCE(?, target_career_id),
            target_career_title = COALESCE(?, target_career_title),
            skills = COALESCE(?, skills),
            certifications = COALESCE(?, certifications),
            projects = COALESCE(?, projects),
            internships = COALESCE(?, internships),
            roadmap_state = COALESCE(?, roadmap_state),
            interview_history = COALESCE(?, interview_history)
        WHERE id = ?
    ''', (
        data.get('fullName'),
        data.get('phone'),
        data.get('college'),
        data.get('degree'),
        data.get('branch'),
        data.get('gradYear'),
        data.get('rollNumber'),
        data.get('cgpa'),
        data.get('tenthMarks'),
        data.get('twelfthMarks'),
        data.get('backlogs'),
        data.get('aptitudeScore'),
        data.get('codingRating'),
        data.get('targetCareerId'),
        data.get('targetCareerTitle'),
        json.dumps(data.get('skills')) if 'skills' in data else None,
        json.dumps(data.get('certifications')) if 'certifications' in data else None,
        json.dumps(data.get('projects')) if 'projects' in data else None,
        json.dumps(data.get('internships')) if 'internships' in data else None,
        json.dumps(data.get('roadmapState')) if 'roadmapState' in data else None,
        json.dumps(data.get('interviewHistory')) if 'interviewHistory' in data else None,
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
        'data': analysis
    }), 200

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
