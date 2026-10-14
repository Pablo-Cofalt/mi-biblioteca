import { Head } from '@inertiajs/react'
import type { ComponentProps } from 'react'

import { BookForm } from '@/components/books/book-form'
import AdminLayout from '@/layouts/admin-layout'

export default function AdminBooksEdit(props: ComponentProps<typeof BookForm>) {
  return (
    <AdminLayout>
      <Head title={`Editar “${props.book.title}”`} />
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">Editar libro</h1>
      <BookForm {...props} />
    </AdminLayout>
  )
}
