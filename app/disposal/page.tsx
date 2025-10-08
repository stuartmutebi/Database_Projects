"use client";

import { useState, useEffect } from "react";
import { SidebarNav } from "@/components/sidebar-nav";
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
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Plus, Search, Edit, Trash2, AlertCircle, Filter, Trash, DollarSign } from "lucide-react";
import { DisposalDialog, Disposal } from "@/components/disposal-dialog";
import { ConfirmationDialog } from "@/components/confirmation-dialog";
import { useNotificationActions } from "@/components/notification-system";

const STORAGE_KEY = "database_disposal";

// Generate a simple ID
function generateId(): string {
  return `disposal_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

export default function DisposalPage() {
  const [disposalRecords, setDisposalRecords] = useState<Disposal[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDisposal, setSelectedDisposal] = useState<Disposal | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [disposalToDelete, setDisposalToDelete] = useState<Disposal | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [methodFilter, setMethodFilter] = useState<string>("All");
  const { showSuccess, showError } = useNotificationActions();

  // Load disposal records from localStorage on component mount
  useEffect(() => {
    const savedDisposals = localStorage.getItem(STORAGE_KEY);
    if (savedDisposals) {
      try {
        setDisposalRecords(JSON.parse(savedDisposals));
      } catch (error) {
        console.error("Error loading disposal records from localStorage:", error);
      }
    }
  }, []);

  // Save disposal records to localStorage whenever disposal state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(disposalRecords));
  }, [disposalRecords]);

  const filteredDisposals = disposalRecords.filter((disposal) => {
    const matchesSearch = 
      disposal.asset.toLowerCase().includes(searchQuery.toLowerCase()) ||
      disposal.assetId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      disposal.disposalMethod.toLowerCase().includes(searchQuery.toLowerCase()) ||
      disposal.buyer.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === "All" || disposal.status === statusFilter
    const matchesMethod = methodFilter === "All" || disposal.disposalMethod === methodFilter
    
    return matchesSearch && matchesStatus && matchesMethod
  });

  const handleAddDisposal = (disposalData: Omit<Disposal, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newDisposal: Disposal = {
      ...disposalData,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setDisposalRecords(prev => [...prev, newDisposal]);
    showSuccess("Disposal Recorded", `Disposal of ${disposalData.asset} has been successfully recorded.`);
  };

  const handleUpdateDisposal = (id: string, disposalData: Omit<Disposal, 'id' | 'createdAt' | 'updatedAt'>) => {
    setDisposalRecords(prev => prev.map(disposal => 
      disposal.id === id 
        ? { ...disposal, ...disposalData, updatedAt: new Date().toISOString() }
        : disposal
    ));
    showSuccess("Disposal Updated", `Disposal record for ${disposalData.asset} has been successfully updated.`);
  };

  const handleDeleteDisposal = (disposal: Disposal) => {
    setDisposalToDelete(disposal);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (disposalToDelete) {
      setDisposalRecords(prev => prev.filter(disposal => disposal.id !== disposalToDelete.id));
      showSuccess("Disposal Deleted", `Disposal record for ${disposalToDelete.asset} has been successfully deleted.`);
      setDisposalToDelete(null);
    }
  };

  const handleEditDisposal = (disposal: Disposal) => {
    setSelectedDisposal(disposal);
    setIsDialogOpen(true);
  };

  const handleAddNewDisposal = () => {
    setSelectedDisposal(null);
    setIsDialogOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "Cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case "Sale":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "Recycling":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "Donation":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400";
      case "Destruction":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      case "Trade-in":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400";
      case "Scrap":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const getEnvironmentalColor = (impact: string) => {
    switch (impact) {
      case "Low":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "Medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "High":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      case "Controlled":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  // Calculate statistics
  const totalDisposals = disposalRecords.length;
  const pendingCount = disposalRecords.filter(d => d.status === "Pending").length;
  const completedCount = disposalRecords.filter(d => d.status === "Completed").length;
  const totalRevenue = disposalRecords
    .filter(d => d.disposalMethod === "Sale")
    .reduce((sum, d) => sum + d.salePrice, 0);
  const methods = [...new Set(disposalRecords.map(d => d.disposalMethod))];

  return (
    <div className="flex">
      <SidebarNav />
      <main className="flex-1 p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Disposal Management
            </h1>
            <p className="text-muted-foreground">
              Track asset disposal and end-of-life processes
            </p>
          </div>
          <Button onClick={handleAddNewDisposal} className="gap-2">
            <Plus className="h-4 w-4" />
            Record Disposal
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="mb-6 grid gap-6 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                Total Disposals
              </h3>
              <Trash className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{totalDisposals}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                Pending
              </h3>
              <AlertCircle className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
              <p className="text-xs text-muted-foreground">
                Awaiting completion
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                Completed
              </h3>
              <AlertCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{completedCount}</div>
              <p className="text-xs text-muted-foreground">Completed disposals</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                Revenue
              </h3>
              <DollarSign className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">UGX {totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">From sales</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search disposal records by asset, method, or buyer..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-input bg-background rounded-md text-sm"
                >
                  <option value="All">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
                <select
                  value={methodFilter}
                  onChange={(e) => setMethodFilter(e.target.value)}
                  className="px-3 py-2 border border-input bg-background rounded-md text-sm"
                >
                  <option value="All">All Methods</option>
                  {methods.map(method => (
                    <option key={method} value={method}>{method}</option>
                  ))}
                </select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Asset</TableHead>
                  <TableHead>Disposal Date</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Buyer/Recipient</TableHead>
                  <TableHead>Sale Price</TableHead>
                  <TableHead>Environmental Impact</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDisposals.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center text-muted-foreground py-8"
                    >
                      {disposalRecords.length === 0 
                        ? "No disposal records yet. Click 'Record Disposal' to add one."
                        : "No disposal records match your search criteria."
                      }
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDisposals.map((disposal) => (
                    <TableRow key={disposal.id}>
                      <TableCell className="font-medium">
                        {disposal.asset}
                        <div className="text-xs text-muted-foreground font-mono">
                          {disposal.assetId}
                        </div>
                      </TableCell>
                      <TableCell>{new Date(disposal.disposalDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <span className={`rounded-full px-3 py-1 text-xs font-medium ${getMethodColor(disposal.disposalMethod)}`}>
                          {disposal.disposalMethod}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(disposal.status)}`}>
                          {disposal.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {disposal.buyer || "-"}
                      </TableCell>
                      <TableCell>
                        {disposal.salePrice > 0 ? `UGX ${disposal.salePrice.toLocaleString()}` : "-"}
                      </TableCell>
                      <TableCell>
                        <span className={`rounded-full px-2 py-1 text-xs font-medium ${getEnvironmentalColor(disposal.environmentalImpact)}`}>
                          {disposal.environmentalImpact}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditDisposal(disposal)}
                            title="Edit disposal record"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDeleteDisposal(disposal)}
                            title="Delete disposal record"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <DisposalDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          disposal={selectedDisposal}
          onSave={handleAddDisposal}
          onUpdate={handleUpdateDisposal}
        />

        <ConfirmationDialog
          open={deleteConfirmOpen}
          onOpenChange={setDeleteConfirmOpen}
          title="Delete Disposal Record"
          description={`Are you sure you want to delete the disposal record for "${disposalToDelete?.asset}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={confirmDelete}
          variant="destructive"
        />
      </main>
    </div>
  );
}
