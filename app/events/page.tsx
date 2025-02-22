"use client";

import { useState } from "react";
import Image from "next/image";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { MapPin, Star, DollarSign, Loader2, Clock } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

// Extend dayjs with plugins
dayjs.extend(utc);
dayjs.extend(timezone);

// Set the default timezone to Hong Kong
dayjs.tz.setDefault("Asia/Hong_Kong");

// Dummy data for events
const events = [
  {
    id: 1,
    title: "Summer Concert Series",
    date: "2025-06-15",
    description: "Enjoy live music under the stars",
    location: "Central Park",
    image: "/placeholder.svg?height=400&width=600",
    details:
      "Join us for a night of incredible live music featuring local and international artists. Bring your blankets and picnic baskets for a magical evening under the stars.",
    price: 25,
    startTime: "2025-06-15T18:00:00Z",
    endTime: "2025-06-15T23:00:00Z",
  },
  {
    id: 2,
    title: "Tech Conference 2025",
    date: "2025-07-10",
    description: "Learn about the latest in technology",
    location: "Convention Center",
    image: "/placeholder.svg?height=400&width=600",
    details:
      "Explore cutting-edge technologies, attend workshops, and network with industry leaders at our annual tech conference.",
    price: 199,
    startTime: "2025-07-10T09:00:00Z",
    endTime: "2025-07-11T17:00:00Z",
  },
  {
    id: 3,
    title: "Food Festival",
    date: "2025-07-25",
    description: "Taste cuisines from around the world",
    location: "Downtown Square",
    image: "/placeholder.svg?height=400&width=600",
    details:
      "Embark on a culinary journey around the world with over 50 food stalls representing cuisines from every continent.",
    price: 15,
    startTime: "2025-07-25T11:00:00Z",
    endTime: "2025-07-25T22:00:00Z",
  },
  {
    id: 4,
    title: "Art Exhibition Opening",
    date: "2025-08-05",
    description: "Featuring works from local artists",
    location: "City Gallery",
    image: "/placeholder.svg?height=400&width=600",
    details:
      "Be among the first to see stunning new works from our city's most talented artists. Opening night includes a meet-and-greet with the artists.",
    price: 10,
    startTime: "2025-08-05T19:00:00Z",
    endTime: "2025-08-05T22:00:00Z",
  },
  {
    id: 5,
    title: "Marathon",
    date: "2025-09-12",
    description: "Annual city marathon",
    location: "City Streets",
    image: "/placeholder.svg?height=400&width=600",
    details:
      "Challenge yourself in our annual marathon. The route takes you through the most scenic parts of our beautiful city.",
    price: 50,
    startTime: "2025-09-12T06:00:00Z",
    endTime: "2025-09-12T14:00:00Z",
  },
  {
    id: 6,
    title: "Book Fair",
    date: "2025-09-20",
    description: "Meet authors and find your next read",
    location: "Public Library",
    image: "/placeholder.svg?height=400&width=600",
    details:
      "Discover new books, attend author readings, and participate in literary workshops at our annual book fair.",
    price: 5,
    startTime: "2025-09-20T10:00:00Z",
    endTime: "2025-09-20T18:00:00Z",
  },
];

const groupEventsByMonth = (events: any[]) => {
  return events.reduce((acc: Record<string, any[]>, event: any) => {
    const month = dayjs(event.date).format("MMMM");
    if (!acc[month]) {
      acc[month] = [];
    }
    acc[month].push(event);
    return acc;
  }, {});
};

// Format event time
const formatEventTime = (startTime: string, endTime: string) => {
  const start = dayjs(startTime).tz();
  const end = dayjs(endTime).tz();

  if (start.isSame(end, "day")) {
    return `${start.format("YYYY/MM/DD HH:mm")} ~ ${end.format("HH:mm")}`;
  } else {
    return `${start.format("YYYY/MM/DD HH:mm")} ~ ${end.format(
      "YYYY/MM/DD HH:mm"
    )}`;
  }
};

// Simulated API calls
const starEvent = async (eventId: number): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  if (Math.random() < 0.9) {
    return Promise.resolve();
  } else {
    return Promise.reject(new Error("Failed to star event"));
  }
};

const signUpForEvent = async (eventId: number): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  if (Math.random() < 0.8) {
    return Promise.resolve();
  } else {
    return Promise.reject(new Error("Failed to sign up for event"));
  }
};

