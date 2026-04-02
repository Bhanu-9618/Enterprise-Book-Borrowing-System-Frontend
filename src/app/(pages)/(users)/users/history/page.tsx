"use client";

import React, { useState, useEffect, Suspense } from "react";
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

const ITEMS_PER_PAGE = 8;

const statusConfig: Record<string, { bg: string; text: string; icon: React.ElementType }> = {
  REQUESTED: { bg: "bg-amber-100/90", text: "text-amber-800", icon: Clock },
  ISSUED: { bg: "bg-blue-100/90", text: "text-blue-800", icon: CheckCircle2 },
  OVERDUE: { bg: "bg-rose-100/90", text: "text-rose-800", icon: AlertCircle },
  RETURNED: { bg: "bg-emerald-100/90", text: "text-emerald-800", icon: CheckCircle2 },
};

const getStatus = (s: string) =>
  statusConfig[s] || { bg: "bg-slate-50", text: "text-slate-700", icon: XCircle };

// ========== COMPONENT ==========
function HistoryContent() {
  const [currentPage, setCurrentPage] = useState(1);
  const [records, setRecords] = useState<BorrowRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { id: userId } = useAuthStore();

  useEffect(() => {
    let isMounted = true;
    const fetchHistory = async () => {
      if (!userId) {
        setIsLoading(false);
        return;
      }
      try {
        const data = await borrowService.getBorrowHistoryByUserId(userId);
        if (isMounted) {
          setRecords(data);
        }
      } catch (error) {
        console.error("Failed to fetch history:", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchHistory();
    return () => { isMounted = false; };
  }, [userId]);

  // ----- Filtering -----
  const filteredRecords = records;

  // ----- Pagination -----
  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / ITEMS_PER_PAGE));
  const paginatedRecords = filteredRecords.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-50">
      {/* Background Image with Overlay */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105"
        style={{ backgroundImage: "url('/images/Lumina 3.jpg')" }}
      />
      <div className="fixed inset-0 z-0 bg-black/5 transition-opacity duration-700" />
      <div className="fixed inset-0 z-0 bg-white/20 backdrop-blur-[2px]" />

      <main className="relative z-10 mx-auto px-4 py-8" style={{ maxWidth: "1800px" }}>
        {/* Page Header (Match Admin Design) */}
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

        {/* Borrow Table (Match Admin Grid Style) */}
        <div className="bg-white/60 rounded-[2rem] border border-white/60 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] overflow-x-auto backdrop-blur-3xl">
          <div className="min-w-[1200px]">
          {/* Table Header */}
          <div className="grid grid-cols-[100px_1fr_120px_120px_120px_130px] gap-4 px-8 py-5 bg-white/30 border-b border-white/40">
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Borrow ID</span>
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Book ID</span>
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Borrow Date</span>
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Due Date</span>
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Return Date</span>
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Status</span>
          </div>

          {/* Table Body */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4 shadow-blue-500/20 shadow-lg"></div>
              <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest">Retrieving history...</h3>
            </div>
          ) : paginatedRecords.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <ArrowRightLeft className="h-16 w-16 text-slate-200 mb-4 opacity-50" />
              <h3 className="text-lg font-black text-slate-400 mb-1 leading-none">No history found</h3>
              <p className="text-slate-400 text-sm font-medium">Your borrowed books will appear here.</p>
            </div>
          ) : (
            <div>
              {paginatedRecords.map((rec, index) => {
                const st = getStatus(rec.status);
                const StatusIcon = st.icon;
                return (
                  <div
                    key={rec.borrowid}
                    className={`group grid grid-cols-[100px_1fr_120px_120px_120px_130px] gap-4 px-8 py-6 items-center hover:bg-white/40 transition-all duration-300 ${
                      index !== paginatedRecords.length - 1 ? "border-b border-white/20" : ""
                    }`}
                  >
                    {/* Borrow ID */}
                    <span className="text-xs font-black text-slate-900">#{rec.borrowid.toString().padStart(3, "0")}</span>

                    {/* Book ID */}
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-slate-900">#{rec.bookid}</span>
                    </div>

                    {/* Borrow Date */}
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span className="text-xs font-bold text-slate-800">{rec.borrowdate}</span>
                    </div>

                    {/* Due Date */}
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span className="text-xs font-bold text-slate-800">{rec.dueDate}</span>
                    </div>

                    {/* Return Date */}
                    <span className="text-xs font-bold text-slate-600">
                      {rec.returnDate || (
                        <span className="text-slate-400 italic">—</span>
                      )}
                    </span>

                    {/* Status */}
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

        {/* Pagination (Match Admin style) */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/60 border border-white/60 text-slate-500 hover:text-slate-900 hover:bg-white disabled:opacity-30 transition-all backdrop-blur-md shadow-lg shadow-slate-900/5 overflow-hidden"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`h-10 w-10 flex items-center justify-center rounded-xl text-sm font-black transition-all ${
                  currentPage === page
                    ? "bg-slate-900 text-white shadow-xl shadow-slate-900/20"
                    : "bg-white/60 border border-white/60 text-slate-500 hover:text-slate-900 hover:bg-white backdrop-blur-md"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
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
