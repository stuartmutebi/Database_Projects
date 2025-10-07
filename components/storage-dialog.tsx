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

interface StorageDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  storage?: any
}

export function StorageDialog({ open, onOpenChange, storage }: StorageDialogProps) {
  const isEdit = !!storage

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Storage Location" : "Add New Storage Location"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the storage location information below."
              : "Fill in the details to add a new storage location."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Location Name</Label>
            <Input id="name" placeholder="Office Floor 2" defaultValue={storage?.name} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter location description..."
              defaultValue={storage?.description}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input id="address" placeholder="Building A, Floor 2" defaultValue={storage?.address} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="capacity">Capacity</Label>
            <Input id="capacity" type="number" placeholder="50" defaultValue={storage?.capacity} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={() => onOpenChange(false)}>{isEdit ? "Update Location" : "Add Location"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
