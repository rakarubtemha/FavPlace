import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Calendar, MapPin, Users } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section
        className="relative h-[70vh] max-h-[640px] bg-cover bg-center"
        style={{ backgroundImage: "url(https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=2070&auto=format&fit=crop)" }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20" />
        <div className="relative container mx-auto flex flex-col items-center justify-center h-full text-center text-white px-4">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-balance">Isparta'nın Kalbindeki Etkinlikler</h1>
          <p className="mt-6 text-lg md:text-xl max-w-3xl text-balance text-gray-200">
            FavPlace ile Isparta'daki en canlı mekanları keşfedin, en yeni etkinlikleri takip edin ve şehrin ritmini yakalayın.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Link href="/etkinlikler">
              <Button size="lg" className="gap-2 bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-lg transition-transform transform hover:scale-105">
                Etkinlikleri Keşfet
                <ArrowRight size={18} />
              </Button>
            </Link>
            <Link href="/kayit">
              <Button size="lg" variant="secondary" className="gap-2 font-bold shadow-lg transition-transform transform hover:scale-105">
                Mekanını Tanıt
                <MapPin size={18} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 sm:py-24 bg-white dark:bg-gray-950">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Neden FavPlace?</h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Şehrin en iyilerini parmaklarınızın ucuna getiriyoruz.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-8 rounded-xl border bg-gray-50 dark:bg-gray-900/50 transition-all hover:shadow-lg hover:-translate-y-1">
              <div className="w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-900/50 flex items-center justify-center mb-5 ring-8 ring-rose-50 dark:ring-rose-900/30">
                <MapPin className="text-rose-600 dark:text-rose-400" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Mekan Keşfi</h3>
              <p className="text-gray-600 dark:text-gray-400">Isparta'nın en popüler ve gizli kalmış mekanlarını keşfedin, yorumları okuyun.</p>
            </div>
            <div className="flex flex-col items-center text-center p-8 rounded-xl border bg-gray-50 dark:bg-gray-900/50 transition-all hover:shadow-lg hover:-translate-y-1">
              <div className="w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-900/50 flex items-center justify-center mb-5 ring-8 ring-rose-50 dark:ring-rose-900/30">
                <Calendar className="text-rose-600 dark:text-rose-400" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Etkinlik Takibi</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Konserlerden festivallere, şehirdeki tüm etkinlikleri takip edin ve anında haberdar olun.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-8 rounded-xl border bg-gray-50 dark:bg-gray-900/50 transition-all hover:shadow-lg hover:-translate-y-1">
              <div className="w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-900/50 flex items-center justify-center mb-5 ring-8 ring-rose-50 dark:ring-rose-900/30">
                <Users className="text-rose-600 dark:text-rose-400" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Kolay Yönetim</h3>
              <p className="text-gray-600 dark:text-gray-400">Mekan sahipleri için etkinlik oluşturma ve mekan tanıtımı hiç bu kadar kolay olmamıştı.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-16 sm:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Öne Çıkan Etkinlikler</h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Bu hafta kaçırmamanız gerekenler.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="group border rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
              <img src="https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?q=80&w=2070&auto=format&fit=crop" alt="Canlı Müzik" className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="p-5 bg-white dark:bg-gray-950">
                <h3 className="text-xl font-bold mb-2">Canlı Müzik Gecesi</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-2"><MapPin size={16} /> Cafe Isparta</p>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/etkinlikler/1">Detayları Gör</Link>
                </Button>
              </div>
            </div>
            <div className="group border rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
              <img src="https://images.unsplash.com/photo-1455734729978-db1ae4f687fc?q=80&w=2070&auto=format&fit=crop" alt="Şiir Dinletisi" className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="p-5 bg-white dark:bg-gray-950">
                <h3 className="text-xl font-bold mb-2">Şiir Dinletisi</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-2"><MapPin size={16} /> Gül Restaurant</p>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/etkinlikler/2">Detayları Gör</Link>
                </Button>
              </div>
            </div>
            <div className="group border rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
              <img src="https://images.unsplash.com/photo-1536924940846-227afb31e2a5?q=80&w=2067&auto=format&fit=crop" alt="Sanat Sergisi" className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="p-5 bg-white dark:bg-gray-950">
                <h3 className="text-xl font-bold mb-2">Modern Sanat Sergisi</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-2"><MapPin size={16} /> Isparta Kültür Merkezi</p>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/etkinlikler/3">Detayları Gör</Link>
                </Button>
              </div>
            </div>
          </div>
           <div className="text-center mt-12">
            <Button asChild size="lg">
              <Link href="/etkinlikler">Tüm Etkinlikleri Gör <ArrowRight className="ml-2" size={18} /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-white dark:bg-gray-950 border-t pt-16 pb-8">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1 mb-8 md:mb-0">
              <Link href="/" className="text-2xl font-bold text-rose-600">
                FavPlace
              </Link>
              <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 max-w-md">
                Isparta'nın en kapsamlı etkinlik ve mekan rehberi. Şehirdeki tüm aktiviteleri keşfedin.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:col-span-3">
              <div>
                <h3 className="font-semibold mb-4">Keşfet</h3>
                <ul className="space-y-3">
                  <li>
                    <Link href="/mekanlar" className="text-sm text-gray-600 dark:text-gray-400 hover:text-rose-600">
                      Mekanlar
                    </Link>
                  </li>
                  <li>
                    <Link href="/etkinlikler" className="text-sm text-gray-600 dark:text-gray-400 hover:text-rose-600">
                      Etkinlikler
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Hesap</h3>
                <ul className="space-y-3">
                  <li>
                    <Link href="/giris" className="text-sm text-gray-600 dark:text-gray-400 hover:text-rose-600">
                      Giriş Yap
                    </Link>
                  </li>
                  <li>
                    <Link href="/kayit" className="text-sm text-gray-600 dark:text-gray-400 hover:text-rose-600">
                      Kayıt Ol
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Şirket</h3>
                <ul className="space-y-3">
                  <li>
                    <Link href="/hakkimizda" className="text-sm text-gray-600 dark:text-gray-400 hover:text-rose-600">
                      Hakkımızda
                    </Link>
                  </li>
                   <li>
                    <Link href="/iletisim" className="text-sm text-gray-600 dark:text-gray-400 hover:text-rose-600">
                      İletişim
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t text-center text-sm text-gray-500 dark:text-gray-400">
            <p>&copy; {new Date().getFullYear()} FavPlace. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
