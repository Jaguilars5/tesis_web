# API - Módulo Institutions

Esta API gestiona las entidades base del sistema: años escolares, niveles académicos, subniveles, grados académicos y secciones (aulas/paralelos).

---

## Formato de Respuesta

Todas las peticiones siguen el formato estandarizado:

```json
{
  "ok": true,
  "data": {},
  "msg": ""
}
```

Los listados de entidades paginadas devuelven `data` con estructura `{ count, next, previous, results }`.

---

## Autenticación y Permisos

Header requerido:

```
Authorization: Bearer <access_token>
```

| Endpoint                      | Método | Permiso                              |
| ----------------------------- | ------ | ------------------------------------ |
| `school-year/`                | GET    | `institutions.view_school_year`      |
| `school-year/`                | POST   | `institutions.create_school_year`    |
| `school-year/{id}/`           | GET    | `institutions.view_school_year`      |
| `school-year/{id}/`           | PATCH  | `institutions.update_school_year`    |
| `school-year/{id}/`           | DELETE | `institutions.delete_school_year`    |
| `academic-levels/`            | GET    | `institutions.view_academic_level`   |
| `academic-levels/`            | POST   | `institutions.create_academic_level` |
| `academic-levels/{id}/`       | GET    | `institutions.view_academic_level`   |
| `academic-levels/{id}/`       | PATCH  | `institutions.update_academic_level` |
| `academic-levels/{id}/`       | DELETE | `institutions.delete_academic_level` |
| `academic-subnivel/`          | GET    | `institutions.view_academic_subnivel`   |
| `academic-subnivel/`          | POST   | `institutions.create_academic_subnivel` |
| `academic-subnivel/{id}/`     | GET    | `institutions.view_academic_subnivel`   |
| `academic-subnivel/{id}/`     | PATCH  | `institutions.update_academic_subnivel` |
| `academic-subnivel/{id}/`     | DELETE | `institutions.delete_academic_subnivel` |
| `academic-grades/`            | GET    | `institutions.view_academic_grade`   |
| `academic-grades/`            | POST   | `institutions.create_academic_grade` |
| `academic-grades/{id}/`       | GET    | `institutions.view_academic_grade`   |
| `academic-grades/{id}/`       | PATCH  | `institutions.update_academic_grade` |
| `academic-grades/{id}/`       | DELETE | `institutions.delete_academic_grade` |
| `section/`                    | GET    | `institutions.view_section`          |
| `section/`                    | POST   | `institutions.create_section`        |
| `section/{id}/`               | GET    | `institutions.view_section`          |
| `section/{id}/`               | PATCH  | `institutions.update_section`        |
| `section/{id}/`               | DELETE | `institutions.delete_section`        |
| `section/{id}/soft-delete/`   | POST   | `institutions.delete_section`        |

---

## Años Escolares (`/api/institutions/school-year/`)

### Listar

**GET** `/api/institutions/school-year/`

Response:

```json
{
  "ok": true,
  "data": {
    "count": 1,
    "next": null,
    "previous": null,
    "results": [
      {
        "id": 1,
        "name": "2024-2025",
        "start_date": "2024-09-01",
        "end_date": "2025-07-31",
        "is_active": true
      }
    ]
  },
  "msg": ""
}
```

### Crear

**POST** `/api/institutions/school-year/`

Request:

```json
{
  "name": "2024-2025",
  "start_date": "2024-09-01",
  "end_date": "2025-07-31"
}
```

### Actualizar

**PATCH** `/api/institutions/school-year/{id}/`

### Eliminar (Soft Delete)

**DELETE** `/api/institutions/school-year/{id}/` — desactiva (`is_active=False`) vía `InstitutionService.deactivate_school_year`.

---



## Niveles Académicos (`/api/institutions/academic-levels/`)

### Listar

**GET** `/api/institutions/academic-levels/`

### Crear

**POST** `/api/institutions/academic-levels/`

Request:

```json
{
  "name": "Educación General Básica",
  "active": true
}
```

---

## Subniveles Académicos (`/api/institutions/academic-subnivel/`)

Incluye `academic_level_name` (campo de solo lectura resuelto vía FK a `AcademicLevel`).

### Listar

**GET** `/api/institutions/academic-subnivel/`

Response:

```json
{
  "ok": true,
  "data": {
    "count": 2,
    "results": [
      {
        "id": 1,
        "academic_level": 1,
        "academic_level_name": "Educación General Básica",
        "code": "BASICA",
        "name": "Básica",
        "order": 1,
        "is_active": true
      }
    ]
  },
  "msg": ""
}
```

### Crear

**POST** `/api/institutions/academic-subnivel/`

Request:

```json
{
  "academic_level": 1,
  "code": "BASICA",
  "name": "Básica",
  "order": 1
}
```

---

## Grados Académicos (`/api/institutions/academic-grades/`)

Incluye `academic_level_name` (campo de solo lectura resuelto vía propiedad del modelo).

### Listar

**GET** `/api/institutions/academic-grades/`

Response:

```json
{
  "ok": true,
  "data": {
    "count": 2,
    "results": [
      {
        "id": 1,
        "academic_subnivel": 1,
        "academic_level_name": "Educación General Básica",
        "name": "8vo EGB",
        "sequence_order": 8,
        "is_active": true
      }
    ]
  },
  "msg": ""
}
```

### Crear

**POST** `/api/institutions/academic-grades/`

Request:

```json
{
  "academic_subnivel": 1,
  "name": "8vo EGB",
  "sequence_order": 8
}
```

---

## Secciones (`/api/institutions/section/`)

Incluye `school_year_name` y `academic_grade_name` como campos de solo lectura.

### Listar

**GET** `/api/institutions/section/`

### Crear

**POST** `/api/institutions/section/`

Request:

```json
{
  "school_year": 1,
  "academic_grade": 1,
  "parallel": "A",
  "capacity": 30
}
```

### Eliminar (Soft Delete)

**POST** `/api/institutions/section/{id}/soft-delete/` — desactiva (`is_active=False`).

---

## Notas

- No existe el modelo `Institution` en este módulo. La gestión institucional se realiza a través de `SchoolYear` (años escolares).
- El patrón usado es RESTful con `DefaultRouter` (5 ViewSets registrados).
- `Section` ahora tiene su propio ViewSet en institutions (`SectionViewSet`) con CRUD completo + soft-delete (`/soft-delete/`).
- `AcademicGrade` usa FK a `AcademicSubnivel` (no directamente a `AcademicLevel`). El campo `academic_level_name` se resuelve como propiedad del modelo.
- Todos los modelos usan `is_active` para borrado lógico (no `active`).
