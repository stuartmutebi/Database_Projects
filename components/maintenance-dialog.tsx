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

export interface Maintenance {
  id: string
  asset: string
  assetId: string
  maintenanceType: string
  description: string
  scheduledDate: string
  completedDate?: string
  performedBy: string
  cost: number
  status: "Scheduled" | "In Progress" | "Completed" | "Cancelled"
  priority: "Low" | "Medium" | "High" | "Critical"
  notes?: string
  createdAt: string
  updatedAt: string
}

interface MaintenanceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  maintenance?: Maintenance | null
  onSave: (maintenance: Omit<Maintenance, 'id' | 'createdAt' | 'updatedAt'>) => void
  onUpdate: (id: string, maintenance: Omit<Maintenance, 'id' | 'createdAt' | 'updatedAt'>) => void
}

export function MaintenanceDialog({ open, onOpenChange, maintenance, onSave, onUpdate }: MaintenanceDialogProps) {
  const isEdit = !!maintenance
  const [formData, setFormData] = useState({
    asset: "",
    assetId: "",
    maintenanceType: "Preventive",
    description: "",
    scheduledDate: "",
    completedDate: "",
    performedBy: "",
    cost: 0,
    status: "Scheduled" as "Scheduled" | "In Progress" | "Completed" | "Cancelled",
    priority: "Medium" as "Low" | "Medium" | "High" | "Critical",
    notes: ""
  })

  useEffect(() => {
    if (maintenance) {
      setFormData({
        asset: maintenance.asset,
        assetId: maintenance.assetId,
        maintenanceType: maintenance.maintenanceType,
        description: maintenance.description,
        scheduledDate: maintenance.scheduledDate,
        completedDate: maintenance.completedDate || "",
        performedBy: maintenance.performedBy,
        cost: maintenance.cost,
        status: maintenance.status,
        priority: maintenance.priority,
        notes: maintenance.notes || ""
      })
    } else {
      setFormData({
        asset: "",
        assetId: "",
        maintenanceType: "Preventive",
        description: "",
        scheduledDate: "",
        completedDate: "",
        performedBy: "",
        cost: 0,
        status: "Scheduled",
        priority: "Medium",
        notes: ""
      })
    }
  }, [maintenance, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.asset.trim() || !formData.assetId.trim() || !formData.scheduledDate.trim()) {
      alert("Please fill in all required fields")
      return
    }

    const maintenanceData = {
      ...formData,
      completedDate: formData.completedDate || undefined,
      notes: formData.notes || undefined
    }

    if (isEdit && maintenance) {
      onUpdate(maintenance.id, maintenanceData)
    } else {
      onSave(maintenanceData)
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
          <DialogTitle>{isEdit ? "Edit Maintenance Record" : "Schedule New Maintenance"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the maintenance record below."
              : "Fill in the details to schedule a new maintenance task."}
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
                    <SelectItem value="Dell Laptop XPS 15 (AST-001)">Dell Laptop XPS 15 (AST-001)</SelectItem>
                    <SelectItem value="HP Printer LaserJet (AST-002)">HP Printer LaserJet (AST-002)</SelectItem>
                    <SelectItem value="Server Rack A1 (AST-015)">Server Rack A1 (AST-015)</SelectItem>
                    <SelectItem value="HVAC Unit 3 (AST-032)">HVAC Unit 3 (AST-032)</SelectItem>
                    <SelectItem value="Desktop Computer (AST-045)">Desktop Computer (AST-045)</SelectItem>
                    <SelectItem value="Office Chair (AST-078)">Office Chair (AST-078)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="maintenanceType">Maintenance Type</Label>
                <Select 
                  value={formData.maintenanceType} 
                  onValueChange={(value) => handleInputChange("maintenanceType", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Preventive">Preventive</SelectItem>
                    <SelectItem value="Repair">Repair</SelectItem>
                    <SelectItem value="Inspection">Inspection</SelectItem>
                    <SelectItem value="Service">Service</SelectItem>
                    <SelectItem value="Upgrade">Upgrade</SelectItem>
                    <SelectItem value="Cleaning">Cleaning</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select 
                  value={formData.priority} 
                  onValueChange={(value: "Low" | "Medium" | "High" | "Critical") => handleInputChange("priority", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value: "Scheduled" | "In Progress" | "Completed" | "Cancelled") => handleInputChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Scheduled">Scheduled</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter maintenance description..."
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="scheduledDate">Scheduled Date *</Label>
                <Input 
                  id="scheduledDate" 
                  type="date" 
                  value={formData.scheduledDate}
                  onChange={(e) => handleInputChange("scheduledDate", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="completedDate">Completed Date</Label>
                <Input 
                  id="completedDate" 
                  type="date" 
                  value={formData.completedDate}
                  onChange={(e) => handleInputChange("completedDate", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="performedBy">Performed By</Label>
                <Input 
                  id="performedBy" 
                  placeholder="IT Support Team" 
                  value={formData.performedBy}
                  onChange={(e) => handleInputChange("performedBy", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cost">Cost (UGX)</Label>
                <Input 
                  id="cost" 
                  type="number" 
                  step="0.01" 
                  placeholder="0.00" 
                  value={formData.cost}
                  onChange={(e) => handleInputChange("cost", parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Additional notes about the maintenance..."
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
            <Button type="submit">{isEdit ? "Update Maintenance" : "Schedule Maintenance"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
