"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { updateEvent } from "@/lib/actions"
import { toast } from "@/components/ui/use-toast"
import { checkIsVenueOwner } from "@/lib/auth"

// Örnek mekan verileri
const DUMMY_VENUES = [
  { id: "1", name: "Cafe Isparta" },
  { id: "2", name: "Gül Restaurant" },
]

interface EventEditPageProps {
  params: {
    id: string
  }
}

export default function EventEditPage({ params }: EventEditPageProps) {
  const router = useRouter()
  const { id } = params
  const [isLoading, setIsLoading] = useState(false)
  const [event, setEvent] = useState<any>(null)
  const [isLoadingEvent, setIsLoadingEvent] = useState(true)
  const [venues, setVenues] = useState(DUMMY_VENUES)

  useEffect(() => {
    async function loadEvent() {
      try {
        // Önce kullanıcının mekan sahibi olup olmadığını kontrol et
        const userCheck = await checkIsVenueOwner()
        if (!userCheck.isVenueOwner) {
          toast({
            title: "Yetkisiz Erişim",
            description: "Etkinlik düzenlemek için mekan sahibi olmalısınız.",
            variant: "destructive",
          })
          router.push("/")
          return
        }

        // Gerçek uygulamada bu veri API'den gelecek
        // Şimdilik örnek veri kullanıyoruz
        const eventData = {
          id: id,
          title: "Canlı Müzik Gecesi",
          venueId: "1",
          date: "2023-12-15",
          time: "20:00 - 23:00",
          description: "Isparta'nın en iyi müzisyenleriyle unutulmaz bir gece.",
          imageUrl: "/placeholder.svg?height=200&width=400",
          capacity: 100,
        }

        // Kullanıcının bu etkinliğin mekanının sahibi olup olmadığını kontrol et
        const venueCheck = await checkIsVenueOwner(eventData.venueId)
        if (!venueCheck.isOwner) {
          toast({
            title: "Yetkisiz Erişim",
            description: "Bu etkinliği düzenleme yetkiniz yok.",
            variant: "destructive",
          })
          router.push("/panel/etkinlikler")
          return
        }

        setEvent(eventData)
      } catch (error) {
        toast({
          title: "Hata",
          description: "Etkinlik bilgileri yüklenirken bir hata oluştu.",
          variant: "destructive",
        })
        router.push("/panel/etkinlikler")
      } finally {
        setIsLoadingEvent(false)
      }
    }

    loadEvent()
  }, [id, router])

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const title = formData.get("title") as string
    const venueId = formData.get("venueId") as string
    const date = formData.get("date") as string
    const time = formData.get("time") as string
    const description = formData.get("description") as string
    //const capacity = Number.parseInt(formData.get("capacity") as string)

    try {
      await updateEvent(id, {
        title,
        venueId,
        date,
        time,
        description,
        //capacity,
      })

      toast({
        title: "Etkinlik güncellendi",
        description: "Etkinlik bilgileri başarıyla güncellendi.",
      })

      router.push("/panel/etkinlikler")
    } catch (error) {
      toast({
        title: "Hata",
        description: "Etkinlik güncellenirken bir hata oluştu. Lütfen tekrar deneyin.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoadingEvent) {
    return <div className="py-12 text-center">Etkinlik bilgileri yükleniyor...</div>
  }

  if (!event) {
    return <div className="py-12 text-center">Etkinlik bulunamadı.</div>
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Etkinlik Düzenle</h1>

      <Card>
        <CardHeader>
          <CardTitle>Etkinlik Bilgileri</CardTitle>
          <CardDescription>Etkinliğinizin bilgilerini güncelleyin. Tüm alanlar zorunludur.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Etkinlik Adı</Label>
              <Input id="title" name="title" defaultValue={event.title} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="venueId">Mekan</Label>
              <Select name="venueId" defaultValue={event.venueId} required>
                <SelectTrigger>
                  <SelectValue placeholder="Mekan seçin" />
                </SelectTrigger>
                <SelectContent>
                  {venues.map((venue) => (
                    <SelectItem key={venue.id} value={venue.id}>
                      {venue.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Tarih</Label>
                <Input id="date" name="date" type="date" defaultValue={event.date} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Saat</Label>
                <Input id="time" name="time" defaultValue={event.time} required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Açıklama</Label>
              <Textarea id="description" name="description" defaultValue={event.description} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Etkinlik Görseli</Label>
              {event.imageUrl && (
                <div className="mb-2">
                  <img
                    src={event.imageUrl || "/placeholder.svg"}
                    alt={event.title}
                    className="w-full max-w-md h-48 object-cover rounded-md"
                  />
                </div>
              )}
              <Input id="image" name="image" type="file" accept="image/*" />
              <p className="text-sm text-gray-500">
                Yeni bir görsel yükleyerek mevcut görseli değiştirebilirsiniz. (İsteğe bağlı)
              </p>
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <Button type="button" variant="outline" onClick={() => router.push("/panel/etkinlikler")}>
                İptal
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Güncelleniyor..." : "Etkinliği Güncelle"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
