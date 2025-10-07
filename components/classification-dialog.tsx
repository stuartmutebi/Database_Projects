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

interface ClassificationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  classification?: any
}

export function ClassificationDialog({ open, onOpenChange, classification }: ClassificationDialogProps) {
  const isEdit = !!classification

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Classification" : "Add New Classification"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the classification information below."
              : "Fill in the details to add a new classification."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Classification Name</Label>
            <Input id="name" placeholder="Electronics" defaultValue={classification?.name} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter classification description..."
              defaultValue={classification?.description}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={() => onOpenChange(false)}>{isEdit ? "Update Classification" : "Add Classification"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
