# Checklist de Refactorización — Patrón Plano (Flat Pattern)

Basado en la refactorización del módulo `academic-sublevel` para alinearlo con los módulos de referencia `academic-level` y `school-year`.

---

## 1. Estructura del módulo

```
module-name/
  index.ts
  module-name.constants.ts       # Endpoints + permisos
  module-name.types.ts           # Entity + CRUD params + ServiceT + FormValues
  module-name.service.ts         # Class-based service (apiClient)
  module-name.slice.ts           # createSlice + selectors (NO thunks)
  module-name.utils.ts           # Yup schema + helpers
  ModuleNamePage.tsx             # Página principal
  components/
    ModuleNameFormModal.tsx
    ModuleNameTable.tsx
    ModuleNameViewModal.tsx
    ModuleNameDeleteModal.tsx
  hooks/
    useModuleNameController.ts   # Controlador (despacha acciones sync)
    useModuleNameForm.ts         # Hook del formulario (unwrapMutation)
    (useXxxOptions.ts)           # Opciones para FK (solo si es necesario)
```

**Archivos que NO deben existir:**

- ❌ `module-name.controller.ts` (debe ir en `hooks/`)
- ❌ `module-name.options.ts` (debe ir en `hooks/`)
- ❌ `module-name.thunks.ts` (prohibido — solo sync actions)
- ❌ `module-name.mapper.ts` (prohibido — extraer .results directamente)
- ❌ Directorios `application/`, `domain/`, `infrastructure/`, `presentation/`

---

## 2. Tipos (`module-name.types.ts`)

### Entity interface

```ts
export interface EntityT {
  id: number;
  // campos del serializer exactamente como devuelve el backend
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
```

### FormValues

```ts
export interface EntityFormValues {
  // Solo los campos editables en el formulario
  // NO incluir: id, is_active, created_at, updated_at, campos computed
  code: string;
  name: string;
  description: string;
  // foreign_key como número (ID)
}
```

### Params types

```ts
// Create: omite campos readonly del backend
export type EntityCreateParamsT = EntityFormValues;

// Update
export type EntityUpdateDataT = Partial<EntityFormValues>;
export interface EntityUpdateParamsT {
  id: number;
  data: EntityUpdateDataT;
}

// Get y Delete usan { id: number } (NO number suelto)
export interface EntityGetParamsT {
  id: number;
}
export interface EntityDeleteParamsT {
  id: number;
}
```

### Service interface

```ts
export interface EntityServiceT {
  list(params?: EntityListParamsT): Promise<EntityT[]>;
  get(params: EntityGetParamsT): Promise<EntityT>;
  create(params: EntityCreateParamsT): Promise<EntityT>;
  update(params: EntityUpdateParamsT): Promise<EntityT>;
  softDelete(params: EntityDeleteParamsT): Promise<{ id: number }>;
}
```

### Ordenamiento

```ts
export type EntityOrderingT = "name" | "-name" | "code" | "-code";
// Solo incluir campos en backend ordering_fields
```

### List params

```ts
export interface EntityListParamsT {
  page?: number;
  pageSize?: number;
  search?: string;
  ordering?: EntityOrderingT;
}
```

---

## 3. Constantes (`module-name.constants.ts`)

### Endpoints

```ts
export const MODULE_BASE_URL = "/api/institutions/module-name/";

export const MODULE_ENDPOINTS = {
  GET: (id: number) => `${MODULE_BASE_URL}${id}/`,
  LIST: MODULE_BASE_URL,
  CREATE: MODULE_BASE_URL,
  UPDATE: (id: number) => `${MODULE_BASE_URL}${id}/`,
  SOFT_DELETE: (id: number) => `${MODULE_BASE_URL}${id}/soft-delete/`,
} as const;
```

- Usar `BASE_URL` reutilizable
- Nombres clave: `GET`, `LIST`, `CREATE`, `UPDATE`, `SOFT_DELETE`
- ❌ NO usar `DETAIL` (usar `GET` y `UPDATE`)

### Permisos

