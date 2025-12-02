import Cookies from 'js-cookie';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const POLLING_INTERVAL = 5000; // 5 seconds

const getHeaders = (method = 'GET') => {
    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    };

    const csrfMethods = ['POST', 'PUT', 'DELETE'];
    if (csrfMethods.includes(method.toUpperCase())) {
        const csrfToken = Cookies.get('XSRF-TOKEN');
        if (csrfToken) {
            headers['X-XSRF-TOKEN'] = csrfToken;
        } else {
            console.warn('[analyzerApi:getHeaders] CSRF token not found.');
        }
    }
    
    return headers;
};

const handleResponse = async (response) => {
    if (response.status === 204) return;

    const contentType = response.headers.get('content-type');
    let data = {};

    if (contentType && contentType.includes('application/json')) {
        try { data = await response.json(); }
        catch (error) {
            console.warn('[handleResponse] JSON parse failed', error);
            data = { message: response.statusText };
        }
    } else {
        const text = await response.text();
        console.warn('[handleResponse] Non-JSON response:', text.substring(0, 200));
        data = { message: `Server error: ${response.status} ${response.statusText}` };
    }

    if (!response.ok) {
        const message = data.message || data.error || `Request failed: ${response.status}`;
        const error = new Error(message);
        error.status = response.status;
        error.data = data;
        throw error;
    }
    
    return data;
};

// ==========================
// PROFILE COMBINATIONS
// ==========================
export const getProfileCombinations = async () => {
    const response = await fetch(`${API_BASE_URL}/api/profile/combinations`, {
        method: 'GET',
        headers: getHeaders('GET'),
        credentials: 'include'
    });
    return handleResponse(response);
};

export const getProfileCombinationById = async (combinationId) => {
    const response = await fetch(`${API_BASE_URL}/api/profile/combinations/${combinationId}`, {
        method: 'GET',
        headers: getHeaders('GET'),
        credentials: 'include'
    });
    return handleResponse(response);
};

export const createProfileCombination = async (data, timeout = 120000) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(`${API_BASE_URL}/api/profile/analyze`, {
            method: 'POST',
            headers: getHeaders('POST'),
            credentials: 'include',
            body: JSON.stringify(data),
            signal: controller.signal
        });

        clearTimeout(timeoutId);
        return await handleResponse(response);
    } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
            throw new Error('Analysis timeout. Processing continues in background.');
        }
        throw error;
    }
};

export const updateProfileCombination = async (combinationId, data) => {
    const response = await fetch(`${API_BASE_URL}/api/profile/combinations/${combinationId}`, {
        method: 'PUT',
        headers: getHeaders('PUT'),
        credentials: 'include',
        body: JSON.stringify(data)
    });
    return handleResponse(response);
};

export const deleteProfileCombination = async (combinationId) => {
    const response = await fetch(`${API_BASE_URL}/api/profile/combinations/${combinationId}`, {
        method: 'DELETE',
        headers: getHeaders('DELETE'),
        credentials: 'include'
    });
    return handleResponse(response);
};

export const setPrimaryCombination = async (combinationId) => {
    const response = await fetch(`${API_BASE_URL}/api/profile/combinations/${combinationId}/primary`, {
        method: 'POST',
        headers: getHeaders('POST'),
        credentials: 'include',
        body: JSON.stringify({})
    });
    return handleResponse(response);
};

// ==========================
// GITHUB & LEETCODE
// ==========================
export const getGithubStats = async (githubUsername) => {
    const response = await fetch(
        `${API_BASE_URL}/api/github/raw-stats?githubUsername=${githubUsername}`,
        {
            method: 'GET',
            headers: getHeaders('GET'),
            credentials: 'include'
        }
    );
    return handleResponse(response);
};

export const fetchLeetcodeProfile = async (leetcodeUsername) => {
    const response = await fetch(
        `${API_BASE_URL}/api/leetcode/fetch?username=${leetcodeUsername}`,
        {
            method: 'POST',
            headers: getHeaders('POST'),
            credentials: 'include'
        }
    );
    return handleResponse(response);
};

export const getLeetcodeProfile = async (leetcodeUsername) => {
    const response = await fetch(
        `${API_BASE_URL}/api/leetcode/profile/${leetcodeUsername}`,
        {
            method: 'GET',
            headers: getHeaders('GET'),
            credentials: 'include'
        }
    );
    return handleResponse(response);
};

// ==========================
// AI ENRICHMENT
// ==========================
export const getEnrichmentStatus = async () => {
    const response = await fetch(`${API_BASE_URL}/api/status`, {
        method: 'GET',
        headers: getHeaders('GET'),
        credentials: 'include'
    });
    return handleResponse(response);
};

export const triggerEnrichment = async () => {
    const response = await fetch(`${API_BASE_URL}/api/profiles/enrich`, {
        method: 'POST',
        headers: getHeaders('POST'),
        credentials: 'include',
        body: JSON.stringify({})
    });
    return handleResponse(response);
};

export const getProcessingStatus = async () => {
    const response = await fetch(
        `${API_BASE_URL}/api/indepth/profiles/enriched/status`,
        {
            method: 'GET',
            headers: getHeaders('GET'),
            credentials: 'include'
        }
    );
    return handleResponse(response);
};

export const getEnrichedProfile = async () => {
    const response = await fetch(
        `${API_BASE_URL}/api/indepth/profiles/enriched`,
        {
            method: 'GET',
            headers: getHeaders('GET'),
            credentials: 'include'
        }
    );
    return handleResponse(response);
};

// Polling = unchanged
export const pollProcessingStatus = async (timeout = 300000, interval = 5000) => {
    const startTime = Date.now();
    let attempts = 0;

    while (Date.now() - startTime < timeout) {
        attempts++;
        try {
            const status = await getProcessingStatus();
            if (status.enriched) {
                return {
                    success: true,
                    data: status,
                    attempts,
                    elapsedTime: Date.now() - startTime
                };
            }
        } catch (e) {
            console.error('Polling error:', e);
        }
        await new Promise(res => setTimeout(res, interval));
    }

    return { success: false, error: 'Timeout during enrichment.' };
};

export const pollProcessingStatusWithProgress = async (
    onProgress,
    timeout = 300000,
    interval = 3000
) => {
    const startTime = Date.now();
    let attempts = 0;

    while (Date.now() - startTime < timeout) {
        attempts++;
        try {
            const status = await getProcessingStatus();
            const update = {
                attempts,
                githubEnriched: status.githubEnriched,
                leetcodeEnriched: status.leetcodeEnriched,
                fullyEnriched: status.enriched,
                elapsedTime: Date.now() - startTime,
                userId: status.userId
            };

            if (onProgress) onProgress(update);

            if (status.enriched) {
                return {
                    success: true,
                    data: status,
                    attempts,
                    elapsedTime: Date.now() - startTime
                };
            }
        } catch (e) {
            if (onProgress) onProgress({ error: e.message });
        }

        await new Promise(res => setTimeout(res, interval));
    }

    const error = 'Enrichment took too long.';
    if (onProgress) onProgress({ error });

    return { success: false, error, attempts };
};
