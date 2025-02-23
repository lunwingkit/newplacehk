"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { GenericTable } from "@/components/generic-table"
import type { ColumnDef } from "@tanstack/react-table"
import ParticipantFormModal from "./participants-form-modal"
import { EventsSignedUpByUsers } from "@prisma/client"

interface EventParticipantsModalProps {
  isOpen: boolean
  onClose: () => void
  eventId: string
}

export default function EventParticipantsModal({ isOpen, onClose, eventId }: EventParticipantsModalProps) {
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [selectedParticipant, setSelectedParticipant] = useState<EventsSignedUpByUsers | null>(null)
  const { toast } = useToast()

  const columns: ColumnDef<EventsSignedUpByUsers>[] = [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "signUpStatus", header: "Status" },
  ]

  const fetchParticipants = async ({ page, pageSize }: { page: number; pageSize: number }) => {
    const response = await fetch(`/api/events/${eventId}/participants?page=${page}&pageSize=${pageSize}`)
    if (!response.ok) throw new Error("Failed to fetch participants")
    return response.json()
  }

  const deleteParticipant = async (id: string) => {
    const response = await fetch(`/api/events/${eventId}/participants/${id}`, { method: "DELETE" })
    if (!response.ok) throw new Error("Failed to delete participant")
  }

  const onEdit = (participant: EventsSignedUpByUsers) => {
    setSelectedParticipant(participant)
    setIsFormModalOpen(true)
  }

  const onAdd = () => {
    setSelectedParticipant(null)
    setIsFormModalOpen(true)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Event Participants</DialogTitle>
        </DialogHeader>
        <GenericTable<EventsSignedUpByUsers>
          columns={columns}
          type="participants"
          onEdit={onEdit}
          onAdd={onAdd}
          idAccessor={(participant) => participant.id}
          fetchFunction={fetchParticipants}
          deleteFunction={deleteParticipant}
        />
      </DialogContent>
      <ParticipantFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        initialData={selectedParticipant}
        eventId={eventId}
      />
    </Dialog>
  )
}

