"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AnimatedSection } from "@/components/ui/animated-section";
import { useAuth } from "@/contexts/AuthContext";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { register } = useAuth();
  const router = useRouter();

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await register(form);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 bg-[#FAFAFA]">
      <AnimatedSection variant="slideUp" className="w-full max-w-4xl">
        <Card className="bg-white border border-[#E7EAEF] rounded-2xl shadow-md">
          <CardHeader className="text-center space-y-2 p-6 sm:p-8">
            <CardTitle className="text-2xl sm:text-3xl font-semibold text-[#111111]">
              Create your Landora account
            </CardTitle>
            <CardDescription className="text-[#3A3C40]">
              Gain access to dashboards, lead pipelines, and plot inventory.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:gap-6 md:grid-cols-2 p-6 sm:p-8 pt-0">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full name</Label>
                <Input
                  id="name"
                  placeholder="Zain Malik"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Work Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="team@landora.com"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  placeholder="+92 300 0000000"
                  value={form.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                />
              </div>
            </div>
            <div className="md:col-span-2 flex items-center gap-2 text-sm text-[#3A3C40]">
              <input type="checkbox" className="rounded border-[#E7EAEF] text-[#6139DB]" />
              I agree to the{" "}
              <Link href="#" className="text-[#6139DB] hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="#" className="text-[#6139DB] hover:underline">
                Privacy Policy
              </Link>
            </div>
            {error && (
              <div className="md:col-span-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                {error}
              </div>
            )}
            <div className="md:col-span-2 flex flex-col gap-4">
              <Button
                variant="default"
                className="w-full"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Creating account..." : "Create Account"}
              </Button>
              <p className="text-center text-sm text-[#3A3C40]">
                Already onboarded?{" "}
                <Link href="/auth/login" className="text-[#6139DB] font-semibold">
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </AnimatedSection>
    </div>
  );
}

