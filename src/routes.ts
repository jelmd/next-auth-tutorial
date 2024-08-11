export const publicRoutes = [
	'/',
	'/auth/new-verify',
	'/auth/new-password'
];

export const authRoutes = [
	'/auth/login',
	'/auth/register',
	'/auth/error',
	'/auth/reset'
];

/**
 * Every request which starts with this prefix needs to be passed no matter
 * whether a session is running or not.
 */
export const apiAuthPrefix = '/api/auth';

/**
 * Bla
 */
export const DEFAULT_LOGIN_REDIRECT = '/settings';