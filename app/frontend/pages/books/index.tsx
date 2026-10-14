import { Head } from '@inertiajs/react'

import { BookFiltersBar } from '@/components/books/book-filters-bar'
import { BookTable } from '@/components/books/book-table'
import { PaginationNav } from '@/components/pagination-nav'
import { useBookList } from '@/hooks/use-book-list'
import PublicLayout from '@/layouts/public-layout'
import type { BookFilters, BookRow, Option, Pagination } from '@/types'

type BooksIndexProps = {
  books: BookRow[]
  filters: BookFilters
  pagination: Pagination
  authors: Option[]
  categories: Option[]
  publishers: Option[]
}

export default function BooksIndex({
  books,
  filters,
  pagination,
  ...options
}: BooksIndexProps) {
  const list = useBookList('/', filters)

  return (
    <PublicLayout>
      <Head title="Catálogo" />

      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Catálogo</h1>
        <p className="text-sm text-muted-foreground">
          Buscá libros por título o autor, o filtrá por editorial, categoría y
          autor.
        </p>
      </div>

      <BookFiltersBar list={list} filters={filters} {...options} />

      <p className="mb-2 text-sm text-muted-foreground">
        {pagination.total_count === 1
          ? '1 libro'
          : `${pagination.total_count} libros`}
      </p>

      <BookTable
        books={books}
        direction={filters.direction}
        onToggleDirection={list.toggleDirection}
      />

      <PaginationNav
        pagination={pagination}
        onPageChange={(page) => list.visit({ page })}
      />
    </PublicLayout>
  )
}
