"use client"

import { useState, useEffect } from "react"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { addToFavorites, removeFromFavorites, checkIsFavorite } from "@/lib/actions"

interface FavoriteButtonProps {
  id: string
  type: "venue" | "event"
  className?: string
}

export default function FavoriteButton({ id, type, className = "" }: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function checkFavoriteStatus() {
      try {
        const result = await checkIsFavorite(id, type)
        setIsFavorite(result.isFavorite)
      } catch (error) {
        console.error("Favori durumu kontrol edilirken hata:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkFavoriteStatus()
  }, [id, type])

  async function toggleFavorite() {
    setIsLoading(true)
    try {
      if (isFavorite) {
        await removeFromFavorites(id, type)
        toast({
          title: "Favorilerden kaldırıldı",
          description: type === "venue" ? "Mekan favorilerden kaldırıldı." : "Etkinlik favorilerden kaldırıldı.",
        })
      } else {
        await addToFavorites(id, type)
        toast({
          title: "Favorilere eklendi",
          description: type === "venue" ? "Mekan favorilere eklendi." : "Etkinlik favorilere eklendi.",
        })
      }
      setIsFavorite(!isFavorite)
    } catch (error) {
      toast({
        title: "Hata",
        description: "İşlem sırasında bir hata oluştu.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant="outline"
      size="icon"
      className={`${className} ${isFavorite ? "text-rose-600 border-rose-200 hover:bg-rose-50" : ""}`}
      onClick={toggleFavorite}
      disabled={isLoading}
    >
      <Heart className={isFavorite ? "fill-rose-600" : ""} size={18} />
    </Button>
  )
}
