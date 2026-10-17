import type { RequestPayload } from '@inertiajs/core'
import { router } from '@inertiajs/react'

import { useDebouncedSearch } from '@/hooks/use-debounced-search'
import type { BookFilters } from '@/types'

type Changes = Partial<BookFilters> & { page?: number }

// Leave empty values and defaults out of the URL.
export function cleanParams(params: Record<string, unknown>): RequestPayload {
  return Object.fromEntries(
    Object.entries(params).filter(
      ([key, value]) =>
        value !== null &&
        value !== undefined &&
        value !== '' &&
        !(key === 'direction' && value === 'asc') &&
        !(key === 'page' && value === 1),
    ),
  ) as RequestPayload
}

// Search, filter, sort and page changes for a book list, kept in the URL.
export function useBookList(url: string, filters: BookFilters) {
  const visit = (changes: Changes, { replace = false } = {}) => {
    const params = { ...filters, page: undefined, ...changes }
    router.get(url, cleanParams(params), { preserveState: true, replace })
  }

  const search = useDebouncedSearch(filters.q, (q) => visit({ q }, { replace: true }))

  const hasFilters =
    filters.q !== null ||
    filters.author_id !== null ||
    filters.category_id !== null ||
    filters.publisher_id !== null

  const clearFilters = () => {
    search.reset()
    visit({ q: null, author_id: null, category_id: null, publisher_id: null })
  }

  const toggleDirection = () =>
    visit({ direction: filters.direction === 'asc' ? 'desc' : 'asc' })

  return {
    query: search.query,
    setQuery: search.setQuery,
    visit,
    hasFilters,
    clearFilters,
    toggleDirection,
  }
}
