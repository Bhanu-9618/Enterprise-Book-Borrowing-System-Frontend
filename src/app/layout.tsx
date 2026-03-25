import "./globals.css";
import { Plus_Jakarta_Sans } from "next/font/google";
import Navbar from "@/src/components/Navbar";

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
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <footer className="border-t py-6 text-center text-sm text-muted-foreground">
          © 2026 Lib-System. All rights reserved.
        </footer>
      </body>
    </html>
  );
}