// Test registration endpoint
const http = require('http');

const testRegistration = () => {
  return new Promise((resolve, reject) => {
    const userData = {
      name: 'Test Student',
      email: 'test.student@example.com',
      password: 'password123',
      phone: '+1234567890',
      user_type: 'student',
      confirm_password: 'password123'
    };

    const data = JSON.stringify(userData);

    const options = {
      hostname: 'localhost',
      port: 5000,
      path: '/register',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        console.log('Registration Response Status:', res.statusCode);
        console.log('Registration Response Body:', body);
        resolve({ status: res.statusCode, body });
      });
    });

    req.on('error', (e) => {
      console.error('Registration Error:', e.message);
      reject(e);
    });

    req.write(data);
    req.end();
  });
};

testRegistration().then(result => {
  console.log('Test completed:', result.status);
}).catch(error => {
  console.error('Test failed:', error);
});
