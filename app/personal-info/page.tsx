"use client"

import { Badge } from "@/components/ui/badge"

import type React from "react"

import { useState } from "react"
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

interface PersonalInfo {
  name: string
  age: string
  gender: string
  interests: string[]
  expectedPartner: string
  introduction: string
  selfIntro: string[]
  expectationForBetterHalf: string[]
}

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

export default function PersonalInfoPage() {
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    name: "John Doe",
    age: "30",
    gender: "Male",
    interests: ["Hiking", "Reading", "Cooking"],
    expectedPartner: "Someone who enjoys outdoor activities, values personal growth, and has a good sense of humor.",
    introduction:
      "I'm an adventurous person who loves to explore new places and try new things. I'm passionate about cooking and enjoy hosting dinner parties for my friends.",
    selfIntro: ["Friendly", "Outgoing"],
    expectationForBetterHalf: ["Kind", "Adventurous"],
  })

  const handleEdit = () => setIsEditing(true)
  const handleCancel = () => setIsEditing(false)
  const handleSave = async () => {
    setIsSaving(true)
    try {
      const response = await fetch("/api/update-personal-info", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(personalInfo),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success(data.message)
        setIsEditing(false)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error("An error occurred while saving")
    } finally {
      setIsSaving(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setPersonalInfo((prev) => ({ ...prev, [name]: value }))
  }

  const handleGenderChange = (value: string) => {
    setPersonalInfo((prev) => ({ ...prev, gender: value }))
  }

  const handleAddTag = (field: keyof PersonalInfo) => (tag: string) => {
    if (tag && !personalInfo[field].includes(tag)) {
      setPersonalInfo((prev) => ({ ...prev, [field]: [...prev[field], tag] }))
    }
  }

  const handleRemoveTag = (field: keyof PersonalInfo) => (tag: string) => {
    setPersonalInfo((prev) => ({ ...prev, [field]: prev[field].filter((t) => t !== tag) }))
  }

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
                {isEditing ? (
                  <Input id="name" name="name" value={personalInfo.name} onChange={handleChange} />
                ) : (
                  <p className="mt-1">{personalInfo.name}</p>
                )}
              </div>
              <div>
                <Label htmlFor="age">Age</Label>
                {isEditing ? (
                  <Input id="age" name="age" value={personalInfo.age} onChange={handleChange} />
                ) : (
                  <p className="mt-1">{personalInfo.age}</p>
                )}
              </div>
              <div>
                <Label htmlFor="gender">Gender</Label>
                {isEditing ? (
                  <Select onValueChange={handleGenderChange} defaultValue={personalInfo.gender}>
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
                  <p className="mt-1">{personalInfo.gender}</p>
                )}
              </div>
              <div>
                <Label htmlFor="selfIntro">Self Introduction</Label>
                {isEditing ? (
                  <TagManager
                    tags={personalInfo.selfIntro}
                    onAddTag={handleAddTag("selfIntro")}
                    onRemoveTag={handleRemoveTag("selfIntro")}
                    predefinedOptions={PREDEFINED_SELF_INTRO}
                    placeholder="Add self introduction tag"
                  />
                ) : (
                  <div className="flex flex-wrap gap-2 mt-1">
                    {personalInfo.selfIntro.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <Label htmlFor="interests">Interests</Label>
                {isEditing ? (
                  <TagManager
                    tags={personalInfo.interests}
                    onAddTag={handleAddTag("interests")}
                    onRemoveTag={handleRemoveTag("interests")}
                    predefinedOptions={PREDEFINED_INTERESTS}
                    placeholder="Add interest"
                  />
                ) : (
                  <div className="flex flex-wrap gap-2 mt-1">
                    {personalInfo.interests.map((interest) => (
                      <Badge key={interest} variant="secondary">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <Label htmlFor="expectationForBetterHalf">Expected Partner Type</Label>
                {isEditing ? (
                  <TagManager
                    tags={personalInfo.expectationForBetterHalf}
                    onAddTag={handleAddTag("expectationForBetterHalf")}
                    onRemoveTag={handleRemoveTag("expectationForBetterHalf")}
                    predefinedOptions={PREDEFINED_EXPECTATIONS}
                    placeholder="Add expectation"
                  />
                ) : (
                  <div className="flex flex-wrap gap-2 mt-1">
                    {personalInfo.expectationForBetterHalf.map((expectation) => (
                      <Badge key={expectation} variant="secondary">
                        {expectation}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <Label htmlFor="introduction">Self Introduction</Label>
                {isEditing ? (
                  <Textarea
                    id="introduction"
                    name="introduction"
                    value={personalInfo.introduction}
                    onChange={handleChange}
                  />
                ) : (
                  <p className="mt-1">{personalInfo.introduction}</p>
                )}
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                {isEditing ? (
                  <>
                    <Button onClick={handleSave} disabled={isSaving}>
                      {isSaving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving
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

