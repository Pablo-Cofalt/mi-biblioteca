import { ArrowDownAZ, ArrowUpZA } from 'lucide-react'
import type { ReactNode } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { BookRow, SortDirection } from '@/types'

type BookTableProps<T extends BookRow> = {
  books: T[]
  direction?: SortDirection
  onToggleDirection?: () => void
  emptyMessage?: string
  extraColumn?: { header: string; cell: (book: T) => ReactNode }
  actions?: (book: T) => ReactNode
}

export function BookTable<T extends BookRow>({
  books,
  direction,
  onToggleDirection,
  emptyMessage = 'No se encontraron libros.',
  extraColumn,
  actions,
}: BookTableProps<T>) {
  const columns = 5 + (extraColumn ? 1 : 0) + (actions ? 1 : 0)

  return (
    <div className="rounded-lg border bg-background">
      <Table>
        <TableHeader>
          <TableRow>
            {direction && onToggleDirection ? (
              <TableHead
                aria-sort={direction === 'asc' ? 'ascending' : 'descending'}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className="-ml-2"
                  onClick={onToggleDirection}
                  title={
                    direction === 'asc'
                      ? 'Ordenar de la Z a la A'
                      : 'Ordenar de la A a la Z'
                  }
                >
                  Título
                  {direction === 'asc' ? <ArrowDownAZ /> : <ArrowUpZA />}
                </Button>
              </TableHead>
            ) : (
              <TableHead>Título</TableHead>
            )}
            <TableHead>Autor(es)</TableHead>
            <TableHead>Editorial(es)</TableHead>
            <TableHead>Categorías</TableHead>
            <TableHead>Ubicación</TableHead>
            {extraColumn && <TableHead>{extraColumn.header}</TableHead>}
            {actions && (
              <TableHead>
                <span className="sr-only">Acciones</span>
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {books.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns}
                className="h-24 text-center text-muted-foreground"
              >
                {emptyMessage}
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
                {extraColumn && <TableCell>{extraColumn.cell(book)}</TableCell>}
                {actions && (
                  <TableCell className="text-right">{actions(book)}</TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
