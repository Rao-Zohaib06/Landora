"use client";

import { useState } from "react";
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
import { FileText, Download, Filter } from "lucide-react";

type LedgerType = "buyer" | "seller" | "partner" | "agent" | "all";

interface LedgerEntry {
  id: string;
  date: string;
  type: string;
  description: string;
  debit: string;
  credit: string;
  balance: string;
  aging?: string;
}

const mockBuyerLedger: LedgerEntry[] = [
  {
    id: "BL-001",
    date: "2024-01-15",
    type: "Installment",
    description: "Monthly payment - PL-202",
    debit: "-",
    credit: "PKR 500K",
    balance: "PKR 12M",
    aging: "0-30",
  },
  {
    id: "BL-002",
    date: "2024-01-05",
    type: "Down Payment",
    description: "Initial payment - PL-311",
    debit: "-",
    credit: "PKR 2M",
    balance: "PKR 7.5M",
    aging: "31-60",
  },
];

const mockSellerLedger: LedgerEntry[] = [
  {
    id: "SL-001",
    date: "2024-01-10",
    type: "Payment",
    description: "Installment payment - Emerald Enclave",
    debit: "PKR 5M",
    credit: "-",
    balance: "PKR 20M",
  },
  {
    id: "SL-002",
    date: "2024-01-01",
    type: "Payment",
    description: "Monthly payment - Canal Heights",
    debit: "PKR 3M",
    credit: "-",
    balance: "PKR 25M",
  },
];

export default function LedgersPage() {
  const [selectedLedger, setSelectedLedger] = useState<LedgerType>("all");

  const getLedgerData = () => {
    if (selectedLedger === "buyer") return mockBuyerLedger;
    if (selectedLedger === "seller") return mockSellerLedger;
    return [...mockBuyerLedger, ...mockSellerLedger];
  };

  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-8">
      {/* Header */}
      <AnimatedSection variant="slideUp">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#111111]">Ledgers & Receivables</h1>
            <p className="text-[#3A3C40] mt-1">View and manage all financial ledgers</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button className="bg-[#6139DB] hover:bg-[#6139DB]/90">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </AnimatedSection>

      {/* Ledger Type Filter */}
      <AnimatedSection variant="slideUp">
        <Card className="bg-white border-[#E7EAEF]">
          <CardContent className="p-4">
            <div className="flex gap-2 flex-wrap">
              {(["all", "buyer", "seller", "partner", "agent"] as LedgerType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedLedger(type)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                    selectedLedger === type
                      ? "bg-[#6139DB] text-white"
                      : "bg-[#FAFAFA] text-[#3A3C40] hover:bg-[#E7EAEF]"
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)} Ledger
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </AnimatedSection>

      {/* Aging Report */}
      <AnimatedSection variant="slideUp">
        <Card className="bg-white border-[#E7EAEF]">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-[#111111]">Aging Report</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              <div className="p-4 bg-blue-50 rounded-xl">
                <p className="text-xs text-[#3A3C40] mb-1">0-30 Days</p>
                <p className="text-2xl font-bold text-[#111111]">PKR 45M</p>
              </div>
              <div className="p-4 bg-yellow-50 rounded-xl">
                <p className="text-xs text-[#3A3C40] mb-1">31-60 Days</p>
                <p className="text-2xl font-bold text-[#111111]">PKR 28M</p>
              </div>
              <div className="p-4 bg-orange-50 rounded-xl">
                <p className="text-xs text-[#3A3C40] mb-1">61-90 Days</p>
                <p className="text-2xl font-bold text-[#111111]">PKR 15M</p>
              </div>
              <div className="p-4 bg-red-50 rounded-xl">
                <p className="text-xs text-[#3A3C40] mb-1">90+ Days</p>
                <p className="text-2xl font-bold text-[#111111]">PKR 8M</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </AnimatedSection>

      {/* Ledger Table */}
      <AnimatedSection variant="slideUp">
        <Card className="bg-white border-[#E7EAEF]">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-[#111111]">
              {selectedLedger.charAt(0).toUpperCase() + selectedLedger.slice(1)} Ledger
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Entry ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Debit</TableHead>
                  <TableHead className="text-right">Credit</TableHead>
                  <TableHead className="text-right">Balance</TableHead>
                  {selectedLedger === "buyer" && <TableHead>Aging</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {getLedgerData().map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="font-medium">{entry.id}</TableCell>
                    <TableCell>{entry.date}</TableCell>
                    <TableCell>{entry.type}</TableCell>
                    <TableCell>{entry.description}</TableCell>
                    <TableCell className="text-right text-red-600">{entry.debit}</TableCell>
                    <TableCell className="text-right text-green-600">{entry.credit}</TableCell>
                    <TableCell className="text-right font-semibold">{entry.balance}</TableCell>
                    {selectedLedger === "buyer" && entry.aging && (
                      <TableCell>
                        <span className="px-2 py-1 rounded-lg text-xs font-medium bg-blue-100 text-blue-800">
                          {entry.aging} days
                        </span>
                      </TableCell>
                    )}
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

