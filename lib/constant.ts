
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

export const cardData = [
  {
    title: "活動愛好者",
    description:
      "喜歡獨特和刺激體驗的人，從音樂會到工作坊，應有盡有。",
  },
  {
    title: "活動策劃者",
    description:
      "尋找機會向更廣泛的觀眾展示他們活動的創作者和策劃者。",
  },
  {
    title: "本地商戶",
    description:
      "希望推廣他們的服務或參加社區活動的公司。",
  },
];

export const content = {
  intro: {
    en: "友趣館xNewplacehk is your premier destination for discovering and experiencing the most exciting events in your area. We curate a diverse range of gatherings, from intimate local meetups to large-scale festivals, ensuring there's something for everyone.",
    zh: "友趣館xNewplacehk 是您探索和體驗所在區域最刺激活動的首選地點。我們精心策劃多元化的聚會，從親密的本地聚會到大型節慶，確保每個人都能找到合適的活動。",
  },
  mission: {
    en: "Our mission is to connect event organizers with enthusiastic attendees, fostering a vibrant community of shared experiences and unforgettable moments.",
    zh: "我們的使命是將活動策劃者與熱情的參加者連接起來，促進一個充滿活力的社區，分享經歷和難忘的時刻。",
  },
};