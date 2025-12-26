import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Shield } from 'lucide-react';
import './Auth.css';

const Auth = ({ onAuthSuccess }) => {
  const [mode, setMode] = useState('login'); // 'login', 'register', 'verify-otp'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [pendingEmail, setPendingEmail] = useState('');

  // Password validation
  const validatePassword = (pwd) => {
    const hasUppercase = /[A-Z]/.test(pwd);
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>_\-+=~`[\]\\/;']/.test(pwd);
    const hasMinLength = pwd.length >= 8;
    
    return {
      isValid: hasUppercase && hasSymbol && hasMinLength,
      errors: [
        !hasMinLength && 'At least 8 characters',
        !hasUppercase && 'One uppercase letter',
        !hasSymbol && 'One symbol (!@#$%^&*_...)'
      ].filter(Boolean)
    };
  };

  // Email validation
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Simulate sending OTP
  const sendOTP = async (userEmail) => {
    // In production, this would call your backend API
    const mockOTP = '123456';
    console.log(`OTP sent to ${userEmail}: ${mockOTP}`);
    localStorage.setItem('mockOTP', mockOTP);
    localStorage.setItem('otpEmail', userEmail);
    return true;
  };

  // Handle registration
  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    const passwordCheck = validatePassword(password);
    if (!passwordCheck.isValid) {
      setError(passwordCheck.errors.join(', '));
      return;
    }

    // Check if email already exists
    const existingUsers = JSON.parse(localStorage.getItem('users') || '{}');
    if (existingUsers[email]) {
      setError('Email already registered. Please login instead.');
      return;
    }

    setLoading(true);
    try {
      await sendOTP(email);
      setPendingEmail(email);
      setMode('verify-otp');
    } catch (err) {
      setError('Failed to send verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP verification
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');

    const enteredOTP = otp.join('');
    const storedOTP = localStorage.getItem('mockOTP');
    const otpEmail = localStorage.getItem('otpEmail');

    if (enteredOTP !== storedOTP || otpEmail !== pendingEmail) {
      setError('Invalid verification code. Please try again.');
      return;
    }

    // Save user
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    users[pendingEmail] = {
      email: pendingEmail,
      password: password, // In production, this should be hashed
      createdAt: new Date().toISOString()
    };
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', pendingEmail);
    
    // Clean up OTP
    localStorage.removeItem('mockOTP');
    localStorage.removeItem('otpEmail');

    onAuthSuccess(pendingEmail);
  };

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '{}');
    const user = users[email];

    if (!user) {
      setError('No account found with this email. Please register.');
      return;
    }

    if (user.password !== password) {
      setError('Incorrect password. Please try again.');
      return;
    }

    localStorage.setItem('currentUser', email);
    onAuthSuccess(email);
  };

  // Handle OTP input
  const handleOTPChange = (index, value) => {
    if (value.length > 1) {
      value = value[0];
    }
    
    if (!/^\d*$/.test(value)) return;

    const newOTP = [...otp];
    newOTP[index] = value;
    setOtp(newOTP);

    // Auto-focus next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  // Handle OTP paste
  const handleOTPPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;
    
    const newOTP = pastedData.split('').concat(Array(6).fill('')).slice(0, 6);
    setOtp(newOTP);
  };

  if (mode === 'verify-otp') {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <Shield size={48} className="auth-icon" />
            <h2>Verify Your Email</h2>
            <p>We've sent a 6-digit code to <strong>{pendingEmail}</strong></p>
          </div>

          <form onSubmit={handleVerifyOTP} className="auth-form">
            <div className="otp-inputs" onPaste={handleOTPPaste}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOTPChange(index, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Backspace' && !digit && index > 0) {
                      document.getElementById(`otp-${index - 1}`)?.focus();
                    }
                  }}
                  className="otp-input"
                />
              ))}
            </div>

            {error && <div className="auth-error">{error}</div>}

            <button type="submit" className="auth-submit" disabled={otp.join('').length !== 6}>
              Verify & Create Account
              <ArrowRight size={20} />
            </button>

            <button 
              type="button" 
              className="auth-link"
              onClick={() => {
                setMode('register');
                setOtp(['', '', '', '', '', '']);
                setError('');
              }}
            >
              Back to registration
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-logo">Memory Books</h1>
          <h2>{mode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
          <p>
            {mode === 'login' 
              ? 'Sign in to access your memory books' 
              : 'Start preserving your precious moments'}
          </p>
        </div>

        <form onSubmit={mode === 'login' ? handleLogin : handleRegister} className="auth-form">
          <div className="form-field">
            <label>Email</label>
            <div className="input-wrapper">
              <Mail size={20} className="input-icon" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
              />
            </div>
          </div>

          <div className="form-field">
            <label>Password</label>
            <div className="input-wrapper">
              <Lock size={20} className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {mode === 'register' && password && (
              <div className="password-requirements">
                <div className={validatePassword(password).isValid ? 'valid' : 'invalid'}>
                  {validatePassword(password).isValid ? '✓ Strong password' : '○ Requirements:'}
                </div>
                {!validatePassword(password).isValid && (
                  <ul>
                    {validatePassword(password).errors.map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          {error && <div className="auth-error">{error}</div>}

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? 'Processing...' : mode === 'login' ? 'Sign In' : 'Create Account'}
            <ArrowRight size={20} />
          </button>

          <div className="auth-switch">
            {mode === 'login' ? (
              <>
                Don't have an account?{' '}
                <button type="button" onClick={() => { setMode('register'); setError(''); }}>
                  Create one
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button type="button" onClick={() => { setMode('login'); setError(''); }}>
                  Sign in
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Auth;