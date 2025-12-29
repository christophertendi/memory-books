import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Shield } from 'lucide-react';
import { authService } from '../services/authService';
import './Auth.css';

const Auth = ({ onAuthSuccess }) => {
  const [mode, setMode] = useState('login'); // 'login', 'register', 'verify-email'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

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

  // Handle registration
  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    const passwordCheck = validatePassword(password);
    if (!passwordCheck.isValid) {
      setError(passwordCheck.errors.join(', '));
      return;
    }

    setLoading(true);
    const result = await authService.register(email, password);
    setLoading(false);

    if (result.success) {
      setMessage(result.message);
      setMode('verify-email');
    } else {
      setError(result.error);
    }
  };

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    const result = await authService.login(email, password);
    setLoading(false);

    if (result.success) {
      onAuthSuccess(result.user);  // Pass whole user object
    } else {
      setError(result.error);
    }
  };

  // Resend verification email
  const handleResendVerification = async () => {
    setLoading(true);
    setError('');
    setMessage('');
    
    const result = await authService.resendVerification();
    setLoading(false);

    if (result.success) {
      setMessage(result.message);
    } else {
      setError(result.error);
    }
  };

  // Handle Google Sign-In
  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    setMessage('');

    const result = await authService.signInWithGoogle();
    setLoading(false);

    if (result.success) {
      onAuthSuccess(result.user);
    } else {
      setError(result.error);
    }
  };

  // Email verification screen
  if (mode === 'verify-email') {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <Shield size={48} className="auth-icon" />
            <h2>Verify Your Email</h2>
            <p>We've sent a verification link to <strong>{email}</strong></p>
            <p className="verify-instructions">
              Click the link in your email to verify your account, then return here to login.
            </p>
          </div>

          {message && <div className="auth-success">{message}</div>}
          {error && <div className="auth-error">{error}</div>}

          <div className="verify-actions">
            <button 
              className="auth-submit" 
              onClick={() => setMode('login')}
            >
              Back to Login
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Login/Register form
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

          {message && <div className="auth-success">{message}</div>}
          {error && <div className="auth-error">{error}</div>}

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? 'Processing...' : mode === 'login' ? 'Sign In' : 'Create Account'}
            <ArrowRight size={20} />
          </button>

          <div className="auth-divider">
            <span>or</span>
          </div>

          <button 
            type="button"
            onClick={handleGoogleSignIn}
            className="auth-google-btn"
            disabled={loading}
          >
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <div className="auth-switch">
            {mode === 'login' ? (
              <>
                Don't have an account?{' '}
                <button type="button" onClick={() => { setMode('register'); setError(''); setMessage(''); }}>
                  Create one
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button type="button" onClick={() => { setMode('login'); setError(''); setMessage(''); }}>
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