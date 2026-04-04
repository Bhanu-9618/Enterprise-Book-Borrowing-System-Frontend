"use client";

import React from "react";
import Link from "next/link";
import {
  BookOpen,
  ArrowRightLeft,
  Clock,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { Card, CardContent } from "@/src/components/ui/card";
import { useAuthStore } from "@/src/store/useAuthStore";
import { bookService } from "@/src/services/bookService";
import { borrowService } from "@/src/services/borrowService";



import Image from "next/image";

export default function AdminDashboard() {
  const { name } = useAuthStore();
  const [hydrated, setHydrated] = React.useState(false);
  const [totalBooks, setTotalBooks] = React.useState<number | string>("...");
  const [activeBorrows, setActiveBorrows] = React.useState<number | string>("...");
  const [requestedBorrows, setRequestedBorrows] = React.useState<number | string>("...");
  const [overdueBorrows, setOverdueBorrows] = React.useState<number | string>("...");

  React.useEffect(() => {
    const timer = setTimeout(() => setHydrated(true), 0);
    
    // Fetch stats
    const fetchStats = async () => {
      try {
        const [bookCount, borrowCount, requestedCount, overdueCount] = await Promise.all([
          bookService.getBookCount(),
          borrowService.getBorrowCount(),
          borrowService.getRequestedBorrowCount(),
          borrowService.getOverdueBorrowCount(),
        ]);
        setTotalBooks(bookCount.toLocaleString());
        setActiveBorrows(borrowCount.toLocaleString());
        setRequestedBorrows(requestedCount.toLocaleString());
        setOverdueBorrows(overdueCount.toLocaleString());
      } catch (err) {
        console.error(err);
        setTotalBooks("0");
        setActiveBorrows("0");
        setRequestedBorrows("0");
        setOverdueBorrows("0");
      }
    };

    fetchStats();
    return () => clearTimeout(timer);
  }, []);

  const statsCards = [
    {
      title: "Total Books",
      value: totalBooks,
      icon: BookOpen,
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      title: "Active Borrows",
      value: activeBorrows,
      icon: ArrowRightLeft,
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-600",
    },
    {
      title: "Requested Borrows",
      value: requestedBorrows,
      icon: Clock,
      bgColor: "bg-amber-50",
      textColor: "text-amber-600",
    },
    {
      title: "Overdue Borrows",
      value: overdueBorrows,
      icon: AlertCircle,
      bgColor: "bg-rose-50",
      textColor: "text-rose-600",
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-50">
      {/* Background Image with Overlay */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/images/Admin dash.jpg"
          alt="Lumina Library Admin Dashboard Background"
          fill
          priority
          quality={100}
          className="object-cover transition-transform duration-1000 scale-105"
        />
        <div className="absolute inset-0 z-10 bg-black/10 transition-opacity duration-700" />
        <div className="absolute inset-0 z-10 bg-white/20 backdrop-blur-[3px]" />
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-10">
        {/* Welcome Section */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-5 w-5 text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
            <span className="text-sm font-black text-amber-600 uppercase tracking-widest drop-shadow-sm">Overview</span>
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-2 drop-shadow-[0_2px_10px_rgba(255,255,255,1)]">
            Good {new Date().getHours() < 12 ? "Morning" : new Date().getHours() < 17 ? "Afternoon" : "Evening"}, {hydrated && name ? name : "Admin"}!
          </h2>
          <p className="text-slate-800 font-bold text-lg drop-shadow-[0_1px_4px_rgba(255,255,255,0.8)]">Here&apos;s what&apos;s happening at your library today.</p>
        </div>

        {/* Management Tabs */}
        <div className="flex justify-center mb-12 mt-8">
          <div className="flex flex-wrap items-center justify-center gap-3 p-2 bg-white/60 backdrop-blur-2xl rounded-[2rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] border border-white/80 max-w-max">
            {[
              { id: "books", label: "Book Management", href: "/staff/book-management" },
              { id: "users", label: "User Management", href: "/staff/user-management" },
              { id: "borrowing", label: "Borrowing Management", href: "/staff/borrow-management" },
            ].map((tab) => (
              <Link
                key={tab.id}
                href={tab.href}
                className="px-10 py-4 rounded-[1.5rem] text-sm font-black transition-all duration-300 bg-white/80 text-slate-800 hover:text-blue-700 hover:bg-white hover:shadow-xl hover:shadow-blue-500/20 hover:-translate-y-1"
              >
                {tab.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {statsCards.map((stat) => (
            <Card
              key={stat.title}
              className="group relative border-white/80 bg-white/80 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_15px_40px_-15px_rgba(0,0,0,0.1)] hover:shadow-blue-500/10 transition-all duration-500 hover:-translate-y-3 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardContent className="p-8 relative z-10">
                <div className="flex items-start justify-between mb-8">
                  <div className={`flex h-16 w-16 items-center justify-center rounded-[1.25rem] ${stat.bgColor} shadow-sm border border-white/50 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-md`}>
                    <stat.icon className={`h-8 w-8 ${stat.textColor}`} strokeWidth={2.5} />
                  </div>
                </div>

                <p className="text-[11px] font-black text-slate-600 uppercase tracking-widest mb-2 opacity-80">{stat.title}</p>
                <p className="text-5xl font-black text-slate-900 tracking-tighter mb-1 transition-all duration-300 group-hover:scale-[1.05] group-hover:translate-x-1 origin-left drop-shadow-sm">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
