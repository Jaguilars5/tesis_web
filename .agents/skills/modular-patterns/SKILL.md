# Patrón Modular Estandarizado

Documentación de los patrones aplicados en los módulos `institutions` (`school-year`, `academic-level`, `academic-sublevel`, `academic-grade`, `section`). Sigue estos pasos para aplicar el mismo patrón en nuevos módulos.

---

## 1. Domain — Tipos Compartidos

### Repository interface (`domain/repositories/<entidad>.repository.ts`)

```typescript
import type { EntityT } from "../entities/entity.types";

// 1a. Ordenamiento: union type con los campos ordenables
export type EntityOrderingT = "name" | "-name" | "field2" | "-field2";

// 1b. Parámetros de listado: SIEMPRE incluir search y ordering
export interface EntityListParamsT {
  page?: number;
  pageSize?: number;
  search?: string;
  ordering?: EntityOrderingT;
}

// 1c. Tipos para cada operación CRUD
export type EntityCreateDataT = Omit<
  EntityT,
  "id" | "is_active" | "readOnlyField1" | "readOnlyField2"
>;
export type EntityCreateParamsT = EntityCreateDataT; // alias para consistencia
export type EntityUpdateDataT = Partial<EntityT>;
export interface EntityUpdateParamsT {
  id: number;
  data: EntityUpdateDataT;
}
export type EntityGetParamsT = number; // alias semántico
export type EntityDeleteParamsT = number; // alias semántico

export interface EntityRepositoryT {
  list(params?: EntityListParamsT): Promise<EntityT[]>;
  get(id: EntityGetParamsT): Promise<EntityT>;
  create(data: EntityCreateDataT): Promise<EntityT>;
  update(params: EntityUpdateParamsT): Promise<EntityT>; // ← objeto único, NO (id, data)
  softDelete(id: EntityDeleteParamsT): Promise<EntityT>;
}
```

> **Regla**: `create` y `update` reciben el payload directo (`Partial<>` / `Omit<>`). Para `update` se usa un objeto `{ id, data }` que evita confusiones de orden de parámetros.

---

## 2. Infrastructure — API Repository

### (`infrastructure/repositories/<entidad>-api.repository.ts`)

```typescript
import type {
  EntityCreateDataT,     // ← del domain
  EntityDeleteParamsT,
  EntityGetParamsT,
  EntityListParamsT,
  EntityRepositoryT,
  EntityUpdateParamsT,
} from "../../domain/repositories/entity.repository";

export const entityApiRepository: EntityRepositoryT = {

  // list() SIEMPRE incluye search + ordering
  async list(params?: EntityListParamsT) {
    try {
      const page = params?.page ?? 1;
      const pageSize = params?.pageSize ?? 100;
      const searchQuery = params?.search
        ? `&search=${encodeURIComponent(params.search)}`
        : "";
      const orderingQuery = params?.ordering
        ? `&ordering=${encodeURIComponent(params.ordering)}`
        : "";
      const { data } = await apiClient.get<ResponseApi<PaginatedData<EntityT>>>(
        `${ENDPOINTS.LIST}?page=${page}&page_size=${pageSize}${searchQuery}${orderingQuery}`,
      );
      return mapPaginatedResponse(data.data);
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  },

  // get/update/softDelete usan los tipos del repositorio
  async get(id: EntityGetParamsT) { ... },
  async update(params: EntityUpdateParamsT) {        // ← recibe objeto único
    const { data } = await apiClient.patch(`${ENDPOINTS.LIST}${params.id}/`, params.data);
    return data.data;
  },
  async create(payload: EntityCreateDataT) { ... },
  async softDelete(id: EntityDeleteParamsT) { ... },
};
```

---

## 3. Application — Use Cases

### Dos patrones según el tipo de módulo:

#### Patrón A: Use case + Thunk separados (School-year, Section)

Archivo `application/use-cases/<operacion>.usecase.ts`:

```typescript
import type { EntityT } from "../../domain/entities/entity.types";
import type { EntityCreateDataT } from "../../domain/repositories/entity.repository";
import { entityApiRepository } from "../../infrastructure/repositories/entity-api.repository";

// Función pura: solo llama al repositorio, SIN lógica Redux
export const createEntityUseCase = async (
  data: EntityCreateDataT,
): Promise<EntityT> => {
  return entityApiRepository.create(data);
};
```

