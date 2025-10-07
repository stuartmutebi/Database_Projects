"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEffect, useState } from "react"
import type { AssetRecord } from "@/lib/assets"

interface AssetDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  asset?: AssetRecord
  onSubmit?: (
    payload: Omit<AssetRecord, "id" | "createdAt" | "updatedAt">
  ) => void
}

export function AssetDialog({ open, onOpenChange, asset, onSubmit }: AssetDialogProps) {
  const isEdit = !!asset

  const [name, setName] = useState("")
  const [serialNumber, setSerialNumber] = useState("")
  const [description, setDescription] = useState("")
  const [supplier, setSupplier] = useState<string | undefined>(undefined)
  const [classification, setClassification] = useState<string | undefined>(undefined)
  const [storage, setStorage] = useState<string | undefined>(undefined)
  const [assignedUser, setAssignedUser] = useState<string | undefined>(undefined)
  const [purchaseDate, setPurchaseDate] = useState("")
  const [purchasePrice, setPurchasePrice] = useState<string>("")
  const [currentValue, setCurrentValue] = useState<string>("")
  const [status, setStatus] = useState<AssetRecord["status"]>("Active")

  useEffect(() => {
    if (open) {
      setName(asset?.name ?? "")
      setSerialNumber(asset?.serialNumber ?? "")
      setDescription(asset?.description ?? "")
      setSupplier(asset?.supplier ?? undefined)
      setClassification(asset?.classification ?? undefined)
      setStorage(asset?.storage ?? undefined)
      setAssignedUser(asset?.assignedUser ?? undefined)
      setPurchaseDate(asset?.purchaseDate ?? "")
      setPurchasePrice(asset?.purchasePrice != null ? String(asset.purchasePrice) : "")
      setCurrentValue(asset?.currentValue != null ? String(asset.currentValue) : "")
      setStatus(asset?.status ?? "Active")
    }
  }, [open, asset])

  function handleSave() {
    const payload: Omit<AssetRecord, "id" | "createdAt" | "updatedAt"> = {
      name: name.trim(),
      serialNumber: serialNumber.trim(),
      description: description.trim() || undefined,
      supplier: supplier || undefined,
      classification: classification || undefined,
      storage: storage || undefined,
      assignedUser: assignedUser || undefined,
      purchaseDate: purchaseDate || undefined,
      purchasePrice: purchasePrice ? Number(purchasePrice) : undefined,
      currentValue: currentValue ? Number(currentValue) : undefined,
      status,
    }
    onSubmit?.(payload)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Asset" : "Add New Asset"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Update the asset information below." : "Fill in the details to add a new asset to the system."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Asset Name</Label>
              <Input id="name" placeholder="Dell Laptop XPS 15" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="serialNumber">Serial Number</Label>
              <Input id="serialNumber" placeholder="DL-XPS-2024-001" value={serialNumber} onChange={(e) => setSerialNumber(e.target.value)} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" placeholder="Enter asset description..." value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="supplier">Supplier</Label>
              <Select value={supplier} onValueChange={setSupplier}>
                <SelectTrigger>
                  <SelectValue placeholder="Select supplier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Dell Inc.">Dell Inc.</SelectItem>
                  <SelectItem value="HP Enterprise">HP Enterprise</SelectItem>
                  <SelectItem value="Office Furniture Co.">Office Furniture Co.</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="classification">Classification</Label>
              <Select value={classification} onValueChange={setClassification}>
                <SelectTrigger>
                  <SelectValue placeholder="Select classification" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Electronics">Electronics</SelectItem>
                  <SelectItem value="Office Equipment">Office Equipment</SelectItem>
                  <SelectItem value="Furniture">Furniture</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="storage">Storage Location</Label>
              <Select value={storage} onValueChange={setStorage}>
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Office Floor 2">Office Floor 2</SelectItem>
                  <SelectItem value="Office Floor 3">Office Floor 3</SelectItem>
                  <SelectItem value="Warehouse A">Warehouse A</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="assignedUser">Assigned User</Label>
              <Select value={assignedUser} onValueChange={setAssignedUser}>
                <SelectTrigger>
                  <SelectValue placeholder="Select user" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="John Doe">John Doe</SelectItem>
                  <SelectItem value="Jane Smith">Jane Smith</SelectItem>
                  <SelectItem value="Unassigned">Unassigned</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="purchaseDate">Purchase Date</Label>
              <Input id="purchaseDate" type="date" value={purchaseDate} onChange={(e) => setPurchaseDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="purchasePrice">Purchase Price</Label>
              <Input
                id="purchasePrice"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currentValue">Current Value</Label>
              <Input
                id="currentValue"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={currentValue}
                onChange={(e) => setCurrentValue(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as AssetRecord["status"])}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
                <SelectItem value="Maintenance">Maintenance</SelectItem>
                <SelectItem value="Disposed">Disposed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>{isEdit ? "Update Asset" : "Add Asset"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
