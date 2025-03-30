"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { formatDistanceToNow } from "date-fns"
import { Loader2, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { addComment, getComments } from "@/lib/comment-actions"
import { toast } from "sonner"

interface Comment {
  id: string
  content: string
  createdAt: Date
  user: {
    id: string
    name: string
    image: string | null
  }
}

interface ServiceCommentsProps {
  serviceId: string
}

export function ServiceComments({ serviceId }: ServiceCommentsProps) {
  const router = useRouter()
  const [comments, setComments] = useState<Comment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Mock user for demo purposes
  const currentUser = {
    id: "current-user",
    name: "Current User",
    image: null,
  }

  // Fetch comments on component mount
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const fetchedComments = await getComments(serviceId)
        setComments(fetchedComments)
      } catch (error) {
        console.error("Failed to fetch comments:", error)
        toast.error("Failed to load comments. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchComments()
  }, [serviceId])

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!comment.trim()) return

    setIsSubmitting(true)

    try {
      const newComment = await addComment({
        serviceId,
        content: comment,
        userId: currentUser.id,
      })

      setComments((prev) => [newComment, ...prev])
      setComment("")
      toast.success("Your comment has been added successfully.")
      router.refresh()
    } catch (error) {
      console.error("Failed to add comment:", error)
      toast.error("Failed to add your comment. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Comments</h2>

      <form onSubmit={handleSubmitComment} className="mb-6">
        <div className="flex gap-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={currentUser.image || ""} alt={currentUser.name} />
            <AvatarFallback>{currentUser.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Textarea
              placeholder="Add a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-[100px] mb-2"
            />
            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting || !comment.trim()}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Posting...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Post Comment
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>

      <div className="space-y-6">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : comments.length === 0 ? (
          <p className="text-center py-8 text-muted-foreground">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src={comment.user.image || ""} alt={comment.user.name} />
                <AvatarFallback>{comment.user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">{comment.user.name}</h4>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                  </span>
                </div>
                <p className="mt-1 text-muted-foreground">{comment.content}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

