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
import { addEvent, getUserVenues, checkIsVenueOwner } from "@/lib/actions"
import { toast } from "@/components/ui/use-toast"

export default function AddEventPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [venues, setVenues] = useState<any[]>([])
  const [isLoadingVenues, setIsLoadingVenues] = useState(true)
  const [isVenueOwner, setIsVenueOwner] = useState(false)

  useEffect(() => {
    async function checkPermissionsAndLoadVenues() {
      try {
        // Kullanıcının mekan sahibi olup olmadığını kontrol et
        const userCheck = await checkIsVenueOwner()
        setIsVenueOwner(userCheck.isVenueOwner)

        // Eğer mekan sahibi değilse, ana sayfaya yönlendir
        if (!userCheck.isVenueOwner) {
          toast({
            title: "Yetkisiz Erişim",
            description: "Etkinlik oluşturmak için mekan sahibi olmalısınız.",
            variant: "destructive",
          })
          router.push("/")
          return
        }

        // Kullanıcının kendi mekanlarını getir
        const userVenues = await getUserVenues()
        setVenues(userVenues)
      } catch (error) {
        console.error("Mekanlar yüklenirken hata:", error)
        toast({
          title: "Hata",
          description: "Mekanlar yüklenirken bir hata oluştu.",
          variant: "destructive",
        })
      } finally {
        setIsLoadingVenues(false)
      }
    }

    checkPermissionsAndLoadVenues()
  }, [router])

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    const formData = new FormData(event.currentTarget)
    const title = formData.get("title") as string
    const venueId = formData.get("venueId") as string
    const date = formData.get("date") as string
    const time = formData.get("time") as string
    const description = formData.get("description") as string
    //const capacity = Number.parseInt(formData.get("capacity") as string)

    try {
      await addEvent({
        title,
        venueId,
        date,
        time,
        description,
        //capacity,
      })

      toast({
        title: "Etkinlik eklendi",
        description: "Etkinlik başarıyla eklendi.",
      })

      router.push("/panel/etkinlikler")
    } catch (error) {
      toast({
        title: "Hata",
        description: "Etkinlik eklenirken bir hata oluştu. Lütfen tekrar deneyin.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoadingVenues) {
    return <div className="py-12 text-center">Mekanlar yükleniyor...</div>
  }

  if (!isVenueOwner) {
    return <div className="py-12 text-center">Bu sayfaya erişim yetkiniz bulunmuyor.</div>
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Yeni Etkinlik Ekle</h1>

      <Card>
        <CardHeader>
          <CardTitle>Etkinlik Bilgileri</CardTitle>
          <CardDescription>Etkinliğinizin bilgilerini doldurun. Tüm alanlar zorunludur.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Etkinlik Adı</Label>
              <Input id="title" name="title" placeholder="Etkinlik adını girin" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="venueId">Mekan</Label>
              <Select name="venueId" required>
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
                <Input id="date" name="date" type="date" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Saat</Label>
                <Input id="time" name="time" placeholder="19:00 - 22:00" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Açıklama</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Etkinliğiniz hakkında kısa bir açıklama yazın"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Etkinlik Görseli</Label>
              <Input id="image" name="image" type="file" accept="image/*" />
              <p className="text-sm text-gray-500">Etkinliğinizin bir fotoğrafını yükleyin. (İsteğe bağlı)</p>
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <Button type="button" variant="outline" onClick={() => router.push("/panel/etkinlikler")}>
                İptal
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Ekleniyor..." : "Etkinliği Ekle"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