Los thunks viven en el **reducer** (`reducers/entity.reducer.ts`), NO en el use case.

#### Patrón B: Thunks directos en application/ (Academic-level)

```typescript
// application/use-cases/list.usecase.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
export const fetchEntities = createAsyncThunk<EntityT[], EntityListParamsT | undefined, ...>(...);
```

> **Regla**: Usar Patrón A cuando el módulo tiene use cases reutilizables fuera de Redux. Usar Patrón B cuando es un módulo simple.

---

## 4. Redux — Thunks tipados

### (`reducers/<entidad>.reducer.ts`)

```typescript
import type {
  EntityCreateDataT,
  EntityDeleteParamsT,
  EntityListParamsT,
  EntityUpdateParamsT,
} from "../domain/repositories/entity.repository";

export const fetchEntities = createAsyncThunk<
  EntityT[],
  EntityListParamsT | undefined,                     // ← usa el tipo compartido
  { rejectValue: string }
>(THUNKS.FETCH, async (params, { rejectWithValue }) => {
  try {
    return await listEntitiesUseCase(params);
  } catch (error) {
    return rejectWithValue(normalizeThunkError(error));
  }
});

export const updateEntity = createAsyncThunk<
  EntityT,
  EntityUpdateParamsT,                                // ← objeto { id, data }
  { rejectValue: string }
>(THUNKS.UPDATE, async (params, { rejectWithValue }) => {
  try {
    return await updateEntityUseCase(params);          // ← pasa params directo
  } catch (error) { ... }
});

export const deleteEntity = createAsyncThunk<
  EntityT,
  EntityDeleteParamsT,                                 // ← type alias, no number literal
  { rejectValue: string }
>(THUNKS.DELETE, async (id, { rejectWithValue }) => { ... });
```

---

## 5. Presentation — Controller Hook

### (`presentation/hooks/use<Entidad>Controller.ts`)

```typescript
import type {
  EntityCreateParamsT,
  EntityDeleteParamsT,
  EntityListParamsT,
  EntityUpdateParamsT,
} from "../../domain/repositories/entity.repository";

export const useEntityController = () => {
  const dispatch = useAppDispatch();

  const loadEntities = useCallback(
    (
      params?: EntityListParamsT, // ← tipo compartido
    ) => dispatch(fetchEntities(params ?? { page: 1, pageSize: 100 })),
    [dispatch],
  );

  const update = useCallback(
    (
      params: EntityUpdateParamsT, // ← { id, data }
    ) => dispatch(updateEntity(params)),
    [dispatch],
  );

  const remove = useCallback(
    (id: EntityDeleteParamsT) => dispatch(deleteEntity(id)),
    [dispatch],
  );
  // ...
};
```

---

## 6. Presentation — Form Hook

### (`presentation/hooks/use<Entidad>Form.ts`)

```typescript
import type { EntityCreateDataT } from "../../domain/repositories/entity.repository";

export interface EntityFormValues {
  /* ... */
}

export const useEntityForm = () => {
  const { createEntity: create, updateEntity: update } = useEntityController();

  const handleSubmit = useCallback(
    async (values: EntityFormValues) => {
      if (editingEntity) {
        result = await update({ id: editingEntity.id, data: values }); // ← { id, data }
      } else {
        result = await create(values as EntityCreateDataT); // ← casteo
      }
      // ...
    },
    [editingEntity, create, update, closeModal],
  );
};
```

---

## 7. Presentación — Hooks locales para FK Options

Cuando un formulario necesita mostrar opciones de un módulo **vecino** (FK), se crea un hook local que usa el API repository **directamente**, SIN contaminar Redux.

### (`presentation/hooks/use<EntidadVecina>Options.ts`)

```typescript
import { useEffect, useReducer } from "react";
import { entityApiRepository } from "../../../entidad/infrastructure/repositories/entity-api.repository";

interface Option {
  label: string;
  value: string;
}
interface State {
  options: Option[];
  loading: boolean;
}
type Action =
  | { type: "loading" }
  | { type: "success"; options: Option[] }
  | { type: "error" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "loading":
      return { ...state, loading: true };
    case "success":
      return { options: action.options, loading: false };
    case "error":
      return { ...state, loading: false };
  }
}

export const useEntityOptions = () => {
  const [state, dispatch] = useReducer(reducer, { options: [], loading: true });

  useEffect(() => {
    let cancelled = false;
    dispatch({ type: "loading" });
    entityApiRepository
      .list({ page: 1, pageSize: 100 })
      .then((items) => {
        if (!cancelled)
          dispatch({
            type: "success",
            options: items.map((i) => ({ label: i.name, value: String(i.id) })),
          });
      })
      .catch(() => {
        if (!cancelled) dispatch({ type: "error" });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { entityOptions: state.options, loading: state.loading };
};
```

