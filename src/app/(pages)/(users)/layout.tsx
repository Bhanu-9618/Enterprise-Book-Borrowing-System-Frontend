"use client";

import AuthGuard from "@/src/app/(pages)/auth/AuthGuard";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return <AuthGuard allowedRoles={['USER']}>{children}</AuthGuard>;
}
