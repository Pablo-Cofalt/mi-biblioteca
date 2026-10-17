import { useForm } from '@inertiajs/react'
import { Pencil } from 'lucide-react'
import { useState, type FormEvent } from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import type { CatalogEntryRow, CatalogList } from '@/types'

export function RenameDialog({ list, entry }: { list: CatalogList; entry: CatalogEntryRow }) {
  const [open, setOpen] = useState(false)
  const form = useForm({ name: entry.name })
  form.transform((data) => ({ entry: data }))

  const submit = (event: FormEvent) => {
    event.preventDefault()
    form.patch(`${list.path}/${entry.id}`, {
      preserveScroll: true,
      onSuccess: () => setOpen(false),
    })
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (next) {
          form.setData('name', entry.name)
          form.clearErrors()
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon-sm" title="Renombrar" aria-label={`Renombrar “${entry.name}”`}>
          <Pencil />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={submit} className="grid gap-4">
          <DialogHeader>
            <DialogTitle>Renombrar {list.singular}</DialogTitle>
            <DialogDescription>
              El cambio se aplica a todos sus libros.
            </DialogDescription>
          </DialogHeader>
          <Field data-invalid={!!form.errors.name}>
            <FieldLabel htmlFor={`rename-${entry.id}`}>Nombre</FieldLabel>
            <Input
              id={`rename-${entry.id}`}
              autoFocus
              required
              aria-invalid={!!form.errors.name}
              value={form.data.name}
              onChange={(event) => form.setData('name', event.target.value)}
            />
            {form.errors.name && <FieldError>{form.errors.name}</FieldError>}
          </Field>
          <DialogFooter>
            <Button type="submit" disabled={form.processing}>
              Guardar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
