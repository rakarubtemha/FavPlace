"use server"

// Bu dosya, sunucu tarafında çalışacak olan işlemleri (actions) içerir
// Next.js 14'ün Server Actions özelliğini kullanıyoruz

// Örnek kullanıcı veritabanı (gerçek uygulamada veritabanında saklanır)
const users = [
  {
    id: "1",
    email: "ahmet@example.com",
    password: "password123",
    name: "Ahmet Yılmaz",
    accountType: "venue",
  },
  {
    id: "2",
    email: "ayse@example.com",
    password: "password123",
    name: "Ayşe Demir",
    accountType: "customer",
  },
]

import { sendToQueue } from "@/lib/rabbitmq";

// Hesap oluşturma
export async function createAccount(data: {
  email: string
  password: string
  name: string
  accountType: string
}) {
  // Gerçek uygulamada burada veritabanına kayıt işlemi yapılır
  // Şimdilik sadece simüle ediyoruz
  console.log("Hesap oluşturuldu:", data)

  // Yeni kullanıcıyı örnek veritabanına ekle
  const newUser = {
    id: `user-${Date.now()}`,
    email: data.email,
    password: data.password,
    name: data.name,
    accountType: data.accountType,
  }

  users.push(newUser)

  // Başarılı olduğunu varsayalım
  return {
    success: true,
    accountType: data.accountType,
    name: data.name,
  }
}

// Kullanıcı girişi
export async function loginUser(data: { email: string; password: string }) {
  // Gerçek uygulamada burada kimlik doğrulama işlemi yapılır
  // Şimdilik sadece simüle ediyoruz
  console.log("Giriş yapıldı:", data)

  // Kullanıcıyı örnek veritabanında ara
  const user = users.find((u) => u.email === data.email && u.password === data.password)

  if (user) {
    return {
      success: true,
      accountType: user.accountType,
      name: user.name,
    }
  }

  // Eğer kullanıcı bulunamazsa, varsayılan değerleri döndür
  return {
    success: true,
    accountType: "venue", // veya "customer"
    name: "Kullanıcı",
  }
}

// Kullanıcı çıkışı
export async function logoutUser() {
  // Gerçek uygulamada burada oturum sonlandırma işlemi yapılır
  // Şimdilik sadece simüle ediyoruz
  console.log("Çıkış yapıldı")

  // Başarılı olduğunu varsayalım
  return { success: true }
}

// Kullanıcının giriş yapmış olup olmadığını kontrol etme
export async function checkIsLoggedIn() {
  // Gerçek uygulamada burada oturum kontrolü yapılır
  // Varsayılan olarak giriş yapılmamış olsun
  const isLoggedIn = false

  return { isLoggedIn }
}

// Kullanıcı bilgilerini getirme
export async function getUserInfo() {
  // Gerçek uygulamada burada veritabanı sorgusu yapılır
  // Şimdilik örnek veri döndürüyoruz
  return {
    id: "user-1",
    name: "Ahmet Yılmaz",
    email: "ahmet@example.com",
    accountType: "venue", // veya "customer"
  }
}

// Mekan ekleme
export async function addVenue(data: {
  name: string
  address: string
  phone: string
  openingHours: string
  description: string
}) {
  // Gerçek uygulamada burada veritabanına kayıt işlemi yapılır
  // Şimdilik sadece simüle ediyoruz
  console.log("Mekan eklendi:", data)

  // Başarılı olduğunu varsayalım
  return { success: true, id: "new-venue-id" }
}

// Mekan güncelleme
export async function updateVenue(
  id: string,
  data: {
    name: string
    address: string
    phone: string
    openingHours: string
    description: string
  },
) {
  // Gerçek uygulamada burada veritabanı güncelleme işlemi yapılır
  // Şimdilik sadece simüle ediyoruz
  console.log(`Mekan güncellendi (ID: ${id}):`, data)

  // Başarılı olduğunu varsayalım
  return { success: true }
}

// Mekan silme
export async function deleteVenue(id: string) {
  // Gerçek uygulamada burada veritabanından silme işlemi yapılır
  // Şimdilik sadece simüle ediyoruz
  console.log(`Mekan silindi (ID: ${id})`)

  // Başarılı olduğunu varsayalım
  return { success: true }
}

