"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AnimatedSection } from "@/components/ui/animated-section";
import { ModuleHeader } from "@/components/agent/module-header";
import { useAgentStore } from "@/hooks/use-agent-store";
import { AgentDataTable } from "@/components/agent/data-table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AgentCustomersPage() {
  const { customers } = useAgentStore();
  const [form, setForm] = useState({ name: "", email: "", phone: "" });

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-8 lg:space-y-10">
      <ModuleHeader
        title="Customer Management"
        subtitle="Add buyers, link plots, and keep their documents safe."
      />

      <AnimatedSection variant="slideUp" className="grid gap-4 sm:gap-6 lg:grid-cols-3">
        <form className="glass rounded-3xl border border-white/10 p-6 space-y-4">
          <h3 className="text-xl font-semibold">Add Buyer</h3>
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              placeholder="Bilal Ahmed"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="buyer@example.com"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Phone</Label>
            <Input
              placeholder="+92 3XX XXXXXXX"
              value={form.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
          </div>
          <Button variant="gradient" className="w-full">
            Save Profile
          </Button>
        </form>

        <AnimatedSection
          variant="slideUp"
          className="lg:col-span-2 glass rounded-3xl border border-white/10 p-6 space-y-4"
        >
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="outline">Link Plot</Button>
            <Button variant="outline">Upload Documents</Button>
            <Button variant="gradient">Share Summary</Button>
          </div>
          <AgentDataTable
            columns={[
              { key: "name", label: "Name" },
              { key: "email", label: "Email" },
              { key: "phone", label: "Phone" },
              {
                key: "assignedPlot",
                label: "Plot",
                render: (row) => row.assignedPlot ?? "—",
              },
              {
                key: "documents",
                label: "Docs",
                render: (row) => `${row.documents} files`,
              },
            ]}
            data={customers}
          />
        </AnimatedSection>
      </AnimatedSection>
    </div>
  );
}
