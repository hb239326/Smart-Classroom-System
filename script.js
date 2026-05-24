// DOM Elements
const loginToggle = document.getElementById('login-toggle');
const registerToggle = document.getElementById('register-toggle');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const loginFormElement = document.querySelector('.login-form');
const registerFormElement = document.querySelector('.register-form');

// User type buttons
const userBtns = document.querySelectorAll('.user-btn');
const regUserBtns = document.querySelectorAll('.reg-user-btn');

// Form inputs
const loginEmail = document.getElementById('login-email');
const loginPassword = document.getElementById('login-password');
const registerId = document.getElementById('register-id');
const registerName = document.getElementById('register-name');
const registerEmail = document.getElementById('register-email');
const registerPhone = document.getElementById('register-phone');
const registerPassword = document.getElementById('register-password');
const registerConfirmPassword = document.getElementById('register-confirm-password');

// Toggle buttons
const togglePasswords = document.querySelectorAll('.toggle-password');

// Error messages
const loginError = document.getElementById('login-error');
const registerError = document.getElementById('register-error');

// Password strength elements
const strengthFill = document.querySelector('.strength-fill');
const strengthText = document.querySelector('.strength-text');

// Current user types
let currentUserType = 'student';
let currentRegUserType = 'student';

// Performance optimized initialization with lazy loading
document.addEventListener('DOMContentLoaded', function() {
    // Critical path initialization
    initializeEventListeners();
    loadRememberedCredentials();
    
    // Load saved language
    const savedLang = localStorage.getItem('language');
    if (savedLang) {
        document.getElementById('language-select').value = savedLang;
        changeLanguage(savedLang);
    }
    
    // Register service worker for PWA functionality
    registerServiceWorker();
    
    // Initialize PWA features
    initializePWA();
    
    // Lazy load non-critical features
    requestIdleCallback(() => {
        initializeNonCriticalFeatures();
    });
    
    // Preload critical resources
    preloadCriticalResources();
});

// Service Worker Registration
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('SW registered: ', registration);
                    
                    // Check for updates
                    registration.addEventListener('updatefound', () => {
                        const newWorker = registration.installing;
                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                // New version available
                                showUpdateNotification();
                            }
                        });
                    });
                })
                .catch(registrationError => {
                    console.log('SW registration failed: ', registrationError);
                });
        });
    }
}

// PWA Features Initialization
function initializePWA() {
    // Install prompt for PWA
    let deferredPrompt;
    
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        
        // Show install button
        showInstallButton();
    });
    
    // Handle app install
    window.addEventListener('appinstalled', () => {
        console.log('PWA was installed');
        deferredPrompt = null;
    });
    
    // Handle install button click
    window.installPWA = () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the A2HS prompt');
                } else {
                    console.log('User dismissed the A2HS prompt');
                }
                deferredPrompt = null;
            });
        }
    };
}

// Show update notification
function showUpdateNotification() {
    const notification = document.createElement('div');
    notification.className = 'update-notification';
    notification.innerHTML = `
        <div class="update-content">
            <i class="fas fa-download"></i>
            <span>New version available!</span>
            <button onclick="this.parentElement.parentElement.remove()">Later</button>
            <button onclick="location.reload()">Update</button>
        </div>
    `;
    document.body.appendChild(notification);
}

// Show install button
function showInstallButton() {
    const installBtn = document.createElement('button');
    installBtn.className = 'install-btn';
    installBtn.innerHTML = '<i class="fas fa-download"></i> Install App';
    installBtn.onclick = () => window.installPWA();
    document.querySelector('.header-controls').appendChild(installBtn);
}

// Lazy loading for non-critical features
function initializeNonCriticalFeatures() {
    // Initialize tooltips
    initializeTooltips();
    
    // Initialize animations
    initializeAnimations();
    
    // Initialize analytics (if any)
    initializeAnalytics();
}

// Placeholder functions for non-critical features
function initializeTooltips() {
    // Initialize tooltip functionality
    console.log('Tooltips initialized');
}

