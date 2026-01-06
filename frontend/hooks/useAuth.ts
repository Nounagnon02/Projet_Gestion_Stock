import { create } from 'zustand';
import api from '@/lib/axios';
import { useRouter } from 'next/navigation';

interface User {
    id: number;
    name: string;
    email: string;
    roles?: any[];
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (credentials: any) => Promise<void>;
    register: (data: any) => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
}

export const useAuth = create<AuthState>((set, get) => ({
    user: null,
    token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
    isAuthenticated: false,
    isLoading: true,

    login: async (credentials) => {
        try {
            // Get CSRF cookie for Sanctum if needed, but for token based:
            // await api.get('/sanctum/csrf-cookie'); 
            const response = await api.post('/login', credentials);
            const { token, user } = response.data;

            localStorage.setItem('token', token);
            set({ token, user, isAuthenticated: true });
        } catch (error) {
            console.error('Login failed', error);
            throw error;
        }
    },

    register: async (data) => {
        try {
            const response = await api.post('/register', data);
            const { token, user } = response.data;

            localStorage.setItem('token', token);
            set({ token, user, isAuthenticated: true });
        } catch (error) {
            console.error('Registration failed', error);
            throw error;
        }
    },

    logout: async () => {
        try {
            await api.post('/logout');
        } catch (error) {
            console.error('Logout failed', error);
        } finally {
            localStorage.removeItem('token');
            set({ user: null, token: null, isAuthenticated: false });
        }
    },

    checkAuth: async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            set({ isLoading: false, isAuthenticated: false });
            return;
        }

        try {
            const response = await api.get('/me');
            set({ user: response.data, isAuthenticated: true, isLoading: false });
        } catch (error) {
            console.error('Check auth failed', error);
            localStorage.removeItem('token');
            set({ user: null, token: null, isAuthenticated: false, isLoading: false });
        }
    }
}));
