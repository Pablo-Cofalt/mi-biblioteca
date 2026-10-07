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

## Comandos útiles

```bash
bin/rails test        # tests
bin/rubocop           # estilo Ruby
npm run check         # chequeo de tipos TypeScript
npx shadcn@latest add <componente>   # agregar componentes de shadcn
```
