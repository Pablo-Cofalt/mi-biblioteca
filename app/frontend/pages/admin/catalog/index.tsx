import { Head, Link, router, useForm } from '@inertiajs/react'
import { Plus, Search, Trash2 } from 'lucide-react'
import type { FormEvent } from 'react'

import { MergeDialog } from '@/components/catalog/merge-dialog'
import { RenameDialog } from '@/components/catalog/rename-dialog'
import { PaginationNav } from '@/components/pagination-nav'
import { Button } from '@/components/ui/button'
import { Field, FieldError } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
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
import { cleanParams } from '@/hooks/use-book-list'
import { useDebouncedSearch } from '@/hooks/use-debounced-search'
import AdminLayout from '@/layouts/admin-layout'
import type { CatalogEntryRow, CatalogList, Option, Pagination } from '@/types'

type CatalogIndexProps = {
  list: CatalogList
  entries: CatalogEntryRow[]
  filters: { q: string | null }
  pagination: Pagination
  trash_count: number
  all_entries: Option[]
}

export default function CatalogIndex({
  list,
  entries,
  filters,
  pagination,
  trash_count,
  all_entries,
}: CatalogIndexProps) {
  const visit = (params: { q?: string | null; page?: number }, replace = false) =>
    router.get(list.path, cleanParams({ q: filters.q, ...params }), {
      preserveState: true,
      replace,
    })

  const search = useDebouncedSearch(filters.q, (q) => visit({ q }, true))

  const form = useForm({ name: '' })
  form.transform((data) => ({ entry: data }))

  const create = (event: FormEvent) => {
    event.preventDefault()
    form.post(list.path, { preserveScroll: true, onSuccess: () => form.reset() })
  }

  const discard = (entry: CatalogEntryRow) =>
    router.delete(`${list.path}/${entry.id}`, { preserveScroll: true })

  return (
    <AdminLayout>
      <Head title={list.title} />

      <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{list.title}</h1>
          <p className="text-sm text-muted-foreground">
            {pagination.total_count === 1
              ? `1 ${list.singular}`
              : `${pagination.total_count} ${list.plural}`}
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href={`${list.path}/papelera`}>
            <Trash2 />
            Papelera ({trash_count})
          </Link>
        </Button>
      </div>

      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <InputGroup className="bg-background sm:max-w-xs">
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
          <InputGroupInput
            type="search"
            placeholder={`Buscar ${list.singular}…`}
            aria-label={`Buscar ${list.singular}`}
            value={search.query}
            onChange={(event) => search.setQuery(event.target.value)}
          />
        </InputGroup>

        <form onSubmit={create} className="flex gap-2">
          <Field data-invalid={!!form.errors.name} className="sm:w-64">
            <Input
              placeholder={list.new}
              aria-label={list.new}
              required
              aria-invalid={!!form.errors.name}
              value={form.data.name}
              onChange={(event) => form.setData('name', event.target.value)}
              className="bg-background"
            />
            {form.errors.name && <FieldError>{form.errors.name}</FieldError>}
          </Field>
          <Button type="submit" disabled={form.processing}>
            <Plus />
            Agregar
          </Button>
        </form>
      </div>

      <div className="rounded-lg border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead className="text-right">Libros</TableHead>
              <TableHead>
                <span className="sr-only">Acciones</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                  No se encontraron {list.plural}.
                </TableCell>
              </TableRow>
            ) : (
              entries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="font-medium whitespace-normal">{entry.name}</TableCell>
                  <TableCell className="text-right tabular-nums">
                    {entry.books_count > 0 ? (
                      <Link
                        href={`/admin/libros?${list.book_filter}=${entry.id}`}
                        className="underline-offset-4 hover:underline"
                        title={`Ver libros de “${entry.name}”`}
                      >
                        {entry.books_count}
                      </Link>
                    ) : (
                      <span className="text-muted-foreground">0</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <RenameDialog list={list} entry={entry} />
                      <MergeDialog list={list} entry={entry} options={all_entries} />
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        disabled={entry.books_count > 0}
                        onClick={() => discard(entry)}
                        title={
                          entry.books_count > 0
                            ? 'Tiene libros: no se puede borrar (podés unificarlo con otro)'
                            : 'Mover a la papelera'
                        }
                        aria-label={`Mover “${entry.name}” a la papelera`}
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <PaginationNav pagination={pagination} onPageChange={(page) => visit({ page })} />
    </AdminLayout>
  )
}
