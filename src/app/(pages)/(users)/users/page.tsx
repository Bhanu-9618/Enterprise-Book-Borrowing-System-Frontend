"use client";

import React, { useState } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Hash,
  Building2,
  Barcode,
  Copy,
  BookOpenCheck,
  Sparkles,
  X,
  CheckCircle2,
  Info,
} from "lucide-react";
import { Card, CardContent } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { useAuthStore } from "@/src/store/useAuthStore";
import { bookService, Book } from "@/src/services/bookService";
import { borrowService } from "@/src/services/borrowService";
import toast from "react-hot-toast";
import { useInView } from "react-intersection-observer";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import Image from "next/image";
import { BookSkeleton, CategorySkeleton } from "@/src/components/skeletons/BookSkeleton";

import { BOOK_CATEGORIES, ITEMS_PER_PAGE, formatCategoryName } from "@/src/lib/constants";

// ========== COMPONENT ==========
export default function UserDashboardPage() {
  const { name, id: userId } = useAuthStore();
  const [hydrated, setHydrated] = useState(false);
  const [isBorrowing, setIsBorrowing] = useState(false);
  const queryClient = useQueryClient();
  
  React.useEffect(() => {
    const timer = setTimeout(() => setHydrated(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchById, setSearchById] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [debouncedSearchById, setDebouncedSearchById] = useState("");
  const [searchPage, setSearchPage] = useState(0);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  // Debounce logic for Term
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setSearchPage(0); // Reset page on new search
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Debounce logic for ID
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchById(searchById);
      setSearchPage(0);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchById]);

  // React Query for Search
  const { data: searchResults, isFetching: isSearching } = useQuery({
    queryKey: ['books', 'search', debouncedSearchTerm, debouncedSearchById, searchPage],
    queryFn: async () => {
      if (debouncedSearchById.trim().length > 0) {
        const book = await bookService.getBookById(debouncedSearchById);
        return book ? { totalItems: 1, books: [book], totalPages: 1, currentPage: 0 } : { totalItems: 0, books: [], totalPages: 0, currentPage: 0 };
      }
      if (debouncedSearchTerm.trim().length > 0) {
        return await bookService.searchBooks(debouncedSearchTerm, searchPage, ITEMS_PER_PAGE);
      }
      return null;
    },
    enabled: debouncedSearchTerm.trim().length > 0 || debouncedSearchById.trim().length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  const openBorrowModal = (book: Book) => {
    setSelectedBook(book);
  };

  const handleConfirmBorrow = async () => {
    if (!selectedBook || !userId) {
      if (!userId) toast.error("User not logged in!");
      return;
    }

    try {
      setIsBorrowing(true);
      const response = await borrowService.saveBorrow({
        bookid: selectedBook.id,
        userid: userId,
      });

      if (response.code === 200 || response.code === 201) {
        toast.success("Book borrowed successfully!");
        setSelectedBook(null);
        // Refresh all book queries to reflect decreased copy count
        queryClient.invalidateQueries({ queryKey: ['books'] });
      } else {
        toast.error(response.message || "Failed to borrow book");
      }
    } catch (err: unknown) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      toast.error(errorMessage);
    } finally {
      setIsBorrowing(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-50">
      {/* Background Image with Overlay */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/images/Admin dash.jpg"
          alt="Lumina Library Dashboard Background"
          fill
          priority
          quality={100}
          className="object-cover transition-transform duration-1000 scale-105"
        />
        <div className="absolute inset-0 z-10 bg-black/5 transition-opacity duration-700" />
        <div className="absolute inset-0 z-10 bg-white/20 backdrop-blur-[2px]" />
      </div>

      <main className="relative z-10 mx-auto px-4 py-8" style={{ maxWidth: "1800px" }}>
        {/* Welcome Greeting */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-5 w-5 text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
            <span className="text-sm font-black text-amber-600 uppercase tracking-widest drop-shadow-sm">Dashboard</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2 drop-shadow-[0_2px_10px_rgba(255,255,255,1)]">
            Welcome Back, {hydrated && name ? name : "Member"}!
          </h1>
          <p className="text-slate-800 font-bold text-lg drop-shadow-[0_1px_4px_rgba(255,255,255,0.8)]">Browse our catalog and borrow your next favorite book.</p>
        </div>

        {/* Search Section */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 transition-colors group-focus-within:text-blue-500" />
            <Input
              placeholder="Search by title or author"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setSearchById("");
              }}
              className="pl-12 h-14 bg-white border-slate-100 rounded-2xl font-medium shadow-sm focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/20"
            />
          </div>
          <div className="relative group w-full sm:w-56">
            <Hash className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 transition-colors group-focus-within:text-blue-500" />
            <Input
              placeholder="Search by ID"
              value={searchById}
              onChange={(e) => {
                setSearchById(e.target.value);
                setSearchTerm("");
              }}
              className="pl-12 h-14 bg-white border-slate-100 rounded-2xl font-medium shadow-sm focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/20"
            />
          </div>
        </div>

        {/* Display Logic: Search Results or Categories */}
        {(searchTerm.trim().length > 0 || searchById.trim().length > 0) ? (
          <div className="space-y-8">
            <div className="relative text-center">
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t-2 border-slate-100/40" />
              <span className="relative z-10 px-8 mx-auto bg-white/40 backdrop-blur-3xl rounded-full border border-white/60 text-2xl font-serif font-black text-slate-900 tracking-tight flex items-center justify-center gap-4 py-2 max-w-max drop-shadow-sm">
                Search Results
                {isSearching && (
                  <div className="h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                )}
              </span>
            </div>

            {isSearching ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
                {Array.from({ length: 8 }).map((_, i) => (
                  <BookSkeleton key={i} />
                ))}
              </div>
            ) : searchResults && searchResults.books.length > 0 ? (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
                  {searchResults.books.map((book) => (
                    <Card
                      key={book.id}
                      className="group relative bg-white/80 border-white/60 rounded-xl shadow-lg shadow-slate-900/5 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 hover:-translate-y-1.5 overflow-hidden flex flex-col backdrop-blur-2xl"
                    >
                      <CardContent className="p-3 flex-1 flex flex-col">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
                            #{book.id.toString().padStart(3, "0")}
                          </span>
                          <span
                            className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold ${
                              book.available ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-500"
                            }`}
                          >
                            <span className={`h-1 w-1 rounded-full ${book.available ? "bg-emerald-500" : "bg-rose-400"}`} />
                            {book.available ? "In Stock" : "Out"}
                          </span>
                        </div>
                        <h3 className="text-xs font-black text-slate-900 leading-snug mb-0.5 line-clamp-2">{book.title}</h3>
                        <p className="text-[10px] font-bold text-slate-500 mb-2 truncate">{book.author}</p>
                        <div className="space-y-1 mb-3 mt-auto">
                          <div className="flex items-center gap-1.5 text-[10px]">
                            <Building2 className="h-3 w-3 text-slate-300 shrink-0" />
                            <span className="text-slate-500 font-medium truncate">{book.publisher}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px]">
                            <Barcode className="h-3 w-3 text-slate-300 shrink-0" />
                            <span className="text-slate-500 font-medium font-mono text-[9px] truncate">{book.isbn}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px]">
                            <Copy className="h-3 w-3 text-slate-300 shrink-0" />
                            <span className="text-slate-500 font-medium">{book.availableCopies} copies</span>
                          </div>
                        </div>
                        <Button
                          onClick={() => openBorrowModal(book)}
                          disabled={!book.available}
                          className={`w-full h-8 rounded-lg text-[11px] font-bold transition-all ${
                            book.available
                              ? "bg-gradient-to-r from-blue-600 to-sky-500 text-white shadow-sm shadow-blue-500/20 hover:shadow-md hover:shadow-blue-500/30 hover:scale-[1.02] active:scale-[0.98]"
                              : "bg-slate-100 text-slate-400 cursor-not-allowed"
                          }`}
                        >
                          <BookOpenCheck className="h-3.5 w-3.5 mr-1.5" />
                          {book.available ? "Borrow" : "Unavailable"}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Search Pagination */}
                {searchResults.totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <button
                      onClick={() => setSearchPage(prev => Math.max(0, prev - 1))}
                      disabled={searchPage === 0}
                      className="h-8 w-8 flex items-center justify-center rounded-lg bg-white border border-slate-100 text-slate-400 hover:text-slate-900 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronLeft className="h-3 w-3" />
                    </button>
                    <span className="text-[10px] font-bold text-slate-500 px-2 uppercase tracking-wide">
                      Page {searchPage + 1} of {searchResults.totalPages}
                    </span>
                    <button
                      onClick={() => setSearchPage(prev => Math.min(searchResults.totalPages - 1, prev + 1))}
                      disabled={searchPage + 1 === searchResults.totalPages}
                      className="h-8 w-8 flex items-center justify-center rounded-lg bg-white border border-slate-100 text-slate-400 hover:text-slate-900 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronRight className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </>
            ) : null}
          </div>
        ) : (
          <div className="space-y-16">
            {BOOK_CATEGORIES.map((category) => (
              <CategorySection
                key={category}
                category={category}
                onBorrow={openBorrowModal}
              />
            ))}
          </div>
        )}
      </main>

      {/* ========== BORROW CONFIRMATION MODAL ========== */}
      {selectedBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setSelectedBook(null)}
          />

          <div className="relative w-full max-w-md bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between px-8 pt-8 pb-2">
              <div>
                <h2 className="text-xl font-black text-slate-900">Borrow Book</h2>
                <p className="text-sm text-slate-400 font-medium mt-0.5">Confirm your borrowing details</p>
              </div>
              <button
                onClick={() => setSelectedBook(null)}
                className="h-10 w-10 flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="px-8 pb-8 space-y-5">
              {/* Book Details Card */}
              <div className="bg-slate-50 rounded-2xl p-5 space-y-3">
                <h3 className="text-lg font-black text-slate-900 leading-snug">{selectedBook.title}</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400 font-medium">Author</span>
                    <span className="text-slate-700 font-bold">{selectedBook.author}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400 font-medium">Publisher</span>
                    <span className="text-slate-700 font-bold">{selectedBook.publisher}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400 font-medium">ISBN</span>
                    <span className="text-slate-700 font-bold font-mono text-xs">{selectedBook.isbn}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400 font-medium">Category</span>
                    <span className="text-slate-700 font-bold">{formatCategoryName(selectedBook.category)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400 font-medium">Available Copies</span>
                    <span className="text-emerald-600 font-bold">{selectedBook.availableCopies}</span>
                  </div>
                </div>
              </div>

              {/* Borrowing Policy Note */}
              <div className="bg-blue-50/50 border border-blue-100/50 rounded-2xl p-5 flex items-start gap-4">
                <div className="mt-0.5 p-2 bg-blue-100 rounded-xl">
                  <Info className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-[11px] font-black text-blue-600 uppercase tracking-widest mb-1">Borrowing Policy</p>
                  <p className="text-[13px] text-slate-600 font-medium leading-relaxed">
                    You can hold this book for <span className="text-blue-700 font-bold">14 days</span> after the library issues it to you. Please ensure you return the book on time to avoid any late fees.
                  </p>
                </div>
              </div>

              {/* Confirm Button */}
              <Button
                onClick={handleConfirmBorrow}
                disabled={isBorrowing}
                className="h-14 w-full rounded-2xl bg-gradient-to-r from-blue-600 to-sky-500 text-white font-bold text-base shadow-xl shadow-blue-500/25 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/30 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none"
              >
                {isBorrowing ? (
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 border-t-2 border-white rounded-full animate-spin" />
                    Processing...
                  </div>
                ) : (
                  <>
                    <CheckCircle2 className="h-5 w-5 mr-2" />
                    Confirm Borrow
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ========== SUB-COMPONENT: CATEGORY SECTION ==========
function CategorySection({ 
  category, 
  onBorrow 
}: { 
  category: string, 
  onBorrow: (book: Book) => void 
}) {
  const [page, setPage] = useState(0);
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: '200px 0px',
  });

  const { data, isFetching } = useQuery({
    queryKey: ['books', 'category', category, page],
    queryFn: () => bookService.getBooksByCategory(category, page, ITEMS_PER_PAGE),
    enabled: inView,
    staleTime: 5 * 60 * 1000,
  });

  if (!inView && !data) {
    return <div ref={ref} className="h-40" />;
  }

  if (data && data.books.length === 0 && !isFetching) return null;

  const currentPage = (data?.currentPage || 0) + 1;
  const totalPages = data?.totalPages || 1;

  return (
    <div ref={ref} className="space-y-6 min-h-[300px]">
      {isFetching ? (
        <CategorySkeleton />
      ) : (
        <>
          {/* Category Title */}
          <div className="relative text-center">
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t-2 border-slate-100/40" />
            <span className="relative z-10 px-10 mx-auto bg-white/40 backdrop-blur-3xl rounded-full border border-white/60 text-2xl sm:text-3xl font-serif font-black text-slate-900 tracking-tight py-2.5 max-w-max drop-shadow-sm uppercase">
              {formatCategoryName(category)}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
            {data?.books.map((book) => (
              <Card
                key={book.id}
                className="group relative bg-white/80 border-white/60 rounded-xl shadow-lg shadow-slate-900/5 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 hover:-translate-y-1.5 overflow-hidden flex flex-col backdrop-blur-2xl"
              >
                <CardContent className="p-3 flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
                      #{book.id.toString().padStart(3, "0")}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold ${
                        book.available ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-500"
                      }`}
                    >
                      <span className={`h-1 w-1 rounded-full ${book.available ? "bg-emerald-500" : "bg-rose-400"}`} />
                      {book.available ? "In Stock" : "Out"}
                    </span>
                  </div>

                  <h3 className="text-xs font-black text-slate-900 leading-snug mb-0.5 line-clamp-2">{book.title}</h3>
                  <p className="text-[10px] font-bold text-slate-500 mb-2 truncate">{book.author}</p>

                  <div className="space-y-1 mb-3 mt-auto">
                    <div className="flex items-center gap-1.5 text-[10px]">
                      <Building2 className="h-3 w-3 text-slate-300 shrink-0" />
                      <span className="text-slate-500 font-medium truncate">{book.publisher}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px]">
                      <Barcode className="h-3 w-3 text-slate-300 shrink-0" />
                      <span className="text-slate-500 font-medium font-mono text-[9px] truncate">{book.isbn}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px]">
                      <Copy className="h-3 w-3 text-slate-300 shrink-0" />
                      <span className="text-slate-500 font-medium">{book.availableCopies} copies</span>
                    </div>
                  </div>

                  <Button
                    onClick={() => onBorrow(book)}
                    disabled={!book.available}
                    className={`w-full h-8 rounded-lg text-[11px] font-bold transition-all ${
                      book.available
                        ? "bg-gradient-to-r from-blue-600 to-sky-500 text-white shadow-sm shadow-blue-500/20 hover:shadow-md hover:shadow-blue-500/30 hover:scale-[1.02] active:scale-[0.98]"
                        : "bg-slate-100 text-slate-400 cursor-not-allowed"
                    }`}
                  >
                    <BookOpenCheck className="h-3.5 w-3.5 mr-1.5" />
                    {book.available ? "Borrow" : "Unavailable"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <button
                onClick={() => setPage(prev => Math.max(0, prev - 1))}
                disabled={page === 0 || isFetching}
                className="h-8 w-8 flex items-center justify-center rounded-lg bg-white border border-slate-100 text-slate-400 hover:text-slate-900 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="h-3 w-3" />
              </button>
              <span className="text-[10px] font-bold text-slate-500 px-2 uppercase tracking-wide">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setPage(prev => Math.min(totalPages - 1, prev + 1))}
                disabled={currentPage === totalPages || isFetching}
                className="h-8 w-8 flex items-center justify-center rounded-lg bg-white border border-slate-100 text-slate-400 hover:text-slate-900 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight className="h-3 w-3" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
