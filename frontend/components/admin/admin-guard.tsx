"use client";

import { ReactNode } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

interface AdminGuardProps {
  children: ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
  return <ProtectedRoute allowedRoles={["admin"]}>{children}</ProtectedRoute>;
}

