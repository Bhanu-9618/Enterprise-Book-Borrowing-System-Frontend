"use client";

import { useEffect, useState, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/src/store/useAuthStore";
import { Loader2 } from "lucide-react";

interface AuthGuardProps {
  children: ReactNode;
  allowedRoles?: ('ADMIN' | 'USER')[];
}

export default function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { token, role } = useAuthStore();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Defers the state update until immediately after paint, avoiding
    // the "synchronous cascading render" warning from React/Linters.
    const timer = setTimeout(() => {
      setHydrated(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    // If not authenticated, redirect to signin
    if (!token) {
      router.replace(`/auth/signin?redirect=${pathname}`);
      return;
    }

    // Role-based protection
    if (allowedRoles && role && !allowedRoles.includes(role)) {
      if (role === 'ADMIN') {
        router.replace('/staff');
      } else {
        router.replace('/users');
      }
    }
  }, [token, role, router, pathname, allowedRoles, hydrated]);

  if (!hydrated || !token) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  return <>{children}</>;
}