```ts
export const MODULE_PERMISSIONS = {
  GET: "app.view_module",
  CREATE: "app.create_module",
  UPDATE: "app.update_module",
  DELETE: "app.delete_module",
} as const;
```

---

## 4. Service (`module-name.service.ts`)

### Clase

```ts
class ModuleService implements ModuleServiceT { ... }
export const moduleService = new ModuleService();
```

### Métodos

- **Todos los parámetros descriptivos** (`params`, `data`, `id`)
- ❌ NO usar: `p`, `d`, `pg`, `ps`, `sq`, `oq` (usar: `page`, `pageSize`, `searchQuery`, `orderingQuery`)

### list()

```ts
async list(params?: ListParamsT): Promise<EntityT[]> {
  const page = params?.page ?? 1;
  const pageSize = params?.pageSize ?? 100;
  const searchQuery = params?.search ? `&search=${encodeURIComponent(params.search)}` : "";
  const orderingQuery = params?.ordering ? `&ordering=${encodeURIComponent(params.ordering)}` : "";
  const { data } = await apiClient.get<ResponseApi<PaginatedData<EntityT>>>(
    `${ENDPOINTS.LIST}?page=${page}&page_size=${pageSize}${searchQuery}${orderingQuery}`,
  );
  return data.data.results; // <-- directo, SIN mapper
}
```

### create()/update()

```ts
ENDPOINTS.CREATE; // POST
ENDPOINTS.UPDATE(id); // PATCH (NO DETAIL)
```

### softDelete()

```ts
async softDelete(params: DeleteParamsT): Promise<{ id: number }> {
  const { data } = await apiClient.post<ResponseApi<{ id: number }>>(
    ENDPOINTS.SOFT_DELETE(params.id),
  );
  return data.data;
}
```

### Errores

- Todos los catch usan `getApiErrorMessage(error)` de `@shared/services/api.client`

---

## 5. Slice (`module-name.slice.ts`)

### NO thunks

- ❌ `extraReducers` vacío
- ❌ No importar thunks

### Reducers sync (todos)

```ts
reducers: {
  loadPending(state) { state.status = "loading"; state.error = null; },
  loadSuccess(state, action: PayloadAction<EntityT[]>) { state.items = action.payload; state.status = "succeeded"; },
  loadError(state, action: PayloadAction<string>) { state.status = "failed"; state.error = action.payload; },
  entityCreated(state, action: PayloadAction<EntityT>) { state.items.unshift(action.payload); state.status = "succeeded"; },
  entityUpdated(state, action: PayloadAction<EntityT>) { /* findIndex + replace */ state.status = "succeeded"; },
  entityDeleted(state, action: PayloadAction<number>) { /* filter */ state.status = "succeeded"; },
  mutationError(state, action: PayloadAction<string>) { state.status = "failed"; state.error = action.payload; },
  clearEntityError(state) { state.error = null; },  // nombre específico, NO "clearError"
}
```

### Nombres de variables

- ❌ NO usar `s`/`a` en reductores (usar `state`/`action`)
- ❌ NO `clearError` genérico (usar `clearEntityNameError`)

### Selectors

```ts
export const selectItems = (state: RootState): EntityT[] =>
  state.domain.sliceKey.items;
```

El `sliceKey` debe coincidir con el `name` del slice y con la key en `combineReducers` del store.

---

## 6. Controller Hook (`hooks/useModuleController.ts`)

### Patrón

```ts
import { toRejectValue } from "@shared/utils/validationErrors";
import { useAppDispatch, useAppSelector } from "@shared/redux/hooks";

export const useModuleController = () => {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectItems);
  // ...

  const load = useCallback(
    async (params?) => {
      dispatch(loadPending());
      try {
        dispatch(loadSuccess(await service.list(params)));
      } catch (err) {
        dispatch(loadError(err.message));
      }
    },
    [dispatch],
  );

  const create = useCallback(
    async (params) => {
      try {
        const created = await service.create(params);
        dispatch(entityCreated(created));
        return created;
      } catch (err) {
        const rv = toRejectValue(err);
        dispatch(mutationError(rv.msg));
        throw rv;
      }
    },
    [dispatch],
  );
  // update, disable: mismo patrón

  return {
    items, // nombre del módulo (ej: academicLevels)
    isLoading: status === "loading",
    error,
    loadItems, // loadEntityName
    createItem, // createEntityName
    updateItem, // updateEntityName
    deleteItem, // deleteEntityName
  };
};
```

