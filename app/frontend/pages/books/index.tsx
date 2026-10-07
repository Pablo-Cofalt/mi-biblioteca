import { Head, router } from '@inertiajs/react'
import {
  ArrowDownAZ,
  ArrowUpZA,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { FilterCombobox } from '@/components/filter-combobox'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
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

const SEARCH_DELAY_MS = 300

export default function BooksIndex({
  books,
  filters,
  pagination,
  authors,
  categories,
  publishers,
}: BooksIndexProps) {
  const [query, setQuery] = useState(filters.q ?? '')
  const lastSubmittedQuery = useRef(filters.q ?? '')

  const visit = (
    changes: Partial<BookFilters> & { page?: number },
    { replace = false } = {},
  ) => {
    const params = { ...filters, page: undefined, ...changes }
    // Leave empty values and defaults out of the URL.
    const query = Object.fromEntries(
      Object.entries(params).filter(
        ([key, value]) =>
          value !== null &&
          value !== undefined &&
          value !== '' &&
          !(key === 'direction' && value === 'asc') &&
          !(key === 'page' && value === 1),
      ),
    )

    router.get('/', query, { preserveState: true, replace })
  }

  // Keep the search box in sync when the URL changes from elsewhere
  // (browser back/forward, "Limpiar filtros").
  useEffect(() => {
    const current = filters.q ?? ''
    if (current !== lastSubmittedQuery.current) {
      lastSubmittedQuery.current = current
      setQuery(current)
    }
  }, [filters.q])

  useEffect(() => {
    const trimmed = query.trim()
    if (trimmed === lastSubmittedQuery.current) return

    const timeout = setTimeout(() => {
      lastSubmittedQuery.current = trimmed
      visit({ q: trimmed || null }, { replace: true })
    }, SEARCH_DELAY_MS)

    return () => clearTimeout(timeout)
  }, [query])

  const hasFilters =
    filters.q !== null ||
    filters.author_id !== null ||
    filters.category_id !== null ||
    filters.publisher_id !== null

  const clearFilters = () => {
    setQuery('')
    lastSubmittedQuery.current = ''
    visit({ q: null, author_id: null, category_id: null, publisher_id: null })
  }

  const toggleDirection = () =>
    visit({ direction: filters.direction === 'asc' ? 'desc' : 'asc' })

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

      <div className="mb-4 flex flex-col gap-2 lg:flex-row lg:items-center">
        <InputGroup className="bg-background lg:max-w-xs">
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
          <InputGroupInput
            type="search"
            placeholder="Buscar por título o autor…"
            aria-label="Buscar por título o autor"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </InputGroup>

        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <FilterCombobox
            label="Editorial"
            placeholder="Buscar editorial…"
            options={publishers}
            value={filters.publisher_id}
            onChange={(publisher_id) => visit({ publisher_id })}
          />
          <FilterCombobox
            label="Categoría"
            placeholder="Buscar categoría…"
            options={categories}
            value={filters.category_id}
            onChange={(category_id) => visit({ category_id })}
          />
          <FilterCombobox
            label="Autor"
            placeholder="Buscar autor…"
            options={authors}
            value={filters.author_id}
            onChange={(author_id) => visit({ author_id })}
          />
          {hasFilters && (
            <Button variant="ghost" onClick={clearFilters}>
              <X />
              Limpiar filtros
            </Button>
          )}
        </div>
      </div>

      <p className="mb-2 text-sm text-muted-foreground">
        {pagination.total_count === 1
          ? '1 libro'
          : `${pagination.total_count} libros`}
      </p>

      <div className="rounded-lg border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                aria-sort={
                  filters.direction === 'asc' ? 'ascending' : 'descending'
                }
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className="-ml-2"
                  onClick={toggleDirection}
                  title={
                    filters.direction === 'asc'
                      ? 'Ordenar de la Z a la A'
                      : 'Ordenar de la A a la Z'
                  }
                >
                  Título
                  {filters.direction === 'asc' ? <ArrowDownAZ /> : <ArrowUpZA />}
                </Button>
              </TableHead>
              <TableHead>Autor(es)</TableHead>
              <TableHead>Editorial(es)</TableHead>
              <TableHead>Categorías</TableHead>
              <TableHead>Ubicación</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {books.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-24 text-center text-muted-foreground"
                >
                  No se encontraron libros.
                </TableCell>
              </TableRow>
            ) : (
              books.map((book) => (
                <TableRow key={book.id}>
                  <TableCell className="font-medium whitespace-normal">
                    {book.title}
                  </TableCell>
                  <TableCell className="whitespace-normal">
                    {book.authors.join(', ') || '—'}
                  </TableCell>
                  <TableCell className="whitespace-normal">
                    {book.publishers.join(', ') || '—'}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {book.categories.map((category) => (
                        <Badge key={category} variant="secondary">
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{book.location ?? '—'}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {pagination.total_pages > 1 && (
        <nav
          aria-label="Paginación"
          className="mt-4 flex items-center justify-end gap-2"
        >
          <span className="mr-2 text-sm text-muted-foreground">
            Página {pagination.page} de {pagination.total_pages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={pagination.page <= 1}
            onClick={() => visit({ page: pagination.page - 1 })}
          >
            <ChevronLeft />
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={pagination.page >= pagination.total_pages}
            onClick={() => visit({ page: pagination.page + 1 })}
          >
            Siguiente
            <ChevronRight />
          </Button>
        </nav>
      )}
    </PublicLayout>
  )
}
