"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GenericTable } from "@/components/generic-table"
import { Button } from "@/components/ui/button"
import { Users, Heart, DollarSign } from "lucide-react"
import UserModal from "./user-modal"
import EventModal from "./event-modal"
import NewsModal from "./news-modal"
import ParticipantsModal from "./event/event-participants-modal"
import PriceSchemeModal from "./event/event-price-scheme-modal"
import type { ColumnDef } from "@tanstack/react-table"
import EventInterestedUsersModal from "./event/event-interested-users-modal"
import { News, User, Event } from "@prisma/client"
import Image from "next/image"

// API functions
async function fetchUsers({ page, pageSize }: { page: number; pageSize: number }) {
  const response = await fetch(`/api/users?page=${page}&pageSize=${pageSize}`)
  if (!response.ok) {
    throw new Error("Failed to fetch users")
  }
  return response.json()
}

async function deleteUser(id: string) {
  const response = await fetch(`/api/users/${id}`, { method: "DELETE" })
  if (!response.ok) {
    throw new Error("Failed to delete user")
  }
}

async function fetchEvents({ page, pageSize }: { page: number; pageSize: number }) {
  const response = await fetch(`/api/events?page=${page}&pageSize=${pageSize}`)
  if (!response.ok) {
    throw new Error("Failed to fetch events")
  }
  return response.json()
}

async function deleteEvent(id: string) {
  const response = await fetch(`/api/events/${id}`, { method: "DELETE" })
  if (!response.ok) {
    throw new Error("Failed to delete event")
  }
}

async function fetchNews({ page, pageSize }: { page: number; pageSize: number }) {
  const response = await fetch(`/api/news?page=${page}&pageSize=${pageSize}`)
  if (!response.ok) {
    throw new Error("Failed to fetch news")
  }
  return response.json()
}

async function deleteNews(id: string) {
  const response = await fetch(`/api/news/${id}`, { method: "DELETE" })
  if (!response.ok) {
    throw new Error("Failed to delete news")
  }
}

