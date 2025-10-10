"use client"

import { useEffect, useState } from "react"
import { SidebarNav } from "@/components/sidebar-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Plus, Search, Edit, Trash2, UserCog } from "lucide-react"
import { MaintenanceStaffDialog, type MaintenanceStaffRecord } from "@/components/maintenance-staff-dialog"
import { ConfirmationDialog } from "@/components/confirmation-dialog"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000"

export default function MaintenanceStaffPage() {
  const [items, setItems] = useState<MaintenanceStaffRecord[]>([])
  const [search, setSearch] = useState("")
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<MaintenanceStaffRecord | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)

  useEffect(() => {
    (async () => {
      const res = await fetch(`${API_BASE_URL}/api/maintenance-staff`)
      const data = await res.json()
      setItems(data.map((r: any) => ({ id: String(r.m_staff_id), name: r.name, phone: r.phone || '', email: r.email || '', specialization: r.specialization || '' })))
    })()
  }, [])

  function handleAdd() { setSelected(null); setOpen(true) }
  function handleEdit(r: MaintenanceStaffRecord) { setSelected(r); setOpen(true) }
  function handleDelete(r: MaintenanceStaffRecord) { setSelected(r); setConfirmOpen(true) }

  async function onSave(data: Omit<MaintenanceStaffRecord,'id'>) {
    const res = await fetch(`${API_BASE_URL}/api/maintenance-staff`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
    if (!res.ok) return
    const created = await res.json()
    setItems(prev => [...prev, { id: String(created.m_staff_id), name: created.name, phone: created.phone || '', email: created.email || '', specialization: created.specialization || '' }])
  }
  async function onUpdate(id: string, data: Omit<MaintenanceStaffRecord,'id'>) {
    const res = await fetch(`${API_BASE_URL}/api/maintenance-staff/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
    if (!res.ok) return
    const updated = await res.json()
    setItems(prev => prev.map(x => x.id === id ? { id, name: updated.name, phone: updated.phone || '', email: updated.email || '', specialization: updated.specialization || '' } : x))
  }
  async function confirmDelete() {
    if (!selected) return
    const res = await fetch(`${API_BASE_URL}/api/maintenance-staff/${selected.id}`, { method: 'DELETE' })
    if (!res.ok && res.status !== 204) return
    setItems(prev => prev.filter(x => x.id !== selected.id))
    setSelected(null)
  }

  const filtered = items.filter(i => [i.name, i.phone, i.email, i.specialization].join(' ').toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="flex">
      <SidebarNav />
      <main className="flex-1 p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Maintenance Staff</h1>
            <p className="text-muted-foreground">Manage technicians who service assets</p>
          </div>
          <Button onClick={handleAdd} className="gap-2"><Plus className="h-4 w-4"/>Add Staff</Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search staff by name, phone, or specialization" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Specialization</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.name}</TableCell>
                    <TableCell className="text-muted-foreground">{r.phone || '-'}</TableCell>
                    <TableCell className="text-muted-foreground">{r.email || '-'}</TableCell>
                    <TableCell className="text-muted-foreground">{r.specialization || '-'}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(r)} title="Edit"><Edit className="h-4 w-4"/></Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(r)} title="Delete" className="text-red-600 hover:text-red-700 hover:bg-red-50"><Trash2 className="h-4 w-4"/></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-6">No staff yet.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <MaintenanceStaffDialog open={open} onOpenChange={setOpen} staff={selected} onSave={onSave} onUpdate={onUpdate} />
        <ConfirmationDialog open={confirmOpen} onOpenChange={setConfirmOpen} title="Delete Staff" description={`Are you sure you want to delete "${selected?.name || ''}"? This cannot be undone.`} confirmText="Delete" cancelText="Cancel" onConfirm={confirmDelete} variant="destructive" />
      </main>
    </div>
  )
}





