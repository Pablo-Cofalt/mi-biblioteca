import { Head, Link, router } from '@inertiajs/react'
import { Pencil, Plus, Trash2 } from 'lucide-react'

import { BookFiltersBar } from '@/components/books/book-filters-bar'
import { BookTable } from '@/components/books/book-table'
import { PaginationNav } from '@/components/pagination-nav'
import { Button } from '@/components/ui/button'
import { useBookList } from '@/hooks/use-book-list'
import AdminLayout from '@/layouts/admin-layout'
import type { BookFilters, BookRow, Option, Pagination } from '@/types'

type AdminBooksIndexProps = {
  books: BookRow[]
  filters: BookFilters
  pagination: Pagination
  authors: Option[]
  categories: Option[]
  publishers: Option[]
  trash_count: number
}

export default function AdminBooksIndex({
  books,
  filters,
  pagination,
  trash_count,
  ...options
}: AdminBooksIndexProps) {
  const list = useBookList('/admin/libros', filters)

  const discard = (book: BookRow) =>
    router.delete(`/admin/libros/${book.id}`, { preserveScroll: true })

  return (
    <AdminLayout>
      <Head title="Libros" />

      <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Libros</h1>
          <p className="text-sm text-muted-foreground">
            {pagination.total_count === 1
              ? '1 libro'
              : `${pagination.total_count} libros`}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/admin/libros/papelera">
              <Trash2 />
              Papelera ({trash_count})
            </Link>
          </Button>
          <Button asChild>
            <Link href="/admin/libros/nuevo">
              <Plus />
              Nuevo libro
            </Link>
          </Button>
        </div>
      </div>

      <BookFiltersBar list={list} filters={filters} {...options} />

      <BookTable
        books={books}
        direction={filters.direction}
        onToggleDirection={list.toggleDirection}
        actions={(book) => (
          <div className="flex justify-end gap-1">
            <Button variant="ghost" size="icon-sm" asChild>
              <Link
                href={`/admin/libros/${book.id}/editar`}
                aria-label={`Editar “${book.title}”`}
                title="Editar"
              >
                <Pencil />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => discard(book)}
              aria-label={`Mover “${book.title}” a la papelera`}
              title="Mover a la papelera"
            >
              <Trash2 />
            </Button>
          </div>
        )}
      />

      <PaginationNav
        pagination={pagination}
        onPageChange={(page) => list.visit({ page })}
      />
    </AdminLayout>
  )
}