export default function EventsPage() {
  const [starredEvents, setStarredEvents] = useState<number[]>([]);
  const [signedUpEvents, setSignedUpEvents] = useState<number[]>([]);
  const [loadingStars, setLoadingStars] = useState<number[]>([]);
  const [loadingSignUps, setLoadingSignUps] = useState<number[]>([]);
  const eventsByMonth = groupEventsByMonth(events);
  const months = Object.keys(eventsByMonth);
  const [openAccordions, setOpenAccordions] = useState<string[]>([months[0]]);

  const toggleStar = async (eventId: number) => {
    if (loadingStars.includes(eventId)) return;

    setLoadingStars((prev) => [...prev, eventId]);
    try {
      await starEvent(eventId);
      setStarredEvents((prev) =>
        prev.includes(eventId)
          ? prev.filter((id) => id !== eventId)
          : [...prev, eventId]
      );
      toast.success(
        starredEvents.includes(eventId) ? "Event unstarred" : "Event starred"
      );
    } catch (error) {
      toast.error("Failed to star event");
    } finally {
      setLoadingStars((prev) => prev.filter((id) => id !== eventId));
    }
  };

  const handleSignUp = async (eventId: number) => {
    if (loadingSignUps.includes(eventId)) return;

    setLoadingSignUps((prev) => [...prev, eventId]);
    try {
      await signUpForEvent(eventId);
      setSignedUpEvents((prev) => [...prev, eventId]);
      toast.success("Successfully signed up for event");
    } catch (error) {
      toast.error("Failed to sign up for event");
    } finally {
      setLoadingSignUps((prev) => prev.filter((id) => id !== eventId));
    }
  };

  const toggleAccordion = (month: string) => {
    setOpenAccordions((prev) =>
      prev.includes(month) ? prev.filter((m) => m !== month) : [...prev, month]
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Upcoming Events</h1>

        <Accordion
          type="multiple"
          value={openAccordions}
          onValueChange={setOpenAccordions}
        >
          {months.map((month) => (
            <AccordionItem key={month} value={month}>
              <AccordionTrigger onClick={() => toggleAccordion(month)}>
                {month}
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {eventsByMonth[month].map((event: any) => (
                    <Card key={event.id} className="relative flex flex-col">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 z-10"
                        onClick={() => toggleStar(event.id)}
                        disabled={loadingStars.includes(event.id)}
                      >
                        {loadingStars.includes(event.id) ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Star
                            className={`w-6 h-6 ${
                              starredEvents.includes(event.id)
                                ? "fill-yellow-400"
                                : "fill-transparent"
                            }`}
                          />
                        )}
                      </Button>
                      <Image
                        src={event.image || "/placeholder.svg"}
                        alt={event.title}
                        width={600}
                        height={400}
                        className="w-full h-48 object-cover"
                      />
                      <CardHeader>
                        <CardTitle>{event.title}</CardTitle>
                        <CardDescription>
                          <div className="flex items-center mt-1">
                            <Clock className="w-4 h-4 mr-1" />
                            {formatEventTime(event.startTime, event.endTime)}
                          </div>
                          <div className="flex items-center mt-1">
                            <MapPin className="w-4 h-4 mr-1" />
                            {event.location}
                          </div>
                          <div className="flex items-center mt-1">
                            <DollarSign className="w-4 h-4 mr-1" />$
                            {event.price}
                          </div>
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p>{event.description}</p>
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
                                  {formatEventTime(
                                    event.startTime,
                                    event.endTime
                                  )}{" "}
                                  | {event.location}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="mt-4">
                                <div className="relative">
                                  <Image
                                    src={event.image || "/placeholder.svg"}
                                    alt={event.title}
                                    width={600}
                                    height={400}
                                    className="w-full h-48 object-cover rounded-md mb-2"
                                  />
                                  <div className="flex justify-end mt-2">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => toggleStar(event.id)}
                                      disabled={loadingStars.includes(event.id)}
                                    >
                                      {loadingStars.includes(event.id) ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                      ) : (
                                        <Star
                                          className={`w-6 h-6 ${
                                            starredEvents.includes(event.id)
                                              ? "fill-yellow-400"
                                              : "fill-transparent"
                                          }`}
                                        />
                                      )}
                                    </Button>
                                  </div>
                                </div>
                                <p className="mt-4">{event.details}</p>
                                <p className="mt-2 font-semibold">
                                  Price: ${event.price}
                                </p>
                              </div>
                              <DialogFooter className="mt-4">
                                <Button
                                  className="w-full"
                                  onClick={() => handleSignUp(event.id)}
                                  disabled={
                                    signedUpEvents.includes(event.id) ||
                                    loadingSignUps.includes(event.id)
                                  }
                                >
                                  {loadingSignUps.includes(event.id) ? (
                                    <>
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                      Signing Up...
                                    </>
                                  ) : signedUpEvents.includes(event.id) ? (
                                    "Signed Up"
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
                              signedUpEvents.includes(event.id) ||
                              loadingSignUps.includes(event.id)
                            }
                          >
                            {loadingSignUps.includes(event.id) ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Signing Up...
                              </>
                            ) : signedUpEvents.includes(event.id) ? (
                              "Signed Up"
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
      </main>

      <footer className="bg-primary text-primary-foreground py-6">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 Event Showcase. All rights reserved.</p>
        </div>
      </footer>
      <Toaster position="bottom-right" />
    </div>
  );
}
