import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Calendar, MapPin, Users } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-rose-50 to-rose-100 py-20">
        <div className="container flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">Isparta'nın En İyi Etkinlik Rehberi</h1>
          <p className="mt-6 text-lg text-gray-600 max-w-3xl">
            FavPlace ile Isparta'daki en iyi mekanları keşfedin, etkinlikleri takip edin ve unutulmaz anılar biriktirin.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Link href="/etkinlikler">
              <Button size="lg" className="gap-2">
                Etkinlikleri Keşfet
                <ArrowRight size={16} />
              </Button>
            </Link>
            <Link href="/kayit">
              <Button size="lg" variant="outline" className="gap-2">
                Mekan Sahibiyim
                <MapPin size={16} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">Neler Sunuyoruz?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 rounded-lg border">
              <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center mb-4">
                <MapPin className="text-rose-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Mekan Keşfi</h3>
              <p className="text-gray-600">Isparta'nın en popüler ve yeni mekanlarını keşfedin, yorumları okuyun.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-lg border">
              <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center mb-4">
                <Calendar className="text-rose-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Etkinlik Takibi</h3>
              <p className="text-gray-600">
                Şehirdeki tüm etkinlikleri takip edin, bilet alın ve arkadaşlarınızla paylaşın.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-lg border">
              <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center mb-4">
                <Users className="text-rose-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Mekan Yönetimi</h3>
              <p className="text-gray-600">Mekan sahipleri için kolay yönetim araçları ve etkinlik oluşturma imkanı.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-gray-50 border-t py-12">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              <Link href="/" className="text-xl font-bold text-rose-600">
                FavPlace
              </Link>
              <p className="mt-2 text-sm text-gray-600 max-w-md">
                Isparta'nın en kapsamlı etkinlik ve mekan rehberi. Şehirdeki tüm aktiviteleri keşfedin.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-semibold mb-3">Keşfet</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="/mekanlar" className="text-sm text-gray-600 hover:text-rose-600">
                      Mekanlar
                    </Link>
                  </li>
                  <li>
                    <Link href="/etkinlikler" className="text-sm text-gray-600 hover:text-rose-600">
                      Etkinlikler
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Hesap</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="/giris" className="text-sm text-gray-600 hover:text-rose-600">
                      Giriş Yap
                    </Link>
                  </li>
                  <li>
                    <Link href="/kayit" className="text-sm text-gray-600 hover:text-rose-600">
                      Kayıt Ol
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3">İletişim</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="/iletisim" className="text-sm text-gray-600 hover:text-rose-600">
                      Bize Ulaşın
                    </Link>
                  </li>
                  <li>
                    <Link href="/hakkimizda" className="text-sm text-gray-600 hover:text-rose-600">
                      Hakkımızda
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-6 border-t text-center text-sm text-gray-600">
            <p>&copy; {new Date().getFullYear()} FavPlace. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
