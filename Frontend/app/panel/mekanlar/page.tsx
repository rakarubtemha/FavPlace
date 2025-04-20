"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Edit, Trash2, MapPin, Phone, Clock } from "lucide-react"
import { deleteVenue } from "@/lib/actions"
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

// Örnek mekan verileri
const DUMMY_VENUES = [
  {
    id: "1",
    name: "Cafe Isparta",
    address: "Merkez, Isparta",
    phone: "0246 123 45 67",
    openingHours: "09:00 - 23:00",
    description: "Isparta'nın merkezinde şık bir kafe.",
    imageUrl: "/placeholder.svg?height=200&width=400",
  },
  {
    id: "2",
    name: "Gül Restaurant",
    address: "Çünür, Isparta",
    phone: "0246 234 56 78",
    openingHours: "11:00 - 22:00",
    description: "Geleneksel lezzetlerin modern sunumu.",
    imageUrl: "/placeholder.svg?height=200&width=400",
  },
]

export default function VenuesPage() {
  const [venues, setVenues] = useState(DUMMY_VENUES)
  const [isDeleting, setIsDeleting] = useState(false)

  async function handleDeleteVenue(venueId: string) {
    setIsDeleting(true)
    try {
      await deleteVenue(venueId)
      setVenues(venues.filter((venue) => venue.id !== venueId))
      toast({
        title: "Mekan silindi",
        description: "Mekan başarıyla silindi.",
      })
    } catch (error) {
      toast({
        title: "Hata",
        description: "Mekan silinirken bir hata oluştu.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Mekanlarım</h1>
        <Link href="/panel/mekanlar/ekle">
          <Button className="gap-2">
            <Plus size={16} />
            Yeni Mekan Ekle
          </Button>
        </Link>
      </div>

      {venues.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">Henüz mekan eklemediniz</h2>
          <p className="text-gray-600 mb-6">İlk mekanınızı ekleyerek başlayın.</p>
          <Link href="/panel/mekanlar/ekle">
            <Button>Mekan Ekle</Button>
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {venues.map((venue) => (
            <Card key={venue.id}>
              <img
                src={venue.imageUrl || "/placeholder.svg"}
                alt={venue.name}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <CardHeader>
                <CardTitle>{venue.name}</CardTitle>
                <CardDescription>{venue.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                  <span>{venue.address}</span>
                </div>
                <div className="flex items-start">
                  <Phone className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                  <span>{venue.phone}</span>
                </div>
                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                  <span>{venue.openingHours}</span>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Link href={`/panel/mekanlar/duzenle/${venue.id}`}>
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
                      <AlertDialogTitle>Mekanı silmek istediğinize emin misiniz?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Bu işlem geri alınamaz. Bu mekan ve ilgili tüm etkinlikler kalıcı olarak silinecektir.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>İptal</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeleteVenue(venue.id)}
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
