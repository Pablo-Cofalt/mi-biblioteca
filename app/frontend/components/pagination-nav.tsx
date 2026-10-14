import { ChevronLeft, ChevronRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import type { Pagination } from '@/types'

type PaginationNavProps = {
  pagination: Pagination
  onPageChange: (page: number) => void
}

export function PaginationNav({ pagination, onPageChange }: PaginationNavProps) {
  if (pagination.total_pages <= 1) return null

  return (
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
        onClick={() => onPageChange(pagination.page - 1)}
      >
        <ChevronLeft />
        Anterior
      </Button>
      <Button
        variant="outline"
        size="sm"
        disabled={pagination.page >= pagination.total_pages}
        onClick={() => onPageChange(pagination.page + 1)}
      >
        Siguiente
        <ChevronRight />
      </Button>
    </nav>
  )
}
