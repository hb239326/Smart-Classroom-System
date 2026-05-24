# Smart Classroom & Timetable Scheduler - Setup Guide

## Project Overview
A complete Smart Classroom Management System with Student, Teacher, and Admin dashboards. Features include user authentication, timetable management, attendance tracking, assignments, and more.

## Tech Stack
- **Backend**: Python Flask, SQLite
- **Frontend**: HTML, CSS, JavaScript
- **Authentication**: JWT Tokens
- **Database**: SQLite (smart_classroom.db)

## Quick Setup

### Prerequisites
- Python 3.7 or higher
- Modern web browser

### Installation Steps

1. **Install Python Dependencies**
```bash
pip install -r requirements.txt
```

2. **Start the Backend Server**
```bash
python app.py
```

3. **Access the Application**
- Open your browser and go to: `http://localhost:5000`
- Or directly open: `index.html`

## Default Login Credentials

### Admin User
- **Email**: admin@smartclass.com
- **Password**: admin123
- **Role**: admin

### Test Student (After Registration)
- **Email**: Your registered email
- **Password**: Your password
- **Role**: student

### Test Teacher (After Registration)
- **Email**: Your registered email
- **Password**: Your password
- **Role**: teacher

## Features

### Authentication System
- User registration with validation
- Secure login with JWT tokens
- Role-based access control
- Session management

### User Roles & Dashboards
- **Admin**: Manage users, classes, subjects
- **Teacher**: View timetable, mark attendance, create assignments
- **Student**: View timetable, submit assignments, view grades

### Key Features
- Automatic timetable generation
- Attendance tracking
- Assignment management
- Grade management
- Notice system
- Real-time notifications

## API Endpoints

### Authentication
- `POST /register` - User registration
- `POST /login` - User login
- `GET /health` - Health check

### Student Endpoints
- `GET /student/dashboard` - Student dashboard data

### Teacher Endpoints
- `GET /teacher/dashboard` - Teacher dashboard data

### Admin Endpoints
- `GET /admin/dashboard` - Admin dashboard data

## File Structure

```
smart_project/
|-- app.py                    # Main Flask application
|-- requirements.txt           # Python dependencies
|-- smart_classroom.db        # SQLite database (auto-created)
|-- index.html               # Login/Registration page
|-- styles.css               # Main stylesheet
|-- script.js                # Frontend JavaScript
|-- admin/
|   |-- dashboard.html       # Admin dashboard
|-- teacher/
|   |-- dashboard.html       # Teacher dashboard
|-- student/
|   |-- dashboard.html       # Student dashboard
|-- test_student_login.html  # Testing page
```

## Database Schema

### Users Table
- id (Primary Key)
- name
- email (Unique)
- phone
- password (Hashed)
- role (admin/teacher/student)
- created_at

### Sessions Table
- id (Primary Key)
- user_id (Foreign Key)
- token (JWT Token)
- created_at

## Testing

### Test the Complete Flow
1. Open `test_student_login.html` in your browser
2. Click "Test Complete Flow" button
3. This will test registration, login, and dashboard access

### Manual Testing
1. Register a new student account
2. Login with the new account
3. Verify dashboard access
4. Test logout functionality

## Troubleshooting

### Common Issues

1. **Backend Not Starting**
   - Ensure Python is installed
   - Install dependencies: `pip install -r requirements.txt`
   - Check for port conflicts (default: 5000)

2. **Registration Not Working**
   - Check if backend is running
   - Verify email format is valid
   - Ensure password is at least 6 characters

3. **Login Not Working**
   - Verify user exists in database
   - Check password is correct
   - Ensure user type matches (student/teacher/admin)

4. **Dashboard Not Loading**
   - Check if user is logged in
   - Verify JWT token is valid
   - Check browser console for errors

### Database Issues
- Delete `smart_classroom.db` to reset database
- Restart server to recreate database
- Default admin user will be auto-created

## Security Features

- Password hashing with SHA-256
- JWT token authentication
- Input validation and sanitization
- CORS enabled for frontend access
- Session management

## Development

### Running in Development Mode
```bash
python app.py
```

### Running in Production Mode
```bash
# Set environment variable
export FLASK_ENV=production
python app.py
```

## Browser Compatibility
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Support

For issues and questions:
1. Check the troubleshooting section
2. Use the test page to verify functionality
3. Check browser console for error messages

## Next Steps

After successful setup:
1. Register teacher and student accounts
2. Create classes and subjects
3. Generate timetables
4. Start using the system for classroom management

---

**Note**: The system automatically creates an admin user on first run. Use these credentials to access the admin dashboard and set up your institution's data.
