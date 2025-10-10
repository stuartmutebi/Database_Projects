"use client"

import { useEffect, useState } from "react"
import { SidebarNav } from "@/components/sidebar-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Plus, Search, Edit, Trash2, MapPin } from "lucide-react"
import { LocationDialog, type LocationRecord } from "@/components/location-dialog"
import { ConfirmationDialog } from "@/components/confirmation-dialog"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000"

export default function LocationsPage() {
  const [items, setItems] = useState<LocationRecord[]>([])
  const [search, setSearch] = useState("")
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<LocationRecord | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/locations`)
        const data = await res.json()
        setItems(data.map((r: any) => ({ id: String(r.location_id), building: r.building || "", postal_address: r.postal_address || "", geographical_location: r.geographical_location || "" })))
      } catch (e) { console.error(e) }
    })()
  }, [])

  function handleAdd() { setSelected(null); setOpen(true) }
  function handleEdit(r: LocationRecord) { setSelected(r); setOpen(true) }
  function handleDelete(r: LocationRecord) { setSelected(r); setConfirmOpen(true) }

  async function onSave(data: Omit<LocationRecord,'id'>) {
    const res = await fetch(`${API_BASE_URL}/api/locations`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
    if (!res.ok) return console.error('Create failed')
    const created = await res.json()
    setItems(prev => [...prev, { id: String(created.location_id), building: created.building || "", postal_address: created.postal_address || "", geographical_location: created.geographical_location || "" }])
  }
  async function onUpdate(id: string, data: Omit<LocationRecord,'id'>) {
    const res = await fetch(`${API_BASE_URL}/api/locations/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
    if (!res.ok) return console.error('Update failed')
    const updated = await res.json()
    setItems(prev => prev.map(x => x.id === id ? { id, building: updated.building || "", postal_address: updated.postal_address || "", geographical_location: updated.geographical_location || "" } : x))
  }
  async function confirmDelete() {
    if (!selected) return
    const res = await fetch(`${API_BASE_URL}/api/locations/${selected.id}`, { method: 'DELETE' })
    if (!res.ok && res.status !== 204) return console.error('Delete failed')
    setItems(prev => prev.filter(x => x.id !== selected.id))
    setSelected(null)
  }

  const filtered = items.filter(i => [i.building, i.postal_address, i.geographical_location].join(' ').toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="flex">
      <SidebarNav />
      <main className="flex-1 p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Locations</h1>
            <p className="text-muted-foreground">Manage physical locations where assets reside</p>
          </div>
          <Button onClick={handleAdd} className="gap-2"><Plus className="h-4 w-4"/>Add Location</Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search by building, postal, or geographic..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Building</TableHead>
                  <TableHead>Postal Address</TableHead>
                  <TableHead>Geographical Location</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>{r.building || '-'}</TableCell>
                    <TableCell className="text-muted-foreground">{r.postal_address || '-'}</TableCell>
                    <TableCell className="text-muted-foreground">{r.geographical_location || '-'}</TableCell>
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
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-6">No locations yet.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <LocationDialog open={open} onOpenChange={setOpen} location={selected} onSave={onSave} onUpdate={onUpdate} />
        <ConfirmationDialog open={confirmOpen} onOpenChange={setConfirmOpen} title="Delete Location" description={`Are you sure you want to delete "${selected?.building || ''}"? This cannot be undone.`} confirmText="Delete" cancelText="Cancel" onConfirm={confirmDelete} variant="destructive" />
      </main>
    </div>
  )
}





