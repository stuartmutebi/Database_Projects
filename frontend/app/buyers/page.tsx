"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarNav } from "@/components/sidebar-nav";
import { Plus, Pencil, Trash2 } from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

type Buyer = {
  buyer_id: number;
  buyer_name: string;
  contact_info?: string | null;
  email?: string | null;
  phone?: string | null;
};

export default function BuyersPage() {
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBuyer, setEditingBuyer] = useState<Buyer | null>(null);
  const [formData, setFormData] = useState({
    buyer_name: "",
    contact_info: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    loadBuyers();
  }, []);

  async function loadBuyers() {
    try {
      const res = await fetch(`${API_BASE_URL}/api/buyers`);
      if (res.ok) {
        const data = await res.json();
        setBuyers(data);
      }
    } catch (e) {
      console.error("Failed to load buyers:", e);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (editingBuyer) {
        // Update
        const res = await fetch(`${API_BASE_URL}/api/buyers/${editingBuyer.buyer_id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (res.ok) {
          await loadBuyers();
          resetForm();
        }
      } else {
        // Create
        const res = await fetch(`${API_BASE_URL}/api/buyers`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (res.ok) {
          await loadBuyers();
          resetForm();
        }
      }
    } catch (e) {
      console.error("Failed to save buyer:", e);
    }
  }

  async function handleDelete(buyer: Buyer) {
    if (!confirm(`Delete buyer "${buyer.buyer_name}"?`)) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/buyers/${buyer.buyer_id}`, {
        method: "DELETE",
      });
      if (res.ok || res.status === 204) {
        await loadBuyers();
      }
    } catch (e) {
      console.error("Failed to delete buyer:", e);
    }
  }

  function resetForm() {
    setFormData({ buyer_name: "", contact_info: "", email: "", phone: "" });
    setEditingBuyer(null);
    setShowForm(false);
  }

  function startEdit(buyer: Buyer) {
    setEditingBuyer(buyer);
    setFormData({
      buyer_name: buyer.buyer_name,
      contact_info: buyer.contact_info || "",
      email: buyer.email || "",
      phone: buyer.phone || "",
    });
    setShowForm(true);
  }

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <SidebarNav />
        <div className="flex-1 p-8">
          <p>Loading buyers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <SidebarNav />
      <div className="flex-1 p-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Buyers</h1>
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Buyer
          </Button>
        </div>

        {showForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{editingBuyer ? "Edit Buyer" : "Add New Buyer"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Buyer Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.buyer_name}
                    onChange={(e) => setFormData({ ...formData, buyer_name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Contact Info</label>
                  <textarea
                    value={formData.contact_info}
                    onChange={(e) => setFormData({ ...formData, contact_info: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                    rows={3}
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit">{editingBuyer ? "Update" : "Create"}</Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>All Buyers ({buyers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">ID</th>
                    <th className="text-left p-2">Name</th>
                    <th className="text-left p-2">Email</th>
                    <th className="text-left p-2">Phone</th>
                    <th className="text-left p-2">Contact Info</th>
                    <th className="text-left p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {buyers.map((buyer) => (
                    <tr key={buyer.buyer_id} className="border-b hover:bg-muted/50">
                      <td className="p-2">{buyer.buyer_id}</td>
                      <td className="p-2 font-medium">{buyer.buyer_name}</td>
                      <td className="p-2">{buyer.email || "-"}</td>
                      <td className="p-2">{buyer.phone || "-"}</td>
                      <td className="p-2">{buyer.contact_info || "-"}</td>
                      <td className="p-2">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => startEdit(buyer)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(buyer)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {buyers.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  No buyers found. Click "Add Buyer" to create one.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
