# AGENTS.md — EduManage Frontend (React + TypeScript + Vite)

## Stack
- React 19, TypeScript 6, Vite 8, Tailwind CSS 4 (`@tailwindcss/vite`)
- Redux Toolkit, React Router 7, Axios, Formik + Yup, lucide-react

## Commands
```bash
npm run dev                # start dev server (Vite, default :5173)
npm run build              # tsc -b && vite build
npm run lint               # eslint .
npm run typecheck          # tsc -p tsconfig.app.json --noEmit (always run BEFORE committing)
npm run preview            # preview production build
```

**Always run `typecheck` + `lint` after any code change.** No other test suite exists.

## Path aliases
Defined in `tsconfig.app.json`:
| Alias | Resolves to |
|-------|------------|
| `@features/*` | `src/features/*` |
| `@scheduling/*` | `src/features/scheduling/*` |
| `@shared/*` | `src/shared/*` |

## Project structure (big picture)
```
src/
  features/
    academic/
      academic-period/     ← REFERENCE MODULE (flat canonical structure)
      period-types/
      subject/
      subject-offering/
      subject-academic-config/
      teacher-subject-section/
      class-schedule/
    accounts/              # permissions, roles, users
    auth/
    dashboard/
    design-system/
    grading/               # attendance, conduct-incident, student-note
    institutions/          # school-year, academic-grade, section, etc.
    profile/
    scheduling/            # time-slots, schedule-config, etc.
    students/              # student, representative
  shared/
    redux/store.ts         # single configureStore with combineReducers per domain
    redux/hooks.ts         # useAppDispatch, useAppSelector (typed)
    services/api.client.ts # Axios with JWT interceptor + token refresh
    types/                 # RequestStatus, ResponseApi<T>, PaginatedData
    components/            # CustomInput, CustomSelect, CustomCheckbox (Form/),
                           #   CustomTable (Table/), DashboardLayout (Layout/)
    constants/styles.ts    # design system classname constants
```

> **⚠️ OBSOLETE**: The previous canonical structure (domain/application/infrastructure/presentation with use-cases, thunks, mappers) is deprecated. All new modules MUST follow the flat structure below.

---

## FEATURE MODULE CANONICAL STRUCTURE — FLAT PATTERN (academic-period reference)

### Directory tree
```
module-name/
  index.ts                         # barrel
  module-name.types.ts             # entity + CRUD params + service interface + form values
  module-name.constants.ts         # endpoints + permissions
  module-name.service.ts           # class-based service (apiClient)
  module-name.slice.ts             # createSlice + selectors + reducer (NO thunks)
  module-name.controller.ts        # useController + useForm hooks (dispatch sync actions)
  module-name.utils.ts             # Yup schema + helpers
  ModuleNamePage.tsx               # page component
  components/
    ModuleNameDeleteModal.tsx
    ModuleNameFormModal.tsx
    ModuleNameTable.tsx
    ModuleNameViewModal.tsx
```

### Barrel chain

**Module `index.ts`:**
```ts
export * from "./module-name.types";
export * from "./module-name.constants";
export * from "./module-name.service";
export * from "./module-name.controller";
export * from "./module-name.slice";
export * from "./module-name.utils";
export { default as moduleReducer } from "./module-name.slice";
export { default as ModuleNamePage } from "./ModuleNamePage";
```

### Academic domain barrel (`features/academic/index.ts`)
```ts
export * from "./module-name";
export { ModuleNamePage, moduleReducer } from "./module-name";
```

> ⚠️ Avoid `export *` when name conflicts exist across modules. Use explicit re-exports instead.

### Store integration (`shared/redux/store.ts`)
```ts
import { moduleReducer } from "@features/academic";

const academicReducer = combineReducers({
  sliceKey: moduleReducer,   // slice key = state.academic.sliceKey (MUST match slice name)
});
```

---

## FILE-BY-FILE CODE PATTERNS

