"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin } from "lucide-react"

// Mock data for events
const mockEvents = [
  {
    id: 1,
    title: "Summer Music Festival",
    date: "2025-07-15",
    location: "Sunset Park",
    description: "A three-day music extravaganza featuring top artists across various genres.",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 2,
    title: "Tech Innovation Summit",
    date: "2025-09-22",
    location: "Downtown Convention Center",
    description: "Explore the future of technology with industry leaders and innovators.",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 3,
    title: "Community Volunteer Day",
    date: "2025-08-05",
    location: "City Park",
    description: "Join your neighbors in beautifying our local parks and community spaces.",
    image: "/placeholder.svg?height=100&width=100",
  },
]

export default function MyEventsPage() {
  const [signedUpEvents, setSignedUpEvents] = useState(mockEvents.slice(0, 2))
  const [interestedEvents, setInterestedEvents] = useState(mockEvents.slice(2))

  const EventCard = ({ event, isSignedUp }: { event: (typeof mockEvents)[0]; isSignedUp: boolean }) => (
    <Card key={event.id} className="mb-4">
      <CardContent className="flex items-start p-4">
        <img
          src={event.image || "/placeholder.svg"}
          alt={event.title}
          className="w-24 h-24 object-cover rounded-md mr-4"
        />
        <div className="flex-grow">
          <CardTitle className="text-xl mb-2">{event.title}</CardTitle>
          <CardDescription className="mb-2">{event.description}</CardDescription>
          <div className="flex items-center text-sm text-muted-foreground mb-1">
            <Calendar className="w-4 h-4 mr-1" />
            {new Date(event.date).toLocaleDateString()}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 mr-1" />
            {event.location}
          </div>
        </div>
        <div className="ml-4">
          {isSignedUp ? (
            <Button variant="outline" size="sm">
              Cancel
            </Button>
          ) : (
            <Button variant="outline" size="sm">
              Sign Up
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">My Events</h1>
        <Tabs defaultValue="signed-up" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="signed-up">Signed Up</TabsTrigger>
            <TabsTrigger value="interested">Interested</TabsTrigger>
          </TabsList>
          <TabsContent value="signed-up">
            {signedUpEvents.map((event) => (
              <EventCard key={event.id} event={event} isSignedUp={true} />
            ))}
          </TabsContent>
          <TabsContent value="interested">
            {interestedEvents.map((event) => (
              <EventCard key={event.id} event={event} isSignedUp={false} />
            ))}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

