"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { MapPin, Users, Loader2, Clock, Tag, AlertCircle } from "lucide-react"
import { toast, Toaster } from "react-hot-toast"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"
import { useInfiniteQuery, useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import type { Event } from "@prisma/client"
import { EventStatus } from "@prisma/client"

// Extend dayjs with plugins
dayjs.extend(utc)
dayjs.extend(timezone)

// Set the default timezone to Hong Kong
dayjs.tz.setDefault("Asia/Hong_Kong")

// API functions
const fetchEvents = async ({ pageParam = 1 }) => {
  const response = await fetch(`/api/events?page=${pageParam}&limit=10`)
  if (!response.ok) {
    throw new Error("Network response was not ok")
  }
  return response.json()
}

const signUpForEvent = async (eventId: string) => {
  const response = await fetch(`/api/events/${eventId}/signup`, { method: "POST" })
  if (!response.ok) {
    throw new Error("Failed to sign up for event")
  }
  return response.json()
}

const fetchUserEvents = async () => {
  const response = await fetch("/api/user/events")
  if (!response.ok) {
    throw new Error("Failed to fetch user events")
  }
  return response.json()
}

// Helper functions
const groupEventsByMonth = (events: Event[] | undefined) => {
  if (!events || events.length === 0) {
    return {}
  }

  return events.reduce((acc: Record<string, Event[]>, event) => {
    if (!event) {
      return acc
    }

    const month = event.startDate ? dayjs(event.startDate).format("MMMM YYYY") : "Unknown Date"

    if (!acc[month]) {
      acc[month] = []
    }
    acc[month].push(event)
    return acc
  }, {})
}

const formatEventTime = (startDate: string | Date | null, endDate: string | Date | null) => {
  if (!startDate || !endDate) {
    return "Date and time not specified"
  }

  const start = dayjs(startDate).tz()
  const end = dayjs(endDate).tz()

  if (!start.isValid() || !end.isValid()) {
    return "Invalid date"
  }

  if (start.isSame(end, "day")) {
    return `${start.format("YYYY/MM/DD HH:mm")} ~ ${end.format("HH:mm")}`
  } else {
    return `${start.format("YYYY/MM/DD HH:mm")} ~ ${end.format("YYYY/MM/DD HH:mm")}`
  }
}

export default function EventsPage() {
  const [openAccordions, setOpenAccordions] = useState<string[]>([])
  const queryClient = useQueryClient()

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status, isLoading, isRefetching } = useInfiniteQuery({
    queryKey: ["events"],
    queryFn: fetchEvents,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.currentPage < lastPage.totalPages ? lastPage.currentPage + 1 : undefined
    },
  })

  const { data: userEvents } = useQuery({
    queryKey: ["userEvents"],
    queryFn: fetchUserEvents,
  })

  const signUpMutation = useMutation({
    mutationFn: signUpForEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userEvents"] })
    },
  })

  const handleSignUp = async (eventId: string) => {
    try {
      await signUpMutation.mutateAsync(eventId)
      toast.success("Successfully signed up for event")
    } catch (error) {
      toast.error("Failed to sign up for event")
    }
  }

  const toggleAccordion = (month: string) => {
    setOpenAccordions((prev) => (prev.includes(month) ? prev.filter((m) => m !== month) : [...prev, month]))
  }

  if (isLoading || isRefetching) {
    return (
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading events...</span>
        </div>
      </main>
    )
  }

  if (status === "error") {
    return (
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <AlertCircle className="h-8 w-8 text-red-500" />
          <span className="ml-2 text-red-500">Error fetching events</span>
        </div>
      </main>
    )
  }

  const allEvents = data?.pages.flatMap((page) => page.items) || []
  const eventsByMonth = groupEventsByMonth(allEvents)
  const months = Object.keys(eventsByMonth)

  if (months.length === 0) {
    return (
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Upcoming Events</h1>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
            <h2 className="mt-2 text-lg font-medium text-gray-900">No events found</h2>
            <p className="mt-1 text-sm text-gray-500">There are currently no upcoming events.</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Upcoming Events</h1>

        <Accordion type="multiple" value={openAccordions} onValueChange={setOpenAccordions}>
          {months.map((month) => (
            <AccordionItem key={month} value={month}>
              <AccordionTrigger onClick={() => toggleAccordion(month)}>{month}</AccordionTrigger>
              <AccordionContent>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {eventsByMonth[month].map((event: Event) => (
                    <Card key={event.id} className="relative flex flex-col">
                      {event.image && (
                        <Image
                          src={event.image || "/placeholder.svg"}
                          alt={event.title}
                          width={600}
                          height={400}
                          className="w-full h-48 object-cover"
                        />
                      )}
                      <CardHeader>
                        <CardTitle>{event.title}</CardTitle>
                        <CardDescription>
                          <div className="flex items-center mt-1">
                            <Clock className="w-4 h-4 mr-1" />
                            {formatEventTime(event.startDate, event.endDate)}
                          </div>
                          <div className="flex items-center mt-1">
                            <MapPin className="w-4 h-4 mr-1" />
                            {event.location || "Location not specified"}
                          </div>
                          <div className="flex items-center mt-1">
                            <Users className="w-4 h-4 mr-1" />
                            Capacity: {event.capacity || "Not specified"}
                          </div>
                          {event.category && (
                            <div className="flex items-center mt-1">
                              <Tag className="w-4 h-4 mr-1" />
                              {event.category}
                            </div>
                          )}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p>{event.description || "No description available"}</p>
                      </CardContent>
                      <CardFooter className="mt-auto">
                        <div className="flex justify-between w-full">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline">Learn More</Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                              <DialogHeader>
                                <DialogTitle>{event.title}</DialogTitle>
                                <DialogDescription>
                                  {formatEventTime(event.startDate, event.endDate)} |{" "}
                                  {event.location || "Location not specified"}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="mt-4">
                                {event.image && (
                                  <Image
                                    src={event.image || "/placeholder.svg"}
                                    alt={event.title}
                                    width={600}
                                    height={400}
                                    className="w-full h-48 object-cover rounded-md mb-2"
                                  />
                                )}
                                <p className="mt-4">{event.description || "No description available"}</p>
                                <p className="mt-2 font-semibold">Capacity: {event.capacity || "Not specified"}</p>
                                <p className="mt-2">Status: {event.status || "Status not specified"}</p>
                                {event.category && <p className="mt-2">Category: {event.category}</p>}
                              </div>
                              <DialogFooter className="mt-4">
                                <Button
                                  className="w-full"
                                  onClick={() => handleSignUp(event.id)}
                                  disabled={
                                    userEvents?.signedUpEvents.includes(event.id) ||
                                    signUpMutation.isPending ||
                                    event.status !== EventStatus.UPCOMING
                                  }
                                >
                                  {signUpMutation.isPending ? (
                                    <>
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                      Signing Up...
                                    </>
                                  ) : userEvents?.signedUpEvents.includes(event.id) ? (
                                    "Signed Up"
                                  ) : event.status !== EventStatus.UPCOMING ? (
                                    "Not Available"
                                  ) : (
                                    "Sign Up"
                                  )}
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                          <Button
                            onClick={() => handleSignUp(event.id)}
                            disabled={
                              userEvents?.signedUpEvents.includes(event.id) ||
                              signUpMutation.isPending ||
                              event.status !== EventStatus.UPCOMING
                            }
                          >
                            {signUpMutation.isPending ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Signing Up...
                              </>
                            ) : userEvents?.signedUpEvents.includes(event.id) ? (
                              "Signed Up"
                            ) : event.status !== EventStatus.UPCOMING ? (
                              "Not Available"
                            ) : (
                              "Sign Up"
                            )}
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {hasNextPage && (
          <div className="mt-8 text-center">
            <Button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
              {isFetchingNextPage ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading more...
                </>
              ) : (
                "Load More"
              )}
            </Button>
          </div>
        )}
      </main>

      <footer className="bg-primary text-primary-foreground py-6">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 Event Showcase. All rights reserved.</p>
        </div>
      </footer>
      <Toaster position="bottom-right" />
    </div>
  )
}