- ✅ Usar `toRejectValue` de `@shared/utils/validationErrors`
- ✅ En create/update catch: `dispatch(mutationError(rv.msg))` (NO `loadError`)
- ✅ En delete catch: `dispatch(mutationError(...))` (NO `loadError`)
- ❌ NO incluir lógica de formulario aquí (eso va en el form hook)

---

## 7. Form Hook (`hooks/useModuleForm.ts`)

### Patrón

```ts
import { unwrapMutation } from "@shared/utils/validationErrors";
import type { SubmitErrorState } from "@shared/utils/validationErrors";

export const useModuleForm = ({ create, update }) => {
  const handleSubmit = useCallback(
    async (values) => {
      if (editing) {
        const { field1, field2 } = values;
        const response = await unwrapMutation(
          { id: editing.id, data: { field1, field2 } },
          update,
        );
        // ...
      } else {
        const { field1, field2 } = values;
        const response = await unwrapMutation({ field1, field2 }, create);
        // ...
      }
    },
    [editing, create, update, closeModal],
  );
};
```

- ✅ Usar `unwrapMutation` (NO `unwrapCreate`/`unwrapUpdate` inline)
- ✅ En create: solo enviar campos editables (excluir `is_active`)
- ✅ En update: incluir todos los campos editables

---

## 8. Componentes

### ✅ React.FC

Todos los componentes exportados DEBEN usar `React.FC<Props>`:

```tsx
interface MyModalProps { ... }
export const MyModal: React.FC<MyModalProps> = ({ ... }) => { ... };
```

### ✅ Iconos lucide-react

- ❌ NO usar SVG inline para elementos decorativos
- ✅ Usar iconos de `lucide-react`:
  - `X` para botón de cerrar (NO `<svg>...M6 18L18 6...</svg>`)
  - `AlertTriangle` para errores/alertas
  - `Eye`, `Pencil`, `Trash2` para acciones de tabla
  - `BookOpen`, `FileText`, `Calendar`, `Layers`, etc. para DetailRow

### ✅ Componentes compartidos

| En lugar de                       | Usar                                                                                 |
| --------------------------------- | ------------------------------------------------------------------------------------ |
| `DetailRow` inline en ViewModal   | `import { DetailRow } from "@shared/components/DetailRow"`                           |
| Error display inline en FormModal | `import { ErrrosInForm } from "@shared/components/ErrrosInForm"`                     |
| `<select>` nativo en Table        | `import { CustomSelect } from "@shared/components/Form"` con `filterSelectClassname` |

### ✅ FormModal

- Importar `SubmitErrorState` desde `@shared/utils/validationErrors` (NO desde `../module-name.controller`)
- Usar `ErrrosInForm` para mostrar errores
- NO incluir `is_active` checkbox (eliminado del formulario; backend controla activación vía soft delete)

### ✅ Table

- Constantes de ordenamiento: `OrderingOptions` (PascalCase) — no `O` ni `ORDERING_OPTIONS`
- Variables descriptivas: `hasNextPage` (no `hnp`), `debounceRef` o `dr`
- Usar `CustomSelect` para el filtro de ordenamiento (con `filterSelectClassname`)
- Nombres de handlers: `handleSearch`, `handleOrdering`
- `fetchData` recibe `params?: ListParamsT` y llama directamente a `loadItems(params)`
- Si el módulo tiene foreign keys, agregar filtros por FK (ver sección 8.1)

### ✅ ViewModal

- Usar `DetailRow` compartido
- Llamar `service.get({ id })` con objeto, NO con número suelto
- `useReducer` dispatch: `dispatch` (no `sd`)
- Error display: `<X className="size-4 shrink-0" />` (no SVG inline)

### ✅ DeleteModal

