"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Hash,
  BookMarked,
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
import { bookService, Book, PaginatedBooksResponse } from "@/src/services/bookService";
import { borrowService } from "@/src/services/borrowService";
import toast from "react-hot-toast";

const BOOK_CATEGORIES = [
  "FICTION",
  "NON_FICTION",
  "SCIENCE",
  "HISTORY",
  "TECHNOLOGY",
  "BUSINESS",
  "BIOGRAPHY",
  "CHILDREN",
  "MYSTERY",
  "FANTASY",
  "LITERATURE",
  "OTHERS",
];

const formatCategoryName = (cat: string) => {
  return cat
    .split("_")
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ");
};

const ITEMS_PER_PAGE = 16;

// ========== COMPONENT ==========
export default function UserDashboardPage() {
  const { name, id: userId } = useAuthStore();
  const [hydrated, setHydrated] = useState(false);
  const [isBorrowing, setIsBorrowing] = useState(false);
  
  React.useEffect(() => {
    const timer = setTimeout(() => setHydrated(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const [categoryData, setCategoryData] = useState<Record<string, PaginatedBooksResponse>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [searchById, setSearchById] = useState("");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [searchResults, setSearchResults] = useState<PaginatedBooksResponse | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const fetchCategoryData = async (cat: string, pageIndex: number) => {
    try {
      const data = await bookService.getBooksByCategory(cat, pageIndex, ITEMS_PER_PAGE);
      if (data) {
        setCategoryData(prev => ({ ...prev, [cat]: data }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  React.useEffect(() => {
    // Initial fetch for all categories at page 0
    BOOK_CATEGORIES.forEach(cat => fetchCategoryData(cat, 0));
  }, []);

  // Search by Term logic
  React.useEffect(() => {
    const handler = setTimeout(async () => {
      if (searchTerm.trim().length > 0) {
        setIsSearching(true);
        const results = await bookService.searchBooks(searchTerm, 0, ITEMS_PER_PAGE);
        setSearchResults(results);
        setIsSearching(false);
      } else if (searchById.trim().length === 0) {
        setSearchResults(null);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(handler);
  }, [searchTerm, searchById]);

  // Search by ID logic
  React.useEffect(() => {
    const handler = setTimeout(async () => {
      if (searchById.trim().length > 0) {
        setIsSearching(true);
        const book = await bookService.getBookById(searchById);
        if (book) {
          setSearchResults({
            totalItems: 1,
            books: [book],
            totalPages: 1,
            currentPage: 0,
          });
        } else {
          setSearchResults({
            totalItems: 0,
            books: [],
            totalPages: 0,
            currentPage: 0,
          });
        }
        setIsSearching(false);
      } else if (searchTerm.trim().length === 0) {
        setSearchResults(null);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(handler);
  }, [searchById, searchTerm]);

  const updateSearchPage = async (newPage: number) => {
    const pageIndex = newPage - 1;
    setIsSearching(true);
    const results = await bookService.searchBooks(searchTerm, pageIndex, ITEMS_PER_PAGE);
    setSearchResults(results);
    setIsSearching(false);
  };

  // ----- Grouping -----
  const booksByCategory = useMemo(() => {
    const grouped = {} as Record<string, { books: Book[], totalPages: number, pageIndex: number }>;
    
    // Default structure based on API response
    BOOK_CATEGORIES.forEach(cat => {
      if (categoryData[cat]) {
         grouped[cat] = {
           books: [...categoryData[cat].books],
           totalPages: categoryData[cat].totalPages,
           pageIndex: categoryData[cat].currentPage
         };
      }
    });

    const activeCategories = Object.keys(grouped).filter(cat => grouped[cat].books.length > 0);
    return { grouped, activeCategories };
  }, [categoryData]);

  const updateCategoryPage = (cat: string, newPage: number) => {
    const pageIndex = newPage - 1; // Backend requires 0-indexed page
    fetchCategoryData(cat, pageIndex);
  };

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
        // Optional: Refresh book list or category page
        fetchCategoryData(selectedBook.category, booksByCategory.grouped[selectedBook.category].pageIndex);
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
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto px-4 py-8" style={{ maxWidth: "1800px" }}>
        {/* Welcome Greeting */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-5 w-5 text-amber-400" />
            <span className="text-sm font-bold text-amber-600 uppercase tracking-widest">Dashboard</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-1">
            Welcome Back, {hydrated && name ? name : "Member"}!
          </h1>
          <p className="text-slate-500 font-medium">Browse our catalog and borrow your next favorite book.</p>
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
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t-2 border-slate-100/60" />
              <span className="relative z-10 px-8 mx-auto bg-slate-50 text-2xl font-serif font-black text-slate-800 tracking-tight flex items-center justify-center gap-4">
                Search Results
                {isSearching && (
                  <div className="h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                )}
              </span>
            </div>

            {!isSearching && searchResults?.books.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <BookMarked className="h-16 w-16 text-slate-200 mb-4" />
                <h3 className="text-xl font-bold text-slate-400 mb-1">
                  No books match &quot;{searchTerm || searchById}&quot;
                </h3>
              </div>
            )}

            {searchResults && searchResults.books.length > 0 && (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
                  {searchResults.books.map((book) => (
                    <Card
                      key={book.id}
                      className="group relative bg-white border-slate-100/80 rounded-xl shadow-sm shadow-slate-200/40 hover:shadow-md hover:shadow-slate-200/60 transition-all duration-300 hover:-translate-y-0.5 overflow-hidden flex flex-col"
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
                        <p className="text-[10px] font-medium text-slate-400 mb-2 truncate">{book.author}</p>
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
                      onClick={() => updateSearchPage(Math.max(1, searchResults.currentPage))}
                      disabled={searchResults.currentPage === 0}
                      className="h-8 w-8 flex items-center justify-center rounded-lg bg-white border border-slate-100 text-slate-400 hover:text-slate-900 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronLeft className="h-3 w-3" />
                    </button>
                    <span className="text-[10px] font-bold text-slate-500 px-2 uppercase tracking-wide">
                      Page {searchResults.currentPage + 1} of {searchResults.totalPages}
                    </span>
                    <button
                      onClick={() => updateSearchPage(Math.min(searchResults.totalPages, searchResults.currentPage + 2))}
                      disabled={searchResults.currentPage + 1 === searchResults.totalPages}
                      className="h-8 w-8 flex items-center justify-center rounded-lg bg-white border border-slate-100 text-slate-400 hover:text-slate-900 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronRight className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        ) : (
          <div className="space-y-16">
            {booksByCategory.activeCategories.map((category) => {
              const catData = booksByCategory.grouped[category];
              const paginatedBooks = catData.books;
              const currentPage = catData.pageIndex + 1;
              const totalPages = Math.max(1, catData.totalPages);

              return (
                <div key={category} className="space-y-6">
                  {/* Centered Category Title */}
                  <div className="relative text-center">
                    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t-2 border-slate-100/60" />
                    <span className="relative z-10 px-8 mx-auto bg-slate-50 text-2xl sm:text-3xl font-serif font-black text-slate-800 tracking-tight">
                      {formatCategoryName(category)}
                    </span>
                  </div>

                  {/* 8-col grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
                    {paginatedBooks.map((book) => (
                      <Card
                        key={book.id}
                        className="group relative bg-white border-slate-100/80 rounded-xl shadow-sm shadow-slate-200/40 hover:shadow-md hover:shadow-slate-200/60 transition-all duration-300 hover:-translate-y-0.5 overflow-hidden flex flex-col"
                      >
                        <CardContent className="p-3 flex-1 flex flex-col">
                          {/* Top row */}
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
                              #{book.id.toString().padStart(3, "0")}
                            </span>
                            <span
                              className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold ${
                                book.available
                                  ? "bg-emerald-50 text-emerald-600"
                                  : "bg-rose-50 text-rose-500"
                              }`}
                            >
                              <span
                                className={`h-1 w-1 rounded-full ${
                                  book.available ? "bg-emerald-500" : "bg-rose-400"
                                }`}
                              />
                              {book.available ? "In Stock" : "Out"}
                            </span>
                          </div>

                          {/* Title & Author */}
                          <h3 className="text-xs font-black text-slate-900 leading-snug mb-0.5 line-clamp-2">
                            {book.title}
                          </h3>
                          <p className="text-[10px] font-medium text-slate-400 mb-2 truncate">{book.author}</p>

                          {/* Details */}
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

                          {/* Borrow Button */}
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

                  {/* Category Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-4">
                      <button
                        onClick={() => updateCategoryPage(category, Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="h-8 w-8 flex items-center justify-center rounded-lg bg-white border border-slate-100 text-slate-400 hover:text-slate-900 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                      >
                        <ChevronLeft className="h-3 w-3" />
                      </button>

                      <span className="text-[10px] font-bold text-slate-500 px-2 uppercase tracking-wide">
                        Page {currentPage} of {totalPages}
                      </span>

                      <button
                        onClick={() => updateCategoryPage(category, Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="h-8 w-8 flex items-center justify-center rounded-lg bg-white border border-slate-100 text-slate-400 hover:text-slate-900 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                      >
                        <ChevronRight className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
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
