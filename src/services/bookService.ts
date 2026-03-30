import api from '../lib/axios';

export interface Book {
    id: number;
    title: string;
    author: string;
    publisher: string;
    isbn: string;
    category: string;
    availableCopies: number;
    available: boolean;
}

export interface PaginatedBooksResponse {
    totalItems: number;
    books: Book[];
    totalPages: number;
    currentPage: number;
}

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

    /**
     * Fetches paginated books by category.
     * URL: http://localhost:8080/book/all
     */
    getBooksByCategory: async (category: string, page: number = 0, size: number = 16): Promise<PaginatedBooksResponse | null> => {
        try {
            const response = await api.get('/book/all', {
                params: { category, page, size }
            });
            if (response.data?.code === 200 && response.data.data) {
                return response.data.data;
            }
            return null;
        } catch (error) {
            console.error(`Error fetching books for category ${category}:`, error);
            return null;
        }
    }
};
