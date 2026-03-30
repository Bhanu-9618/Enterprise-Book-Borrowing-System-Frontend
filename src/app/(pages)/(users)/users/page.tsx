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
  Calendar,
  X,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";

// ---------- Types ----------
interface Book {
  id: number;
  title: string;
  author: string;
  publisher: string;
  isbn: string;
  category: string;
  availableCopies: number;
}

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

// ---------- Sample Data ----------
const fictionalBookTitles = [
  "The Great Shadow", "Echoes of Eternity", "Whispers in the Wind", "Midnight Sun",
  "The Lost Amulet", "Crimson Peaks", "Silver Linings", "The Sapphire Blade",
  "Desert Mirage", "Ocean's Deep", "Voices from the Void", "The Last Ember",
  "Shadows of the Past", "Gilded Cages", "The Thirteenth Door", "Silent Storm",
  "Winds of Change", "The Clockwork Heart"
];

const sampleBooks: Book[] = [
  ...fictionalBookTitles.map((title, i) => ({
    id: i + 1,
    title,
    author: "Fictional Author",
    publisher: "Scribner",
    isbn: `978-0000000${(i + 1).toString().padStart(3, "0")}`,
    category: "FICTION",
    availableCopies: Math.floor(Math.random() * 5) + 1,
  })),
  { id: 20, title: "Clean Code", author: "Robert C. Martin", publisher: "Prentice Hall", isbn: "978-0132350884", category: "TECHNOLOGY", availableCopies: 3 },
  { id: 21, title: "Atomic Habits", author: "James Clear", publisher: "Avery", isbn: "978-0735211292", category: "NON_FICTION", availableCopies: 0 },
  { id: 22, title: "Sapiens", author: "Yuval Noah Harari", publisher: "Harper", isbn: "978-0062316097", category: "HISTORY", availableCopies: 0 },
  { id: 23, title: "Design Patterns", author: "Gang of Four", publisher: "Addison-Wesley", isbn: "978-0201633610", category: "TECHNOLOGY", availableCopies: 1 },
];

const ITEMS_PER_PAGE = 16;

