"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/src/components/ui/button";
import { useAuthStore } from "@/src/store/useAuthStore";
import Cookies from "js-cookie";
import {
  BookOpen,
  Menu,
  X,
  Sparkles,
  Users,
  User,
  LogOut,
  ChevronDown,
  ArrowRight,
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { token, role, name, clearAuth } = useAuthStore();
  
  const isAdmin = role === 'ADMIN';
  const isUser = role === 'USER';
  const isAuth = !!token;
  
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setHydrated(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handleLogout = () => {
    clearAuth();
    setProfileOpen(false);
    setMobileOpen(false);
    router.push("/auth/signin");
  };

  useEffect(() => {
    if (!hydrated) return;

    const cookieToken = Cookies.get('token');

    if (!cookieToken && token) {
      clearAuth();
      return;
    }

    if (cookieToken && token) {
      const publicPaths = ['/', '/auth/signin', '/auth/signup'];
      if (publicPaths.includes(pathname)) {
        router.replace(isAdmin ? "/staff" : "/users");
      }
    }
  }, [hydrated, token, pathname, isAdmin, router, clearAuth]);

  return (
    <>
      <nav
        className="sticky top-0 z-50 w-full bg-white border-b border-slate-100/80 shadow-sm transition-all duration-300"
      >

        <div className="mx-auto flex h-16 max-w-full items-center justify-between px-4 sm:px-6 lg:px-8">

          <Link href={!hydrated ? "/" : isAuth ? (isAdmin ? "/staff" : "/users") : "/"} className="group relative flex items-center gap-2.5">
            <span className="absolute -inset-2 rounded-2xl bg-blue-500/10 opacity-0 blur-lg transition-opacity duration-500 group-hover:opacity-100" />
            <span className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-500/30 transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-blue-500/40 group-hover:rotate-3">
              <BookOpen className="h-5 w-5 text-white drop-shadow" strokeWidth={2.2} />
              <Sparkles className="absolute -right-1.5 -top-1.5 h-3.5 w-3.5 text-amber-300 opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:-translate-y-0.5 group-hover:scale-110" />
            </span>
            <div className="relative flex flex-col leading-none">
              <span className="text-[1.15rem] font-extrabold tracking-tight">
                <span className="text-blue-600">Lumina</span>
                <span className="text-slate-800">Library</span>
              </span>
              <span className="mt-0.5 text-[10px] font-medium tracking-widest text-gray-400 uppercase">
                Digital Library
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-2.5">
            <div className="mx-1 h-6 w-px bg-gray-200" />

            {!hydrated ? (
              <div className="flex items-center gap-3 w-[184px] justify-end">
                <div className="h-9 w-20 animate-pulse rounded-full bg-slate-200/60" />
                <div className="h-9 w-24 animate-pulse rounded-full bg-blue-100/60" />
              </div>
            ) : isAuth ? (
              <>
                {isAdmin && (
                  <>
                    <Link href="/staff">
                      <Button
                        variant="ghost"
                        className={`rounded-full px-5 text-sm font-bold transition-all duration-200 hover:text-blue-700 hover:bg-blue-50/60 ${pathname === '/staff' ? 'text-blue-700 bg-blue-50/60' : 'text-gray-600'}`}
                      >
                        Home
                      </Button>
                    </Link>

                    <div className="group relative list-none">
                      <Button
                        variant="ghost"
                        className={`flex items-center gap-1 rounded-full px-5 text-sm font-bold transition-all duration-200 hover:text-blue-700 hover:bg-blue-50/60 ${pathname.startsWith('/staff/') ? 'text-blue-700 bg-blue-50/60' : 'text-gray-600'}`}
                      >
                        Manage
                        <ChevronDown className="h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-180" />
                      </Button>
                      <div className="absolute right-0 top-full mt-1 hidden w-48 flex-col rounded-xl border border-gray-100 bg-white p-2 shadow-xl shadow-blue-500/10 group-hover:flex">
                        <Link href="/staff/book-management" className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-blue-50 hover:text-blue-700">
                          Book Management
                        </Link>
                        <Link href="/staff/user-management" className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-blue-50 hover:text-blue-700">
                          User Management
                        </Link>
                        <Link href="/staff/borrow-management" className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-blue-50 hover:text-blue-700">
                          Borrow Management
                        </Link>
                      </div>
                    </div>

                    <Link href="/staff/borrow-management?status=REQUESTED">
                      <Button className="relative group overflow-hidden rounded-full bg-amber-500 px-6 text-sm font-bold text-white shadow-lg shadow-amber-500/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-amber-500/40 active:scale-[0.98]">
                        <span className="relative z-10 flex items-center gap-2">
                          Requested
                        </span>
                      </Button>
                    </Link>
                  </>
                )}

                {isUser && (
                  <>
                    <Link href="/users">
                      <Button
                        variant="ghost"
                        className={`rounded-full px-5 text-sm font-bold transition-all duration-200 hover:text-blue-700 hover:bg-blue-50/60 ${pathname === '/users' ? 'text-blue-700 bg-blue-50/60' : 'text-gray-600'}`}
                      >
                        Home
                      </Button>
                    </Link>

                    <Link href="/users/history">
                      <Button className="relative group overflow-hidden rounded-full bg-blue-600 px-6 text-sm font-bold text-white shadow-lg shadow-blue-600/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-600/40 active:scale-[0.98]">
                        <span className="relative z-10 flex items-center gap-2">
                          My History
                        </span>
                      </Button>
                    </Link>
                  </>
                )}

                <div className="relative">
                  <div 
                    className="flex items-center gap-3 pl-3 border-l border-gray-200 cursor-pointer pt-1 pb-1 outline-none"
                    onClick={() => setProfileOpen(!profileOpen)}
                  >
                    <div className="flex flex-col items-end">
                      <span className="text-sm font-bold text-gray-700 leading-none mb-1 max-w-[200px] lg:max-w-[250px] truncate">
                        {name || (isAdmin ? "Admin" : "Member")}
                      </span>
                      <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest leading-none">
                        {isAdmin ? "Staff" : "Member"}
                      </span>
                    </div>
                    <div className={`flex h-9 w-9 items-center justify-center rounded-full ring-2 ring-white shadow-sm transition-all ${profileOpen ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-blue-600'}`}>
                      <User className="h-5 w-5" />
                    </div>
                  </div>
                  

                  {profileOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                      <div className="absolute right-0 top-full mt-2 w-48 flex-col rounded-xl border border-gray-100 bg-white p-2 shadow-xl shadow-blue-500/10 flex z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                        <button onClick={handleLogout} className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-rose-50 transition-colors w-full text-left">
                          <LogOut className="h-4 w-4" />
                          Log out
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link href="/auth/signin">
                  <Button
                    variant="ghost"
                    className="rounded-full px-5 text-sm font-bold text-gray-600 transition-all duration-200 hover:text-blue-700 hover:bg-blue-50/60"
                  >
                    Sign In
                  </Button>
                </Link>

                <Link href="/auth/signup">
                  <Button className="relative group overflow-hidden rounded-full bg-blue-600 px-6 text-sm font-bold text-white shadow-lg shadow-blue-600/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-600/40 active:scale-[0.98]">
                    <span className="relative z-10 flex items-center gap-2">
                      Join Now
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                    <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
                  </Button>
                </Link>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="relative z-50 flex h-9 w-9 items-center justify-center rounded-xl text-gray-600 transition-colors hover:bg-gray-100 hover:text-blue-600"
              aria-label="Toggle menu"
            >
              <span className={`absolute transition-all duration-300 ${mobileOpen ? "rotate-0 opacity-100 scale-100" : "rotate-90 opacity-0 scale-75"}`}>
                <X className="h-5 w-5" />
              </span>
              <span className={`absolute transition-all duration-300 ${mobileOpen ? "-rotate-90 opacity-0 scale-75" : "rotate-0 opacity-100 scale-100"}`}>
                <Menu className="h-5 w-5" />
              </span>
            </button>
          </div>
        </div>
      </nav>

      <div
        className={`fixed inset-0 z-40 bg-black/25 backdrop-blur-sm transition-opacity duration-300 md:hidden ${mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        onClick={() => setMobileOpen(false)}
      />

      <div
        className={`fixed right-0 top-0 z-40 flex h-full w-80 flex-col bg-white shadow-2xl shadow-blue-500/10 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:hidden ${mobileOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="absolute inset-y-0 left-0 w-[2.5px] bg-blue-500 opacity-70" />

        <div className="flex flex-col gap-1 overflow-y-auto px-5 pt-20 pb-8">

          <div className="my-6 h-px bg-gray-100" />

          {!hydrated ? (
            <div className="flex w-full items-center justify-center py-8">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
            </div>
          ) : isAuth ? (
            <>
              <p className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                Menu
              </p>
              {isAdmin && (
                <>
                  <Link
                    href="/staff"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 rounded-2xl px-4 py-2 text-sm font-bold text-gray-600 transition-all duration-200 hover:bg-blue-50/70 hover:text-blue-700 hover:translate-x-1"
                  >
                    Home
                  </Link>

                  <div className="h-2" />
                  <p className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                    Manage
                  </p>
                  <Link
                    href="/staff/book-management"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 rounded-2xl px-4 py-2 text-sm font-bold text-gray-600 transition-all duration-200 hover:bg-blue-50/70 hover:text-blue-700 hover:translate-x-1"
                  >
                    Book Management
                  </Link>
                  <Link
                    href="/staff/user-management"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 rounded-2xl px-4 py-2 text-sm font-bold text-gray-600 transition-all duration-200 hover:bg-blue-50/70 hover:text-blue-700 hover:translate-x-1"
                  >
                    User Management
                  </Link>
                  <Link
                    href="/staff/borrow-management"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 rounded-2xl px-4 py-2 text-sm font-bold text-gray-600 transition-all duration-200 hover:bg-blue-50/70 hover:text-blue-700 hover:translate-x-1"
                  >
                    Borrow Management
                  </Link>

                  <div className="h-2" />
                  
                  <Link href="/staff/borrow-management?status=REQUESTED" onClick={() => setMobileOpen(false)}>
                    <Button className="w-full rounded-2xl bg-amber-500 py-6 text-sm font-bold text-white shadow-xl shadow-amber-500/30 transition-all hover:scale-[1.02] hover:shadow-amber-500/40">
                      <span className="flex items-center justify-center gap-2">
                        Requested
                      </span>
                    </Button>
                  </Link>
                </>
              )}

              {isUser && (
                <>
                  <Link
                    href="/users"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 rounded-2xl px-4 py-2 text-sm font-bold text-gray-600 transition-all duration-200 hover:bg-blue-50/70 hover:text-blue-700 hover:translate-x-1"
                  >
                    Home
                  </Link>
                  <div className="h-2" />
                  <Link href="/users/history" onClick={() => setMobileOpen(false)}>
                    <Button className="w-full rounded-2xl bg-blue-600 py-6 text-sm font-bold text-white shadow-xl shadow-blue-600/30 transition-all hover:scale-[1.02] hover:shadow-blue-600/40">
                      <span className="flex items-center justify-center gap-2">
                        My History
                      </span>
                    </Button>
                  </Link>
                </>
              )}
              
              <div className="flex items-center justify-between px-4 py-3 mt-4 mb-2 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white shadow-sm text-slate-500">
                    <User className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-700 max-w-[250px] truncate">
                      {name || (isAdmin ? "Admin" : "Member")}
                    </span>
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-0.5">
                      {isAdmin ? "Staff" : "Member"}
                    </span>
                  </div>
                </div>
                
                <Button 
                  variant="ghost" 
                  onClick={handleLogout}
                  className="h-10 w-10 p-0 rounded-xl text-rose-500 hover:text-rose-600 hover:bg-rose-100"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            </>
          ) : (
            <>
              <Link href="/auth/signin" onClick={() => setMobileOpen(false)}>
                <Button
                  variant="outline"
                  className="w-full rounded-2xl py-6 text-sm font-bold border-gray-200 text-gray-600"
                >
                  Sign In
                </Button>
              </Link>
              <div className="h-3" />
              <Link href="/auth/signup" onClick={() => setMobileOpen(false)}>
                <Button className="w-full rounded-2xl bg-blue-600 py-6 text-sm font-bold text-white shadow-xl shadow-blue-600/30 transition-all hover:scale-[1.02] hover:shadow-blue-600/40">
                  <span className="flex items-center justify-center gap-2">
                    Join Now
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}