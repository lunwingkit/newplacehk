"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { GenericTable } from "@/components/generic-table"
import type { ColumnDef } from "@tanstack/react-table"
import { useToast } from "@/components/ui/use-toast"

interface EventInterestedUsersModalProps {
  isOpen: boolean
  onClose: () => void
  eventId: string
}

interface InterestedUser {
  id: string
  name: string
  email: string
}

export default function EventInterestedUsersModal({ isOpen, onClose, eventId }: EventInterestedUsersModalProps) {
  const [selectedUser, setSelectedUser] = useState<InterestedUser | null>(null)
  const { toast } = useToast()

  const columns: ColumnDef<InterestedUser>[] = [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "email", header: "Email" },
  ]

  const fetchInterestedUsers = async ({
    page,
    pageSize,
  }: {
    page: number
    pageSize: number
  }) => {
    const response = await fetch(`/api/events/${eventId}/interested?page=${page}&pageSize=${pageSize}`)
    if (!response.ok) throw new Error("Failed to fetch interested users")
    return response.json()
  }

  const deleteInterestedUser = async () => {
    toast({
      title: "Action not allowed",
      description: "Deleting interested users is not permitted.",
      variant: "destructive",
    })
    throw new Error("Deleting interested users is not allowed")
  }

  const onEdit = (user: InterestedUser) => {
    setSelectedUser(user)
    toast({
      title: "Action not allowed",
      description: "Editing interested users is not permitted.",
      variant: "destructive",
    })
  }

  const onAdd = () => {
    toast({
      title: "Action not allowed",
      description: "Adding interested users manually is not permitted.",
      variant: "destructive",
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Interested Users</DialogTitle>
        </DialogHeader>
        <GenericTable<InterestedUser>
          columns={columns}
          type="interestedUsers"
          onEdit={onEdit}
          onAdd={onAdd}
          idAccessor={(user) => user.id}
          fetchFunction={fetchInterestedUsers}
          deleteFunction={deleteInterestedUser}
          disableAdd={true}
          disableEdit={true}
          disableDelete={true}
        />
      </DialogContent>
    </Dialog>
  )
}

