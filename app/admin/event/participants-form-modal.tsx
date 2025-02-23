"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Loader2 } from "lucide-react"
import type { EventsSignedUpByUsers } from "@prisma/client"

interface ParticipantFormModalProps {
  isOpen: boolean
  onClose: () => void
  initialData?: EventsSignedUpByUsers | null
  eventId: string
}

const formSchema = z.object({
  id: z.string().min(1, "ID is required"),
  eventId: z.string().min(1, "Event ID is required"),
  priceSchemeId: z.string().optional(),
  userId: z.string().min(1, "User ID is required"),
  status: z.string().min(1, "Status is required"),
})

export default function ParticipantFormModal({ isOpen, onClose, initialData, eventId }: ParticipantFormModalProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: "",
      eventId: "",
      priceSchemeId: "",
      userId: "",
      status: "",
    },
  })

  useEffect(() => {
    if (initialData) {
      form.reset({
        id: initialData.id,
        eventId: initialData.eventId,
        priceSchemeId: initialData.priceSchemeId || "",
        userId: initialData.userId,
        status: initialData.status,
      })
    } else {
      form.reset({
        id: "",
        eventId: eventId,
        priceSchemeId: "",
        userId: "",
        status: "PENDING",
      })
    }
  }, [initialData, form, eventId])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      const url = initialData
        ? `/api/events/${eventId}/participants/${initialData.id}`
        : `/api/events/${eventId}/participants`
      const method = initialData ? "PUT" : "POST"

      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error("Failed to save participant")
      }

      toast({
        title: "Success",
        description: `Participant ${initialData ? "updated" : "added"} successfully.`,
      })
      onClose()
    } catch (error) {
      console.error("Error saving participant:", error)
      toast({
        title: "Error",
        description: "Failed to save participant. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Participant" : "Add New Participant"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="userId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User ID</FormLabel>
                  <FormControl>
                    <Input placeholder="User ID" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="priceSchemeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price Scheme ID (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Price Scheme ID" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <Input placeholder="Status" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

