"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatedSection } from "@/components/ui/animated-section";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { GradientText } from "@/components/ui/gradient-text";
import { BarChart3, Building2, Users, ClipboardList } from "lucide-react";

const stats = [
  { label: "Active Listings", value: "126", icon: Building2 },
  { label: "New Leads", value: "54", icon: Users },
  { label: "Site Visits", value: "18", icon: ClipboardList },
  { label: "Insights", value: "Weekly", icon: BarChart3 },
];

export default function DashboardPage() {
  return (
    <div className="py-16 bg-gradient-to-br from-[#111111] to-[#3A3C40] min-h-screen">
      <Container className="space-y-6 sm:space-y-8 md:space-y-10">
        <AnimatedSection variant="slideUp">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-white/60">Control Panel</p>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                Landora <GradientText>Overview</GradientText>
              </h1>
              <p className="text-white/60 max-w-2xl">
                Track listings, leads, and marketing health from a single dashboard. Use the quick
                actions to jump into the most common workflows.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline">Export Snapshot</Button>
              <Button variant="gradient">Create Campaign</Button>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection variant="slideUp" className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="glass border border-white/10">
              <CardContent className="flex items-center gap-4 py-6">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-[#6139DB]">
                  <stat.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-white/60 text-sm">{stat.label}</p>
                  <p className="text-2xl font-semibold text-white">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </AnimatedSection>

        <AnimatedSection variant="slideUp" className="grid gap-4 sm:gap-6 lg:grid-cols-2">
          <Card className="glass border border-white/10">
            <CardHeader>
              <CardTitle>Marketing Health</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-white/70">
              <p>• Lead qualification improved by 8% after enabling auto-routing.</p>
              <p>• 3 campaigns require updated pricing collateral before launch.</p>
              <p>• Average response time is 1.2 hours — keep it under 2 hours to maintain rank.</p>
            </CardContent>
          </Card>

          <Card className="glass border border-white/10">
            <CardHeader>
              <CardTitle>Next Steps</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="ghost" className="w-full justify-between">
                Review agent performance <span>→</span>
              </Button>
              <Button variant="ghost" className="w-full justify-between">
                Update finance reports <span>→</span>
              </Button>
              <Button variant="ghost" className="w-full justify-between">
                Publish weekly insights <span>→</span>
              </Button>
            </CardContent>
          </Card>
        </AnimatedSection>
      </Container>
    </div>
  );
}

