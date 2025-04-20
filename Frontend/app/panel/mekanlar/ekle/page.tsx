"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { addVenue } from "@/lib/actions"
import { toast } from "@/components/ui/use-toast"

export default function AddVenuePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    const formData = new FormData(event.currentTarget)
    const name = formData.get("name") as string
    const address = formData.get("address") as string
    const phone = formData.get("phone") as string
    const openingHours = formData.get("openingHours") as string
    const description = formData.get("description") as string
    // Normalde bir resim yükleme alanı da olurdu

    try {
      await addVenue({
        name,
        address,
        phone,
        openingHours,
        description,
      })

      toast({
        title: "Mekan eklendi",
        description: "Mekan başarıyla eklendi.",
      })

      router.push("/panel/mekanlar")
    } catch (error) {
      toast({
        title: "Hata",
        description: "Mekan eklenirken bir hata oluştu. Lütfen tekrar deneyin.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Yeni Mekan Ekle</h1>

      <Card>
        <CardHeader>
          <CardTitle>Mekan Bilgileri</CardTitle>
          <CardDescription>Mekanınızın bilgilerini doldurun. Tüm alanlar zorunludur.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Mekan Adı</Label>
              <Input id="name" name="name" placeholder="Mekan adını girin" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Adres</Label>
              <Textarea id="address" name="address" placeholder="Mekanın tam adresini girin" required />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Telefon</Label>
                <Input id="phone" name="phone" placeholder="0246 123 45 67" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="openingHours">Çalışma Saatleri</Label>
                <Input id="openingHours" name="openingHours" placeholder="09:00 - 23:00" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Açıklama</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Mekanınız hakkında kısa bir açıklama yazın"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Mekan Görseli</Label>
              <Input id="image" name="image" type="file" accept="image/*" />
              <p className="text-sm text-gray-500">Mekanınızın bir fotoğrafını yükleyin. (İsteğe bağlı)</p>
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <Button type="button" variant="outline" onClick={() => router.push("/panel/mekanlar")}>
                İptal
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Ekleniyor..." : "Mekanı Ekle"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
