import "./globals.css";
import { Plus_Jakarta_Sans } from "next/font/google";
import Link from "next/link";
import Navbar from "@/src/components/Navbar";
import { Toaster } from "react-hot-toast";
import type { Metadata } from "next";
import { BookOpen, MapPin, Phone, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "LuminaLibrary",
  description: "Advanced Digital Library Management System",
};

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={jakarta.variable}>
      <body className={jakarta.className}>
        <Toaster position="top-right" reverseOrder={false} />
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <footer className="bg-slate-950 text-slate-400 py-20 border-t border-slate-900">
          <div className="mx-auto max-w-7xl px-6 sm:px-12 lg:px-20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
              {/* Brand Column */}
              <div className="space-y-6">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-sky-500 shadow-lg shadow-blue-500/20">
                    <BookOpen className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-3xl font-bold tracking-tight">
                    <span className="text-blue-600">Lumina</span>
                    <span className="text-white">Library</span>
                  </span>
                </div>
                <p className="text-sm leading-relaxed font-medium">
                  Empowering your reading journey through our state-of-the-art digital library system. Access knowledge anytime, anywhere.
                </p>
                <div className="flex gap-4">
                  {/* Social Icons would go here */}
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Quick Links</h4>
                <ul className="space-y-4 text-sm font-medium">
                  <li><Link href="/" className="hover:text-blue-400 transition-colors">Home</Link></li>
                  <li><Link href="/auth/signin" className="hover:text-blue-400 transition-colors">SignIn</Link></li>
                  <li><Link href="/auth/signup" className="hover:text-blue-400 transition-colors">Join Now</Link></li>
                </ul>
              </div>


              {/* Contact Column */}
              <div>
                <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Contact Us</h4>
                <ul className="space-y-5">
                  <li className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-blue-500 shrink-0" />
                    <span className="text-sm font-medium">No. 15/2, Galle Road,<br />Colombo 00400,<br />SRI LANKA</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-blue-500 shrink-0" />
                    <span className="text-sm font-medium">0112379368</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-blue-500 shrink-0" />
                    <span className="text-sm font-medium">luminadigitallibrary@gmail.com</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-8 border-t border-slate-900 flex justify-center">
              <p className="text-xs font-medium tracking-wide">
                © 2026 Lumina Library System. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}