### 1. Types (`module-name.types.ts`)
```ts
export interface PeriodTypeT {
  id: number;
  code: string;
  name: string;
  description: string;
  divisions_per_year: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type PeriodTypeOrderingT = "name" | "-name" | "code" | "-code";

export interface PeriodTypeListParamsT {
  page?: number;
  pageSize?: number;
  search?: string;
  ordering?: PeriodTypeOrderingT;
}

export type PeriodTypeCreateDataT = Omit<PeriodTypeT, "id" | "is_active" | "created_at" | "updated_at">;
export type PeriodTypeCreateParamsT = PeriodTypeCreateDataT;
export type PeriodTypeUpdateDataT = Partial<Omit<PeriodTypeT, "id">>;
export interface PeriodTypeUpdateParamsT { id: number; data: PeriodTypeUpdateDataT; }
export type PeriodTypeGetParamsT = number;
export type PeriodTypeDeleteParamsT = number;

export interface PeriodTypeServiceT {
  list(params?: PeriodTypeListParamsT): Promise<PeriodTypeT[]>;
  get(id: PeriodTypeGetParamsT): Promise<PeriodTypeT>;
  create(data: PeriodTypeCreateDataT): Promise<PeriodTypeT>;
  update(params: PeriodTypeUpdateParamsT): Promise<PeriodTypeT>;
  softDelete(id: PeriodTypeDeleteParamsT): Promise<{ id: number }>;
}

export interface PeriodTypeFormValues {
  code: string;
  name: string;
  description: string;
  divisions_per_year: number;
  is_active: boolean;
}
```
- Fields MUST match the backend serializer fields exactly (including read-only computed fields)
- Foreign keys as `number` (the ID), related names as `string`
- Optional/nullable fields use `T | null`
- `ServiceT` interface has all 5 methods: `list`, `get`, `create`, `update`, `softDelete`
- `softDelete` return type is `Promise<{ id: number }>` (NOT full entity)
- `FormValues` is used by Formik (maps form fields, may differ slightly from entity)
- `CreateDataT` omits: `id`, `is_active`, `created_at`, `updated_at`, plus any read-only computed fields

### 2. Constants (`module-name.constants.ts`)
```ts
export const MODULE_ENDPOINTS = {
  LIST: "/api/academic/module-name/",
  DETAIL: (id: number) => `/api/academic/module-name/${id}/`,
  SOFT_DELETE: (id: number) => `/api/academic/module-name/${id}/soft-delete/`,
} as const;

export const MODULE_PERMISSIONS = {
  GET: "academic.view_module",
  CREATE: "academic.create_module",
  UPDATE: "academic.update_module",
  DELETE: "academic.delete_module",
} as const;
```

### 3. Service (`module-name.service.ts`) — class-based
```ts
import { apiClient, getApiErrorMessage } from "@shared/services/api.client";
import type { PaginatedData, ResponseApi } from "@shared/types/api.response.types";
// ...

class ModuleService implements ServiceT {
  async list(params?: ListParamsT): Promise<EntityT[]> {
    try {
      const { data } = await apiClient.get<ResponseApi<PaginatedData<EntityT>>>(url);
      return data.data.results;       // direct .results, NO mapper
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }
  async get(id) { /* apiClient.get DETAIL */ }
  async create(payload) { /* apiClient.post LIST */ }
  async update(params) { /* apiClient.patch DETAIL */ }
  async softDelete(id) {              // ⚠️ MUST return {id}
    const { data } = await apiClient.post<ResponseApi<{ id: number }>>(SOFT_DELETE(id));
    return data.data;
  }
}
export const moduleService = new ModuleService();
```
- Class-based (not object literal) like `AcademicPeriodService`
- `list` extracts `.results` directly (no separate mapper file needed)
- All methods use `getApiErrorMessage(error)` in catch

