"use client";

import { Hero } from "@/components/home/hero";
import { ExploreMore } from "@/components/home/explore-more";
import { Container } from "@/components/layout/container";
import { AnimatedSection } from "@/components/ui/animated-section";
import { GradientText } from "@/components/ui/gradient-text";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Building2, TrendingUp } from "lucide-react";
import Link from "next/link";

const featuredProperties = [
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

const features = [
  {
    icon: Building2,
    title: "Premium Properties",
    description: "Access to exclusive listings from verified sellers and developers.",
  },
  {
    icon: MapPin,
    title: "Location Insights",
    description: "Detailed neighborhood information and property analytics.",
  },
  {
    icon: TrendingUp,
    title: "Market Trends",
    description: "Stay updated with real-time market prices and trends.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* Featured Properties */}
      <section className="py-16 sm:py-20 md:py-24 lg:py-28 bg-white">
        <Container>
          <AnimatedSection variant="slideUp" className="text-center space-y-3 sm:space-y-4 mb-8 sm:mb-10 md:mb-12">
            <p className="text-sm uppercase tracking-[0.35em] text-[#3A3C40]/60">
              Featured Listings
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#111111]">
              Explore <GradientText>Landora Projects</GradientText>
            </h2>
            <p className="text-[#3A3C40] max-w-2xl mx-auto">
              Handpicked premium properties across Pakistan's top cities.
            </p>
          </AnimatedSection>

          <AnimatedSection
            variant="slideUp"
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {featuredProperties.map((property) => (
              <Card
                key={property.id}
                className="flex flex-col bg-white border border-[#E7EAEF] rounded-2xl hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <p className="text-xs uppercase tracking-widest text-[#3A3C40]/60">
                    {property.id}
                  </p>
                  <CardTitle className="text-xl text-[#111111]">
                    {property.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-3 text-sm text-[#3A3C40] flex-1">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#6139DB]" />
                    {property.location}
                  </div>
                  <p>{property.meta}</p>
                  <p className="text-2xl font-semibold text-[#111111]">
                    {property.price}
                  </p>
                  <Button variant="outline" className="mt-auto" asChild>
                    <Link href={`/properties/${property.id.toLowerCase()}`}>
                      View details
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </AnimatedSection>

          <AnimatedSection variant="fadeIn" className="text-center mt-12">
            <Button variant="gradient" size="lg" asChild>
              <Link href="/properties">View All Properties</Link>
            </Button>
          </AnimatedSection>
        </Container>
      </section>

      {/* Explore More Section */}
      <ExploreMore />

      {/* Features Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-[#FAFAFA]">
        <Container>
          <AnimatedSection variant="slideUp" className="text-center space-y-3 sm:space-y-4 mb-8 sm:mb-10 md:mb-12">
            <p className="text-sm uppercase tracking-[0.35em] text-[#3A3C40]/60">
              Why Choose Us
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#111111]">
              Your Trusted <GradientText>Real Estate</GradientText> Partner
            </h2>
          </AnimatedSection>

          <AnimatedSection
            variant="slideUp"
            className="grid gap-4 sm:gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3"
          >
            {features.map((feature, index) => (
              <Card
                key={index}
                className="bg-white border border-[#E7EAEF] rounded-2xl text-center"
              >
                <CardHeader>
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-[#6139DB]/10 flex items-center justify-center mb-4">
                    <feature.icon className="w-8 h-8 text-[#6139DB]" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-[#3A3C40]">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </AnimatedSection>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-br from-[#6139DB] to-[#6139DB]/80">
        <Container>
          <AnimatedSection variant="slideUp" className="text-center space-y-4 sm:space-y-6 text-white max-w-3xl mx-auto px-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">
              Ready to Find Your Dream Property?
            </h2>
            <p className="text-base sm:text-lg text-white/90">
              Join thousands of satisfied customers who found their perfect home with Landora.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-4">
              <Button variant="secondary" size="lg" asChild>
                <Link href="/properties">Browse Properties</Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                asChild
              >
                <Link href="/auth/register">Get Started</Link>
              </Button>
            </div>
          </AnimatedSection>
        </Container>
      </section>
    </div>
  );
}

