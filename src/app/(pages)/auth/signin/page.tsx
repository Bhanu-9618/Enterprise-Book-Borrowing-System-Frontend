"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { userService } from "@/src/services/userService";
import { useAuthStore } from "@/src/store/useAuthStore";
import {
  Mail,
  Lock,
  ArrowRight,
  BookMarked,
  Sparkles,
  Loader2
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card";

export default function SigninPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await userService.login(formData);
      
      if (response.code === 200) {
        // Update store
        setAuth({
          token: response.data.token,
          role: response.data.role,
          id: response.data.id,
          name: response.data.name
        });

        // Redirect based on role
        if (response.data.role === 'ADMIN') {
          router.push('/staff');
        } else {
          router.push('/users');
        }
      } else {
        setError(response.message || "Invalid email or password.");
      }
    } catch (err: unknown) {
      // Type-safe error handling
      const errorData = err as { code?: number; status?: number; message?: string };
      
      if (errorData.code === 401 || errorData.status === 401) {
        setError("Invalid email or password. Please try again.");
      } else {
        setError(errorData.message || "Login failed. Please check your credentials.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-4 py-20 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-30">
        <div className="absolute top-[10%] left-[5%] w-[400px] h-[400px] bg-blue-200 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[10%] right-[5%] w-[400px] h-[400px] bg-sky-200 rounded-full blur-[120px] animate-pulse delay-700" />
      </div>

      <div className="w-full max-w-md z-10 relative">
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-3 group mb-8">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-sky-600 to-cyan-500 shadow-xl shadow-blue-500/20 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
              <BookMarked className="h-6 w-6 text-white drop-shadow" strokeWidth={2.2} />
              <Sparkles className="absolute -right-1.5 -top-1.5 h-4 w-4 text-amber-300 opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:-translate-y-0.5" />
            </span>
            <span className="text-3xl font-bold tracking-tight">
              <span className="text-blue-600">Lumina</span>
              <span className="text-slate-800">Library</span>
            </span>
          </Link>
          <h1 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">Welcome Back</h1>
          <p className="text-slate-500 font-medium">Sign in to access your library account.</p>
        </div>

        <Card className="border-white/40 bg-white/70 backdrop-blur-2xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] rounded-[2.5rem] overflow-hidden">
          <CardHeader className="pt-10 pb-2 px-10">
            {error && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 text-sm font-bold text-center mb-4 animate-in shake duration-500">
                {error}
              </div>
            )}
            <CardTitle className="hidden">Sign In</CardTitle>
            <CardDescription className="hidden">Enter your credentials to sign in.</CardDescription>
          </CardHeader>

          <CardContent className="px-10 pb-12">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 transition-colors group-focus-within:text-blue-500" />
                  <Input
                    name="email"
                    type="email"
                    placeholder="user@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="pl-12 h-14 bg-white/50 border-slate-100/80 rounded-2xl transition-all focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/20 font-medium"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 transition-colors group-focus-within:text-blue-500" />
                  <Input
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="pl-12 h-14 bg-white/50 border-slate-100/80 rounded-2xl transition-all focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/20 font-medium"
                  />
                </div>
              </div>

              <div className="pt-4 flex flex-col gap-6">
                <Button 
                  disabled={loading}
                  className="h-16 w-full rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-sky-500 text-lg font-bold text-white shadow-xl shadow-blue-600/30 transition-all hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-600/40 active:scale-[0.98] group overflow-hidden relative disabled:opacity-50 disabled:pointer-events-none"
                >
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    {loading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <>
                        Sign In
                        <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                      </>
                    )}
                  </span>
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
                </Button>

                <div className="text-center">
                  <p className="text-sm font-medium text-slate-500">
                    Don&apos;t have an account?{" "}
                    <Link href="/auth/signup" className="text-blue-600 font-bold hover:underline underline-offset-4">
                      Register here
                    </Link>
                  </p>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        <p className="mt-10 text-center text-xs font-medium text-slate-400 px-10 leading-relaxed uppercase tracking-widest">
          Your reading history is protected under our digital privacy guidelines.
        </p>
      </div>
    </div>
  );
}
