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

interface SupplierFormData {
  name: string
  contactPerson: string
  email?: string
  phone?: string
  address?: string
  website?: string
}

interface SupplierDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  supplier?: any
  onSave?: (data: SupplierFormData) => void
}

export function SupplierDialog({ open, onOpenChange, supplier, onSave }: SupplierDialogProps) {
  const isEdit = !!supplier

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Supplier" : "Add New Supplier"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Update the supplier information below." : "Fill in the details to add a new supplier."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Supplier Name</Label>
              <Input id="name" placeholder="Dell Inc." defaultValue={supplier?.name} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactPerson">Contact Person</Label>
              <Input id="contactPerson" placeholder="John Doe" defaultValue={supplier?.contactPerson} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="contact@supplier.com" defaultValue={supplier?.email} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" placeholder="+1-555-0100" defaultValue={supplier?.phone} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea id="address" placeholder="Enter full address..." defaultValue={supplier?.address} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input id="website" placeholder="www.supplier.com" defaultValue={supplier?.website} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={() => {
            const name = (document.getElementById("name") as HTMLInputElement | null)?.value?.trim() || ""
            const contactPerson = (document.getElementById("contactPerson") as HTMLInputElement | null)?.value?.trim() || ""
            const email = (document.getElementById("email") as HTMLInputElement | null)?.value?.trim()
            const phone = (document.getElementById("phone") as HTMLInputElement | null)?.value?.trim()
            const address = (document.getElementById("address") as HTMLTextAreaElement | null)?.value?.trim()
            const website = (document.getElementById("website") as HTMLInputElement | null)?.value?.trim()

            if (!name || !contactPerson) {
              // simple guard; could be replaced with toasts/validation UI
              return
            }

            onSave?.({ name, contactPerson, email, phone, address, website })
          }}>
            {isEdit ? "Update Supplier" : "Add Supplier"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
