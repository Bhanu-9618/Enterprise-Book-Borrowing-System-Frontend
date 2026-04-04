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
      if (axios.isAxiosError(error) && error.response?.status === 404) return null;
      throw error;
    }
  },

  saveBorrow: async (payload: { bookid: number; userid: number }): Promise<ApiResponse<BorrowRecord | null>> => {
    const response = await api.post('/borrow/save', payload);
    return response.data;
  },

  getBorrowCount: async (): Promise<number> => {
    const response = await api.get('/borrow/count');
    return response.data?.data || 0;
  },

  getRequestedBorrowCount: async (): Promise<number> => {
    const response = await api.get('/borrow/requested/count');
    return response.data?.data || 0;
  },

  getOverdueBorrowCount: async (): Promise<number> => {
    const response = await api.get('/borrow/overdue/count');
    return response.data?.data || 0;
  },

  getAllBorrows: async (page: number = 0, size: number = 10): Promise<PaginatedBorrowResponse | null> => {
    const response = await api.get('/borrow/all', { params: { page, size } });
    if (response.data?.code === 200 && response.data.data) {
      return response.data.data;
    }
    return null;
  },

  updateBorrow: async (payload: { borrowid: number; status: string }): Promise<ApiResponse<BorrowRecord | null>> => {
    const response = await api.put('/borrow/update', payload);
    return response.data;
  },

  getRequestedBorrows: async (page: number = 0, size: number = 10): Promise<PaginatedBorrowResponse | null> => {
    const response = await api.get('/borrow/requested', { params: { page, size } });
    if (response.data?.code === 200 && response.data.data) {
      return response.data.data;
    }
    return null;
  },

  getOverdueBorrows: async (page: number = 0, size: number = 10): Promise<PaginatedOverdueResponse | null> => {
    const response = await api.get('/borrow/overdue', { params: { page, size } });
    if (response.data?.code === 200 && response.data.data) {
      return response.data.data;
    }
    return null;
  },

  updateFinePayment: async (payload: { borrowId: number; status: string }): Promise<ApiResponse<unknown>> => {
    const response = await api.put('/fine/update-payment', null, {
        params: {
          borrowId: payload.borrowId,
          status: payload.status
        }
      });
      return response.data;
  }
};
