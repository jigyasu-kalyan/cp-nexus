// JWT token and user data management utilities

const TOKEN_KEY = 'cp-nexus-token';
const USER_KEY = 'cp-nexus-user';

export interface User {
    id: string;
    email: string;
    username: string;
}

// Token management
export const setToken = (token: string): void => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(TOKEN_KEY, token);
    }
};

export const getToken = (): string | null => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem(TOKEN_KEY);
    }
    return null;
};

export const removeToken = (): void => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
    }
};

// User data management
export const setUser = (user: User): void => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
};

export const getUser = (): User | null => {
    if (typeof window !== 'undefined') {
        const userStr = localStorage.getItem(USER_KEY);
        if (userStr) {
            try {
                return JSON.parse(userStr);
            } catch {
                return null;
            }
        }
    }
    return null;
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
    return getToken() !== null;
};

// Logout helper
export const logout = (): void => {
    removeToken();
    if (typeof window !== 'undefined') {
        window.location.href = '/login';
    }
};

