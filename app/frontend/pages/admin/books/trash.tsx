import { Head, Link, router } from '@inertiajs/react'
import { ArrowLeft, RotateCcw, Trash2 } from 'lucide-react'

import { BookTable } from '@/components/books/book-table'
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
import AdminLayout from '@/layouts/admin-layout'
import type { BookRow, Pagination } from '@/types'

type TrashedBook = BookRow & { discarded_at: string }

type AdminBooksTrashProps = {
  books: TrashedBook[]
  pagination: Pagination
}

const dateFormat = new Intl.DateTimeFormat('es-AR', {
  dateStyle: 'short',
  timeStyle: 'short',
})

export default function AdminBooksTrash({ books, pagination }: AdminBooksTrashProps) {
  const restore = (book: TrashedBook) =>
    router.patch(`/admin/libros/${book.id}/restaurar`, {}, { preserveScroll: true })

  const purge = (book: TrashedBook) =>
    router.delete(`/admin/libros/${book.id}/eliminar`, { preserveScroll: true })

  return (
    <AdminLayout>
      <Head title="Papelera" />

      <Button variant="ghost" size="sm" className="mb-2 -ml-2" asChild>
        <Link href="/admin/libros">
          <ArrowLeft />
          Libros
        </Link>
      </Button>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Papelera</h1>
        <p className="text-sm text-muted-foreground">
          Los libros borrados quedan acá. Podés restaurarlos o eliminarlos
          definitivamente.
        </p>
      </div>

      <BookTable
        books={books}
        emptyMessage="La papelera está vacía."
        extraColumn={{
          header: 'Borrado',
          cell: (book) => dateFormat.format(new Date(book.discarded_at)),
        }}
        actions={(book) => (
          <div className="flex justify-end gap-1">
            <Button variant="outline" size="sm" onClick={() => restore(book)}>
              <RotateCcw />
              Restaurar
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Eliminar “${book.title}” definitivamente`}
                  title="Eliminar definitivamente"
                >
                  <Trash2 />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Eliminar definitivamente?</AlertDialogTitle>
                  <AlertDialogDescription>
                    “{book.title}” se va a eliminar para siempre. Esta acción
                    no se puede deshacer.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    variant="destructive"
                    onClick={() => purge(book)}
                  >
                    Eliminar definitivamente
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      />

      <PaginationNav
        pagination={pagination}
        onPageChange={(page) =>
          router.get('/admin/libros/papelera', page > 1 ? { page } : {})
        }
      />
    </AdminLayout>
  )
}
