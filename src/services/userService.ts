import axios from 'axios';
import api from '../lib/axios';

export interface UserSignupData {
    name: string;
    email: string;
    phone: string;
    address: string;
    membershipdate: string;
    password: string;
}

export interface UserLoginData {
    email: string;
    password: string;
}

export interface LoginResponse {
    code: number;
    message: string;
    data: {
        role: 'ADMIN' | 'USER';
        name: string;
        id: number;
        email: string;
        token: string;
    };
}

export interface UserData {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    membershipdate: string;
    password: string;
    role: "ADMIN" | "USER";
    isActive: boolean;
}

export interface PaginatedUsersResponse {
    totalItems: number;
    users: UserData[];
    totalPages: number;
    currentPage: number;
}

export const userService = {
    getUserCount: async (): Promise<number> => {
        try {
            const response = await api.get('/user/count');
            return response.data?.data || 0;
        } catch (error) {
            console.error("Failed to fetch user count:", error);
            return 0;
        }
    },

    signup: async (userData: UserSignupData) => {
        const response = await api.post('/auth/signup', userData);
        return response.data;
    },

    login: async (loginData: UserLoginData): Promise<LoginResponse> => {
        const response = await api.post('/auth/login', loginData);
        return response.data;
    },

    getUsers: async (page: number = 0, size: number = 10): Promise<PaginatedUsersResponse | null> => {
        const response = await api.get('/user/all', { params: { page, size } });
        if (response.data?.code === 200 && response.data.data) {
            return response.data.data;
        }
        return null;
    },

    searchUsers: async (term: string, page: number = 0, size: number = 10): Promise<PaginatedUsersResponse | null> => {
        const response = await api.get('/user/search', { params: { term, page, size } });
        if (response.data?.code === 200 && response.data.data) {
            return response.data.data;
        }
        return null;
    },

    getUserById: async (id: string | number): Promise<UserData | null> => {
        try {
            const response = await api.get(`/user/search/${id}`);
            if (response.data?.code === 200 && response.data.data) {
                return response.data.data;
            }
            return null;
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response?.status === 404) return null;
            throw error;
        }
    },

    updateUser: async (userData: UserData): Promise<{ code: number; message: string; data?: UserData }> => {
        const response = await api.put('/user/update', userData);
        return response.data;
    },

    deleteUser: async (id: number): Promise<{ code: number; message: string }> => {
        const response = await api.delete(`/user/delete/${id}`);
        return response.data;
    },
    
    saveUser: async (userData: UserSignupData): Promise<{ code: number; message: string; data?: UserData }> => {
        const response = await api.post('/user/save', userData);
        return response.data;
    }
};