// Etkinlik ekleme fonksiyonundan kapasite parametresini kaldıralım
export async function addEvent(data: {
  title: string
  venueId: string
  date: string
  time: string
  description: string
}) {
  // Gerçek uygulamada burada veritabanına kayıt işlemi yapılır
  // Şimdilik sadece simüle ediyoruz
  const newEvent = {
    id: `event-${Date.now()}`,
    ...data,
    createdAt: new Date().toISOString(),
  };
  console.log("Etkinlik eklendi:", newEvent);

  // RabbitMQ'ya event_created mesajı gönder
  await sendToQueue("event_created", newEvent);

  // Başarılı olduğunu varsayalım
  return { success: true, id: newEvent.id };
}

// Etkinlik güncelleme fonksiyonundan kapasite parametresini kaldıralım
export async function updateEvent(
  id: string,
  data: {
    title: string
    venueId: string
    date: string
    time: string
    description: string
  },
) {
  // Gerçek uygulamada burada veritabanı güncelleme işlemi yapılır
  // Şimdilik sadece simüle ediyoruz
  console.log(`Etkinlik güncellendi (ID: ${id}):`, data)

  // Başarılı olduğunu varsayalım
  return { success: true }
}

// Etkinlik silme
export async function deleteEvent(id: string) {
  // Gerçek uygulamada burada veritabanından silme işlemi yapılır
  // Şimdilik sadece simüle ediyoruz
  console.log(`Etkinlik silindi (ID: ${id})`)

  // Başarılı olduğunu varsayalım
  return { success: true }
}

// Profil güncelleme
export async function updateProfile(data: {
  name: string
  email: string
}) {
  // Gerçek uygulamada burada veritabanı güncelleme işlemi yapılır
  // Şimdilik sadece simüle ediyoruz
  console.log("Profil güncellendi:", data)

  // Başarılı olduğunu varsayalım
  return { success: true }
}

// Hesap silme
export async function deleteAccount() {
  // Gerçek uygulamada burada veritabanından silme işlemi yapılır
  // Şimdilik sadece simüle ediyoruz
  console.log("Hesap silindi")

  // Başarılı olduğunu varsayalım
  return { success: true }
}

// Şifre sıfırlama e-postası gönderme
export async function sendPasswordResetEmail(email: string) {
  // Gerçek uygulamada burada e-posta gönderme işlemi yapılır
  // Şimdilik sadece simüle ediyoruz
  console.log(`Şifre sıfırlama e-postası gönderildi: ${email}`)

  // Başarılı olduğunu varsayalım
  return { success: true }
}

// Şifre sıfırlama
export async function resetPassword(token: string, newPassword: string) {
  // Gerçek uygulamada burada token doğrulama ve şifre güncelleme işlemi yapılır
  // Şimdilik sadece simüle ediyoruz
  console.log(`Şifre sıfırlandı. Token: ${token}`)

  // Başarılı olduğunu varsayalım
  return { success: true }
}

// Yorum ekleme
export async function addComment(data: {
  itemId: string
  itemType: "venue" | "event"
  content: string
}) {
  // Gerçek uygulamada burada veritabanına kayıt işlemi yapılır
  // Şimdilik sadece simüle ediyoruz
  console.log("Yorum eklendi:", data)

  // Başarılı olduğunu varsayalım
  return {
    success: true,
    id: "new-comment-id",
    user: "Kullanıcı Adı",
    date: new Date().toISOString().split("T")[0],
    content: data.content,
  }
}

// Değerlendirme ekleme
export async function addRating(data: {
  itemId: string
  itemType: "venue" | "event"
  rating: number
}) {
  // Gerçek uygulamada burada veritabanına kayıt işlemi yapılır
  // Şimdilik sadece simüle ediyoruz
  console.log("Değerlendirme eklendi:", data)

  // Başarılı olduğunu varsayalım
  return { success: true }
}

// Favorilere ekleme
export async function addToFavorites(id: string, type: "venue" | "event") {
  // Gerçek uygulamada burada veritabanına kayıt işlemi yapılır
  // Şimdilik sadece simüle ediyoruz
  console.log(`Favorilere eklendi: ${type} (ID: ${id})`)

  // Başarılı olduğunu varsayalım
  return { success: true }
}

// Favorilerden kaldırma
export async function removeFromFavorites(id: string, type: "venue" | "event") {
  // Gerçek uygulamada burada veritabanından silme işlemi yapılır
  // Şimdilik sadece simüle ediyoruz
  console.log(`Favorilerden kaldırıldı: ${type} (ID: ${id})`)

  // Başarılı olduğunu varsayalım
  return { success: true }
}

