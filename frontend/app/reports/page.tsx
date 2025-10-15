"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarNav } from "@/components/sidebar-nav";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Package, Users, FolderTree, Building2, DollarSign, Wrench, Trash2, ClipboardList } from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF6B9D'];

type ReportData = {
  summary: {
    totalAssets: number;
    totalUsers: number;
    totalCategories: number;
    totalSuppliers: number;
    totalValue: number;
  };
  assetsByCategory: Array<{ name: string; count: number; value: number }>;
  assetsByLocation: Array<{ name: string; count: number }>;
  assetsByStatus: Array<{ status: string; count: number }>;
  maintenanceStats: {
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
    totalCost: number;
  };
  topSuppliers: Array<{ name: string; assetCount: number; totalValue: number }>;
  valueByYear: Array<{ year: number; count: number; value: number }>;
  disposalStats: {
    total: number;
    totalValue: number;
    byMethod: Record<string, number>;
  };
  assignmentStats: {
    total: number;
    activeUsers: number;
    assignedAssets: number;
  };
  valuationStats: {
    total: number;
    totalCurrentValue: number;
    averageDepreciation: number;
  };
};

export default function ReportsPage() {
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    loadReports();
    // Auto-refresh every 30 seconds for real-time data
    const interval = setInterval(loadReports, 30000);
    return () => clearInterval(interval);
  }, []);

  async function loadReports() {
    try {
      const res = await fetch(`${API_BASE_URL}/api/reports/dashboard`);
      if (res.ok) {
        const reportData = await res.json();
        setData(reportData);
        setLastUpdated(new Date());
      }
    } catch (e) {
      console.error("Failed to load reports:", e);
    } finally {
      setLoading(false);
    }
  }

  if (loading || !data) {
    return (
      <div className="flex min-h-screen">
        <SidebarNav />
        <div className="flex-1 p-8">
          <div className="flex items-center justify-center h-full">
            <p className="text-lg">Loading reports...</p>
          </div>
        </div>
      </div>
    );
  }

  const disposalMethodData = Object.entries(data.disposalStats.byMethod).map(([method, count]) => ({
    name: method,
    value: count
  }));

  return (
    <div className="flex min-h-screen">
      <SidebarNav />
      <div className="flex-1 p-8 overflow-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Reports & Analytics</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Real-time data • Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.summary.totalAssets}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.summary.totalUsers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
              <FolderTree className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.summary.totalCategories}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Suppliers</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.summary.totalSuppliers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${data.summary.totalValue.toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Assets by Category - Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Assets by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.assetsByCategory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#8884d8" name="Asset Count" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Asset Status - Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Asset Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={data.assetsByStatus}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ status, count }) => `${status}: ${count}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {data.assetsByStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Assets by Location - Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Assets by Location</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.assetsByLocation}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#82ca9d" name="Asset Count" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Top Suppliers - Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Top 10 Suppliers by Asset Count</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.topSuppliers}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="assetCount" fill="#ffc658" name="Assets" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Asset Value by Year - Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Asset Purchases by Year</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.valueByYear}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#8884d8" name="Count" />
                  <Bar dataKey="value" fill="#82ca9d" name="Value ($)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Disposal Methods - Pie Chart */}
          {disposalMethodData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Disposal Methods</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={disposalMethodData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {disposalMethodData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Statistics Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Maintenance Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5" />
                Maintenance Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Total Requests:</span>
                  <span className="font-bold">{data.maintenanceStats.total}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Pending:</span>
                  <span className="font-bold text-yellow-600">{data.maintenanceStats.pending}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">In Progress:</span>
                  <span className="font-bold text-blue-600">{data.maintenanceStats.inProgress}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Completed:</span>
                  <span className="font-bold text-green-600">{data.maintenanceStats.completed}</span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span className="text-sm">Total Cost:</span>
                  <span className="font-bold">${data.maintenanceStats.totalCost.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Assignment Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5" />
                Assignment Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Total Assignments:</span>
                  <span className="font-bold">{data.assignmentStats.total}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Active Users:</span>
                  <span className="font-bold">{data.assignmentStats.activeUsers}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Assigned Assets:</span>
                  <span className="font-bold">{data.assignmentStats.assignedAssets}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Disposal & Valuation Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trash2 className="h-5 w-5" />
                Disposal & Valuation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Total Disposals:</span>
                  <span className="font-bold">{data.disposalStats.total}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Disposal Value:</span>
                  <span className="font-bold">${data.disposalStats.totalValue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span className="text-sm">Total Valuations:</span>
                  <span className="font-bold">{data.valuationStats.total}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Current Value:</span>
                  <span className="font-bold">${data.valuationStats.totalCurrentValue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Avg Depreciation:</span>
                  <span className="font-bold text-red-600">
                    {data.valuationStats.averageDepreciation.toFixed(2)}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
