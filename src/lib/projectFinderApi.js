import Cookies from 'js-cookie';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL + '/api/opensource';

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
            console.warn('[projectFinderApi:getHeaders] CSRF token not found.');
        }
    }

    return headers;
};

const handleResponse = async (response) => {
    if (response.status === 204) return;

    const contentType = response.headers.get('content-type');
    let data = {};

    if (contentType && contentType.includes('application/json')) {
        try {
            data = await response.json();
        } catch (error) {
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

export const generateRecommendations = async (data) => {
    const response = await fetch(`${API_BASE_URL}/generate`, {
        method: 'POST',
        headers: getHeaders('POST'),
        credentials: 'include',
        body: JSON.stringify(data),
    });
    return handleResponse(response);
};

export const getStatus = async (jobId) => {
    const response = await fetch(`${API_BASE_URL}/status/${jobId}`, {
        headers: getHeaders('GET'),
        credentials: 'include',
    });
    return handleResponse(response);
};

export const getResults = async (jobId) => {
    const response = await fetch(`${API_BASE_URL}/result/${jobId}`, {
        headers: getHeaders('GET'),
        credentials: 'include',
    });
    return handleResponse(response);
};

export const getSaved = async () => {
    const response = await fetch(`${API_BASE_URL}/saved`, {
        headers: getHeaders('GET'),
        credentials: 'include',
    });
    return handleResponse(response);
};

export const deleteRecommendations = async () => {
    const response = await fetch(`${API_BASE_URL}/recommendations`, {
        method: 'DELETE',
        headers: getHeaders('DELETE'),
        credentials: 'include',
    });
    return handleResponse(response);
};
