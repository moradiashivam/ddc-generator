import { z } from 'zod';

const ADMIN_EMAIL = 'moradiashivam@gmail.com';
const ADMIN_PASSWORD = 'S10hivam@1998';
const SESSION_KEY = 'admin_session';
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export type LoginCredentials = z.infer<typeof loginSchema>;

export function login(credentials: LoginCredentials): boolean {
  try {
    const validated = loginSchema.parse(credentials);
    
    if (validated.email === ADMIN_EMAIL && validated.password === ADMIN_PASSWORD) {
      const session = {
        timestamp: Date.now(),
        email: validated.email
      };
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Login validation error:', error);
    return false;
  }
}

export function logout(): void {
  localStorage.removeItem(SESSION_KEY);
}

export function checkSession(): boolean {
  try {
    const session = localStorage.getItem(SESSION_KEY);
    if (!session) return false;
    
    const { timestamp, email } = JSON.parse(session);
    const now = Date.now();
    
    // Check session timeout
    if (now - timestamp > SESSION_TIMEOUT) {
      logout();
      return false;
    }
    
    // Update session timestamp
    localStorage.setItem(SESSION_KEY, JSON.stringify({ timestamp: now, email }));
    return true;
  } catch (error) {
    console.error('Session check error:', error);
    return false;
  }
}

export function useSessionTimeout(): void {
  let timeoutId: number;

  const resetTimeout = () => {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => {
      if (checkSession()) {
        logout();
        window.location.href = '/admin/login';
      }
    }, SESSION_TIMEOUT);
  };

  // Set up event listeners for user activity
  window.addEventListener('mousemove', resetTimeout);
  window.addEventListener('keypress', resetTimeout);
  window.addEventListener('click', resetTimeout);
  window.addEventListener('scroll', resetTimeout);

  // Initial timeout
  resetTimeout();

  // Cleanup
  return () => {
    window.clearTimeout(timeoutId);
    window.removeEventListener('mousemove', resetTimeout);
    window.removeEventListener('keypress', resetTimeout);
    window.removeEventListener('click', resetTimeout);
    window.removeEventListener('scroll', resetTimeout);
  };
}