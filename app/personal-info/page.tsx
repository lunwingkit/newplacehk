"use client"

import { Badge } from "@/components/ui/badge"
import type React from "react"
import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
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

const PREDEFINED_INTERESTS = ["Reading", "Traveling", "Cooking", "Sports", "Music", "Movies", "Art", "Photography", "Dancing", "Hiking"]
const PREDEFINED_SELF_INTRO = ["Friendly", "Outgoing", "Creative", "Ambitious", "Adventurous", "Intellectual", "Romantic", "Practical"]
const PREDEFINED_EXPECTATIONS = ["Kind", "Supportive", "Honest", "Ambitious", "Family-oriented", "Adventurous", "Intellectual", "Romantic"]

export default function PersonalInfoPage() {
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [user, setUser] = useState<any>(null)

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      const session = await getSession()
      if (!session?.user?.email) return

      try {
        const res = await fetch(`/api/user?email=${session.user.email}`)
        if (res.ok) {
          const data = await res.json()
          setUser(data)
        } else {
          toast.error("Failed to load user data")
        }
      } catch (error) {
        toast.error("Error fetching user data")
      }
    }

    fetchUser()
  }, [])

  const handleEdit = () => setIsEditing(true)
  const handleCancel = () => setIsEditing(false)

  const handleSave = async () => {
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
        toast.error(data.message || "Error updating profile")
      }
    } catch (error) {
      toast.error("An error occurred while saving")
    } finally {
      setIsSaving(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setUser((prev: any) => ({ ...prev, [name]: value }))
  }

  const handleGenderChange = (value: string) => setUser((prev: any) => ({ ...prev, gender: value }))

  const handleAddTag = (field: string) => (tag: string) => {
    if (!user[field]?.includes(tag)) {
      setUser((prev: any) => ({ ...prev, [field]: [...(prev[field] || []), tag] }))
    }
  }

  const handleRemoveTag = (field: string) => (tag: string) => {
    setUser((prev: any) => ({ ...prev, [field]: prev[field].filter((t: string) => t !== tag) }))
  }

  if (!user) return <p>Loading...</p>

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <Label htmlFor="name">Name</Label>
                {isEditing ? <Input id="name" name="name" value={user.name} onChange={handleChange} /> : <p className="mt-1">{user.name}</p>}
              </div>
              <div>
                <Label htmlFor="age">Age</Label>
                {isEditing ? <Input id="age" name="age" value={user.age || ""} onChange={handleChange} /> : <p className="mt-1">{user.age}</p>}
              </div>
              <div>
                <Label htmlFor="gender">Gender</Label>
                {isEditing ? (
                  <Select onValueChange={handleGenderChange} defaultValue={user.gender}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="mt-1">{user.gender}</p>
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
                    {user.interests?.map((interest: string) => (
                      <Badge key={interest} variant="secondary">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <Label htmlFor="introduction">Introduction</Label>
                {isEditing ? (
                  <Textarea id="introduction" name="introduction" value={user.introduction || ""} onChange={handleChange} />
                ) : (
                  <p className="mt-1">{user.introduction}</p>
                )}
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                {isEditing ? (
                  <>
                    <Button onClick={handleSave} disabled={isSaving}>
                      {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Save"}
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
    </div>
  )
}
