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


const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";


type ApiAsset = {
  asset_id: number;
  asset_name: string;
  serial_number?: string | null;
  status?: string | null;
  purchase_cost?: number | null;
  category_id?: number | null;
  location_id?: number | null;
  supplier_id?: number | null;
  purchase_date?: string | null;
  warranty_expiry?: string | null;
};

export default function AssetsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);

  const [assets, setAssets] = useState<any[]>([])
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([])
  const [locations, setLocations] = useState<{ id: number; name: string }[]>([])
  const [suppliers, setSuppliers] = useState<{ id: number; name: string }[]>([])

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/assets`)
        if (!res.ok) {
          const body = await res.text().catch(() => '')
          console.error('Load assets failed', res.status, body)
          throw new Error('Failed to load assets')
        }
        const data: ApiAsset[] = await res.json()
        setAssets(data.map(a => ({
          id: String(a.asset_id),
          name: a.asset_name,
          serialNumber: a.serial_number ?? '',
          status: a.status ?? 'Active',
          purchasePrice: a.purchase_cost ?? 0,
          currentValue: a.purchase_cost ?? 0,
          classification: a.category_id ?? null,
          assignedUser: '-',
          categoryId: a.category_id ?? null,
          locationId: a.location_id ?? null,
          supplierId: a.supplier_id ?? null,
          purchaseDate: a.purchase_date ? String(a.purchase_date).slice(0, 10) : '',
          warrantyExpiry: a.warranty_expiry ? String(a.warranty_expiry).slice(0, 10) : '',
        })))
      } catch (e) {
        console.error('Assets load error', e)
      }
    }
    async function loadLookups() {
      try {
        const [c, l, s] = await Promise.all([
          fetch(`${API_BASE_URL}/api/categories`),
          fetch(`${API_BASE_URL}/api/locations`),
          fetch(`${API_BASE_URL}/api/suppliers`),
        ])
        if (c.ok) {
          const data = await c.json();
          setCategories(data.map((x: any) => ({ id: x.category_id, name: x.category_name })))
        } else {
          console.error('Categories fetch failed', c.status, await c.text().catch(() => ''))
        }
        if (l.ok) {
          const data = await l.json();
          setLocations(data.map((x: any) => ({ id: x.location_id, name: x.building || x.geographical_location || `Loc ${x.location_id}` })))
        } else {
          console.error('Locations fetch failed', l.status, await l.text().catch(() => ''))
        }
        if (s.ok) {
          const data = await s.json();
          setSuppliers(data.map((x: any) => ({ id: x.supplier_id, name: x.name })))
        } else {
          console.error('Suppliers fetch failed', s.status, await s.text().catch(() => ''))
        }
      } catch (e) { console.error('Lookup load error', e) }
    }
    load();
    loadLookups();
  }, [])

  const filteredAssets = assets.filter((asset) => {
    const q = searchQuery.toLowerCase();
    return (
      String(asset.name || "").toLowerCase().includes(q) ||
      String(asset.serialNumber || "").toLowerCase().includes(q)
    );
  });




  // Removed duplicate filteredAssets declaration for mockAssets


  const handleEdit = (asset: any) => {
    setSelectedAsset(asset);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setSelectedAsset(null);
    setIsDialogOpen(true);
  };

  async function handleDelete(asset: any) {
    try {
      const res = await fetch(`${API_BASE_URL}/api/assets/${asset.id}` , { method: 'DELETE' })
      if (!res.ok && res.status !== 204) throw new Error('Failed to delete asset')
      setAssets(prev => prev.filter(a => a.id !== asset.id))
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    function onSubmit(e: any) {
      const detail = e.detail || {}
      const toIsoDate = (d?: string | null) => (d ? new Date(`${d}T00:00:00Z`).toISOString() : null)
      if (selectedAsset) {
        // Update
        fetch(`${API_BASE_URL}/api/assets/${selectedAsset.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            asset_name: detail.name,
            serial_number: detail.serialNumber,
            purchase_cost: detail.purchasePrice,
            status: detail.status,
            category_id: detail.categoryId,
            location_id: detail.locationId,
            supplier_id: detail.supplierId,
            purchase_date: toIsoDate(detail.purchaseDate),
            warranty_expiry: toIsoDate(detail.warrantyExpiry),
          })
        }).then(async (res) => {
          if (!res.ok) {
            const body = await res.text().catch(() => '')
            console.error('Update asset failed', res.status, body)
            throw new Error('Failed to update asset')
          }
          const updated: ApiAsset = await res.json()
          setAssets(prev => prev.map(a => a.id === String(updated.asset_id) ? {
            ...a,
            name: updated.asset_name,
            serialNumber: updated.serial_number ?? '',
            status: updated.status ?? 'Active',
            purchasePrice: updated.purchase_cost ?? 0,
            currentValue: updated.purchase_cost ?? 0,
          } : a))
        }).catch(console.error)
      } else {
        // Create
        fetch(`${API_BASE_URL}/api/assets`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            asset_name: detail.name,
            serial_number: detail.serialNumber,
            purchase_cost: detail.purchasePrice,
            status: detail.status,
            category_id: detail.categoryId,
            location_id: detail.locationId,
            supplier_id: detail.supplierId,
            purchase_date: toIsoDate(detail.purchaseDate),
            warranty_expiry: toIsoDate(detail.warrantyExpiry),
          })
        }).then(async (res) => {
          if (!res.ok) {
            const body = await res.text().catch(() => '')
            console.error('Create asset failed', res.status, body)
            throw new Error('Failed to create asset')
          }
          const created: ApiAsset = await res.json()
          setAssets(prev => [...prev, {
            id: String(created.asset_id),
            name: created.asset_name,
            serialNumber: created.serial_number ?? '',
            status: created.status ?? 'Active',
            purchasePrice: created.purchase_cost ?? 0,
            currentValue: created.purchase_cost ?? 0,
            classification: '-',
            assignedUser: '-',
          }])
        }).catch(console.error)
      }
    }
    window.addEventListener('asset:submit', onSubmit as any)
    return () => window.removeEventListener('asset:submit', onSubmit as any)
  }, [selectedAsset])

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
                  
                  <TableHead>Location</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Purchase Date</TableHead>
                  <TableHead>Warranty Expiry</TableHead>
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
                      
                      <TableCell>{locations.find(l => l.id === asset.locationId)?.name ?? '-'}</TableCell>
                      <TableCell>{suppliers.find(s => s.id === asset.supplierId)?.name ?? '-'}</TableCell>
                      <TableCell className="text-muted-foreground">{asset.purchaseDate || '-'}</TableCell>
                      <TableCell className="text-muted-foreground">{asset.warrantyExpiry || '-'}</TableCell>
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
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(asset)}>
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
          categories={categories}
          locations={locations}
          suppliers={suppliers}

        />
      </main>
    </div>
  );
}
