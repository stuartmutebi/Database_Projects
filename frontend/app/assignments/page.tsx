"use client"

import { useEffect, useState } from "react"
import { SidebarNav } from "@/components/sidebar-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Plus, Search, Edit, Trash2, ClipboardList } from "lucide-react"
import { ConfirmationDialog } from "@/components/confirmation-dialog"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000"

type Assignment = { id: string; asset_id: number; user_id: number; assigned_date?: string | null; return_date?: string | null; status?: string | null; description?: string | null; approved_by?: string | null }

export default function AssignmentsPage() {
  const [items, setItems] = useState<Assignment[]>([])
  const [search, setSearch] = useState("")
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<Assignment | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)

  useEffect(() => {
    (async () => {
      const res = await fetch(`${API_BASE_URL}/api/assignments`)
      const data = await res.json()
      setItems(data.map((r: any) => ({ id: String(r.assignment_id), asset_id: r.asset_id, user_id: r.user_id, assigned_date: r.assigned_date, return_date: r.return_date, status: r.status, description: r.description, approved_by: r.approved_by })))
    })()
  }, [])

  function handleAdd() { setSelected(null); setOpen(true) }
  function handleEdit(r: Assignment) { setSelected(r); setOpen(true) }
  function handleDelete(r: Assignment) { setSelected(r); setConfirmOpen(true) }

  async function onSave(data: Omit<Assignment,'id'>) {
    const res = await fetch(`${API_BASE_URL}/api/assignments`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...data, assigned_date: data.assigned_date || null, return_date: data.return_date || null }) })
    if (!res.ok) return
    const created = await res.json()
    setItems(prev => [...prev, { id: String(created.assignment_id), asset_id: created.asset_id, user_id: created.user_id, assigned_date: created.assigned_date, return_date: created.return_date, status: created.status, description: created.description, approved_by: created.approved_by }])
  }
  async function onUpdate(id: string, data: Omit<Assignment,'id'>) {
    const res = await fetch(`${API_BASE_URL}/api/assignments/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...data, assigned_date: data.assigned_date || null, return_date: data.return_date || null }) })
    if (!res.ok) return
    const updated = await res.json()
    setItems(prev => prev.map(x => x.id === id ? { id, asset_id: updated.asset_id, user_id: updated.user_id, assigned_date: updated.assigned_date, return_date: updated.return_date, status: updated.status, description: updated.description, approved_by: updated.approved_by } : x))
  }
  async function confirmDelete() {
    if (!selected) return
    const res = await fetch(`${API_BASE_URL}/api/assignments/${selected.id}`, { method: 'DELETE' })
    if (!res.ok && res.status !== 204) return
    setItems(prev => prev.filter(x => x.id !== selected.id))
    setSelected(null)
  }

  const filtered = items.filter(i => [i.asset_id, i.user_id, i.status || '', i.description || ''].join(' ').toLowerCase().includes(search.toLowerCase()))

  // Simple inline form modal replacement to keep code short
  function AssignmentForm() {
    const isEdit = !!selected
    const [form, setForm] = useState<Omit<Assignment,'id'>>({ asset_id: selected?.asset_id || 0, user_id: selected?.user_id || 0, assigned_date: selected?.assigned_date || '', return_date: selected?.return_date || '', status: selected?.status || 'Active', description: selected?.description || '', approved_by: selected?.approved_by || '' })
    const [assets, setAssets] = useState<any[]>([])
    const [users, setUsers] = useState<any[]>([])
    useEffect(() => {
      (async () => {
        try {
          const [a, u] = await Promise.all([
            fetch(`${API_BASE_URL}/api/assets`),
            fetch(`${API_BASE_URL}/api/users`),
          ])
          const aData = await a.json()
          const uData = await u.json()
          setAssets(aData.map((x: any) => ({ id: x.asset_id, name: x.asset_name })))
          setUsers(uData.map((x: any) => ({ id: x.user_id, name: x.name })))
        } catch (e) { /* ignore */ }
      })()
    }, [])
    return (
      <div className="fixed inset-0 bg-black/30 flex items-center justify-center" onClick={() => setOpen(false)}>
        <div className="bg-card border border-border rounded-md p-6 w-full max-w-xl" onClick={(e) => e.stopPropagation()}>
          <h2 className="text-lg font-semibold mb-4">{isEdit ? 'Edit Assignment' : 'Add Assignment'}</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm">Asset</label>
              <select className="w-full border border-input rounded-md px-3 py-2" value={form.asset_id} onChange={(e) => setForm({ ...form, asset_id: Number(e.target.value) })} aria-label="Select asset">
                <option value={0}>Select asset</option>
                {assets.map(a => (<option key={a.id} value={a.id}>{a.name}</option>))}
              </select>
            </div>
            <div>
              <label className="text-sm">User</label>
              <select className="w-full border border-input rounded-md px-3 py-2" value={form.user_id} onChange={(e) => setForm({ ...form, user_id: Number(e.target.value) })} aria-label="Select user">
                <option value={0}>Select user</option>
                {users.map(u => (<option key={u.id} value={u.id}>{u.name}</option>))}
              </select>
            </div>
            <div>
              <label className="text-sm">Assigned Date</label>
              <Input type="date" value={form.assigned_date || ''} onChange={(e) => setForm({ ...form, assigned_date: e.target.value })} />
            </div>
            <div>
              <label className="text-sm">Return Date</label>
              <Input type="date" value={form.return_date || ''} onChange={(e) => setForm({ ...form, return_date: e.target.value })} />
            </div>
            <div className="col-span-2">
              <label className="text-sm">Status</label>
              <Input placeholder="Enter status (e.g., Active)" value={form.status || ''} onChange={(e) => setForm({ ...form, status: e.target.value })} />
            </div>
            <div className="col-span-2">
              <label className="text-sm">Description</label>
              <Input placeholder="Enter description" value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="col-span-2">
              <label className="text-sm">Approved By</label>
              <Input placeholder="Enter approver name" value={form.approved_by || ''} onChange={(e) => setForm({ ...form, approved_by: e.target.value })} />
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
            <h1 className="text-3xl font-bold text-foreground">Assignments</h1>
            <p className="text-muted-foreground">Issue assets to users and track returns</p>
          </div>
          <Button onClick={handleAdd} className="gap-2"><Plus className="h-4 w-4"/>Add Assignment</Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search assignments by asset, user, status, or notes" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Asset ID</TableHead>
                  <TableHead>User ID</TableHead>
                  <TableHead>Assigned Date</TableHead>
                  <TableHead>Return Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>{r.asset_id}</TableCell>
                    <TableCell>{r.user_id}</TableCell>
                    <TableCell className="text-muted-foreground">{r.assigned_date ? String(r.assigned_date).slice(0,10) : '-'}</TableCell>
                    <TableCell className="text-muted-foreground">{r.return_date ? String(r.return_date).slice(0,10) : '-'}</TableCell>
                    <TableCell>{r.status || '-'}</TableCell>
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
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-6">No assignments yet.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {open && <AssignmentForm />}
        <ConfirmationDialog open={confirmOpen} onOpenChange={setConfirmOpen} title="Delete Assignment" description={`Are you sure you want to delete this assignment?`} confirmText="Delete" cancelText="Cancel" onConfirm={confirmDelete} variant="destructive" />
      </main>
    </div>
  )
}


