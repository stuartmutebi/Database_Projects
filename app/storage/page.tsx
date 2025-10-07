"use client"

import { useState } from "react"
import { SidebarNav } from "@/components/sidebar-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Plus, Search, Edit, Trash2 } from "lucide-react"
import { StorageDialog } from "@/components/storage-dialog"

const mockStorageLocations = [
  {
    id: 1,
    name: "Office Floor 2",
    description: "Second floor office space",
    capacity: 50,
    currentAssets: 32,
    address: "Building A, Floor 2",
  },
  {
    id: 2,
    name: "Office Floor 3",
    description: "Third floor office space",
    capacity: 50,
    currentAssets: 28,
    address: "Building A, Floor 3",
  },
  {
    id: 3,
    name: "Warehouse A",
    description: "Main storage warehouse",
    capacity: 200,
    currentAssets: 145,
    address: "Warehouse District, Unit A",
  },
  {
    id: 4,
    name: "Server Room",
    description: "Climate-controlled server room",
    capacity: 30,
    currentAssets: 24,
    address: "Building A, Basement",
  },
]

export default function StoragePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedStorage, setSelectedStorage] = useState(null)

  const filteredStorage = mockStorageLocations.filter((storage) =>
    storage.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="flex">
      <SidebarNav />
      <main className="flex-1 p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Storage Locations</h1>
            <p className="text-muted-foreground">Manage storage locations and capacity</p>
          </div>
          <Button
            onClick={() => {
              setSelectedStorage(null)
              setIsDialogOpen(true)
            }}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Location
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search storage locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Location Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Current Assets</TableHead>
                  <TableHead>Utilization</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStorage.map((storage) => {
                  const utilization = Math.round((storage.currentAssets / storage.capacity) * 100)
                  return (
                    <TableRow key={storage.id}>
                      <TableCell className="font-medium">{storage.name}</TableCell>
                      <TableCell className="text-muted-foreground">{storage.description}</TableCell>
                      <TableCell>{storage.address}</TableCell>
                      <TableCell>{storage.capacity}</TableCell>
                      <TableCell>{storage.currentAssets}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-24 overflow-hidden rounded-full bg-muted">
                            <div className="h-full bg-primary" style={{ width: `${utilization}%` }} />
                          </div>
                          <span className="text-sm text-muted-foreground">{utilization}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setSelectedStorage(storage)
                              setIsDialogOpen(true)
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <StorageDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} storage={selectedStorage} />
      </main>
    </div>
  )
}
