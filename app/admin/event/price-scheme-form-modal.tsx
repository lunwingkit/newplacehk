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
import type { PriceScheme } from "@prisma/client"

interface PriceSchemeFormModalProps {
  isOpen: boolean
  onClose: () => void
  initialData?: PriceScheme | null
  eventId: string
}

const formSchema = z.object({
  id: z.string().optional(),
  eventId: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  price: z.coerce.number().min(0, "Price must be a positive number"),
})

export default function PriceSchemeFormModal({ isOpen, onClose, initialData, eventId }: PriceSchemeFormModalProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: "",
      eventId: "",
      name: "",
      price: 0,
    },
  })

  useEffect(() => {
    if (initialData) {
      form.reset({
        id: initialData.id,
        eventId: initialData.eventId,
        name: initialData.name,
        price: initialData.price,
      })
    } else {
      form.reset({
        id: "",
        eventId: eventId,
        name: "",
        price: 0,
      })
    }
  }, [initialData, form, eventId])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      const url = initialData
        ? `/api/events/${eventId}/price-schemes/${initialData.id}`
        : `/api/events/${eventId}/price-schemes`
      const method = initialData ? "PUT" : "POST"

      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, eventId }),
      })

      if (!response.ok) {
        throw new Error("Failed to save price scheme")
      }

      toast({
        title: "Success",
        description: `Price scheme ${initialData ? "updated" : "added"} successfully.`,
      })
      onClose()
    } catch (error) {
      console.error("Error saving price scheme:", error)
      toast({
        title: "Error",
        description: "Failed to save price scheme. Please try again.",
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
          <DialogTitle>{initialData ? "Edit Price Scheme" : "Add New Price Scheme"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Early Bird" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="99.99"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
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

