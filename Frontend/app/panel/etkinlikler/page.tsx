"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Edit, Trash2, MapPin, Clock } from "lucide-react"
import { deleteEvent } from "@/lib/actions"
import { toast } from "@/components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"

// Örnek etkinlik verileri
const DUMMY_EVENTS = [
  {
    id: "1",
    title: "Canlı Müzik Gecesi",
    venue: "Cafe Isparta",
    venueId: "1",
    date: "2023-12-15",
    time: "20:00 - 23:00",
    description: "Isparta'nın en iyi müzisyenleriyle unutulmaz bir gece.",
    capacity: 50,
    imageUrl: "/placeholder.svg?height=200&width=400",
  },
  {
    id: "2",
    title: "Şiir Dinletisi",
    venue: "Gül Restaurant",
    venueId: "2",
    date: "2023-12-20",
    time: "19:00 - 21:00",
    description: "Yerel şairlerden şiir dinletisi ve söyleşi.",
    capacity: 30,
    imageUrl: "/placeholder.svg?height=200&width=400",
  },
]

export default function EventsPage() {
  const [events, setEvents] = useState(DUMMY_EVENTS)
  const [isDeleting, setIsDeleting] = useState(false)

  async function handleDeleteEvent(eventId: string) {
    setIsDeleting(true)
    try {
      await deleteEvent(eventId)
      setEvents(events.filter((event) => event.id !== eventId))
      toast({
        title: "Etkinlik silindi",
        description: "Etkinlik başarıyla silindi.",
      })
    } catch (error) {
      toast({
        title: "Hata",
        description: "Etkinlik silinirken bir hata oluştu.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Etkinliklerim</h1>
        <Link href="/panel/etkinlikler/ekle">
          <Button className="gap-2">
            <Plus size={16} />
            Yeni Etkinlik Ekle
          </Button>
        </Link>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">Henüz etkinlik eklemediniz</h2>
          <p className="text-gray-600 mb-6">İlk etkinliğinizi ekleyerek başlayın.</p>
          <Link href="/panel/etkinlikler/ekle">
            <Button>Etkinlik Ekle</Button>
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <Card key={event.id}>
              <img
                src={event.imageUrl || "/placeholder.svg"}
                alt={event.title}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>{event.title}</CardTitle>
                  <Badge>{new Date(event.date).toLocaleDateString("tr-TR")}</Badge>
                </div>
                <CardDescription>{event.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                  <span>{event.venue}</span>
                </div>
                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                  <span>{event.time}</span>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Link href={`/panel/etkinlikler/duzenle/${event.id}`}>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Edit size={16} />
                    Düzenle
                  </Button>
                </Link>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                      Sil
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Etkinliği silmek istediğinize emin misiniz?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Bu işlem geri alınamaz. Bu etkinlik kalıcı olarak silinecektir.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>İptal</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeleteEvent(event.id)}
                        disabled={isDeleting}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        {isDeleting ? "Siliniyor..." : "Evet, Sil"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
