// Fetch Users
export async function fetchUsers() {
    const response = await fetch("/api/users")
    if (!response.ok) {
      throw new Error("Failed to fetch users")
    }
    return response.json()
  }
  
  // Fetch News
  export async function fetchNews() {
    const response = await fetch("/api/news")
    if (!response.ok) {
      throw new Error("Failed to fetch news")
    }
    return response.json()
  }
  
  // Fetch Events
  export async function fetchEvents() {
    const response = await fetch("/api/events")
    if (!response.ok) {
      throw new Error("Failed to fetch events")
    }
    return response.json()
  }
  
  // Upsert User
  export async function upsertUser(userData: any) {
    const response = await fetch("/api/users/upsert", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })
    if (!response.ok) {
      throw new Error("Failed to upsert user")
    }
    return response.json()
  }
  
  // Upsert News
  export async function upsertNews(newsData: any) {
    const response = await fetch("/api/news/upsert", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newsData),
    })
    if (!response.ok) {
      throw new Error("Failed to upsert news")
    }
    return response.json()
  }
  
  // Upsert Event
  export async function upsertEvent(eventData: any) {
    const response = await fetch("/api/events/upsert", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(eventData),
    })
    if (!response.ok) {
      throw new Error("Failed to upsert event")
    }
    return response.json()
  }
  
  // Delete User
  export async function deleteUser(userId: string) {
    const response = await fetch(`/api/users/${userId}`, {
      method: "DELETE",
    })
    if (!response.ok) {
      throw new Error("Failed to delete user")
    }
    return response.json()
  }
  
  // Delete News
  export async function deleteNews(newsId: string) {
    const response = await fetch(`/api/news/${newsId}`, {
      method: "DELETE",
    })
    if (!response.ok) {
      throw new Error("Failed to delete news")
    }
    return response.json()
  }
  
  // Delete Event
  export async function deleteEvent(eventId: string) {
    const response = await fetch(`/api/events/${eventId}`, {
      method: "DELETE",
    })
    if (!response.ok) {
      throw new Error("Failed to delete event")
    }
    return response.json()
  }
  
  