import { Head, Link } from '@inertiajs/react'
import { Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import AdminLayout from '@/layouts/admin-layout'

type DashboardProps = {
  counts: {
    books: number
    trash: number
    authors: number
    publishers: number
    categories: number
  }
}

export default function AdminDashboard({ counts }: DashboardProps) {
  const stats = [
    { label: 'Libros', value: counts.books, href: '/admin/libros' },
    { label: 'Autores', value: counts.authors, href: '/admin/autores' },
    { label: 'Editoriales', value: counts.publishers, href: '/admin/editoriales' },
    { label: 'Categorías', value: counts.categories, href: '/admin/categorias' },
    { label: 'Libros en la papelera', value: counts.trash, href: '/admin/libros/papelera' },
  ]

  return (
    <AdminLayout>
      <Head title="Panel de administración" />

      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">
          Panel de administración
        </h1>
        <p className="text-sm text-muted-foreground">
          Gestioná el catálogo de la biblioteca.
        </p>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <Button asChild>
          <Link href="/admin/libros/nuevo">
            <Plus />
            Nuevo libro
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/admin/libros">Ver libros</Link>
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {stats.map((stat) => {
          const card = (
            <Card className="h-full">
              <CardHeader>
                <CardDescription>{stat.label}</CardDescription>
                <CardTitle className="text-3xl tabular-nums">
                  {stat.value}
                </CardTitle>
              </CardHeader>
            </Card>
          )

          return stat.href ? (
            <Link
              key={stat.label}
              href={stat.href}
              className="rounded-xl transition-opacity hover:opacity-80"
            >
              {card}
            </Link>
          ) : (
            <div key={stat.label}>{card}</div>
          )
        })}
      </div>
    </AdminLayout>
  )
}
