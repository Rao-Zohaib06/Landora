"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AnimatedSection } from "@/components/ui/animated-section";
import { ListingCard } from "@/components/agent/listing-card";
import { Plus, Search, Filter } from "lucide-react";
import Link from "next/link";

const mockListings = [
  {
    id: "LST-001",
    title: "Premium 1 Kanal Plot - DHA Phase 5",
    location: "DHA Phase 5, Lahore",
    price: "PKR 32M",
    area: "1 Kanal",
    status: "approved" as const,
  },
  {
    id: "LST-002",
    title: "10 Marla Corner Plot - Bahria Town",
    location: "Bahria Town, Lahore",
    price: "PKR 18M",
    area: "10 Marla",
    status: "pending" as const,
  },
  {
    id: "LST-003",
    title: "Commercial Shop - Main Boulevard",
    location: "Main Boulevard, Lahore",
    price: "PKR 12M",
    area: "500 sqft",
    status: "approved" as const,
  },
];

export default function ListingsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredListings = mockListings.filter(
    (listing) =>
      listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-8">
      {/* Header */}
      <AnimatedSection variant="slideUp">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#111111]">Property Listings</h1>
            <p className="text-[#3A3C40] mt-1">Manage your property listings</p>
          </div>
          <Button className="bg-[#6139DB] hover:bg-[#6139DB]/90" asChild>
            <Link href="/agent/listings/new">
              <Plus className="h-4 w-4 mr-2" />
              Add New Listing
            </Link>
          </Button>
        </div>
      </AnimatedSection>

      {/* Filters */}
      <AnimatedSection variant="slideUp">
        <Card className="bg-white border-[#E7EAEF]">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#3A3C40]/60" />
                <Input
                  placeholder="Search listings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select className="px-4 py-2 border border-[#E7EAEF] rounded-xl bg-white text-sm">
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </CardContent>
        </Card>
      </AnimatedSection>

      {/* Listings Grid */}
      <AnimatedSection variant="slideUp" className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {filteredListings.map((listing) => (
          <ListingCard key={listing.id} {...listing} />
        ))}
      </AnimatedSection>
    </div>
  );
}

