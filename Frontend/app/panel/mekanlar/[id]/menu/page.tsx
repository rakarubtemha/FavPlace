"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import MenuSection from "@/components/menu-section"
import { getVenue, checkIsVenueOwner } from "@/lib/actions"
import { useRouter } from "next/navigation"

interface MenuManagementPageProps {
  params: {
    id: string
  }
}

export default function MenuManagementPage({ params }: MenuManagementPageProps) {
  const { id } = params
  const router = useRouter()
  const [venue, setVenue] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isOwner, setIsOwner] = useState(false)

  useEffect(() => {
    async function loadVenue() {
      try {
        // Mekan sahibi olup olmadığını kontrol et
        const ownerCheck = await checkIsVenueOwner(id)
        setIsOwner(ownerCheck.isOwner)

        // Eğer mekan sahibi değilse, mekanlar sayfasına yönlendir
        if (!ownerCheck.isOwner) {
          toast({
            title: "Yetkisiz Erişim",
            description: "Bu mekanın sahibi olmadığınız için menü yönetimi yapamazsınız.",
            variant: "destructive",
          })
          router.push("/panel/mekanlar")
          return
        }

        // Gerçek uygulamada bu veri API'den gelecek
        const venueData = await getVenue(id)

        // Örnek menü verisi (gerçek uygulamada API'den gelecek)
        venueData.menu = venueData.menu || [
          {
            id: "1",
            category: "Kahveler",
            items: [
              { id: "101", name: "Espresso", description: "Yoğun aromalı espresso", price: 25 },
              { id: "102", name: "Americano", description: "Espresso ve sıcak su", price: 30 },
            ],
          },
          {
            id: "2",
            category: "Tatlılar",
            items: [{ id: "201", name: "Cheesecake", description: "Ev yapımı cheesecake", price: 45 }],
          },
        ]

        setVenue(venueData)
      } catch (error) {
        console.error("Mekan yüklenirken hata:", error)
        toast({
          title: "Hata",
          description: "Mekan bilgileri yüklenirken bir hata oluştu.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadVenue()
  }, [id, router])

  if (isLoading) {
    return <div className="py-12 text-center">Mekan bilgileri yükleniyor...</div>
  }

  if (!venue || !isOwner) {
    return <div className="py-12 text-center">Mekan bulunamadı veya erişim yetkiniz yok.</div>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link href={`/panel/mekanlar`}>
            <Button variant="ghost" className="pl-0 flex items-center gap-2 mb-2">
              <ArrowLeft size={16} />
              Mekanlara Dön
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">{venue.name} - Menü Yönetimi</h1>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border">
        <MenuSection menu={venue.menu} venueId={id} isOwner={true} />
      </div>
    </div>
  )
}
