"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MapPin, Phone, Clock, ArrowLeft, Calendar } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import VenueRating from "@/components/venue-rating"
import CommentSection from "@/components/comment-section"
import FavoriteButton from "@/components/favorite-button"
import MenuSection from "@/components/menu-section"

interface VenueDetailPageProps {
  params: {
    id: string
  }
}

export default function VenueDetailPage({ params }: VenueDetailPageProps) {
  const { id } = params
  const [venue, setVenue] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

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
          description:
            "Isparta'nın merkezinde şık bir kafe. Modern dekorasyonu, geniş menüsü ve samimi atmosferiyle misafirlerine keyifli anlar yaşatıyor. Kahve çeşitleri, tatlılar ve atıştırmalıklar sunan kafemiz, çalışmak veya arkadaşlarla buluşmak için ideal bir mekan.",
          imageUrl: "/placeholder.svg?height=400&width=800",
          rating: 4.5,
          ratingCount: 28,
          website: "https://cafeisparta.com",
          socialMedia: {
            instagram: "@cafeisparta",
            facebook: "CafeIsparta",
          },
          comments: [
            {
              id: "1",
              user: "Ahmet Yılmaz",
              date: "2023-11-10",
              content: "Kahveleri harika, personel çok ilgili. Kesinlikle tavsiye ederim.",
              rating: 5,
            },
            {
              id: "2",
              user: "Ayşe Demir",
              date: "2023-11-15",
              content: "Güzel bir ortam ama bazen çok kalabalık olabiliyor.",
              rating: 4,
            },
            {
              id: "3",
              user: "Mehmet Kaya",
              date: "2023-11-20",
              content: "Fiyatlar biraz yüksek ama kalite iyi.",
              rating: 4,
            },
          ],
          upcomingEvents: [
            {
              id: "1",
              title: "Canlı Müzik Gecesi",
              date: "2023-12-15",
              time: "20:00 - 23:00",
            },
            {
              id: "2",
              title: "Kitap Kulübü Buluşması",
              date: "2023-12-10",
              time: "18:00 - 20:00",
            },
          ],
          menu: [
            {
              id: "1",
              category: "Kahveler",
              items: [
                { id: "101", name: "Espresso", description: "Yoğun aromalı espresso", price: 25 },
                { id: "102", name: "Americano", description: "Espresso ve sıcak su", price: 30 },
                { id: "103", name: "Latte", description: "Espresso ve buharla ısıtılmış süt", price: 35 },
              ],
            },
            {
              id: "2",
              category: "Tatlılar",
              items: [
                { id: "201", name: "Cheesecake", description: "Ev yapımı cheesecake", price: 45 },
                { id: "202", name: "Brownie", description: "Sıcak çikolatalı brownie", price: 40 },
              ],
            },
            {
              id: "3",
              category: "Atıştırmalıklar",
              items: [
                { id: "301", name: "Tost", description: "Kaşarlı tost", price: 35 },
                { id: "302", name: "Sandviç", description: "Tavuklu sandviç", price: 45 },
              ],
            },
          ],
        }

        setVenue(venueData)
      } catch (error) {
        console.error("Mekan yüklenirken hata:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadVenue()
  }, [id])

  if (isLoading) {
    return (
      <div className="container py-12">
        <div className="text-center py-12">Mekan bilgileri yükleniyor...</div>
      </div>
    )
  }

  if (!venue) {
    return (
      <div className="container py-12">
        <div className="text-center py-12">Mekan bulunamadı.</div>
      </div>
    )
  }

  return (
    <div className="container py-12">
      <div className="mb-6 flex justify-between items-center">
        <Link href="/mekanlar">
          <Button variant="ghost" className="pl-0 flex items-center gap-2">
            <ArrowLeft size={16} />
            Mekanlara Dön
          </Button>
        </Link>
        <FavoriteButton id={id} type="venue" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <img
            src={venue.imageUrl || "/placeholder.svg"}
            alt={venue.name}
            className="w-full h-64 md:h-96 object-cover rounded-lg mb-6"
          />

          <h1 className="text-3xl font-bold mb-4">{venue.name}</h1>

          <div className="flex items-center mb-6">
            <VenueRating rating={venue.rating} ratingCount={venue.ratingCount} venueId={venue.id} />
          </div>

          <Tabs defaultValue="details">
            <TabsList className="mb-4">
              <TabsTrigger value="details">Detaylar</TabsTrigger>
              <TabsTrigger value="menu">Menü</TabsTrigger>
              <TabsTrigger value="events">Etkinlikler</TabsTrigger>
              <TabsTrigger value="comments">Yorumlar ({venue.comments.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">Mekan Hakkında</h2>
                <p className="text-gray-700">{venue.description}</p>
              </div>

              {venue.website && (
                <div>
                  <h2 className="text-xl font-semibold mb-2">İletişim</h2>
                  <p className="text-gray-700">
                    <a href={venue.website} target="_blank" rel="noopener noreferrer" className="text-rose-600">
                      {venue.website}
                    </a>
                  </p>
                  {venue.socialMedia && (
                    <div className="mt-2">
                      {venue.socialMedia.instagram && <p className="text-gray-700">{venue.socialMedia.instagram}</p>}
                      {venue.socialMedia.facebook && <p className="text-gray-700">{venue.socialMedia.facebook}</p>}
                    </div>
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="menu">
              <MenuSection menu={venue.menu} venueId={venue.id} isOwner={false} />
            </TabsContent>

            <TabsContent value="events">
              <h2 className="text-xl font-semibold mb-4">Yaklaşan Etkinlikler</h2>
              {venue.upcomingEvents && venue.upcomingEvents.length > 0 ? (
                <div className="grid gap-4">
                  {venue.upcomingEvents.map((event: any) => (
                    <Card key={event.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle>{event.title}</CardTitle>
                          <Badge>{new Date(event.date).toLocaleDateString("tr-TR")}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="flex items-center">
                          <Calendar className="h-5 w-5 text-gray-500 mr-2" />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center mt-1">
                          <Clock className="h-5 w-5 text-gray-500 mr-2" />
                          <span>{event.time}</span>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Link href={`/etkinlikler/${event.id}`}>
                          <Button variant="outline">Detayları Gör</Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">Bu mekanda yaklaşan etkinlik bulunmuyor.</p>
              )}
            </TabsContent>

            <TabsContent value="comments">
              <CommentSection comments={venue.comments} itemId={venue.id} itemType="venue" />
            </TabsContent>
          </Tabs>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-gray-50 p-6 rounded-lg border mb-6">
            <h2 className="text-xl font-semibold mb-4">Mekan Bilgileri</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                <div>
                  <p className="font-medium">Adres</p>
                  <p className="text-gray-600">{venue.address}</p>
                </div>
              </div>
              <div className="flex items-start">
                <Phone className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                <div>
                  <p className="font-medium">Telefon</p>
                  <p className="text-gray-600">{venue.phone}</p>
                </div>
              </div>
              <div className="flex items-start">
                <Clock className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                <div>
                  <p className="font-medium">Çalışma Saatleri</p>
                  <p className="text-gray-600">{venue.openingHours}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-rose-50 p-6 rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">Etkinlik Oluştur</h2>
            <p className="text-gray-700 mb-4">Bu mekanda etkinlik oluşturmak için mekan sahibi olmalısınız.</p>
            <Link href="/panel/etkinlikler/ekle">
              <Button className="w-full">Etkinlik Oluştur</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
