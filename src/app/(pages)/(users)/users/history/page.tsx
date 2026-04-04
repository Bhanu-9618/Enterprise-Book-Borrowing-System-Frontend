"use client";

import React, { useState, useEffect, Suspense, useCallback } from "react";
import Link from "next/link";
import { useAuthStore } from "@/src/store/useAuthStore";
import { borrowService, BorrowRecord } from "@/src/services/borrowService";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  ArrowLeft,
  ArrowRightLeft,
  Bookmark,
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import Image from "next/image";

import { ITEMS_PER_PAGE } from "@/src/lib/constants";

const statusConfig: Record<string, { bg: string; text: string; icon: React.ElementType }> = {
  REQUESTED: { bg: "bg-amber-100/90", text: "text-amber-800", icon: Clock },
  ISSUED: { bg: "bg-blue-100/90", text: "text-blue-800", icon: CheckCircle2 },
  OVERDUE: { bg: "bg-rose-100/90", text: "text-rose-800", icon: AlertCircle },
  RETURNED: { bg: "bg-emerald-100/90", text: "text-emerald-800", icon: CheckCircle2 },
};

const getStatus = (s: string) =>
  statusConfig[s] || { bg: "bg-slate-50", text: "text-slate-700", icon: XCircle };


function HistoryContent() {
  const [records, setRecords] = useState<BorrowRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const { id: userId } = useAuthStore();

  const fetchHistory = useCallback(async (page: number = 0) => {
    if (!userId) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const response = await borrowService.getBorrowHistoryByUserId(userId, page, ITEMS_PER_PAGE);
      if (response) {
        setRecords(response.history || []);
        setTotalPages(response.totalPages || 1);
        setTotalItems(response.totalItems || 0);
        setCurrentPage((response.currentPage ?? 0) + 1);
      } else {
        setRecords([]);
        setTotalPages(1);
        setTotalItems(0);
      }
    } catch (error) {
      console.error("Failed to fetch history:", error);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchHistory(0);
  }, [fetchHistory]);



  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-50">

      <div className="fixed inset-0 z-0">
        <Image
          src="/images/Admin dash.jpg"
          alt="Lumina Library History Background"
          fill
          priority
          quality={100}
          className="object-cover transition-transform duration-1000 scale-105"
        />
        <div className="absolute inset-0 z-10 bg-black/5 transition-opacity duration-700" />
        <div className="absolute inset-0 z-10 bg-white/20 backdrop-blur-[2px]" />
      </div>

      <main className="relative z-10 mx-auto px-4 py-8" style={{ maxWidth: "1800px" }}>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Bookmark className="h-5 w-5 text-blue-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.4)]" />
              <span className="text-sm font-black text-blue-600 uppercase tracking-widest drop-shadow-sm">My Account</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight drop-shadow-[0_1px_8px_rgba(255,255,255,1)]">Borrowing History</h1>
          </div>
          <Link href="/users">
            <Button className="h-12 px-8 rounded-2xl bg-white/80 border border-white/60 text-slate-800 font-black shadow-lg shadow-slate-900/5 hover:bg-white hover:scale-[1.02] active:scale-[0.98] transition-all backdrop-blur-xl">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>


        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] overflow-x-auto">
          <div className="min-w-[1200px]">

          <div className="grid grid-cols-[100px_1fr_120px_120px_120px_130px] gap-4 px-8 py-5 bg-white border-b border-slate-100">
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Borrow ID</span>
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Book ID</span>
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Borrow Date</span>
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Due Date</span>
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Return Date</span>
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Status</span>
          </div>


          {isLoading ? (
            <div className="space-y-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="grid grid-cols-[100px_1fr_120px_120px_120px_130px] gap-4 px-8 py-6 items-center animate-pulse border-b border-slate-100">
                  <div className="h-3 w-12 bg-slate-100 rounded" />
                  <div className="h-4 w-16 bg-slate-100 rounded" />
                  <div className="h-3 w-20 bg-slate-50 rounded" />
                  <div className="h-3 w-20 bg-slate-50 rounded" />
                  <div className="h-3 w-16 bg-slate-50 rounded" />
                  <div className="h-6 w-20 bg-slate-100 rounded-xl" />
                </div>
              ))}
            </div>
          ) : records.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <ArrowRightLeft className="h-16 w-16 text-slate-200 mb-4 opacity-50" />
              <h3 className="text-lg font-black text-slate-400 mb-1 leading-none">No history found</h3>
              <p className="text-slate-400 text-sm font-medium">Your borrowed books will appear here.</p>
            </div>
          ) : (
            <div>
              {records.map((rec, index) => {
                const st = getStatus(rec.status);
                const StatusIcon = st.icon;
                return (
                  <div
                    key={rec.borrowid}
                    className={`group grid grid-cols-[100px_1fr_120px_120px_120px_130px] gap-4 px-8 py-6 items-center hover:bg-white/40 transition-all duration-300 ${
                      index !== records.length - 1 ? "border-b border-white/20" : ""
                    }`}
                  >

                    <span className="text-xs font-black text-slate-900">#{rec.borrowid.toString().padStart(3, "0")}</span>


                    <div className="flex flex-col">
                      <span className="text-sm font-black text-slate-900">#{rec.bookid}</span>
                    </div>


                    <div className="flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span className="text-xs font-bold text-slate-800">{rec.borrowdate}</span>
                    </div>


                    <div className="flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span className="text-xs font-bold text-slate-800">{rec.dueDate}</span>
                    </div>


                    <span className="text-xs font-bold text-slate-600">
                      {rec.returnDate || (
                        <span className="text-slate-400 italic">—</span>
                      )}
                    </span>


                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-bold w-fit ${st.bg} ${st.text}`}>
                      <StatusIcon className="h-3.5 w-3.5" />
                      {rec.status}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
          </div>
        </div>


        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            <button
              onClick={() => fetchHistory(currentPage - 2)}
              disabled={currentPage === 1 || isLoading}
              className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/60 border border-white/60 text-slate-500 hover:text-slate-900 hover:bg-white disabled:opacity-30 transition-all backdrop-blur-md shadow-lg shadow-slate-900/5 overflow-hidden"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest px-6 drop-shadow-sm">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => fetchHistory(currentPage)}
              disabled={currentPage === totalPages || isLoading}
              className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/60 border border-white/60 text-slate-500 hover:text-slate-900 hover:bg-white disabled:opacity-30 transition-all backdrop-blur-md shadow-lg shadow-slate-900/5 overflow-hidden"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default function UserHistoryPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-400 font-bold">Loading records...</div>}>
      <HistoryContent />
    </Suspense>
  );
}