- Props interface con `onConfirm: (params: DeleteParamsT) => Promise<void>`
- `isDeleting` (no `d`), `handleConfirm` (no `h`)
- `onConfirm({ id: entity.id })` con objeto

---

## 8.1 Filtros en tablas (cuando hay opciones disponibles)

Cuando el módulo tiene **foreign keys** (u otros campos filtrables en el backend), la tabla debe incluir un `CustomSelect` por cada filtro relevante, además de la búsqueda y el ordenamiento. Los filtros se envían al backend como query params (`?fk=<id>`), NO se filtra en cliente.

> Referencia: módulos `academic-grade` (filtro por `academic_sublevel`) y `section` (filtros por `school_year` y `academic_grade`).

### Requisitos backend

- [ ] El viewset usa `DjangoFilterBackend` con los campos en `filterset_fields`
- [ ] Los nombres de los query params coinciden con los campos del serializer (ej: `school_year`, `academic_grade`)

### 1. Tipos (`module-name.types.ts`)

Agregar `filters` al `ListParamsT` (objeto con los campos FK opcionales):

```ts
export interface EntityListParamsT {
  page?: number;
  pageSize?: number;
  search?: string;
  filters?: {
    foreign_key_a?: number;
    foreign_key_b?: number;
  };
  ordering?: EntityOrderingT;
}
```

### 2. Service (`module-name.service.ts`)

Construir el `filtersQuery` ignorando valores vacíos:

```ts
const filtersQuery = params?.filters
  ? `&${Object.entries(params.filters)
      .filter(([, value]) => value !== undefined && value !== null)
      .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
      .join("&")}`
  : "";

const { data } = await apiClient.get<ResponseApi<PaginatedData<EntityT>>>(
  `${ENDPOINTS.LIST}?page=${page}&page_size=${pageSize}${searchQuery}${orderingQuery}${filtersQuery}`,
);
```

### 3. Options hook (`hooks/useXxxOptions.ts`)

Un hook por cada FK, basado en `useReducer` (patrón de `useAcademicSubLevelOptions`):

- Llama `fkService.list({ page: 1, pageSize: 100 })`
- Mapea a `{ label, value: String(id) }`
- Usa flag `cancelled` en el cleanup del `useEffect`
- Si el `label` puede ser opcional (`string | undefined`), usar fallback (ej: `year.name ?? \`Año ${year.id}\``)
- Retorna `{ xxxOptions, loadingXxx }`

### 4. Table (`components/ModuleNameTable.tsx`)

- Recibe las opciones por props: `xxxOptions: { label: string; value: string }[]`
- Un `state` por filtro: `const [foreignKeyA, setForeignKeyA] = useState<number | undefined>(undefined)`
- Handlers descriptivos: `handleForeignKeyAChange`, `handleForeignKeyBChange`
- Cada handler hace `setPage(1)` y llama `fetchData` preservando **search, ordering y los demás filtros activos** (no perder estado entre filtros)
- Renderizar cada filtro con `CustomSelect` + `filterSelectClassname`:

```tsx
<CustomSelect
  name="foreign_key_a"
  label=""
  placeholder="Subnivel"
  value={foreignKeyA ? String(foreignKeyA) : ""}
  options={foreignKeyAOptions}
  onChange={(option) =>
    handleForeignKeyAChange(option.value ? Number(option.value) : undefined)
  }
  className={filterSelectClassname}
/>
```

- `fetchData` (search, ordering, page, pageSize) también debe incluir los filtros activos en cada llamada (un helper `buildFilters()` ayuda a centralizar la lógica)

### 5. Page (`ModuleNamePage.tsx`)

- Cargar las opciones con los hooks: `const { xxxOptions } = useXxxOptions();`
- Pasar las opciones tanto al `Table` (para filtrar) como al `FormModal` (para el select del formulario)

### 6. Barrel (`hooks` + `index.ts`)

- Exportar cada options hook desde el `index.ts` del módulo:

```ts
export * from "./hooks/useXxxOptions";
```

---

## 8.2 Protección de acciones por permisos (ocultar/mostrar botones)

