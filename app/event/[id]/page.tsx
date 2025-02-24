"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Calendar, MapPin, Users, Clock, DollarSign, Star, Loader2 } from "lucide-react"
import { EventStatus } from "@prisma/client"
import { useToast } from "@/components/ui/use-toast"

function EventDetails({ event }: { event: any }) {
  const [isStarred, setIsStarred] = useState(false)
  const [isStarring, setIsStarring] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const checkStarredStatus = async () => {
      try {
        const response = await fetch(`/api/events/${event.id}/star`)
        if (response.ok) {
          const data = await response.json()
          setIsStarred(data.isStarred)
        }
      } catch (error) {
        console.error("Failed to fetch starred status:", error)
      }
    }
    checkStarredStatus()
  }, [event.id])

  const handleStar = async () => {
    setIsStarring(true)
    try {
      const response = await fetch(`/api/events/${event.id}/star`, {
        method: "POST",
      })
      if (!response.ok) throw new Error("Failed to star event")
      const data = await response.json()
      setIsStarred(data.isStarred)
      toast({
        title: "Success",
        description: data.isStarred ? "Event added to favorites." : "Event removed from favorites.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update favorite status. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsStarring(false)
    }
  }

  const handleRegister = async () => {
    setIsRegistering(true)
    try {
      const response = await fetch(`/api/events/${event.id}/signup`, {
        method: "POST",
      })
      if (!response.ok) throw new Error("Failed to register")
      const data = await response.json()
      toast({
        title: "Success",
        description: data.message,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to register for the event. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsRegistering(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="relative h-[300px] w-full rounded-xl overflow-hidden">
        <Image
          src={event.image || "/placeholder.svg?height=600&width=1200"}
          alt={event.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex items-center gap-2">
        <h1 className="text-3xl font-bold">{event.title}</h1>
        <Button
          size="icon"
          variant={isStarred ? "default" : "outline"}
          onClick={handleStar}
          className="h-8 w-8"
          disabled={isStarring}
        >
          {isStarring ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Star className={`h-5 w-5 ${isStarred ? "fill-current" : ""}`} />
          )}
        </Button>
      </div>
      <div className="flex flex-wrap gap-4">
        <Badge variant="secondary" className="flex items-center">
          <Calendar className="mr-1 h-4 w-4" />
          {new Date(event.startDate).toLocaleDateString()}
        </Badge>
        <Badge variant="secondary" className="flex items-center">
          <Clock className="mr-1 h-4 w-4" />
          {new Date(event.startDate).toLocaleTimeString()} - {new Date(event.endDate).toLocaleTimeString()}
        </Badge>
        <Badge variant="secondary" className="flex items-center">
          <MapPin className="mr-1 h-4 w-4" />
          {event.location}
        </Badge>
        <Badge variant="secondary" className="flex items-center">
          <Users className="mr-1 h-4 w-4" />
          Capacity: {event.capacity}
        </Badge>
        <Badge variant="secondary" className="flex items-center">
          <DollarSign className="mr-1 h-4 w-4" />
          {event.price ? `$${event.price.toFixed(2)}` : "Free"}
        </Badge>
      </div>
      <p className="text-lg">{event.description}</p>
      <Button size="lg" onClick={handleRegister} disabled={event.status !== EventStatus.UPCOMING || isRegistering}>
        {isRegistering ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Registering...
          </>
        ) : event.status === EventStatus.UPCOMING ? (
          "Register for Event"
        ) : (
          "Registration Closed"
        )}
      </Button>

      {event.priceSchemes && event.priceSchemes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Price Schemes</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {event.priceSchemes.map((scheme: any) => (
                <li key={scheme.id} className="flex justify-between items-center">
                  <span>{scheme.name}</span>
                  <span className="font-semibold">${scheme.price.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default function EventPage({ params }: { params: { id: string } }) {
  const [event, setEvent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`/api/events/${params.id}`, { cache: "no-store" })
        if (!res.ok) {
          if (res.status === 404) {
            router.push("/404")
            return
          }
          throw new Error("Failed to fetch event")
        }
        const data = await res.json()
        setEvent(data)
      } catch (err) {
        console.error("Error fetching event:", err)
        setError("Failed to load event. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchEvent()
  }, [params.id, router])

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow container mx-auto px-4 py-8">
          <Skeleton className="h-[300px] w-full rounded-xl mb-4" />
          <Skeleton className="h-8 w-3/4 mb-4" />
          <Skeleton className="h-4 w-1/2 mb-2" />
          <Skeleton className="h-4 w-full mb-4" />
          <Skeleton className="h-10 w-32" />
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow container mx-auto px-4 py-8">
          <p className="text-red-500">{error}</p>
        </main>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow container mx-auto px-4 py-8">{event && <EventDetails event={event} />}</main>
      <footer className="bg-primary text-primary-foreground py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 Event Showcase. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

