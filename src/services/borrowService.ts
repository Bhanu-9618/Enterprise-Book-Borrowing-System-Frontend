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
};
