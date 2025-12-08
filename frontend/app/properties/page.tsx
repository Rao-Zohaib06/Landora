"use client";

import Link from "next/link";
import { AnimatedSection } from "@/components/ui/animated-section";
import { Container } from "@/components/layout/container";
import { GradientText } from "@/components/ui/gradient-text";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

const listings = [
  {
    id: "PL-201",
    title: "Emerald Enclave Phase 2",
    location: "Lahore",
    price: "PKR 32M",
    meta: "1 Kanal • Corner • West Open",
  },
  {
    id: "PL-205",
    title: "Canal Heights Residencia",
    location: "Islamabad",
    price: "PKR 18M",
    meta: "10 Marla • Park-Facing",
  },
  {
    id: "PL-311",
    title: "Skyline Residency",
    location: "Karachi",
    price: "PKR 9.5M",
    meta: "5 Marla • Ready for Possession",
  },
];

export default function PropertiesPage() {
  return (
    <div className="py-12 sm:py-16 md:py-20">
      <Container className="space-y-6 sm:space-y-8 md:space-y-10">
        <AnimatedSection variant="slideUp" className="space-y-3 sm:space-y-4 text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-[#3A3C40]/60">Browse</p>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#111111]">
            Zameen-style <GradientText>property explorer</GradientText>
          </h1>
          <p className="text-[#3A3C40] max-w-3xl mx-auto">
            Filter premium projects, compare plot metadata, and reserve inventory directly from the
            dashboard.
          </p>
        </AnimatedSection>

        <AnimatedSection variant="slideUp" className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing) => (
            <Card
              key={listing.id}
              className="flex flex-col bg-white border border-[#E7EAEF] rounded-2xl"
            >
              <CardHeader>
                <p className="text-xs uppercase tracking-widest text-[#3A3C40]/60">
                  {listing.id}
                </p>
                <CardTitle className="text-2xl text-[#111111]">
                  {listing.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3 text-sm text-[#3A3C40] flex-1">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#6139DB]" />
                  {listing.location}
                </div>
                <p>{listing.meta}</p>
                <p className="text-2xl font-semibold text-[#111111]">
                  {listing.price}
                </p>
                <Button variant="gradient" className="mt-auto" asChild>
                  <Link href={`/properties/${listing.id.toLowerCase()}`}>View details</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </AnimatedSection>
      </Container>
    </div>
  );
}

