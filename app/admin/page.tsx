"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Pencil, Trash2, Calendar, Star, Loader2 } from "lucide-react"
import { toast, Toaster } from "react-hot-toast"
import { TagManager } from "@/components/tag-manager"
import { ConfirmDeleteAlert } from "@/components/confirm-delete-alert"

// Simulated user session check
const useSimulatedSession = () => {
  const [session, setSession] = useState(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setSession({
        user: {
          id: 1,
          name: "Admin User",
          email: "admin@example.com",
        },
        expires: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      })
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  return session
}

// Dummy data for users, events, and news
const initialUsers = [
  {
    id: 1,
    email: "john@example.com",
    name: "John Doe",
    birthYear: 1990,
    age: 33,
    height: 180,
    weight: 75,
    selfIntro: ["Friendly", "Outgoing"],
    interests: ["Reading", "Hiking"],
    description: "I love outdoor activities and meeting new people.",
    expectationForBetterHalf: ["Kind", "Adventurous"],
    signedUpEvents: [1],
    starredEvents: [2],
  },
  {
    id: 2,
    email: "jane@example.com",
    name: "Jane Smith",
    birthYear: 1992,
    age: 31,
    height: 165,
    weight: 60,
    selfIntro: ["Creative", "Ambitious"],
    interests: ["Painting", "Traveling"],
    description: "Art enthusiast with a passion for exploring new cultures.",
    expectationForBetterHalf: ["Supportive", "Open-minded"],
    signedUpEvents: [2],
    starredEvents: [1],
  },
]

const initialEvents = [
  {
    id: 1,
    title: "Summer Music Festival",
    description: "Enjoy live music under the stars",
    posterImageUrl: "/placeholder.svg?height=400&width=600",
    price: 25.0,
    startTime: "2025-07-15T18:00:00Z",
    endTime: "2025-07-15T23:00:00Z",
    location: "Sunset Park",
  },
  {
    id: 2,
    title: "Tech Innovation Summit",
    description: "Learn about the latest in technology",
    posterImageUrl: "/placeholder.svg?height=400&width=600",
    price: 199.99,
    startTime: "2025-09-22T09:00:00Z",
    endTime: "2025-09-22T17:00:00Z",
    location: "Downtown Convention Center",
  },
]

const initialNews = [
  {
    id: 1,
    title: "New Venue Announced for Upcoming Concert Series",
    content:
      "We are excited to announce that the upcoming summer concert series will be held at the newly renovated Riverside Amphitheater.",
    thumbnailImageUrl: "/placeholder.svg?height=100&width=100",
    publishedAt: "2025-05-01T12:00:00Z",
    authorId: 1,
  },
  {
    id: 2,
    title: "Local Artist to Headline Community Festival",
    content:
      "Rising star and hometown hero, Sarah Johnson, has been announced as the headlining act for this year's Community Festival.",
    thumbnailImageUrl: "/placeholder.svg?height=100&width=100",
    publishedAt: "2025-05-15T14:30:00Z",
    authorId: 2,
  },
]

const PREDEFINED_INTERESTS = [
  "Reading",
  "Traveling",
  "Cooking",
  "Sports",
  "Music",
  "Movies",
  "Art",
  "Photography",
  "Dancing",
  "Hiking",
]

const PREDEFINED_SELF_INTRO = [
  "Friendly",
  "Outgoing",
  "Creative",
  "Ambitious",
  "Adventurous",
  "Intellectual",
  "Romantic",
  "Practical",
]

const PREDEFINED_EXPECTATIONS = [
  "Kind",
  "Supportive",
  "Honest",
  "Ambitious",
  "Family-oriented",
  "Adventurous",
  "Intellectual",
  "Romantic",
]

export default function AdminDashboard() {
  const [users, setUsers] = useState(initialUsers)
  const [events, setEvents] = useState(initialEvents)
  const [news, setNews] = useState(initialNews)
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add")
  const [activeTab, setActiveTab] = useState("users")
  const [isViewingEvents, setIsViewingEvents] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const session = useSimulatedSession()

  const [errors, setErrors] = useState<Record<string, string>>({})

  const [deleteItem, setDeleteItem] = useState<{ id: number; type: "user" | "event" | "news" } | null>(null)

  const handleAdd = (type: "user" | "event" | "news") => {
    setSelectedItem(
      type === "user"
        ? {
            type: "user",
            email: "",
            name: "",
            birthYear: "",
            age: "",
            height: "",
            weight: "",
            selfIntro: [],
            interests: [],
            description: "",
            expectationForBetterHalf: [],
            signedUpEvents: [],
            starredEvents: [],
          }
        : type === "event"
          ? {
              type: "event",
              title: "",
              description: "",
              posterImageUrl: "",
              price: "",
              startTime: "",
              endTime: "",
              location: "",
            }
          : {
              type: "news",
              title: "",
              content: "",
              thumbnailImageUrl: "",
              publishedAt: "",
              authorId: "",
            },
    )
    setDialogMode("add")
    setIsDialogOpen(true)
  }

  const handleEdit = (item: any, type: "user" | "event" | "news") => {
    setSelectedItem({ ...item, type })
    setDialogMode("edit")
    setIsDialogOpen(true)
  }

  const handleDelete = (id: number, type: "user" | "event" | "news") => {
    setDeleteItem({ id, type })
  }

  const confirmDelete = async () => {
    if (!deleteItem) return

    const { id, type } = deleteItem

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    if (type === "user") {
      setUsers(users.filter((user) => user.id !== id))
    } else if (type === "event") {
      setEvents(events.filter((event) => event.id !== id))
    } else {
      setNews(news.filter((newsItem) => newsItem.id !== id))
    }
    toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully`)
    setDeleteItem(null)
  }

  const validateForm = (item: any): boolean => {
    const newErrors: Record<string, string> = {}

    if (item.type === "user") {
      if (!item.name) newErrors.name = "Name is required"
      if (!item.email) newErrors.email = "Email is required"
      if (!item.birthYear) newErrors.birthYear = "Birth year is required"
      if (!item.age) newErrors.age = "Age is required"
      if (!item.height) newErrors.height = "Height is required"
      if (!item.weight) newErrors.weight = "Weight is required"
      if (item.selfIntro.length === 0) newErrors.selfIntro = "At least one self introduction tag is required"
      if (item.interests.length === 0) newErrors.interests = "At least one interest is required"
      if (!item.description) newErrors.description = "Description is required"
      if (item.expectationForBetterHalf.length === 0)
        newErrors.expectationForBetterHalf = "At least one expectation is required"
    } else if (item.type === "event") {
      if (!item.title) newErrors.title = "Title is required"
      if (!item.description) newErrors.description = "Description is required"
      if (!item.posterImageUrl) newErrors.posterImageUrl = "Poster image URL is required"
      if (!item.price) newErrors.price = "Price is required"
      if (!item.startTime) newErrors.startTime = "Start time is required"
      if (!item.endTime) newErrors.endTime = "End time is required"
      if (!item.location) newErrors.location = "Location is required"
    } else if (item.type === "news") {
      if (!item.title) newErrors.title = "Title is required"
      if (!item.content) newErrors.content = "Content is required"
      if (!item.thumbnailImageUrl) newErrors.thumbnailImageUrl = "Thumbnail image URL is required"
      if (!item.publishedAt) newErrors.publishedAt = "Published date is required"
      if (!item.authorId) newErrors.authorId = "Author ID is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async (item: any) => {
    if (!validateForm(item)) {
      toast.error("Please fill in all required fields")
      return
    }

    setIsSaving(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      if (item.type === "user") {
        if (dialogMode === "add") {
          setUsers([...users, { ...item, id: users.length + 1 }])
        } else {
          setUsers(users.map((user) => (user.id === item.id ? { ...item } : user)))
        }
      } else if (item.type === "event") {
        if (dialogMode === "add") {
          setEvents([...events, { ...item, id: events.length + 1 }])
        } else {
          setEvents(events.map((event) => (event.id === item.id ? { ...item } : event)))
        }
      } else if (item.type === "news") {
        if (dialogMode === "add") {
          setNews([...news, { ...item, id: news.length + 1 }])
        } else {
          setNews(news.map((newsItem) => (newsItem.id === item.id ? { ...item } : newsItem)))
        }
      }
      setIsDialogOpen(false)
      toast.success(
        `${item.type.charAt(0).toUpperCase() + item.type.slice(1)} ${dialogMode === "add" ? "added" : "updated"} successfully`,
      )
    } catch (error) {
      toast.error(`Failed to ${dialogMode === "add" ? "add" : "update"} ${item.type}`)
    } finally {
      setIsSaving(false)
    }
  }

  const handleViewEvents = (userId: number, eventType: "signedUp" | "starred") => {
    const user = users.find((u) => u.id === userId)
    if (user) {
      setSelectedItem({
        ...user,
        type: "userEvents",
        eventType,
        events: eventType === "signedUp" ? user.signedUpEvents : user.starredEvents,
      })
      setIsViewingEvents(true)
    }
  }

  const handleAddTag = (field: "selfIntro" | "interests" | "expectationForBetterHalf") => (tag: string) => {
    if (tag && selectedItem && selectedItem[field] && !selectedItem[field].includes(tag)) {
      setSelectedItem({ ...selectedItem, [field]: [...selectedItem[field], tag] })
    }
  }

  const handleRemoveTag = (field: "selfIntro" | "interests" | "expectationForBetterHalf") => (tag: string) => {
    if (selectedItem && selectedItem[field]) {
      setSelectedItem({ ...selectedItem, [field]: selectedItem[field].filter((t: string) => t !== tag) })
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setSelectedItem((prev) => ({ ...prev, [name]: value }))
  }

  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSelectedItem((prev) => ({ ...prev, [name]: value === "" ? "" : Number(value) }))
  }

  const handleSelectChange = (name: string) => (value: string) => {
    setSelectedItem((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        <Tabs defaultValue="users" onValueChange={(value) => setActiveTab(value)}>
          <TabsList>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="news">News</TabsTrigger>
          </TabsList>
          {/* Users Tab Content */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Manage Users</CardTitle>
                <CardDescription>Add, edit, or delete users</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Age</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.age}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(user, "user")}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(user.id, "user")}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleViewEvents(user.id, "signedUp")}>
                            <Calendar className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleViewEvents(user.id, "starred")}>
                            <Star className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter>
                <Button onClick={() => handleAdd("user")}>Add New User</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Events Tab Content */}
          <TabsContent value="events">
            <Card>
              <CardHeader>
                <CardTitle>Manage Events</CardTitle>
                <CardDescription>Add, edit, or delete events</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Start Time</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {events.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell>{event.title}</TableCell>
                        <TableCell>{new Date(event.startTime).toLocaleString()}</TableCell>
                        <TableCell>{event.location}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(event, "event")}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(event.id, "event")}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter>
                <Button onClick={() => handleAdd("event")}>Add New Event</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* News Tab Content */}
          <TabsContent value="news">
            <Card>
              <CardHeader>
                <CardTitle>Manage News</CardTitle>
                <CardDescription>Add, edit, or delete news articles</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Published At</TableHead>
                      <TableHead>Author ID</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {news.map((newsItem) => (
                      <TableRow key={newsItem.id}>
                        <TableCell>{newsItem.title}</TableCell>
                        <TableCell>{new Date(newsItem.publishedAt).toLocaleString()}</TableCell>
                        <TableCell>{newsItem.authorId}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(newsItem, "news")}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(newsItem.id, "news")}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter>
                <Button onClick={() => handleAdd("news")}>Add New News Article</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Toaster position="bottom-right" />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === "add" ? "Add" : "Edit"}{" "}
              {selectedItem?.type?.charAt(0).toUpperCase() + selectedItem?.type?.slice(1)}
            </DialogTitle>
            <DialogDescription>
              Fill in the details below to {dialogMode === "add" ? "add a new" : "edit the"} {selectedItem?.type}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {selectedItem?.type === "user" && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <div className="col-span-3">
                    <Input
                      id="name"
                      name="name"
                      value={selectedItem?.name}
                      onChange={handleInputChange}
                      className={errors.name ? "border-red-500" : ""}
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <div className="col-span-3">
                    <Input
                      id="email"
                      name="email"
                      value={selectedItem?.email}
                      onChange={handleInputChange}
                      className={errors.email ? "border-red-500" : ""}
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="birthYear" className="text-right">
                    Birth Year
                  </Label>
                  <div className="col-span-3">
                    <Input
                      id="birthYear"
                      name="birthYear"
                      type="number"
                      value={selectedItem?.birthYear}
                      onChange={handleNumberInputChange}
                      className={errors.birthYear ? "border-red-500" : ""}
                    />
                    {errors.birthYear && <p className="text-red-500 text-sm mt-1">{errors.birthYear}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="age" className="text-right">
                    Age
                  </Label>
                  <div className="col-span-3">
                    <Input
                      id="age"
                      name="age"
                      type="number"
                      value={selectedItem?.age}
                      onChange={handleNumberInputChange}
                      className={errors.age ? "border-red-500" : ""}
                    />
                    {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="height" className="text-right">
                    Height (cm)
                  </Label>
                  <div className="col-span-3">
                    <Input
                      id="height"
                      name="height"
                      type="number"
                      value={selectedItem?.height}
                      onChange={handleNumberInputChange}
                      className={errors.height ? "border-red-500" : ""}
                    />
                    {errors.height && <p className="text-red-500 text-sm mt-1">{errors.height}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="weight" className="text-right">
                    Weight (kg)
                  </Label>
                  <div className="col-span-3">
                    <Input
                      id="weight"
                      name="weight"
                      type="number"
                      value={selectedItem?.weight}
                      onChange={handleNumberInputChange}
                      className={errors.weight ? "border-red-500" : ""}
                    />
                    {errors.weight && <p className="text-red-500 text-sm mt-1">{errors.weight}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="selfIntro" className="text-right">
                    Self Introduction
                  </Label>
                  <div className="col-span-3">
                    <TagManager
                      tags={selectedItem.selfIntro || []}
                      onAddTag={handleAddTag("selfIntro")}
                      onRemoveTag={handleRemoveTag("selfIntro")}
                      predefinedOptions={PREDEFINED_SELF_INTRO}
                      placeholder="Add self introduction tag"
                      error={errors.selfIntro}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="interests" className="text-right">
                    Interests
                  </Label>
                  <div className="col-span-3">
                    <TagManager
                      tags={selectedItem.interests || []}
                      onAddTag={handleAddTag("interests")}
                      onRemoveTag={handleRemoveTag("interests")}
                      predefinedOptions={PREDEFINED_INTERESTS}
                      placeholder="Add interest"
                      error={errors.interests}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="expectationForBetterHalf" className="text-right">
                    Expectations for Better Half
                  </Label>
                  <div className="col-span-3">
                    <TagManager
                      tags={selectedItem.expectationForBetterHalf || []}
                      onAddTag={handleAddTag("expectationForBetterHalf")}
                      onRemoveTag={handleRemoveTag("expectationForBetterHalf")}
                      predefinedOptions={PREDEFINED_EXPECTATIONS}
                      placeholder="Add expectation"
                      error={errors.expectationForBetterHalf}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <div className="col-span-3">
                    <Textarea
                      id="description"
                      name="description"
                      value={selectedItem?.description}
                      onChange={handleInputChange}
                      className={errors.description ? "border-red-500" : ""}
                    />
                    {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                  </div>
                </div>
              </>
            )}
            {selectedItem?.type === "event" && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">
                    Title
                  </Label>
                  <div className="col-span-3">
                    <Input
                      id="title"
                      name="title"
                      value={selectedItem?.title}
                      onChange={handleInputChange}
                      className={errors.title ? "border-red-500" : ""}
                    />
                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <div className="col-span-3">
                    <Textarea
                      id="description"
                      name="description"
                      value={selectedItem?.description}
                      onChange={handleInputChange}
                      className={errors.description ? "border-red-500" : ""}
                    />
                    {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="posterImageUrl" className="text-right">
                    Poster Image URL
                  </Label>
                  <div className="col-span-3">
                    <Input
                      id="posterImageUrl"
                      name="posterImageUrl"
                      value={selectedItem?.posterImageUrl}
                      onChange={handleInputChange}
                      className={errors.posterImageUrl ? "border-red-500" : ""}
                    />
                    {errors.posterImageUrl && <p className="text-red-500 text-sm mt-1">{errors.posterImageUrl}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="price" className="text-right">
                    Price
                  </Label>
                  <div className="col-span-3">
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      value={selectedItem?.price}
                      onChange={handleNumberInputChange}
                      className={errors.price ? "border-red-500" : ""}
                    />
                    {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="startTime" className="text-right">
                    Start Time
                  </Label>
                  <div className="col-span-3">
                    <Input
                      id="startTime"
                      name="startTime"
                      type="datetime-local"
                      value={selectedItem?.startTime}
                      onChange={handleInputChange}
                      className={errors.startTime ? "border-red-500" : ""}
                    />
                    {errors.startTime && <p className="text-red-500 text-sm mt-1">{errors.startTime}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="endTime" className="text-right">
                    End Time
                  </Label>
                  <div className="col-span-3">
                    <Input
                      id="endTime"
                      name="endTime"
                      type="datetime-local"
                      value={selectedItem?.endTime}
                      onChange={handleInputChange}
                      className={errors.endTime ? "border-red-500" : ""}
                    />
                    {errors.endTime && <p className="text-red-500 text-sm mt-1">{errors.endTime}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="location" className="text-right">
                    Location
                  </Label>
                  <div className="col-span-3">
                    <Input
                      id="location"
                      name="location"
                      value={selectedItem?.location}
                      onChange={handleInputChange}
                      className={errors.location ? "border-red-500" : ""}
                    />
                    {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                  </div>
                </div>
              </>
            )}
            {selectedItem?.type === "news" && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">
                    Title
                  </Label>
                  <div className="col-span-3">
                    <Input
                      id="title"
                      name="title"
                      value={selectedItem?.title}
                      onChange={handleInputChange}
                      className={errors.title ? "border-red-500" : ""}
                    />
                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="content" className="text-right">
                    Content
                  </Label>
                  <div className="col-span-3">
                    <Textarea
                      id="content"
                      name="content"
                      value={selectedItem?.content}
                      onChange={handleInputChange}
                      className={errors.content ? "border-red-500" : ""}
                    />
                    {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="thumbnailImageUrl" className="text-right">
                    Thumbnail Image URL
                  </Label>
                  <div className="col-span-3">
                    <Input
                      id="thumbnailImageUrl"
                      name="thumbnailImageUrl"
                      value={selectedItem?.thumbnailImageUrl}
                      onChange={handleInputChange}
                      className={errors.thumbnailImageUrl ? "border-red-500" : ""}
                    />
                    {errors.thumbnailImageUrl && (
                      <p className="text-red-500 text-sm mt-1">{errors.thumbnailImageUrl}</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="publishedAt" className="text-right">
                    Published At
                  </Label>
                  <div className="col-span-3">
                    <Input
                      id="publishedAt"
                      name="publishedAt"
                      type="datetime-local"
                      value={selectedItem?.publishedAt}
                      onChange={handleInputChange}
                      className={errors.publishedAt ? "border-red-500" : ""}
                    />
                    {errors.publishedAt && <p className="text-red-500 text-sm mt-1">{errors.publishedAt}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="authorId" className="text-right">
                    Author ID
                  </Label>
                  <div className="col-span-3">
                    <Input
                      id="authorId"
                      name="authorId"
                      type="number"
                      value={selectedItem?.authorId}
                      onChange={handleNumberInputChange}
                      className={errors.authorId ? "border-red-500" : ""}
                    />
                    {errors.authorId && <p className="text-red-500 text-sm mt-1">{errors.authorId}</p>}
                  </div>
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => handleSave(selectedItem)} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving
                </>
              ) : dialogMode === "add" ? (
                "Add"
              ) : (
                "Save"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isViewingEvents} onOpenChange={setIsViewingEvents}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedItem?.eventType === "signedUp" ? "Signed Up Events" : "Starred Events"} for {selectedItem?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event Title</TableHead>
                  <TableHead>Start Time</TableHead>
                  <TableHead>Location</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedItem?.events?.map((eventId: number) => {
                  const event = events.find((e) => e.id === eventId)
                  return event ? (
                    <TableRow key={event.id}>
                      <TableCell>{event.title}</TableCell>
                      <TableCell>{new Date(event.startTime).toLocaleString()}</TableCell>
                      <TableCell>{event.location}</TableCell>
                    </TableRow>
                  ) : null
                })}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmDeleteAlert
        isOpen={deleteItem !== null}
        onClose={() => setDeleteItem(null)}
        onConfirm={confirmDelete}
        itemType={deleteItem?.type || ""}
      />
    </div>
  )
}

