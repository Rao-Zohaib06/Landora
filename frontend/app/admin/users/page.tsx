"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AnimatedSection } from "@/components/ui/animated-section";
import { Plus, Search, Edit, Trash2, UserPlus } from "lucide-react";
import { useUsers } from "@/hooks/use-users";

type UserType = "admin" | "agent" | "user";
type UserStatus = "active" | "inactive" | "pending" | "suspended";

const userTypeColors: Record<UserType, string> = {
  admin: "bg-purple-100 text-purple-800",
  agent: "bg-blue-100 text-blue-800",
  user: "bg-green-100 text-green-800",
};

const statusColors: Record<UserStatus, string> = {
  active: "bg-green-100 text-green-800",
  inactive: "bg-[#E7EAEF] text-[#3A3C40]",
  pending: "bg-yellow-100 text-yellow-800",
  suspended: "bg-red-100 text-red-800",
};

export default function UsersPage() {
  const { users, loading, error } = useUsers();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<UserType | "all">("all");

  const filteredUsers = users.filter(
    (user) =>
      (user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (selectedType === "all" || user.role === selectedType)
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6139DB]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-8">
      {/* Header */}
      <AnimatedSection variant="slideUp">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#111111]">User Management</h1>
            <p className="text-sm sm:text-base text-[#3A3C40] mt-1">Manage all system users and access levels</p>
          </div>
          <Button className="bg-[#6139DB] hover:bg-[#6139DB]/90">
            <UserPlus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>
      </AnimatedSection>

      {/* Filters */}
      <AnimatedSection variant="slideUp">
        <Card className="bg-white border-[#E7EAEF]">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#3A3C40]/60" />
                <Input
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {(["all", "admin", "agent", "user"] as const).map(
                  (type) => (
                    <button
                      key={type}
                      onClick={() => setSelectedType(type)}
                      className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                        selectedType === type
                          ? "bg-[#6139DB] text-white"
                          : "bg-[#FAFAFA] text-[#3A3C40] hover:bg-[#E7EAEF]"
                      }`}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  )
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </AnimatedSection>

      {/* Users Table */}
      <AnimatedSection variant="slideUp">
        <Card className="bg-white border-[#E7EAEF]">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-[#111111]">
              All Users ({filteredUsers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="table-wrapper">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell className="font-medium">{user._id.slice(-8)}</TableCell>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phone}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-lg text-xs font-medium ${userTypeColors[user.role]}`}
                        >
                          {user.role}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-lg text-xs font-medium ${statusColors[user.status as UserStatus] || statusColors.pending}`}
                        >
                          {user.status}
                        </span>
                      </TableCell>
                      <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <UserPlus className="h-12 w-12 text-[#3A3C40]/40 mx-auto mb-4" />
                <p className="text-[#3A3C40]">No users found</p>
              </div>
            )}
          </CardContent>
        </Card>
      </AnimatedSection>
    </div>
  );
}
