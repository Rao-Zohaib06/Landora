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
import { Wallet, AlertCircle, CheckCircle2 } from "lucide-react";
import { StatCard } from "@/components/admin/stat-card";

interface SellerPayment {
  id: string;
  seller: string;
  project: string;
  totalPayable: string;
  paidAmount: string;
  pendingAmount: string;
  nextPaymentDate?: string;
  paymentMode: "lump-sum" | "installments";
  status: "pending" | "partial" | "paid";
}

const mockSellerPayments: SellerPayment[] = [
  {
    id: "SP-001",
    seller: "Ahmed Landowner",
    project: "Emerald Enclave",
    totalPayable: "PKR 50M",
    paidAmount: "PKR 30M",
    pendingAmount: "PKR 20M",
    nextPaymentDate: "2024-02-01",
    paymentMode: "installments",
    status: "partial",
  },
  {
    id: "SP-002",
    seller: "Sara Property Owner",
    project: "Canal Heights",
    totalPayable: "PKR 30M",
    paidAmount: "PKR 0",
    pendingAmount: "PKR 30M",
    nextPaymentDate: "2024-01-15",
    paymentMode: "lump-sum",
    status: "pending",
  },
  {
    id: "SP-003",
    seller: "Bilal Estate",
    project: "Skyline Residency",
    totalPayable: "PKR 25M",
    paidAmount: "PKR 25M",
    pendingAmount: "PKR 0",
    paymentMode: "lump-sum",
    status: "paid",
  },
];

export default function SellerPaymentsPage() {
  const totalPayable = "PKR 105M";
  const totalPaid = "PKR 55M";
  const totalPending = "PKR 50M";

  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-8">
      {/* Header */}
      <AnimatedSection variant="slideUp">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#111111]">Seller Payment Management</h1>
            <p className="text-[#3A3C40] mt-1">Manage payments to landowners and sellers</p>
          </div>
          <Button className="bg-[#6139DB] hover:bg-[#6139DB]/90">
            Record Payment
          </Button>
        </div>
      </AnimatedSection>

      {/* Stats */}
      <AnimatedSection variant="slideUp" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Payable"
          value={totalPayable}
          icon={Wallet}
          iconBg="bg-blue-100"
        />
        <StatCard
          title="Total Paid"
          value={totalPaid}
          icon={CheckCircle2}
          iconBg="bg-green-100"
        />
        <StatCard
          title="Pending Payments"
          value={totalPending}
          icon={AlertCircle}
          iconBg="bg-red-100"
        />
      </AnimatedSection>

      {/* Seller Payments Table */}
      <AnimatedSection variant="slideUp">
        <Card className="bg-white border-[#E7EAEF]">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-[#111111]">Seller Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Payment ID</TableHead>
                  <TableHead>Seller</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Total Payable</TableHead>
                  <TableHead>Paid</TableHead>
                  <TableHead>Pending</TableHead>
                  <TableHead>Payment Mode</TableHead>
                  <TableHead>Next Payment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockSellerPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">{payment.id}</TableCell>
                    <TableCell>{payment.seller}</TableCell>
                    <TableCell>{payment.project}</TableCell>
                    <TableCell>{payment.totalPayable}</TableCell>
                    <TableCell className="text-green-600 font-medium">
                      {payment.paidAmount}
                    </TableCell>
                    <TableCell className="text-orange-600 font-medium">
                      {payment.pendingAmount}
                    </TableCell>
                    <TableCell>
                      <span className="px-2 py-1 rounded-lg text-xs font-medium bg-[#E7EAEF] text-[#3A3C40]">
                        {payment.paymentMode}
                      </span>
                    </TableCell>
                    <TableCell>{payment.nextPaymentDate || "-"}</TableCell>
                    <TableCell>
                      {payment.status === "paid" ? (
                        <span className="px-2 py-1 rounded-lg text-xs font-medium bg-green-100 text-green-800">
                          Paid
                        </span>
                      ) : payment.status === "partial" ? (
                        <span className="px-2 py-1 rounded-lg text-xs font-medium bg-yellow-100 text-yellow-800">
                          Partial
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded-lg text-xs font-medium bg-red-100 text-red-800">
                          Pending
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

