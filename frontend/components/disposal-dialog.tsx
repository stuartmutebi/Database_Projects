"use client"

import { useState, useEffect } from "react"
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

export interface Disposal {
  id: string
  asset: string
  assetId: string
  disposalDate: string
  disposalMethod: string
  reason: string
  buyer: string
  salePrice: number
  status: "Pending" | "Completed" | "Cancelled"
  approvedBy: string
  certificateNumber?: string
  environmentalImpact: string
  notes?: string
  createdAt: string
  updatedAt: string
}

interface DisposalDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  disposal?: Disposal | null
  onSave: (disposal: Omit<Disposal, 'id' | 'createdAt' | 'updatedAt'>) => void
  onUpdate: (id: string, disposal: Omit<Disposal, 'id' | 'createdAt' | 'updatedAt'>) => void
}

export function DisposalDialog({ open, onOpenChange, disposal, onSave, onUpdate }: DisposalDialogProps) {
  const isEdit = !!disposal
  const [formData, setFormData] = useState({
    asset: "",
    assetId: "",
    disposalDate: "",
    disposalMethod: "Sale",
    reason: "",
    buyer: "",
    salePrice: 0,
    status: "Pending" as "Pending" | "Completed" | "Cancelled",
    approvedBy: "",
    certificateNumber: "",
    environmentalImpact: "",
    notes: ""
  })

  useEffect(() => {
    if (disposal) {
      setFormData({
        asset: disposal.asset,
        assetId: disposal.assetId,
        disposalDate: disposal.disposalDate,
        disposalMethod: disposal.disposalMethod,
        reason: disposal.reason,
        buyer: disposal.buyer,
        salePrice: disposal.salePrice,
        status: disposal.status,
        approvedBy: disposal.approvedBy,
        certificateNumber: disposal.certificateNumber || "",
        environmentalImpact: disposal.environmentalImpact,
        notes: disposal.notes || ""
      })
    } else {
      setFormData({
        asset: "",
        assetId: "",
        disposalDate: "",
        disposalMethod: "Sale",
        reason: "",
        buyer: "",
        salePrice: 0,
        status: "Pending",
        approvedBy: "",
        certificateNumber: "",
        environmentalImpact: "",
        notes: ""
      })
    }
  }, [disposal, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.asset.trim() || !formData.assetId.trim() || !formData.disposalDate.trim()) {
      alert("Please fill in all required fields")
      return
    }

    const disposalData = {
      ...formData,
      certificateNumber: formData.certificateNumber || undefined,
      notes: formData.notes || undefined
    }

    if (isEdit && disposal) {
      onUpdate(disposal.id, disposalData)
    } else {
      onSave(disposalData)
    }
    onOpenChange(false)
  }

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleAssetChange = (value: string) => {
    const [assetName, assetId] = value.split(" (")
    setFormData(prev => ({
      ...prev,
      asset: assetName,
      assetId: assetId ? assetId.slice(0, -1) : ""
    }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Disposal Record" : "Record New Disposal"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Update the disposal record below." : "Fill in the details to record an asset disposal."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="asset">Asset *</Label>
                <Select value={formData.assetId ? `${formData.asset} (${formData.assetId})` : ""} onValueChange={handleAssetChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select asset" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Old Desktop Computer (AST-089)">Old Desktop Computer (AST-089)</SelectItem>
                    <SelectItem value="Broken Office Chair (AST-156)">Broken Office Chair (AST-156)</SelectItem>
                    <SelectItem value="Outdated Server (AST-045)">Outdated Server (AST-045)</SelectItem>
                    <SelectItem value="Damaged Printer (AST-078)">Damaged Printer (AST-078)</SelectItem>
                    <SelectItem value="Worn-out Laptop (AST-123)">Worn-out Laptop (AST-123)</SelectItem>
                    <SelectItem value="Obsolete Monitor (AST-234)">Obsolete Monitor (AST-234)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="disposalDate">Disposal Date *</Label>
                <Input 
                  id="disposalDate" 
                  type="date" 
                  value={formData.disposalDate}
                  onChange={(e) => handleInputChange("disposalDate", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="disposalMethod">Disposal Method</Label>
                <Select 
                  value={formData.disposalMethod} 
                  onValueChange={(value) => handleInputChange("disposalMethod", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sale">Sale</SelectItem>
                    <SelectItem value="Recycling">Recycling</SelectItem>
                    <SelectItem value="Donation">Donation</SelectItem>
                    <SelectItem value="Destruction">Destruction</SelectItem>
                    <SelectItem value="Trade-in">Trade-in</SelectItem>
                    <SelectItem value="Scrap">Scrap</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value: "Pending" | "Completed" | "Cancelled") => handleInputChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Disposal</Label>
              <Textarea 
                id="reason" 
                placeholder="Enter reason for disposal..." 
                value={formData.reason}
                onChange={(e) => handleInputChange("reason", e.target.value)}
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="buyer">Buyer/Recipient</Label>
                <Input 
                  id="buyer" 
                  placeholder="Tech Recycling Co." 
                  value={formData.buyer}
                  onChange={(e) => handleInputChange("buyer", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="salePrice">Sale Price (UGX)</Label>
                <Input 
                  id="salePrice" 
                  type="number" 
                  step="0.01" 
                  placeholder="0.00" 
                  value={formData.salePrice}
                  onChange={(e) => handleInputChange("salePrice", parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="approvedBy">Approved By</Label>
                <Input 
                  id="approvedBy" 
                  placeholder="John Manager" 
                  value={formData.approvedBy}
                  onChange={(e) => handleInputChange("approvedBy", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="certificateNumber">Certificate Number</Label>
                <Input 
                  id="certificateNumber" 
                  placeholder="CERT-2024-001" 
                  value={formData.certificateNumber}
                  onChange={(e) => handleInputChange("certificateNumber", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="environmentalImpact">Environmental Impact</Label>
              <Select 
                value={formData.environmentalImpact} 
                onValueChange={(value) => handleInputChange("environmentalImpact", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select environmental impact" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low - Minimal environmental impact</SelectItem>
                  <SelectItem value="Medium">Medium - Moderate environmental impact</SelectItem>
                  <SelectItem value="High">High - Significant environmental impact</SelectItem>
                  <SelectItem value="Controlled">Controlled - Properly managed disposal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Additional notes about the disposal process..."
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{isEdit ? "Update Disposal" : "Record Disposal"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