// Favori durumunu kontrol etme
export async function checkIsFavorite(id: string, type: "venue" | "event") {
  // Gerçek uygulamada burada veritabanı sorgusu yapılır
  // Şimdilik rastgele bir değer döndürüyoruz
  const isFavorite = Math.random() > 0.5

  return { isFavorite }
}

// Favorileri getirme
export async function getFavorites() {
  // Gerçek uygulamada burada veritabanı sorgusu yapılır
  // Şimdilik örnek veri döndürüyoruz

  return {
    venues: [
      {
        id: "1",
        name: "Cafe Isparta",
        address: "Merkez, Isparta",
        openingHours: "09:00 - 23:00",
        description: "Isparta'nın merkezinde şık bir kafe.",
        imageUrl: "/placeholder.svg?height=200&width=400",
        rating: 4.5,
        ratingCount: 28,
      },
      {
        id: "2",
        name: "Gül Restaurant",
        address: "Çünür, Isparta",
        openingHours: "11:00 - 22:00",
        description: "Geleneksel lezzetlerin modern sunumu.",
        imageUrl: "/placeholder.svg?height=200&width=400",
        rating: 4.2,
        ratingCount: 42,
      },
    ],
    events: [
      {
        id: "1",
        title: "Canlı Müzik Gecesi",
        venue: "Cafe Isparta",
        date: "2023-12-15",
        time: "20:00 - 23:00",
        description: "Isparta'nın en iyi müzisyenleriyle unutulmaz bir gece.",
        imageUrl: "/placeholder.svg?height=200&width=400",
        rating: 4.5,
        ratingCount: 12,
      },
    ],
  }
}

// Mekan getirme
export async function getVenue(id: string) {
  console.log(`Mekan getirildi (ID: ${id})`)

  return {
    id: id,
    name: "Cafe Isparta",
    address: "Merkez, Isparta",
    phone: "0246 123 45 67",
    openingHours: "09:00 - 23:00",
    description: "Isparta'nın merkezinde şık bir kafe.",
    imageUrl: "/placeholder.svg?height=200&width=400",
  }
}

// Kullanıcının mekanlarını getirme
export async function getUserVenues() {
  // Gerçek uygulamada burada veritabanı sorgusu yapılır
  // Şimdilik örnek veri döndürüyoruz
  return [
    { id: "1", name: "Cafe Isparta" },
    { id: "2", name: "Gül Restaurant" },
  ]
}

// Kullanıcının mekan sahibi olup olmadığını kontrol etme
export async function checkIsVenueOwner(venueId?: string) {
  // Gerçek uygulamada burada veritabanı sorgusu yapılır
  // Şimdilik true döndürüyoruz (demo amaçlı)

  if (venueId) {
    // Belirli bir mekanın sahibi mi kontrolü
    return { isOwner: true }
  } else {
    // Genel olarak mekan sahibi mi kontrolü
    return { isVenueOwner: true }
  }
}

// Etkinlikleri getirme (sıralama seçeneğiyle)
export async function getEvents(sortBy = "recommended") {
  console.log(`Etkinlikler getirildi, sıralama: ${sortBy}`)

  // Örnek veri
  const events = [
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
  ]

  // Sıralama seçeneğine göre etkinlikleri sırala
  switch (sortBy) {
    case "rating":
      events.sort((a, b) => b.rating - a.rating)
      break
    case "date-asc":
      events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      break
    case "date-desc":
      events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      break
    case "alphabetical":
      events.sort((a, b) => a.title.localeCompare(b.title))
      break
    // Önerilen sıralama (varsayılan)
    default:
      break
  }

  return events
}

