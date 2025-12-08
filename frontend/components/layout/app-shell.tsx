"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "./navbar";
import { Footer } from "./footer";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  
  // Don't render public navbar/footer on admin or agent pages
  const isAdminRoute = pathname?.startsWith("/admin");
  const isAgentRoute = pathname?.startsWith("/agent");
  const isPublicRoute = !isAdminRoute && !isAgentRoute;

  return (
    <div className="flex min-h-screen flex-col bg-[#FAFAFA]">
      {isPublicRoute && <Navbar />}
      <main className={isPublicRoute ? "flex-1 pt-16 lg:pt-[72px]" : "flex-1"}>{children}</main>
      {isPublicRoute && <Footer />}
    </div>
  );
}
