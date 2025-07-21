"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Heart, Menu, X, User } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import LogoutButton from "@/components/logout-button"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu"

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userInfo, setUserInfo] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()

  const isHomePage = pathname === "/"

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    if (typeof window !== "undefined") {
      checkAuth()
      window.addEventListener("scroll", handleScroll)
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("scroll", handleScroll)
      }
    }
  }, [])

  function checkAuth() {
    try {
      setIsLoading(true)
      const loggedIn = localStorage.getItem("isLoggedIn") === "true"
      setIsLoggedIn(loggedIn)

      if (loggedIn) {
        const userInfoStr = localStorage.getItem("userInfo")
        if (userInfoStr) {
          setUserInfo(JSON.parse(userInfoStr))
        }
      } else {
        setUserInfo(null)
      }
    } catch (error) {
      console.error("Kimlik doğrulama kontrolü sırasında hata:", error)
      setIsLoggedIn(false)
      setUserInfo(null)
    } finally {
      setIsLoading(false)
    }
  }

  function handleLogoutSuccess() {
    setIsLoggedIn(false)
    setUserInfo(null)
    localStorage.removeItem("isLoggedIn")
    localStorage.removeItem("userInfo")
  }

  const showTransparentHeader = isHomePage && !isScrolled

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${showTransparentHeader ? "bg-transparent" : "bg-white shadow-md dark:bg-gray-950"}`}>
      <div className="container flex items-center justify-between py-3">
        <Link href="/" className={`text-2xl font-bold transition-colors ${showTransparentHeader ? "text-white" : "text-rose-600"}`}>
          FavPlace
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/mekanlar" className={`text-sm font-medium transition-colors ${showTransparentHeader ? "text-white hover:text-rose-300" : "text-gray-700 hover:text-rose-600"}`}>
            Mekanlar
          </Link>
          <Link href="/etkinlikler" className={`text-sm font-medium transition-colors ${showTransparentHeader ? "text-white hover:text-rose-300" : "text-gray-700 hover:text-rose-600"}`}>
            Etkinlikler
          </Link>
          <Link href="/hakkimizda" className={`text-sm font-medium transition-colors ${showTransparentHeader ? "text-white hover:text-rose-300" : "text-gray-700 hover:text-rose-600"}`}>
            Hakkımızda
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {isLoading ? (
            <div className="w-20 h-9 bg-gray-200/20 animate-pulse rounded-md"></div>
          ) : isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className={`flex items-center gap-2 ${showTransparentHeader ? "text-white hover:bg-white/20" : "text-gray-800 hover:bg-gray-100"}`}>
                  <User />
                  {userInfo?.email || userInfo?.name || "Kullanıcı"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  {userInfo?.email || userInfo?.name || "Kullanıcı"}
                </DropdownMenuLabel>
                <div className="px-3 pb-1 text-xs text-gray-500">
                  {userInfo?.accountType === "venue" ? "Mekan Sahibi" : "Müşteri"}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={userInfo?.accountType === "venue" ? "/panel/mekanlar" : "/profil"}>Panel</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={handleLogoutSuccess} className="cursor-pointer">
                  Çıkış Yap
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link href="/giris">
                <Button variant={showTransparentHeader ? "ghost" : "outline"} size="sm" className={showTransparentHeader ? "text-white hover:bg-white/20" : ""}>
                  Giriş Yap
                </Button>
              </Link>
              <Link href="/kayit">
                <Button size="sm" className="bg-rose-600 hover:bg-rose-700 text-white">Kayıt Ol</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobil menü */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className={showTransparentHeader ? "text-white hover:bg-white/20" : ""}>
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-6">
                  <Link href="/" className="text-xl font-bold text-rose-600">
                    FavPlace
                  </Link>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <X />
                    </Button>
                  </SheetTrigger>
                </div>

                <div className="flex flex-col gap-4">
                  <Link href="/mekanlar" className="text-base font-medium text-gray-700 hover:text-rose-600">
                    Mekanlar
                  </Link>
                  <Link href="/etkinlikler" className="text-base font-medium text-gray-700 hover:text-rose-600">
                    Etkinlikler
                  </Link>
                  <Link href="/hakkimizda" className="text-base font-medium text-gray-700 hover:text-rose-600">
                    Hakkımızda
                  </Link>
                </div>

                <div className="mt-auto pt-6 border-t flex flex-col gap-3">
                  {isLoading ? (
                    <div className="w-full h-10 bg-gray-100 animate-pulse rounded-md"></div>
                  ) : isLoggedIn ? (
                    <>
                      <Link href="/profil" className="w-full">
                        <Button variant="ghost" className="w-full justify-start gap-2">
                          <User size={16} />
                          Profilim
                        </Button>
                      </Link>
                      <Link href="/favoriler" className="w-full">
                        <Button variant="ghost" className="w-full justify-start gap-2">
                          <Heart size={16} />
                          Favorilerim
                        </Button>
                      </Link>
                      <LogoutButton onLogoutSuccess={handleLogoutSuccess} />
                    </>
                  ) : (
                    <>
                      <Link href="/giris" className="w-full">
                        <Button variant="outline" className="w-full">
                          Giriş Yap
                        </Button>
                      </Link>
                      <Link href="/kayit" className="w-full">
                        <Button className="w-full">Kayıt Ol</Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
