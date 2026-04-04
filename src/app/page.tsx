import React from 'react'
import Link from 'next/link'
import { HeroCarousel } from "@/src/components/HeroCarousel"
import { BookMarked, Zap, Users } from "lucide-react"
import { userService } from "@/src/services/userService"
import { bookService } from "@/src/services/bookService"

const features = [
  {
    icon: BookMarked,
    title: "Huge Book Library",
    description: "Access thousands of books across various genres, from academic textbooks to world-class fiction.",
    color: "text-rose-500",
    bg: "bg-rose-50"
  },
  {
    icon: Zap,
    title: "One-Click Borrowing",
    description: "No more paperwork. Browse our catalog and request your favorite books with a single click.",
    color: "text-blue-500",
    bg: "bg-blue-50"
  },
  {
    icon: Users,
    title: "Manage on the Go",
    description: "Track your due dates, borrowing history, and pending requests through your personal dashboard.",
    color: "text-emerald-500",
    bg: "bg-emerald-50"
  }
];

const LandingPage = async () => {

  const [userCount, bookCount] = await Promise.all([
    userService.getUserCount(),
    bookService.getBookCount(),
  ]);

  const stats = [
    { label: "Active Users", val: userCount, color: "text-blue-400" },
    { label: "Digital Books", val: bookCount, color: "text-emerald-400" },
    { label: "Global Branches", val: 15, color: "text-purple-400" }
  ];

  return (
    <main className="min-h-screen bg-white">

      <HeroCarousel />


      <section className="mx-auto max-w-7xl px-6 py-24 sm:px-12 lg:px-20">
        <div className="text-center mb-16">
          <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-blue-500 mb-4">
            Why Choose Lumina Library?
          </h2>
          <h3 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
            A New Way to Experience <br />
            <span className="bg-gradient-to-r from-blue-600 to-sky-600 bg-clip-text text-transparent">
              Digital Knowledge
            </span>
          </h3>
          <p className="mt-6 mx-auto max-w-2xl text-lg font-medium text-gray-500 leading-relaxed">
            Experience a seamless digital library that brings thousands of books to your fingertips with ease. We offer a fast, transparent, and user-friendly platform to manage your reading journey from anywhere, at any time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="group relative rounded-3xl border border-gray-100 p-8 transition-all duration-300 hover:border-blue-100 hover:bg-blue-50/10 hover:shadow-2xl hover:shadow-blue-500/5"
            >
              <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl ${feature.bg} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                <feature.icon className={`h-7 w-7 ${feature.color}`} strokeWidth={2.5} />
              </div>
              <h4 className="mb-3 text-xl font-bold text-gray-900 tracking-tight">
                {feature.title}
              </h4>
              <p className="text-gray-500 leading-relaxed font-medium">
                {feature.description}
              </p>
            </div>
          ))}
        </div>


        <div className="mt-20 text-center animate-in fade-in slide-in-from-bottom-6 duration-1000">
          <p className="text-sm font-bold text-slate-400 mb-6 uppercase tracking-[0.2em]">Ready to start reading?</p>
          <Link
            href="/auth/signup"
            className="inline-flex items-center gap-3 px-10 py-5 rounded-[2rem] bg-gradient-to-r from-blue-600 to-sky-500 text-white font-black text-lg shadow-2xl shadow-blue-500/30 hover:scale-105 hover:shadow-blue-500/40 active:scale-95 transition-all group"
          >
            Join Lumina Library Now
            <Zap className="h-5 w-5 fill-current transition-transform group-hover:rotate-12" />
          </Link>
        </div>
      </section>


      <section className="bg-slate-950 py-24 text-white overflow-hidden relative border-t border-slate-900/50">
        <div className="absolute inset-0 opacity-10 blur-3xl pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full" />
        </div>

        <div className="mx-auto max-w-7xl px-6 sm:px-12 lg:px-20 relative z-10 text-center">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 sm:max-w-4xl mx-auto">
            {stats.map((stat, i) => (
              <div key={i} className="animate-in fade-in slide-in-from-bottom-4 duration-1000" style={{ animationDelay: `${i * 200}ms` }}>
                <p className="text-6xl font-black mb-3 tracking-tighter text-white tabular-nums">
                  {typeof stat.val === 'number' && stat.val > 1000 ? `${(stat.val / 1000).toFixed(1)}k+` : stat.val}
                </p>
                <p className={`text-[11px] font-black uppercase tracking-[0.3em] ${stat.color}`}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default LandingPage;