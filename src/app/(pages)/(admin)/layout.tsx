"use client";

import AuthGuard from "@/src/app/(pages)/auth/AuthGuard";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AuthGuard allowedRoles={['ADMIN']}>{children}</AuthGuard>;
}
