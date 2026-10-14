import { Head } from '@inertiajs/react'

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
    authors: number
    publishers: number
    categories: number
  }
}

export default function AdminDashboard({ counts }: DashboardProps) {
  const stats = [
    { label: 'Libros', value: counts.books },
    { label: 'Autores', value: counts.authors },
    { label: 'Editoriales', value: counts.publishers },
    { label: 'Categorías', value: counts.categories },
  ]

  return (
    <AdminLayout>
      <Head title="Panel de administración" />

      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">
          Panel de administración
        </h1>
        <p className="text-sm text-muted-foreground">
          Desde acá vas a poder gestionar el catálogo de la biblioteca.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader>
              <CardDescription>{stat.label}</CardDescription>
              <CardTitle className="text-3xl tabular-nums">
                {stat.value}
              </CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>
    </AdminLayout>
  )
}