// ========== COMPONENT ==========
export default function UserDashboardPage() {
  const [books] = useState<Book[]>(sampleBooks);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchById, setSearchById] = useState("");
  const [categoryPages, setCategoryPages] = useState<Record<string, number>>({});
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [borrowDate, setBorrowDate] = useState(new Date().toISOString().split("T")[0]);
  const [dueDate, setDueDate] = useState("");

  // ----- Filtering & Grouping -----
  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      if (searchById.trim()) {
        return book.id.toString() === searchById.trim();
      }
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        return (
          book.title.toLowerCase().includes(term) ||
          book.author.toLowerCase().includes(term) ||
          book.isbn.toLowerCase().includes(term) ||
          book.category.toLowerCase().includes(term) ||
          book.publisher.toLowerCase().includes(term)
        );
      }
      return true;
    });
  }, [books, searchById, searchTerm]);

  const booksByCategory = useMemo(() => {
    const grouped = {} as Record<string, Book[]>;
    BOOK_CATEGORIES.forEach((cat) => (grouped[cat] = []));
    filteredBooks.forEach((book) => {
      if (grouped[book.category]) {
        grouped[book.category].push(book);
      } else {
        if (!grouped["OTHERS"]) grouped["OTHERS"] = [];
        grouped["OTHERS"].push(book);
      }
    });

    const activeCategories: string[] = [];
    BOOK_CATEGORIES.forEach((cat) => {
      if (grouped[cat] && grouped[cat].length > 0) activeCategories.push(cat);
    });

    return { grouped, activeCategories };
  }, [filteredBooks]);

  const updateCategoryPage = (cat: string, p: number) => {
    setCategoryPages((prev) => ({ ...prev, [cat]: p }));
  };

  const openBorrowModal = (book: Book) => {
    setSelectedBook(book);
    setBorrowDate(new Date().toISOString().split("T")[0]);
    // Default due date: 14 days from now
    const due = new Date();
    due.setDate(due.getDate() + 14);
    setDueDate(due.toISOString().split("T")[0]);
  };

  const handleConfirmBorrow = () => {
    if (!selectedBook) return;
    console.log("Borrow confirmed:", { bookId: selectedBook.id, borrowDate, dueDate });
    // API call will be implemented later
    setSelectedBook(null);
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
            Welcome Back, Bhanu!
          </h1>
          <p className="text-slate-500 font-medium">Browse our catalog and borrow your next favorite book.</p>
        </div>

        {/* Search Section */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 transition-colors group-focus-within:text-blue-500" />
            <Input
              placeholder="Search by title, author, ISBN..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setSearchById("");
                setCategoryPages({});
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
                setCategoryPages({});
              }}
              className="pl-12 h-14 bg-white border-slate-100 rounded-2xl font-medium shadow-sm focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/20"
            />
          </div>
        </div>

        {/* Books By Category */}
        {booksByCategory.activeCategories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <BookMarked className="h-16 w-16 text-slate-200 mb-4" />
            <h3 className="text-xl font-bold text-slate-400 mb-1">No books found</h3>
            <p className="text-slate-400 text-sm">Try adjusting your search.</p>
          </div>
        ) : (
          <div className="space-y-16">
            {booksByCategory.activeCategories.map((category) => {
              const catBooks = booksByCategory.grouped[category];
              const currentPage = categoryPages[category] || 1;
              const totalPages = Math.max(1, Math.ceil(catBooks.length / ITEMS_PER_PAGE));
              const paginatedBooks = catBooks.slice(
                (currentPage - 1) * ITEMS_PER_PAGE,
                currentPage * ITEMS_PER_PAGE
              );

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
                                book.availableCopies > 0
                                  ? "bg-emerald-50 text-emerald-600"
                                  : "bg-rose-50 text-rose-500"
                              }`}
                            >
                              <span
                                className={`h-1 w-1 rounded-full ${
                                  book.availableCopies > 0 ? "bg-emerald-500" : "bg-rose-400"
                                }`}
                              />
                              {book.availableCopies > 0 ? "In Stock" : "Out"}
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
                            disabled={book.availableCopies <= 0}
                            className={`w-full h-8 rounded-lg text-[11px] font-bold transition-all ${
                              book.availableCopies > 0
                                ? "bg-gradient-to-r from-blue-600 to-sky-500 text-white shadow-sm shadow-blue-500/20 hover:shadow-md hover:shadow-blue-500/30 hover:scale-[1.02] active:scale-[0.98]"
                                : "bg-slate-100 text-slate-400 cursor-not-allowed"
                            }`}
                          >
                            <BookOpenCheck className="h-3.5 w-3.5 mr-1.5" />
                            {book.availableCopies > 0 ? "Borrow" : "Unavailable"}
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

              {/* Dates (Read-only) */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Borrow Date</label>
                  <div className="flex items-center gap-3 h-12 px-4 bg-slate-50/50 border border-slate-100 rounded-xl">
                    <Calendar className="h-4 w-4 text-blue-400" />
                    <span className="text-sm font-bold text-slate-700">{borrowDate}</span>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Due Date</label>
                  <div className="flex items-center gap-3 h-12 px-4 bg-slate-50/50 border border-slate-100 rounded-xl">
                    <Calendar className="h-4 w-4 text-amber-400" />
                    <span className="text-sm font-bold text-slate-700">{dueDate}</span>
                  </div>
                </div>
              </div>

              {/* Confirm Button */}
              <Button
                onClick={handleConfirmBorrow}
                disabled={!borrowDate || !dueDate}
                className="h-14 w-full rounded-2xl bg-gradient-to-r from-blue-600 to-sky-500 text-white font-bold text-base shadow-xl shadow-blue-500/25 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/30 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none"
              >
                <CheckCircle2 className="h-5 w-5 mr-2" />
                Confirm Borrow
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
