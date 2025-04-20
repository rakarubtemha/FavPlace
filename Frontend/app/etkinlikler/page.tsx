import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Clock, Calendar } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import EventRating from "@/components/event-rating"

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
    rating: 4.5,
    ratingCount: 12,
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
    rating: 4.2,
    ratingCount: 8,
  },
  {
    id: "3",
    title: "Yöresel Yemek Festivali",
    venue: "Isparta Kültür Merkezi",
    venueId: "3",
    date: "2023-12-25",
    time: "12:00 - 20:00",
    description: "Isparta'nın geleneksel lezzetlerini keşfedin.",
    capacity: 200,
    imageUrl: "/placeholder.svg?height=200&width=400",
    rating: 4.8,
    ratingCount: 25,
  },
  {
    id: "4",
    title: "Sanat Sergisi",
    venue: "Isparta Sanat Galerisi",
    venueId: "4",
    date: "2023-12-18",
    time: "10:00 - 18:00",
    description: "Yerel sanatçıların eserlerinden oluşan sergi.",
    capacity: 100,
    imageUrl: "/placeholder.svg?height=200&width=400",
    rating: 4.0,
    ratingCount: 15,
  },
]

export default function EventsPage() {
  return (
    <div className="container py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Etkinlikler</h1>
          <p className="text-gray-600">Isparta'daki tüm etkinlikleri keşfedin</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Input placeholder="Etkinlik ara..." className="w-full" />
          </div>
          <Select defaultValue="recommended">
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Sıralama" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Sıralama</SelectLabel>
                <SelectItem value="recommended">Önerilen</SelectItem>
                <SelectItem value="rating">Puana Göre</SelectItem>
                <SelectItem value="date-asc">Tarihe Göre (Yakın)</SelectItem>
                <SelectItem value="date-desc">Tarihe Göre (Uzak)</SelectItem>
                <SelectItem value="alphabetical">Alfabetik</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {DUMMY_EVENTS.map((event) => (
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
                <Clock className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-start">
                <Calendar className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center mt-2">
                <EventRating rating={event.rating} ratingCount={event.ratingCount} />
              </div>
            </CardContent>
            <CardFooter className="pt-2">
              <Link href={`/etkinlikler/${event.id}`} className="w-full">
                <Button className="w-full">Detayları Gör</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
