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
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { AssetDialog } from "@/components/asset-dialog";
import { toast } from "sonner";

// Empty initial data; connect to API/DB later
const initialAssets: any[] = [];

export default function AssetsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [assets, setAssets] = useState<any[]>(() => {
    try {
      if (typeof window === "undefined") return initialAssets
      const raw = localStorage.getItem("assets")
      return raw ? JSON.parse(raw) : initialAssets
    } catch (err) {
      console.error("failed to read assets from localStorage", err)
      return initialAssets
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem("assets", JSON.stringify(assets))
    } catch (err) {
      console.error("failed to write assets to localStorage", err)
    }
  }, [assets])

  const filteredAssets = assets.filter((asset) => {
    const q = searchQuery.toLowerCase()
    return (
      String(asset.name || "").toLowerCase().includes(q) ||
      String(asset.serialNumber || "").toLowerCase().includes(q)
    )
  })

  const handleEdit = (asset: any) => {
    setSelectedAsset(asset);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setSelectedAsset(null);
    setIsDialogOpen(true);
  };

  const handleSave = (payload: any) => {
    // create a simple id and prepend
    const item = { id: Date.now().toString(), ...payload }
    setAssets((s) => [item, ...s])
    setIsDialogOpen(false)
    toast.success('Asset added')
  }

  return (
    <div className="flex">
      <SidebarNav />
      <main className="flex-1 p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Assets</h1>
            <p className="text-muted-foreground">
              Manage and track all your assets
            </p>
          </div>
          <Button onClick={handleAdd} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Asset
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search assets by name or serial number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Serial Number</TableHead>
                  <TableHead>Classification</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Purchase Price</TableHead>
                  <TableHead>Current Value</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAssets.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center text-muted-foreground"
                    >
                      No assets yet. Click "Add Asset" to create your first
                      record.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAssets.map((asset) => (
                    <TableRow key={asset.id}>
                      <TableCell className="font-medium">
                        {asset.name}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {asset.serialNumber}
                      </TableCell>
                      <TableCell>{asset.classification}</TableCell>
                      <TableCell>
                        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                          {asset.status}
                        </span>
                      </TableCell>
                      <TableCell>{asset.assignedUser}</TableCell>
                      <TableCell>
                        UGX {asset.purchasePrice.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        UGX {asset.currentValue.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(asset)}
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

        <AssetDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          asset={selectedAsset}
          onSubmit={handleSave}
        />
      </main>
    </div>
  );
}