function initializeAnimations() {
    // Initialize animation functionality
    console.log('Animations initialized');
}

function initializeAnalytics() {
    // Initialize analytics tracking
    console.log('Analytics initialized');
}

// Preload critical resources for faster loading
function preloadCriticalResources() {
    const criticalResources = [
        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
    ];
    
    criticalResources.forEach(url => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'style';
        link.href = url;
        document.head.appendChild(link);
    });
}

// Debounce function for performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll/resize events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Optimized form validation with debouncing
const debouncedValidation = debounce(function() {
    validateForm();
}, 300);

function initializeEventListeners() {
    // Form toggle
    loginToggle.addEventListener('click', () => switchForm('login'));
    registerToggle.addEventListener('click', () => switchForm('register'));

    // User type selection
    userBtns.forEach(btn => {
        btn.addEventListener('click', () => selectUserType(btn, 'login'));
    });

    regUserBtns.forEach(btn => {
        btn.addEventListener('click', () => selectUserType(btn, 'register'));
    });

    // Form submissions
    loginFormElement.addEventListener('submit', handleLogin);
    registerFormElement.addEventListener('submit', handleRegistration);

    // Password toggle
    togglePasswords.forEach(toggle => {
        toggle.addEventListener('click', togglePasswordVisibility);
    });

    // Password strength checker
    registerPassword.addEventListener('input', checkPasswordStrength);

    // Real-time validation
    registerConfirmPassword.addEventListener('input', checkPasswordMatch);
    registerEmail.addEventListener('blur', validateEmail);
    registerPhone.addEventListener('blur', validatePhone);
    registerId.addEventListener('blur', validateId);
}

function switchForm(form) {
    // Clear any loading states
    loginFormElement.classList.remove('loading');
    registerFormElement.classList.remove('loading');
    
    if (form === 'login') {
        loginToggle.classList.add('active');
        registerToggle.classList.remove('active');
        loginForm.classList.add('active');
        registerForm.classList.remove('active');
        
        // Focus on email field for better UX
        setTimeout(() => {
            loginEmail.focus();
        }, 100);
    } else {
        registerToggle.classList.add('active');
        loginToggle.classList.remove('active');
        registerForm.classList.add('active');
        loginForm.classList.remove('active');
        
        // Focus on name field for better UX
        setTimeout(() => {
            registerName.focus();
        }, 100);
    }
    
    // Clear all errors and reset input borders
    clearErrors();
    
    // Reset input borders for all inputs
    document.querySelectorAll('input').forEach(input => {
        input.style.borderColor = '';
    });
}

function selectUserType(button, form) {
    if (form === 'login') {
        userBtns.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        currentUserType = button.dataset.user;
    } else {
        regUserBtns.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        currentRegUserType = button.dataset.user;
    }
}

function togglePasswordVisibility(e) {
    const toggle = e.currentTarget;
    const input = toggle.previousElementSibling;
    const icon = toggle.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

function checkPasswordStrength() {
    const password = registerPassword.value;
    let strength = 0;
    
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^a-zA-Z0-9]/)) strength++;
    
    const strengthPercent = (strength / 4) * 100;
    strengthFill.style.width = strengthPercent + '%';
    
    if (strength === 0) {
        strengthFill.style.background = '#dc3545';
        strengthText.textContent = 'Very Weak';
    } else if (strength === 1) {
        strengthFill.style.background = '#fd7e14';
        strengthText.textContent = 'Weak';
    } else if (strength === 2) {
        strengthFill.style.background = '#ffc107';
        strengthText.textContent = 'Fair';
    } else if (strength === 3) {
        strengthFill.style.background = '#20c997';
        strengthText.textContent = 'Good';
    } else {
        strengthFill.style.background = '#28a745';
        strengthText.textContent = 'Strong';
    }
}

