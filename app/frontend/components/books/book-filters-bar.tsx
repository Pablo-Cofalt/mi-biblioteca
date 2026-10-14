import { Search, X } from 'lucide-react'

import { FilterCombobox } from '@/components/filter-combobox'
import { Button } from '@/components/ui/button'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group'
import type { useBookList } from '@/hooks/use-book-list'
import type { BookFilters, Option } from '@/types'

type BookFiltersBarProps = {
  list: ReturnType<typeof useBookList>
  filters: BookFilters
  authors: Option[]
  categories: Option[]
  publishers: Option[]
}

export function BookFiltersBar({
  list,
  filters,
  authors,
  categories,
  publishers,
}: BookFiltersBarProps) {
  return (
    <div className="mb-4 flex flex-col gap-2 lg:flex-row lg:items-center">
      <InputGroup className="bg-background lg:max-w-xs">
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
        <InputGroupInput
          type="search"
          placeholder="Buscar por título o autor…"
          aria-label="Buscar por título o autor"
          value={list.query}
          onChange={(event) => list.setQuery(event.target.value)}
        />
      </InputGroup>

      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <FilterCombobox
          label="Editorial"
          placeholder="Buscar editorial…"
          options={publishers}
          value={filters.publisher_id}
          onChange={(publisher_id) => list.visit({ publisher_id })}
        />
        <FilterCombobox
          label="Categoría"
          placeholder="Buscar categoría…"
          options={categories}
          value={filters.category_id}
          onChange={(category_id) => list.visit({ category_id })}
        />
        <FilterCombobox
          label="Autor"
          placeholder="Buscar autor…"
          options={authors}
          value={filters.author_id}
          onChange={(author_id) => list.visit({ author_id })}
        />
        {list.hasFilters && (
          <Button variant="ghost" onClick={list.clearFilters}>
            <X />
            Limpiar filtros
          </Button>
        )}
      </div>
    </div>
  )
}