export default function AdminDashboard() {
  const [isUserModalOpen, setIsUserModalOpen] = useState(false)
  const [isEventModalOpen, setIsEventModalOpen] = useState(false)
  const [isNewsModalOpen, setIsNewsModalOpen] = useState(false)
  const [isParticipantsModalOpen, setIsParticipantsModalOpen] = useState(false)
  const [isInterestedUsersModalOpen, setIsInterestedUsersModalOpen] = useState(false)
  const [isPriceSchemeModalOpen, setIsPriceSchemeModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<User | Event | News | null>(null)
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null)
  const [onSuccessCallback, setOnSuccessCallback] = useState<() => void>(() => {}); // Add state for callback

  const userColumns: ColumnDef<User>[] = [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "age", header: "Age" },
    { accessorKey: "gender", header: "Gender" },
    {
      accessorKey: "interests",
      header: "Interests",
      cell: ({ row }) => (
        <div className="max-w-[200px] truncate" title={row.original.interests?.join(", ")}>
          {row.original.interests?.join(", ")}
        </div>
      ),
    },
    {
      accessorKey: "image",
      header: "Image",
      cell: ({ row }) =>
        row.original.image ? (
          <div className="relative w-10 h-10">
            <Image
              src={row.original.image || "/placeholder.svg"}
              alt={`${row.original.name}'s profile`}
              fill
              style={{ objectFit: "cover" }}
              className="rounded-full"
            />
          </div>
        ) : (
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-gray-500 text-xs">No image</span>
          </div>
        ),
    },
  ]

  const eventColumns: ColumnDef<Event>[] = [
    { accessorKey: "title", header: "Title" },
    { accessorKey: "startDate", header: "Start Date" },
    { accessorKey: "location", header: "Location" },
  ]

  const newsColumns: ColumnDef<News>[] = [
    { accessorKey: "title", header: "Title" },
    { accessorKey: "publishedAt", header: "Published At" },
    { accessorKey: "author", header: "Author" },
  ]

  const renderEventCustomActions = (event: Event) => (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          setSelectedEventId(event.id)
          setIsParticipantsModalOpen(true)
        }}
      >
        <Users className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          setSelectedEventId(event.id)
          setIsInterestedUsersModalOpen(true)
        }}
      >
        <Heart className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          setSelectedEventId(event.id)
          setIsPriceSchemeModalOpen(true)
        }}
      >
        <DollarSign className="h-4 w-4" />
      </Button>
    </>
  )

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        <Tabs defaultValue="users">
          <TabsList>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="news">News</TabsTrigger>
          </TabsList>
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Manage Users</CardTitle>
                <CardDescription>Add, edit, or delete users</CardDescription>
              </CardHeader>
              <CardContent>
                <GenericTable<User>
                  columns={userColumns}
                  type="users"
                  onEdit={(item: User, onSuccess) => {
                    setSelectedItem(item)
                    setIsUserModalOpen(true)
                    setOnSuccessCallback(() => onSuccess || (() => {}));
                  }}
                  onAdd={(onSuccess) => {
                    setSelectedItem(null)
                    setIsUserModalOpen(true)
                    setOnSuccessCallback(() => onSuccess || (() => {}));
                  }}
                  idAccessor={(user) => user.id}
                  fetchFunction={fetchUsers}
                  deleteFunction={deleteUser}
                />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="events">
            <Card>
              <CardHeader>
                <CardTitle>Manage Events</CardTitle>
                <CardDescription>Add, edit, or delete events</CardDescription>
              </CardHeader>
              <CardContent>
                <GenericTable<Event>
                  columns={eventColumns}
                  type="events"
                  onEdit={(item: Event, onSuccess) => {
                    setSelectedItem(item)
                    setIsEventModalOpen(true)
                    setOnSuccessCallback(() => onSuccess || (() => {}));
                  }}
                  onAdd={(onSuccess) => {
                    setSelectedItem(null)
                    setIsEventModalOpen(true)
                    setOnSuccessCallback(() => onSuccess || (() => {}));
                  }}
                  idAccessor={(event) => event.id}
                  fetchFunction={fetchEvents}
                  deleteFunction={deleteEvent}
                  renderCustomActions={renderEventCustomActions}
                />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="news">
            <Card>
              <CardHeader>
                <CardTitle>Manage News</CardTitle>
                <CardDescription>Add, edit, or delete news articles</CardDescription>
              </CardHeader>
              <CardContent>
                <GenericTable<News>
                  columns={newsColumns}
                  type="news"
                  onEdit={(item: News, onSuccess) => {
                    setSelectedItem(item);
                    setIsNewsModalOpen(true);
                    setOnSuccessCallback(() => onSuccess || (() => {}));
                  }}
                  onAdd={(onSuccess) => {
                    setSelectedItem(null);
                    setIsNewsModalOpen(true);
                    setOnSuccessCallback(() => onSuccess || (() => {}));
                  }}
                  idAccessor={(news) => news.id}
                  fetchFunction={fetchNews}
                  deleteFunction={deleteNews}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <UserModal isOpen={isUserModalOpen} onClose={() => setIsUserModalOpen(false)} user={selectedItem as User} onSuccess={onSuccessCallback} />
      <EventModal isOpen={isEventModalOpen} onClose={() => setIsEventModalOpen(false)} event={selectedItem as Event} onSuccess={onSuccessCallback} />
      <NewsModal isOpen={isNewsModalOpen} onClose={() => setIsNewsModalOpen(false)} news={selectedItem as News} onSuccess={onSuccessCallback} />
      <ParticipantsModal
        isOpen={isParticipantsModalOpen}
        onClose={() => setIsParticipantsModalOpen(false)}
        eventId={selectedEventId || ""}
      />
      <EventInterestedUsersModal
        isOpen={isInterestedUsersModalOpen}
        onClose={() => setIsInterestedUsersModalOpen(false)}
        eventId={selectedEventId || ""}
      />
      <PriceSchemeModal
        isOpen={isPriceSchemeModalOpen}
        onClose={() => setIsPriceSchemeModalOpen(false)}
        eventId={selectedEventId || ""}
      />
    </div>
  )
}

