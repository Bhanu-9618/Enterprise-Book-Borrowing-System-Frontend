"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/src/components/ui/button";
import { useAuthStore } from "@/src/store/useAuthStore";
import {
  BookOpen,
  Menu,
  X,
  Search,
  Sparkles,
  BookMarked,
  Users,
  User,
  LogOut,
  ChevronDown,
  ArrowRight,
  GraduationCap,
  Layers,
  FlaskConical,
  Palette,
  Music,
  Heart,
  Briefcase,
  Gamepad2,
  Cpu,
  Calculator,
} from "lucide-react";

const navLinks: { href: string; label: string }[] = [
  // { href: "/", label: "Home" },
  // { href: "/explore", label: "Explore" },
];

const categories = [
  { icon: BookMarked, label: "Fiction", count: "{fiction_count}", color: "text-rose-500", bg: "bg-rose-50" },
  { icon: GraduationCap, label: "Academic", count: "{academic_count}", color: "text-blue-500", bg: "bg-blue-50" },
  { icon: FlaskConical, label: "Science", count: "{science_count}", color: "text-emerald-500", bg: "bg-emerald-50" },
  { icon: Cpu, label: "Technology", count: "{tech_count}", color: "text-slate-500", bg: "bg-slate-100" },
  { icon: Palette, label: "Arts & Design", count: "{arts_count}", color: "text-purple-500", bg: "bg-purple-50" },
  { icon: Music, label: "Music", count: "{music_count}", color: "text-blue-500", bg: "bg-blue-50" },
  { icon: Heart, label: "Health", count: "{health_count}", color: "text-blue-500", bg: "bg-blue-50" },
  { icon: Briefcase, label: "Business", count: "{business_count}", color: "text-amber-600", bg: "bg-amber-50" },
  { icon: Calculator, label: "Mathematics", count: "{math_count}", color: "text-cyan-600", bg: "bg-cyan-50" },
  { icon: Gamepad2, label: "Entertainment", count: "{entertainment_count}", color: "text-orange-500", bg: "bg-orange-50" },
  { icon: Users, label: "Social Sciences", count: "{social_science_count}", color: "text-teal-600", bg: "bg-teal-50" },
  { icon: Layers, label: "History", count: "{history_count}", color: "text-brown-600", bg: "bg-stone-100" },
];

