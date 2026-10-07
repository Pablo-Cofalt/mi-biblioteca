import { Head } from '@inertiajs/react'
import { BookOpen } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function Home() {
  return (
    <>
      <Head title="Inicio" />
      <main className="flex min-h-svh items-center justify-center bg-muted p-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <BookOpen className="size-5" />
              Mi Biblioteca
            </CardTitle>
            <CardDescription>
              Catálogo de libros de la biblioteca escolar.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" disabled>
              Próximamente: listado de libros
            </Button>
          </CardContent>
        </Card>
      </main>
    </>
  )
}
