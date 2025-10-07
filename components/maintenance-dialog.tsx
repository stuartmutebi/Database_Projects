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

interface MaintenanceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  maintenance?: any
}

export function MaintenanceDialog({ open, onOpenChange, maintenance }: MaintenanceDialogProps) {
  const isEdit = !!maintenance

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
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="asset">Asset</Label>
              <Select defaultValue={maintenance?.assetId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select asset" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AST-001">Dell Laptop XPS 15 (AST-001)</SelectItem>
                  <SelectItem value="AST-002">HP Printer LaserJet (AST-002)</SelectItem>
                  <SelectItem value="AST-015">Server Rack A1 (AST-015)</SelectItem>
                  <SelectItem value="AST-032">HVAC Unit 3 (AST-032)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="maintenanceType">Maintenance Type</Label>
              <Select defaultValue={maintenance?.maintenanceType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Preventive">Preventive</SelectItem>
                  <SelectItem value="Repair">Repair</SelectItem>
                  <SelectItem value="Inspection">Inspection</SelectItem>
                  <SelectItem value="Service">Service</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter maintenance description..."
              defaultValue={maintenance?.description}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="scheduledDate">Scheduled Date</Label>
              <Input id="scheduledDate" type="date" defaultValue={maintenance?.scheduledDate} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="completedDate">Completed Date</Label>
              <Input id="completedDate" type="date" defaultValue={maintenance?.completedDate} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="performedBy">Performed By</Label>
              <Input id="performedBy" placeholder="IT Support Team" defaultValue={maintenance?.performedBy} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cost">Cost</Label>
              <Input id="cost" type="number" step="0.01" placeholder="0.00" defaultValue={maintenance?.cost} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select defaultValue={maintenance?.status || "Scheduled"}>
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
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={() => onOpenChange(false)}>{isEdit ? "Update Maintenance" : "Schedule Maintenance"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
