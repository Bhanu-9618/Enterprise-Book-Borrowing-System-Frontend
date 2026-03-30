import api from '../lib/axios';

export const bookService = {
    /**
     * Fetches the total count of books in the catalog.
     * Public access: No authentication required.
     */
    getBookCount: async (): Promise<number> => {
        try {
            const response = await api.get('/book/count');
            // Assuming the same response structure: { code, message, data }
            return response.data.data || 0;
        } catch (error) {
            console.error('Error fetching book count:', error);
            return 0;
        }
    },
};
