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
import { Plus, Search, Edit, Trash2, Calendar, Filter, Wrench } from "lucide-react";
import { MaintenanceDialog, Maintenance } from "@/components/maintenance-dialog";
import { ConfirmationDialog } from "@/components/confirmation-dialog";
import { useNotificationActions } from "@/components/notification-system";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

type ApiMaintenance = {
  maintenance_id: number;
  asset_id: number;
  maintenance_type: string;
  scheduled_date: string;
  completed_date?: string | null;
  cost: number;
  performed_by: string;
  priority: string;
  status: string;
  description?: string | null;
};

function mapApiToUi(m: ApiMaintenance): Maintenance {
  return {
    id: String(m.maintenance_id),
    asset: `Asset ${m.asset_id}`,
    assetId: String(m.asset_id),
    maintenanceType: m.maintenance_type,
    scheduledDate: m.scheduled_date,
    completedDate: m.completed_date || undefined,
    cost: m.cost,
    performedBy: m.performed_by,
    priority: m.priority as any,
    status: m.status as any,
    description: m.description || "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

function mapUiToApi(m: Omit<Maintenance, 'id' | 'createdAt' | 'updatedAt'>): Omit<ApiMaintenance, 'maintenance_id'> {
  return {
    asset_id: Number(m.assetId),
    maintenance_type: m.maintenanceType,
    scheduled_date: m.scheduledDate,
    completed_date: m.completedDate || null,
    cost: m.cost,
    performed_by: m.performedBy,
    priority: m.priority,
    status: m.status,
    description: m.description || null,
  };
}

export default function MaintenancePage() {
  const [maintenanceRecords, setMaintenanceRecords] = useState<Maintenance[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedMaintenance, setSelectedMaintenance] = useState<Maintenance | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [maintenanceToDelete, setMaintenanceToDelete] = useState<Maintenance | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [priorityFilter, setPriorityFilter] = useState<string>("All");
  const { showSuccess, showError } = useNotificationActions();

  // Load maintenance records from API on component mount
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/maintenance`);
        if (!res.ok) throw new Error("Failed to load maintenance records");
        const data: ApiMaintenance[] = await res.json();
        setMaintenanceRecords(data.map(mapApiToUi));
      } catch (e) {
        console.error(e);
        showError("Load Failed", "Unable to load maintenance records from server");
      }
    }
    load();
  }, []);

  const filteredMaintenance = maintenanceRecords.filter((maintenance) => {
    const matchesSearch = 
      maintenance.asset.toLowerCase().includes(searchQuery.toLowerCase()) ||
      maintenance.assetId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      maintenance.maintenanceType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      maintenance.performedBy.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === "All" || maintenance.status === statusFilter
    const matchesPriority = priorityFilter === "All" || maintenance.priority === priorityFilter
    
    return matchesSearch && matchesStatus && matchesPriority
  });

  const handleAddMaintenance = async (maintenanceData: Omit<Maintenance, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/maintenance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mapUiToApi(maintenanceData))
      });
      if (!res.ok) throw new Error('Failed to create maintenance record');
      const created: ApiMaintenance = await res.json();
      setMaintenanceRecords(prev => [...prev, mapApiToUi(created)]);
      showSuccess("Maintenance Scheduled", `Maintenance for ${maintenanceData.asset} has been successfully scheduled.`);
    } catch (e) {
      console.error(e);
      showError("Create Failed", "Unable to save maintenance record to server");
    }
  };

  const handleUpdateMaintenance = async (id: string, maintenanceData: Omit<Maintenance, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/maintenance/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mapUiToApi(maintenanceData))
      });
      if (!res.ok) throw new Error('Failed to update maintenance record');
      const updated: ApiMaintenance = await res.json();
      setMaintenanceRecords(prev => prev.map(m => m.id === id ? mapApiToUi(updated) : m));
      showSuccess("Maintenance Updated", `Maintenance record for ${maintenanceData.asset} has been successfully updated.`);
    } catch (e) {
      console.error(e);
      showError("Update Failed", "Unable to update maintenance record on server");
    }
  };

  const handleDeleteMaintenance = (maintenance: Maintenance) => {
    setMaintenanceToDelete(maintenance);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!maintenanceToDelete) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/maintenance/${maintenanceToDelete.id}`, { method: 'DELETE' });
      if (!res.ok && res.status !== 204) throw new Error('Failed to delete maintenance record');
      setMaintenanceRecords(prev => prev.filter(maintenance => maintenance.id !== maintenanceToDelete.id));
      showSuccess("Maintenance Deleted", `Maintenance record for ${maintenanceToDelete.asset} has been successfully deleted.`);
      setMaintenanceToDelete(null);
    } catch (e) {
      console.error(e);
      showError("Delete Failed", "Unable to delete maintenance record from server");
    }
  };

  const handleEditMaintenance = (maintenance: Maintenance) => {
    setSelectedMaintenance(maintenance);
    setIsDialogOpen(true);
  };

  const handleAddNewMaintenance = () => {
    setSelectedMaintenance(null);
    setIsDialogOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "Scheduled":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "In Progress":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "Cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      case "High":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400";
      case "Medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "Low":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  // Calculate statistics
  const scheduledCount = maintenanceRecords.filter(m => m.status === "Scheduled").length;
  const completedCount = maintenanceRecords.filter(m => m.status === "Completed").length;
  const totalCost = maintenanceRecords.reduce((sum, m) => sum + m.cost, 0);
  const overdueCount = maintenanceRecords.filter(m => 
    m.status === "Scheduled" && new Date(m.scheduledDate) < new Date()
  ).length;

  return (
    <div className="flex">
      <SidebarNav />
      <main className="flex-1 p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Maintenance Tracking
            </h1>
            <p className="text-muted-foreground">
              Schedule and track asset maintenance activities
            </p>
          </div>
          <Button onClick={handleAddNewMaintenance} className="gap-2">
            <Plus className="h-4 w-4" />
            Schedule Maintenance
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="mb-6 grid gap-6 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                Scheduled
              </h3>
              <Calendar className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{scheduledCount}</div>
              <p className="text-xs text-muted-foreground">
                Upcoming maintenance tasks
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                Completed
              </h3>
              <Calendar className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{completedCount}</div>
              <p className="text-xs text-muted-foreground">Completed tasks</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                Overdue
              </h3>
              <Calendar className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{overdueCount}</div>
              <p className="text-xs text-muted-foreground">Past due date</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                Total Cost
              </h3>
              <Wrench className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">UGX {totalCost.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">All maintenance</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search maintenance records by asset, type, or performer..."
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
                  <option value="Scheduled">Scheduled</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="px-3 py-2 border border-input bg-background rounded-md text-sm"
                >
                  <option value="All">All Priority</option>
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Asset</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Scheduled Date</TableHead>
                  <TableHead>Completed Date</TableHead>
                  <TableHead>Performed By</TableHead>
                  <TableHead>Cost</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMaintenance.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      className="text-center text-muted-foreground py-8"
                    >
                      {maintenanceRecords.length === 0 
                        ? "No maintenance records yet. Click 'Schedule Maintenance' to create one."
                        : "No maintenance records match your search criteria."
                      }
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredMaintenance.map((maintenance) => (
                    <TableRow key={maintenance.id}>
                      <TableCell className="font-medium">
                        {maintenance.asset}
                        <div className="text-xs text-muted-foreground font-mono">
                          {maintenance.assetId}
                        </div>
                      </TableCell>
                      <TableCell>{maintenance.maintenanceType}</TableCell>
                      <TableCell>
                        <span className={`rounded-full px-2 py-1 text-xs font-medium ${getPriorityColor(maintenance.priority)}`}>
                          {maintenance.priority}
                        </span>
                      </TableCell>
                      <TableCell>{new Date(maintenance.scheduledDate).toLocaleDateString()}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {maintenance.completedDate ? new Date(maintenance.completedDate).toLocaleDateString() : "-"}
                      </TableCell>
                      <TableCell>{maintenance.performedBy || "-"}</TableCell>
                      <TableCell>
                        UGX {maintenance.cost.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <span className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(maintenance.status)}`}>
                          {maintenance.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditMaintenance(maintenance)}
                            title="Edit maintenance record"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDeleteMaintenance(maintenance)}
                            title="Delete maintenance record"
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

        <MaintenanceDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          maintenance={selectedMaintenance}
          onSave={handleAddMaintenance}
          onUpdate={handleUpdateMaintenance}
        />

        <ConfirmationDialog
          open={deleteConfirmOpen}
          onOpenChange={setDeleteConfirmOpen}
          title="Delete Maintenance Record"
          description={`Are you sure you want to delete the maintenance record for "${maintenanceToDelete?.asset}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={confirmDelete}
          variant="destructive"
        />
      </main>
    </div>
  );
}
