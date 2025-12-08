"use client";

import { useEffect, useState } from "react";
import { StatCard } from "@/components/agent/stat-card";
import { ChartContainer } from "@/components/admin/chart-container";
import { AnimatedSection } from "@/components/ui/animated-section";
import {
  Building2,
  Users,
  DollarSign,
  CreditCard,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useCommissions } from "@/hooks/use-commissions";
import { useListings } from "@/hooks/use-listings";
import { useInstallments } from "@/hooks/use-installments";
import { usePlots } from "@/hooks/use-plots";
import { reportAPI } from "@/lib/api";

function LineChart({ data }: { data: { month: string; value: number }[] }) {
  const maxValue = Math.max(...data.map((d) => d.value), 1);
  
  return (
    <div className="h-64 flex items-end justify-between gap-2">
      {data.map((item, index) => (
        <div key={index} className="flex-1 flex flex-col items-center gap-2">
          <div className="w-full bg-[#E7EAEF] rounded-t-lg relative" style={{ height: "200px" }}>
            <div
              className="absolute bottom-0 w-full bg-[#6139DB] rounded-t-lg transition-all"
              style={{ height: `${(item.value / maxValue) * 100}%` }}
            />
          </div>
          <span className="text-xs text-[#3A3C40] font-medium">{item.month}</span>
          <span className="text-xs text-[#6139DB] font-semibold">{item.value}M</span>
        </div>
      ))}
    </div>
  );
}

