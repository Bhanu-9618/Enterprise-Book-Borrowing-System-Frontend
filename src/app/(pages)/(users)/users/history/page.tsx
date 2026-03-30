"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
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

// ---------- Types ----------
interface BorrowRecord {
  id: number;
  borrowdate: string;
  dueDate: string;
  returnDate: string;
  status: string;
  bookTitle: string;
  bookid: number;
}

// ---------- Sample Data (Bhanu's History) ----------
const sampleRecords: BorrowRecord[] = [
  { id: 1, borrowdate: "2026-03-01", dueDate: "2026-03-15", returnDate: "", status: "ISSUED", bookTitle: "The Great Shadow", bookid: 1 },
  { id: 2, borrowdate: "2026-03-05", dueDate: "2026-03-19", returnDate: "2026-03-18", status: "RETURNED", bookTitle: "Echoes of Eternity", bookid: 2 },
  { id: 3, borrowdate: "2026-02-15", dueDate: "2026-03-01", returnDate: "2026-03-05", status: "RETURNED", bookTitle: "Whispers in the Wind", bookid: 3 },
  { id: 4, borrowdate: "2026-03-12", dueDate: "2026-03-26", returnDate: "", status: "ISSUED", bookTitle: "Clean Code", bookid: 4 },
  { id: 5, borrowdate: "2026-02-01", dueDate: "2026-02-15", returnDate: "", status: "OVERDUE", bookTitle: "The Lost Amulet", bookid: 5 },
  { id: 6, borrowdate: "2026-03-10", dueDate: "2026-03-24", returnDate: "2026-03-22", status: "RETURNED", bookTitle: "Crimson Peaks", bookid: 7 },
  { id: 7, borrowdate: "2026-03-20", dueDate: "2026-04-03", returnDate: "", status: "REQUESTED", bookTitle: "Midnight Sun", bookid: 10 },
];

const ITEMS_PER_PAGE = 8;

const statusConfig: Record<string, { bg: string; text: string; icon: React.ElementType }> = {
  REQUESTED: { bg: "bg-amber-50", text: "text-amber-700", icon: Clock },
  ISSUED: { bg: "bg-blue-50", text: "text-blue-700", icon: CheckCircle2 },
  OVERDUE: { bg: "bg-rose-50", text: "text-rose-700", icon: AlertCircle },
  RETURNED: { bg: "bg-emerald-50", text: "text-emerald-700", icon: CheckCircle2 },
};

const getStatus = (s: string) =>
  statusConfig[s] || { bg: "bg-slate-50", text: "text-slate-700", icon: XCircle };

// ========== COMPONENT ==========
function HistoryContent() {
  const [currentPage, setCurrentPage] = useState(1);

  // ----- Filtering -----
  const filteredRecords = sampleRecords;

  // ----- Pagination -----
  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / ITEMS_PER_PAGE));
  const paginatedRecords = filteredRecords.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto px-4 py-8" style={{ maxWidth: "1800px" }}>
        {/* Page Header (Match Admin Design) */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Bookmark className="h-5 w-5 text-blue-500" />
              <span className="text-sm font-bold text-blue-600 uppercase tracking-widest">My Account</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Borrowing History</h1>
          </div>
          <Link href="/users">
            <Button className="h-12 px-6 rounded-2xl bg-white border border-slate-200 text-slate-700 font-bold shadow-sm hover:bg-slate-50 hover:scale-[1.02] active:scale-[0.98] transition-all">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>





        {/* Borrow Table (Match Admin Grid Style) */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-x-auto">
          <div className="min-w-[800px]">
          {/* Table Header */}
          <div className="grid grid-cols-[80px_1fr_120px_120px_120px_130px] gap-4 px-8 py-4 bg-slate-50/80 border-b border-slate-100">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ID</span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Book Title</span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Borrow Date</span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Due Date</span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Return Date</span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</span>
          </div>

          {/* Table Body */}
          {paginatedRecords.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <ArrowRightLeft className="h-12 w-12 text-slate-200 mb-3" />
              <h3 className="text-sm font-bold text-slate-400 mb-1">No records found</h3>
              <p className="text-slate-400 text-xs">Try searching for another book title.</p>
            </div>
          ) : (
            <div>
              {paginatedRecords.map((rec, index) => {
                const st = getStatus(rec.status);
                const StatusIcon = st.icon;
                return (
                  <div
                    key={rec.id}
                    className={`group grid grid-cols-[80px_1fr_120px_120px_120px_130px] gap-4 px-8 py-5 items-center hover:bg-slate-50/60 transition-colors ${
                      index !== paginatedRecords.length - 1 ? "border-b border-slate-50" : ""
                    }`}
                  >
                    {/* ID */}
                    <span className="text-xs font-black text-slate-300">#{rec.id.toString().padStart(3, "0")}</span>

                    {/* Book Title */}
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-800 line-clamp-1">{rec.bookTitle}</span>
                      <span className="text-[10px] font-medium text-slate-400">BOOK ID: #{rec.bookid}</span>
                    </div>

                    {/* Borrow Date */}
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5 text-slate-300 shrink-0" />
                      <span className="text-xs font-medium text-slate-600">{rec.borrowdate}</span>
                    </div>

                    {/* Due Date */}
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5 text-slate-300 shrink-0" />
                      <span className="text-xs font-medium text-slate-600">{rec.dueDate}</span>
                    </div>

                    {/* Return Date */}
                    <span className="text-xs font-medium text-slate-500">
                      {rec.returnDate || (
                        <span className="text-slate-300 italic">—</span>
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
          <div className="flex items-center justify-center gap-2 mt-10">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="h-9 w-9 flex items-center justify-center rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-slate-900 hover:bg-slate-50 disabled:opacity-30 transition-all"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`h-9 w-9 flex items-center justify-center rounded-xl text-sm font-bold transition-all ${
                  currentPage === page
                    ? "bg-slate-900 text-white shadow-md shadow-slate-200"
                    : "bg-white border border-slate-100 text-slate-400 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="h-9 w-9 flex items-center justify-center rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-slate-900 hover:bg-slate-50 disabled:opacity-30 transition-all"
            >
              <ChevronRight className="h-4 w-4" />
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
