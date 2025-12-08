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
import { Plus, DollarSign, CheckCircle2, Clock } from "lucide-react";
import { StatCard } from "@/components/admin/stat-card";

interface Commission {
  id: string;
  agent: string;
  project: string;
  plot: string;
  saleAmount: string;
  commissionRate: string;
  commissionAmount: string;
  status: "pending" | "approved" | "paid";
  dueDate: string;
}

const mockCommissions: Commission[] = [
  {
    id: "COM-001",
    agent: "Sara Malik",
    project: "Emerald Enclave",
    plot: "PL-202",
    saleAmount: "PKR 18M",
    commissionRate: "2.5%",
    commissionAmount: "PKR 450K",
    status: "pending",
    dueDate: "2024-01-20",
  },
  {
    id: "COM-002",
    agent: "Bilal Riaz",
    project: "Canal Heights",
    plot: "PL-205",
    saleAmount: "PKR 9.5M",
    commissionRate: "3%",
    commissionAmount: "PKR 285K",
    status: "approved",
    dueDate: "2024-01-25",
  },
  {
    id: "COM-003",
    agent: "Hassan Raza",
    project: "Skyline Residency",
    plot: "PL-311",
    saleAmount: "PKR 9.5M",
    commissionRate: "2%",
    commissionAmount: "PKR 190K",
    status: "paid",
    dueDate: "2024-01-10",
  },
];

export default function CommissionsPage() {
  const totalPending = "PKR 450K";
  const totalApproved = "PKR 285K";
  const totalPaid = "PKR 190K";

  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-8">
      {/* Header */}
      <AnimatedSection variant="slideUp">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#111111]">Commission Management</h1>
            <p className="text-[#3A3C40] mt-1">Manage agent commissions and disbursements</p>
          </div>
          <Button className="bg-[#6139DB] hover:bg-[#6139DB]/90">
            <Plus className="h-4 w-4 mr-2" />
            Add Commission Rule
          </Button>
        </div>
      </AnimatedSection>

      {/* Stats */}
      <AnimatedSection variant="slideUp" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Pending Commissions"
          value={totalPending}
          icon={Clock}
          iconBg="bg-yellow-100"
        />
        <StatCard
          title="Approved Commissions"
          value={totalApproved}
          icon={CheckCircle2}
          iconBg="bg-blue-100"
        />
        <StatCard
          title="Paid Commissions"
          value={totalPaid}
          icon={DollarSign}
          iconBg="bg-green-100"
        />
      </AnimatedSection>

      {/* Commissions Table */}
      <AnimatedSection variant="slideUp">
        <Card className="bg-white border-[#E7EAEF]">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-[#111111]">Commission Ledger</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Commission ID</TableHead>
                  <TableHead>Agent</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Plot</TableHead>
                  <TableHead>Sale Amount</TableHead>
                  <TableHead>Rate</TableHead>
                  <TableHead>Commission</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockCommissions.map((commission) => (
                  <TableRow key={commission.id}>
                    <TableCell className="font-medium">{commission.id}</TableCell>
                    <TableCell>{commission.agent}</TableCell>
                    <TableCell>{commission.project}</TableCell>
                    <TableCell>{commission.plot}</TableCell>
                    <TableCell>{commission.saleAmount}</TableCell>
                    <TableCell>{commission.commissionRate}</TableCell>
                    <TableCell className="font-semibold text-[#6139DB]">
                      {commission.commissionAmount}
                    </TableCell>
                    <TableCell>{commission.dueDate}</TableCell>
                    <TableCell>
                      {commission.status === "pending" ? (
                        <span className="px-2 py-1 rounded-lg text-xs font-medium bg-yellow-100 text-yellow-800">
                          Pending
                        </span>
                      ) : commission.status === "approved" ? (
                        <span className="px-2 py-1 rounded-lg text-xs font-medium bg-blue-100 text-blue-800">
                          Approved
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded-lg text-xs font-medium bg-green-100 text-green-800">
                          Paid
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        {commission.status === "pending" ? "Approve" : "View"}
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

