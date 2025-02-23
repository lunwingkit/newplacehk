"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { GenericTable } from "@/components/generic-table"
import type { ColumnDef } from "@tanstack/react-table"
import PriceSchemeFormModal from "./price-scheme-form-modal"
import { PriceScheme } from "@prisma/client"

interface EventPriceSchemeModalProps {
  isOpen: boolean
  onClose: () => void
  eventId: string
}


export default function EventPriceSchemeModal({ isOpen, onClose, eventId }: EventPriceSchemeModalProps) {
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [selectedScheme, setSelectedScheme] = useState<PriceScheme | null>(null)
  const { toast } = useToast()

  const columns: ColumnDef<PriceScheme>[] = [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "description", header: "Description" },
    { accessorKey: "price", header: "Price", cell: ({ row }) => `$${row.original.price.toFixed(2)}` },
  ]

  const fetchPriceSchemes = async ({ page, pageSize }: { page: number; pageSize: number }) => {
    const response = await fetch(`/api/events/${eventId}/price-schemes?page=${page}&pageSize=${pageSize}`)
    if (!response.ok) throw new Error("Failed to fetch price schemes")
    return response.json()
  }

  const deletePriceScheme = async (id: string) => {
    const response = await fetch(`/api/events/${eventId}/price-schemes/${id}`, { method: "DELETE" })
    if (!response.ok) throw new Error("Failed to delete price scheme")
  }

  const onEdit = (scheme: PriceScheme) => {
    setSelectedScheme(scheme)
    setIsFormModalOpen(true)
  }

  const onAdd = () => {
    setSelectedScheme(null)
    setIsFormModalOpen(true)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Price Schemes</DialogTitle>
        </DialogHeader>
        <GenericTable<PriceScheme>
          columns={columns}
          type="priceSchemes"
          onEdit={onEdit}
          onAdd={onAdd}
          idAccessor={(scheme) => scheme.id}
          fetchFunction={fetchPriceSchemes}
          deleteFunction={deletePriceScheme}
        />
      </DialogContent>
      <PriceSchemeFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        initialData={selectedScheme}
        eventId={eventId}
      />
    </Dialog>
  )
}

