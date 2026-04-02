"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  ArrowRightLeft,
  Plus,
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
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";

import { borrowService, BorrowRecord } from "@/src/services/borrowService";


const ITEMS_PER_PAGE = 8;

const emptyRecord: Omit<BorrowRecord, "borrowid"> = {
  borrowdate: new Date().toISOString().split("T")[0],
  dueDate: "",
  returnDate: "",
  status: "REQUESTED",
  bookid: 0,
  userid: 0,
};

const statusConfig: Record<string, { bg: string; text: string; icon: React.ElementType }> = {
  REQUESTED: { bg: "bg-amber-50", text: "text-amber-700", icon: Clock },
  ISSUED: { bg: "bg-blue-50", text: "text-blue-700", icon: CheckCircle2 },
  OVERDUE: { bg: "bg-rose-50", text: "text-rose-700", icon: AlertCircle },
  RETURNED: { bg: "bg-emerald-50", text: "text-emerald-700", icon: CheckCircle2 },
};

const getStatus = (s: string) =>
  statusConfig[s] || { bg: "bg-slate-50", text: "text-slate-700", icon: XCircle };

// ========== COMPONENT ==========
function BorrowManagementContent() {
  const searchParams = useSearchParams();
  const [records, setRecords] = useState<BorrowRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchUserId, setSearchUserId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState<BorrowRecord | null>(null);
  const [formData, setFormData] = useState<Omit<BorrowRecord, "borrowid">>(emptyRecord);
  const [filterStatus, setFilterStatus] = useState<string | null>(searchParams.get("status"));

  // Sync state with URL search params (Navbar navigation)
  React.useEffect(() => {
    const status = searchParams.get("status");
    setFilterStatus(status);
  }, [searchParams]);

  const fetchRecords = async (status: string | null = null, searchId: string = "") => {
    setLoading(true);
    let data: BorrowRecord[] = [];

    if (searchId.trim()) {
      data = await borrowService.getBorrowHistoryByUserId(parseInt(searchId.trim()));
    } else if (status === "REQUESTED") {
      data = await borrowService.getRequestedBorrows();
    } else {
      data = await borrowService.getAllBorrows();
    }
    setRecords(data);
    setLoading(false);
  };

  // Debounced search logic
  React.useEffect(() => {
    const handler = setTimeout(() => {
      fetchRecords(filterStatus, searchUserId);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchUserId, filterStatus]);

  // ----- Filtering -----
  const filteredRecords = records.filter((rec) => {
    if (filterStatus && rec.status !== filterStatus) return false;
    return true;
  });

  // ----- Pagination -----
  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / ITEMS_PER_PAGE));
  const paginatedRecords = filteredRecords.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // ----- Handlers -----
  const openAddModal = () => {
    setEditingRecord(null);
    setFormData(emptyRecord);
    setShowModal(true);
  };

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

  const handleSave = async () => {
    if (!formData.bookid || !formData.userid) return;

    try {
      if (editingRecord) {
        const response = await borrowService.updateBorrow({
          borrowid: editingRecord.borrowid,
          status: formData.status
        });
        if (response.code === 200 || response.code === 201) {
          toast.success("Borrow record updated!");
          setTimeout(() => window.location.reload(), 1000);
        } else {
          toast.error(response.message || "Failed to update record");
        }
      } else {
        const response = await borrowService.saveBorrow({
          bookid: formData.bookid,
          userid: formData.userid
        });
        if (response.code === 200 || response.code === 201) {
          toast.success("New borrow record created!");
          setTimeout(() => window.location.reload(), 1000);
        } else {
          toast.error(response.message || "Failed to save record");
        }
      }
    } catch (err: unknown) {
      console.error(err);
      toast.error("An error occurred while saving.");
    } finally {
      setShowModal(false);
      setFormData(emptyRecord);
      setEditingRecord(null);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "bookid" || name === "userid" ? parseInt(value) || 0 : value,
    }));
  };


  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto px-4 py-6" style={{ maxWidth: "1800px" }}>
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ArrowRightLeft className="h-5 w-5 text-emerald-500" />
              <span className="text-sm font-bold text-emerald-600 uppercase tracking-widest">Borrowing Records</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Borrowing Management</h1>
            <p className="text-slate-500 font-medium mt-1">{records.length} total records</p>
          </div>
          <Button
            onClick={openAddModal}
            className="h-12 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-400 text-white font-bold shadow-lg shadow-emerald-500/25 hover:scale-[1.02] hover:shadow-xl hover:shadow-emerald-500/30 active:scale-[0.98] transition-all"
          >
            <Plus className="h-5 w-5 mr-2" />
            New Borrow Record
          </Button>
        </div>

        {/* Search by User ID + Filter */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="relative group max-w-xs flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 transition-colors group-focus-within:text-emerald-500" />
            <Input
              placeholder="Search by User ID..."
              value={searchUserId}
              onChange={(e) => {
                setSearchUserId(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-11 h-11 bg-white border-slate-100 rounded-xl text-sm font-medium shadow-sm focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/20"
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setFilterStatus(filterStatus === "REQUESTED" ? null : "REQUESTED");
                setCurrentPage(1);
              }}
              className={`h-11 px-5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${filterStatus === "REQUESTED"
                ? "bg-amber-100 text-amber-700 ring-2 ring-amber-300"
                : "bg-white border border-slate-100 text-slate-500 hover:bg-amber-50 hover:text-amber-700"
                }`}
            >
              <Clock className="h-4 w-4" />
              REQUESTED
            </button>
            <Link
              href="/staff/borrow-management/overdue"
              className="h-11 px-5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all bg-white border border-slate-100 text-slate-500 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200"
            >
              <AlertCircle className="h-4 w-4" />
              OVERDUE
            </Link>
          </div>
        </div>

        {/* Borrow Records Table */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-x-auto">
          <div className="min-w-[1000px]">
            {/* Table Header */}
            <div className="grid grid-cols-[50px_0.7fr_0.7fr_0.7fr_0.6fr_0.5fr_0.5fr_90px] gap-3 px-5 py-3 bg-slate-50/80 border-b border-slate-100">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Borrow ID</span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Borrow Date</span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Due Date</span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Return Date</span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Book ID</span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">User ID</span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</span>
            </div>

            {/* Table Body */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="h-10 w-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-slate-500 font-bold">Loading borrowings...</p>
              </div>
            ) : paginatedRecords.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <ArrowRightLeft className="h-12 w-12 text-slate-200 mb-3" />
                <h3 className="text-sm font-bold text-slate-400 mb-1">No records found</h3>
                <p className="text-slate-400 text-xs">Try adjusting your search or create a new record.</p>
              </div>
            ) : (
              <div>
                {paginatedRecords.map((rec, index) => {
                  const st = getStatus(rec.status);
                  const StatusIcon = st.icon;
                  return (
                    <div
                      key={rec.borrowid}
                      className={`group grid grid-cols-[50px_0.7fr_0.7fr_0.7fr_0.6fr_0.5fr_0.5fr_90px] gap-3 px-5 py-3.5 items-center hover:bg-slate-50/60 transition-colors ${index !== paginatedRecords.length - 1 ? "border-b border-slate-50" : ""
                        }`}
                    >
                      {/* ID */}
                      <span className="text-xs font-black text-slate-300">#{rec.borrowid.toString().padStart(3, "0")}</span>

                      {/* Borrow Date */}
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3 w-3 text-slate-300 shrink-0" />
                        <span className="text-xs font-medium text-slate-600">{rec.borrowdate || "—"}</span>
                      </div>

                      {/* Due Date */}
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3 w-3 text-slate-300 shrink-0" />
                        <span className="text-xs font-medium text-slate-600">{rec.dueDate || "—"}</span>
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

      {/* ========== ADD / EDIT MODAL ========== */}
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
                <h2 className="text-xl font-black text-slate-900">
                  {editingRecord ? "Edit Borrow Record" : "New Borrow Record"}
                </h2>
                <p className="text-sm text-slate-400 font-medium mt-0.5">
                  {editingRecord
                    ? `Editing #${editingRecord.borrowid.toString().padStart(3, "0")}`
                    : "Fill in the borrowing details"}
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
                    <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 pointer-events-none" />
                    <Input name="bookid" type="number" min={0} value={formData.bookid} onChange={handleFormChange} readOnly={!!editingRecord} className={`pl-11 h-12 border-slate-100 rounded-xl font-medium focus:ring-4 focus:ring-emerald-500/5 ${editingRecord ? "bg-slate-100/80 opacity-70 cursor-not-allowed" : "bg-slate-50/50 focus:bg-white"}`} />
                  </div>
                </div>

                {/* User ID */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">User ID</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 pointer-events-none" />
                    <Input name="userid" type="number" min={0} value={formData.userid} onChange={handleFormChange} readOnly={!!editingRecord} className={`pl-11 h-12 border-slate-100 rounded-xl font-medium focus:ring-4 focus:ring-emerald-500/5 ${editingRecord ? "bg-slate-100/80 opacity-70 cursor-not-allowed" : "bg-slate-50/50 focus:bg-white"}`} />
                  </div>
                </div>
              </div>

              {editingRecord && (
                <>
                  {/* Borrow Date */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Borrow Date</label>
                    <div className="relative group">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 pointer-events-none" />
                      <Input name="borrowdate" type="date" value={formData.borrowdate || ""} onChange={handleFormChange} readOnly={!!editingRecord} className={`pl-11 h-12 border-slate-100 rounded-xl font-medium focus:ring-4 focus:ring-emerald-500/5 ${editingRecord ? "bg-slate-100/80 opacity-70 cursor-not-allowed" : "bg-slate-50/50 focus:bg-white"}`} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Due Date */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Due Date</label>
                      <div className="relative group">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 pointer-events-none" />
                        <Input name="dueDate" type="date" value={formData.dueDate || ""} onChange={handleFormChange} readOnly={!!editingRecord} className={`pl-11 h-12 border-slate-100 rounded-xl font-medium focus:ring-4 focus:ring-emerald-500/5 ${editingRecord ? "bg-slate-100/80 opacity-70 cursor-not-allowed" : "bg-slate-50/50 focus:bg-white"}`} />
                      </div>
                    </div>

                    {/* Return Date */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Return Date</label>
                      <div className="relative group">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 pointer-events-none" />
                        <Input name="returnDate" type="date" value={formData.returnDate || ""} onChange={handleFormChange} readOnly={!!editingRecord} className={`pl-11 h-12 border-slate-100 rounded-xl font-medium focus:ring-4 focus:ring-emerald-500/5 ${editingRecord ? "bg-slate-100/80 opacity-70 cursor-not-allowed" : "bg-slate-50/50 focus:bg-white"}`} />
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
                </>
              )}

              {/* Save Button */}
              <div className="pt-3">
                <Button
                  onClick={handleSave}
                  disabled={!formData.bookid || !formData.userid}
                  className="h-14 w-full rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-400 text-white font-bold text-base shadow-xl shadow-emerald-500/25 hover:scale-[1.02] hover:shadow-2xl hover:shadow-emerald-500/30 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none"
                >
                  <Save className="h-5 w-5 mr-2" />
                  {editingRecord ? "Update Record" : "Save Record"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BorrowManagementPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-400 font-bold">Loading records...</div>}>
      <BorrowManagementContent />
    </Suspense>
  );
}