> **¿Por qué `useReducer`?** Porque `dispatch` no dispara el warning `react-hooks/set-state-in-effect` del linter.

> **¿Por qué no usar el controller de Redux?** Para evitar contaminar el store de una entidad que no nos pertenece. Cada módulo solo maneja **su propio slice** de Redux.

---

## 8. Componentes — Tabla con búsqueda y paginación

### (`components/form/<Entidad>Table.tsx`)

```typescript
import { useCallback, useEffect, useRef, useState } from "react";
import { Pencil } from "lucide-react";
import { SearchInput } from "@shared/components/Form";
import { Pagination } from "@shared/components/Pagination";
import { CustomTable } from "@shared/components/Table";
import type { EntityOrderingT } from "../../domain/repositories/entity.repository";

const ORDERING_OPTIONS: { label: string; value: EntityOrderingT }[] = [
  { label: "Nombre (A-Z)", value: "name" },
  { label: "Nombre (Z-A)", value: "-name" },
];

export const EntityTable = ({ onEdit }: { onEdit: (item: EntityT) => void }) => {
  const { entities, isLoading, loadEntities } = useEntityController();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [ordering, setOrdering] = useState<EntityOrderingT>("name");
  const [hasSearched, setHasSearched] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const fetchData = useCallback((overrides?) => {
    loadEntities({
      page: overrides?.page ?? page,
      pageSize: overrides?.pageSize ?? pageSize,
      search: overrides?.search !== undefined ? overrides.search : (search || undefined),
      ordering: overrides?.ordering ?? ordering,
    });
  }, [loadEntities, page, pageSize, search, ordering]);

  useEffect(() => { fetchData(); }, []); // eslint-disable-line

  const handleSearchChange = useCallback((e) => {
    const value = e.target.value;
    setSearch(value);
    setPage(1);
    setHasSearched(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchData({ page: 1, search: value || undefined }), 400);
  }, [fetchData]);

  const hasNextPage = entities.length >= pageSize;

  return (
    <div className="overflow-visible rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 bg-slate-50/50 px-4 py-3">
        <SearchInput name="search" onChange={handleSearchChange} value={search} className="relative min-w-50 flex-1" placeholder="Filtrar..." />
        <select value={ordering} onChange={handleOrderingChange} className="block w-auto rounded-md border ..." aria-label="Ordenar por">
          {ORDERING_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
      </div>

      <CustomTable<EntityT> data={entities} columns={columns} isLoading={isLoading && entities.length === 0}
        emptyMessage={hasSearched ? "No se encontraron resultados con los filtros aplicados" : "No se encontraron registros"}
        className={tableClassname} loadingMessage="Cargando..." rowActions={...}
      />

      <Pagination page={page} pageSize={pageSize} totalItems={entities.length} isLoading={isLoading}
        hasNextPage={hasNextPage}
        onPageChange={(newPage) => { setPage(newPage); fetchData({ page: newPage }); }}
        onPageSizeChange={(newSize) => { setPageSize(newSize); setPage(1); fetchData({ page: 1, pageSize: newSize }); }}
      />
    </div>
  );
};
```

> **overflow-visible**: El contenedor principal usa `overflow-visible` para que el dropdown del `CustomSelect` no se recorte visualmente.

---

## 9. Componentes — Form Modal con FK Select

### (`components/form/<Entidad>FormModal.tsx`)

