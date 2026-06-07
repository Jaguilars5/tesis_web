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
  features/                # domain modules, each owns its own Redux slice
    academic/              # config-academic, timing-regime, section, subject,
                           #   academic-period, academic-activity, teacher-subject-section
    scheduling/            # time-slots, schedule-config, schedule-slots,
                           #   subject-constraints, teacher-availability
    students/              # student, representative
    grading/               # attendance, conduct-incident, student-note
    accounts/              # permissions, roles, users
    institutions/          # school-year, classroom
    auth/, dashboard/, profile/, design-system/
  shared/
    redux/store.ts         # single configureStore with combineReducers per domain
    redux/hooks.ts         # useAppDispatch, useAppSelector (typed)
    services/api.client.ts # Axios with JWT interceptor + token refresh
    types/                 # RequestStatus, ResponseApi<T>
    components/            # CustomInput, CustomSelect, CustomCheckbox (Form/),
                           #   CustomTable (Table/), DashboardLayout (Layout/)
    constants/styles.ts    # design system classname constants (BUTTON, COLOR, etc.)
```

## Feature module conventions (critical for consistency)

Every leaf feature module (e.g. `academic/section`) follows this exact structure:

```
<module>/
  types/<module>.types.ts       # Entity + CreateRequest + UpdateRequest + DeleteRequest + State
  types/index.ts                # export * from ...
  services/<module>-api.service.ts  # class with list/get/create/update/softDelete
  services/index.ts             # export * from ...
  redux/<module>.slice.ts       # createSlice (name, initialState, reducers, extraReducers)
  redux/<module>.thunks.ts      # createAsyncThunk (fetch, create, update, delete)
  redux/<module>.selectors.ts   # state.<domain>.<sliceKey>.*
  redux/index.ts                # export * from thunks, selectors
  hooks/<module>.hook.ts        # useCustomHook (wraps dispatch calls in useCallback)
  hooks/index.ts                # export * from ...
  helpers/<module>.helpers.ts   # Yup validation schema + FormValues type
  helpers/index.ts              # export * from ...
  constants/<module>.constants.ts   # options arrays, defaults
  constants/index.ts            # export * from ...
  components/<ModuleTable>.tsx  # CustomTable with edit/delete action buttons
  components/<ModuleFormModal>.tsx  # Formik modal (CustomInput/CustomSelect + Yup)
  pages/<ModulePage>.tsx        # default export: orchestrates table + modal
