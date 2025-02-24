"use client"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Loader2 } from "lucide-react"
import { upsertUser } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TagManager } from "@/components/tag-manager"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { GENDER_OPTIONS, PREDEFINED_INTERESTS } from "@/lib/constant"
import { cn } from "@/lib/utils"

interface UserModalProps {
  isOpen: boolean
  onClose: () => void
  user: any
  onSuccess?: () => void
}

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  age: z
    .string()
    .min(1, "Age is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Age must be a positive number",
    }),
  gender: z.string().min(1, "Gender is required"),
  interests: z.array(z.string()),
  introduction: z.string().optional(),
  image: z.string().optional(),
})

export default function UserModal({ isOpen, onClose, user, onSuccess }: UserModalProps) {
  const { toast } = useToast()
  const [interests, setInterests] = useState<string[]>([])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      age: "",
      gender: "",
      interests: [],
      introduction: "",
      image: "",
    },
  })

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name || "",
        email: user.email || "",
        age: user.age?.toString() || "",
        gender: user.gender || "",
        interests: user.interests || [],
        introduction: user.introduction || "",
        image: user.image || "",
      })
      setInterests(user.interests || [])
    } else {
      form.reset({
        name: "",
        email: "",
        age: "",
        gender: "",
        interests: [],
        introduction: "",
        image: "",
      })
      setInterests([])
    }
  }, [user, form])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const userData = {
        id: user?.id,
        ...values,
        age: Number.parseInt(values.age),
        interests: interests,
      }
      const result = await upsertUser(userData)

      console.log(result)
      toast({
        title: result.message,
        description: result.description,
        variant: result.type === "Error" ? "destructive" : "default",
      })

      if (result.type !== "Error") {
        onClose()
        onSuccess?.()
      }
    } catch (error) {
      console.error("Error in onSubmit:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleAddInterest = (tag: string) => {
    if (!interests.includes(tag)) {
      setInterests([...interests, tag])
      form.setValue("interests", [...interests, tag])
    }
  }

  const handleRemoveInterest = (tag: string) => {
    const updatedInterests = interests.filter((t) => t !== tag)
    setInterests(updatedInterests)
    form.setValue("interests", updatedInterests)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle>{user ? "Edit User" : "Create User"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 flex-grow overflow-y-auto px-6 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Name <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className={cn(form.formState.errors.name && "border-red-500 focus-visible:ring-red-500")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Email <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className={cn(form.formState.errors.email && "border-red-500 focus-visible:ring-red-500")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Age <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      className={cn(form.formState.errors.age && "border-red-500 focus-visible:ring-red-500")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Gender <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {GENDER_OPTIONS.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="interests"
              render={() => (
                <FormItem>
                  <FormLabel>Interests</FormLabel>
                  <FormControl>
                    <TagManager
                      tags={interests}
                      onAddTag={handleAddInterest}
                      onRemoveTag={handleRemoveInterest}
                      predefinedOptions={PREDEFINED_INTERESTS}
                      placeholder="Add interest"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="introduction"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Introduction</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      className={cn(form.formState.errors.introduction && "border-red-500 focus-visible:ring-red-500")}
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
                  <FormLabel>Image URL</FormLabel>
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
          </form>
        </Form>
        <div className="px-6 py-4 border-t">
          <div className="flex justify-end">
            <Button type="submit" onClick={form.handleSubmit(onSubmit)} disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? (
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