function checkPasswordMatch() {
    const password = registerPassword.value;
    const confirmPassword = registerConfirmPassword.value;
    
    if (confirmPassword && password !== confirmPassword) {
        registerConfirmPassword.style.borderColor = '#dc3545';
        showError(registerError, 'Passwords do not match');
    } else if (confirmPassword && password === confirmPassword) {
        registerConfirmPassword.style.borderColor = '#28a745';
        clearErrors();
    }
}

function validateEmail() {
    const email = registerEmail.value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(email)) {
        registerEmail.style.borderColor = '#dc3545';
        showError(registerError, 'Please enter a valid email address');
        return false;
    }
    
    registerEmail.style.borderColor = '#28a745';
    return true;
}

function validatePhone() {
    const phone = registerPhone.value;
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    
    if (!phoneRegex.test(phone) || phone.length < 10) {
        registerPhone.style.borderColor = '#dc3545';
        showError(registerError, 'Please enter a valid phone number');
        return false;
    }
    
    registerPhone.style.borderColor = '#28a745';
    return true;
}


async function handleLogin(e) {
    e.preventDefault();
    clearErrors();
    
    const email = loginEmail.value;
    const password = loginPassword.value;
    const rememberMe = document.getElementById('remember').checked;
    
    // Basic validation
    if (!email || !password) {
        showError(loginError, 'Please fill in all fields');
        return;
    }
    
    // Show loading state
    loginFormElement.classList.add('loading');
    
    try {
        // Simulate API call to backend
        const response = await fetch('http://localhost:5000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password,
                user_type: currentUserType
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Store session
            sessionStorage.setItem('user', JSON.stringify(data.user));
            sessionStorage.setItem('token', data.token);
            
            // Remember me functionality
            if (rememberMe) {
                localStorage.setItem('rememberedEmail', email);
            } else {
                localStorage.removeItem('rememberedEmail');
            }
            
            // Redirect based on user type
            redirectUser(currentUserType);
        } else {
            showError(loginError, data.message || 'Login failed. Please try again.');
        }
    } catch (error) {
        console.error('Login error:', error);
        showError(loginError, 'Network error. Please check your connection.');
    } finally {
        loginFormElement.classList.remove('loading');
    }
}

async function handleRegistration(e) {
    e.preventDefault();
    clearErrors();
    
    // Check if all form elements exist
    if (!registerName || !registerEmail || !registerPhone || !registerPassword || !registerConfirmPassword) {
        console.error('Missing form elements');
        showError(registerError, 'Form error. Please refresh the page.');
        return;
    }
    
    const formData = {
        name: registerName.value,
        email: registerEmail.value,
        phone: registerPhone.value,
        password: registerPassword.value,
        confirm_password: registerConfirmPassword.value,
        user_type: currentRegUserType,
        terms: document.getElementById('terms')?.checked || false
    };
    
    console.log('Registration data:', formData);
    
    // Validation
    if (!validateRegistration(formData)) {
        return;
    }
    
    // Show loading state
    registerFormElement.classList.add('loading');
    
    try {
        // Simulate API call to backend
        const response = await fetch('http://localhost:5000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        console.log('Registration response:', data);
        
        if (response.ok) {
            // Clear registration form
            registerFormElement.reset();
            
            // Show success message
            showSuccess(registerError, 'Registration successful! Redirecting to login...');
            
            // Switch to login form after successful registration
            setTimeout(() => {
                switchForm('login');
                if (loginEmail) {
                    loginEmail.value = formData.email;
                    loginPassword.focus();
                }
                
                // Clear the success message after switching
                setTimeout(() => {
                    clearErrors();
                }, 1000);
            }, 1500);
        } else {
            showError(registerError, data.message || 'Registration failed. Please try again.');
        }
    } catch (error) {
        console.error('Registration error:', error);
        showError(registerError, 'Network error. Please check your connection.');
    } finally {
        registerFormElement.classList.remove('loading');
    }
}

function validateRegistration(formData) {
    console.log('Validating registration data:', formData);
    
    try {
        if (!formData.name || !formData.email || !formData.phone || !formData.password) {
            throw new Error('Please fill in all required fields');
        }
        
        if (formData.password !== formData.confirm_password) {
            throw new Error('Passwords do not match');
        }
        
        if (formData.password.length < 8) {
            throw new Error('Password must be at least 8 characters long');
        }
        
        // Validate terms acceptance
        const termsCheckbox = document.getElementById('terms');
        if (!termsCheckbox || !termsCheckbox.checked) {
            throw new Error('You must accept Terms of Service and Privacy Policy');
        }
        
        if (!validateEmail() || !validatePhone()) {
            throw new Error('Validation failed');
        }
        
        console.log('Registration validation passed');
        return true;
    } catch (error) {
        console.error('Registration validation error:', error);
        showError(registerError, error.message);
        return false;
    }
}

function redirectUser(userType) {
    const redirects = {
        'admin': 'admin/dashboard.html',
        'teacher': 'teacher/dashboard.html',
        'student': 'student/dashboard.html'
    };
    
    const redirectUrl = redirects[userType] || 'student/dashboard.html';
    window.location.href = redirectUrl;
}

function loadRememberedCredentials() {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
        loginEmail.value = rememberedEmail;
        document.getElementById('remember').checked = true;
    }
}

