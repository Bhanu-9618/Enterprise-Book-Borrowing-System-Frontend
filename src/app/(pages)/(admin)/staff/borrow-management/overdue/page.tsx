"use client";

import React, { useState, useEffect, Suspense, useCallback } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  User,
  CheckCircle2,
  AlertCircle,
  Coins,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";

import { borrowService, OverdueRecord } from "@/src/services/borrowService";

import { ITEMS_PER_PAGE } from "@/src/lib/constants";



function OverdueManagementContent() {
  const [records, setRecords] = useState<OverdueRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchUserId, setSearchUserId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const fetchRecords = useCallback(async (page: number = 0) => {
    setLoading(true);
    try {
      const response = await borrowService.getOverdueBorrows(page, ITEMS_PER_PAGE);
      if (response) {
        setRecords(response.overdueRecords || []);
        setTotalPages(response.totalPages);
        setTotalItems(response.totalItems);
        setCurrentPage(response.currentPage + 1);
      } else {
        setRecords([]);
        setTotalPages(1);
        setTotalItems(0);
      }
    } catch (error) {
      console.error("Error fetching overdue records:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecords(0);
  }, [fetchRecords]);


  const [showFineModal, setShowFineModal] = useState(false);
  const [fineDetails, setFineDetails] = useState({
    fineAmount: 150.0,
    borrowid: 0,
    userId: 0,
    paymentStatus: "UNPAID",
  });


  const handleFine = (rec: OverdueRecord) => {
    setFineDetails({
      fineAmount: rec.fineAmount,
      borrowid: rec.borrowid,
      userId: rec.userid,
      paymentStatus: rec.paymentStatus,
    });
    setShowFineModal(true);
  };

  const handlePayment = async (borrowid: number) => {
    try {
      setLoading(true);
      const response = await borrowService.updateFinePayment({
        borrowId: borrowid,
        status: "PAID"
      });
      if (response.code === 200) {
        toast.success("Payment Processed Successfully!");
        setShowFineModal(false);
        await fetchRecords();
      } else {
        toast.error(response.message || "Failed to update payment");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto px-4 py-6" style={{ maxWidth: "1800px" }}>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-5 w-5 text-rose-500" />
              <span className="text-sm font-bold text-rose-600 uppercase tracking-widest">Overdue Records</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Overdue Management</h1>
            <p className="text-slate-500 font-medium mt-1">{totalItems} overdue items need attention</p>
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


        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="relative group max-w-xs flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 transition-colors group-focus-within:text-rose-500" />
            <Input
              placeholder="Search by User ID..."
              value={searchUserId}
              onChange={(e) => {
                setSearchUserId(e.target.value);
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


        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-x-auto">
          <div className="min-w-[1200px]">

            <div className="grid grid-cols-[50px_1fr_1fr_1fr_160px] gap-3 px-8 py-5 bg-white border-b border-slate-100">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Borrow ID</span>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">User ID</span>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Fine Amount</span>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Payment Status</span>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Actions</span>
            </div>


            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="h-10 w-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-slate-500 font-bold">Loading overdue records...</p>
              </div>
            ) : records.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <AlertCircle className="h-12 w-12 text-slate-200 mb-3" />
                <h3 className="text-sm font-bold text-slate-400 mb-1">No overdue records</h3>
                <p className="text-slate-400 text-xs">All borrowers are on time. Great job!</p>
              </div>
            ) : (
              <div>
                {records.map((rec, index) => {
                  return (
                    <div
                      key={rec.borrowid}
                      className={`group grid grid-cols-[50px_1fr_1fr_1fr_160px] gap-3 px-8 py-5 items-center hover:bg-rose-50/30 transition-colors ${index !== records.length - 1 ? "border-b border-slate-50" : ""
                        }`}
                    >

                      <span className="text-xs font-black text-slate-900">#{rec.borrowid.toString().padStart(3, "0")}</span>


                      <div className="flex items-center gap-1.5">
                        <User className="h-4 w-4 text-slate-400 shrink-0" />
                        <span className="text-sm font-black text-slate-800">User #{rec.userid}</span>
                      </div>


                      <div className="flex items-center gap-1.5">
                        <Coins className="h-4 w-4 text-orange-500 shrink-0" />
                        <span className="text-sm font-black text-slate-900">Rs. {rec.fineAmount.toFixed(2)}</span>
                      </div>


                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black w-fit uppercase tracking-tighter ${rec.paymentStatus === 'PAID' ? 'bg-emerald-50 text-emerald-700' : 'bg-orange-50 text-orange-700'}`}>
                        <div className={`h-1.5 w-1.5 rounded-full ${rec.paymentStatus === 'PAID' ? 'bg-emerald-500' : 'bg-orange-500'}`} />
                        {rec.paymentStatus}
                      </span>


                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleFine(rec)}
                          className="h-7 px-3 flex items-center gap-1 rounded-lg text-[10px] font-bold text-orange-600 bg-orange-50 border border-orange-200 hover:bg-orange-100 hover:text-orange-700 hover:shadow-sm transition-all"
                        >
                          <Coins className="h-3 w-3" />
                          FINE
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>


        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              onClick={() => fetchRecords(currentPage - 2)}
              disabled={currentPage === 1 || loading}
              className="h-9 w-9 flex items-center justify-center rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-slate-900 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-4">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => fetchRecords(currentPage)}
              disabled={currentPage === totalPages || loading}
              className="h-9 w-9 flex items-center justify-center rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-slate-900 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </main>



      <FineDetailsModal
        show={showFineModal}
        onClose={() => setShowFineModal(false)}
        onPay={handlePayment}
        details={fineDetails}
      />

    </div>
  );
}


function FineDetailsModal({
  show,
  onClose,
  onPay,
  details
}: {
  show: boolean;
  onClose: () => void;
  onPay: (borrowid: number) => void;
  details: { fineAmount: number; borrowid: number; userId: number; paymentStatus: string }
}) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />

      <div className="relative w-full max-w-sm bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-gradient-to-br from-orange-500 to-amber-400 p-8 text-white text-center">
          <div className="mx-auto w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-sm">
            <Coins className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-black tracking-tight">Fine Details</h2>
          <p className="text-orange-50/80 text-sm font-medium mt-1">Outstanding payment required</p>
        </div>

        <div className="px-8 py-8 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">User ID</p>
              <p className="text-sm font-bold text-slate-700">#{details.userId}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Borrow ID</p>
              <p className="text-sm font-bold text-slate-700">#{details.borrowid}</p>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Amount</p>
              <p className="text-2xl font-black text-slate-900">Rs. {details.fineAmount.toFixed(2)}</p>
            </div>
            <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-[10px] font-black uppercase tracking-tighter">
              {details.paymentStatus}
            </span>
          </div>

          <div className="space-y-3">
            <Button
              onClick={() => onPay(details.borrowid)}
              disabled={details.paymentStatus === "PAID"}
              className="w-full h-14 rounded-2xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 group shadow-xl shadow-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
