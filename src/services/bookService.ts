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
    },

    /**
     * Searches books by title or author.
     * URL: http://localhost:8080/book/search
     */
    searchBooks: async (term: string, page: number = 0, size: number = 16): Promise<PaginatedBooksResponse | null> => {
        try {
            const response = await api.get('/book/search', {
                params: { term, page, size }
            });
            if (response.data?.code === 200 && response.data.data) {
                return response.data.data;
            }
            return null;
        } catch (error) {
            console.error(`Error searching books for term ${term}:`, error);
            return null;
        }
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
        } catch (error) {
            console.error(`Error fetching book with ID ${id}:`, error);
            return null;
        }
    },

    /**
     * Saves a new book to the database.
     * URL: http://localhost:8080/book/save
     */
    saveBook: async (bookData: Omit<Book, "id" | "available">): Promise<{ code: number; message: string; data?: Book }> => {
        try {
            const response = await api.post("/book/save", bookData);
            return response.data;
        } catch (error) {
            console.error("Error saving book:", error);
            throw error;
        }
    },
    /**
     * Updates an existing book in the database.
     * URL: http://localhost:8080/book/update
     */
    updateBook: async (book: Book): Promise<{ code: number; message: string; data?: Book }> => {
        try {
            const response = await api.put("/book/update", book);
            return response.data;
        } catch (error) {
            console.error("Error updating book:", error);
            throw error;
        }
    },
};