```typescript
import { CustomInput, CustomSelect } from "@shared/components/Form";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  isEdit: boolean;
  editingEntity: EntityT | null;
  foreignKeyOptions: { label: string; value: string }[];  // ← opciones FK
  onSubmit: (values: EntityFormValues) => Promise<void>;
}

export const EntityFormModal = ({ foreignKeyOptions, ... }: Props) => {
  // ...
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-md animate-slide-up overflow-hidden rounded-xl bg-white shadow-xl">
        {/* Header con título + X */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">{isEdit ? "Editar" : "Nuevo"}</h3>
            <p className="mt-0.5 text-sm text-slate-500">Configure la entidad</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600">
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-4 p-5">
          <CustomInput label="Nombre" name="name" ... />
          <CustomSelect label="FK" name="fk_id" value={String(formik.values.fk_id)}
            onChange={(opt) => formik.setFieldValue("fk_id", Number(opt.value))}
            options={foreignKeyOptions} error={...} />
          {/* Checkbox Activo solo en edición */}
          {isEdit && ( <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" ... /> Activo</label> )}
          <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-4">
            <button type="button" onClick={onClose} className="...">Cancelar</button>
            <button type="submit" disabled={formik.isSubmitting} className="...">
              {formik.isSubmitting ? (<><span className="mr-2 size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> Guardando...</>) : isEdit ? "Actualizar" : "Crear"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
```

> **Checkbox Activo**: Solo visible en modo edición (`{isEdit && ...}`) para evitar mostrar campos de activo en creación.

---

## 10. Page — Orquestación

### (`pages/<Entidad>Page.tsx`)

```typescript
import { Plus } from "lucide-react";
import { EntityFormModal } from "../components/form/EntityFormModal";
import { EntityTable } from "../components/form/EntityTable";
import { useEntityForm } from "../presentation/hooks/useEntityForm";
import { useEntityOptions } from "../presentation/hooks/useEntityOptions";   // ← FK options locales

export default function EntityPage() {
  const { entityOptions } = useEntityOptions();                              // ← sin Redux
  const { isOpen, isEdit, editingEntity, openModal, closeModal, handleSubmit } = useEntityForm();

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Entidades</h1>
          <p className="mt-1 text-sm text-slate-500">Descripción</p>
        </div>
        <button type="button" onClick={() => openModal()}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-sm ...">
          <Plus className="size-4" /> Nueva Entidad
        </button>
      </div>

      <EntityTable onEdit={openModal} />
      <EntityFormModal isOpen={isOpen} onClose={closeModal} isEdit={isEdit}
        editingEntity={editingEntity}
        foreignKeyOptions={entityOptions}                                    // ← FK desde hook local
        onSubmit={handleSubmit} />
    </div>
  );
}
```

---

## Resumen de Reglas

| Capa               | Regla                                                                                     |
| ------------------ | ----------------------------------------------------------------------------------------- |
| **Repository**     | `list()` acepta `{ page, pageSize, search?, ordering? }`. `update` recibe `{ id, data }`. |
| **API Repository** | Siempre incluye `search` y `ordering` como query params en `list()`.                      |
| **Use cases**      | Son funciones PURAS que llaman al repositorio. No mezclar con thunks.                     |
| **Thunks**         | Usan los tipos del repositorio (`EntityListParamsT`, `EntityUpdateParamsT`, etc.).        |
| **Controller**     | Callbacks tipados con los tipos del repositorio.                                          |
| **Form hook**      | `update()` recibe `{ id, data }`. `create()` castea con `as EntityCreateDataT`.           |
| **FK Options**     | Hook LOCAL con `useReducer` + API repository directo. NO usar Redux.                      |
| **Tabla**          | Toolbar con `SearchInput` + select de ordenamiento + `Pagination`.                        |
| **Modal**          | Solo checkbox "Activo" en edición. Overlay `bg-black/40`. Animación `animate-slide-up`.   |
| **Page**           | No tener toolbar inline. La tabla tiene su propio toolbar.                                |

---

## Checklist para implementar en un nuevo módulo

- [ ] **Repository**: tipos `OrderingT`, `ListParamsT`, `CreateDataT`, `CreateParamsT`, `UpdateDataT`, `UpdateParamsT`, `GetParamsT`, `DeleteParamsT`
- [ ] **API Repository**: importa los tipos, método `list()` con search+ordering, `update(params)` un solo objeto
- [ ] **Use cases**: funciones puras con tipos compartidos
- [ ] **Reducer**: thunks tipados con `EntityListParamsT`, `EntityUpdateParamsT`, etc.
- [ ] **Controller hook**: callbacks tipados
- [ ] **Form hook**: usa `{ id, data }` en update, castea en create
- [ ] **Table**: SearchInput + ordering + Pagination, overflow-visible
- [ ] **Form modal**: FK Selects, checkbox activo solo en edición, animación
- [ ] **FK Options hooks**: `useReducer` + API repository directo (sin Redux)
- [ ] **Page**: hooks locales para FK, tabla con toolbar propio
