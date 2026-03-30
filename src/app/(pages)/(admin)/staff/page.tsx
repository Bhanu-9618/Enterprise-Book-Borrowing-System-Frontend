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

const statsCards = [
  {
    title: "Total Books",
    value: "12,483",
    change: "+248",
    changeLabel: "from last month",
    trend: "up" as const,
    icon: BookOpen,
    bgColor: "bg-blue-50",
    textColor: "text-blue-600",
  },
  {
    title: "Active Borrows",
    value: "1,847",
    change: "+32",
    changeLabel: "currently active",
    trend: "up" as const,
    icon: ArrowRightLeft,
    bgColor: "bg-emerald-50",
    textColor: "text-emerald-600",
  },
  {
    title: "Requested Borrows",
    value: "156",
    change: "-12",
    changeLabel: "vs yesterday",
    trend: "down" as const,
    icon: Clock,
    bgColor: "bg-amber-50",
    textColor: "text-amber-600",
  },
  {
    title: "Overdue Borrows",
    value: "3,921",
    change: "+89",
    changeLabel: "new this month",
    trend: "up" as const,
    icon: AlertCircle,
    bgColor: "bg-rose-50",
    textColor: "text-rose-600",
  },
];

export default function AdminDashboard() {
  const { name } = useAuthStore();
  const [hydrated, setHydrated] = React.useState(false);
  
  React.useEffect(() => {
    const timer = setTimeout(() => setHydrated(true), 0);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Welcome Section */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-5 w-5 text-amber-400" />
            <span className="text-sm font-bold text-amber-600 uppercase tracking-widest">Overview</span>
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-1">
            Good {new Date().getHours() < 12 ? "Morning" : new Date().getHours() < 17 ? "Afternoon" : "Evening"}, {hydrated && name ? name : "Admin"}!
          </h2>
          <p className="text-slate-500 font-medium">Here&apos;s what&apos;s happening at your library today.</p>
        </div>

        {/* Management Tabs */}
        <div className="flex justify-center mb-10 mt-6">
          <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 bg-white rounded-2xl shadow-sm border border-slate-100 max-w-max">
            {[
              { id: "books", label: "Book Management", href: "/staff/book-management" },
              { id: "users", label: "User Management", href: "/staff/user-management" },
              { id: "borrowing", label: "Borrowing Management", href: "/staff/borrow-management" },
            ].map((tab) => (
              <Link
                key={tab.id}
                href={tab.href}
                className="px-8 py-3.5 rounded-xl text-sm font-bold transition-all duration-300 bg-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-50"
              >
                {tab.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((stat) => (
            <Card
              key={stat.title}
              className="group border-white/60 bg-white rounded-[2rem] shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-slate-200/80 transition-all duration-500 hover:-translate-y-1 overflow-hidden"
            >
              <CardContent className="p-7">
                <div className="flex items-start justify-between mb-6">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${stat.bgColor} transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                    <stat.icon className={`h-7 w-7 ${stat.textColor}`} strokeWidth={2} />
                  </div>
                </div>

                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">{stat.title}</p>
                <p className="text-4xl font-black text-slate-900 tracking-tight mb-1">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
