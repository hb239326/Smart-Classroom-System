from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
import jwt
import hashlib
import sqlite3
from datetime import datetime, timedelta
import re

app = Flask(__name__)
app.secret_key = 'your-secret-key-here-change-in-production'
CORS(app)

# Database configuration
DATABASE = 'smart_classroom.db'

def init_db():
    """Initialize database with required tables"""
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    
    # Create users table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            phone TEXT NOT NULL,
            password TEXT NOT NULL,
            role TEXT NOT NULL CHECK(role IN ('admin', 'teacher', 'student')),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Create sessions table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS sessions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            token TEXT UNIQUE NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')
    
    conn.commit()
    conn.close()

def hash_password(password):
    """Hash password using SHA-256"""
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(password, hashed):
    """Verify password against hash"""
    return hashlib.sha256(password.encode()).hexdigest() == hashed

def validate_email(email):
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_phone(phone):
    """Validate phone number"""
    pattern = r'^[\d\s\-\+\(\)]+$'
    return re.match(pattern, phone) and len(re.sub(r'[^\d]', '', phone)) >= 10

def generate_token(user_id):
    """Generate JWT token"""
    payload = {
        'user_id': user_id,
        'exp': datetime.utcnow() + timedelta(hours=24),
        'iat': datetime.utcnow()
    }
    return jwt.encode(payload, app.secret_key, algorithm='HS256')

def verify_token(token):
    """Verify JWT token"""
    try:
        payload = jwt.decode(token, app.secret_key, algorithms=['HS256'])
        return payload['user_id']
    except:
        return None

def create_admin():
    """Create default admin user if not exists"""
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    
    cursor.execute('SELECT * FROM users WHERE email = ?', ('admin@smartclass.com',))
    if not cursor.fetchone():
        admin_password = hash_password('admin123')
        cursor.execute('''
            INSERT INTO users (name, email, phone, password, role)
            VALUES (?, ?, ?, ?, ?)
        ''', ('System Administrator', 'admin@smartclass.com', '0000000000', admin_password, 'admin'))
        conn.commit()
    
    conn.close()

def get_user_by_id(user_id):
    """Get user by ID"""
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    
    cursor.execute('SELECT id, name, email, role FROM users WHERE id = ?', (user_id,))
    user = cursor.fetchone()
    
    conn.close()
    
    if user:
        return {
            'id': user[0],
            'name': user[1],
            'email': user[2],
            'role': user[3]
        }
    return None

# Health Check API
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'running',
        'timestamp': datetime.now().isoformat(),
        'database': 'connected',
        'server': 'Smart Classroom API'
    })

# Registration API
@app.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['name', 'email', 'phone', 'password', 'confirm_password', 'user_type']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'success': False, 'message': f'{field.replace("_", " ").title()} is required'}), 400
        
        # Validate user type
        if data['user_type'] not in ['student', 'teacher']:
            return jsonify({'success': False, 'message': 'Invalid user type for registration'}), 400
        
        # Validate email format
        if not validate_email(data['email']):
            return jsonify({'success': False, 'message': 'Invalid email format'}), 400
        
        # Validate phone
        if not validate_phone(data['phone']):
            return jsonify({'success': False, 'message': 'Invalid phone number format'}), 400
        
        # Validate password length
        if len(data['password']) < 6:
            return jsonify({'success': False, 'message': 'Password must be at least 6 characters long'}), 400
        
        # Validate password match
        if data['password'] != data['confirm_password']:
            return jsonify({'success': False, 'message': 'Passwords do not match'}), 400
        
        # Check if email already exists
        conn = sqlite3.connect(DATABASE)
        cursor = conn.cursor()
        
        cursor.execute('SELECT id FROM users WHERE email = ?', (data['email'],))
        if cursor.fetchone():
            conn.close()
            return jsonify({'success': False, 'message': 'Email already exists'}), 400
        
        # Create new user
        hashed_password = hash_password(data['password'])
        cursor.execute('''
            INSERT INTO users (name, email, phone, password, role)
            VALUES (?, ?, ?, ?, ?)
        ''', (data['name'], data['email'], data['phone'], hashed_password, data['user_type']))
        
        user_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        return jsonify({
            'success': True, 
            'message': 'Registration successful',
            'user_id': user_id
        }), 201
        
    except Exception as e:
        return jsonify({'success': False, 'message': f'Registration failed: {str(e)}'}), 500

