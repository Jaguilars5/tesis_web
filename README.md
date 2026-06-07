# front-web

Proyecto base de React + TypeScript + Vite para el frontend de EduManage. Incluye Docker Compose, Redux Toolkit, Axios con JWT runtime, rutas publicas/privadas, Formik + Yup mediante hooks custom, Tailwind CSS moderno con `@tailwindcss/vite` y estilos inspirados en `desing.html`.

## Requisitos

- Node.js 22 o superior para ejecucion local.
- Docker y Docker Compose para el entorno reproducible.

## Variables de entorno

Crea un archivo `.env` a partir de `.env.example` cuando necesites cambiar la API:

```bash
VITE_API_URL=http://localhost:3000/api
```

## Ejecucion con Docker

```bash
docker compose up --build
```

La app queda disponible en:

```bash
http://localhost:5173
```

## Ejecucion local alternativa

```bash
npm install
npm run dev
```

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## Auth y JWT

- `POST /auth/login` debe devolver `{ "token": "..." }`.
- `POST /auth/register` debe devolver `{ "token": "..." }`.
- El JWT se decodifica para construir el usuario.
- El token vive solo en memoria mediante `tokenManager`; al recargar la pagina se pierde la sesion.
- Un `401` global limpia la sesion y redirige a `/login`.

## Estructura principal

```text
src/
  app/
    routes/
    styles/
  features/
    auth/
    dashboard/
    profile/
  shared/
    components/
      Form/
      Layout/
    hooks/
    redux/
    services/
    types/
```
