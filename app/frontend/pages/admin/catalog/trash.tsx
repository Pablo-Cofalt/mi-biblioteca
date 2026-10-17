import { Head, Link, router } from '@inertiajs/react'
import { ArrowLeft, RotateCcw, Trash2 } from 'lucide-react'

import { PaginationNav } from '@/components/pagination-nav'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import AdminLayout from '@/layouts/admin-layout'
import type { CatalogEntryRow, CatalogList, Pagination } from '@/types'

type TrashedEntry = CatalogEntryRow & { discarded_at: string }

type CatalogTrashProps = {
  list: CatalogList
  entries: TrashedEntry[]
  pagination: Pagination
}

const dateFormat = new Intl.DateTimeFormat('es-AR', {
  dateStyle: 'short',
  timeStyle: 'short',
})

export default function CatalogTrash({ list, entries, pagination }: CatalogTrashProps) {
  const restore = (entry: TrashedEntry) =>
    router.patch(`${list.path}/${entry.id}/restaurar`, {}, { preserveScroll: true })

  const purge = (entry: TrashedEntry) =>
    router.delete(`${list.path}/${entry.id}/eliminar`, { preserveScroll: true })

  return (
    <AdminLayout>
      <Head title={`Papelera de ${list.plural}`} />

      <Button variant="ghost" size="sm" className="mb-2 -ml-2" asChild>
        <Link href={list.path}>
          <ArrowLeft />
          {list.title}
        </Link>
      </Button>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">
          Papelera de {list.plural}
        </h1>
        <p className="text-sm text-muted-foreground">
          Podés restaurarlos o eliminarlos definitivamente. Los que todavía
          tienen libros en la papelera no se pueden eliminar.
        </p>
      </div>

      <div className="rounded-lg border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Borrado</TableHead>
              <TableHead>
                <span className="sr-only">Acciones</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                  La papelera está vacía.
                </TableCell>
              </TableRow>
            ) : (
              entries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="font-medium whitespace-normal">{entry.name}</TableCell>
                  <TableCell>{dateFormat.format(new Date(entry.discarded_at))}</TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button variant="outline" size="sm" onClick={() => restore(entry)}>
                        <RotateCcw />
                        Restaurar
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            disabled={entry.books_count > 0}
                            title={
                              entry.books_count > 0
                                ? 'Tiene libros en la papelera: no se puede eliminar'
                                : 'Eliminar definitivamente'
                            }
                            aria-label={`Eliminar “${entry.name}” definitivamente`}
                          >
                            <Trash2 />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Eliminar definitivamente?</AlertDialogTitle>
                            <AlertDialogDescription>
                              “{entry.name}” se va a eliminar para siempre. Esta
                              acción no se puede deshacer.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction variant="destructive" onClick={() => purge(entry)}>
                              Eliminar definitivamente
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <PaginationNav
        pagination={pagination}
        onPageChange={(page) => router.get(`${list.path}/papelera`, page > 1 ? { page } : {})}
      />
    </AdminLayout>
  )
}