function showError(element, message) {
    element.textContent = message;
    element.classList.add('show');
    element.classList.remove('success-message');
    element.classList.add('error-message');
}

function showSuccess(element, message) {
    element.textContent = message;
    element.classList.add('show');
    element.classList.remove('error-message');
    element.classList.add('success-message');
}

function clearErrors() {
    loginError.classList.remove('show');
    registerError.classList.remove('show');
    
    // Reset input borders
    document.querySelectorAll('input').forEach(input => {
        input.style.borderColor = '';
    });
}

// Forgot password handler
document.querySelector('.forgot-password').addEventListener('click', function(e) {
    e.preventDefault();
    const email = prompt('Enter your email address for password reset:');
    
    if (email) {
        // Simulate password reset
        alert(`Password reset link has been sent to ${email}`);
    }
});

// Switch to login handler
document.getElementById('switch-to-login').addEventListener('click', function(e) {
    e.preventDefault();
    switchForm('login');
});

// Switch to register handler
document.getElementById('switch-to-register').addEventListener('click', function(e) {
    e.preventDefault();
    switchForm('register');
});

// Theme toggle functionality
const lightModeBtn = document.getElementById('light-mode');
const darkModeBtn = document.getElementById('dark-mode');

// Load saved theme
const savedTheme = localStorage.getItem('theme') || 'light';
if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    darkModeBtn.classList.add('active');
    lightModeBtn.classList.remove('active');
}

lightModeBtn.addEventListener('click', () => {
    document.body.classList.remove('dark-mode');
    lightModeBtn.classList.add('active');
    darkModeBtn.classList.remove('active');
    localStorage.setItem('theme', 'light');
});

darkModeBtn.addEventListener('click', () => {
    document.body.classList.add('dark-mode');
    darkModeBtn.classList.add('active');
    lightModeBtn.classList.remove('active');
    localStorage.setItem('theme', 'dark');
});


// Social login handlers
document.querySelectorAll('.social-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const provider = this.classList.contains('google-btn') ? 'google' : 
                        this.classList.contains('microsoft-btn') ? 'microsoft' : 'github';
        handleSocialLogin(provider);
    });
});

function handleSocialLogin(provider) {
    // Show loading state
    const btn = document.querySelector(`.${provider}-btn`);
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Connecting...';
    btn.disabled = true;

    // Simulate social login
    setTimeout(() => {
        // In a real app, this would redirect to OAuth provider
        alert(`${provider.charAt(0).toUpperCase() + provider.slice(1)} login would be handled here with OAuth integration.`);
        btn.innerHTML = originalText;
        btn.disabled = false;
    }, 2000);
}


function showTwoFactorModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>Two-Factor Authentication</h3>
            <p>Scan this QR code with your authenticator app:</p>
            <div class="qr-code">
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=otpauth://totp/SmartClassroom:user@example.com?secret=JBSWY3DPEHPK3PXP&issuer=SmartClassroom" alt="QR Code">
            </div>
            <p>Or enter this code manually: JBSWY3DPEHPK3PXP</p>
            <button class="modal-btn" onclick="closeModal()">Close</button>
        </div>
    `;
    document.body.appendChild(modal);
}

function showTwoFactorSetup() {
    showSuccess(registerError, '2FA setup instructions sent to your email');
}

function closeModal() {
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.remove();
    }
}

// Session manager
document.getElementById('session-manager')?.addEventListener('click', function(e) {
    e.preventDefault();
    showSessionManager();
});

function showSessionManager() {
    const sessions = JSON.parse(localStorage.getItem('activeSessions') || '[]');
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>Active Sessions</h3>
            <div class="sessions-list">
                ${sessions.length === 0 ? '<p>No active sessions found.</p>' : 
                  sessions.map((session, index) => `
                    <div class="session-item">
                        <div class="session-info">
                            <i class="fas fa-desktop"></i>
                            <div>
                                <strong>${session.device}</strong>
                                <small>${session.location} • ${session.time}</small>
                            </div>
                        </div>
                        <button class="terminate-btn" onclick="terminateSession(${index})">Terminate</button>
                    </div>
                  `).join('')}
            </div>
            <button class="modal-btn" onclick="closeModal()">Close</button>
        </div>
    `;
    document.body.appendChild(modal);
}

function terminateSession(index) {
    const sessions = JSON.parse(localStorage.getItem('activeSessions') || '[]');
    sessions.splice(index, 1);
    localStorage.setItem('activeSessions', JSON.stringify(sessions));
    showSessionManager(); // Refresh the modal
}

// Language selector
document.getElementById('language-select')?.addEventListener('change', function() {
    const selectedLang = this.value;
    changeLanguage(selectedLang);
});

function changeLanguage(lang) {
    // In a real app, this would load translation files
    const translations = {
        'en': { login: 'Login', register: 'Register', email: 'Email', password: 'Password', name: 'Name', phone: 'Phone', id: 'ID', student: 'Student', teacher: 'Teacher', admin: 'Admin' },
        'hi': { login: 'लॉगिन', register: 'रजिस्टर', email: 'ईमेल', password: 'पासवर्ड', name: 'नाम', phone: 'फोन', id: 'आईडी', student: 'छात्र', teacher: 'शिक्षक', admin: 'व्यवस्थापक' },
        'es': { login: 'Iniciar sesión', register: 'Registrarse', email: 'Correo', password: 'Contraseña', name: 'Nombre', phone: 'Teléfono', id: 'ID', student: 'Estudiante', teacher: 'Profesor', admin: 'Administrador' },
        'fr': { login: 'Connexion', register: 'S\'inscrire', email: 'Email', password: 'Mot de passe', name: 'Nom', phone: 'Téléphone', id: 'ID', student: 'Étudiant', teacher: 'Enseignant', admin: 'Administrateur' },
        'de': { login: 'Anmelden', register: 'Registrieren', email: 'E-Mail', password: 'Passwort', name: 'Name', phone: 'Telefon', id: 'ID', student: 'Schüler', teacher: 'Lehrer', admin: 'Administrator' },
        'zh': { login: '登录', register: '注册', email: '邮箱', password: '密码', name: '姓名', phone: '电话', id: 'ID', student: '学生', teacher: '老师', admin: '管理员' }
    };

    const t = translations[lang];
    if (t) {
        document.getElementById('login-toggle').textContent = t.login;
        document.getElementById('register-toggle').textContent = t.register;
        
        // Update placeholders
        const loginEmail = document.getElementById('login-email');
        const loginPassword = document.getElementById('login-password');
        const registerName = document.getElementById('register-name');
        const registerEmail = document.getElementById('register-email');
        const registerPhone = document.getElementById('register-phone');
        const registerPassword = document.getElementById('register-password');
        
        if (loginEmail) loginEmail.placeholder = t.email;
        if (loginPassword) loginPassword.placeholder = t.password;
        if (registerName) registerName.placeholder = t.name;
        if (registerEmail) registerEmail.placeholder = t.email;
        if (registerPhone) registerPhone.placeholder = t.phone;
        if (registerPassword) registerPassword.placeholder = t.password;
        
        // Update user type buttons
        document.querySelector('[data-user="student"]').innerHTML = `<i class="fas fa-user-graduate"></i> ${t.student}`;
        document.querySelector('[data-user="teacher"]').innerHTML = `<i class="fas fa-chalkboard-teacher"></i> ${t.teacher}`;
        document.querySelector('[data-user="admin"]').innerHTML = `<i class="fas fa-user-shield"></i> ${t.admin}`;
        
        document.querySelector('[data-user="student"].reg-user-btn').innerHTML = `<i class="fas fa-user-graduate"></i> ${t.student}`;
        document.querySelector('[data-user="teacher"].reg-user-btn').innerHTML = `<i class="fas fa-chalkboard-teacher"></i> ${t.teacher}`;
        
        // Update labels
        document.querySelector('.user-type-selector label').textContent = lang === 'hi' ? 'उपयोगी प्रकार चुनें:' : 'Select User Type:';
        document.querySelector('.reg-user-type-selector label').textContent = lang === 'hi' ? 'इस प्रकार के रूप में रजिस्टर करें:' : 'Register As:';
    }
    
    localStorage.setItem('language', lang);
}

