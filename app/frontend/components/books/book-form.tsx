import { Link, useForm } from '@inertiajs/react'
import type { FormEvent } from 'react'

import { MultiCombobox } from '@/components/multi-combobox'
import { Button } from '@/components/ui/button'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import type { BookRow, Option } from '@/types'

type BookFormProps = {
  book: Omit<BookRow, 'id'> & { id: number | null }
  authors: Option[]
  categories: Option[]
  publishers: Option[]
}

export function BookForm({ book, authors, categories, publishers }: BookFormProps) {
  const form = useForm({
    title: book.title,
    location: book.location ?? '',
    authors: book.authors,
    publishers: book.publishers,
    categories: book.categories,
  })
  form.transform((data) => ({ book: data }))

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (book.id) {
      form.patch(`/admin/libros/${book.id}`)
    } else {
      form.post('/admin/libros')
    }
  }

  const names = (options: Option[]) => options.map((option) => option.name)

  return (
    <form onSubmit={submit} className="max-w-2xl">
      <FieldGroup>
        <Field data-invalid={!!form.errors.title}>
          <FieldLabel htmlFor="title">Título</FieldLabel>
          <Input
            id="title"
            autoFocus
            required
            aria-invalid={!!form.errors.title}
            value={form.data.title}
            onChange={(event) => form.setData('title', event.target.value)}
          />
          {form.errors.title && <FieldError>{form.errors.title}</FieldError>}
        </Field>

        <Field>
          <FieldLabel htmlFor="authors">Autor(es)</FieldLabel>
          <MultiCombobox
            id="authors"
            addLabel="Agregar autor"
            placeholder="Buscar o crear autor…"
            options={names(authors)}
            value={form.data.authors}
            onChange={(value) => form.setData('authors', value)}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="publishers">Editorial(es)</FieldLabel>
          <MultiCombobox
            id="publishers"
            addLabel="Agregar editorial"
            placeholder="Buscar o crear editorial…"
            options={names(publishers)}
            value={form.data.publishers}
            onChange={(value) => form.setData('publishers', value)}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="categories">Categorías</FieldLabel>
          <MultiCombobox
            id="categories"
            addLabel="Agregar categoría"
            placeholder="Buscar o crear categoría…"
            options={names(categories)}
            value={form.data.categories}
            onChange={(value) => form.setData('categories', value)}
          />
        </Field>

        <Field data-invalid={!!form.errors.location}>
          <FieldLabel htmlFor="location">Ubicación</FieldLabel>
          <Input
            id="location"
            placeholder="Ej.: Estante 3 - B"
            aria-invalid={!!form.errors.location}
            value={form.data.location}
            onChange={(event) => form.setData('location', event.target.value)}
          />
          <FieldDescription>Dónde está el libro en la biblioteca.</FieldDescription>
          {form.errors.location && (
            <FieldError>{form.errors.location}</FieldError>
          )}
        </Field>

        <div className="flex gap-2">
          <Button type="submit" disabled={form.processing}>
            {form.processing ? 'Guardando…' : 'Guardar'}
          </Button>
          <Button variant="outline" asChild>
            <Link href="/admin/libros">Cancelar</Link>
          </Button>
        </div>
      </FieldGroup>
    </form>
  )
}
