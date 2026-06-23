# Plan de implementación — Frontend (web-front)

> Objetivo: agregar el dominio **iam** (usuarios, roles, permisos), completar lo
> faltante de **students** y **analytics**, y limpiar lo obsoleto.
> `people` **NO** se implementa: las personas se crean automáticamente al crear
> usuarios (ver `UserCreateSerializer` del backend).

## Checkpoints de seguridad (ya creados)
- back: commit `8ae1530` (rama `refactor/auditoria-modelo`)
- front: commit `52db926`

Si algo se rompe: `git reset --hard <commit>` en el repo correspondiente.

---

## Patrón de referencia (obligatorio)
Todo módulo nuevo sigue la **estructura FLAT canónica** del módulo
`src/features/academic/academic-period/`. Por cada módulo:

```
module-name/
  index.ts                     # barrel
  module-name.types.ts         # entidad + params CRUD + interface service + form values
  module-name.constants.ts     # endpoints + permisos
  module-name.service.ts       # clase con apiClient (list extrae .results)
  module-name.slice.ts         # createSlice + selectors (SIN thunks)
  module-name.controller.ts    # useController + useForm
  module-name.utils.ts         # Yup schema + helpers
  ModuleNamePage.tsx
  components/
    ModuleNameTable.tsx
    ModuleNameFormModal.tsx
    ModuleNameViewModal.tsx
    ModuleNameDeleteModal.tsx
```

Integración en 3 puntos: barrel de dominio (`features/<dominio>/index.ts`),
store (`shared/redux/store.ts`) y rutas (`<dominio>.routes.config.ts`).

Verificación tras cada fase: `npm run typecheck` y `npm run lint`.

---

## FASE 1 — Dominio `iam` (prioridad ALTA)

Crear nuevo dominio `src/features/iam/` con 3 submódulos. Endpoint base
`/api/iam/`. **Eliminar al final** el dominio obsoleto `src/features/accounts/`.

### 1.1 `iam/permissions`
- Endpoint: `/api/iam/permissions/`
- Entidad: `{ id, code, description, module, created_at, updated_at }`
- CRUD completo. Acciones extra del backend (opcionales en UI):
  `POST /permissions/bulk-create/`, `GET /permissions/by_module/?module=`
- `ordering_fields`: `code`, `module`, `created_at`
- `search`: `code`, `description`
- Permisos: `iam.view_permission`, `iam.create_permission`,
  `iam.update_permission`, `iam.delete_permission`
- Store key sugerido: `permissions` → `state.iam.permissions`

### 1.2 `iam/roles`
- Endpoint: `/api/iam/roles/`
- Lista: `{ id, name, description, is_active, created_at }`
- Detalle (retrieve) agrega `role_permissions: RolePermission[]`
  (cada uno con `permission` embebido)
- CRUD + asignación de permisos:
  - `POST /roles/{id}/assign_permissions/`  body `{ permission_codes: string[] }`
  - `POST /roles/{id}/add-permission/`      body `{ permission_code }`
  - `POST /roles/{id}/remove-permission/`   body `{ permission_code }`
- `ordering_fields`: `name`, `created_at`; `search`: `name`, `description`
- Permisos: `iam.view_role`, `iam.create_role`, `iam.update_role`, `iam.delete_role`
- UI: el FormModal de rol debe incluir un selector múltiple de permisos
  (consumir `iam/permissions` como opciones) que dispare `assign_permissions`.
- Store key: `roles` → `state.iam.roles`

### 1.3 `iam/users`
- Endpoint: `/api/iam/users/`
- Lista (UserListSerializer):
  `{ id, username, dni, names, last_names, email, role, is_active, created_at }`
- Detalle (UserDetailSerializer): igual + `role` como objeto + `role_id` (write)
- **Create (UserCreateSerializer)** — payload distinto a la entidad:
  `{ document_number, names, last_names, email, password, role_id }`
  (crea la Person + User + UserRole). `username` lo genera el backend.
- Update/partial_update: estándar (`role_id` para reasignar rol).
- Delete: `DELETE /users/{id}/` (hard delete; el queryset es de activos).
- Acciones extra: `POST /users/{id}/change-password/` `{ new_password }`,
  `GET /users/{id}/permissions/`, `GET /users/search/?q=`,
  `GET /users/teachers/`, `GET /users/students/`, `GET /users/representatives/`
- `ordering_fields`: `username`, `person__email`, `created_at`
- `search`: username, names, last_names, email, document_number
- Permisos: `iam.view_user`, `iam.create_user`, `iam.update_user`, `iam.delete_user`
- UI:
  - FormModal create: campos `document_number, names, last_names, email,
    password, role_id` (selector de roles desde `iam/roles`).
  - FormModal edit: `email`, `role_id`, `is_active` (sin password).
  - Botón "Cambiar contraseña" → modal que llama `change-password`.
- Store key: `users` → `state.iam.users`

### 1.4 Integración dominio iam
- `src/features/iam/index.ts`: re-exporta los 3 submódulos + reducers + pages.
- `shared/redux/store.ts`: agregar
  `iam: combineReducers({ users, roles, permissions })`.
