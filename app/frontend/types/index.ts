export type FlashData = {
  notice?: string
  alert?: string
  // URL that reverts the action just taken (e.g. restore a discarded book).
  undo?: string
}

export type User = {
  id: number
  email_address: string
}

export type SharedProps = {
  auth: {
    user: User | null
  }
}

export type Option = {
  id: number
  name: string
}

export type SortDirection = 'asc' | 'desc'

export type BookFilters = {
  q: string | null
  author_id: number | null
  category_id: number | null
  publisher_id: number | null
  direction: SortDirection
}

export type Pagination = {
  page: number
  total_pages: number
  total_count: number
  per_page: number
}

export type BookRow = {
  id: number
  title: string
  location: string | null
  authors: string[]
  categories: string[]
  publishers: string[]
}

export type CatalogList = {
  singular: string
  plural: string
  title: string
  new: string
  path: string
  // Book list filter param for this list, e.g. "author_id".
  book_filter: string
}

export type CatalogEntryRow = {
  id: number
  name: string
  books_count: number
}
