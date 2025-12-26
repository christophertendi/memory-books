import { useState, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Shield } from 'lucide-react';
import { authService } from '../services/authService';
import './Auth.css';

const Auth = ({ onAuthSuccess }) => {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = authService.onAuthChange((user) => {
      if (user && user.emailVerified) {
        onAuthSuccess(user.email);
      }
    });
    return () => unsubscribe();
  }, [onAuthSuccess]);

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

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

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

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    const result = await authService.login(email, password);
    setLoading(false);

    if (result.success) {
      onAuthSuccess(result.user.email);
    } else {
      setError(result.error);
    }
  };

  const handleResendVerification = async () => {
    setLoading(true);
    const result = await authService.resendVerification();
    setLoading(false);

    if (result.success) {
      setMessage('Verification email sent! Check your inbox.');
    } else {
      setError(result.error);
    }
  };

  // Email verification waiting screen
  if (mode === 'verify-email') {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <Shield size={48} className="auth-icon" />
            <h2>Verify Your Email</h2>
            <p>We've sent a verification link to <strong>{email}</strong></p>
            <p className="verify-instructions">
              Click the link in the email to verify your account, then return here to login.
            </p>
          </div>

          {message && <div className="auth-success">{message}</div>}
          {error && <div className="auth-error">{error}</div>}

          <div className="verify-actions">
            <button 
              className="auth-submit" 
              onClick={handleResendVerification}
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Resend Verification Email'}
            </button>
            <button 
              className="auth-link"
              onClick={() => setMode('login')}
            >
              Back to Login
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