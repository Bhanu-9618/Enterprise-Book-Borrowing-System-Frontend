"use client";

import React, { useState } from "react";
import {
  Users,
  Plus,
  Search,
  Edit3,
  Trash2,
  X,
  Save,
  ChevronLeft,
  ChevronRight,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Lock,
  Shield,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";

// ---------- Types ----------
interface UserData {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  membershipdate: string;
  password: string;
  role: "ADMIN" | "USER";
}

// ---------- Sample Data ----------
const sampleUsers: UserData[] = [
  { id: 1, name: "John Doe", email: "john@example.com", phone: "6747523673", address: "123 Library Lane", membershipdate: "2025-01-15", password: "pass123", role: "USER" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", phone: "4834813269", address: "456 Book Street", membershipdate: "2025-02-20", password: "pass456", role: "USER" },
  { id: 3, name: "Admin User", email: "admin@gmail.com", phone: "5551234567", address: "789 Admin Blvd", membershipdate: "2024-06-01", password: "admin123", role: "ADMIN" },
  { id: 4, name: "Sarah Wilson", email: "sarah@example.com", phone: "5559876543", address: "321 Reader Ave", membershipdate: "2025-03-10", password: "pass789", role: "USER" },
  { id: 5, name: "Mike Brown", email: "mike@example.com", phone: "5554567890", address: "654 Novel Drive", membershipdate: "2025-04-05", password: "pass321", role: "USER" },
  { id: 6, name: "Emily Clark", email: "emily@example.com", phone: "5552345678", address: "987 Story Ct", membershipdate: "2025-05-12", password: "pass654", role: "USER" },
  { id: 7, name: "David Lee", email: "david@example.com", phone: "5553456789", address: "147 Chapter Rd", membershipdate: "2025-06-18", password: "pass987", role: "ADMIN" },
  { id: 8, name: "Lisa Johnson", email: "lisa@example.com", phone: "5556789012", address: "258 Page Blvd", membershipdate: "2025-07-22", password: "pass147", role: "USER" },
];

const ITEMS_PER_PAGE = 8;

const emptyUser: Omit<UserData, "id"> = {
  name: "",
  email: "",
  phone: "",
  address: "",
  membershipdate: new Date().toISOString().split("T")[0],
  password: "",
  role: "USER",
};

// ========== COMPONENT ==========
export default function UserManagementPage() {
  const [users, setUsers] = useState<UserData[]>(sampleUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [formData, setFormData] = useState<Omit<UserData, "id">>(emptyUser);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  // ----- Filtering -----
  const filteredUsers = users.filter((user) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      user.name.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term) ||
      user.phone.includes(term) ||
      user.role.toLowerCase().includes(term) ||
      user.id.toString() === term
    );
  });

  // ----- Pagination -----
  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / ITEMS_PER_PAGE));
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // ----- Handlers -----
  const openAddModal = () => {
    setEditingUser(null);
    setFormData(emptyUser);
    setShowModal(true);
  };

  const openEditModal = (user: UserData) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      membershipdate: user.membershipdate,
      password: user.password,
      role: user.role,
    });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!formData.name.trim() || !formData.email.trim()) return;

    if (editingUser) {
      setUsers((prev) =>
        prev.map((u) => (u.id === editingUser.id ? { ...u, ...formData } : u))
      );
    } else {
      const newId = Math.max(...users.map((u) => u.id), 0) + 1;
      setUsers((prev) => [...prev, { id: newId, ...formData }]);
    }
    setShowModal(false);
    setFormData(emptyUser);
    setEditingUser(null);
  };

  const handleDelete = (id: number) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    setDeleteConfirm(null);
    if (paginatedUsers.length === 1 && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto px-4 py-6" style={{ maxWidth: "1800px" }}>
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-5 w-5 text-violet-500" />
              <span className="text-sm font-bold text-violet-600 uppercase tracking-widest">System Users</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">User Management</h1>
            <p className="text-slate-500 font-medium mt-1">{users.length} registered users</p>
          </div>
          <Button
            onClick={openAddModal}
            className="h-12 px-6 rounded-2xl bg-gradient-to-r from-violet-600 to-violet-400 text-white font-bold shadow-lg shadow-violet-500/25 hover:scale-[1.02] hover:shadow-xl hover:shadow-violet-500/30 active:scale-[0.98] transition-all"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add New User
          </Button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative group max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 transition-colors group-focus-within:text-violet-500" />
            <Input
              placeholder="Search by name, email, phone, role or ID..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-11 h-11 bg-white border-slate-100 rounded-xl text-sm font-medium shadow-sm focus:ring-4 focus:ring-violet-500/5 focus:border-violet-500/20"
            />
          </div>
        </div>

        {/* Users List Table */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-[50px_1fr_1.2fr_0.8fr_1fr_0.8fr_0.6fr_100px] gap-3 px-5 py-3 bg-slate-50/80 border-b border-slate-100">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ID</span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Name</span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone</span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Address</span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Member Since</span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Role</span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</span>
          </div>

          {/* Table Body */}
          {paginatedUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Users className="h-12 w-12 text-slate-200 mb-3" />
              <h3 className="text-sm font-bold text-slate-400 mb-1">No users found</h3>
              <p className="text-slate-400 text-xs">Try adjusting your search or add a new user.</p>
            </div>
          ) : (
            <div>
              {paginatedUsers.map((user, index) => (
                <div
                  key={user.id}
                  className={`group grid grid-cols-[50px_1fr_1.2fr_0.8fr_1fr_0.8fr_0.6fr_100px] gap-3 px-5 py-3.5 items-center hover:bg-slate-50/60 transition-colors ${
                    index !== paginatedUsers.length - 1 ? "border-b border-slate-50" : ""
                  }`}
                >
                  {/* ID */}
                  <span className="text-xs font-black text-slate-300">#{user.id.toString().padStart(3, "0")}</span>

                  {/* Name */}
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center text-[11px] font-black text-white shrink-0 ${
                      user.role === "ADMIN"
                        ? "bg-gradient-to-br from-violet-500 to-violet-400"
                        : "bg-gradient-to-br from-blue-500 to-sky-400"
                    }`}>
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-bold text-slate-800 truncate">{user.name}</span>
                  </div>

                  {/* Email */}
                  <span className="text-xs font-medium text-slate-500 truncate">{user.email}</span>

                  {/* Phone */}
                  <span className="text-xs font-medium text-slate-500 font-mono">{user.phone}</span>

                  {/* Address */}
                  <span className="text-xs font-medium text-slate-500 truncate">{user.address}</span>

                  {/* Membership Date */}
                  <span className="text-xs font-medium text-slate-400">{user.membershipdate}</span>

                  {/* Role */}
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold w-fit ${
                    user.role === "ADMIN"
                      ? "bg-violet-50 text-violet-700"
                      : "bg-blue-50 text-blue-600"
                  }`}>
                    {user.role === "ADMIN" ? <ShieldCheck className="h-3 w-3" /> : <Shield className="h-3 w-3" />}
                    {user.role}
                  </span>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => openEditModal(user)}
                      className="h-7 w-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>

                    {deleteConfirm === user.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="h-7 px-2 flex items-center justify-center rounded-lg text-[10px] font-bold text-white bg-rose-500 hover:bg-rose-600 transition-all"
                        >
                          Yes
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="h-7 px-2 flex items-center justify-center rounded-lg text-[10px] font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 transition-all"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirm(user.id)}
                        className="h-7 w-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="h-9 w-9 flex items-center justify-center rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-slate-900 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`h-9 w-9 flex items-center justify-center rounded-xl text-sm font-bold transition-all ${
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
              className="h-9 w-9 flex items-center justify-center rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-slate-900 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </main>

      {/* ========== ADD / EDIT MODAL ========== */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />

          <div className="relative w-full max-w-lg bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between px-8 pt-8 pb-4">
              <div>
                <h2 className="text-xl font-black text-slate-900">
                  {editingUser ? "Edit User" : "Add New User"}
                </h2>
                <p className="text-sm text-slate-400 font-medium mt-0.5">
                  {editingUser ? `Editing #${editingUser.id.toString().padStart(3, "0")}` : "Fill in the user details below"}
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
            <div className="px-8 pb-8 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 transition-colors group-focus-within:text-violet-500" />
                  <Input name="name" placeholder="John Doe" value={formData.name} onChange={handleFormChange} className="pl-11 h-12 bg-slate-50/50 border-slate-100 rounded-xl font-medium focus:bg-white focus:ring-4 focus:ring-violet-500/5" />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 transition-colors group-focus-within:text-violet-500" />
                  <Input name="email" type="email" placeholder="user@example.com" value={formData.email} onChange={handleFormChange} className="pl-11 h-12 bg-slate-50/50 border-slate-100 rounded-xl font-medium focus:bg-white focus:ring-4 focus:ring-violet-500/5" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Phone */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Phone</label>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 transition-colors group-focus-within:text-violet-500" />
                    <Input name="phone" placeholder="5551234567" value={formData.phone} onChange={handleFormChange} className="pl-11 h-12 bg-slate-50/50 border-slate-100 rounded-xl font-medium focus:bg-white focus:ring-4 focus:ring-violet-500/5" />
                  </div>
                </div>

                {/* Membership Date */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Member Since</label>
                  <div className="relative group">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                    <Input name="membershipdate" type="date" value={formData.membershipdate} onChange={handleFormChange} className="pl-11 h-12 bg-slate-50/50 border-slate-100 rounded-xl font-medium focus:bg-white focus:ring-4 focus:ring-violet-500/5" />
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Address</label>
                <div className="relative group">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 transition-colors group-focus-within:text-violet-500" />
                  <Input name="address" placeholder="123 Library Lane" value={formData.address} onChange={handleFormChange} className="pl-11 h-12 bg-slate-50/50 border-slate-100 rounded-xl font-medium focus:bg-white focus:ring-4 focus:ring-violet-500/5" />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 transition-colors group-focus-within:text-violet-500" />
                  <Input name="password" type="password" placeholder="••••••••" value={formData.password} onChange={handleFormChange} className="pl-11 h-12 bg-slate-50/50 border-slate-100 rounded-xl font-medium focus:bg-white focus:ring-4 focus:ring-violet-500/5" />
                </div>
              </div>

              {/* Role Toggle */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Role</label>
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      role: prev.role === "USER" ? "ADMIN" : "USER",
                    }))
                  }
                  className={`w-full h-12 flex items-center gap-3 px-4 rounded-xl border transition-all font-bold text-sm ${
                    formData.role === "ADMIN"
                      ? "border-violet-200 bg-violet-50/50 text-violet-700"
                      : "border-blue-200 bg-blue-50/50 text-blue-600"
                  }`}
                >
                  {formData.role === "ADMIN" ? (
                    <ShieldCheck className="h-5 w-5 text-violet-500" />
                  ) : (
                    <Shield className="h-5 w-5 text-blue-400" />
                  )}
                  {formData.role === "ADMIN" ? "ADMIN" : "USER"}
                  <span className="ml-auto text-xs font-medium text-slate-400">Click to toggle</span>
                </button>
              </div>

              {/* Save Button */}
              <div className="pt-3">
                <Button
                  onClick={handleSave}
                  disabled={!formData.name.trim() || !formData.email.trim()}
                  className="h-14 w-full rounded-2xl bg-gradient-to-r from-violet-600 to-violet-400 text-white font-bold text-base shadow-xl shadow-violet-500/25 hover:scale-[1.02] hover:shadow-2xl hover:shadow-violet-500/30 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none"
                >
                  <Save className="h-5 w-5 mr-2" />
                  {editingUser ? "Update User" : "Save User"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