Los botones de acción (**Crear**, **Editar**, **Eliminar**) deben ocultarse/mostrarse condicionalmente según los permisos del usuario autenticado. Se usa `hasPermission` de `@shared/utils/permissions` junto con el selector `selectUserPermissions` del estado de auth y las constantes `MODULE_PERMISSIONS`.

> Referencia: módulo `school-year` (botón "Nuevo" en la página + acciones Editar/Desactivar en la tabla).

### Utilidad y selector

```ts
// @shared/utils/permissions
export const hasPermission = (
  userPermissions: string[],
  required: string | null,
): boolean => { ... };

// @features/auth/auth.slice
export const selectUserPermissions = createSelector(
  selectAuthUser,
  (user) => user?.permissions ?? [],
);
```

### 1. Page (`ModuleNamePage.tsx`)

Calcular los flags de permisos y usarlos para el botón de creación y para pasarlos a la tabla:

```tsx
import { selectUserPermissions } from "@features/auth/auth.slice";
import { useAppSelector } from "@shared/redux/hooks";
import { hasPermission } from "@shared/utils/permissions";
import { MODULE_PERMISSIONS } from "./module-name.constants";

const permissions = useAppSelector(selectUserPermissions);
const canCreate = hasPermission(permissions, MODULE_PERMISSIONS.CREATE);
const canEdit = hasPermission(permissions, MODULE_PERMISSIONS.UPDATE);
const canDelete = hasPermission(permissions, MODULE_PERMISSIONS.DELETE);
```

- ✅ El botón "Nuevo" se renderiza solo si `canCreate`:

```tsx
{canCreate && (
  <button type="button" onClick={() => openModal()} ...>
    <Plus className="size-4" /> Nuevo
  </button>
)}
```

- ✅ Pasar `canEdit` y `canDelete` como props al `Table`.

### 2. Table (`components/ModuleNameTable.tsx`)

- Agregar props opcionales con default `true` (para no romper otros usos):

```tsx
interface ModuleNameTableProps {
  // ...
  canEdit?: boolean;
  canDelete?: boolean;
}

export const ModuleNameTable = ({
  // ...
  canEdit = true,
  canDelete = true,
}: ModuleNameTableProps) => { ... };
```

- ✅ Renderizar condicionalmente cada botón de acción:

```tsx
{canEdit && (
  <button type="button" onClick={() => onEdit(s)} title="Editar">
    <Pencil className="size-4" />
  </button>
)}
{canDelete && (
  <button type="button" onClick={() => onDelete(s)} title="Desactivar">
    <Trash2 className="size-4" />
  </button>
)}
```

- ✅ El botón **Ver** (`Eye`) permanece siempre visible: el usuario ya accede a la página gracias al permiso `GET`.

### Notas

- Esto es una protección de **UI** (UX), no de seguridad. El backend SIEMPRE debe validar permisos por acción.
- Usar las constantes `MODULE_PERMISSIONS` (NO strings hardcodeados).
- Mapeo: `CREATE → canCreate`, `UPDATE → canEdit`, `DELETE → canDelete`.

---

## 9. Página (`ModuleNamePage.tsx`)

### Imports

```tsx
import { useModuleController } from "./hooks/useModuleController";
import { useModuleForm } from "./hooks/useModuleForm";
// Si tiene FK:
import { useXxxOptions } from "./hooks/useXxxOptions";
```

### Handlers

- ❌ NO: `openV`, `closeV`, `openD`, `closeD`, `handleDel`
- ✅ Sí: `openViewModal`, `closeViewModal`, `openDeleteModal`, `closeDeleteModal`, `handleDeleteConfirm`

### Delete

```tsx
const handleDeleteConfirm = useCallback(
  async (params: AcademicSubLevelDeleteParamsT) => {
    try {
      await deleteEntity(params);
    } catch (error) {
      console.error(error);
    }
  },
  [deleteEntity],
);
```

### Modal onConfirm

```tsx
onConfirm = { handleDeleteConfirm }; // passes params: { id: number }
// NO wrapper inline: onConfirm={() => handleDeleteConfirm({ id: deleting?.id ?? 0 })}
```

