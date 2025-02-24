"use client"

import { Badge } from "@/components/ui/badge"
import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TagManager } from "@/components/tag-manager"
import { toast, Toaster } from "react-hot-toast"
import { Loader2 } from "lucide-react"
import { getSession } from "next-auth/react"
import { PREDEFINED_INTERESTS } from "@/lib/constant"
import { Skeleton } from "@/components/ui/skeleton"

interface User {
  id: string
  name: string
  email: string
  age: number | null
  gender: string | null
  interests: string[]
  introduction: string | null
  image: string | null
}

export default function PersonalInfoPage() {
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const session = await getSession()
        if (!session?.user?.email) {
          setError("Please sign in to view your profile")
          setIsLoading(false)
          return
        }

        const res = await fetch(`/api/user?email=${session.user.email}`)
        if (!res.ok) {
          throw new Error(await res.text())
        }

        const data = await res.json()
        setUser(data)
      } catch (error) {
        console.error("Error fetching user:", error)
        setError("Failed to load user data")
        toast.error("Error loading profile")
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()
  }, [])

  const handleEdit = () => setIsEditing(true)

  const handleCancel = () => {
    setIsEditing(false)
    // Reset any unsaved changes
    const fetchUser = async () => {
      const session = await getSession()
      if (!session?.user?.email) return

      const res = await fetch(`/api/user?email=${session.user.email}`)
      if (res.ok) {
        const data = await res.json()
        setUser(data)
      }
    }
    fetchUser()
  }

  const handleSave = async () => {
    if (!user) return

    setIsSaving(true)
    try {
      const response = await fetch("/api/user/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success("Profile updated successfully!")
        setIsEditing(false)
      } else {
        throw new Error(data.error || "Failed to update profile")
      }
    } catch (error) {
      console.error("Error saving profile:", error)
      toast.error(error instanceof Error ? error.message : "An error occurred while saving")
    } finally {
      setIsSaving(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setUser((prev) => (prev ? { ...prev, [name]: value } : null))
  }

  const handleGenderChange = (value: string) => {
    setUser((prev) => (prev ? { ...prev, gender: value } : null))
  }

  const handleAddTag = (field: keyof User) => (tag: string) => {
    setUser((prev) => {
      if (!prev) return null
      const currentTags = prev[field] as string[]
      if (!currentTags?.includes(tag)) {
        return { ...prev, [field]: [...(currentTags || []), tag] }
      }
      return prev
    })
  }

  const handleRemoveTag = (field: keyof User) => (tag: string) => {
    setUser((prev) => {
      if (!prev) return null
      const currentTags = prev[field] as string[]
      return { ...prev, [field]: currentTags.filter((t) => t !== tag) }
    })
  }

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow container mx-auto px-4 py-8">
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-48" />
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i}>
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-8 w-full" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow container mx-auto px-4 py-8">
          <Card>
            <CardContent className="flex items-center justify-center p-6">
              <p className="text-destructive">{error}</p>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <Label htmlFor="name">Name</Label>
                {isEditing ? (
                  <Input id="name" name="name" value={user.name} onChange={handleChange} className="mt-1" />
                ) : (
                  <p className="mt-1">{user.name}</p>
                )}
              </div>
              <div>
                <Label htmlFor="age">Age</Label>
                {isEditing ? (
                  <Input
                    id="age"
                    name="age"
                    type="number"
                    value={user.age || ""}
                    onChange={handleChange}
                    className="mt-1"
                  />
                ) : (
                  <p className="mt-1">{user.age || "Not specified"}</p>
                )}
              </div>
              <div>
                <Label htmlFor="gender">Gender</Label>
                {isEditing ? (
                  <Select onValueChange={handleGenderChange} value={user.gender || undefined}>
                    <SelectTrigger className="w-full mt-1">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="mt-1">{user.gender || "Not specified"}</p>
                )}
              </div>
              <div>
                <Label htmlFor="interests">Interests</Label>
                {isEditing ? (
                  <TagManager
                    tags={user.interests || []}
                    onAddTag={handleAddTag("interests")}
                    onRemoveTag={handleRemoveTag("interests")}
                    predefinedOptions={PREDEFINED_INTERESTS}
                    placeholder="Add interest"
                  />
                ) : (
                  <div className="flex flex-wrap gap-2 mt-1">
                    {user.interests?.map((interest) => (
                      <Badge key={interest} variant="secondary">
                        {interest}
                      </Badge>
                    ))}
                    {user.interests?.length === 0 && <p className="text-muted-foreground">No interests specified</p>}
                  </div>
                )}
              </div>
              <div>
                <Label htmlFor="introduction">Introduction</Label>
                {isEditing ? (
                  <Textarea
                    id="introduction"
                    name="introduction"
                    value={user.introduction || ""}
                    onChange={handleChange}
                    className="mt-1"
                  />
                ) : (
                  <p className="mt-1">{user.introduction || "No introduction provided"}</p>
                )}
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                {isEditing ? (
                  <>
                    <Button onClick={handleSave} disabled={isSaving}>
                      {isSaving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save"
                      )}
                    </Button>
                    <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button onClick={handleEdit}>Edit</Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
      <Toaster position="bottom-right" />
    </div>
  )
}

