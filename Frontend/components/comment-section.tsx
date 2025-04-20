"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { toast } from "@/components/ui/use-toast"

interface Comment {
  id: string
  user: string
  date: string
  content: string
  rating?: number
}

interface CommentSectionProps {
  comments: Comment[]
  itemId: string
  itemType: "venue" | "event"
}

export default function CommentSection({ comments, itemId, itemType }: CommentSectionProps) {
  const [newComment, setNewComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [displayedComments, setDisplayedComments] = useState(comments)

  async function handleSubmitComment(e: React.FormEvent) {
    e.preventDefault()
    if (!newComment.trim()) return

    setIsSubmitting(true)
    try {
      // Gerçek uygulamada burada API çağrısı yapılır
      await new Promise((resolve) => setTimeout(resolve, 500)) // Simüle edilmiş gecikme

      const comment = {
        id: `temp-${Date.now()}`,
        user: "Siz", // Gerçek uygulamada oturum açmış kullanıcının adı
        date: new Date().toISOString().split("T")[0],
        content: newComment,
      }

      setDisplayedComments([comment, ...displayedComments])
      setNewComment("")

      toast({
        title: "Yorum gönderildi",
        description: "Yorumunuz başarıyla gönderildi.",
      })
    } catch (error) {
      toast({
        title: "Hata",
        description: "Yorum gönderilirken bir hata oluştu.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Yorumlar</h2>

      <form onSubmit={handleSubmitComment} className="mb-8">
        <Textarea
          placeholder="Yorumunuzu yazın..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="mb-2"
          rows={4}
        />
        <Button type="submit" disabled={!newComment.trim() || isSubmitting}>
          {isSubmitting ? "Gönderiliyor..." : "Yorum Yap"}
        </Button>
      </form>

      {displayedComments.length > 0 ? (
        <div className="space-y-6">
          {displayedComments.map((comment) => (
            <div key={comment.id} className="border-b pb-4 last:border-0">
              <div className="flex items-start gap-4">
                <Avatar>
                  <AvatarFallback>{comment.user.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="font-medium">{comment.user}</h3>
                    <span className="text-sm text-gray-500">{comment.date}</span>
                  </div>
                  <p className="text-gray-700">{comment.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">Henüz yorum yapılmamış. İlk yorumu siz yapın!</p>
      )}
    </div>
  )
}
