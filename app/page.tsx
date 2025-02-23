import Image from "next/image"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"

// Dummy data for featured events and news
const featuredEvents = [
  {
    id: 1,
    title: "Summer Music Festival",
    image: "/placeholder.svg?height=600&width=1200",
    date: "2025-07-15",
    location: "Sunset Park",
    description: "Experience three days of non-stop music from top artists across various genres.",
  },
  {
    id: 2,
    title: "Tech Innovation Summit",
    image: "/placeholder.svg?height=600&width=1200",
    date: "2025-09-22",
    location: "Downtown Convention Center",
    description: "Join industry leaders and innovators to explore the future of technology.",
  },
  {
    id: 3,
    title: "Food and Wine Expo",
    image: "/placeholder.svg?height=600&width=1200",
    date: "2025-08-05",
    location: "Riverfront Plaza",
    description: "Indulge in culinary delights and fine wines from around the world.",
  },
  {
    id: 4,
    title: "Art in the Park",
    image: "/placeholder.svg?height=600&width=1200",
    date: "2025-08-20",
    location: "City Botanical Gardens",
    description: "A celebration of local artists showcasing their work in a beautiful outdoor setting.",
  },
]

const newsItems = [
  {
    id: 1,
    title: "New Venue Announced for Upcoming Concert Series",
    date: "2025-05-01",
    thumbnail: "/placeholder.svg?height=100&width=100",
    slug: "new-venue-announced",
  },
  {
    id: 2,
    title: "Local Artist to Headline Community Festival",
    date: "2025-05-15",
    thumbnail: "/placeholder.svg?height=100&width=100",
    slug: "local-artist-headlines",
  },
  {
    id: 3,
    title: "Event Industry Sees Record Growth in Q2",
    date: "2025-06-01",
    thumbnail: "/placeholder.svg?height=100&width=100",
    slug: "event-industry-growth",
  },
]

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

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
            <div className="relative">
              {" "}
              {/* Added padding for button space */}
              <Carousel
                opts={{
                  loop: true,
                  align: "start",
                }}
                className="w-full"
              >
                <CarouselContent className="-ml-4">
                  {featuredEvents.map((event) => (
                    <CarouselItem key={event.id} className="pl-4 md:basis-1/2 lg:basis-1/2">
                      <div className="relative aspect-video overflow-hidden rounded-xl shadow-lg">
                        <Image
                          src={event.image || "/placeholder.svg"}
                          alt={event.title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4 md:p-6 text-white">
                          <h3 className="text-xl md:text-2xl font-bold mb-1 md:mb-2">{event.title}</h3>
                          <p className="mb-1 md:mb-2 text-sm md:text-base opacity-90">
                            {event.date} | {event.location}
                          </p>
                          <p className="mb-2 md:mb-4 text-xs md:text-sm line-clamp-2 opacity-80">{event.description}</p>
                          <Button asChild variant="secondary" size="sm" className="w-full sm:w-auto">
                            <Link href={`/events/${event.id}`}>Learn More</Link>
                          </Button>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="hidden md:block">
                  <CarouselPrevious className="absolute -left-12 top-1/2 -translate-y-1/2" children={undefined} />
                  <CarouselNext className="absolute -right-12 top-1/2 -translate-y-1/2" children={undefined} />
                </div>
              </Carousel>
            </div>
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
            <div className="space-y-6">
              {newsItems.map((item) => (
                <Card key={item.id}>
                  <CardContent className="flex items-center space-x-4 p-4">
                    <Image
                      src={item.thumbnail || "/placeholder.svg"}
                      alt={item.title}
                      width={100}
                      height={100}
                      className="rounded-lg"
                    />
                    <div>
                      <Link href={`/news/${item.slug}`} className="text-xl font-semibold hover:underline">
                        {item.title}
                      </Link>
                      <p className="text-muted-foreground">{new Date(item.date).toLocaleDateString()}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
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

