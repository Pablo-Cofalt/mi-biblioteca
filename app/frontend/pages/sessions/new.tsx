import { Head, Link, useForm } from '@inertiajs/react'
import { BookOpen } from 'lucide-react'
import type { FormEvent } from 'react'

import { FlashMessages } from '@/components/flash-messages'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

export default function SessionsNew() {
  const form = useForm({ email_address: '', password: '' })

  const submit = (event: FormEvent) => {
    event.preventDefault()
    form.post('/session', { onError: () => form.reset('password') })
  }

  const error = form.errors.email_address

  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted/40 p-6">
      <Head title="Ingresar" />

      <Link href="/" className="flex items-center gap-2 font-semibold">
        <BookOpen className="size-5" />
        Mi Biblioteca
      </Link>

      <div className="w-full max-w-sm">
        <FlashMessages />
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Ingresar</CardTitle>
            <CardDescription>
              Acceso para administradores de la biblioteca.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit}>
              <FieldGroup>
                <Field data-invalid={!!error}>
                  <FieldLabel htmlFor="email_address">Email</FieldLabel>
                  <Input
                    id="email_address"
                    type="email"
                    autoComplete="username"
                    autoFocus
                    required
                    aria-invalid={!!error}
                    value={form.data.email_address}
                    onChange={(event) =>
                      form.setData('email_address', event.target.value)
                    }
                  />
                </Field>
                <Field data-invalid={!!error}>
                  <FieldLabel htmlFor="password">Contraseña</FieldLabel>
                  <Input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    aria-invalid={!!error}
                    value={form.data.password}
                    onChange={(event) =>
                      form.setData('password', event.target.value)
                    }
                  />
                  {error && <FieldError>{error}</FieldError>}
                </Field>
                <Button type="submit" disabled={form.processing}>
                  {form.processing ? 'Ingresando…' : 'Ingresar'}
                </Button>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