---

## 10. Barrel (`index.ts`)

```ts
export * from "./module-name.types";
export * from "./module-name.constants";
export * from "./module-name.service";
export * from "./hooks/useModuleController";
export * from "./hooks/useModuleForm";
export * from "./hooks/useXxxOptions"; // si existe
export * from "./module-name.slice";
export * from "./module-name.utils";
export { default as moduleReducer } from "./module-name.slice";
export { default as ModuleNamePage } from "./ModuleNamePage";
```

---

## 11. Store (`shared/redux/store.ts`)

```ts
import { moduleReducer } from "@features/domain";

const domainReducer = combineReducers({
  sliceKey: moduleReducer, // sliceKey DEBE coincidir con slice name
});
```

---

## 12. Domain Barrel (`features/domain/index.ts`)

```ts
// Re-exportar tipos
export type { EntityT, ... } from "./module-name/module-name.types";

// Re-exportar valores
export { MODULE_ENDPOINTS, MODULE_PERMISSIONS } from "./module-name/module-name.constants";

// Re-exportar con nombre
export { moduleService, moduleReducer, ModuleNamePage, useModuleController, useModuleForm } from "./module-name";
```

- ❌ NO exportar nombres antiguos (ej: `CreateDataT` si se renombró a `CreateParamsT`)

---

## 13. Audit Final

- [ ] `typecheck` pasa sin errores del módulo
- [ ] `lint` pasa sin errores nuevos
- [ ] Estructura flat (sin `application/`, `domain/`, etc.)
- [ ] Sin archivo `.controller.ts` ni `.options.ts` sueltos
- [ ] Sin thunks
- [ ] Sin mappers
- [ ] Sin `React.FC` faltante en componentes
- [ ] Sin SVG inline en lugar de lucide-react
- [ ] Sin `s`/`a` en reductores
- [ ] Sin nombres crípticos (`pg`, `sq`, `d`, `h`, `O`, `hnp`)
- [ ] Sin `clearError` genérico
- [ ] Sin `getIV` (usar `getInitialValues`)
- [ ] Sin `SubmitErrorState` importado desde controller (debe ser `@shared/utils/validationErrors`)
- [ ] `ServiceT` params con `{ id }` (no `number` suelto)
- [ ] `ServiceT.softDelete` retorna `Promise<{ id: number }>`
- [ ] Controller usa `toRejectValue` y `mutationError`
- [ ] Form hook usa `unwrapMutation`
- [ ] `is_active` eliminado de `FormValues`
- [ ] Endpoints con claves `GET`, `LIST`, `CREATE`, `UPDATE`, `SOFT_DELETE`
- [ ] `BASE_URL` reutilizable en constants
- [ ] Domain barrel actualizado (sin nombres antiguos)
- [ ] Store key coincide con slice name

### Filtros en tablas (si el módulo tiene FK — ver sección 8.1)

- [ ] `ListParamsT` incluye `filters?: { ... }` con los campos FK
- [ ] Service construye `filtersQuery` ignorando valores vacíos
- [ ] Un options hook por cada FK en `hooks/` (patrón `useReducer` + `cancelled`)
- [ ] Tabla renderiza un `CustomSelect` (con `filterSelectClassname`) por filtro
- [ ] Handlers de filtro preservan search, ordering y los demás filtros activos
- [ ] Options hooks exportados desde el `index.ts` del módulo
- [ ] Backend con `DjangoFilterBackend` + `filterset_fields` correspondientes

### Protección de acciones por permisos (ver sección 8.2)

- [ ] Page calcula `canCreate`/`canEdit`/`canDelete` con `hasPermission` + `selectUserPermissions`
- [ ] Permisos tomados de `MODULE_PERMISSIONS` (NO strings hardcodeados)
- [ ] Botón "Nuevo" oculto si no hay permiso `CREATE`
- [ ] Tabla recibe props `canEdit`/`canDelete` (default `true`)
- [ ] Botones Editar/Eliminar de la tabla renderizados condicionalmente
- [ ] Botón Ver siempre visible (cubierto por permiso `GET`)
