// Error handling and logging utilities

export const errorHandler = {
  // Log errors (in production, send to error tracking service like Sentry)
  logError(error, context = '', additionalData = {}) {
    const errorLog = {
      timestamp: new Date().toISOString(),
      context,
      error: {
        message: error.message,
        code: error.code,
        stack: error.stack
      },
      ...additionalData
    };

    if (import.meta.env.MODE === 'production') {
      // In production, send to error tracking service
      console.error('[ERROR]', errorLog);
      // TODO: Send to Sentry or similar service
      // Sentry.captureException(error, { contexts: { custom: errorLog } });
    } else {
      // In development, log to console with details
      console.error(`[${context}]`, error);
      console.error('Additional data:', additionalData);
    }
  },

  // Get user-friendly error messages
  getUserMessage(error) {
    // Never expose internal errors to users
    const userFriendlyMessages = {
      // Firebase errors
      'permission-denied': 'You don\'t have permission to access this.',
      'not-found': 'Data not found.',
      'already-exists': 'This item already exists.',
      'network-request-failed': 'Network error. Please check your connection.',
      'unavailable': 'Service temporarily unavailable. Please try again.',
      'unauthenticated': 'Please sign in to continue.',
      'resource-exhausted': 'Too many requests. Please try again later.',
      
      // Auth errors
      'auth/user-not-found': 'No account found with this email.',
      'auth/wrong-password': 'Incorrect password.',
      'auth/invalid-credential': 'Invalid email or password.',
      'auth/email-already-in-use': 'Email already registered.',
      'auth/weak-password': 'Password is too weak.',
      'auth/too-many-requests': 'Too many attempts. Please try again later.',
      'auth/user-disabled': 'This account has been disabled.',
      
      // Storage errors
      'storage/unauthorized': 'Unauthorized to upload files.',
      'storage/canceled': 'Upload cancelled.',
      'storage/unknown': 'Upload failed. Please try again.',
      
      // Validation errors
      'validation/invalid-input': 'Invalid input. Please check your data.',
      'validation/file-too-large': 'File is too large. Maximum size is 5MB.',
      'validation/invalid-file-type': 'Invalid file type.',
    };

    const errorCode = error.code || error.type || '';
    return userFriendlyMessages[errorCode] || 'Something went wrong. Please try again.';
  },

  // Handle async errors with try-catch wrapper
  async handleAsync(asyncFunction, context = '', fallbackValue = null) {
    try {
      return await asyncFunction();
    } catch (error) {
      this.logError(error, context);
      return fallbackValue;
    }
  },

  // Create custom error
  createError(code, message, additionalData = {}) {
    const error = new Error(message);
    error.code = code;
    Object.assign(error, additionalData);
    return error;
  },

  // Validate and sanitize error before showing to user
  sanitizeError(error) {
    // Remove sensitive information from error
    const sanitized = {
      message: this.getUserMessage(error),
      timestamp: new Date().toISOString()
    };

    // Don't include stack traces or internal details
    return sanitized;
  }
};
