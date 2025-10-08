"use client"

import { useEffect, useState } from "react"
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

interface AssetDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  asset?: any
}

const USERS_STORAGE_KEY = "ams.usersDirectory";
function getUserNames(): string[] {
  if (typeof window === "undefined") return []
  try {
    const raw = window.localStorage.getItem(USERS_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.map((u: any) => String(u.name || "")).filter(Boolean)
  } catch { return [] }
}

export function AssetDialog({ open, onOpenChange, asset }: AssetDialogProps) {
  const isEdit = !!asset
  const [userOptions, setUserOptions] = useState<string[]>([])

  useEffect(() => {
    setUserOptions(getUserNames())
  }, [open])

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
              <Input id="name" placeholder="Dell Laptop XPS 15" defaultValue={asset?.name} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="serialNumber">Serial Number</Label>
              <Input id="serialNumber" placeholder="DL-XPS-2024-001" defaultValue={asset?.serialNumber} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" placeholder="Enter asset description..." defaultValue={asset?.description} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="supplier">Supplier</Label>
              <Select defaultValue={asset?.supplier}>
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
              <Select defaultValue={asset?.classification}>
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
              <Select defaultValue={asset?.storage}>
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
              <Select defaultValue={asset?.assignedUser}>
                <SelectTrigger>
                  <SelectValue placeholder="Select user" />
                </SelectTrigger>
                <SelectContent>
                  {userOptions.map((name) => (
                    <SelectItem key={name} value={name}>{name}</SelectItem>
                  ))}
                  <SelectItem value="Unassigned">Unassigned</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="purchaseDate">Purchase Date</Label>
              <Input id="purchaseDate" type="date" defaultValue={asset?.purchaseDate} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="purchasePrice">Purchase Price</Label>
              <Input
                id="purchasePrice"
                type="number"
                step="0.01"
                placeholder="0.00"
                defaultValue={asset?.purchasePrice}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currentValue">Current Value</Label>
              <Input
                id="currentValue"
                type="number"
                step="0.01"
                placeholder="0.00"
                defaultValue={asset?.currentValue}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select defaultValue={asset?.status || "Active"}>
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
          <Button onClick={() => onOpenChange(false)}>{isEdit ? "Update Asset" : "Add Asset"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
