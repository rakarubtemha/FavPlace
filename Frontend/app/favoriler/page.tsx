"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Clock, Calendar, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import VenueRating from "@/components/venue-rating"
import EventRating from "@/components/event-rating"
import { removeFromFavorites, getFavorites } from "@/lib/actions"

export default function FavoritesPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [favoriteVenues, setFavoriteVenues] = useState<any[]>([])
  const [favoriteEvents, setFavoriteEvents] = useState<any[]>([])

  useEffect(() => {
    async function loadFavorites() {
      try {
        // Gerçek uygulamada bu veri API'den gelecek
        const data = await getFavorites()
        setFavoriteVenues(data.venues)
        setFavoriteEvents(data.events)
      } catch (error) {
        console.error("Favoriler yüklenirken hata:", error)
        toast({
          title: "Hata",
          description: "Favoriler yüklenirken bir hata oluştu.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadFavorites()
  }, [])

  async function handleRemoveFromFavorites(id: string, type: "venue" | "event") {
    try {
      await removeFromFavorites(id, type)

      if (type === "venue") {
        setFavoriteVenues(favoriteVenues.filter((venue) => venue.id !== id))
      } else {
        setFavoriteEvents(favoriteEvents.filter((event) => event.id !== id))
      }

      toast({
        title: "Favorilerden kaldırıldı",
        description: type === "venue" ? "Mekan favorilerden kaldırıldı." : "Etkinlik favorilerden kaldırıldı.",
      })
    } catch (error) {
      toast({
        title: "Hata",
        description: "Favorilerden kaldırılırken bir hata oluştu.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="container py-12">
        <h1 className="text-3xl font-bold mb-6">Favorilerim</h1>
        <div className="text-center py-12">Favoriler yükleniyor...</div>
      </div>
    )
  }

  const hasNoFavorites = favoriteVenues.length === 0 && favoriteEvents.length === 0

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-6">Favorilerim</h1>

      {hasNoFavorites ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border">
          <h2 className="text-xl font-semibold mb-2">Henüz favoriniz yok</h2>
          <p className="text-gray-600 mb-6">
            Mekanları ve etkinlikleri favorilerinize ekleyerek burada görüntüleyebilirsiniz.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/mekanlar">
              <Button>Mekanları Keşfet</Button>
            </Link>
            <Link href="/etkinlikler">
              <Button variant="outline">Etkinlikleri Keşfet</Button>
            </Link>
          </div>
        </div>
      ) : (
        <Tabs defaultValue="venues">
          <TabsList className="mb-6">
            <TabsTrigger value="venues">Mekanlar ({favoriteVenues.length})</TabsTrigger>
            <TabsTrigger value="events">Etkinlikler ({favoriteEvents.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="venues">
            {favoriteVenues.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg border">
                <p className="text-gray-600">Favori mekanınız bulunmuyor.</p>
                <Link href="/mekanlar" className="mt-4 inline-block">
                  <Button>Mekanları Keşfet</Button>
                </Link>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoriteVenues.map((venue) => (
                  <Card key={venue.id} className="flex flex-col h-full">
                    <img
                      src={venue.imageUrl || "/placeholder.svg"}
                      alt={venue.name}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xl">{venue.name}</CardTitle>
                      <CardDescription>{venue.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2 pb-2 flex-grow">
                      <div className="flex items-start">
                        <MapPin className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                        <span>{venue.address}</span>
                      </div>
                      <div className="flex items-start">
                        <Clock className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                        <span>{venue.openingHours}</span>
                      </div>
                      <div className="flex items-center mt-2">
                        <VenueRating rating={venue.rating} ratingCount={venue.ratingCount} userCanRate={false} />
                      </div>
                    </CardContent>
                    <CardFooter className="pt-2 flex justify-between gap-2">
                      <Link href={`/mekanlar/${venue.id}`} className="flex-1">
                        <Button variant="outline" className="w-full">
                          Detaylar
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                        onClick={() => handleRemoveFromFavorites(venue.id, "venue")}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="events">
            {favoriteEvents.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg border">
                <p className="text-gray-600">Favori etkinliğiniz bulunmuyor.</p>
                <Link href="/etkinlikler" className="mt-4 inline-block">
                  <Button>Etkinlikleri Keşfet</Button>
                </Link>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoriteEvents.map((event) => (
                  <Card key={event.id} className="flex flex-col h-full">
                    <img
                      src={event.imageUrl || "/placeholder.svg"}
                      alt={event.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-xl">{event.title}</CardTitle>
                        <Badge>{new Date(event.date).toLocaleDateString("tr-TR")}</Badge>
                      </div>
                      <CardDescription>{event.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2 pb-2 flex-grow">
                      <div className="flex items-start">
                        <MapPin className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                        <span>{event.venue}</span>
                      </div>
                      <div className="flex items-start">
                        <Calendar className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-start">
                        <Clock className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center mt-2">
                        <EventRating rating={event.rating} ratingCount={event.ratingCount} userCanRate={false} />
                      </div>
                    </CardContent>
                    <CardFooter className="pt-2 flex justify-between gap-2">
                      <Link href={`/etkinlikler/${event.id}`} className="flex-1">
                        <Button variant="outline" className="w-full">
                          Detaylar
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                        onClick={() => handleRemoveFromFavorites(event.id, "event")}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