# Login API
@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data.get('email'):
            return jsonify({'success': False, 'message': 'Email is required'}), 400
        if not data.get('password'):
            return jsonify({'success': False, 'message': 'Password is required'}), 400
        if not data.get('user_type'):
            return jsonify({'success': False, 'message': 'User type is required'}), 400
        
        # Validate user type
        if data['user_type'] not in ['admin', 'teacher', 'student']:
            return jsonify({'success': False, 'message': 'Invalid user type'}), 400
        
        # Find user
        conn = sqlite3.connect(DATABASE)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT id, name, email, password, role 
            FROM users 
            WHERE email = ? AND role = ?
        ''', (data['email'], data['user_type']))
        
        user = cursor.fetchone()
        conn.close()
        
        if not user:
            return jsonify({'success': False, 'message': 'Invalid credentials'}), 401
        
        # Verify password
        if not verify_password(data['password'], user[3]):
            return jsonify({'success': False, 'message': 'Invalid credentials'}), 401
        
        # Generate token
        token = generate_token(user[0])
        
        # Store session
        conn = sqlite3.connect(DATABASE)
        cursor = conn.cursor()
        cursor.execute('INSERT INTO sessions (user_id, token) VALUES (?, ?)', (user[0], token))
        conn.commit()
        conn.close()
        
        # Return response
        return jsonify({
            'success': True,
            'message': 'Login successful',
            'token': token,
            'user': {
                'id': user[0],
                'name': user[1],
                'email': user[2],
                'role': user[4]
            }
        })
        
    except Exception as e:
        return jsonify({'success': False, 'message': f'Login failed: {str(e)}'}), 500

# Dashboard APIs
@app.route('/student/dashboard', methods=['GET'])
def student_dashboard():
    try:
        token = request.headers.get('Authorization')
        if not token or not token.startswith('Bearer '):
            return jsonify({'success': False, 'message': 'Authorization required'}), 401
        
        token = token.replace('Bearer ', '')
        user_id = verify_token(token)
        
        if not user_id:
            return jsonify({'success': False, 'message': 'Invalid token'}), 401
        
        user = get_user_by_id(user_id)
        if not user or user['role'] != 'student':
            return jsonify({'success': False, 'message': 'Access denied'}), 403
        
        # Mock student data
        student_data = {
            'student': {
                'name': user['name'],
                'email': user['email'],
                'totalClasses': 6,
                'attendanceRate': '92%',
                'pendingAssignments': 3,
                'averageGrade': 'B+',
                'upcomingTests': 2,
                'notifications': 5
            },
            'schedule': [
                {'time': '8:00-9:30', 'subject': 'Mathematics', 'teacher': 'Mr. Smith'},
                {'time': '10:00-11:30', 'subject': 'Physics', 'teacher': 'Dr. Johnson'},
                {'time': '12:00-1:30', 'subject': 'Chemistry', 'teacher': 'Ms. Davis'}
            ],
            'assignments': [
                {'title': 'Math Homework', 'dueDate': '2024-01-25', 'status': 'pending'},
                {'title': 'Physics Lab Report', 'dueDate': '2024-01-26', 'status': 'pending'},
                {'title': 'Chemistry Quiz', 'dueDate': '2024-01-24', 'status': 'submitted'}
            ]
        }
        
        return jsonify({'success': True, 'data': student_data})
        
    except Exception as e:
        return jsonify({'success': False, 'message': f'Dashboard error: {str(e)}'}), 500

@app.route('/teacher/dashboard', methods=['GET'])
def teacher_dashboard():
    try:
        token = request.headers.get('Authorization')
        if not token or not token.startswith('Bearer '):
            return jsonify({'success': False, 'message': 'Authorization required'}), 401
        
        token = token.replace('Bearer ', '')
        user_id = verify_token(token)
        
        if not user_id:
            return jsonify({'success': False, 'message': 'Invalid invalid token'}), 401
        
        user = get_user_by_id(user_id)
        if not user or user['role'] != 'teacher':
            return jsonify({'success': False, 'message': 'Access denied'}), 403
        
        # Mock teacher data
        teacher_data = {
            'teacher': {
                'name': user['name'],
                'email': user['email'],
                'totalStudents': 45,
                'totalClasses': 8,
                'pendingGrading': 12,
                'averageRating': '4.5'
            },
            'schedule': [
                {'time': '8:00-9:30', 'class': 'Grade 10A', 'subject': 'Mathematics'},
                {'time': '10:00-11:30', 'class': 'Grade 10B', 'subject': 'Mathematics'},
                {'time': '12:00-1:30', 'class': 'Grade 11A', 'subject': 'Physics'}
            ],
            'tasks': [
                {'title': 'Grade Assignments', 'count': 12, 'priority': 'high'},
                {'title': 'Update Attendance', 'count': 3, 'priority': 'medium'},
                {'title': 'Prepare Lessons', 'count': 5, 'priority': 'low'}
            ]
        }
        
        return jsonify({'success': True, 'data': teacher_data})
        
    except Exception as e:
        return jsonify({'success': False, 'message': f'Dashboard error: {str(e)}'}), 500

@app.route('/admin/dashboard', methods=['GET'])
def admin_dashboard():
    try:
        token = request.headers.get('Authorization')
        if not token or not token.startswith('Bearer '):
            return jsonify({'success': False, 'message': 'Authorization required'}), 401
        
        token = token.replace('Bearer ', '')
        user_id = verify_token(token)
        
        if not user_id:
            return jsonify({'success': False, 'message': 'Invalid token'}), 401
        
        user = get_user_by_id(user_id)
        if not user or user['role'] != 'admin':
            return jsonify({'success': False, 'message': 'Access denied'}), 403
        
        # Mock admin data
        admin_data = {
            'admin': {
                'name': user['name'],
                'email': user['email'],
                'totalUsers': 150,
                'totalTeachers': 25,
                'totalStudents': 120,
                'totalClasses': 15
            },
            'statistics': {
                'todayRegistrations': 3,
                'activeUsers': 45,
                'systemHealth': 'Good',
                'storageUsed': '2.3GB'
            },
            'recentActivities': [
                {'action': 'New Registration', 'user': 'John Doe', 'time': '2 hours ago'},
                {'action': 'Assignment Created', 'user': 'Ms. Smith', 'time': '3 hours ago'},
                {'action': 'Grade Posted', 'user': 'Dr. Johnson', 'time': '5 hours ago'}
            ]
        }
        
        return jsonify({'success': True, 'data': admin_data})
        
    except Exception as e:
        return jsonify({'success': False, 'message': f'Dashboard error: {str(e)}'}), 500

# Database Info API
@app.route('/database/info', methods=['GET'])
def database_info():
    try:
        conn = sqlite3.connect(DATABASE)
        cursor = conn.cursor()
        
        # Get user count
        cursor.execute('SELECT COUNT(*) FROM users')
        user_count = cursor.fetchone()[0]
        
        # Get users by role
        cursor.execute('SELECT role, COUNT(*) FROM users GROUP BY role')
        role_counts = dict(cursor.fetchall())
        
        conn.close()
        
        return jsonify({
            'success': True,
            'data': {
                'totalUsers': user_count,
                'roleCounts': role_counts,
                'database': 'smart_classroom.db',
                'status': 'connected'
            }
        })
        
    except Exception as e:
        return jsonify({'success': False, 'message': f'Database info error: {str(e)}'}), 500

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({'success': False, 'message': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'success': False, 'message': 'Internal server error'}), 500

if __name__ == '__main__':
    # Initialize database
    init_db()
    
    # Create admin user
    create_admin()
    
    print("=" * 60)
    print("SMART CLASSROOM API SERVER")
    print("=" * 60)
    print("Server running on http://localhost:5000")
    print("Database initialized successfully")
    print("Default admin: admin@smartclass.com / admin123")
    print("=" * 60)
    print("Available Endpoints:")
    print("  GET  /health")
    print("  POST /register")
    print("  POST /login")
    print("  GET  /student/dashboard")
    print("  GET  /teacher/dashboard")
    print("  GET  /admin/dashboard")
    print("  GET  /database/info")
    print("=" * 60)
    
    app.run(debug=True, host='0.0.0.0', port=5000)