### 4. Slice (`module-name.slice.ts`) — NO thunks, sync reducers only
```ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@shared/redux/store";
import type { RequestStatusT } from "@shared/types/request.types";
import type { EntityT } from "./module-name.types";

export interface ModuleStateT { items: EntityT[]; status: RequestStatusT; error: string | null; }

const initialState: ModuleStateT = { items: [], status: "idle", error: null };

const moduleSlice = createSlice({
  name: "moduleKey",     // MUST match store key (e.g. state.academic.moduleKey)
  initialState,
  reducers: {
    loadPending(state) { state.status = "loading"; state.error = null; },
    loadSuccess(state, action: PayloadAction<EntityT[]>) { state.items = action.payload; state.status = "succeeded"; },
    loadError(state, action: PayloadAction<string>) { state.status = "failed"; state.error = action.payload; },
    entityCreated(state, action: PayloadAction<EntityT>) { state.items.unshift(action.payload); state.status = "succeeded"; },
    entityUpdated(state, action: PayloadAction<EntityT>) {
      const idx = state.items.findIndex((p) => p.id === action.payload.id);
      if (idx !== -1) state.items[idx] = action.payload;
      state.status = "succeeded";
    },
    entityDeleted(state, action: PayloadAction<number>) {
      state.items = state.items.filter((p) => p.id !== action.payload);
      state.status = "succeeded";
    },
    mutationError(state, action: PayloadAction<string>) { state.status = "failed"; state.error = action.payload; },
    clearError(state) { state.error = null; },
  },
});

export const { loadPending, loadSuccess, loadError, entityCreated, entityUpdated, entityDeleted, mutationError, clearError } = moduleSlice.actions;

export const selectItems = (state: RootState): EntityT[] => state.academic.moduleKey.items;
export const selectStatus = (state: RootState): RequestStatusT => state.academic.moduleKey.status;
export const selectError = (state: RootState): string | null => state.academic.moduleKey.error;

export const moduleReducer = moduleSlice.reducer;
export default moduleSlice.reducer;
```
- NO `extraReducers`, NO thunks (thunks are deprecated)
- All state updates via sync reducer actions dispatched from the controller
- Reducer name matches store key (e.g., `"academicPeriods"` → `state.academic.academicPeriods`)

### 5. Controller (`module-name.controller.ts`)
```ts
import { useAppDispatch, useAppSelector } from "@shared/redux/hooks";
import { useCallback, useState } from "react";
import { moduleService } from "./module-name.service";
import { loadPending, loadSuccess, loadError, mutationError, entityCreated, entityUpdated, entityDeleted, selectError, selectItems, selectStatus } from "./module-name.slice";
import type { CreateDataT, CreateParamsT, DeleteParamsT, EntityT, FormValues, ListParamsT, UpdateParamsT } from "./module-name.types";

// ——— Controller ———
export const useModuleController = () => {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectItems);
  const status = useAppSelector(selectStatus);
  const error = useAppSelector(selectError);

  const loadItems = useCallback(async (params?: ListParamsT) => {
    dispatch(loadPending());
    try {
      const items = await moduleService.list(params ?? { page: 1, pageSize: 100 });
      dispatch(loadSuccess(items));
    } catch (err) { dispatch(loadError(err instanceof Error ? err.message : "Error")); }
  }, [dispatch]);

  const create = useCallback(async (data: CreateParamsT): Promise<EntityT> => {
    try {
      const created = await moduleService.create(data);
      dispatch(entityCreated(created));
      return created;
    } catch (err) { const rv = toRejectValue(err); dispatch(mutationError(rv.msg)); throw rv; }
  }, [dispatch]);

  const update = useCallback(async (params: UpdateParamsT): Promise<EntityT> => {
    try {
      const updated = await moduleService.update(params);
      dispatch(entityUpdated(updated));
      return updated;
    } catch (err) { const rv = toRejectValue(err); dispatch(mutationError(rv.msg)); throw rv; }
  }, [dispatch]);

  const remove = useCallback(async (id: DeleteParamsT): Promise<void> => {
    try {
      const { id: deletedId } = await moduleService.softDelete(id);
      dispatch(entityDeleted(deletedId));
    } catch (err) { dispatch(mutationError(err instanceof Error ? err.message : "Error")); }
  }, [dispatch]);

  return { items, isLoading: status === "loading", error, loadItems, create, update, remove };
};

export type ModuleControllerT = ReturnType<typeof useModuleController>;

// ——— Error handling helpers (replicate from academic-period.controller) ———
export type CreateRejectValue = { msg: string; data: Record<string, string> | null };
export type ValidationErrors = Record<string, string>;
export interface SubmitErrorState { general: string[]; validation: ValidationErrors; }

const toRejectValue = (error: unknown): CreateRejectValue => {
  const msg = error instanceof Error ? error.message : "Error desconocido";
  const cause = error instanceof Error ? (error as { cause?: unknown }).cause : undefined;
  const responseData = (cause as { response?: { data?: { data?: unknown } } })?.response?.data;
  return { msg, data: (responseData?.data as Record<string, string> | null) ?? null };
};

// ——— Form hook ———
interface UseFormArgs { create: ModuleControllerT["create"]; update: ModuleControllerT["update"]; }

export const useModuleForm = ({ create, update }: UseFormArgs) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<EntityT | null>(null);
  const [submitErrors, setSubmitErrors] = useState<SubmitErrorState>({ general: [], validation: {} });
  const isEdit = !!editing;

  const openModal = useCallback((entity?: EntityT) => { setEditing(entity ?? null); setSubmitErrors({ general: [], validation: {} }); setIsOpen(true); }, []);
  const closeModal = useCallback(() => { setIsOpen(false); setEditing(null); setSubmitErrors({ general: [], validation: {} }); }, []);

  const handleSubmit = useCallback(async (values: FormValues) => {
    setSubmitErrors({ general: [], validation: {} });
    if (editing) {
      const result = await unwrapUpdate({ id: editing.id, data: values }, update);
      if (result.ok) { closeModal(); return; }
      setSubmitErrors(result.errors);
    } else {
      const { /* destructure only writable fields */ } = values;
      const result = await unwrapCreate({ /* writable fields */ }, create);
      if (result.ok) { closeModal(); return; }
      setSubmitErrors(result.errors);
    }
  }, [editing, create, update, closeModal]);

  return { isOpen, isEdit, editing, submitErrors, openModal, closeModal, handleSubmit };
};
```
- Controller calls service directly (NOT thunks), dispatches sync actions
- Form hook receives `create`/`update` from controller (not internal)
- `handleSubmit` destructures only writable fields on create (excludes read-only)
- `unwrapCreate`/`unwrapUpdate` utilities wrap error handling (see academic-period.controller.ts for full implementation)

