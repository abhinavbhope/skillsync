
'use client';

import Cookies from 'js-cookie';

const API_BASE_URL = '/api/auth';

/**
 * Gets the headers for API requests, including the CSRF token for mutations.
 * @param {string} method - The HTTP method for the request.
 */
const getHeaders = (method = 'GET') => {
    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    };

    const csrfMethods = ['POST', 'PUT', 'DELETE'];
    if (csrfMethods.includes(method.toUpperCase())) {
        const csrfToken = Cookies.get('XSRF-TOKEN');
        console.log('[getHeaders] CSRF Token from cookie:', csrfToken);
        if (csrfToken) {
            headers['X-XSRF-TOKEN'] = csrfToken;
        } else {
            console.warn('[getHeaders] CSRF token (XSRF-TOKEN) not found for a state-changing request.');
        }
    }
    
    return headers;
};


/**
 * Fetches the Google OAuth login URL from the backend.
 * The final redirect URL is appended on the client to ensure the user
 * returns to the correct page after logging in.
 * @param {string} redirectPath - The path to redirect to after successful login (e.g., '/analyzer').
 * @returns {Promise<string>} The full URL for Google OAuth login.
 */
export const getLoginUrl = async (redirectPath) => {
    console.log('[authApi] getLoginUrl: Fetching login URL from backend...');
    const response = await fetch(`${API_BASE_URL}/login`);

    if (!response.ok) {
        console.error('[authApi] getLoginUrl: Failed to get login URL.', response);
        throw new Error('Failed to get login URL.');
    }

    const data = await response.json();
    // Use the current window origin for a robust redirect URL
    const finalRedirectUrl = `${window.location.origin}${redirectPath || '/'}`;
    const fullUrl = `${data.url}?redirect=${encodeURIComponent(finalRedirectUrl)}`;
    console.log('[authApi] getLoginUrl: Constructed full login URL:', fullUrl);
    return fullUrl;
};

/**
 * Fetches the current authenticated user's profile information.
 * @returns {Promise<object|null>} The user object or null if not authenticated.
 */
export const getMe = async () => {
    console.log('[authApi] getMe: Attempting to fetch current user profile from /me');
    try {
        const response = await fetch(`${API_BASE_URL}/me`, {
            credentials: 'include',
            headers: getHeaders('GET'),
        });

        if (response.status === 401) {
            console.warn('[authApi] getMe: Received 401 Unauthorized. User is not authenticated.');
            return null; // This is an expected case for unauthenticated users.
        }

        if (!response.ok) {
            console.error(`[authApi] getMe: Failed to fetch user data. Status: ${response.status}`);
            throw new Error(`Failed to fetch user data. Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('[authApi] getMe: Successfully fetched user data.', data);
        return data && data.userId ? data : null;
    } catch(error) {
        console.error('[authApi] getMe: A network or other error occurred.', error);
        throw error; // Re-throw the error to be handled by the caller
    }
};


/**
 * Logs the user out by calling the backend endpoint.
 * This requires sending the CSRF token.
 */
export const logoutUser = async () => {
    console.log('[authApi] logoutUser: Attempting to log out via POST to /logout');
    const response = await fetch(`${API_BASE_URL}/logout`, {
        method: 'POST',
        credentials: 'include', // MUST send cookies
        headers: getHeaders('POST'),
        body: JSON.stringify({}), // POST body can't be empty
    });

    if (!response.ok) {
        // Even if the API call fails, we proceed with client-side logout
        console.error('[authApi] logoutUser: Logout API call failed.');
    } else {
        console.log('[authApi] logoutUser: Logout API call successful.');
    }
};

/**
 * Checks if the user has a valid session by hitting the /status endpoint.
 * @returns {Promise<{valid: boolean}>} True if the session is valid, false otherwise.
 */
export const getAuthStatus = async () => {
    console.log('[authApi] getAuthStatus: Checking session status via /status');
    try {
        const response = await fetch(`${API_BASE_URL}/status`, {
            credentials: 'include', // MUST send cookies
        });

        if (!response.ok) {
            console.error(`[authApi] getAuthStatus: Request failed with status ${response.status}`);
            return { valid: false };
        }
        const data = await response.json();
        console.log('[authApi] getAuthStatus: Received status:', data);
        return data;
    } catch (error) {
        console.error("[authApi] getAuthStatus: Auth status check failed with a network error.", error);
        return { valid: false };
    }
};
