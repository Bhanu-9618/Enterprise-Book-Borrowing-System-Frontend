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
    getBookCount: async (): Promise<number> => {
        const response = await api.get('/book/count');
        return response.data?.data || 0;
    },

    getBooksByCategory: async (category: string, page: number = 0, size: number = 16): Promise<PaginatedBooksResponse | null> => {
        const response = await api.get('/book/all', {
            params: { category, page, size }
        });
        if (response.data?.code === 200 && response.data.data) {
            return response.data.data;
        }
        return null;
    },

    searchBooks: async (term: string, page: number = 0, size: number = 16): Promise<PaginatedBooksResponse | null> => {
        const response = await api.get('/book/search', {
            params: { term, page, size }
        });
        if (response.data?.code === 200 && response.data.data) {
            return response.data.data;
        }
        return null;
    },

    getBookById: async (id: string | number): Promise<Book | null> => {
        try {
            const response = await api.get(`/book/id/${id}`);
            if (response.data?.code === 200 && response.data.data) {
                return response.data.data;
            }
            return null;
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response?.status === 404) return null;
            throw error;
        }
    },

    saveBook: async (bookData: Omit<Book, "id" | "available">): Promise<{ code: number; message: string; data?: Book }> => {
        const response = await api.post("/book/save", bookData);
        return response.data;
    },

    updateBook: async (book: Book): Promise<{ code: number; message: string; data?: Book }> => {
        const response = await api.put("/book/update", book);
        return response.data;
    },

    deleteBook: async (id: number): Promise<{ code: number; message: string }> => {
        const response = await api.delete(`/book/delete/${id}`);
        return response.data;
    },
};
