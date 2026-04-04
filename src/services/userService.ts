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
    /**
     * Fetches the total count of registered users.
     * Public access: No authentication required.
     */
    getUserCount: async (): Promise<number> => {
        const response = await api.get('/user/count');
        return response.data?.data || 0;
    },

    /**
     * Registers a new user/member.
     * URL: http://localhost:8080/auth/signup
     */
    signup: async (userData: UserSignupData) => {
        const response = await api.post('/auth/signup', userData);
        return response.data;
    },

    /**
     * Authenticates a user.
     * URL: http://localhost:8080/auth/login
     */
    login: async (loginData: UserLoginData): Promise<LoginResponse> => {
        const response = await api.post('/auth/login', loginData);
        return response.data;
    },

    /**
     * Fetches paginated registered users.
     * URL: http://localhost:8080/user/all?page=0&size=10
     */
    getUsers: async (page: number = 0, size: number = 10): Promise<PaginatedUsersResponse | null> => {
        const response = await api.get('/user/all', { params: { page, size } });
        if (response.data?.code === 200 && response.data.data) {
            return response.data.data;
        }
        return null;
    },

    /**
     * Searches for users by term (name or ID).
     * URL: http://localhost:8080/user/search?term=john&page=0&size=10
     */
    searchUsers: async (term: string, page: number = 0, size: number = 10): Promise<PaginatedUsersResponse | null> => {
        const response = await api.get('/user/search', { params: { term, page, size } });
        if (response.data?.code === 200 && response.data.data) {
            return response.data.data;
        }
        return null;
    },

    /**
     * Searches for a user by ID.
     * URL: http://localhost:8080/user/search/{id}
     */
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

    /**
     * Updates an existing user's information.
     * URL: http://localhost:8080/user/update
     */
    updateUser: async (userData: UserData): Promise<{ code: number; message: string; data?: UserData }> => {
        const response = await api.put('/user/update', userData);
        return response.data;
    },

    /**
     * Deletes a user by ID.
     * URL: http://localhost:8080/user/delete/{id}
     */
    deleteUser: async (id: number): Promise<{ code: number; message: string }> => {
        const response = await api.delete(`/user/delete/${id}`);
        return response.data;
    },
    
    /**
     * Saves a new user to the system.
     * URL: http://localhost:8080/user/save
     */
    saveUser: async (userData: UserSignupData): Promise<{ code: number; message: string; data?: UserData }> => {
        const response = await api.post('/user/save', userData);
        return response.data;
    }
};
