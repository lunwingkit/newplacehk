import Image from "next/image"
import Link from "next/link"
import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Skeleton } from "@/components/ui/skeleton"
import type { Event, News } from "@prisma/client"
import { cardData, content } from "@/lib/constant"

async function getFeaturedEvents() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/featured-events`, {
    cache: "no-store",
  })
  if (!res.ok) {
    throw new Error("Failed to fetch 近期活動")
  }
  return res.json()
}

async function getNewsItems() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/featured-news`, {
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
    <div className="relative md:px-12">
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
    <div className="relative md:px-12">
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
  const FALLBACK_IMAGE = "/placeholder.svg?height=100&width=100";

  return (
    <div className="space-y-6">
      {items.map((item: News) => (
        <Card key={item.id}>
          <CardContent className="flex items-center space-x-4 p-4">
            <Image
              src={item.image && isValidImageUrl(item.image) ? item.image : FALLBACK_IMAGE}
              alt={item.title}
              width={100}
              height={100}
              className="rounded-lg"
              unoptimized // Add this if you're using external images
            />
            <div className="flex-grow">
              <Link href={`/news/${item.id}`} className="text-xl font-semibold hover:underline">
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
  );
}

// Optional: Basic URL validation function
function isValidImageUrl(url: string): boolean {
  try {
    // Check if it's a valid URL format
    new URL(url);
    // Check if it ends with common image extensions
    return /\.(jpg|jpeg|png|gif|svg|webp)$/i.test(url);
  } catch {
    return false;
  }
}

export default async function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-primary text-primary-foreground py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">歡迎來到 友趣館xNewplacehk！</h1>
            <p className="text-xl mb-8">桌遊、劇本殺、交友聯誼 各種活動應有盡有!</p>
            <Button asChild>
              <Link href="/events" className="inline-block bg-white text-black dark:bg-blue-600 dark:text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
                發掘更多
              </Link>
              </Button>
          </div>
        </section>

        {/* 近期活動 Carousel */}
        <section className="py-16 bg-gradient-to-b from-primary/10 to-background">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold mb-8 text-center">近期活動</h2>
            <Suspense fallback={<FeaturedEventsSkeleton />}>
              <FeaturedEventsContent />
            </Suspense>
          </div>
        </section>

        {/* 關於我們 Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">關於我們</h2>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <p className="text-lg mb-4">
                  {content.intro.zh}
                </p>
                <p className="text-lg">
                  {content.mission.zh}
                </p>
              </div>
              <div className="relative h-64 md:h-full">
                <Image
                  src="/placeholder.svg?height=400&width=600"
                  alt="About 友趣館xNewplacehk"
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
        <h2 className="text-3xl font-bold mb-8 text-center">我們的服務對象</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {cardData.map((card, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
                <p>{card.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>

        {/* News Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">最新消息</h2>
            <Suspense fallback={<NewsSkeleton />}>
              <NewsContent />
            </Suspense>
          </div>
        </section>
      </main>

      <footer className="bg-primary text-primary-foreground py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 友趣館xNewplacehk. All rights reserved.</p>
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
    <p className="text-center">目前未有任何近期活動</p>
  )
}

async function NewsContent() {
  const newsItems = await getNewsItems()
  return newsItems.length > 0 ? (
    <NewsItems items={newsItems} />
  ) : (
    <p className="text-center">目前未有任何消息</p>
  )
}

