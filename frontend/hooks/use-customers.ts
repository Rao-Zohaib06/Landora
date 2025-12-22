import { useState, useEffect } from "react";
import { api } from "@/lib/api";

export interface Customer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  cnic?: string;
  address?: string;
  assignedPlot?: {
    _id: string;
    plotNumber: string;
    projectId: {
      name: string;
    };
  };
  documents?: number;
  agentId?: {
    _id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export function useCustomers(params?: { agentId?: string }) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (params?.agentId) queryParams.append("agentId", params.agentId);

      // Fetch all users and filter by role buyer on frontend for now
      const response = await api.get(`/api/users?${queryParams.toString()}`);
      const allUsers = response.data.data || [];
      setCustomers(allUsers.filter((u: any) => u.role === 'buyer'));
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch customers");
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  const addCustomer = async (data: Partial<Customer>) => {
    try {
      await api.post("/api/users", { ...data, role: "buyer" });
      await fetchCustomers();
    } catch (err: any) {
      throw new Error(err.response?.data?.message || "Failed to add customer");
    }
  };

  const updateCustomer = async (id: string, data: Partial<Customer>) => {
    try {
      await api.put(`/api/users/${id}`, data);
      await fetchCustomers();
    } catch (err: any) {
      throw new Error(err.response?.data?.message || "Failed to update customer");
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [params?.agentId]);

  return {
    customers,
    loading,
    error,
    refetch: fetchCustomers,
    addCustomer,
    updateCustomer,
  };
}
