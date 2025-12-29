import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth } from '../firebase/config';

export const authService = {
  // Register new user with email verification
  async register(email, password) {
    try {
      // Create user account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Send verification email (OTP replacement - more secure)
      await sendEmailVerification(userCredential.user);
      
      // Log out user until they verify email
      await signOut(auth);
      
      return {
        success: true,
        user: userCredential.user,
        message: 'Account created! Please check your email for verification link.'
      };
    } catch (error) {
      return {
        success: false,
        error: this.getErrorMessage(error.code)
      };
    }
  },

  // Login user (only if email is verified)
  async login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Check if email is verified
      if (!userCredential.user.emailVerified) {
        await signOut(auth);
        return {
          success: false,
          error: 'Please verify your email before logging in. Check your inbox for the verification link.'
        };
      }
      
      return {
        success: true,
        user: userCredential.user
      };
    } catch (error) {
      return {
        success: false,
        error: this.getErrorMessage(error.code)
      };
    }
  },

  // Google Sign-In
  async signInWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      
      // Optional: Add custom parameters
      provider.setCustomParameters({
        prompt: 'select_account'
      });

      // Sign in with popup
      const result = await signInWithPopup(auth, provider);
      
      // The signed-in user info
      const user = result.user;
      
      // Google Access Token (if you need it)
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;

      return {
        success: true,
        user: user,
        token: token
      };
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      
      let errorMessage = 'Google sign-in failed. Please try again.';
      
      // Handle specific Google Sign-In errors
      switch (error.code) {
        case 'auth/popup-closed-by-user':
          errorMessage = 'Sign-in cancelled. Please try again.';
          break;
        case 'auth/popup-blocked':
          errorMessage = 'Popup was blocked. Please allow popups for this site.';
          break;
        case 'auth/account-exists-with-different-credential':
          errorMessage = 'An account already exists with this email using a different sign-in method.';
          break;
        case 'auth/cancelled-popup-request':
          errorMessage = 'Only one popup request is allowed at a time.';
          break;
        default:
          errorMessage = this.getErrorMessage(error.code);
      }

      return {
        success: false,
        error: errorMessage
      };
    }
  },

  // Logout user
  async logout() {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Listen to auth state changes
  onAuthChange(callback) {
    return onAuthStateChanged(auth, callback);
  },

  // Get current user
  getCurrentUser() {
    return auth.currentUser;
  },

  // Resend verification email
  async resendVerification() {
    try {
      const user = auth.currentUser;
      if (user && !user.emailVerified) {
        await sendEmailVerification(user);
        return { 
          success: true,
          message: 'Verification email sent! Check your inbox.' 
        };
      }
      return { 
        success: false, 
        error: user?.emailVerified ? 'Email already verified' : 'No user logged in' 
      };
    } catch (error) {
      return { 
        success: false, 
        error: error.message 
      };
    }
  },

  // Error message helper
  getErrorMessage(code) {
    const messages = {
      'auth/email-already-in-use': 'Email already registered. Please login instead.',
      'auth/invalid-email': 'Invalid email address.',
      'auth/operation-not-allowed': 'Operation not allowed.',
      'auth/weak-password': 'Password is too weak. Use at least 8 characters with uppercase and symbols.',
      'auth/user-disabled': 'This account has been disabled.',
      'auth/user-not-found': 'No account found with this email.',
      'auth/wrong-password': 'Incorrect password.',
      'auth/invalid-credential': 'Invalid email or password.',
      'auth/too-many-requests': 'Too many attempts. Please try again later.',
      'auth/network-request-failed': 'Network error. Please check your internet connection.'
    };
    return messages[code] || 'An error occurred. Please try again.';
  }
};