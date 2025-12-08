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
import { Plus, CreditCard, AlertCircle, CheckCircle2 } from "lucide-react";
import { StatCard } from "@/components/admin/stat-card";

interface Installment {
  id: string;
  buyer: string;
  plot: string;
  planType: string;
  totalAmount: string;
  paidAmount: string;
  remainingAmount: string;
  nextDueDate: string;
  status: "current" | "overdue" | "paid";
  overdueDays?: number;
}

const mockInstallments: Installment[] = [
  {
    id: "INS-001",
    buyer: "Hassan Raza",
    plot: "PL-202",
    planType: "Monthly",
    totalAmount: "PKR 18M",
    paidAmount: "PKR 6M",
    remainingAmount: "PKR 12M",
    nextDueDate: "2024-01-15",
    status: "current",
  },
  {
    id: "INS-002",
    buyer: "Fatima Sheikh",
    plot: "PL-311",
    planType: "Quarterly",
    totalAmount: "PKR 9.5M",
    paidAmount: "PKR 3M",
    remainingAmount: "PKR 6.5M",
    nextDueDate: "2024-01-05",
    status: "overdue",
    overdueDays: 12,
  },
  {
    id: "INS-003",
    buyer: "Ahmed Ali",
    plot: "PL-205",
    planType: "Bi-Annual",
    totalAmount: "PKR 32M",
    paidAmount: "PKR 20M",
    remainingAmount: "PKR 12M",
    nextDueDate: "2024-06-01",
    status: "current",
  },
];

export default function InstallmentsPage() {
  const totalReceivables = "PKR 30.5M";
  const overdueAmount = "PKR 6.5M";
  const currentMonthCollection = "PKR 8.2M";

  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-8">
      {/* Header */}
      <AnimatedSection variant="slideUp">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#111111]">Installment Management</h1>
            <p className="text-[#3A3C40] mt-1">Track and manage payment plans</p>
          </div>
          <Button className="bg-[#6139DB] hover:bg-[#6139DB]/90">
            <Plus className="h-4 w-4 mr-2" />
            Create Payment Plan
          </Button>
        </div>
      </AnimatedSection>

      {/* Stats */}
      <AnimatedSection variant="slideUp" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Receivables"
          value={totalReceivables}
          icon={CreditCard}
          iconBg="bg-blue-100"
        />
        <StatCard
          title="Overdue Amount"
          value={overdueAmount}
          icon={AlertCircle}
          iconBg="bg-red-100"
        />
        <StatCard
          title="This Month Collection"
          value={currentMonthCollection}
          icon={CheckCircle2}
          iconBg="bg-green-100"
        />
      </AnimatedSection>

      {/* Installments Table */}
      <AnimatedSection variant="slideUp">
        <Card className="bg-white border-[#E7EAEF]">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-[#111111]">Active Installments</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Installment ID</TableHead>
                  <TableHead>Buyer</TableHead>
                  <TableHead>Plot</TableHead>
                  <TableHead>Plan Type</TableHead>
                  <TableHead>Total Amount</TableHead>
                  <TableHead>Paid</TableHead>
                  <TableHead>Remaining</TableHead>
                  <TableHead>Next Due</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockInstallments.map((installment) => (
                  <TableRow key={installment.id}>
                    <TableCell className="font-medium">{installment.id}</TableCell>
                    <TableCell>{installment.buyer}</TableCell>
                    <TableCell>{installment.plot}</TableCell>
                    <TableCell>{installment.planType}</TableCell>
                    <TableCell>{installment.totalAmount}</TableCell>
                    <TableCell className="text-green-600 font-medium">
                      {installment.paidAmount}
                    </TableCell>
                    <TableCell>{installment.remainingAmount}</TableCell>
                    <TableCell>{installment.nextDueDate}</TableCell>
                    <TableCell>
                      {installment.status === "overdue" ? (
                        <span className="px-2 py-1 rounded-lg text-xs font-medium bg-red-100 text-red-800">
                          Overdue ({installment.overdueDays} days)
                        </span>
                      ) : installment.status === "current" ? (
                        <span className="px-2 py-1 rounded-lg text-xs font-medium bg-blue-100 text-blue-800">
                          Current
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded-lg text-xs font-medium bg-green-100 text-green-800">
                          Paid
                        </span>
                      )}
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

