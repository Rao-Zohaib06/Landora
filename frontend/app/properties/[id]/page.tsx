"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/layout/container";
import { AnimatedSection } from "@/components/ui/animated-section";
import { MapPin, ShieldCheck } from "lucide-react";

interface PropertyDetailProps {
  params: { id: string };
}

const catalog = {
  "pl-201": {
    title: "Emerald Enclave Phase 2",
    location: "Lahore",
    description: "Corner 1 kanal plot with boulevard access and smart utilities.",
    price: "PKR 32,000,000",
  },
  "pl-205": {
    title: "Canal Heights Residencia",
    location: "Islamabad",
    description: "10 marla park-facing plot with flexible installment plan.",
    price: "PKR 18,000,000",
  },
  "pl-311": {
    title: "Skyline Residency",
    location: "Karachi",
    description: "5 marla ready-for-possession inventory near main commercial belt.",
    price: "PKR 9,500,000",
  },
} as const;

export default function PropertyDetailPage({ params }: PropertyDetailProps) {
  const listing = useMemo(() => catalog[params.id as keyof typeof catalog], [params.id]);

  if (!listing) {
    return (
      <div className="py-24">
        <Container className="text-center space-y-4">
          <p className="text-[#3A3C40]">This plot was not found.</p>
          <Button asChild variant="outline">
            <Link href="/properties">Back to listings</Link>
          </Button>
        </Container>
      </div>
    );
  }

  return (
    <div className="py-12 sm:py-16 md:py-20">
      <Container className="space-y-6 sm:space-y-8 md:space-y-10">
        <AnimatedSection variant="slideUp">
          <Button variant="ghost" asChild>
            <Link href="/properties">← Back to properties</Link>
          </Button>
        </AnimatedSection>
        <AnimatedSection variant="slideUp">
          <Card className="bg-white border border-[#E7EAEF] rounded-2xl">
            <CardHeader className="space-y-2">
              <CardTitle className="text-xl sm:text-2xl md:text-3xl text-[#111111]">
                {listing.title}
              </CardTitle>
              <div className="flex items-center gap-2 text-[#3A3C40]">
                <MapPin className="w-4 h-4 text-[#6139DB]" />
                {listing.location}
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-[#3A3C40]">
              <p>{listing.description}</p>
              <p className="text-xl sm:text-2xl md:text-3xl font-semibold text-[#111111]">
                {listing.price}
              </p>
              <div className="flex flex-wrap gap-3">
                <Button variant="gradient">Request Hold</Button>
                <Button variant="outline">Schedule Visit</Button>
              </div>
              <div className="flex items-center gap-3 text-sm text-[#3A3C40]">
                <ShieldCheck className="w-4 h-4 text-[#6139DB]" />
                Verified inventory • Transfer-ready
              </div>
            </CardContent>
          </Card>
        </AnimatedSection>
      </Container>
    </div>
  );
}

