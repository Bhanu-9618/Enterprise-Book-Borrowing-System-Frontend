"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { userService } from "@/src/services/userService";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Lock,
  ArrowRight,
  BookMarked,
  Sparkles,
  Loader2
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card";

import Image from "next/image";

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    membershipdate: new Date().toISOString().split('T')[0],
    password: ""
  });

  const validate = () => {
    const newErrors: Record<string, string> = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name is too short";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = "Email address is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Phone validation
    const phoneRegex = /^\d{10}$/;
    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = "Phone number must be exactly 10 digits (e.g. 0771234567)";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }

    // Address validation
    if (!formData.address.trim()) {
      newErrors.address = "Physical address is required";
    }

    setFieldErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous errors
    setGeneralError(null);
    setFieldErrors({});

    // Client-side validation
    if (!validate()) {
      setGeneralError("Please correct the errors before submitting.");
      return;
    }

    setLoading(true);

    try {
      await userService.signup(formData);
      setSuccess(true);

      setTimeout(() => {
        router.push("/auth/signin");
      }, 2000);

    } catch (err: unknown) {
      console.error("Signup error details:", err);

      const errorData = err as {
        errors?: Record<string, string>;
        message?: string
      };

      // Handle structured errors from backend (e.g. Spring Validation)
      if (errorData.errors && typeof errorData.errors === 'object') {
        setFieldErrors(errorData.errors);
        setGeneralError("Validation failed. Please check the specific fields.");
      } else if (errorData.message) {
        // Handle specific message but check if it's the generic one
        if (errorData.message.toLowerCase().includes("validation failed")) {
          setGeneralError("Registration failed due to invalid data. Please check all fields.");
        } else {
          setGeneralError(errorData.message);
        }
      } else {
        setGeneralError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-24 relative overflow-hidden">
      {/* High-quality background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/Lumina signup.jpg"
          alt="Library Background"
          fill
          className="object-cover brightness-[0.6]"
          priority
        />
        <div className="absolute inset-0 bg-blue-900/10 backdrop-blur-[2px]" />
      </div>

      <div className="w-full max-w-xl z-10 relative">
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-3 group mb-8">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-sky-600 to-cyan-500 shadow-xl shadow-blue-500/20 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
              <BookMarked className="h-6 w-6 text-white drop-shadow" strokeWidth={2.2} />
              <Sparkles className="absolute -right-1.5 -top-1.5 h-4 w-4 text-amber-300 opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:-translate-y-0.5" />
            </span>
            <span className="text-3xl font-bold tracking-tight">
              <span className="text-blue-400 font-extrabold drop-shadow-sm">Lumina</span>
              <span className="text-white drop-shadow-sm">Library</span>
            </span>
          </Link>
          <h1 className="text-4xl font-black text-white mb-3 tracking-tight drop-shadow-md">Become a Member</h1>
          <p className="text-slate-200 font-medium drop-shadow-sm">Join our community and dive into a world of knowledge.</p>
        </div>

        <Card className="border-white/40 bg-white/70 backdrop-blur-2xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] rounded-[2.5rem] overflow-hidden">
          <CardHeader className="pt-10 pb-2 px-10">
            {success ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 text-sm font-bold text-center animate-in zoom-in-95 duration-500">
                Welcome to Lumina! 🎉 <br />
                <span className="font-medium opacity-80">Redirecting you to sign in...</span>
              </div>
            ) : generalError ? (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 text-sm font-bold text-center animate-in shake duration-500">
                {generalError}
              </div>
            ) : (
              <>
                <CardTitle className="hidden">Sign Up</CardTitle>
                <CardDescription className="hidden">Enter your details to register.</CardDescription>
              </>
            )}
          </CardHeader>

          <CardContent className="px-10 pb-12 pt-4">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Name */}
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-600 ml-1">Full Name</label>
                  <div className="relative group">
                    <User className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors ${fieldErrors.name ? 'text-rose-400' : 'text-slate-300 group-focus-within:text-blue-500'}`} />
                    <Input
                      name="name"
                      placeholder="e.g. John Doe"
                      value={formData.name}
                      onChange={handleChange}
                      className={`pl-12 h-14 bg-white/50 rounded-2xl transition-all font-medium ${fieldErrors.name ? 'border-rose-300 focus:ring-rose-500/5 focus:border-rose-500/20 shadow-[0_0_0_1px_rgba(225,29,72,0.1)]' : 'border-slate-100/80 focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/20'}`}
                    />
                  </div>
                  {fieldErrors.name && <p className="text-[10px] font-bold text-rose-500 uppercase tracking-wider ml-1 mt-1 animate-in fade-in slide-in-from-top-1">{fieldErrors.name}</p>}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-600 ml-1">Email Address</label>
                  <div className="relative group">
                    <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors ${fieldErrors.email ? 'text-rose-400' : 'text-slate-300 group-focus-within:text-blue-500'}`} />
                    <Input
                      name="email"
                      type="email"
                      placeholder="user@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className={`pl-12 h-14 bg-white/50 rounded-2xl transition-all font-medium ${fieldErrors.email ? 'border-rose-300 focus:ring-rose-500/5 focus:border-rose-500/20 shadow-[0_0_0_1px_rgba(225,29,72,0.1)]' : 'border-slate-100/80 focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/20'}`}
                    />
                  </div>
                  {fieldErrors.email && <p className="text-[10px] font-bold text-rose-500 uppercase tracking-wider ml-1 mt-1 animate-in fade-in slide-in-from-top-1">{fieldErrors.email}</p>}
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-600 ml-1">Phone Number</label>
                  <div className="relative group">
                    <Phone className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors ${fieldErrors.phone ? 'text-rose-400' : 'text-slate-300 group-focus-within:text-blue-500'}`} />
                    <Input
                      name="phone"
                      placeholder="e.g. 0771234567"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`pl-12 h-14 bg-white/50 rounded-2xl transition-all font-medium ${fieldErrors.phone ? 'border-rose-300 focus:ring-rose-500/5 focus:border-rose-500/20 shadow-[0_0_0_1px_rgba(225,29,72,0.1)]' : 'border-slate-100/80 focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/20'}`}
                    />
                  </div>
                  {fieldErrors.phone && <p className="text-[10px] font-bold text-rose-500 uppercase tracking-wider ml-1 mt-1 animate-in fade-in slide-in-from-top-1">{fieldErrors.phone}</p>}
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-600 ml-1">Password</label>
                  <div className="relative group">
                    <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors ${fieldErrors.password ? 'text-rose-400' : 'text-slate-300 group-focus-within:text-blue-500'}`} />
                    <Input
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      className={`pl-12 h-14 bg-white/50 rounded-2xl transition-all font-medium ${fieldErrors.password ? 'border-rose-300 focus:ring-rose-500/5 focus:border-rose-500/20 shadow-[0_0_0_1px_rgba(225,29,72,0.1)]' : 'border-slate-100/80 focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/20'}`}
                    />
                  </div>
                  {fieldErrors.password && <p className="text-[10px] font-bold text-rose-500 uppercase tracking-wider ml-1 mt-1 animate-in fade-in slide-in-from-top-1">{fieldErrors.password}</p>}
                </div>
              </div>

              {/* Address */}
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-600 ml-1">Physical Address</label>
                <div className="relative group">
                  <MapPin className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors ${fieldErrors.address ? 'text-rose-400' : 'text-slate-300 group-focus-within:text-blue-500'}`} />
                  <Input
                    name="address"
                    placeholder="e.g. 123 Library Lane"
                    value={formData.address}
                    onChange={handleChange}
                    className={`pl-12 h-14 bg-white/50 rounded-2xl transition-all font-medium ${fieldErrors.address ? 'border-rose-300 focus:ring-rose-500/5 focus:border-rose-500/20 shadow-[0_0_0_1px_rgba(225,29,72,0.1)]' : 'border-slate-100/80 focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/20'}`}
                  />
                </div>
                {fieldErrors.address && <p className="text-[10px] font-bold text-rose-500 uppercase tracking-wider ml-1 mt-1 animate-in fade-in slide-in-from-top-1">{fieldErrors.address}</p>}
              </div>

              {/* Membership Date */}
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-600 ml-1">Membership Start Date</label>
                <div className="relative group">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                  <Input
                    name="membershipdate"
                    type="date"
                    value={formData.membershipdate}
                    readOnly
                    className="pl-12 h-14 bg-slate-50/50 border-slate-100/80 rounded-2xl text-slate-400 font-medium cursor-not-allowed uppercase text-xs tracking-wider"
                  />
                </div>
              </div>

              <div className="pt-4 flex flex-col gap-6">
                <Button
                  disabled={loading || success}
                  className="h-16 w-full rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-sky-500 text-lg font-bold text-white shadow-xl shadow-blue-600/30 transition-all hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-600/40 active:scale-[0.98] group overflow-hidden relative disabled:opacity-50 disabled:pointer-events-none"
                >
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    {loading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : success ? (
                      "Registered Successfully"
                    ) : (
                      <>
                        Register as Member
                        <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                      </>
                    )}
                  </span>
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
                </Button>

                <div className="text-center">
                  <p className="text-sm font-medium text-slate-500">
                    Already a member?{" "}
                    <Link href="/auth/signin" className="text-blue-600 font-bold hover:underline underline-offset-4">
                      Sign in here
                    </Link>
                  </p>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Footer info text */}
        <p className="mt-10 text-center text-xs font-bold text-white/80 px-10 leading-relaxed uppercase tracking-widest drop-shadow-sm">
          By signing up, you agree to the Lumina Library Terms of Service and Privacy Policy. All your reading history is protected under our digital privacy guidelines.
        </p>
      </div>
    </div>
  );
}