const quickSearchSuggestions: string[] = [];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { token, role, name, clearAuth } = useAuthStore();
  
  const isAdmin = role === 'ADMIN';
  const isUser = role === 'USER';
  const isAuth = !!token;
  
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    // Delay setting hydrated state to allow for initial render match without triggering hydration mismatch errors
    const timer = setTimeout(() => {
      setHydrated(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const megaRef = useRef<HTMLDivElement>(null);
  const megaTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeSearch = useCallback(() => {
    setSearchOpen(false);
    setSearchQuery("");
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen || searchOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen, searchOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeSearch();
        setMegaOpen(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [closeSearch]);

  useEffect(() => {
    if (searchOpen) setTimeout(() => searchInputRef.current?.focus(), 100);
  }, [searchOpen]);

  const openMega = useCallback(() => {
    if (megaTimerRef.current) clearTimeout(megaTimerRef.current);
    setMegaOpen(true);
  }, []);
  const closeMega = useCallback(() => {
    megaTimerRef.current = setTimeout(() => setMegaOpen(false), 200);
  }, []);

  const handleLogout = () => {
    clearAuth();
    setProfileOpen(false);
    setMobileOpen(false);
    router.push("/auth/signin");
  };

  const filteredSuggestions = searchQuery
    ? quickSearchSuggestions.filter((s) =>
      s.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : [];

  return (
    <>
      <nav
        className={`sticky top-0 z-50 w-full transition-all duration-500 ${scrolled
          ? "bg-white/80 shadow-lg shadow-blue-500/[0.04] backdrop-blur-2xl"
          : "bg-white/50 backdrop-blur-md"
          }`}
      >
        <div
          className="absolute inset-x-0 top-0 h-[2.5px]"
          style={{
            background:
              "linear-gradient(90deg, #2563eb 0%, #0ea5e9 30%, #06b6d4 60%, #3b82f6 100%)",
            backgroundSize: "200% 100%",
            animation: "gradientShift 4s ease infinite",
          }}
        />

        <div className="mx-auto flex h-16 max-w-full items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Dynamic logo routing: Sends logged-in users to their dashboard, guests to the landing page */}
          <Link href={!hydrated ? "/" : isAuth ? (isAdmin ? "/staff" : "/users") : "/"} className="group relative flex items-center gap-2.5">
            <span className="absolute -inset-2 rounded-2xl bg-blue-500/10 opacity-0 blur-lg transition-opacity duration-500 group-hover:opacity-100" />
            <span className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 via-sky-600 to-cyan-500 shadow-lg shadow-blue-500/30 transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-blue-500/40 group-hover:rotate-3">
              <BookOpen className="h-5 w-5 text-white drop-shadow" strokeWidth={2.2} />
              <Sparkles className="absolute -right-1.5 -top-1.5 h-3.5 w-3.5 text-amber-300 opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:-translate-y-0.5 group-hover:scale-110" />
            </span>
            <div className="relative flex flex-col leading-none">
              <span className="text-[1.15rem] font-extrabold tracking-tight">
                <span className="bg-gradient-to-r from-blue-700 via-blue-600 to-sky-600 bg-clip-text text-transparent">
                  Lumina
                </span>
                <span className="text-gray-800"> Library</span>
              </span>
              <span className="mt-0.5 text-[10px] font-medium tracking-widest text-gray-400 uppercase">
                Digital Library
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group relative px-4 py-2 text-sm font-semibold text-gray-600 transition-colors duration-200 hover:text-blue-700"
              >
                {link.label}
                <span className="absolute inset-x-2 -bottom-px h-[2px] origin-left scale-x-0 rounded-full bg-gradient-to-r from-blue-500 to-sky-500 transition-transform duration-300 group-hover:scale-x-100" />
              </Link>
            ))}

            {false && (
            <div
              className="relative"
              ref={megaRef}
              onMouseEnter={openMega}
              onMouseLeave={closeMega}
            >
              <button className="group relative flex items-center gap-1 px-4 py-2 text-sm font-semibold text-gray-600 transition-colors duration-200 hover:text-blue-700">
                Browse
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-300 ${megaOpen ? "rotate-180 text-blue-600" : ""
                    }`}
                />
                <span className="absolute inset-x-2 -bottom-px h-[2px] origin-left scale-x-0 rounded-full bg-gradient-to-r from-blue-500 to-sky-500 transition-transform duration-300 group-hover:scale-x-100" />
              </button>
            </div>
            )}
          </div>

          <div className="hidden md:flex items-center gap-2.5">
            {false && <button
              onClick={() => setSearchOpen(true)}
              className="group flex items-center gap-2 rounded-full border border-gray-200/80 bg-gray-50/70 px-4 py-[5px] text-sm text-gray-500 transition-all duration-300 hover:border-blue-300 hover:bg-white hover:text-blue-600 hover:shadow-xl hover:shadow-blue-500/10"
            >
              <Search className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" strokeWidth={2.5} />
              <span className="hidden lg:inline font-medium">Search Library</span>
            </button>}

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
                      <Button className="relative group overflow-hidden rounded-full bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-400 px-6 text-sm font-bold text-white shadow-lg shadow-amber-500/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-amber-500/40 active:scale-[0.98]">
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
                      <Button className="relative group overflow-hidden rounded-full bg-gradient-to-r from-blue-600 via-sky-600 to-blue-500 px-6 text-sm font-bold text-white shadow-lg shadow-blue-600/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-600/40 active:scale-[0.98]">
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
                  
                  {/* Profile Dropdown */}
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
                  <Button className="relative group overflow-hidden rounded-full bg-gradient-to-r from-blue-600 via-sky-600 to-blue-500 px-6 text-sm font-bold text-white shadow-lg shadow-blue-600/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-600/40 active:scale-[0.98]">
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
        className={`fixed inset-x-0 z-40 hidden md:block transition-all duration-300 ${megaOpen
          ? "pointer-events-auto opacity-100 translate-y-0"
          : "pointer-events-none opacity-0 -translate-y-2"
          }`}
        style={{ top: "66px" }}
        onMouseEnter={openMega}
        onMouseLeave={closeMega}
      >
        <div className="absolute inset-x-0 top-0 h-full bg-white/95 backdrop-blur-2xl shadow-2xl shadow-blue-500/[0.06] border-b border-gray-100" />

        <div className="relative mx-auto max-w-full px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col">
            <h3 className="mb-6 flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.1em] text-gray-400">
              <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
              Explore Categories
            </h3>
            <div className="grid grid-cols-4 gap-4">
              {categories.map((cat) => (
                <Link
                  key={cat.label}
                  href={`/explore?category=${cat.label.toLowerCase()}`}
                  className="group flex items-center gap-4 rounded-2xl border border-transparent p-4 transition-all duration-300 hover:border-blue-100 hover:bg-white hover:shadow-xl hover:shadow-blue-500/5"
                >
                  <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${cat.bg} transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-sm`}>
                    <cat.icon className={`h-5.5 w-5.5 ${cat.color}`} strokeWidth={2.2} />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-gray-800 group-hover:text-blue-700 transition-colors">
                      {cat.label}
                    </p>
                    <p className="text-[11px] font-medium text-gray-400">{cat.count} collections</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div
        className={`fixed inset-0 z-[60] bg-black/50 backdrop-blur-md transition-opacity duration-300 ${searchOpen ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        onClick={closeSearch}
      />
      <div
        className={`fixed inset-x-0 top-0 z-[70] flex justify-center pt-[10vh] px-4 transition-all duration-400 ${searchOpen
          ? "pointer-events-auto opacity-100 translate-y-0"
          : "pointer-events-none opacity-0 -translate-y-8"
          }`}
      >
        <div className="w-full max-w-2xl overflow-hidden rounded-[2.5rem] border border-white/20 bg-white/95 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] backdrop-blur-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-4 px-7 py-6">
            <Search className="h-6 w-6 shrink-0 text-blue-600" strokeWidth={2.5} />
            <input
              ref={searchInputRef}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, author, or ISBN..."
              className="flex-1 bg-transparent text-lg font-bold text-gray-800 outline-none placeholder:text-gray-300"
            />
            <button
              onClick={closeSearch}
              className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gray-100 text-gray-400 transition-all duration-200 hover:bg-rose-50 hover:text-rose-500 hover:rotate-90 shadow-sm"
            >
              <X className="h-5 w-5" strokeWidth={2.5} />
            </button>
          </div>

          {(searchQuery || filteredSuggestions.length > 0) && (
            <div className="border-t border-gray-100 px-4 py-4 max-h-[60vh] overflow-y-auto">
              {searchQuery && (
                <div className="px-3 mb-3">
                  <p className="text-[11px] font-black uppercase tracking-widest text-gray-400">
                    Search Results
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {filteredSuggestions.map((s) => (
                  <button
                    key={s}
                    className="flex w-full items-center gap-4 rounded-2xl px-4 py-3 text-left transition-all duration-200 hover:bg-gray-50 group hover:translate-x-1"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white border border-gray-100 shadow-sm group-hover:border-blue-200 transition-colors">
                      <BookOpen className="h-4 w-4 text-blue-500" strokeWidth={2} />
                    </div>
                    <span className="flex-1 truncate text-sm font-bold text-gray-700 group-hover:text-blue-700">
                      {s}
                    </span>
                    <ArrowRight className="h-4 w-4 shrink-0 text-gray-200 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" />
                  </button>
                ))}
                {searchQuery && filteredSuggestions.length === 0 && (
                  <div className="col-span-2 py-12 text-center">
                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-gray-50 mb-4 opacity-50">
                      <Search className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-sm font-bold text-gray-500">
                      Zero matches for &ldquo;{searchQuery}&rdquo;
                    </p>
                    <p className="text-xs text-gray-400 mt-1 font-medium">Try searching for something else</p>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="bg-gray-50/80 px-7 py-4 flex items-center justify-end border-t border-gray-100">
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Lumina Search v2.0</span>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`fixed inset-0 z-40 bg-black/25 backdrop-blur-sm transition-opacity duration-300 md:hidden ${mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        onClick={() => setMobileOpen(false)}
      />

      <div
        className={`fixed right-0 top-0 z-40 flex h-full w-80 flex-col bg-white/[0.97] backdrop-blur-2xl shadow-2xl shadow-blue-500/10 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:hidden ${mobileOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="absolute inset-y-0 left-0 w-[2.5px] bg-gradient-to-b from-blue-500 via-sky-500 to-blue-400 opacity-70" />

        <div className="flex flex-col gap-1 overflow-y-auto px-5 pt-20 pb-8">
          {/* <button
            onClick={() => { setMobileOpen(false); setTimeout(() => setSearchOpen(true), 200); }}
            className="mb-4 flex items-center gap-3 rounded-xl border border-gray-200/70 bg-gray-50/70 px-4 py-3 text-sm font-bold text-gray-500 transition-all hover:border-blue-300 hover:bg-white hover:text-blue-600 shadow-sm"
          >
            <Search className="h-4 w-4 text-blue-500" strokeWidth={2.5} />
            Search library...
          </button> */}

          {navLinks.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 rounded-2xl px-4 py-4 text-[15px] font-bold text-gray-700 transition-all duration-200 hover:bg-blue-50/70 hover:text-blue-700 hover:translate-x-1"
              style={{ animationDelay: `${100 + i * 60}ms` }}
            >
              {link.label}
            </Link>
          ))}

          {/* <p className="mt-8 mb-3 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-300">
            Browse
          </p>
          {categories.map((cat, i) => (
            <Link
              key={cat.label}
              href={`/explore?category=${cat.label.toLowerCase()}`}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-4 rounded-2xl px-4 py-3 transition-all duration-200 hover:bg-gray-50 hover:translate-x-1"
              style={{ animationDelay: `${220 + i * 50}ms` }}
            >
              <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${cat.bg}`}>
                <cat.icon className={`h-5 w-5 ${cat.color}`} strokeWidth={2.2} />
              </span>
              <span className="text-sm font-bold text-gray-800">{cat.label}</span>
              <span className="ml-auto text-[10px] font-black text-gray-300">{cat.count}</span>
            </Link>
          ))} */}

          <div className="my-6 h-px bg-gradient-to-r from-transparent via-gray-100 to-transparent" />

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
                    <Button className="w-full rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-400 py-6 text-sm font-bold text-white shadow-xl shadow-amber-500/30 transition-all hover:scale-[1.02] hover:shadow-amber-500/40">
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
                    <Button className="w-full rounded-2xl bg-gradient-to-r from-blue-600 via-sky-600 to-blue-500 py-6 text-sm font-bold text-white shadow-xl shadow-blue-600/30 transition-all hover:scale-[1.02] hover:shadow-blue-600/40">
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
                <Button className="w-full rounded-2xl bg-gradient-to-r from-blue-600 via-sky-600 to-blue-500 py-6 text-sm font-bold text-white shadow-xl shadow-blue-600/30 transition-all hover:scale-[1.02] hover:shadow-blue-600/40">
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

      <style jsx global>{`
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </>
  );
}