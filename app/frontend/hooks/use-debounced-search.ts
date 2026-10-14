import { useEffect, useRef, useState } from 'react'

const SEARCH_DELAY_MS = 300

// A search box that calls `onSearch` once the user stops typing, and
// follows `current` when the URL changes elsewhere (back/forward, clear).
export function useDebouncedSearch(
  current: string | null,
  onSearch: (query: string | null) => void,
) {
  const [query, setQuery] = useState(current ?? '')
  const lastSubmitted = useRef(current ?? '')

  useEffect(() => {
    const value = current ?? ''
    if (value !== lastSubmitted.current) {
      lastSubmitted.current = value
      setQuery(value)
    }
  }, [current])

  useEffect(() => {
    const trimmed = query.trim()
    if (trimmed === lastSubmitted.current) return

    const timeout = setTimeout(() => {
      lastSubmitted.current = trimmed
      onSearch(trimmed || null)
    }, SEARCH_DELAY_MS)

    return () => clearTimeout(timeout)
  }, [query])

  const reset = () => {
    lastSubmitted.current = ''
    setQuery('')
  }

  return { query, setQuery, reset }
}
