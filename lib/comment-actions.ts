"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"

// Comment schema for validation
const commentSchema = z.object({
  serviceId: z.string(),
  content: z.string().min(1, "Comment cannot be empty"),
  userId: z.string(),
})

// Mock data for comments
const mockComments = [
  {
    id: "1",
    content: "This service is exactly what I was looking for! Great work.",
    createdAt: new Date("2023-09-15T10:30:00"),
    serviceId: "1",
    userId: "2",
    user: {
      id: "2",
      name: "Jane Smith",
      image: null,
    },
  },
  {
    id: "2",
    content: "How long does it typically take to complete this service?",
    createdAt: new Date("2023-09-16T14:45:00"),
    serviceId: "1",
    userId: "3",
    user: {
      id: "3",
      name: "Alex Johnson",
      image: null,
    },
  },
  {
    id: "3",
    content: "I've used this service before and was very satisfied with the results.",
    createdAt: new Date("2023-09-17T09:15:00"),
    serviceId: "2",
    userId: "1",
    user: {
      id: "1",
      name: "John Doe",
      image: null,
    },
  },
]

// Get comments for a service
export async function getComments(serviceId: string) {
  // Simulate a delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  try {
    return mockComments
      .filter((comment) => comment.serviceId === serviceId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  } catch (error) {
    console.error("Error fetching comments:", error)
    throw new Error("Failed to fetch comments")
  }
}

// Add a comment to a service
export async function addComment(data: {
  serviceId: string
  content: string
  userId: string
}) {
  // Simulate a delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  try {
    // Validate the data
    const validatedData = commentSchema.parse(data)

    const newComment = {
      id: `comment-${Date.now()}`,
      content: validatedData.content,
      createdAt: new Date(),
      serviceId: validatedData.serviceId,
      userId: validatedData.userId,
      user: {
        id: validatedData.userId,
        name: "Current User",
        image: null,
      },
    }

    // In a real app, you would add this to your database
    mockComments.push(newComment)

    // Revalidate the service page
    revalidatePath(`/services/${validatedData.serviceId}`)

    return newComment
  } catch (error) {
    console.error("Error adding comment:", error)

    if (error instanceof z.ZodError) {
      throw new Error(error.errors[0].message)
    }

    throw new Error("Failed to add comment")
  }
}

