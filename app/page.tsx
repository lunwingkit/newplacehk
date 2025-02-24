import Image from "next/image"
import Link from "next/link"
import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Skeleton } from "@/components/ui/skeleton"
import type { Event, News } from "@prisma/client"

async function getFeaturedEvents() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/featured-events`, {
    cache: "no-store",
  })
  if (!res.ok) {
    throw new Error("Failed to fetch featured events")
  }
  return res.json()
}

async function getNewsItems() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/news`, {
    cache: "no-store",
  })
  if (!res.ok) {
    throw new Error("Failed to fetch news items")
  }
  return res.json()
}

// Replace the existing FeaturedEventsSkeleton function with this updated version
function FeaturedEventsSkeleton() {
  return (
    <div className="relative px-12">
      <div className="flex space-x-4 overflow-hidden">
        {[1, 2].map((i) => (
          <div key={i} className="flex-none w-full md:w-1/2 pr-4">
            <div className="relative aspect-video overflow-hidden rounded-xl shadow-lg">
              <Skeleton className="absolute inset-0" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4 md:p-6">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-4 w-full mb-4" />
                <Skeleton className="h-8 w-32" />
              </div>
            </div>
          </div>
        ))}
      </div>
      <Skeleton className="absolute left-0 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full" />
      <Skeleton className="absolute right-0 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full" />
    </div>
  )
}

function NewsSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <Card key={i}>
          <CardContent className="flex items-center space-x-4 p-4">
            <Skeleton className="h-[100px] w-[100px] rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[150px]" />
              <Skeleton className="h-4 w-[100px]" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function FeaturedEvents({ events }: { events: Event[] }) {
  return (
    <div className="relative px-12">
      <Carousel opts={{ loop: true, align: "start" }} className="w-full">
        <CarouselContent className="-ml-4">
          {events.map((event: Event) => (
            <CarouselItem key={event.id} className="pl-4 md:basis-1/2 lg:basis-1/2">
              <div className="relative aspect-video overflow-hidden rounded-xl shadow-lg">
                <Image
                  src={event.image || "/placeholder.svg?height=600&width=1200"}
                  alt={event.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4 md:p-6 text-white">
                  <h3 className="text-xl md:text-2xl font-bold mb-1 md:mb-2">{event.title}</h3>
                  <p className="mb-1 md:mb-2 text-sm md:text-base opacity-90">
                    {new Date(event.startDate).toLocaleDateString()} | {event.location}
                  </p>
                  <p className="mb-2 md:mb-4 text-xs md:text-sm line-clamp-2 opacity-80">{event.description}</p>
                  <Button asChild variant="secondary" size="sm" className="w-full sm:w-auto">
                    <Link href={`/event/${event.id}`}>Learn More</Link>
                  </Button>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="hidden md:block">
          <CarouselPrevious className="absolute -left-12 top-1/2 -translate-y-1/2" />
          <CarouselNext className="absolute -right-12 top-1/2 -translate-y-1/2" />
        </div>
      </Carousel>
    </div>
  )
}

function NewsItems({ items }: { items: News[] }) {
  return (
    <div className="space-y-6">
      {items.map((item: News) => (
        <Card key={item.id}>
          <CardContent className="flex items-center space-x-4 p-4">
            <Image
              src={item.image || "/placeholder.svg?height=100&width=100"}
              alt={item.title}
              width={100}
              height={100}
              className="rounded-lg"
            />
            <div className="flex-grow">
              <Link href={`/news/${item.slug}`} className="text-xl font-semibold hover:underline">
                {item.title}
              </Link>
              <p className="text-muted-foreground text-sm mb-2">{new Date(item.publishedAt).toLocaleDateString()}</p>
              {item.summary && <p className="text-sm text-muted-foreground line-clamp-2">{item.summary}</p>}
              {item.tags && item.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {item.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default async function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-primary text-primary-foreground py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">Welcome to Event Showcase</h1>
            <p className="text-xl mb-8">Discover and Experience Unforgettable Events</p>
            <Button asChild>
              <Link href="/events">Explore Events</Link>
            </Button>
          </div>
        </section>

        {/* Featured Events Carousel */}
        <section className="py-16 bg-gradient-to-b from-primary/10 to-background">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold mb-8 text-center">Featured Events</h2>
            <Suspense fallback={<FeaturedEventsSkeleton />}>
              <FeaturedEventsContent />
            </Suspense>
          </div>
        </section>

        {/* About Us Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">About Us</h2>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <p className="text-lg mb-4">
                  Event Showcase is your premier destination for discovering and experiencing the most exciting events
                  in your area. We curate a diverse range of gatherings, from intimate local meetups to large-scale
                  festivals, ensuring there's something for everyone.
                </p>
                <p className="text-lg">
                  Our mission is to connect event organizers with enthusiastic attendees, fostering a vibrant community
                  of shared experiences and unforgettable moments.
                </p>
              </div>
              <div className="relative h-64 md:h-full">
                <Image
                  src="/placeholder.svg?height=400&width=600"
                  alt="About Event Showcase"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Target Audience Section */}
        <section className="bg-muted py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">Who We Serve</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-2">Event Enthusiasts</h3>
                  <p>Individuals looking for unique and exciting experiences, from concerts to workshops.</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-2">Event Organizers</h3>
                  <p>Creators and planners seeking to showcase their events to a wider, engaged audience.</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-2">Local Businesses</h3>
                  <p>Companies looking to promote their services or participate in community events.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* News Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">Latest News</h2>
            <Suspense fallback={<NewsSkeleton />}>
              <NewsContent />
            </Suspense>
          </div>
        </section>
      </main>

      <footer className="bg-primary text-primary-foreground py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 Event Showcase. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

async function FeaturedEventsContent() {
  const featuredEvents = await getFeaturedEvents()
  return featuredEvents.length > 0 ? (
    <FeaturedEvents events={featuredEvents} />
  ) : (
    <p className="text-center">No featured events available at the moment.</p>
  )
}

async function NewsContent() {
  const newsItems = await getNewsItems()
  return newsItems.length > 0 ? (
    <NewsItems items={newsItems} />
  ) : (
    <p className="text-center">No news items available at the moment.</p>
  )
}