// Mekanları getirme (sıralama seçeneğiyle)
export async function getVenues(sortBy = "recommended") {
  console.log(`Mekanlar getirildi, sıralama: ${sortBy}`)

  // Örnek veri
  const venues = [
    {
      id: "1",
      name: "Cafe Isparta",
      address: "Merkez, Isparta",
      phone: "0246 123 45 67",
      openingHours: "09:00 - 23:00",
      description: "Isparta'nın merkezinde şık bir kafe.",
      imageUrl: "/placeholder.svg?height=200&width=400",
      rating: 4.5,
      ratingCount: 28,
    },
    {
      id: "2",
      name: "Gül Restaurant",
      address: "Çünür, Isparta",
      phone: "0246 234 56 78",
      openingHours: "11:00 - 22:00",
      description: "Geleneksel lezzetlerin modern sunumu.",
      imageUrl: "/placeholder.svg?height=200&width=400",
      rating: 4.2,
      ratingCount: 42,
    },
  ]

  // Sıralama seçeneğine göre mekanları sırala
  switch (sortBy) {
    case "rating":
      venues.sort((a, b) => b.rating - a.rating)
      break
    case "alphabetical":
      venues.sort((a, b) => a.name.localeCompare(b.name))
      break
    // Önerilen sıralama (varsayılan)
    default:
      break
  }

  return venues
}

// Menü kategorisi ekleme
export async function addMenuCategory(venueId: string, categoryName: string) {
  // Gerçek uygulamada burada veritabanına kayıt işlemi yapılır
  // Şimdilik sadece simüle ediyoruz
  console.log(`Menü kategorisi eklendi: ${categoryName} (Mekan ID: ${venueId})`)

  // Başarılı olduğunu varsayalım
  return { success: true, id: `category-${Date.now()}` }
}

// Menü kategorisi silme
export async function deleteMenuCategory(venueId: string, categoryId: string) {
  // Gerçek uygulamada burada veritabanından silme işlemi yapılır
  // Şimdilik sadece simüle ediyoruz
  console.log(`Menü kategorisi silindi: ${categoryId} (Mekan ID: ${venueId})`)

  // Başarılı olduğunu varsayalım
  return { success: true }
}

// Menü ürünü ekleme
export async function addMenuItem(
  venueId: string,
  categoryId: string,
  data: {
    name: string
    description: string
    price: number
  },
) {
  // Gerçek uygulamada burada veritabanına kayıt işlemi yapılır
  // Şimdilik sadece simüle ediyoruz
  console.log(`Menü ürünü eklendi: ${data.name} (Kategori ID: ${categoryId}, Mekan ID: ${venueId})`)

  // Başarılı olduğunu varsayalım
  return { success: true, id: `item-${Date.now()}` }
}

// Menü ürünü güncelleme
export async function updateMenuItem(
  venueId: string,
  categoryId: string,
  itemId: string,
  data: {
    name: string
    description: string
    price: number
  },
) {
  // Gerçek uygulamada burada veritabanı güncelleme işlemi yapılır
  // Şimdilik sadece simüle ediyoruz
  console.log(`Menü ürünü güncellendi: ${itemId} (Kategori ID: ${categoryId}, Mekan ID: ${venueId})`)

  // Başarılı olduğunu varsayalım
  return { success: true }
}

// Menü ürünü silme
export async function deleteMenuItem(venueId: string, categoryId: string, itemId: string) {
  // Gerçek uygulamada burada veritabanından silme işlemi yapılır
  // Şimdilik sadece simüle ediyoruz
  console.log(`Menü ürünü silindi: ${itemId} (Kategori ID: ${categoryId}, Mekan ID: ${venueId})`)

  // Başarılı olduğunu varsayalım
  return { success: true }
}

// Sipariş oluşturma örneği
export async function createOrder(data: { userId: string; items: any[]; total: number }) {
  // Siparişi veritabanına kaydet (örnek)
  const newOrder = {
    id: `order-${Date.now()}`,
    userId: data.userId,
    items: data.items,
    total: data.total,
    date: new Date().toISOString(),
  };
  console.log("Sipariş oluşturuldu:", newOrder);

  // RabbitMQ'ya order_created mesajı gönder
  await sendToQueue("order_created", newOrder);

  // Başarılı olduğunu varsayalım
  return { success: true, id: newOrder.id };
}

// Sosyal medya uygulamasında yeni fotoğraf paylaşımı örneği
export async function createNewPost(data: { userId: string; imageUrl: string; caption: string }) {
  // Post'u veritabanına kaydet (örnek)
  const newPost = {
    id: `post-${Date.now()}`,
    userId: data.userId,
    imageUrl: data.imageUrl,
    caption: data.caption,
    date: new Date().toISOString(),
  };
  console.log("Yeni fotoğraf paylaşıldı:", newPost);

  // RabbitMQ'ya new_post mesajı gönder
  await sendToQueue("new_post", newPost);

  // Başarılı olduğunu varsayalım
  return { success: true, id: newPost.id };
}