### 6. Forms (`components/FormModal.tsx`)
```tsx
import { checkboxClassname, inputClassname, selectClassname } from "@app/styles/styles";

// CustomSelect MUST pass className={selectClassname}
<CustomSelect label="Nombre" name="name" ... className={selectClassname} />

// On create: do NOT send is_active (backend defaults to true)
// On edit: include is_active checkbox

{isEdit && (
  <CustomCheckbox name="is_active" checked={...} onChange={...} label="Activo" className={checkboxClassname} />
)}
```
- Form modal receives `submitErrors: SubmitErrorState` prop (with general + validation errors display)
- Error display uses `getFieldLabel()` map for user-friendly field names

### 7. View Modal (`components/ViewModal.tsx`)
- Calls `moduleService.get(id)` directly inside `useEffect`
- Uses local `useReducer` for loading/error/success states
- Shows skeleton loader with `animate-pulse` while loading
- Shows fields as `DetailRow` with icon, label, value (read-only)
- Status shown as colored badge with dot
- NO sensitive fields: `id`, `created_at`, `updated_at` excluded

### 8. Delete Modal (`components/DeleteModal.tsx`)
- Uses local `useState` for `isDeleting`
- Shows `AlertTriangle` icon, entity name, and confirmation text
- `onConfirm` returns `Promise<void>`
- Both buttons disabled while `isDeleting`
- Cancel button uses same style as other modals (`border border-slate-300 bg-white`)

### 9. Table (`components/Table.tsx`)
```tsx
// Props: data, isLoading, loadData function, onEdit, onView, onDelete
// Table receives data as props from parent page (NOT self-contained data fetching)
// Three action icons: Eye (view), Pencil (edit), Trash2 (delete with red hover)
// ORDERING_OPTIONS must match backend ordering_fields only
// Search sends ?search= param to backend (requires SearchFilter)
```

