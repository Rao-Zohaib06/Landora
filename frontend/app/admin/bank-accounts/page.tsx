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
import { Plus, Upload, Banknote, FileUp } from "lucide-react";
import { StatCard } from "@/components/admin/stat-card";

interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountType: string;
  balance: string;
  lastTransaction: string;
}

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: string;
  type: "credit" | "debit";
  status: "matched" | "unmatched";
}

const mockAccounts: BankAccount[] = [
  {
    id: "BA-001",
    bankName: "Meezan Bank",
    accountNumber: "PK12MEZN1234567890",
    accountType: "Current",
    balance: "PKR 45M",
    lastTransaction: "2024-01-15",
  },
  {
    id: "BA-002",
    bankName: "HBL",
    accountNumber: "PK12HBL0987654321",
    accountType: "Savings",
    balance: "PKR 28M",
    lastTransaction: "2024-01-14",
  },
  {
    id: "BA-003",
    bankName: "UBL",
    accountNumber: "PK12UBL1122334455",
    accountType: "Current",
    balance: "PKR 52M",
    lastTransaction: "2024-01-15",
  },
];

const mockTransactions: Transaction[] = [
  {
    id: "TXN-001",
    date: "2024-01-15",
    description: "Buyer Payment - PL-202",
    amount: "PKR 500K",
    type: "credit",
    status: "matched",
  },
  {
    id: "TXN-002",
    date: "2024-01-14",
    description: "Seller Payment",
    amount: "PKR 2M",
    type: "debit",
    status: "matched",
  },
  {
    id: "TXN-003",
    date: "2024-01-13",
    description: "Unidentified Transaction",
    amount: "PKR 150K",
    type: "credit",
    status: "unmatched",
  },
];

export default function BankAccountsPage() {
  const totalBalance = "PKR 125M";
  const matchedTransactions = mockTransactions.filter((t) => t.status === "matched").length;
  const unmatchedTransactions = mockTransactions.filter((t) => t.status === "unmatched").length;

  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-8">
      {/* Header */}
      <AnimatedSection variant="slideUp">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#111111]">Bank Accounts</h1>
            <p className="text-[#3A3C40] mt-1">Manage bank accounts and transactions</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Upload CSV
            </Button>
            <Button className="bg-[#6139DB] hover:bg-[#6139DB]/90">
              <Plus className="h-4 w-4 mr-2" />
              Add Account
            </Button>
          </div>
        </div>
      </AnimatedSection>

      {/* Stats */}
      <AnimatedSection variant="slideUp" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Balance"
          value={totalBalance}
          icon={Banknote}
          iconBg="bg-green-100"
        />
        <StatCard
          title="Matched Transactions"
          value={matchedTransactions.toString()}
          icon={FileUp}
          iconBg="bg-blue-100"
        />
        <StatCard
          title="Unmatched Transactions"
          value={unmatchedTransactions.toString()}
          icon={FileUp}
          iconBg="bg-orange-100"
        />
      </AnimatedSection>

      {/* Bank Accounts */}
      <AnimatedSection variant="slideUp">
        <Card className="bg-white border-[#E7EAEF]">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-[#111111]">Bank Accounts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
              {mockAccounts.map((account) => (
                <Card key={account.id} className="bg-gradient-to-br from-[#6139DB] to-[#6139DB]/80 border-none">
                  <CardContent className="p-6 text-white">
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm opacity-90 mb-1">{account.bankName}</p>
                        <p className="text-lg font-semibold">{account.accountType}</p>
                      </div>
                      <div>
                        <p className="text-xs opacity-75 mb-1">Account Number</p>
                        <p className="font-mono text-sm">{account.accountNumber}</p>
                      </div>
                      <div className="pt-4 border-t border-white/20">
                        <p className="text-xs opacity-75 mb-1">Balance</p>
                        <p className="text-2xl font-bold">{account.balance}</p>
                      </div>
                      <div>
                        <p className="text-xs opacity-75">Last Transaction: {account.lastTransaction}</p>
                      </div>
                      <Button variant="secondary" size="sm" className="w-full mt-4">
                        View Ledger
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </AnimatedSection>

      {/* Transactions */}
      <AnimatedSection variant="slideUp">
        <Card className="bg-white border-[#E7EAEF]">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-[#111111]">Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">{transaction.id}</TableCell>
                    <TableCell>{transaction.date}</TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell
                      className={`text-right font-semibold ${
                        transaction.type === "credit" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {transaction.type === "credit" ? "+" : "-"} {transaction.amount}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-lg text-xs font-medium ${
                          transaction.type === "credit"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {transaction.type}
                      </span>
                    </TableCell>
                    <TableCell>
                      {transaction.status === "matched" ? (
                        <span className="px-2 py-1 rounded-lg text-xs font-medium bg-green-100 text-green-800">
                          Matched
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded-lg text-xs font-medium bg-orange-100 text-orange-800">
                          Unmatched
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {transaction.status === "unmatched" && (
                        <Button variant="ghost" size="sm">
                          Match
                        </Button>
                      )}
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

