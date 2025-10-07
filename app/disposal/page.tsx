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
import { Plus, Search, Edit, Trash2, AlertCircle } from "lucide-react";
import { DisposalDialog } from "@/components/disposal-dialog";

const mockDisposals: any[] = [];

export default function DisposalPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDisposal, setSelectedDisposal] = useState(null);

  const filteredDisposals = mockDisposals.filter(
    (disposal) =>
      disposal.asset.toLowerCase().includes(searchQuery.toLowerCase()) ||
      disposal.assetId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      disposal.disposalMethod.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-500/10 text-green-500";
      case "Pending":
        return "bg-yellow-500/10 text-yellow-500";
      case "Cancelled":
        return "bg-red-500/10 text-red-500";
      default:
        return "bg-primary/10 text-primary";
    }
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case "Sale":
        return "bg-blue-500/10 text-blue-500";
      case "Recycling":
        return "bg-green-500/10 text-green-500";
      case "Donation":
        return "bg-purple-500/10 text-purple-500";
      case "Destruction":
        return "bg-red-500/10 text-red-500";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

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
          <Button
            onClick={() => {
              setSelectedDisposal(null);
              setIsDialogOpen(true);
            }}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Record Disposal
          </Button>
        </div>

        <div className="mb-6 grid gap-6 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                Total Disposals
              </h3>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">0</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                Pending
              </h3>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">0</div>
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
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">0</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                Revenue
              </h3>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">UGX 0</div>
              <p className="text-xs text-muted-foreground">From sales</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search disposal records by asset or method..."
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
                  <TableHead>Disposal Date</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Buyer/Recipient</TableHead>
                  <TableHead>Sale Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDisposals.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      className="text-center text-muted-foreground"
                    >
                      No disposal records yet. Click "Record Disposal" to add
                      one.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDisposals.map((disposal) => (
                    <TableRow key={disposal.id}>
                      <TableCell className="font-medium">
                        {disposal.asset}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {disposal.assetId}
                      </TableCell>
                      <TableCell>{disposal.disposalDate}</TableCell>
                      <TableCell>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${getMethodColor(
                            disposal.disposalMethod
                          )}`}
                        >
                          {disposal.disposalMethod}
                        </span>
                      </TableCell>
                      <TableCell className="max-w-xs truncate text-muted-foreground">
                        {disposal.reason}
                      </TableCell>
                      <TableCell>{disposal.buyer}</TableCell>
                      <TableCell>
                        UGX {disposal.salePrice.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(
                            disposal.status
                          )}`}
                        >
                          {disposal.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setSelectedDisposal(disposal);
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

        <DisposalDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          disposal={selectedDisposal}
        />
      </main>
    </div>
  );
}
