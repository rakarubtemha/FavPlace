"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { updateVenue } from "@/lib/actions"
import { toast } from "@/components/ui/use-toast"

interface VenueEditPageProps {
  params: {
    id: string
  }
}

export default function VenueEditPage({ params }: VenueEditPageProps) {
  const router = useRouter()
  const { id } = params
  const [isLoading, setIsLoading] = useState(false)
  const [venue, setVenue] = useState<any>(null)
  const [isLoadingVenue, setIsLoadingVenue] = useState(true)

  useEffect(() => {
    async function loadVenue() {
      try {
        // Gerçek uygulamada bu veri API'den gelecek
        // Şimdilik örnek veri kullanıyoruz
        const venueData = {
          id: id,
          name: "Cafe Isparta",
          address: "Merkez, Isparta",
          phone: "0246 123 45 67",
          openingHours: "09:00 - 23:00",
          description: "Isparta'nın merkezinde şık bir kafe.",
          imageUrl: "/placeholder.svg?height=200&width=400",
        }

        setVenue(venueData)
      } catch (error) {
        toast({
          title: "Hata",
          description: "Mekan bilgileri yüklenirken bir hata oluştu.",
          variant: "destructive",
        })
        router.push("/panel/mekanlar")
      } finally {
        setIsLoadingVenue(false)
      }
    }

    loadVenue()
  }, [id, router])

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    const formData = new FormData(event.currentTarget)
    const name = formData.get("name") as string
    const address = formData.get("address") as string
    const phone = formData.get("phone") as string
    const openingHours = formData.get("openingHours") as string
    const description = formData.get("description") as string

    try {
      await updateVenue(id, {
        name,
        address,
        phone,
        openingHours,
        description,
      })

      toast({
        title: "Mekan güncellendi",
        description: "Mekan bilgileri başarıyla güncellendi.",
      })

      router.push("/panel/mekanlar")
    } catch (error) {
      toast({
        title: "Hata",
        description: "Mekan güncellenirken bir hata oluştu. Lütfen tekrar deneyin.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoadingVenue) {
    return <div className="py-12 text-center">Mekan bilgileri yükleniyor...</div>
  }

  if (!venue) {
    return <div className="py-12 text-center">Mekan bulunamadı.</div>
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Mekan Düzenle</h1>

      <Card>
        <CardHeader>
          <CardTitle>Mekan Bilgileri</CardTitle>
          <CardDescription>Mekanınızın bilgilerini güncelleyin. Tüm alanlar zorunludur.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Mekan Adı</Label>
              <Input id="name" name="name" defaultValue={venue.name} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Adres</Label>
              <Textarea id="address" name="address" defaultValue={venue.address} required />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Telefon</Label>
                <Input id="phone" name="phone" defaultValue={venue.phone} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="openingHours">Çalışma Saatleri</Label>
                <Input id="openingHours" name="openingHours" defaultValue={venue.openingHours} required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Açıklama</Label>
              <Textarea id="description" name="description" defaultValue={venue.description} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Mekan Görseli</Label>
              {venue.imageUrl && (
                <div className="mb-2">
                  <img
                    src={venue.imageUrl || "/placeholder.svg"}
                    alt={venue.name}
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
              <Button type="button" variant="outline" onClick={() => router.push("/panel/mekanlar")}>
                İptal
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Güncelleniyor..." : "Mekanı Güncelle"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
