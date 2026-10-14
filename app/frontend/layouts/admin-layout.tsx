import { Link, usePage } from '@inertiajs/react'
import { BookOpen, ExternalLink } from 'lucide-react'
import type { ReactNode } from 'react'

import { FlashMessages } from '@/components/flash-messages'
import { LogoutButton } from '@/components/logout-button'
import { Button } from '@/components/ui/button'

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { auth } = usePage().props

  return (
    <div className="min-h-svh bg-muted/40">
      <header className="border-b bg-background">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-2 px-4">
          <Link href="/admin" className="flex items-center gap-2 font-semibold">
            <BookOpen className="size-5" />
            <span>
              Mi Biblioteca
              <span className="font-normal text-muted-foreground"> · Admin</span>
            </span>
          </Link>
          <nav className="flex items-center gap-1">
            <span className="mr-2 hidden text-sm text-muted-foreground sm:inline">
              {auth.user?.email_address}
            </span>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">
                <ExternalLink />
                <span className="hidden sm:inline">Ver catálogo</span>
              </Link>
            </Button>
            <LogoutButton />
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