```

### Type pattern
```ts
export type <Entity>CreateRequest = Omit<Entity, "id" | "created_at" | "updated_at" | "active">;
export type <Entity>UpdateRequest = Partial<CreateRequest> & { id: number };
export type <Entity>DeleteRequest = { id: number };
export type <Entity>sState = { entities: Entity[]; status: RequestStatus; error: string | null; };
```
Always omit `active` (has backend default) and audit fields from CreateRequest.

### Redux slice pattern
- `name`: `'<domain>/<sliceKey>'` (e.g. `'academic/sections'`, `'grading/attendances'`)
- On create: `state.entities.unshift(action.payload)`
- On update: find by index, replace
- On soft-delete: find by index, replace (entity comes back with `active=false`)
- On hard-delete: `state.entities.filter((e) => e.id !== action.payload)`
- Every thunk's `.fulfilled` sets `status: 'succeeded'`, `.rejected` sets `status: 'failed'`

### API service pattern
Standard REST modules (most): use `apiClient.get()` / `.post()` / `.patch()` / `.delete()`.
**Exception: `grading/*` modules** — the grading backend uses POST-only endpoints with URLs like `/api/grading/attendance/list/`, `/add/`, `/update/`, `/delete/`. The `id` is always sent in the body for get/update/delete. Service methods for grading must use `apiClient.post()` for everything.

### Barrel export pattern
Three levels:
1. Subdirectory index (`types/index.ts`, `services/index.ts`, etc.) — `export * from "..."`
2. Feature group index (`src/features/academic/index.ts`) — exports reducer (default), thunks, selectors, types, page, helpers, constants, hooks, services, and `clearXxxError` action for each sub-module
3. Store integration (`src/shared/redux/store.ts`) — imports reducers from feature index, combines with `combineReducers`

## Redux store (`src/shared/redux/store.ts`)

State shape:
```
auth              → authReducer (authSlice from @features/auth)
institutions      → combineReducers({ schoolYear, classroom })
academic          → combineReducers({ timingRegimes, configAcademics, sections,
                    subjects, academicPeriods, academicActivities, teacherSubjectSections })
scheduling        → combineReducers({ timeSlots, scheduleConfig, scheduleSlots,
                    subjectConstraints, teacherAvailability })
accounts          → combineReducers({ permissions, roles, users })
grading           → combineReducers({ attendances, conductIncidents, studentNotes })
students          → combineReducers({ student, representative })
```

When adding a new feature module:
1. Create the module following the exact folder structure above
2. Add exports to the parent feature barrel (`features/<domain>/index.ts`)
3. Import the reducer in `store.ts` and add it to the domain's `combineReducers`
4. Add a lazy route in `AppRoutes.tsx`
5. Add a sidebar link in `DashboardLayout.tsx`

## API conventions
- All backend responses wrap data in `{ ok: boolean, data: T, msg: string }` (type: `ResponseApi<T>`)
- Services destructure `response.data.data` and log `getApiErrorMessage(error)` on failure
- The Axios instance `apiClient` auto-attaches Bearer token and auto-refreshes on 401
- JWT tokens live only in memory (via `tokenManager`); page reload loses session

## Form patterns
- Every form uses Formik + Yup via `useFormik<FormValues>({ initialValues, validationSchema, enableReinitialize: true, onSubmit })`
- All form fields use shared components: `CustomInput`, `CustomSelect`, `CustomCheckbox`
- `CustomSelect` expects `{ label: string; value: string }[]` options
- Forms receive related entity arrays as props from the page (which loads them from Redux)
- On open, a `useEffect` calls `formik.setValues(initialValues)` to handle reinitialization
- Modals render `null` when `!isOpen`
- Submit button shows a loader span when `formik.isSubmitting`

## Sidebar navigation
Sections defined in `DashboardLayout.tsx` as `const` arrays of `{ to, label, icon }`. Icons come from `lucide-react`. Each array maps to a sidebar section with a heading.

## Grading API difference (critical)
The `grading` backend uses a **POST-only RPC-style API** — completely different from all other modules:
- `POST /api/grading/<model>/list/`  — list all
- `POST /api/grading/<model>/get/`   — get by id (body: `{id}`)
- `POST /api/grading/<model>/add/`   — create (body: all fields)
- `POST /api/grading/<model>/update/` — update (body: `{id, ...fields}`)
- `POST /api/grading/<model>/delete/` — hard delete (body: `{id}`)
- `POST /api/grading/student-note/soft-delete/` — soft delete (only StudentNote has `active`)

Attendance and ConductIncident do NOT support soft-delete. Use hard delete for those.

## Async thunk error handling
Every thunks file defines a local helper (NOT shared):
```ts
function normalizeThunkError(error: unknown) {
  if (error instanceof Error) return error.message
  return 'No se pudo completar la operacion'
}
```
All thunks use `rejectWithValue(normalizeThunkError(error))` in catch blocks.

## Design system classnames
Instead of inline Tailwind, use constants from `@shared/constants/styles`:
- `BUTTON.primary`, `BUTTON.secondary`
- `COLOR.text.app`, `COLOR.text.muted`, `COLOR.bg.surface`, `COLOR.border.soft`, etc.
- `TYPOGRAPHY.size.sm`, `TYPOGRAPHY.weight.extrabold`
- `MODAL.slideUp`, `OVERLAY.backdrop`, `TABLE.wrapper`
- `SPACING.spaceY[4]`, `COMPOSITION.iconMd`, `LOADER`
