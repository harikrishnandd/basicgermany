// Simple admin authentication for blog panel
// Uses localStorage to persist session

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123'; // Change this!
const AUTH_KEY = 'blog_admin_authenticated';
const AUTH_EXPIRY_KEY = 'blog_admin_auth_expiry';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours


/**
 * Check if user is authenticated
 * @returns {boolean}
 */
export function isAuthenticated() {
  if (typeof window === 'undefined') return false;
  
  const auth = localStorage.getItem(AUTH_KEY);
  const expiry = localStorage.getItem(AUTH_EXPIRY_KEY);
  
  if (!auth || !expiry) return false;
  
  // Check if session expired
  if (Date.now() > parseInt(expiry)) {
    logout();
    return false;
  }
  
  return auth === 'true';
}

/**
 * Authenticate with password
 * @param {string} password - Admin password
 * @returns {boolean} - Success or failure
 */
export function authenticate(password) {
  // Trim whitespace from input to prevent copy-paste issues
  const trimmedPassword = password?.trim() || '';
  const expectedPassword = ADMIN_PASSWORD?.trim() || '';
  
  if (trimmedPassword === expectedPassword) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTH_KEY, 'true');
      localStorage.setItem(AUTH_EXPIRY_KEY, (Date.now() + SESSION_DURATION).toString());
    }
    return true;
  }
  return false;
}

/**
 * Logout and clear session
 */
export function logout() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(AUTH_EXPIRY_KEY);
  }
}

/**
 * Extend session expiry
 */
export function extendSession() {
  if (typeof window !== 'undefined' && isAuthenticated()) {
    localStorage.setItem(AUTH_EXPIRY_KEY, (Date.now() + SESSION_DURATION).toString());
  }
}

/**
 * Get remaining session time in minutes
 * @returns {number} - Minutes remaining
 */
export function getSessionRemaining() {
  if (typeof window === 'undefined') return 0;
  
  const expiry = localStorage.getItem(AUTH_EXPIRY_KEY);
  if (!expiry) return 0;
  
  const remaining = parseInt(expiry) - Date.now();
  return Math.max(0, Math.floor(remaining / (60 * 1000)));
}
