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

export const userService = {
    /**
     * Fetches the total count of registered users.
     * Public access: No authentication required.
     */
    getUserCount: async (): Promise<number> => {
        try {
            const response = await api.get('/user/count');
            return response.data.data || 0;
        } catch (error) {
            console.error('Error fetching user count:', error);
            return 0;
        }
    },

    /**
     * Registers a new user/member.
     * URL: http://localhost:8080/auth/signup
     */
    signup: async (userData: UserSignupData) => {
        try {
            const response = await api.post('/auth/signup', userData);
            return response.data;
        } catch (error) {
            console.error('Signup error:', error);
            if (axios.isAxiosError(error)) {
                throw error.response?.data || { message: 'Signup failed. Please try again.' };
            }
            throw { message: 'An unexpected error occurred during signup.' };
        }
    },

    /**
     * Authenticates a user.
     * URL: http://localhost:8080/auth/login
     */
    login: async (loginData: UserLoginData): Promise<LoginResponse> => {
        try {
            const response = await api.post('/auth/login', loginData);
            return response.data;
        } catch (error: unknown) {
            // Silently throw for 401 (Invalid login) - handled by component
            if (axios.isAxiosError(error) && error.response?.status === 401) {
                throw error.response.data || { code: 401, message: 'Invalid email or password.' };
            }
            
            console.error('Login error:', error);
            if (axios.isAxiosError(error)) {
                throw error.response?.data || { message: 'Login failed. Please check your credentials.' };
            }
            throw { message: 'An unexpected error occurred during sign in.' };
        }
    },

    /**
     * Fetches all registered users.
     * URL: http://localhost:8080/user/all
     */
    getUsers: async (): Promise<UserData[]> => {
        try {
            const response = await api.get('/user/all');
            if (response.data?.code === 200 && Array.isArray(response.data.data)) {
                return response.data.data;
            }
            return [];
        } catch (error) {
            console.error('Error fetching users:', error);
            return [];
        }
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
            // Silently return null for 404 (common during real-time search)
            if (axios.isAxiosError(error) && error.response?.status === 404) {
                return null;
            }
            console.error(`Error searching user by ID ${id}:`, error);
            return null;
        }
    },

    /**
     * Updates an existing user's information.
     * URL: http://localhost:8080/user/update
     */
    updateUser: async (userData: UserData): Promise<{ code: number; message: string; data?: UserData }> => {
        try {
            const response = await api.put('/user/update', userData);
            return response.data;
        } catch (error) {
            console.error('Error updating user:', error);
            throw error;
        }
    },

    /**
     * Deletes a user by ID.
     * URL: http://localhost:8080/user/delete/{id}
     */
    deleteUser: async (id: number): Promise<{ code: number; message: string }> => {
        try {
            const response = await api.delete(`/user/delete/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error deleting user with ID ${id}:`, error);
            throw error;
        }
    },
    
    /**
     * Saves a new user to the system.
     * URL: http://localhost:8080/user/save
     */
    saveUser: async (userData: UserSignupData): Promise<{ code: number; message: string; data?: UserData }> => {
        try {
            const response = await api.post('/user/save', userData);
            return response.data;
        } catch (error) {
            console.error('Error saving user:', error);
            throw error;
        }
    }
};
