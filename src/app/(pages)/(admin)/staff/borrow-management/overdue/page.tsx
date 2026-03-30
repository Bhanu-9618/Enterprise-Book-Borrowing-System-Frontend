"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import {
  Search,
  Edit3,
  X,
  Save,
  ChevronLeft,
  ChevronRight,
  Calendar,
  BookOpen,
  User,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  DollarSign,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";

// ---------- Types ----------
interface BorrowRecord {
  id: number;
  borrowdate: string;
  dueDate: string;
  returnDate: string;
  status: string;
  bookid: number;
  userid: number;
}

// ---------- Sample Data (only OVERDUE records) ----------
const sampleRecords: BorrowRecord[] = [
  { id: 3, borrowdate: "2026-02-20", dueDate: "2026-03-06", returnDate: "", status: "OVERDUE", bookid: 3, userid: 4 },
  { id: 7, borrowdate: "2026-02-10", dueDate: "2026-02-24", returnDate: "", status: "OVERDUE", bookid: 7, userid: 6 },
  { id: 11, borrowdate: "2026-01-15", dueDate: "2026-01-29", returnDate: "", status: "OVERDUE", bookid: 2, userid: 3 },
  { id: 14, borrowdate: "2026-02-01", dueDate: "2026-02-15", returnDate: "", status: "OVERDUE", bookid: 10, userid: 2 },
  { id: 17, borrowdate: "2026-03-01", dueDate: "2026-03-15", returnDate: "", status: "OVERDUE", bookid: 5, userid: 8 },
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
function OverdueManagementContent() {
  const [records, setRecords] = useState<BorrowRecord[]>(sampleRecords);
  const [searchUserId, setSearchUserId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState<BorrowRecord | null>(null);
  const [formData, setFormData] = useState({
    borrowdate: "",
    dueDate: "",
    returnDate: "",
    status: "",
    bookid: 0,
    userid: 0,
  });

  const [showFineModal, setShowFineModal] = useState(false);
  const [fineDetails, setFineDetails] = useState({
    fineAmount: 150.0,
    userId: 0,
    userName: "Bhanu",
    paymentStatus: "UNPAID",
  });

  // ----- Filtering (only show OVERDUE) -----
  const filteredRecords = records.filter((rec) => {
    if (rec.status !== "OVERDUE") return false;
    if (!searchUserId.trim()) return true;
    return rec.userid.toString() === searchUserId.trim();
  });

  // ----- Pagination -----
  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / ITEMS_PER_PAGE));
  const paginatedRecords = filteredRecords.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // ----- Handlers -----
  const openEditModal = (rec: BorrowRecord) => {
    setEditingRecord(rec);
    setFormData({
      borrowdate: rec.borrowdate,
      dueDate: rec.dueDate,
      returnDate: rec.returnDate,
      status: rec.status,
      bookid: rec.bookid,
      userid: rec.userid,
    });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!formData.bookid || !formData.userid) return;
    if (editingRecord) {
      setRecords((prev) =>
        prev.map((r) => (r.id === editingRecord.id ? { ...r, ...formData } : r))
      );
    }
    setShowModal(false);
    setEditingRecord(null);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "bookid" || name === "userid" ? parseInt(value) || 0 : value,
    }));
  };

  const markReturned = (rec: BorrowRecord) => {
    setRecords((prev) =>
      prev.map((r) =>
        r.id === rec.id
          ? { ...r, status: "RETURNED", returnDate: new Date().toISOString().split("T")[0] }
          : r
      )
    );
  };

  const handleFine = (rec: BorrowRecord) => {
    const due = new Date(rec.dueDate);
    const today = new Date();
    const days = Math.max(0, Math.floor((today.getTime() - due.getTime()) / (1000 * 60 * 60 * 24)));
    
    setFineDetails({
      fineAmount: days * 0.5 > 0 ? days * 0.5 : 150.0, // Use 150 as a default if calculation is 0 for demo
      userId: rec.userid,
      userName: "Bhanu", // Mock name as requested
      paymentStatus: "UNPAID",
    });
    setShowFineModal(true);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto px-4 py-6" style={{ maxWidth: "1800px" }}>
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-5 w-5 text-rose-500" />
              <span className="text-sm font-bold text-rose-600 uppercase tracking-widest">Overdue Records</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Overdue Management</h1>
            <p className="text-slate-500 font-medium mt-1">{filteredRecords.length} overdue items need attention</p>
          </div>
          <Link href="/staff/borrow-management">
            <Button
              className="h-12 px-6 rounded-2xl bg-white border border-slate-200 text-slate-700 font-bold shadow-sm hover:bg-slate-50 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to All Records
            </Button>
          </Link>
        </div>

        {/* Search by User ID */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="relative group max-w-xs flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 transition-colors group-focus-within:text-rose-500" />
            <Input
              placeholder="Search by User ID..."
              value={searchUserId}
              onChange={(e) => {
                setSearchUserId(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-11 h-11 bg-white border-slate-100 rounded-xl text-sm font-medium shadow-sm focus:ring-4 focus:ring-rose-500/5 focus:border-rose-500/20"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-100 text-rose-700 text-sm font-bold ring-2 ring-rose-300">
              <AlertCircle className="h-4 w-4" />
              OVERDUE ONLY
            </span>
          </div>
        </div>

        {/* Overdue Records Table */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-x-auto">
          <div className="min-w-[1000px]">
          {/* Table Header */}
          <div className="grid grid-cols-[50px_0.7fr_0.7fr_0.7fr_0.6fr_0.5fr_0.5fr_160px] gap-3 px-5 py-3 bg-slate-50/80 border-b border-slate-100">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ID</span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Borrow Date</span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Due Date</span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Return Date</span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Book ID</span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">User ID</span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</span>
          </div>

          {/* Table Body */}
          {paginatedRecords.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <AlertCircle className="h-12 w-12 text-slate-200 mb-3" />
              <h3 className="text-sm font-bold text-slate-400 mb-1">No overdue records</h3>
              <p className="text-slate-400 text-xs">All borrowers are on time. Great job!</p>
            </div>
          ) : (
            <div>
              {paginatedRecords.map((rec, index) => {
                const st = getStatus(rec.status);
                const StatusIcon = st.icon;
                return (
                  <div
                    key={rec.id}
                    className={`group grid grid-cols-[50px_0.7fr_0.7fr_0.7fr_0.6fr_0.5fr_0.5fr_160px] gap-3 px-5 py-3.5 items-center hover:bg-rose-50/30 transition-colors ${index !== paginatedRecords.length - 1 ? "border-b border-slate-50" : ""
                      }`}
                  >
                    {/* ID */}
                    <span className="text-xs font-black text-slate-300">#{rec.id.toString().padStart(3, "0")}</span>

                    {/* Borrow Date */}
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3 w-3 text-slate-300 shrink-0" />
                      <span className="text-xs font-medium text-slate-600">{rec.borrowdate}</span>
                    </div>

                    {/* Due Date */}
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3 w-3 text-slate-300 shrink-0" />
                      <span className="text-xs font-medium text-slate-600">{rec.dueDate}</span>
                    </div>

                    {/* Return Date */}
                    <span className="text-xs font-medium text-slate-500">
                      {rec.returnDate || (
                        <span className="text-slate-300 italic">—</span>
                      )}
                    </span>

                    {/* Status */}
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold w-fit ${st.bg} ${st.text}`}>
                      <StatusIcon className="h-3 w-3" />
                      {rec.status}
                    </span>

                    {/* Book ID */}
                    <div className="flex items-center gap-1.5">
                      <BookOpen className="h-3 w-3 text-slate-300 shrink-0" />
                      <span className="text-xs font-bold text-slate-600">#{rec.bookid}</span>
                    </div>

                    {/* User ID */}
                    <div className="flex items-center gap-1.5">
                      <User className="h-3 w-3 text-slate-300 shrink-0" />
                      <span className="text-xs font-bold text-slate-600">#{rec.userid}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleFine(rec)}
                        className="h-7 px-3 flex items-center gap-1 rounded-lg text-[10px] font-bold text-orange-600 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 hover:from-orange-100 hover:to-amber-100 hover:text-orange-700 hover:shadow-sm transition-all"
                      >
                        <DollarSign className="h-3 w-3" />
                        FINE
                      </button>
                      <button
                        onClick={() => markReturned(rec)}
                        title="Mark as Returned"
                        className="h-7 px-2 flex items-center gap-1 rounded-lg text-[10px] font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 transition-all"
                      >
                        <CheckCircle2 className="h-3 w-3" />
                        Return
                      </button>
                      <button
                        onClick={() => openEditModal(rec)}
                        className="h-7 w-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="h-9 w-9 flex items-center justify-center rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-slate-900 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`h-9 w-9 flex items-center justify-center rounded-xl text-sm font-bold transition-all ${currentPage === page
                  ? "bg-slate-900 text-white shadow-md"
                  : "bg-white border border-slate-100 text-slate-400 hover:text-slate-900 hover:bg-slate-50"
                  }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="h-9 w-9 flex items-center justify-center rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-slate-900 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </main>

      {/* ========== EDIT MODAL ========== */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />

          <div className="relative w-full max-w-lg bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between px-8 pt-8 pb-4">
              <div>
                <h2 className="text-xl font-black text-slate-900">Edit Borrow Record</h2>
                <p className="text-sm text-slate-400 font-medium mt-0.5">
                  {editingRecord
                    ? `Editing #${editingRecord.id.toString().padStart(3, "0")}`
                    : "Updating record details"}
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="h-10 w-10 flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form */}
            <div className="px-8 pb-8 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                {/* Book ID */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Book ID</label>
                  <div className="relative group">
                    <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 transition-colors group-focus-within:text-rose-500" />
                    <Input name="bookid" type="number" min={0} placeholder="0" value={formData.bookid} onChange={handleFormChange} className="pl-11 h-12 bg-slate-50/50 border-slate-100 rounded-xl font-medium focus:bg-white focus:ring-4 focus:ring-rose-500/5" />
                  </div>
                </div>

                {/* User ID */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">User ID</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 transition-colors group-focus-within:text-rose-500" />
                    <Input name="userid" type="number" min={0} placeholder="0" value={formData.userid} onChange={handleFormChange} className="pl-11 h-12 bg-slate-50/50 border-slate-100 rounded-xl font-medium focus:bg-white focus:ring-4 focus:ring-rose-500/5" />
                  </div>
                </div>
              </div>

              {/* Borrow Date */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Borrow Date</label>
                <div className="relative group">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                  <Input name="borrowdate" type="date" value={formData.borrowdate} onChange={handleFormChange} className="pl-11 h-12 bg-slate-50/50 border-slate-100 rounded-xl font-medium focus:bg-white focus:ring-4 focus:ring-rose-500/5" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Due Date */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Due Date</label>
                  <div className="relative group">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                    <Input name="dueDate" type="date" value={formData.dueDate} onChange={handleFormChange} className="pl-11 h-12 bg-slate-50/50 border-slate-100 rounded-xl font-medium focus:bg-white focus:ring-4 focus:ring-rose-500/5" />
                  </div>
                </div>

                {/* Return Date */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Return Date</label>
                  <div className="relative group">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                    <Input name="returnDate" type="date" value={formData.returnDate} onChange={handleFormChange} className="pl-11 h-12 bg-slate-50/50 border-slate-100 rounded-xl font-medium focus:bg-white focus:ring-4 focus:ring-rose-500/5" />
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Status</label>
                <div className="flex gap-2">
                  {["REQUESTED", "ISSUED", "OVERDUE", "RETURNED"].map((s) => {
                    const cfg = getStatus(s);
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, status: s }))}
                        className={`flex-1 h-11 flex items-center justify-center gap-1.5 rounded-xl border text-xs font-bold transition-all ${formData.status === s
                          ? `${cfg.bg} ${cfg.text} border-current ring-2 ring-current/10`
                          : "border-slate-100 text-slate-400 hover:bg-slate-50"
                          }`}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Save Button */}
              <div className="pt-3">
                <Button
                  onClick={handleSave}
                  disabled={!formData.bookid || !formData.userid}
                  className="h-14 w-full rounded-2xl bg-gradient-to-r from-rose-600 to-rose-400 text-white font-bold text-base shadow-xl shadow-rose-500/25 hover:scale-[1.02] hover:shadow-2xl hover:shadow-rose-500/30 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none"
                >
                  <Save className="h-5 w-5 mr-2" />
                  Update Record
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========== FINE DETAILS MODAL ========== */}
      <FineDetailsModal 
        show={showFineModal} 
        onClose={() => setShowFineModal(false)} 
        details={fineDetails} 
      />

    </div>
  );
}

// ========== FINE MODAL ==========
function FineDetailsModal({ 
  show, 
  onClose, 
  details 
}: { 
  show: boolean; 
  onClose: () => void; 
  details: { fineAmount: number; userId: number; userName: string; paymentStatus: string } 
}) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-sm bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-gradient-to-br from-orange-500 to-amber-400 p-8 text-white text-center">
          <div className="mx-auto w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-sm">
            <DollarSign className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-black tracking-tight">Fine Details</h2>
          <p className="text-orange-50/80 text-sm font-medium mt-1">Outstanding payment required</p>
        </div>

        <div className="px-8 py-8 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">User Name</p>
              <p className="text-sm font-bold text-slate-700">{details.userName}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">User ID</p>
              <p className="text-sm font-bold text-slate-700">#{details.userId}</p>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Amount</p>
              <p className="text-2xl font-black text-slate-900">${details.fineAmount.toFixed(2)}</p>
            </div>
            <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-[10px] font-black uppercase tracking-tighter">
              {details.paymentStatus}
            </span>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={() => {
                alert("Payment Processed Successfully!");
                onClose();
              }}
              className="w-full h-14 rounded-2xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 group shadow-xl shadow-slate-200"
            >
              <CheckCircle2 className="h-5 w-5 text-emerald-400 group-hover:scale-110 transition-transform" />
              PAID
            </Button>
            
            <button 
              onClick={onClose}
              className="w-full py-2 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors"
            >
              Close and pay later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OverdueManagementPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-400 font-bold">Loading overdue records...</div>}>
      <OverdueManagementContent />
    </Suspense>
  );
}
