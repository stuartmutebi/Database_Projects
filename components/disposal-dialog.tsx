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

interface DisposalDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  disposal?: any
}

export function DisposalDialog({ open, onOpenChange, disposal }: DisposalDialogProps) {
  const isEdit = !!disposal

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Disposal Record" : "Record New Disposal"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Update the disposal record below." : "Fill in the details to record an asset disposal."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="asset">Asset</Label>
              <Select defaultValue={disposal?.assetId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select asset" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AST-089">Old Desktop Computer (AST-089)</SelectItem>
                  <SelectItem value="AST-156">Broken Office Chair (AST-156)</SelectItem>
                  <SelectItem value="AST-045">Outdated Server (AST-045)</SelectItem>
                  <SelectItem value="AST-078">Damaged Printer (AST-078)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="disposalDate">Disposal Date</Label>
              <Input id="disposalDate" type="date" defaultValue={disposal?.disposalDate} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="disposalMethod">Disposal Method</Label>
              <Select defaultValue={disposal?.disposalMethod}>
                <SelectTrigger>
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sale">Sale</SelectItem>
                  <SelectItem value="Recycling">Recycling</SelectItem>
                  <SelectItem value="Donation">Donation</SelectItem>
                  <SelectItem value="Destruction">Destruction</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select defaultValue={disposal?.status || "Pending"}>
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
            <Textarea id="reason" placeholder="Enter reason for disposal..." defaultValue={disposal?.reason} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="buyer">Buyer/Recipient</Label>
              <Input id="buyer" placeholder="Tech Recycling Co." defaultValue={disposal?.buyer} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="salePrice">Sale Price</Label>
              <Input id="salePrice" type="number" step="0.01" placeholder="0.00" defaultValue={disposal?.salePrice} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="approvedBy">Approved By</Label>
            <Input id="approvedBy" placeholder="John Manager" defaultValue={disposal?.approvedBy} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={() => onOpenChange(false)}>{isEdit ? "Update Disposal" : "Record Disposal"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
