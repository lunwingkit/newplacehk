export const eventStatuses = ["PREPARING", "OPEN", "CLOSED", "CANCELLED"] as const

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

