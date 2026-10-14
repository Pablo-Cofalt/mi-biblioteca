import { router } from '@inertiajs/react'
import { useEffect, useRef, useState } from 'react'

import type { BookFilters } from '@/types'

const SEARCH_DELAY_MS = 300

type Changes = Partial<BookFilters> & { page?: number }

// Search, filter, sort and page changes for a book list, kept in the URL.
export function useBookList(url: string, filters: BookFilters) {
  const [query, setQuery] = useState(filters.q ?? '')
  const lastSubmittedQuery = useRef(filters.q ?? '')

  const visit = (changes: Changes, { replace = false } = {}) => {
    const params = { ...filters, page: undefined, ...changes }
    // Leave empty values and defaults out of the URL.
    const data = Object.fromEntries(
      Object.entries(params).filter(
        ([key, value]) =>
          value !== null &&
          value !== undefined &&
          value !== '' &&
          !(key === 'direction' && value === 'asc') &&
          !(key === 'page' && value === 1),
      ),
    )

    router.get(url, data, { preserveState: true, replace })
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

  return { query, setQuery, visit, hasFilters, clearFilters, toggleDirection }
}
