import axios from 'axios';
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
        const response = await api.get('/book/count');
        return response.data?.data || 0;
    },

    /**
     * Fetches paginated books by category.
     * URL: http://localhost:8080/book/all
     */
    getBooksByCategory: async (category: string, page: number = 0, size: number = 16): Promise<PaginatedBooksResponse | null> => {
        const response = await api.get('/book/all', {
            params: { category, page, size }
        });
        if (response.data?.code === 200 && response.data.data) {
            return response.data.data;
        }
        return null;
    },

    /**
     * Searches books by title or author.
     * URL: http://localhost:8080/book/search
     */
    searchBooks: async (term: string, page: number = 0, size: number = 16): Promise<PaginatedBooksResponse | null> => {
        const response = await api.get('/book/search', {
            params: { term, page, size }
        });
        if (response.data?.code === 200 && response.data.data) {
            return response.data.data;
        }
        return null;
    },

    /**
     * Searches a single book by ID.
     * URL: http://localhost:8080/book/id/{id}
     */
    getBookById: async (id: string | number): Promise<Book | null> => {
        try {
            const response = await api.get(`/book/id/${id}`);
            if (response.data?.code === 200 && response.data.data) {
                return response.data.data;
            }
            return null;
        } catch (error: unknown) {
            // Special case: 404 is a valid "not found" which we return as null
            if (axios.isAxiosError(error) && error.response?.status === 404) return null;
            throw error; // Let interceptor handle others
        }
    },

    /**
     * Saves a new book to the database.
     * URL: http://localhost:8080/book/save
     */
    saveBook: async (bookData: Omit<Book, "id" | "available">): Promise<{ code: number; message: string; data?: Book }> => {
        const response = await api.post("/book/save", bookData);
        return response.data;
    },

    /**
     * Updates an existing book in the database.
     * URL: http://localhost:8080/book/update
     */
    updateBook: async (book: Book): Promise<{ code: number; message: string; data?: Book }> => {
        const response = await api.put("/book/update", book);
        return response.data;
    },

    /**
     * Deletes a book from the database by its ID.
     * URL: http://localhost:8080/book/delete/{id}
     */
    deleteBook: async (id: number): Promise<{ code: number; message: string }> => {
        const response = await api.delete(`/book/delete/${id}`);
        return response.data;
    },
};