export default function AgentDashboardPage() {
  const { user } = useAuth();
  const { commissions, loading: commissionsLoading } = useCommissions({
    agentId: user?.id,
  });
  const { listings, loading: listingsLoading } = useListings({
    agentId: user?.id,
  });
  const { plans, loading: installmentsLoading } = useInstallments();
  const { plots, loading: plotsLoading } = usePlots();
  
  const [monthlyPerformance, setMonthlyPerformance] = useState<
    { month: string; value: number }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        const response = await reportAPI.getMonthlyProgress();
        const data = response.data.data.report;
        // Mock monthly data - in real app, fetch agent-specific monthly data
        setMonthlyPerformance([
          { month: "Jul", value: 12 },
          { month: "Aug", value: 18 },
          { month: "Sep", value: 15 },
          { month: "Oct", value: 22 },
          { month: "Nov", value: 28 },
          { month: "Dec", value: 32 },
        ]);
      } catch (error) {
        console.error("Failed to fetch performance:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchPerformance();
    }
  }, [user]);

  const totalProjects = new Set(
    plots.map((p) => p.projectId?._id).filter(Boolean)
  ).size;
  
  const activeBuyers = new Set(
    plans.map((p) => p.buyerId._id)
  ).size;
  
  const totalSales = commissions.reduce((sum, c) => sum + (c.amount || 0), 0);
  
  const pendingInstallments = plans.filter(
    (p) => p.status === "active" && p.nextDueDate && new Date(p.nextDueDate) < new Date()
  ).length;
  
  const totalCommissions = commissions
    .filter((c) => c.status === "paid")
    .reduce((sum, c) => sum + (c.amount || 0), 0);

  // Calculate lead status from listings
  const leadStatus = {
    new: listings.filter((l) => l.status === "pending").length,
    "in-progress": listings.filter((l) => l.status === "approved").length,
    won: listings.filter((l) => l.status === "sold").length,
    lost: listings.filter((l) => l.status === "rejected").length,
  };

  if (
    loading ||
    commissionsLoading ||
    listingsLoading ||
    installmentsLoading ||
    plotsLoading
  ) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6139DB]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-8">
      {/* Header */}
      <AnimatedSection variant="slideUp">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#111111]">
              Agent Dashboard
            </h1>
            <p className="text-sm sm:text-base text-[#3A3C40] mt-1">
              Welcome back, {user?.name}! Here's your performance overview.
            </p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white border border-[#E7EAEF] rounded-xl text-sm font-medium text-[#3A3C40] hover:bg-[#FAFAFA] transition-colors">
              Export Report
            </button>
          </div>
        </div>
      </AnimatedSection>

      {/* Stats Grid */}
      <AnimatedSection
        variant="slideUp"
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
      >
        <StatCard
          title="Assigned Projects"
          value={totalProjects.toString()}
          icon={Building2}
          trend={{ value: "+1 this month", isPositive: true }}
        />
        <StatCard
          title="Active Buyers"
          value={activeBuyers.toString()}
          icon={Users}
          trend={{ value: "+3", isPositive: true }}
        />
        <StatCard
          title="Total Sales"
          value={`PKR ${(totalSales / 1000000).toFixed(1)}M`}
          icon={TrendingUp}
          trend={{ value: "+15%", isPositive: true }}
          iconBg="bg-green-100"
        />
        <StatCard
          title="Pending Follow-ups"
          value={pendingInstallments.toString()}
          icon={AlertCircle}
          trend={{ value: "-2", isPositive: true }}
          iconBg="bg-orange-100"
        />
        <StatCard
          title="Commissions Earned"
          value={`PKR ${(totalCommissions / 1000000).toFixed(1)}M`}
          icon={DollarSign}
          trend={{ value: "+PKR 820K", isPositive: true }}
          iconBg="bg-purple-100"
        />
      </AnimatedSection>

      {/* Charts */}
      <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
        <AnimatedSection variant="slideUp">
          <ChartContainer
            title="Monthly Performance"
            description="Sales performance over the last 6 months"
          >
            <LineChart data={monthlyPerformance} />
          </ChartContainer>
        </AnimatedSection>

        <AnimatedSection variant="slideUp">
          <ChartContainer
            title="Lead Status Overview"
            description="Current pipeline status"
          >
            <div className="space-y-4">
              {[
                {
                  label: "New Leads",
                  value: leadStatus.new,
                  color: "bg-blue-500",
                },
                {
                  label: "In Progress",
                  value: leadStatus["in-progress"],
                  color: "bg-yellow-500",
                },
                {
                  label: "Won",
                  value: leadStatus.won,
                  color: "bg-green-500",
                },
                {
                  label: "Lost",
                  value: leadStatus.lost,
                  color: "bg-red-500",
                },
              ].map((status) => {
                const total =
                  leadStatus.new +
                  leadStatus["in-progress"] +
                  leadStatus.won +
                  leadStatus.lost;
                const percentage = total > 0 ? (status.value / total) * 100 : 0;
                return (
                  <div key={status.label} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-[#111111]">
                        {status.label}
                      </span>
                      <span className="text-sm font-semibold text-[#6139DB]">
                        {status.value}
                      </span>
                    </div>
                    <div className="w-full bg-[#E7EAEF] rounded-full h-2.5">
                      <div
                        className={`${status.color} h-2.5 rounded-full transition-all`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </ChartContainer>
        </AnimatedSection>
      </div>

      {/* Quick Actions */}
      <AnimatedSection variant="slideUp">
        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <button className="p-4 bg-white border border-[#E7EAEF] rounded-xl hover:border-[#6139DB] hover:shadow-md transition-all text-left">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#6139DB]/10 rounded-lg">
                <Users className="h-5 w-5 text-[#6139DB]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#111111]">Add New Lead</p>
                <p className="text-xs text-[#3A3C40]">Capture a new lead</p>
              </div>
            </div>
          </button>
          <button className="p-4 bg-white border border-[#E7EAEF] rounded-xl hover:border-[#6139DB] hover:shadow-md transition-all text-left">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#6139DB]/10 rounded-lg">
                <Building2 className="h-5 w-5 text-[#6139DB]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#111111]">View Available Plots</p>
                <p className="text-xs text-[#3A3C40]">Browse inventory</p>
              </div>
            </div>
          </button>
          <button className="p-4 bg-white border border-[#E7EAEF] rounded-xl hover:border-[#6139DB] hover:shadow-md transition-all text-left">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#6139DB]/10 rounded-lg">
                <CreditCard className="h-5 w-5 text-[#6139DB]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#111111]">Check Installments</p>
                <p className="text-xs text-[#3A3C40]">Pending payments</p>
              </div>
            </div>
          </button>
          <button className="p-4 bg-white border border-[#E7EAEF] rounded-xl hover:border-[#6139DB] hover:shadow-md transition-all text-left">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#6139DB]/10 rounded-lg">
                <DollarSign className="h-5 w-5 text-[#6139DB]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#111111]">Commission Status</p>
                <p className="text-xs text-[#3A3C40]">View earnings</p>
              </div>
            </div>
          </button>
        </div>
      </AnimatedSection>
    </div>
  );
}
