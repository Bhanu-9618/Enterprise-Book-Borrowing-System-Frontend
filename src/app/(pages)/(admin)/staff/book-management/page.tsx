"use client";

import React, { useState } from "react";
import {
  BookOpen,
  Plus,
  Search,
  Edit3,
  Trash2,
  X,
  Save,
  ChevronLeft,
  ChevronRight,
  Hash,
  BookMarked,
  User,
  Building2,
  Barcode,
  FolderOpen,
  Copy,
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
  availability: boolean;
}

// ---------- Sample Data ----------
const sampleBooks: Book[] = [
  { id: 1, title: "The Great Gatsby", author: "F. Scott Fitzgerald", publisher: "Scribner", isbn: "978-0743273565", category: "Fiction", availableCopies: 5, availability: true },
  { id: 2, title: "Clean Code", author: "Robert C. Martin", publisher: "Prentice Hall", isbn: "978-0132350884", category: "Technology", availableCopies: 3, availability: true },
  { id: 3, title: "Atomic Habits", author: "James Clear", publisher: "Avery", isbn: "978-0735211292", category: "Self-Help", availableCopies: 0, availability: false },
  { id: 4, title: "To Kill a Mockingbird", author: "Harper Lee", publisher: "J.B. Lippincott", isbn: "978-0061120084", category: "Fiction", availableCopies: 2, availability: true },
  { id: 5, title: "Design Patterns", author: "Gang of Four", publisher: "Addison-Wesley", isbn: "978-0201633610", category: "Technology", availableCopies: 1, availability: true },
  { id: 6, title: "The Alchemist", author: "Paulo Coelho", publisher: "HarperOne", isbn: "978-0062315007", category: "Fiction", availableCopies: 4, availability: true },
  { id: 7, title: "Sapiens", author: "Yuval Noah Harari", publisher: "Harper", isbn: "978-0062316097", category: "History", availableCopies: 0, availability: false },
  { id: 8, title: "Thinking, Fast and Slow", author: "Daniel Kahneman", publisher: "FSG", isbn: "978-0374533557", category: "Psychology", availableCopies: 2, availability: true },
  { id: 9, title: "1984", author: "George Orwell", publisher: "Signet Classic", isbn: "978-0451524935", category: "Fiction", availableCopies: 6, availability: true },
];

const ITEMS_PER_PAGE = 24;

const emptyBook: Omit<Book, "id"> = {
  title: "",
  author: "",
  publisher: "",
  isbn: "",
  category: "",
  availableCopies: 0,
  availability: true,
};

