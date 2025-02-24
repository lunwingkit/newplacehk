"use client"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { upsertNews } from "@/lib/api"
import { Loader2 } from "lucide-react"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { DateTimePicker24h } from "@/components/ui/date-time-picker-24h"
import { useToast } from "@/hooks/use-toast"

interface NewsModalProps {
  isOpen: boolean
  onClose: () => void
  news: any
  onSuccess?: () => void; // Add onSuccess callback
}

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  summary: z.string().min(1, "Summary is required"),
  image: z.string().url("Invalid URL").min(1, "Image URL is required"),
  slug: z.string().min(1, "Slug is required"),
  author: z.string().min(1, "Author is required"),
  publishedAt: z.date({ required_error: "Published date is required" }),
  isPublished: z.boolean(),
  tags: z.string().min(1, "At least one tag is required"),
})

export default function NewsModal({ isOpen, onClose, news, onSuccess }: NewsModalProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      summary: "",
      image: "",
      slug: "",
      author: "",
      publishedAt: new Date(),
      isPublished: false,
      tags: "",
    },
  })

  useEffect(() => {
    if (news) {
      form.reset({
        title: news.title || "",
        content: news.content || "",
        summary: news.summary || "",
        image: news.image || "",
        slug: news.slug || "",
        author: news.author || "",
        publishedAt: news.publishedAt ? new Date(news.publishedAt) : new Date(),
        isPublished: news.isPublished || false,
        tags: news.tags?.join(", ") || "",
      })
    } else {
      form.reset({
        title: "",
        content: "",
        summary: "",
        image: "",
        slug: "",
        author: "",
        publishedAt: new Date(),
        isPublished: false,
        tags: "",
      })
    }
  }, [news, form])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    try {
      const newsData = {
        id: news?.id,
        ...values,
        tags: values.tags.split(",").map((tag) => tag.trim()),
      }
      const result = await upsertNews(newsData)

      console.log(result)
      toast({
        title: result.message,
        description: result.description,
        variant: result.type === "Error" ? "destructive" : "default",
      })

      if (result.type !== "Error") {
        onClose()
        onSuccess?.(); // Call onSuccess callback after successful upsert
      }
    } catch (error) {
      console.error("Error in onSubmit:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle>{news ? "Edit News" : "Create News"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 flex-grow overflow-y-auto px-6 py-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Title <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className={cn(form.formState.errors.title && "border-red-500 focus-visible:ring-red-500")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Content <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      className={cn(form.formState.errors.content && "border-red-500 focus-visible:ring-red-500")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="summary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Summary <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      className={cn(form.formState.errors.summary && "border-red-500 focus-visible:ring-red-500")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Image URL <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className={cn(form.formState.errors.image && "border-red-500 focus-visible:ring-red-500")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Slug <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className={cn(form.formState.errors.slug && "border-red-500 focus-visible:ring-red-500")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="author"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Author <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className={cn(form.formState.errors.author && "border-red-500 focus-visible:ring-red-500")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="publishedAt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Published At <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <DateTimePicker24h value={field.value} onChange={(date) => field.onChange(date)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isPublished"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Published</FormLabel>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Tags <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Separate tags with commas"
                      className={cn(form.formState.errors.tags && "border-red-500 focus-visible:ring-red-500")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <div className="px-6 py-4 border-t">
          <div className="flex justify-end">
            <Button type="submit" onClick={form.handleSubmit(onSubmit)} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

