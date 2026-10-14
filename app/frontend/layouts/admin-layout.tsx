import { Link, usePage } from '@inertiajs/react'
import { cn } from 'cn'
import { BookOpen, ExternalLink } from 'lucide-react'
import type { ReactNode } from 'react'

import { FlashMessages } from '@/components/flash-messages'
import { LogoutButton } from '@/components/logout-button'
import { Button } from '@/components/ui/button'

const SECTIONS = [
  { href: '/admin', label: 'Resumen', exact: true },
  { href: '/admin/libros', label: 'Libros' },
  { href: '/admin/autores', label: 'Autores' },
  { href: '/admin/editoriales', label: 'Editoriales' },
  { href: '/admin/categorias', label: 'Categorías' },
]

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { url, props } = usePage()
  const path = url.split('?')[0]

  const isActive = (section: (typeof SECTIONS)[number]) =>
    section.exact ? path === section.href : path.startsWith(section.href)

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
          <div className="flex items-center gap-1">
            <span className="mr-2 hidden text-sm text-muted-foreground md:inline">
              {props.auth.user?.email_address}
            </span>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">
                <ExternalLink />
                <span className="hidden sm:inline">Ver catálogo</span>
              </Link>
            </Button>
            <LogoutButton />
          </div>
        </div>
        <nav aria-label="Secciones del panel" className="mx-auto max-w-6xl overflow-x-auto px-4">
          <ul className="flex gap-1">
            {SECTIONS.map((section) => (
              <li key={section.href}>
                <Link
                  href={section.href}
                  aria-current={isActive(section) ? 'page' : undefined}
                  className={cn(
                    '-mb-px inline-block border-b-2 px-3 py-2 text-sm whitespace-nowrap transition-colors',
                    isActive(section)
                      ? 'border-primary font-medium text-foreground'
                      : 'border-transparent text-muted-foreground hover:text-foreground',
                  )}
                >
                  {section.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">
        <FlashMessages />
        {children}
      </main>
    </div>
  )
}
