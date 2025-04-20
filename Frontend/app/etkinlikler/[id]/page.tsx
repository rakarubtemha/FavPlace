"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MapPin, Clock, Calendar, ArrowLeft } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import EventRating from "@/components/event-rating"
import CommentSection from "@/components/comment-section"
import FavoriteButton from "@/components/favorite-button"

interface EventDetailPageProps {
  params: {
    id: string
  }
}

export default function EventDetailPage({ params }: EventDetailPageProps) {
  const { id } = params
  const [event, setEvent] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadEvent() {
      try {
        // Gerçek uygulamada bu veri API'den gelecek
        // Şimdilik örnek veri kullanıyoruz
        const eventData = {
          id: id,
          title: "Canlı Müzik Gecesi",
          venue: "Cafe Isparta",
          venueId: "1",
          date: "2023-12-15",
          time: "20:00 - 23:00",
          description:
            "Isparta'nın en iyi müzisyenleriyle unutulmaz bir gece. Canlı performanslar, özel içecek menüsü ve eğlenceli bir atmosfer sizi bekliyor. Rezervasyon yapmanız önerilir, sınırlı sayıda yerimiz bulunmaktadır.",
          capacity: 50,
          imageUrl: "/placeholder.svg?height=400&width=800",
          rating: 4.5,
          ratingCount: 12,
          address: "Merkez, Isparta",
          organizer: "Cafe Isparta Etkinlik Ekibi",
          price: "Ücretsiz",
          comments: [
            {
              id: "1",
              user: "Ahmet Yılmaz",
              date: "2023-11-20",
              content: "Geçen seneki etkinlik harikaydı, bu sene de katılacağım!",
              rating: 5,
            },
            {
              id: "2",
              user: "Ayşe Demir",
              date: "2023-11-22",
              content: "Müzisyenler kimler olacak acaba?",
              rating: 0,
            },
            {
              id: "3",
              user: "Mehmet Kaya",
              date: "2023-11-25",
              content: "Rezervasyon yaptırdım, heyecanla bekliyorum.",
              rating: 0,
            },
          ],
        }

        setEvent(eventData)
      } catch (error) {
        console.error("Etkinlik yüklenirken hata:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadEvent()
  }, [id])

  if (isLoading) {
    return (
      <div className="container py-12">
        <div className="text-center py-12">Etkinlik bilgileri yükleniyor...</div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="container py-12">
        <div className="text-center py-12">Etkinlik bulunamadı.</div>
      </div>
    )
  }

  return (
    <div className="container py-12">
      <div className="mb-6 flex justify-between items-center">
        <Link href="/etkinlikler">
          <Button variant="ghost" className="pl-0 flex items-center gap-2">
            <ArrowLeft size={16} />
            Etkinliklere Dön
          </Button>
        </Link>
        <FavoriteButton id={id} type="event" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <img
            src={event.imageUrl || "/placeholder.svg"}
            alt={event.title}
            className="w-full h-64 md:h-96 object-cover rounded-lg mb-6"
          />

          <h1 className="text-3xl font-bold mb-4">{event.title}</h1>

          <div className="flex items-center mb-6">
            <EventRating rating={event.rating} ratingCount={event.ratingCount} eventId={event.id} />
          </div>

          <Tabs defaultValue="details">
            <TabsList className="mb-4">
              <TabsTrigger value="details">Detaylar</TabsTrigger>
              <TabsTrigger value="comments">Yorumlar ({event.comments.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">Etkinlik Açıklaması</h2>
                <p className="text-gray-700">{event.description}</p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">Organizatör</h2>
                <p className="text-gray-700">{event.organizer}</p>
              </div>
            </TabsContent>

            <TabsContent value="comments">
              <CommentSection comments={event.comments} itemId={event.id} itemType="event" />
            </TabsContent>
          </Tabs>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-gray-50 p-6 rounded-lg border mb-6">
            <h2 className="text-xl font-semibold mb-4">Etkinlik Bilgileri</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <Calendar className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                <div>
                  <p className="font-medium">Tarih</p>
                  <p className="text-gray-600">{event.date}</p>
                </div>
              </div>
              <div className="flex items-start">
                <Clock className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                <div>
                  <p className="font-medium">Saat</p>
                  <p className="text-gray-600">{event.time}</p>
                </div>
              </div>
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                <div>
                  <p className="font-medium">Mekan</p>
                  <p className="text-gray-600">{event.venue}</p>
                  <p className="text-gray-600">{event.address}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-rose-50 p-6 rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">Katılım</h2>
            <p className="text-gray-700 mb-4">Bu etkinliğe katılmak için aşağıdaki butona tıklayabilirsiniz.</p>
            <p className="font-medium mb-2">Ücret: {event.price}</p>
            <Button className="w-full">Katıl</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
