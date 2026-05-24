import requests
import json

# Test health endpoint
def test_health():
    try:
        response = requests.get('http://localhost:5000/health')
        print(f"Health Check Status: {response.status_code}")
        print(f"Health Check Response: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"Health Check Error: {e}")
        return False

# Test registration endpoint
def test_registration():
    try:
        user_data = {
            "name": "Test Student",
            "email": "test.student@example.com",
            "phone": "1234567890",
            "password": "password123",
            "confirm_password": "password123",
            "user_type": "student"
        }
        
        response = requests.post('http://localhost:5000/register', json=user_data)
        print(f"\nRegistration Status: {response.status_code}")
        print(f"Registration Response: {response.json()}")
        return response.status_code == 201
    except Exception as e:
        print(f"Registration Error: {e}")
        return False

# Test login endpoint
def test_login():
    try:
        login_data = {
            "email": "test.student@example.com",
            "password": "password123",
            "user_type": "student"
        }
        
        response = requests.post('http://localhost:5000/login', json=login_data)
        print(f"\nLogin Status: {response.status_code}")
        print(f"Login Response: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"Login Error: {e}")
        return False

# Test admin login
def test_admin_login():
    try:
        login_data = {
            "email": "admin@smartclass.com",
            "password": "admin123",
            "user_type": "admin"
        }
        
        response = requests.post('http://localhost:5000/login', json=login_data)
        print(f"\nAdmin Login Status: {response.status_code}")
        print(f"Admin Login Response: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"Admin Login Error: {e}")
        return False

if __name__ == "__main__":
    print("Testing Smart Classroom Backend API...")
    print("=" * 50)
    
    # Run all tests
    health_ok = test_health()
    reg_ok = test_registration()
    login_ok = test_login()
    admin_ok = test_admin_login()
    
    print("\n" + "=" * 50)
    print("Test Results:")
    print(f"Health Check: {'PASS' if health_ok else 'FAIL'}")
    print(f"Registration: {'PASS' if reg_ok else 'FAIL'}")
    print(f"Student Login: {'PASS' if login_ok else 'FAIL'}")
    print(f"Admin Login: {'PASS' if admin_ok else 'FAIL'}")
    
    if all([health_ok, reg_ok, login_ok, admin_ok]):
        print("\nAll tests passed! Backend is working correctly.")
    else:
        print("\nSome tests failed. Please check the backend.")
