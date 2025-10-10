"use client"

import { useEffect, useState } from "react"
import { SidebarNav } from "@/components/sidebar-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Plus, Search, Edit, Trash2, ReceiptText } from "lucide-react"
import { ConfirmationDialog } from "@/components/confirmation-dialog"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000"

type Valuation = { id: string; asset_id: number; valuation_date?: string | null; method?: string | null; initial_value?: number | null; current_value?: number | null }

export default function ValuationsPage() {
  const [items, setItems] = useState<Valuation[]>([])
  const [search, setSearch] = useState("")
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<Valuation | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)

  useEffect(() => {
    (async () => {
      const res = await fetch(`${API_BASE_URL}/api/valuations`)
      const data = await res.json()
      setItems(data.map((r: any) => ({ id: String(r.valuation_id), asset_id: r.asset_id, valuation_date: r.valuation_date, method: r.method, initial_value: Number(r.initial_value ?? 0), current_value: Number(r.current_value ?? 0) })))
    })()
  }, [])

  function handleAdd() { setSelected(null); setOpen(true) }
  function handleEdit(r: Valuation) { setSelected(r); setOpen(true) }
  function handleDelete(r: Valuation) { setSelected(r); setConfirmOpen(true) }

  async function onSave(data: Omit<Valuation,'id'>) {
    const payload: any = { ...data }
    if (payload.initial_value != null) payload.initial_value = String(payload.initial_value)
    if (payload.current_value != null) payload.current_value = String(payload.current_value)
    const res = await fetch(`${API_BASE_URL}/api/valuations`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    if (!res.ok) return
    const created = await res.json()
    setItems(prev => [...prev, { id: String(created.valuation_id), asset_id: created.asset_id, valuation_date: created.valuation_date, method: created.method, initial_value: Number(created.initial_value ?? 0), current_value: Number(created.current_value ?? 0) }])
  }
  async function onUpdate(id: string, data: Omit<Valuation,'id'>) {
    const payload: any = { ...data }
    if (payload.initial_value != null) payload.initial_value = String(payload.initial_value)
    if (payload.current_value != null) payload.current_value = String(payload.current_value)
    const res = await fetch(`${API_BASE_URL}/api/valuations/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    if (!res.ok) return
    const updated = await res.json()
    setItems(prev => prev.map(x => x.id === id ? { id, asset_id: updated.asset_id, valuation_date: updated.valuation_date, method: updated.method, initial_value: Number(updated.initial_value ?? 0), current_value: Number(updated.current_value ?? 0) } : x))
  }
  async function confirmDelete() {
    if (!selected) return
    const res = await fetch(`${API_BASE_URL}/api/valuations/${selected.id}`, { method: 'DELETE' })
    if (!res.ok && res.status !== 204) return
    setItems(prev => prev.filter(x => x.id !== selected.id))
    setSelected(null)
  }

  const filtered = items.filter(i => [i.asset_id, i.method || ''].join(' ').toLowerCase().includes(search.toLowerCase()))

  function ValuationForm() {
    const isEdit = !!selected
    const [form, setForm] = useState<Omit<Valuation,'id'>>({ asset_id: selected?.asset_id || 0, valuation_date: selected?.valuation_date || '', method: selected?.method || '', initial_value: selected?.initial_value ?? 0, current_value: selected?.current_value ?? 0 })
    return (
      <div className="fixed inset-0 bg-black/30 flex items-center justify-center" onClick={() => setOpen(false)}>
        <div className="bg-card border border-border rounded-md p-6 w-full max-w-xl" onClick={(e) => e.stopPropagation()}>
          <h2 className="text-lg font-semibold mb-4">{isEdit ? 'Edit Valuation' : 'Add Valuation'}</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm">Asset ID</label>
              <Input placeholder="Enter asset ID" value={form.asset_id} onChange={(e) => setForm({ ...form, asset_id: Number(e.target.value) || 0 })} />
            </div>
            <div>
              <label className="text-sm">Valuation Date</label>
              <Input type="date" value={form.valuation_date || ''} onChange={(e) => setForm({ ...form, valuation_date: e.target.value })} />
            </div>
            <div className="col-span-2">
              <label className="text-sm">Method</label>
              <Input placeholder="Enter valuation method (e.g., Straight-line)" value={form.method || ''} onChange={(e) => setForm({ ...form, method: e.target.value })} />
            </div>
            <div>
              <label className="text-sm">Initial Value</label>
              <Input type="number" step="0.01" placeholder="Enter initial value" value={form.initial_value ?? 0} onChange={(e) => setForm({ ...form, initial_value: Number(e.target.value || 0) })} />
            </div>
            <div>
              <label className="text-sm">Current Value</label>
              <Input type="number" step="0.01" placeholder="Enter current value" value={form.current_value ?? 0} onChange={(e) => setForm({ ...form, current_value: Number(e.target.value || 0) })} />
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={() => (isEdit ? onUpdate(selected!.id, form) : onSave(form)).then(() => setOpen(false))}>{isEdit ? 'Update' : 'Add'}</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex">
      <SidebarNav />
      <main className="flex-1 p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Asset Valuations</h1>
            <p className="text-muted-foreground">Track value changes for assets</p>
          </div>
          <Button onClick={handleAdd} className="gap-2"><Plus className="h-4 w-4"/>Add Valuation</Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search valuations by asset or method" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Asset ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Initial Value</TableHead>
                  <TableHead>Current Value</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>{r.asset_id}</TableCell>
                    <TableCell className="text-muted-foreground">{r.valuation_date ? String(r.valuation_date).slice(0,10) : '-'}</TableCell>
                    <TableCell className="text-muted-foreground">{r.method || '-'}</TableCell>
                    <TableCell>UGX {Number(r.initial_value ?? 0).toLocaleString()}</TableCell>
                    <TableCell>UGX {Number(r.current_value ?? 0).toLocaleString()}</TableCell>
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
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-6">No valuations yet.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {open && <ValuationForm />}
        <ConfirmationDialog open={confirmOpen} onOpenChange={setConfirmOpen} title="Delete Valuation" description={`Are you sure you want to delete this valuation?`} confirmText="Delete" cancelText="Cancel" onConfirm={confirmDelete} variant="destructive" />
      </main>
    </div>
  )
}





