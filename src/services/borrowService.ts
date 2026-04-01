import api from '../lib/axios';

export interface BorrowRecord {
  borrowid: number;
  borrowdate: string;
  dueDate: string;
  returnDate: string | null;
  status: string;
  bookid: number;
  userid: number;
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export const borrowService = {
  /**
   * Fetches the borrow history for a specific user ID.
   * URL: http://localhost:8080/borrow/search/{userId}
   */
  getBorrowHistoryByUserId: async (userId: number): Promise<BorrowRecord[]> => {
    try {
      const response = await api.get(`/borrow/search/${userId}`);
      if (response.data?.code === 200 && Array.isArray(response.data.data)) {
        return response.data.data;
      }
      return [];
    } catch (error) {
      console.error('Error fetching borrow history:', error);
      throw error;
    }
  },

  /**
   * Saves a new borrow record.
   * URL: http://localhost:8080/borrow/save
   */
  saveBorrow: async (payload: { bookid: number; userid: number }): Promise<ApiResponse<BorrowRecord | null>> => {
    try {
      const response = await api.post('/borrow/save', payload);
      return response.data;
    } catch (error) {
      console.error('Error saving borrow record:', error);
      throw error;
    }
  },

  /**
   * Fetches the total count of active borrowings.
   * URL: http://localhost:8080/borrow/count
   */
  getBorrowCount: async (): Promise<number> => {
    try {
      const response = await api.get('/borrow/count');
      if (response.data?.code === 200) {
        return response.data.data || 0;
      }
      return 0;
    } catch (error) {
      console.error('Error fetching borrow count:', error);
      return 0;
    }
  },

  /**
   * Fetches the total count of requested (pending) borrowings.
   * URL: http://localhost:8080/borrow/requested/count
   */
  getRequestedBorrowCount: async (): Promise<number> => {
    try {
      const response = await api.get('/borrow/requested/count');
      if (response.data?.code === 200) {
        return response.data.data || 0;
      }
      return 0;
    } catch (error) {
      console.error('Error fetching requested borrow count:', error);
      return 0;
    }
  },

  /**
   * Fetches the total count of overdue borrowings.
   * URL: http://localhost:8080/borrow/overdue/count
   */
  getOverdueBorrowCount: async (): Promise<number> => {
    try {
      const response = await api.get('/borrow/overdue/count');
      if (response.data?.code === 200) {
        return response.data.data || 0;
      }
      return 0;
    } catch (error) {
      console.error('Error fetching overdue borrow count:', error);
      return 0;
    }
  },
};
