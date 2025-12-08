"use client";

import { ReactNode } from "react";
import { useAgentStore } from "@/hooks/use-agent-store";

export function AgentGuard({ children }: { children: ReactNode }) {
  const { role } = useAgentStore();

  if (role !== "agent") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center space-y-4">
          <p className="text-sm uppercase tracking-[0.35em] text-white/40">
            Restricted
          </p>
          <h1 className="text-3xl font-semibold">Agent access only</h1>
          <p className="text-white/60">
            Contact your administrator to enable agent permissions.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
