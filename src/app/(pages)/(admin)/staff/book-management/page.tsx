"use client";

import React, { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Hash,
  BookMarked,
  Building2,
  Barcode,
  Copy,
  Plus,
  Edit3,
  Trash2,
  X,
  Save,
  User,
  FolderOpen,
  Sparkles,
} from "lucide-react";
import { Card, CardContent } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { bookService, Book, PaginatedBooksResponse } from "@/src/services/bookService";
import { useInView } from "react-intersection-observer";
import { BOOK_CATEGORIES, BOOKS_PER_PAGE, formatCategoryName } from "@/src/lib/constants";

// ---------- Constants ----------


const emptyFormData = {
  title: "",
  author: "",
  publisher: "",
  isbn: "",
  category: "FICTION",
  availableCopies: 0,
  available: true,
};

export default function AdminBookManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchById, setSearchById] = useState("");
  const [searchResults, setSearchResults] = useState<PaginatedBooksResponse | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const handler = setTimeout(async () => {
      if (searchTerm.trim().length > 0) {
        setIsSearching(true);
        const results = await bookService.searchBooks(searchTerm, 0, BOOKS_PER_PAGE);
        setSearchResults(results);
        setIsSearching(false);
      } else if (searchById.trim().length === 0) {
        setSearchResults(null);
      }
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm, searchById]);

  useEffect(() => {
    const handler = setTimeout(async () => {
      if (searchById.trim().length > 0) {
        setIsSearching(true);
        const book = await bookService.getBookById(searchById);
        if (book) {
          setSearchResults({ totalItems: 1, books: [book], totalPages: 1, currentPage: 0 });
        } else {
          setSearchResults({ totalItems: 0, books: [], totalPages: 0, currentPage: 0 });
        }
        setIsSearching(false);
      } else if (searchTerm.trim().length === 0) {
        setSearchResults(null);
      }
    }, 500);
    return () => clearTimeout(handler);
  }, [searchById, searchTerm]);

  const updateSearchPage = async (page: number) => {
    setIsSearching(true);
    const results = await bookService.searchBooks(searchTerm, page - 1, BOOKS_PER_PAGE);
    setSearchResults(results);
    setIsSearching(false);
  };

  const [showModal, setShowModal] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [formData, setFormData] = useState(emptyFormData);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const handleEdit = (book: Book) => {
    setEditingBook(book);
    setFormData(book);
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      if (editingBook) {
        const response = await bookService.updateBook({
          id: editingBook.id,
          ...formData
        });
        if (response.code === 200 || response.code === 201) {
          toast.success("Book updated successfully!");
          setShowModal(false);
          setFormData(emptyFormData);
          setEditingBook(null);
          // Force a full page reload to ensure everything is in sync
          setTimeout(() => window.location.reload(), 1000);
        } else {
          toast.error(response.message || "Failed to update book");
        }
      } else {
        const response = await bookService.saveBook(formData);
        if (response.code === 200 || response.code === 201) {
          toast.success("Book added successfully!");
          setShowModal(false);
          setFormData(emptyFormData);
          // Force a full page reload to ensure everything is in sync
          setTimeout(() => window.location.reload(), 1000);
        } else {
          toast.error(response.message || "Failed to add book");
        }
      }
    } catch (err: unknown) {
      console.error(err);
      toast.error("An error occurred while saving the book.");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await bookService.deleteBook(id);
      if (response.code === 200 || response.code === 201) {
        toast.success("Book deleted successfully!");
        // Force a full page reload to ensure everything is in sync
        setTimeout(() => window.location.reload(), 1000);
      } else {
        toast.error(response.message || "Failed to delete book");
      }
    } catch (err: unknown) {
      console.error(err);
      toast.error("An error occurred while deleting the book.");
    } finally {
      setDeleteConfirm(null);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === "availableCopies" ? parseInt(value) || 0 : value }));
  };

  const BookCard = ({ book }: { book: Book }) => (
    <Card className="group relative bg-white border-slate-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col">
      {deleteConfirm === book.id && (
        <div className="absolute inset-0 z-20 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center gap-2 p-3 text-center">
          <Trash2 className="h-6 w-6 text-rose-400" />
          <p className="text-[10px] font-bold">Delete book?</p>
          <div className="flex gap-2 w-full justify-center">
            <Button onClick={() => setDeleteConfirm(null)} variant="outline" className="rounded-lg px-3 h-7 text-[10px]">No</Button>
            <Button onClick={() => handleDelete(book.id)} className="bg-rose-500 hover:bg-rose-600 text-white rounded-lg px-3 h-7 text-[10px]">Yes</Button>
          </div>
        </div>
      )}
      <CardContent className="p-3 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[9px] font-black text-slate-300 uppercase">#{book.id.toString().padStart(3, "0")}</span>
          <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${book.available ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-500"}`}>
            {book.available ? "In Stock" : "Out"}
          </span>
        </div>
        <h3 className="text-xs font-black text-slate-900 leading-snug mb-0.5 line-clamp-2">{book.title}</h3>
        <p className="text-[10px] font-medium text-slate-400 mb-2 truncate">{book.author}</p>
        <div className="space-y-1 mb-3 mt-auto text-slate-500">
           <div className="flex items-center gap-1.5 text-[10px]"><Building2 className="h-3 w-3 opacity-50 shrink-0" /><span className="truncate">{book.publisher}</span></div>
           <div className="flex items-center gap-1.5 text-[10px]"><Barcode className="h-3 w-3 opacity-50 shrink-0" /><span className="font-mono text-[9px] truncate">{book.isbn}</span></div>
           <div className="flex items-center gap-1.5 text-[10px]"><Copy className="h-3 w-3 opacity-50 shrink-0" /><span>{book.availableCopies} copies</span></div>
        </div>
        <div className="flex items-center gap-2 pt-2 border-t border-slate-50 mt-1">
          <button onClick={() => handleEdit(book)} className="flex-1 h-8 rounded-lg flex items-center justify-center gap-1.5 text-[11px] font-bold bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors">
            <Edit3 className="h-3 w-3" /> Edit
          </button>
          <button onClick={() => setDeleteConfirm(book.id)} className="h-8 w-8 rounded-lg flex items-center justify-center text-rose-400 hover:bg-rose-50 transition-colors">
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto px-4 py-8 max-w-[1800px]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2"><Sparkles className="h-5 w-5 text-blue-400" /><span className="text-sm font-bold text-blue-600 uppercase tracking-widest">Admin Control</span></div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Catalog Management</h1>
            <p className="text-slate-500 font-medium">Add, update or remove books from the library system.</p>
          </div>
          <Button onClick={() => { setEditingBook(null); setFormData(emptyFormData); setShowModal(true); }} className="h-12 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-sky-500 text-white font-bold shadow-lg shadow-blue-500/25 transition-all">
            <Plus className="h-5 w-5 mr-2" /> Add New Book
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-blue-500" />
            <Input placeholder="Search by title or author" value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setSearchById(""); }} className="pl-12 h-14 bg-white border-slate-100 rounded-2xl font-medium focus:ring-4 focus:ring-blue-500/5 shadow-sm" />
          </div>
          <div className="relative group w-full sm:w-56">
            <Hash className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-blue-500" />
            <Input placeholder="Search by ID" value={searchById} onChange={(e) => { setSearchById(e.target.value); setSearchTerm(""); }} className="pl-12 h-14 bg-white border-slate-100 rounded-2xl font-medium focus:ring-4 focus:ring-blue-500/5 shadow-sm" />
          </div>
        </div>

        {(searchTerm.trim() || searchById.trim()) ? (
          <div className="space-y-8">
            <div className="relative text-center">
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t-2 border-slate-100/60" />
              <span className="relative z-10 px-8 mx-auto bg-slate-50 text-2xl font-serif font-black text-slate-800 flex items-center justify-center gap-4">
                Search Results {isSearching && <div className="h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />}
              </span>
            </div>
            {!isSearching && searchResults?.books.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center text-slate-300">
                <BookMarked className="h-16 w-16 mb-4 opacity-20" />
                <h3 className="text-xl font-bold mb-1">No matches found</h3>
              </div>
            )}
            {searchResults && searchResults.books.length > 0 && (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
                  {searchResults.books.map((book) => <BookCard key={book.id} book={book} />)}
                </div>
                {searchResults.totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <button onClick={() => updateSearchPage(searchResults.currentPage)} disabled={searchResults.currentPage === 0} className="h-8 w-8 flex items-center justify-center rounded-lg bg-white border border-slate-100 text-slate-400 disabled:opacity-30"><ChevronLeft className="h-3 w-3" /></button>
                    <span className="text-[10px] font-bold text-slate-500 px-2 uppercase">Page {searchResults.currentPage + 1} of {searchResults.totalPages}</span>
                    <button onClick={() => updateSearchPage(searchResults.currentPage + 2)} disabled={searchResults.currentPage + 1 === searchResults.totalPages} className="h-8 w-8 flex items-center justify-center rounded-lg bg-white border border-slate-100 text-slate-400 disabled:opacity-30"><ChevronRight className="h-3 w-3" /></button>
                  </div>
                )}
              </>
            )}
          </div>
        ) : (
          <div className="space-y-16">
            {BOOK_CATEGORIES.map((category) => (
              <AdminCategorySection
                key={category}
                category={category}
                BookCard={BookCard}
              />
            ))}
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
            <div className="relative w-full max-w-lg bg-white rounded-[2rem] shadow-2xl overflow-hidden p-8 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-black text-slate-900">{editingBook ? "Edit Book" : "Add New Book"}</h2>
                <button onClick={() => setShowModal(false)} className="h-10 w-10 flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-50"><X className="h-5 w-5" /></button>
              </div>
              <div className="space-y-5 max-h-[70vh] overflow-y-auto pr-2">
                <div className="space-y-1.5"><label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Title</label><div className="relative"><BookMarked className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" /><Input name="title" value={formData.title} onChange={handleFormChange} className="pl-11 h-12 bg-slate-50/50 border-slate-100 rounded-xl" /></div></div>
                <div className="space-y-1.5"><label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Author</label><div className="relative"><User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" /><Input name="author" value={formData.author} onChange={handleFormChange} className="pl-11 h-12 bg-slate-50/50 border-slate-100 rounded-xl" /></div></div>
                <div className="space-y-1.5"><label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Publisher</label><div className="relative"><Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" /><Input name="publisher" value={formData.publisher} onChange={handleFormChange} className="pl-11 h-12 bg-slate-50/50 border-slate-100 rounded-xl" /></div></div>
                <div className="space-y-1.5"><label className="text-[11px] font-black uppercase tracking-widest text-slate-400">ISBN</label><div className="relative"><Barcode className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" /><Input name="isbn" value={formData.isbn} onChange={handleFormChange} className="pl-11 h-12 bg-slate-50/50 border-slate-100 rounded-xl" /></div></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5"><label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Category</label><div className="relative"><FolderOpen className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" /><select name="category" value={formData.category} onChange={handleFormChange} className="pl-11 pr-10 h-12 w-full appearance-none bg-slate-50/50 border border-slate-100 rounded-xl text-sm font-medium outline-none">
                    {BOOK_CATEGORIES.map(cat => <option key={cat} value={cat}>{formatCategoryName(cat)}</option>)}
                  </select></div></div>
                  <div className="space-y-1.5"><label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Total Copies</label><div className="relative"><Copy className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" /><Input name="availableCopies" type="number" value={formData.availableCopies} onChange={handleFormChange} className="pl-11 h-12 bg-slate-50/50 border-slate-100 rounded-xl" /></div></div>
                </div>
                <div className="pt-3"><Button onClick={handleSave} className="h-14 w-full rounded-2xl bg-gradient-to-r from-blue-600 to-sky-500 text-white font-bold text-base shadow-xl shadow-blue-500/25 transition-all"><Save className="h-5 w-5 mr-2" /> {editingBook ? "Update Book" : "Save Book"}</Button></div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// ========== SUB-COMPONENT: ADMIN CATEGORY SECTION ==========
function AdminCategorySection({ 
  category, 
  BookCard 
}: { 
  category: string, 
  BookCard: React.FC<{ book: Book }> 
}) {
  const [data, setData] = useState<PaginatedBooksResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: '200px 0px',
  });

  const fetchData = useCallback(async (pageIndex: number) => {
    setIsLoading(true);
    try {
      const res = await bookService.getBooksByCategory(category, pageIndex, BOOKS_PER_PAGE);
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [category]);

  useEffect(() => {
    if (inView && !data) {
      fetchData(0);
    }
  }, [inView, data, fetchData]);

  if (!inView && !data) return <div ref={ref} className="h-40" />;
  if (data && data.books.length === 0 && !isLoading) return null;

  const currentPage = (data?.currentPage || 0) + 1;
  const totalPages = data?.totalPages || 1;

  return (
    <div ref={ref} className="space-y-6 min-h-[300px]">
      <div className="relative text-center">
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t-2 border-slate-100/60" />
        <span className="relative z-10 px-8 mx-auto bg-slate-50 text-2xl sm:text-3xl font-serif font-black text-slate-800 tracking-tight uppercase">
          {formatCategoryName(category)}
          {isLoading && (
            <span className="ml-4 inline-block h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          )}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
        {data?.books.map((book) => <BookCard key={book.id} book={book} />)}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <button
            onClick={() => fetchData(currentPage - 2)}
            disabled={currentPage === 1 || isLoading}
            className="h-8 w-8 flex items-center justify-center rounded-lg bg-white border border-slate-100 text-slate-400 disabled:opacity-30"
          >
            <ChevronLeft className="h-3 w-3" />
          </button>
          <span className="text-[10px] font-bold text-slate-500 px-2 uppercase tracking-wide">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => fetchData(currentPage)}
            disabled={currentPage === totalPages || isLoading}
            className="h-8 w-8 flex items-center justify-center rounded-lg bg-white border border-slate-100 text-slate-400 disabled:opacity-30"
          >
            <ChevronRight className="h-3 w-3" />
          </button>
        </div>
      )}
    </div>
  );
}
