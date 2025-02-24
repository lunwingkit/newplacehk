"use client"

import { useState, useEffect } from "react"
import { useInfiniteQuery } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, MapPin, Loader2, DollarSign, AlertCircle } from "lucide-react"
import { useInView } from "react-intersection-observer"
import { Badge } from "@/components/ui/badge"
import type { EventStatus, SignUpStatus } from "@prisma/client"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

type Event = {
  id: string
  title: string
  description: string
  startDate: string
  endDate: string
  location: string
  image: string | null
  capacity: number
  category: string | null
  status: EventStatus
  signUpStatus?: SignUpStatus
  priceScheme?: {
    name: string
    price: number
  }
}

const fetchEvents = async (type: "signed-up" | "starred", page: number) => {
  const res = await fetch(`/api/user/events/${type}?page=${page}`)
  if (!res.ok) {
    const errorData = await res.json()
    throw new Error(errorData.message || "Failed to fetch events")
  }
  return res.json()
}

const EventCard = ({ event, isSignedUp }: { event: Event; isSignedUp: boolean }) => (
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
          {new Date(event.startDate).toLocaleDateString()}
        </div>
        <div className="flex items-center text-sm text-muted-foreground mb-1">
          <MapPin className="w-4 h-4 mr-1" />
          {event.location}
        </div>
        {isSignedUp && event.priceScheme && (
          <div className="flex items-center text-sm text-muted-foreground mb-1">
            <DollarSign className="w-4 h-4 mr-1" />
            {event.priceScheme.name}: ${event.priceScheme.price.toFixed(2)}
          </div>
        )}
        <div className="flex items-center mt-2">
          <Badge variant={event.status === "UPCOMING" ? "default" : "secondary"}>{event.status}</Badge>
          {isSignedUp && (
            <Badge variant="outline" className="ml-2">
              {event.signUpStatus}
            </Badge>
          )}
        </div>
      </div>
    </CardContent>
  </Card>
)

export default function MyEventsPage() {
  const [activeTab, setActiveTab] = useState<"signed-up" | "starred">("signed-up")
  const { ref, inView } = useInView()

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status, isLoading, isRefetching, error } =
    useInfiniteQuery({
      queryKey: ["events", activeTab],
      queryFn: ({ pageParam = 1 }) => fetchEvents(activeTab, pageParam),
      initialPageParam: 1,
      getNextPageParam: (lastPage) => lastPage.nextPage,
    })

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage()
    }
  }, [inView, fetchNextPage, hasNextPage])

  const renderContent = () => {
    if (isLoading || isRefetching) {
      return (
        <div className="flex justify-center items-center h-32">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      )
    }

    if (status === "error") {
      return (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error instanceof Error ? error.message : "An error occurred while fetching events"}
          </AlertDescription>
        </Alert>
      )
    }

    return (
      <>
        {data?.pages.map((page, i) => (
          <div key={i}>
            {page.events.map((event: Event) => (
              <EventCard key={event.id} event={event} isSignedUp={activeTab === "signed-up"} />
            ))}
          </div>
        ))}
        {isFetchingNextPage && (
          <div className="flex justify-center items-center h-32">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        )}
        <div ref={ref} className="h-1" />
        {!hasNextPage && <div className="text-center mt-4">This is the end</div>}
      </>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">My Events</h1>
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as "signed-up" | "starred")}
          className="w-full"
        >
          <TabsList className="mb-4">
            <TabsTrigger value="signed-up">Signed Up</TabsTrigger>
            <TabsTrigger value="starred">Starred</TabsTrigger>
          </TabsList>
          <TabsContent value="signed-up">{renderContent()}</TabsContent>
          <TabsContent value="starred">{renderContent()}</TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

