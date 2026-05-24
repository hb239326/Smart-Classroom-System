import urllib.request
import urllib.parse
import json

def test_health():
    try:
        response = urllib.request.urlopen('http://localhost:5000/health')
        data = json.loads(response.read().decode('utf-8'))
        print(f"Health Check Status: {response.getcode()}")
        print(f"Health Check Response: {data}")
        return response.getcode() == 200
    except Exception as e:
        print(f"Health Check Error: {e}")
        return False

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
        
        data = json.dumps(user_data).encode('utf-8')
        req = urllib.request.Request(
            'http://localhost:5000/register',
            data=data,
            headers={'Content-Type': 'application/json'}
        )
        
        response = urllib.request.urlopen(req)
        result = json.loads(response.read().decode('utf-8'))
        print(f"\nRegistration Status: {response.getcode()}")
        print(f"Registration Response: {result}")
        return response.getcode() == 201
    except Exception as e:
        print(f"Registration Error: {e}")
        return False

def test_login():
    try:
        login_data = {
            "email": "test.student@example.com",
            "password": "password123",
            "user_type": "student"
        }
        
        data = json.dumps(login_data).encode('utf-8')
        req = urllib.request.Request(
            'http://localhost:5000/login',
            data=data,
            headers={'Content-Type': 'application/json'}
        )
        
        response = urllib.request.urlopen(req)
        result = json.loads(response.read().decode('utf-8'))
        print(f"\nLogin Status: {response.getcode()}")
        print(f"Login Response: {result}")
        return response.getcode() == 200
    except Exception as e:
        print(f"Login Error: {e}")
        return False

def test_admin_login():
    try:
        login_data = {
            "email": "admin@smartclass.com",
            "password": "admin123",
            "user_type": "admin"
        }
        
        data = json.dumps(login_data).encode('utf-8')
        req = urllib.request.Request(
            'http://localhost:5000/login',
            data=data,
            headers={'Content-Type': 'application/json'}
        )
        
        response = urllib.request.urlopen(req)
        result = json.loads(response.read().decode('utf-8'))
        print(f"\nAdmin Login Status: {response.getcode()}")
        print(f"Admin Login Response: {result}")
        return response.getcode() == 200
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