// Help button
document.getElementById('help-btn')?.addEventListener('click', function() {
    showHelpModal();
});

function showHelpModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>Help & Support</h3>
            <div class="help-sections">
                <div class="help-section">
                    <h4><i class="fas fa-user-graduate"></i> Student Help</h4>
                    <ul>
                        <li>How to register for classes</li>
                        <li>View your timetable</li>
                        <li>Submit assignments</li>
                    </ul>
                </div>
                <div class="help-section">
                    <h4><i class="fas fa-chalkboard-teacher"></i> Teacher Help</h4>
                    <ul>
                        <li>Create class schedules</li>
                        <li>Manage student enrollment</li>
                        <li>Grade assignments</li>
                    </ul>
                </div>
                <div class="help-section">
                    <h4><i class="fas fa-user-shield"></i> Admin Help</h4>
                    <ul>
                        <li>User management</li>
                        <li>System configuration</li>
                        <li>Generate reports</li>
                    </ul>
                </div>
            </div>
            <div class="help-contact">
                <p><strong>Contact Support:</strong></p>
                <p>Email: support@smartclassroom.com</p>
                <p>Phone: 1-800-CLASSROOM</p>
            </div>
            <button class="modal-btn" onclick="closeModal()">Close</button>
        </div>
    `;
    document.body.appendChild(modal);
}


// Terms and privacy links
document.querySelector('.terms-link')?.addEventListener('click', function(e) {
    e.preventDefault();
    showTermsModal();
});

document.querySelector('.privacy-link')?.addEventListener('click', function(e) {
    e.preventDefault();
    showPrivacyModal();
});

function showTermsModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>Terms of Service</h3>
            <div class="terms-content">
                <h4>1. Acceptance of Terms</h4>
                <p>By accessing and using Smart Classroom, you accept and agree to be bound by the terms and provision of this agreement.</p>
                
                <h4>2. Privacy Policy</h4>
                <p>Your use of Smart Classroom is also governed by our Privacy Policy.</p>
                
                <h4>3. User Accounts</h4>
                <p>You are responsible for maintaining the confidentiality of your account and password.</p>
                
                <h4>4. Acceptable Use</h4>
                <p>You agree to use the service only for lawful purposes and in accordance with these Terms.</p>
            </div>
            <button class="modal-btn" onclick="closeModal()">Close</button>
        </div>
    `;
    document.body.appendChild(modal);
}

function showPrivacyModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>Privacy Policy</h3>
            <div class="privacy-content">
                <h4>Information We Collect</h4>
                <p>We collect information you provide directly to us, such as when you create an account.</p>
                
                <h4>How We Use Information</h4>
                <p>We use the information we collect to provide, maintain, and improve our services.</p>
                
                <h4>Information Sharing</h4>
                <p>We do not sell, trade, or otherwise transfer your personal information to third parties.</p>
                
                <h4>Data Security</h4>
                <p>We implement appropriate security measures to protect your personal information.</p>
            </div>
            <button class="modal-btn" onclick="closeModal()">Close</button>
        </div>
    `;
    document.body.appendChild(modal);
}

// Add modal styles dynamically
const modalStyles = document.createElement('style');
modalStyles.textContent = `
    .modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    }
    
    .modal-content {
        background: white;
        border-radius: 16px;
        padding: 30px;
        max-width: 500px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        animation: slideUp 0.3s ease;
    }
    
    .modal-content h3 {
        margin-bottom: 20px;
        color: #333;
        text-align: center;
    }
    
    .modal-btn {
        width: 100%;
        padding: 12px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        margin-top: 20px;
        font-weight: 600;
    }
    
    .qr-code {
        text-align: center;
        margin: 20px 0;
    }
    
    .qr-code img {
        border: 1px solid #ddd;
        border-radius: 8px;
    }
    
    .sessions-list {
        max-height: 300px;
        overflow-y: auto;
    }
    
    .session-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px;
        border: 1px solid #e9ecef;
        border-radius: 8px;
        margin-bottom: 10px;
    }
    
    .session-info {
        display: flex;
        align-items: center;
        gap: 15px;
    }
    
    .session-info i {
        font-size: 24px;
        color: #667eea;
    }
    
    .terminate-btn {
        background: #dc3545;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 12px;
    }
    
    .help-sections {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 20px;
        margin: 20px 0;
    }
    
    .help-section h4 {
        color: #667eea;
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        gap: 8px;
    }
    
    .help-section ul {
        list-style: none;
        padding: 0;
    }
    
    .help-section li {
        padding: 5px 0;
        border-bottom: 1px solid #f0f0f0;
    }
    
    .help-contact {
        background: #f8f9fa;
        padding: 20px;
        border-radius: 8px;
        margin-top: 20px;
    }
    
    .terms-content, .privacy-content {
        max-height: 400px;
        overflow-y: auto;
        padding: 10px;
        border: 1px solid #e9ecef;
        border-radius: 8px;
        margin: 20px 0;
    }
    
    .terms-content h4, .privacy-content h4 {
        color: #667eea;
        margin: 15px 0 10px 0;
    }
    
    body.dark-mode .modal-content {
        background: #2d3748;
        color: #e2e8f0;
    }
    
    body.dark-mode .modal-content h3 {
        color: #e2e8f0;
    }
    
    body.dark-mode .session-item {
        border-color: #4a5568;
        background: #2d3748;
    }
    
    body.dark-mode .help-section {
        background: #2d3748;
        padding: 15px;
        border-radius: 8px;
    }
    
    body.dark-mode .help-contact {
        background: #4a5568;
    }
    
    body.dark-mode .terms-content, .dark-mode .privacy-content {
        background: #2d3748;
        border-color: #4a5568;
    }
`;
document.head.appendChild(modalStyles);

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + Enter to submit form
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        const activeForm = document.querySelector('.form-panel.active');
        if (activeForm.id === 'login-form') {
            loginFormElement.dispatchEvent(new Event('submit'));
        } else {
            registerFormElement.dispatchEvent(new Event('submit'));
        }
    }
});

// Auto-resize for mobile
window.addEventListener('resize', function() {
    if (window.innerWidth < 768) {
        document.querySelector('.container').style.margin = '10px';
    } else {
        document.querySelector('.container').style.margin = '';
    }
});
