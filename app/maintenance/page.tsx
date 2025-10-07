"use client";

import { useState } from "react";
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
import { Plus, Search, Edit, Trash2, Calendar } from "lucide-react";
import { MaintenanceDialog } from "@/components/maintenance-dialog";

const mockMaintenance: any[] = [];

export default function MaintenancePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedMaintenance, setSelectedMaintenance] = useState(null);

  const filteredMaintenance = mockMaintenance.filter(
    (maintenance) =>
      maintenance.asset.toLowerCase().includes(searchQuery.toLowerCase()) ||
      maintenance.assetId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      maintenance.maintenanceType
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-500/10 text-green-500";
      case "Scheduled":
        return "bg-blue-500/10 text-blue-500";
      case "Overdue":
        return "bg-red-500/10 text-red-500";
      default:
        return "bg-primary/10 text-primary";
    }
  };

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
          <Button
            onClick={() => {
              setSelectedMaintenance(null);
              setIsDialogOpen(true);
            }}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Schedule Maintenance
          </Button>
        </div>

        <div className="mb-6 grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                Scheduled
              </h3>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">0</div>
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
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">0</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                Total Cost
              </h3>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">UGX 0</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search maintenance records by asset or type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Asset</TableHead>
                  <TableHead>Asset ID</TableHead>
                  <TableHead>Type</TableHead>
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
                      className="text-center text-muted-foreground"
                    >
                      No maintenance records yet. Click "Schedule Maintenance"
                      to create one.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredMaintenance.map((maintenance) => (
                    <TableRow key={maintenance.id}>
                      <TableCell className="font-medium">
                        {maintenance.asset}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {maintenance.assetId}
                      </TableCell>
                      <TableCell>{maintenance.maintenanceType}</TableCell>
                      <TableCell>{maintenance.scheduledDate}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {maintenance.completedDate || "-"}
                      </TableCell>
                      <TableCell>{maintenance.performedBy}</TableCell>
                      <TableCell>
                        UGX {maintenance.cost.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(
                            maintenance.status
                          )}`}
                        >
                          {maintenance.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setSelectedMaintenance(maintenance);
                              setIsDialogOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
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
        />
      </main>
    </div>
  );
}
