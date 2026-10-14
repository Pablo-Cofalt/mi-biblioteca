import { Link, usePage } from '@inertiajs/react'
import { BookOpen, LayoutDashboard, LogIn } from 'lucide-react'
import type { ReactNode } from 'react'

import { FlashMessages } from '@/components/flash-messages'
import { LogoutButton } from '@/components/logout-button'
import { Button } from '@/components/ui/button'

export default function PublicLayout({ children }: { children: ReactNode }) {
  const { auth } = usePage().props

  return (
    <div className="min-h-svh bg-muted/40">
      <header className="border-b bg-background">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <BookOpen className="size-5" />
            Mi Biblioteca
          </Link>
          <nav className="flex items-center gap-1">
            {auth.user ? (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/admin">
                    <LayoutDashboard />
                    Panel
                  </Link>
                </Button>
                <LogoutButton />
              </>
            ) : (
              <Button variant="ghost" size="sm" asChild>
                <Link href="/ingresar">
                  <LogIn />
                  Ingresar
                </Link>
              </Button>
            )}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">
        <FlashMessages />
        {children}
      </main>
    </div>
  )
}