### 10. Page (`ModuleNamePage.tsx`)
```tsx
export default function ModulePage() {
  const { items, isLoading, loadItems, create, update, remove } = useModuleController();
  const { isOpen, isEdit, editing, submitErrors, openModal, closeModal, handleSubmit } = useModuleForm({ create, update });
  const [viewingId, setViewingId] = useState<number | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [deleting, setDeleting] = useState<EntityT | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  // ... open/close handlers

  return (
    <>
      <button onClick={() => openModal()}>Nuevo</button>
      <ModuleTable data={items} isLoading={isLoading} loadData={loadItems} onEdit={openModal} onView={openViewModal} onDelete={openDeleteModal} />
      <ModuleFormModal isOpen={isOpen} onClose={closeModal} isEdit={isEdit} editing={editing} onSubmit={handleSubmit} submitErrors={submitErrors} />
      <ModuleViewModal isOpen={isViewOpen} entityId={viewingId} onClose={closeViewModal} />
      <ModuleDeleteModal isOpen={isDeleteOpen} entity={deleting} onClose={closeDeleteModal} onConfirm={handleDeleteConfirm} />
    </>
  );
}
```

### 11. Yup Validation (`module-name.utils.ts`)
```ts
export const moduleSchema = Yup.object({ name: Yup.string().required("..."), code: Yup.string().required("..."), is_active: Yup.boolean() });
```

---

## AUDIT CHECKLIST (for reviewing other modules)

### Structure
- [ ] Module `index.ts` exports: types, constants, service, controller, slice, utils + default reducer + default page
- [ ] No `application/`, `domain/`, `infrastructure/`, `presentation/` directories (OBSOLETE)
- [ ] Files are flat in the module root (only `components/` subdirectory)
- [ ] No thunks files (`.thunks.ts`) or mapper files (`.mapper.ts`)

### Types (`module-name.types.ts`)
- [ ] Entity type matches backend serializer fields exactly
- [ ] `OrderingT` only includes fields in backend `ordering_fields`
- [ ] `CreateDataT` omits: `id`, `is_active`, `created_at`, `updated_at`, plus any read-only computed fields
- [ ] `softDelete` return type is `Promise<{ id: number }>` (NOT full entity)
- [ ] Service interface has all 5 methods: `list`, `get`, `create`, `update`, `softDelete`
- [ ] `FormValues` interface exists for Formik form typing

### Constants (`module-name.constants.ts`)
- [ ] Endpoints match backend (`/api/academic/<model>/`)
- [ ] Permissions match backend `action_permissions`

### Service (`module-name.service.ts`)
- [ ] Class-based implementation (not object literal)
- [ ] `list` extracts `.results` from `data.data.results` directly (no mapper)
- [ ] `softDelete` uses `ResponseApi<{ id: number }>` type
- [ ] `list` builds search/ordering query params
- [ ] All methods use `getApiErrorMessage(error)` in catch

### Slice (`module-name.slice.ts`)
- [ ] NO `extraReducers` — all reducers are sync actions in `reducers: {}`
- [ ] NO thunks imported
- [ ] Slice name matches store key (e.g., `"academicPeriods"` → `state.academic.academicPeriods`)
- [ ] Reducer has: `loadPending`, `loadSuccess`, `loadError`, `entityCreated` (unshift), `entityUpdated` (findIndex+replace), `entityDeleted` (filter), `mutationError`, `clearError`
- [ ] Selectors access `state.<domain>.<sliceKey>.<field>`

### Controller (`module-name.controller.ts`)
- [ ] Controller calls service class directly (not thunks)
- [ ] Controller dispatches sync actions from the slice
- [ ] Controller exposes: `items`, `isLoading`, `error`, `loadItems`, `create`, `update`, `remove`
- [ ] Form hook receives `create`/`update` as arguments (from controller), NOT internal
- [ ] Form hook has `SubmitErrorState` with `general` + `validation` errors
- [ ] Form hook create path destructures only writable fields (excludes read-only)

