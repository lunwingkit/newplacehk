"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Navbar } from "@/components/navbar"
import { GenericTable } from "@/components/generic-table"
import UserModal from "./user-modal"
import EventModal from "./event-modal"
import NewsModal from "./news-modal"
import type { ColumnDef } from "@tanstack/react-table"

interface User {
  id: string
  name: string
  email: string
  age: number
}

interface Event {
  id: string
  title: string
  startDate: string
  location: string
}

interface News {
  id: string
  title: string
  publishedAt: string
  author: string
}

export default function AdminDashboard() {
  const [isUserModalOpen, setIsUserModalOpen] = useState(false)
  const [isEventModalOpen, setIsEventModalOpen] = useState(false)
  const [isNewsModalOpen, setIsNewsModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<User | Event | News | null>(null)

  const userColumns: ColumnDef<User>[] = [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "age", header: "Age" },
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

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
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
                  onEdit={(item: User) => {
                    setSelectedItem(item);
                    setIsUserModalOpen(true);
                  }}
                  onAdd={() => {
                    setSelectedItem(null);
                    setIsUserModalOpen(true);
                  }}
                  idAccessor={(user) => user.id}
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
                  onEdit={(item: Event) => {
                    setSelectedItem(item);
                    setIsEventModalOpen(true);
                  }}
                  onAdd={() => {
                    setSelectedItem(null);
                    setIsEventModalOpen(true);
                  }}
                  idAccessor={(event) => event.id}
                />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="news">
            <Card>
              <CardHeader>
                <CardTitle>Manage News</CardTitle>
                <CardDescription>
                  Add, edit, or delete news articles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GenericTable<News>
                  columns={newsColumns}
                  type="news"
                  onEdit={(item: News) => {
                    setSelectedItem(item);
                    setIsNewsModalOpen(true);
                  }}
                  onAdd={() => {
                    setSelectedItem(null);
                    setIsNewsModalOpen(true);
                  }}
                  idAccessor={(news) => news.id}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <UserModal isOpen={isUserModalOpen} onClose={() => setIsUserModalOpen(false)} user={selectedItem as User} />
      <EventModal isOpen={isEventModalOpen} onClose={() => setIsEventModalOpen(false)} event={selectedItem as Event} />
      <NewsModal isOpen={isNewsModalOpen} onClose={() => setIsNewsModalOpen(false)} news={selectedItem as News} />
    </div>
  )
}
