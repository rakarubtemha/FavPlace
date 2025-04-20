import type { ReactNode } from "react"
import Link from "next/link"
import { LayoutDashboard, MapPin, Calendar, User } from "lucide-react"
import LogoutButton from "@/components/logout-button"

interface PanelLayoutProps {
  children: ReactNode
}

export default function PanelLayout({ children }: PanelLayoutProps) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-gray-50 hidden md:block">
        <div className="p-6">
          <Link href="/" className="text-xl font-bold text-rose-600">
            FavPlace
          </Link>
        </div>
        <nav className="px-3 py-2">
          <div className="space-y-1">
            <Link
              href="/panel"
              className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100"
            >
              <LayoutDashboard className="mr-3 h-5 w-5 text-gray-500" />
              Dashboard
            </Link>
            <Link
              href="/panel/mekanlar"
              className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100 bg-gray-100"
            >
              <MapPin className="mr-3 h-5 w-5 text-gray-500" />
              Mekanlarım
            </Link>
            <Link
              href="/panel/etkinlikler"
              className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100"
            >
              <Calendar className="mr-3 h-5 w-5 text-gray-500" />
              Etkinliklerim
            </Link>
            <Link
              href="/panel/profil"
              className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100"
            >
              <User className="mr-3 h-5 w-5 text-gray-500" />
              Profilim
            </Link>
          </div>
          <div className="pt-6 mt-6 border-t">
            <LogoutButton />
          </div>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {/* Mobile header */}
        <div className="md:hidden border-b p-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-rose-600">
            FavPlace
          </Link>
          {/* Mobile menu button would go here */}
        </div>
        <div className="p-6">{children}</div>
      </main>
    </div>
  )
}
