# Mi Biblioteca

Catálogo de libros para una biblioteca escolar. El listado es público y un usuario administrador puede crear, editar y borrar libros.

## Stack

- Ruby 4.0.6 / Rails 8.1
- PostgreSQL
- [Inertia.js](https://inertia-rails.dev) + React 19 + TypeScript
- Vite, Tailwind CSS 4 y [shadcn/ui](https://ui.shadcn.com)

## Requisitos

- Ruby 4.0.6 (ver `.ruby-version`)
- Node 24 (ver `.nvmrc`)
- PostgreSQL con un rol para tu usuario del sistema:

  ```bash
  sudo -u postgres createuser --superuser $USER
  ```

## Puesta en marcha

```bash
nvm use
bin/setup
```

`bin/setup` instala las gemas, crea la base de datos y levanta el servidor. Para levantarlo después:

```bash
bin/dev
```

La app queda en http://localhost:3000.

## Datos de ejemplo y administrador

En desarrollo, `bin/rails db:seed` carga un catálogo de ejemplo y crea el administrador:

- Email: `admin@mibiblioteca.local`
- Contraseña: `biblioteca`

El login está en http://localhost:3000/ingresar y el panel en http://localhost:3000/admin.

Borrar un libro desde el panel no lo elimina: lo mueve a la **papelera** (`/admin/libros/papelera`), desde donde se puede restaurar o eliminar definitivamente.

En producción el seed solo crea el administrador, a partir de las variables `ADMIN_EMAIL` y `ADMIN_PASSWORD`. Si el usuario ya existe, no le cambia la contraseña.

### Cambiar la contraseña del administrador

```bash
bin/rails admin:password
```

Pide la contraseña nueva dos veces y cierra las sesiones abiertas. Si hay más de un administrador, se elige con `EMAIL=...`.

## Comandos útiles

Antes de correr comandos que usen Node (tests, `npm`, `npx`), activá la versión del proyecto con `nvm use`. `bin/dev` lo hace solo.

```bash
bin/rails test        # tests
bin/rubocop           # estilo Ruby
npm run check         # chequeo de tipos TypeScript
npx shadcn@latest add <componente>   # agregar componentes de shadcn
```
