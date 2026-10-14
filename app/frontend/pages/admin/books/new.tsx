import { Head } from '@inertiajs/react'
import type { ComponentProps } from 'react'

import { BookForm } from '@/components/books/book-form'
import AdminLayout from '@/layouts/admin-layout'

export default function AdminBooksNew(props: ComponentProps<typeof BookForm>) {
  return (
    <AdminLayout>
      <Head title="Nuevo libro" />
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">Nuevo libro</h1>
      <BookForm {...props} />
    </AdminLayout>
  )
}
