import { router } from '@inertiajs/react'
import { Merge } from 'lucide-react'
import { useState } from 'react'

import { FilterCombobox } from '@/components/filter-combobox'
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
import type { CatalogEntryRow, CatalogList, Option } from '@/types'

type MergeDialogProps = {
  list: CatalogList
  entry: CatalogEntryRow
  options: Option[]
}

// Moves every book of `entry` to another entry and trashes `entry`.
export function MergeDialog({ list, entry, options }: MergeDialogProps) {
  const [open, setOpen] = useState(false)
  const [targetId, setTargetId] = useState<number | null>(null)
  const [processing, setProcessing] = useState(false)
  const targets = options.filter((option) => option.id !== entry.id)
  const target = targets.find((option) => option.id === targetId)

  const submit = () =>
    router.post(
      `${list.path}/${entry.id}/unificar`,
      { target_id: targetId },
      {
        preserveScroll: true,
        onStart: () => setProcessing(true),
        onFinish: () => setProcessing(false),
        onSuccess: () => setOpen(false),
      },
    )

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (next) setTargetId(null)
      }}
    >
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon-sm" title="Unificar con otro" aria-label={`Unificar “${entry.name}” con otro`}>
          <Merge />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Unificar “{entry.name}”</DialogTitle>
          <DialogDescription>
            Sus libros pasan a la opción que elijas y “{entry.name}” se mueve
            a la papelera. Sirve para corregir duplicados.
          </DialogDescription>
        </DialogHeader>
        <FilterCombobox
          label={`Elegir ${list.singular}`}
          placeholder="Buscar…"
          options={targets}
          value={targetId}
          onChange={setTargetId}
          allowAll={false}
          className="w-full sm:w-full"
        />
        {target && (
          <p className="text-sm text-muted-foreground">
            {entry.books_count === 1 ? '1 libro pasa' : `${entry.books_count} libros pasan`} a “{target.name}”.
          </p>
        )}
        <DialogFooter>
          <Button onClick={submit} disabled={!targetId || processing}>
            Unificar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
