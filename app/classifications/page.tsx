"use client"

import { useState } from "react"
import { SidebarNav } from "@/components/sidebar-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Plus, Search, Edit, Trash2 } from "lucide-react"
import { ClassificationDialog } from "@/components/classification-dialog"

const mockClassifications = [
  {
    id: 1,
    name: "Electronics",
    description: "Electronic devices and equipment",
    assetCount: 45,
  },
  {
    id: 2,
    name: "Office Equipment",
    description: "General office equipment and supplies",
    assetCount: 32,
  },
  {
    id: 3,
    name: "Furniture",
    description: "Office furniture and fixtures",
    assetCount: 28,
  },
  {
    id: 4,
    name: "Vehicles",
    description: "Company vehicles and transportation",
    assetCount: 12,
  },
]

export default function ClassificationsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedClassification, setSelectedClassification] = useState(null)

  const filteredClassifications = mockClassifications.filter((classification) =>
    classification.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="flex">
      <SidebarNav />
      <main className="flex-1 p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Classifications</h1>
            <p className="text-muted-foreground">Organize assets by category</p>
          </div>
          <Button
            onClick={() => {
              setSelectedClassification(null)
              setIsDialogOpen(true)
            }}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Classification
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search classifications..."
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
                  <TableHead>Classification Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Asset Count</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClassifications.map((classification) => (
                  <TableRow key={classification.id}>
                    <TableCell className="font-medium">{classification.name}</TableCell>
                    <TableCell className="text-muted-foreground">{classification.description}</TableCell>
                    <TableCell>
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                        {classification.assetCount} assets
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedClassification(classification)
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
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <ClassificationDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          classification={selectedClassification}
        />
      </main>
    </div>
  )
}
