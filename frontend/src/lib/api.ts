import { getToken, removeToken } from './auth';

const BASE_URL = 'https://cp-nexus-backend.onrender.com/api/v1/';

interface FetchOptions extends RequestInit {
    data?: any;
}

const request = async (endpoint: string, options: FetchOptions = {}) => {
    const token = getToken();
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    if (options.headers) {
        Object.assign(headers, options.headers);
    }

    const config: RequestInit = {
        ...options,
        headers,
    };

    if (options.data) {
        config.body = JSON.stringify(options.data);
    }

    // Ensure no double slashes
    const url = `${BASE_URL.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`;
    const response = await fetch(url, config);

    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
        data = await response.json();
    } else {
        data = await response.text();
    }

    if (!response.ok) {
        if (response.status === 401) {
            removeToken();
            if (typeof window !== 'undefined') {
                window.location.href = '/login';
            }
        }

        const error: any = new Error(typeof data === 'string' ? data : (data?.message || response.statusText));
        error.response = {
            data: data,
            status: response.status,
            statusText: response.statusText,
        };
        throw error;
    }

    return {
        data,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
    };
};

const api = {
    get: (url: string, config?: FetchOptions) => request(url, { ...config, method: 'GET' }),
    post: (url: string, data?: any, config?: FetchOptions) => request(url, { ...config, method: 'POST', data }),
    put: (url: string, data?: any, config?: FetchOptions) => request(url, { ...config, method: 'PUT', data }),
    delete: (url: string, config?: FetchOptions) => request(url, { ...config, method: 'DELETE' }),
    patch: (url: string, data?: any, config?: FetchOptions) => request(url, { ...config, method: 'PATCH', data }),
};

export default api;