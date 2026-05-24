# Smart Classroom & Timetable Scheduler

A comprehensive web application for managing classroom schedules and student-teacher interactions with role-based authentication.

## Features

- **Multi-Role Authentication**: Secure login for Admin, Teacher, and Student roles
- **User Registration**: Easy signup process with validation
- **Password Security**: Strong password requirements with strength indicator
- **Responsive Design**: Modern UI that works on all devices
- **Session Management**: Secure token-based authentication
- **Error Handling**: Comprehensive validation and error messages

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Python Flask
- **Database**: SQLite
- **Authentication**: JWT tokens
- **Styling**: Custom CSS with Font Awesome icons

## Project Structure

```
smart_project/
|-- index.html          # Main login/registration page
|-- styles.css          # Complete styling
|-- script.js           # Frontend JavaScript logic
|-- app.py              # Flask backend server
|-- requirements.txt    # Python dependencies
|-- README.md          # Project documentation
```

## Installation & Setup

### Prerequisites
- Python 3.7 or higher
- pip (Python package manager)
- Web browser (Chrome, Firefox, Safari, Edge)

### Backend Setup

1. **Install Python Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

2. **Start the Backend Server**
   ```bash
   python app.py
   ```
   
   The server will start on `http://localhost:5000`

### Frontend Setup

1. **Open the Application**
   - Open `index.html` in your web browser
   - Or serve with a local web server for best results

2. **Using XAMPP/LAMP/WAMP**
   - Place the project in your web server's root directory
   - Access via `http://localhost/smart_project/`

## Default Credentials

An admin account is created automatically:

- **Email**: admin@smartclass.com
- **Password**: admin123
- **User ID**: ADMIN001

## User Registration

### Student Registration
- **User ID Format**: STU followed by 4+ digits (e.g., STU1234)
- **Required Fields**: Name, ID, Email, Phone, Password

### Teacher Registration
- **User ID Format**: TCH followed by 4+ digits (e.g., TCH1234)
- **Required Fields**: Name, ID, Email, Phone, Password

## API Endpoints

### Authentication
- `POST /register` - User registration
- `POST /login` - User login
- `POST /logout` - User logout
- `POST /verify-token` - Token verification

### Utilities
- `POST /forgot-password` - Password reset request
- `GET /health` - Server health check
- `POST /cleanup-sessions` - Clean expired sessions

## Security Features

- **Password Hashing**: SHA-256 encryption
- **JWT Authentication**: Secure token-based sessions
- **Input Validation**: Client and server-side validation
- **SQL Injection Protection**: Parameterized queries
- **CORS Enabled**: Cross-origin request handling

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Development

### Running in Development Mode
```bash
python app.py
```

### Database
The application uses SQLite for data storage. The database file `smart_classroom.db` is created automatically on first run.

### Customization
- Modify `styles.css` for UI changes
- Update `app.py` for backend logic
- Edit `script.js` for frontend behavior

## Troubleshooting

### Common Issues

1. **Backend Not Starting**
   - Check Python version compatibility
   - Ensure all dependencies are installed
   - Verify port 5000 is not in use

2. **Frontend Not Connecting**
   - Ensure backend server is running
   - Check for CORS issues
   - Verify API endpoint URLs

3. **Registration Failures**
   - Check user ID format requirements
   - Verify email format
   - Ensure password meets strength requirements

### Error Messages

- **"Network error"**: Backend server not running
- **"Invalid credentials"**: Wrong email/password/user type
- **"User already exists"**: Email or ID already registered

## Future Enhancements

- Dashboard interfaces for each role
- Timetable management system
- Class scheduling features
- Notification system
- File upload capabilities
- Real-time chat functionality

## License

This project is for educational purposes. Feel free to modify and distribute according to your needs.

## Support

For issues and questions, please check the troubleshooting section or review the code comments.