- `src/features/iam/iam.routes.config.ts`: grupo `iam` (sugerido `order: 8`),
  hijos: users, roles, permissions. Agregar rutas en `iam.routes.ts` y
  constantes en `src/app/routes.ts` (`USERS`, `ROLES`, `PERMISSIONS`).
- Spread `...iamRoutes` en `src/app/routes.config.ts`.

---

## FASE 2 — `students/special-needs-types` (prioridad BAJA)

Backend es **ReadOnlyModelViewSet** (solo list/retrieve), filtra `is_active`,
ordena por `name`. No es un CRUD: es un **catálogo/opciones** análogo a `kinship`.

- Endpoint: `/api/students/special-needs-types/`
- Serializer `__all__` (catálogo: típicamente `id, code, name, description,
  is_active, created_at, updated_at` — confirmar campos del modelo).
- Permiso: `students.view_special_needs_type`
- Implementación recomendada: módulo de **opciones** (como
  `students/kinship`): `special-needs-type.types.ts`, `.service.ts`,
  `.slice.ts`, `.options.ts`, `.constants.ts` + hook `useSpecialNeedsTypeOptions`.
  **Sin Page ni rutas.**
- Uso: alimentar el formulario de `students/student` (campo de necesidades
  especiales). Store key: `specialNeedsTypes` → `state.students.specialNeedsTypes`.

---

## FASE 3 — `analytics` (prioridad MEDIA)

Los endpoints ya están declarados en `analytics.constants.ts`. Faltan páginas.

### 3.1 `analytics/early-alerts` (CRUD completo — lo valioso)
- Endpoint: `/api/analytics/early-alerts/`
- Serializer `__all__` + computados read-only: `enrollment_name`,
  `academic_period_name`, `attended_by_user_name`.
- CRUD + acción `POST /early-alerts/{id}/mark_attended/`
  body `{ response_actions }`.
- Permisos: `analytics.view_early_alert`, `analytics.create_early_alert`,
  `analytics.update_early_alert`, `analytics.delete_early_alert`.
- UI: tabla con estado de atención + botón "Marcar atendida" (modal con
  `response_actions`). Store key: `earlyAlerts` → `state.analytics.earlyAlerts`.
- Ruta nueva en el grupo `analytics` de `src/app/routes.config.ts`.

### 3.2 Visores de solo lectura (opcional, diagnóstico)
Todos `ReadOnlyModelViewSet` (list/retrieve). Implementar como páginas de solo
lectura (tabla + ViewModal, sin Form/Delete) **solo si se necesitan**:
- `risk-factors` — `/api/analytics/risk-factors/` — `analytics.view_risk_factor`
- `student-risk-factors` — `/api/analytics/student-risk-factors/` —
  `analytics.view_student_risk_factor` (ya viene embebido en `risk_factors`
  dentro de cada `StudentRiskScore`, así que puede omitirse).
- `feature-snapshots` — `/api/analytics/feature-snapshots/` —
  `analytics.view_feature_snapshot` (diagnóstico del modelo ML).

> Recomendación: implementar solo `early-alerts` ahora; los visores de solo
> lectura quedan como mejora posterior.

---

## FASE 4 — Correcciones / limpieza

1. **Eliminar `src/features/accounts/`** (módulo `users` obsoleto con
   `domain/`/`infrastructure/`, sin Page, no enrutado, no en store). Reemplazado
   por `iam/users` de la Fase 1. Quitar cualquier re-export.
2. **`profile`**: migrar a estructura FLAT y **enrutarlo** (hoy `ProfilePage`
   está huérfano en `pages/`). Conectar a un endpoint de perfil (revisar si usa
   `/api/iam/users/{id}/` o un endpoint propio).
3. **`institutions.routes.ts`**: eliminar constantes de rutas muertas
   (grading/recovery) que ya no usa su propio config.

---

## Orden de ejecución sugerido
1. Fase 1.1 `permissions` → 1.2 `roles` → 1.3 `users` → 1.4 integración.
2. Fase 4.1 (eliminar `accounts`) inmediatamente después de 1.3.
3. Fase 3.1 `early-alerts`.
4. Fase 2 `special-needs-types` (al integrarlo en el form de student).
5. Fase 4.2 `profile`, 4.3 limpieza de rutas.
6. (Opcional) Fase 3.2 visores read-only.

Tras cada módulo: `npm run typecheck` + `npm run lint`. Commit por fase.

## Checklist de aceptación por módulo
- [ ] Estructura FLAT (sin `domain/application/infrastructure/presentation`)
- [ ] `types` coinciden con el serializer del backend
- [ ] `constants` con endpoints y permisos exactos del backend
- [ ] `service` clase, `list` extrae `.results`, catch con `getApiErrorMessage`
- [ ] `slice` sin thunks; nombre = store key
- [ ] `controller` llama al service y despacha acciones sync
- [ ] Registrado en barrel de dominio + store + rutas
- [ ] `typecheck` y `lint` sin errores
