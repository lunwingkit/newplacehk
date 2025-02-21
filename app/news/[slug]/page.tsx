import { Navbar } from "@/components/navbar"
import { notFound } from "next/navigation"

// Dummy data for news articles
const newsArticles = [
  {
    id: 1,
    title: "New Venue Announced for Upcoming Concert Series",
    date: "2025-05-01",
    content:
      "We are excited to announce that the upcoming summer concert series will be held at the newly renovated Riverside Amphitheater. This state-of-the-art venue offers improved acoustics and a larger seating capacity, ensuring an unforgettable experience for all attendees.",
    slug: "new-venue-announced",
  },
  {
    id: 2,
    title: "Local Artist to Headline Community Festival",
    date: "2025-05-15",
    content:
      "Rising star and hometown hero, Sarah Johnson, has been announced as the headlining act for this year's Community Festival. Known for her soulful voice and heartfelt lyrics, Sarah's performance is expected to be a highlight of the event.",
    slug: "local-artist-headlines",
  },
  {
    id: 3,
    title: "Event Industry Sees Record Growth in Q2",
    date: "2025-06-01",
    content:
      "The event industry has reported unprecedented growth in the second quarter of 2025, with a 30% increase in event bookings compared to the same period last year. This surge is attributed to the rising demand for in-person experiences following years of virtual gatherings.",
    slug: "event-industry-growth",
  },
]

export default function NewsDetail({ params }: { params: { slug: string } }) {
  const article = newsArticles.find((item) => item.slug === params.slug)

  if (!article) {
    notFound()
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8">
        <article className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
          <p className="text-muted-foreground mb-6">{new Date(article.date).toLocaleDateString()}</p>
          <div className="prose max-w-none">
            <p>{article.content}</p>
          </div>
        </article>
      </main>

      <footer className="bg-primary text-primary-foreground py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 Event Showcase. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

