"use client"

import { useState } from "react"
import { Star, StarHalf } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"

interface EventRatingProps {
  rating: number
  ratingCount: number
  userCanRate?: boolean
  eventId?: string
}

export default function EventRating({ rating, ratingCount, userCanRate = true, eventId }: EventRatingProps) {
  const [isRatingOpen, setIsRatingOpen] = useState(false)
  const [selectedRating, setSelectedRating] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Tam yıldızları ve yarım yıldızı hesapla
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5

  async function handleRatingSubmit() {
    if (!selectedRating) return

    setIsSubmitting(true)
    try {
      // Gerçek uygulamada burada API çağrısı yapılır
      await new Promise((resolve) => setTimeout(resolve, 500)) // Simüle edilmiş gecikme

      toast({
        title: "Değerlendirme gönderildi",
        description: `${selectedRating} yıldız değerlendirmeniz için teşekkürler.`,
      })

      setIsRatingOpen(false)
      setSelectedRating(0)
    } catch (error) {
      toast({
        title: "Hata",
        description: "Değerlendirme gönderilirken bir hata oluştu.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex items-center">
      <div className="flex items-center text-yellow-500">
        {[...Array(5)].map((_, i) => {
          if (i < fullStars) {
            return <Star key={i} className="fill-yellow-500 w-5 h-5" />
          } else if (i === fullStars && hasHalfStar) {
            return <StarHalf key={i} className="fill-yellow-500 w-5 h-5" />
          } else {
            return <Star key={i} className="text-gray-300 w-5 h-5" />
          }
        })}
      </div>
      <span className="ml-2 text-sm text-gray-600">
        {rating.toFixed(1)} ({ratingCount} değerlendirme)
      </span>

      {userCanRate && (
        <Dialog open={isRatingOpen} onOpenChange={setIsRatingOpen}>
          <DialogTrigger asChild>
            <Button variant="link" size="sm" className="ml-2 text-rose-600">
              Değerlendir
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Etkinliği Değerlendir</DialogTitle>
              <DialogDescription>
                Bu etkinlik hakkında ne düşünüyorsunuz? Yıldız vererek değerlendirin.
              </DialogDescription>
            </DialogHeader>

            <div className="flex justify-center py-4">
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setSelectedRating(star)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= selectedRating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsRatingOpen(false)}>
                İptal
              </Button>
              <Button onClick={handleRatingSubmit} disabled={!selectedRating || isSubmitting}>
                {isSubmitting ? "Gönderiliyor..." : "Değerlendir"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
