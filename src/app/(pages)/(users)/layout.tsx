"use client";

import AuthGuard from "@/src/components/AuthGuard";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return <AuthGuard allowedRoles={['USER']}>{children}</AuthGuard>;
}
