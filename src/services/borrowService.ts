import axios from 'axios';
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

export interface OverdueRecord {
  userid: number;
  borrowid: number;
  fineAmount: number;
  paymentStatus: string;
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface PaginatedBorrowResponse {
  totalItems: number;
  history: BorrowRecord[];
  totalPages: number;
  currentPage: number;
}

export interface PaginatedOverdueResponse {
  totalItems: number;
  overdueRecords: OverdueRecord[];
  totalPages: number;
  currentPage: number;
}

export const borrowService = {
  /**
   * Fetches paginated borrow history for a specific user ID.
   * URL: http://localhost:8080/borrow/search/{userid}?page=0&size=10
   */
  getBorrowHistoryByUserId: async (userId: number, page: number = 0, size: number = 10): Promise<PaginatedBorrowResponse | null> => {
    try {
      const response = await api.get(`/borrow/search/${userId}`, {
        params: { page, size }
      });
      if (response.data?.code === 200 && response.data.data) {
        return response.data.data;
      }
      return null;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      console.error('Error fetching borrow history:', error);
      return null;
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

  /**
   * Fetches paginated all borrow records.
   * URL: http://localhost:8080/borrow/all?page=0&size=10
   */
  getAllBorrows: async (page: number = 0, size: number = 10): Promise<PaginatedBorrowResponse | null> => {
    try {
      const response = await api.get('/borrow/all', { params: { page, size } });
      if (response.data?.code === 200 && response.data.data) {
        return response.data.data;
      }
      return null;
    } catch (error) {
      console.error('Error fetching all borrow records:', error);
      return null;
    }
  },

  /**
   * Updates the status of a borrow record.
   * URL: http://localhost:8080/borrow/update
   */
  updateBorrow: async (payload: { borrowid: number; status: string }): Promise<ApiResponse<BorrowRecord | null>> => {
    try {
      const response = await api.put('/borrow/update', payload);
      return response.data;
    } catch (error) {
      console.error('Error updating borrow record:', error);
      throw error;
    }
  },

  /**
   * Fetches paginated all requested (pending) borrow records.
   * URL: http://localhost:8080/borrow/requested?page=0&size=10
   */
  getRequestedBorrows: async (page: number = 0, size: number = 10): Promise<PaginatedBorrowResponse | null> => {
    try {
      const response = await api.get('/borrow/requested', { params: { page, size } });
      if (response.data?.code === 200 && response.data.data) {
        return response.data.data;
      }
      return null;
    } catch (error) {
      console.error('Error fetching requested borrow records:', error);
      return null;
    }
  },

  /**
   * Fetches paginated overdue borrow records.
   * URL: http://localhost:8080/borrow/overdue?page=0&size=10
   */
  getOverdueBorrows: async (page: number = 0, size: number = 10): Promise<PaginatedOverdueResponse | null> => {
    try {
      const response = await api.get('/borrow/overdue', { params: { page, size } });
      if (response.data?.code === 200 && response.data.data) {
        return response.data.data;
      }
      return null;
    } catch (error) {
      console.error('Error fetching overdue borrow records:', error);
      return null;
    }
  },

  /**
   * Updates fine payment status
   * URL: http://localhost:8080/fine/update-payment
   */
  updateFinePayment: async (payload: { borrowId: number; status: string }): Promise<ApiResponse<unknown>> => {
    try {
      const response = await api.put('/fine/update-payment', null, {
        params: {
          borrowId: payload.borrowId,
          status: payload.status
        }
      });
      return response.data;
    } catch (error: unknown) {
      console.error('Error updating fine payment:', error);
      const err = error as { response?: { status?: number; data?: { message?: string } } };
      return {
        code: err.response?.status || 500,
        message: err.response?.data?.message || 'Error updating payment status',
        data: null
      };
    }
  }
};