// ---------- Category Colors ----------
const categoryColors: Record<string, { bg: string; text: string; dot: string }> = {
  Fiction: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
  Technology: { bg: "bg-violet-50", text: "text-violet-700", dot: "bg-violet-500" },
  "Self-Help": { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  History: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
  Psychology: { bg: "bg-rose-50", text: "text-rose-700", dot: "bg-rose-500" },
};

const getCategory = (cat: string) =>
  categoryColors[cat] || { bg: "bg-slate-50", text: "text-slate-700", dot: "bg-slate-500" };

// ========== COMPONENT ==========
export default function BookManagementPage() {
  const [books, setBooks] = useState<Book[]>(sampleBooks);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchById, setSearchById] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [formData, setFormData] = useState<Omit<Book, "id">>(emptyBook);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  // ----- Filtering -----
  const filteredBooks = books.filter((book) => {
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

  // ----- Pagination -----
  const totalPages = Math.max(1, Math.ceil(filteredBooks.length / ITEMS_PER_PAGE));
  const paginatedBooks = filteredBooks.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // ----- Handlers -----
  const openAddModal = () => {
    setEditingBook(null);
    setFormData(emptyBook);
    setShowModal(true);
  };

  const openEditModal = (book: Book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      publisher: book.publisher,
      isbn: book.isbn,
      category: book.category,
      availableCopies: book.availableCopies,
      availability: book.availability,
    });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!formData.title.trim() || !formData.author.trim()) return;

    if (editingBook) {
      setBooks((prev) =>
        prev.map((b) => (b.id === editingBook.id ? { ...b, ...formData } : b))
      );
    } else {
      const newId = Math.max(...books.map((b) => b.id), 0) + 1;
      setBooks((prev) => [...prev, { id: newId, ...formData }]);
    }
    setShowModal(false);
    setFormData(emptyBook);
    setEditingBook(null);
  };

  const handleDelete = (id: number) => {
    setBooks((prev) => prev.filter((b) => b.id !== id));
    setDeleteConfirm(null);
    if (paginatedBooks.length === 1 && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "availableCopies" ? parseInt(value) || 0 : value,
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto px-4 py-6" style={{ maxWidth: "1800px" }}>
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="h-5 w-5 text-blue-500" />
              <span className="text-sm font-bold text-blue-600 uppercase tracking-widest">Library Catalog</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Book Management</h1>
            <p className="text-slate-500 font-medium mt-1">{books.length} books in catalog</p>
          </div>
          <Button
            onClick={openAddModal}
            className="h-12 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-sky-500 text-white font-bold shadow-lg shadow-blue-500/25 hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/30 active:scale-[0.98] transition-all"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add New Book
          </Button>
        </div>

        {/* Search Section */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 transition-colors group-focus-within:text-blue-500" />
            <Input
              placeholder="Search by title, author, ISBN, category..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setSearchById("");
                setCurrentPage(1);
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
                setCurrentPage(1);
              }}
              className="pl-12 h-14 bg-white border-slate-100 rounded-2xl font-medium shadow-sm focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/20"
            />
          </div>
        </div>

        {/* Books Grid */}
        {paginatedBooks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <BookMarked className="h-16 w-16 text-slate-200 mb-4" />
            <h3 className="text-xl font-bold text-slate-400 mb-1">No books found</h3>
            <p className="text-slate-400 text-sm">Try adjusting your search or add a new book.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
            {paginatedBooks.map((book) => {
              const cat = getCategory(book.category);
              return (
                <Card
                  key={book.id}
                  className="group relative bg-white border-slate-100/80 rounded-xl shadow-sm shadow-slate-200/40 hover:shadow-md hover:shadow-slate-200/60 transition-all duration-300 hover:-translate-y-0.5 overflow-hidden"
                >
                  {/* delete confirm overlay */}
                  {deleteConfirm === book.id && (
                    <div className="absolute inset-0 z-20 bg-white/95 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center gap-2 p-3">
                      <Trash2 className="h-6 w-6 text-rose-400" />
                      <p className="text-[10px] font-bold text-slate-800 text-center line-clamp-1">
                        Delete &ldquo;{book.title}&rdquo;?
                      </p>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => setDeleteConfirm(null)}
                          variant="outline"
                          className="rounded-lg px-3 py-1 text-[10px] font-bold h-7"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={() => handleDelete(book.id)}
                          className="rounded-lg px-3 py-1 text-[10px] bg-rose-500 hover:bg-rose-600 text-white font-bold h-7"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  )}

                  <CardContent className="p-3">
                    {/* Top row: ID + Availability */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
                        #{book.id.toString().padStart(3, "0")}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold ${
                          book.availability
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-rose-50 text-rose-500"
                        }`}
                      >
                        <span
                          className={`h-1 w-1 rounded-full ${
                            book.availability ? "bg-emerald-500" : "bg-rose-400"
                          }`}
                        />
                        {book.availability ? "Yes" : "No"}
                      </span>
                    </div>

                    {/* Title & Author */}
                    <h3 className="text-xs font-black text-slate-900 leading-snug mb-0.5 line-clamp-2">
                      {book.title}
                    </h3>
                    <p className="text-[10px] font-medium text-slate-400 mb-2 truncate">{book.author}</p>

                    {/* Details */}
                    <div className="space-y-1 mb-3">
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

                    {/* Category + Actions */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold ${cat.bg} ${cat.text}`}>
                        {book.category}
                      </span>
                      <div className="flex items-center gap-0.5">
                        <button
                          onClick={() => openEditModal(book)}
                          className="h-6 w-6 flex items-center justify-center rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                        >
                          <Edit3 className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(book.id)}
                          className="h-6 w-6 flex items-center justify-center rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="h-10 w-10 flex items-center justify-center rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-slate-900 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`h-10 w-10 flex items-center justify-center rounded-xl text-sm font-bold transition-all ${
                  currentPage === page
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
              className="h-10 w-10 flex items-center justify-center rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-slate-900 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </main>

      {/* ========== ADD / EDIT MODAL ========== */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />

          {/* Modal */}
          <div className="relative w-full max-w-lg bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between px-8 pt-8 pb-4">
              <div>
                <h2 className="text-xl font-black text-slate-900">
                  {editingBook ? "Edit Book" : "Add New Book"}
                </h2>
                <p className="text-sm text-slate-400 font-medium mt-0.5">
                  {editingBook ? `Editing #${editingBook.id.toString().padStart(3, "0")}` : "Fill in the book details below"}
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
            <div className="px-8 pb-8 space-y-5 max-h-[70vh] overflow-y-auto">
              {/* Title */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Title</label>
                <div className="relative group">
                  <BookMarked className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 transition-colors group-focus-within:text-blue-500" />
                  <Input name="title" placeholder="Book title" value={formData.title} onChange={handleFormChange} className="pl-11 h-12 bg-slate-50/50 border-slate-100 rounded-xl font-medium focus:bg-white focus:ring-4 focus:ring-blue-500/5" />
                </div>
              </div>

              {/* Author */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Author</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 transition-colors group-focus-within:text-blue-500" />
                  <Input name="author" placeholder="Author name" value={formData.author} onChange={handleFormChange} className="pl-11 h-12 bg-slate-50/50 border-slate-100 rounded-xl font-medium focus:bg-white focus:ring-4 focus:ring-blue-500/5" />
                </div>
              </div>

              {/* Publisher */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Publisher</label>
                <div className="relative group">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 transition-colors group-focus-within:text-blue-500" />
                  <Input name="publisher" placeholder="Publisher name" value={formData.publisher} onChange={handleFormChange} className="pl-11 h-12 bg-slate-50/50 border-slate-100 rounded-xl font-medium focus:bg-white focus:ring-4 focus:ring-blue-500/5" />
                </div>
              </div>

              {/* ISBN */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">ISBN</label>
                <div className="relative group">
                  <Barcode className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 transition-colors group-focus-within:text-blue-500" />
                  <Input name="isbn" placeholder="978-0000000000" value={formData.isbn} onChange={handleFormChange} className="pl-11 h-12 bg-slate-50/50 border-slate-100 rounded-xl font-medium focus:bg-white focus:ring-4 focus:ring-blue-500/5" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Category */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Category</label>
                  <div className="relative group">
                    <FolderOpen className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 transition-colors group-focus-within:text-blue-500" />
                    <Input name="category" placeholder="e.g. Fiction" value={formData.category} onChange={handleFormChange} className="pl-11 h-12 bg-slate-50/50 border-slate-100 rounded-xl font-medium focus:bg-white focus:ring-4 focus:ring-blue-500/5" />
                  </div>
                </div>

                {/* Available Copies */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Copies</label>
                  <div className="relative group">
                    <Copy className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 transition-colors group-focus-within:text-blue-500" />
                    <Input name="availableCopies" type="number" min={0} placeholder="0" value={formData.availableCopies} onChange={handleFormChange} className="pl-11 h-12 bg-slate-50/50 border-slate-100 rounded-xl font-medium focus:bg-white focus:ring-4 focus:ring-blue-500/5" />
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="pt-3">
                <Button
                  onClick={handleSave}
                  disabled={!formData.title.trim() || !formData.author.trim()}
                  className="h-14 w-full rounded-2xl bg-gradient-to-r from-blue-600 to-sky-500 text-white font-bold text-base shadow-xl shadow-blue-500/25 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/30 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none"
                >
                  <Save className="h-5 w-5 mr-2" />
                  {editingBook ? "Update Book" : "Save Book"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