### Components
- [ ] Form modal imports `inputClassname`, `checkboxClassname`, `selectClassname` from `@app/styles/styles`
- [ ] Form modal receives `submitErrors: SubmitErrorState` prop with error display
- [ ] Create payload does NOT send `is_active` (backend defaults to true)
- [ ] View modal excludes `id`, `created_at`, `updated_at`
- [ ] View modal calls service directly (NOT dispatch)
- [ ] Delete modal shows entity name + uses red button + loader
- [ ] Table has 3 icons: Eye, Pencil, Trash2
- [ ] Table receives data as props from parent (NOT self-contained controller)
- [ ] Table orders via backend (`?ordering=`), NOT client-side `.sort()`
- [ ] Table searches via backend (`?search=`), NOT client-side `.filter()`

### Store integration
- [ ] Module registered in `features/academic/index.ts` (or appropriate domain barrel)
- [ ] Reducer imported in `shared/redux/store.ts` under correct domain `combineReducers`
- [ ] Route configured in `academic.routes.config.ts` (lazy import)
- [ ] Store key matches slice name

### Backend verification
- [ ] Endpoint matches frontend constants (`/api/academic/<model>/`)
- [ ] Backend serializer fields match frontend entity type
- [ ] Backend `ordering_fields` match (or are superset of) frontend `OrderingT`
- [ ] Backend has `SearchFilter` if frontend sends `?search=`
- [ ] Backend has `DjangoFilterBackend` if frontend sends filter query params
- [ ] Backend `soft_delete` action returns `{ id, is_active }` (NOT full entity)
- [ ] Permissions match between frontend constants and backend `action_permissions`

---

## Redux store (`src/shared/redux/store.ts`) — Current state

```
auth              → authReducer
institutions      → combineReducers({ schoolYear, academicGrade, academicSubLevel, section, academicLevel })
academic          → combineReducers({ subjectAcademicConfigs, subjects, academicPeriods,
                    teacherSubjectSections, subjectOfferings, classSchedules, periodTypes })
grading           → combineReducers({ qualitativeScales, evaluationBlocks, blockComponents,
                    gradeHistory, studentNotes, periodGradeSummaries, activityTypes,
                    evaluativeActivities, qualitativeScaleSublevels })
students          → combineReducers({ student, representative, kinship, residentialZone, enrollments })
analytics         → analyticsReducer
```

## API conventions
- All backend responses wrap data in `{ ok: boolean, data: T, msg: string }` (type: `ResponseApi<T>`)
- Backend uses `StandardResultsSetPagination` (PageNumberPagination) returning `{ count, next, previous, results }`
- Frontend mapper functions extract `.results` from paginated responses
- The Axios instance `apiClient` auto-attaches Bearer token and auto-refreshes on 401
- JWT tokens live only in memory (via `tokenManager`); page reload loses session

## Form patterns
- Every form uses Formik + Yup via `useFormik<FormValues>({ initialValues, validationSchema, enableReinitialize: true, onSubmit })`
- All form fields use shared components: `CustomInput`, `CustomSelect`, `CustomCheckbox`
- `CustomSelect` accepts `className` prop of type `{ container, label, select, option, error }` — pass `selectClassname` from `@app/styles/styles`
- `CustomInput` accepts `className` prop of type `{ container, input, label, error }` — pass `inputClassname`
- `CustomCheckbox` accepts `className` prop of type `{ container, checkbox, label }` — pass `checkboxClassname`
- Forms receive related entity arrays as props from the page (loaded via hooks like `useSubjectOptions`)
- On open, a `useEffect` calls `formik.setValues(initialValues)` to handle reinitialization
- Modals render `null` when `!isOpen`
- Submit button shows a loader span when `formik.isSubmitting`

## Design system classnames (`@app/styles/styles`)
- `inputClassname` → `{ container, label, input, error }`
- `selectClassname` → `{ container, label, select, error }`
- `checkboxClassname` → `{ container, checkbox, label }`
- `tableClassname` → `{ container, table, thead, trHead, tbody, trBody, notFound, actions }`
- `tableFirstColumnClassname` → `{ th, td }`
- `tableColumnsClassname` → `{ th, td }`
