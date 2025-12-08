"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AnimatedSection } from "@/components/ui/animated-section";
import { Plus, Users, TrendingUp, DollarSign } from "lucide-react";
import { StatCard } from "@/components/admin/stat-card";

interface Partner {
  id: string;
  name: string;
  email: string;
  sharePercent: number;
  investmentAmount: string;
  profitDistributed: string;
  pendingProfit: string;
  status: "active" | "inactive";
}

const mockPartners: Partner[] = [
  {
    id: "PT-001",
    name: "Ahmed Khan",
    email: "ahmed@partner.com",
    sharePercent: 25,
    investmentAmount: "PKR 50M",
    profitDistributed: "PKR 12.5M",
    pendingProfit: "PKR 2.3M",
    status: "active",
  },
  {
    id: "PT-002",
    name: "Sara Sheikh",
    email: "sara@partner.com",
    sharePercent: 15,
    investmentAmount: "PKR 30M",
    profitDistributed: "PKR 7.5M",
    pendingProfit: "PKR 1.2M",
    status: "active",
  },
  {
    id: "PT-003",
    name: "Bilal Malik",
    email: "bilal@partner.com",
    sharePercent: 10,
    investmentAmount: "PKR 20M",
    profitDistributed: "PKR 5M",
    pendingProfit: "PKR 800K",
    status: "active",
  },
];

export default function PartnersPage() {
  const totalInvestment = "PKR 100M";
  const totalProfitDistributed = "PKR 25M";
  const totalPendingProfit = "PKR 4.3M";

  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-8">
      {/* Header */}
      <AnimatedSection variant="slideUp">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#111111]">Partner Management</h1>
            <p className="text-sm sm:text-base text-[#3A3C40] mt-1">Manage partners and profit distribution</p>
          </div>
          <Button className="bg-[#6139DB] hover:bg-[#6139DB]/90">
            <Plus className="h-4 w-4 mr-2" />
            Add Partner
          </Button>
        </div>
      </AnimatedSection>

      {/* Stats */}
      <AnimatedSection variant="slideUp" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Partners"
          value={mockPartners.length.toString()}
          icon={Users}
        />
        <StatCard
          title="Total Investment"
          value={totalInvestment}
          icon={DollarSign}
        />
        <StatCard
          title="Profit Distributed"
          value={totalProfitDistributed}
          icon={TrendingUp}
          iconBg="bg-green-100"
        />
        <StatCard
          title="Pending Profit"
          value={totalPendingProfit}
          icon={DollarSign}
          iconBg="bg-orange-100"
        />
      </AnimatedSection>

      {/* Partners Table */}
      <AnimatedSection variant="slideUp">
        <Card className="bg-white border-[#E7EAEF]">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-[#111111]">All Partners</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Partner ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Share %</TableHead>
                  <TableHead>Investment</TableHead>
                  <TableHead>Profit Distributed</TableHead>
                  <TableHead>Pending</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockPartners.map((partner) => (
                  <TableRow key={partner.id}>
                    <TableCell className="font-medium">{partner.id}</TableCell>
                    <TableCell>{partner.name}</TableCell>
                    <TableCell>{partner.email}</TableCell>
                    <TableCell>
                      <span className="font-semibold text-[#6139DB]">{partner.sharePercent}%</span>
                    </TableCell>
                    <TableCell>{partner.investmentAmount}</TableCell>
                    <TableCell className="text-green-600 font-medium">
                      {partner.profitDistributed}
                    </TableCell>
                    <TableCell className="text-orange-600 font-medium">
                      {partner.pendingProfit}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-lg text-xs font-medium ${
                          partner.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-[#E7EAEF] text-[#3A3C40]"
                        }`}
                      >
                        {partner.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        View Ledger
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </AnimatedSection>
    </div>
  );
}

