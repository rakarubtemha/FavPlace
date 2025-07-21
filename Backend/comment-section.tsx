"use client"

import type React from "react"

import { useState, useEffect } from "react"
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
  canComment?: boolean
}

export default function CommentSection({ comments, itemId, itemType, canComment = true }: CommentSectionProps) {
  const [newComment, setNewComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [displayedComments, setDisplayedComments] = useState<Comment[]>([])
  const [userEmail, setUserEmail] = useState<string | null>(null)

  // Yorumları localStorage'dan yükle
  useEffect(() => {
    if (typeof window !== "undefined") {
      const key = `comments_${itemType}_${itemId}`
      const stored = localStorage.getItem(key)
      if (stored) {
        setDisplayedComments(JSON.parse(stored))
      } else {
        setDisplayedComments(comments)
        localStorage.setItem(key, JSON.stringify(comments))
      }
      const userInfoStr = localStorage.getItem("userInfo")
      if (userInfoStr) {
        const userInfo = JSON.parse(userInfoStr)
        setUserEmail(userInfo.email)
      }
    }
  }, [itemId, itemType])

  // Yorumlar değişince localStorage'a kaydet
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(`comments_${itemType}_${itemId}` , JSON.stringify(displayedComments))
    }
  }, [displayedComments, itemId, itemType])

  async function handleSubmitComment(e: React.FormEvent) {
    e.preventDefault()
    if (!newComment.trim()) return

    setIsSubmitting(true)
    try {
      const key = `comments_${itemType}_${itemId}`
      let currentComments: Comment[] = []
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem(key)
        if (stored) {
          currentComments = JSON.parse(stored)
        } else {
          currentComments = comments
        }
      }
      const comment = {
        id: `temp-${Date.now()}`,
        user: userEmail || "Siz",
        email: userEmail || "",
        date: new Date().toISOString().split("T")[0],
        content: newComment,
      }
      const updatedComments = [comment, ...currentComments]
      setDisplayedComments(updatedComments)
      if (typeof window !== "undefined") {
        localStorage.setItem(key, JSON.stringify(updatedComments))
      }
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

  function handleDeleteComment(commentId: string) {
    setDisplayedComments(displayedComments.filter(c => c.id !== commentId))
    toast({
      title: "Yorum silindi",
      description: "Yorumunuz silindi.",
    })
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Yorumlar</h2>

      {canComment ? (
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
      ) : (
        <div className="mb-8 text-sm text-gray-500">Yorum yapabilmek için etkinliğe katılmalısınız.</div>
      )}

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
                  {userEmail && comment.email === userEmail && (
                    <Button size="sm" variant="ghost" className="text-xs text-red-500 px-2 py-0 h-6 mt-1" onClick={() => handleDeleteComment(comment.id)}>
                      Yorumu Sil
                    </Button>
                  )}
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
