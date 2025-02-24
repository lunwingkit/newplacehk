
import { EventStatus } from "@prisma/client";

export const eventStatuses = [
  EventStatus.PREPARING,
  EventStatus.UPCOMING,
  EventStatus.ONGOING,
  EventStatus.COMPLETED,
  EventStatus.CANCELLED,
] as const

export const locations = [
  { value: "hong_kong", label: "Hong Kong" },
  { value: "kowloon", label: "Kowloon" },
  { value: "new_territories", label: "New Territories" },
  { value: "lantau_island", label: "Lantau Island" },
  { value: "other", label: "Other" },
] as const

export const categories = [
  { value: "music", label: "Music" },
  { value: "sports", label: "Sports" },
  { value: "arts", label: "Arts" },
  { value: "food", label: "Food & Drink" },
  { value: "technology", label: "Technology" },
  { value: "business", label: "Business" },
  { value: "education", label: "Education" },
  { value: "other", label: "Other" },
] as const

export const GENDER_OPTIONS = ["Female", "Male", "Prefer not to say"]

export const PREDEFINED_INTERESTS = [
  "Reading",
  "Traveling",
  "Cooking",
  "Sports",
  "Music",
  "Movies",
  "Art",
  "Photography",
  "Dancing",
  "Hiking",
]

export const PREDEFINED_SELF_INTRO = ["Friendly", "Outgoing", "Creative", "Ambitious", "Adventurous", "Intellectual", "Romantic", "Practical"]
export const PREDEFINED_EXPECTATIONS = ["Kind", "Supportive", "Honest", "Ambitious", "Family-oriented", "Adventurous", "Intellectual", "Romantic"]