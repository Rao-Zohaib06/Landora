"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ButtonLoader } from "@/components/ui/loader";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AnimatedSection } from "@/components/ui/animated-section";
import { ArrowLeft, Save, Building2 } from "lucide-react";
import Link from "next/link";
import { projectAPI } from "@/lib/api";

export default function NewProjectPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    city: "",
    area: "",
    address: "",
    totalAreaMarla: "",
    status: "planning",
    description: "",
    developer: "",
    features: "",
    amenities: "",
    minPrice: "",
    maxPrice: "",
    pricePerMarla: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const projectData = {
        name: formData.name,
        code: formData.code || undefined,
        location: {
          city: formData.city,
          area: formData.area || undefined,
          address: formData.address || undefined,
        },
        totalAreaMarla: Number(formData.totalAreaMarla),
        status: formData.status,
        details: {
          description: formData.description || undefined,
          developer: formData.developer || undefined,
          features: formData.features ? formData.features.split(",").map(f => f.trim()) : undefined,
          amenities: formData.amenities ? formData.amenities.split(",").map(a => a.trim()) : undefined,
        },
        pricing: {
          minPrice: formData.minPrice ? Number(formData.minPrice) : undefined,
          maxPrice: formData.maxPrice ? Number(formData.maxPrice) : undefined,
          pricePerMarla: formData.pricePerMarla ? Number(formData.pricePerMarla) : undefined,
        },
      };

      await projectAPI.create(projectData);
      alert("Project created successfully!");
      router.push("/admin/projects");
    } catch (error: any) {
      console.error("Failed to create project:", error);
      alert(error.response?.data?.message || "Failed to create project. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <AnimatedSection variant="slideUp">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/projects">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Projects
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-[#111111]">Create New Project</h1>
            <p className="text-[#3A3C40] mt-1">Add a new real estate project to the system</p>
          </div>
        </div>
      </AnimatedSection>

      <form onSubmit={handleSubmit}>
        {/* Basic Information */}
        <AnimatedSection variant="slideUp">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Essential project details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Project Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g., Green Valley Housing"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="code">Project Code</Label>
                  <Input
                    id="code"
                    name="code"
                    value={formData.code}
                    onChange={handleChange}
                    placeholder="e.g., GVH-001"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="totalAreaMarla">Total Area (Marla) *</Label>
                  <Input
                    id="totalAreaMarla"
                    name="totalAreaMarla"
                    type="number"
                    value={formData.totalAreaMarla}
                    onChange={handleChange}
                    placeholder="e.g., 1000"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status *</Label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-[#E7EAEF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6139DB]"
                    required
                  >
                    <option value="planning">Planning</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                    <option value="on-hold">On Hold</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="developer">Developer Name</Label>
                <Input
                  id="developer"
                  name="developer"
                  value={formData.developer}
                  onChange={handleChange}
                  placeholder="e.g., Landora Developers"
                />
              </div>
            </CardContent>
          </Card>
        </AnimatedSection>

        {/* Location Details */}
        <AnimatedSection variant="slideUp">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Location Details</CardTitle>
              <CardDescription>Project location information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="e.g., Lahore"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="area">Area/Sector</Label>
                  <Input
                    id="area"
                    name="area"
                    value={formData.area}
                    onChange={handleChange}
                    placeholder="e.g., DHA Phase 5"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Full Address</Label>
                <Textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Complete address of the project"
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>
        </AnimatedSection>

        {/* Pricing Information */}
        <AnimatedSection variant="slideUp">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Pricing Information</CardTitle>
              <CardDescription>Set price ranges for the project</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="minPrice">Minimum Price (PKR)</Label>
                  <Input
                    id="minPrice"
                    name="minPrice"
                    type="number"
                    value={formData.minPrice}
                    onChange={handleChange}
                    placeholder="e.g., 5000000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxPrice">Maximum Price (PKR)</Label>
                  <Input
                    id="maxPrice"
                    name="maxPrice"
                    type="number"
                    value={formData.maxPrice}
                    onChange={handleChange}
                    placeholder="e.g., 20000000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pricePerMarla">Price per Marla (PKR)</Label>
                  <Input
                    id="pricePerMarla"
                    name="pricePerMarla"
                    type="number"
                    value={formData.pricePerMarla}
                    onChange={handleChange}
                    placeholder="e.g., 150000"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </AnimatedSection>

        {/* Additional Details */}
        <AnimatedSection variant="slideUp">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Additional Details</CardTitle>
              <CardDescription>Features and amenities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="description">Project Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Detailed description of the project"
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="features">Features (comma-separated)</Label>
                <Input
                  id="features"
                  name="features"
                  value={formData.features}
                  onChange={handleChange}
                  placeholder="e.g., Gated Community, 24/7 Security, Wide Roads"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amenities">Amenities (comma-separated)</Label>
                <Input
                  id="amenities"
                  name="amenities"
                  value={formData.amenities}
                  onChange={handleChange}
                  placeholder="e.g., Parks, Mosque, Community Center, Schools"
                />
              </div>
            </CardContent>
          </Card>
        </AnimatedSection>

        {/* Submit Button */}
        <AnimatedSection variant="slideUp">
          <div className="flex gap-4 justify-end">
            <Button type="button" variant="outline" asChild disabled={loading}>
              <Link href="/admin/projects">Cancel</Link>
            </Button>
            <Button type="submit" className="bg-[#6139DB] hover:bg-[#6139DB]/90" disabled={loading}>
              {loading ? (
                <>
                  <ButtonLoader className="mr-2" />
                  Creating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Create Project
                </>
              )}
            </Button>
          </div>
        </AnimatedSection>
      </form>
    </div>
  );
}
