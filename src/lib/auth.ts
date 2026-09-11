// ─── Auth Helpers ───
// Simple cookie-based passcode auth for private access

const AUTH_COOKIE = 'our-story-auth';
const AUTH_VALUE = 'authenticated';

export function getAuthCookieConfig() {
  return {
    name: AUTH_COOKIE,
    value: AUTH_VALUE,
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
  };
}

export function isAuthenticated(cookieValue: string | undefined): boolean {
  return cookieValue === AUTH_VALUE;
}

export const AUTH_COOKIE_NAME = AUTH_COOKIE;
export const AUTH_COOKIE_VALUE = AUTH_VALUE;
