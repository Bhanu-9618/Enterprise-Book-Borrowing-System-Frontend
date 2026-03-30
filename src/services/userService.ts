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
    }
};
