import api from '../lib/axios';

export const userService = {
    /**
     * Fetches the total count of registered users.
     * Public access: No authentication required.
     */
    getUserCount: async (): Promise<number> => {
        try {
            const response = await api.get('/user/count');
            // Based on the error, the count is inside the 'data' property of the response object
            return response.data.data || 0;
        } catch (error) {
            console.error('Error fetching user count:', error);
            return 0; // Return 0 or handle error appropriately
        }
    },
};
