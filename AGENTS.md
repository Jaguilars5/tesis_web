# AGENTS.md — EduManage Frontend

## Stack & versions
React 19, TypeScript 6, Vite 8, Tailwind CSS 4 (`@tailwindcss/vite`), Redux Toolkit, React Router 7, Axios, Formik + Yup, lucide-react, socket.io-client, fecha.

## Commands
```
npm run dev         # Vite dev server (default :5173, proxy /api → http://127.0.0.1:8000)
npm run build       # tsc -b && vite build
npm run lint        # eslint .
npm run typecheck   # tsc -p tsconfig.app.json --noEmit
npm run preview     # preview production build
```
**Always run `typecheck && lint` after code changes.** No test framework exists.

## Path aliases (tsconfig.app.json + vite.config.ts)
| Alias | Resolves to |
|-------|------------|
| `@features/*` | `src/features/*` |
| `@shared/*` | `src/shared/*` |
| `@scheduling/*` | `src/features/scheduling/*` |
| `@app/*` | `src/app/*` |

## Module structure — canonical flat pattern
Every feature module follows this structure (reference: `academic-period`, `period-types`):
```
module-name/
  index.ts                                    # barrel export
  module-name.types.ts                        # EntityT, FormValues, Params, ServiceT
  module-name.constants.ts                    # BASE_URL, ENDPOINTS, PERMISSIONS
  module-name.service.ts                      # class implements ServiceT
  module-name.slice.ts                        # createSlice, sync reducers only (NO thunks)
  module-name.utils.ts                        # Yup schema
  ModuleNamePage.tsx                          # page component (default export)
  hooks/
    useModuleNameController.ts                # controller hook (dispatches sync actions)
    useModuleNameForm.ts                       # formik form hook (unwrapMutation)
    useXxxOptions.ts                          # FK options hooks (when needed)
  components/
    ModuleNameFormModal.tsx
    ModuleNameTable.tsx
    ModuleNameViewModal.tsx
    ModuleNameDeleteModal.tsx
```
No `application/`, `domain/`, `infrastructure/`, `presentation/` dirs. No `.thunks.ts` or `.mapper.ts` files. Controllers live in `hooks/` (not root).

## Key shared modules

| Import | What |
|--------|------|
| `@shared/redux/hooks` | `useAppDispatch`, `useAppSelector` (typed) |
| `@shared/redux/store` | `store`, `RootState`, `AppDispatch` |
| `@shared/services/api.client` | `apiClient` (Axios + JWT refresh), `setUnauthorizedHandler`, `getApiErrorMessage` |
| `@shared/types/api.response.types` | `ResponseApi<T>`, `PaginatedData<T>` |
| `@shared/types/request.types` | `RequestStatusT` (`"idle"\|"loading"\|"succeeded"\|"failed"`) |
| `@shared/types/soft-delete.types` | `SoftDeleteResponseT`, `SoftDeleteParamsT`, `requiresConfirmation()` |
| `@shared/utils/validationErrors` | `toRejectValue`, `unwrapMutation`, `SubmitErrorState`, `CreateRejectValue` |
| `@shared/utils/permissions` | `hasPermission(userPermissions, required)` |
| `@shared/hooks/useSoftDeleteFlow` | Two-phase soft delete hook for DeleteModal |
| `@app/styles/styles` | `tableClassname`, `inputClassname`, `selectClassname`, `checkboxClassname`, `filterSelectClassname`, `tableFirstColumnClassname`, `tableColumnsClassname` |

Shared components: `CustomInput`, `CustomSelect`, `CustomCheckbox`, `CustomMultiSelect`, `CustomTextArea` (Form/), `DetailRow` (DetailRow/), `ErrrosInForm` (ErrrosInForm/), `PageHeader`, `Badge`, `Toast` (`Toast/`), `Pagination` (`Pagination/`), `Layout` (`Layout/`).

## API conventions
- Backend: `{ ok: boolean, data: T, msg: string }` (`ResponseApi<T>`)
- Pagination: `StandardResultsSetPagination` → `{ count, next, previous, results }`
- Frontend extracts `.results` directly in service (no mapper)
- `apiClient` auto-attaches Bearer token, auto-refreshes on 401, fires `sessionExpired` + redirect on refresh failure
- JWT in memory only (`tokenManager`); page reload loses session
- Vite dev server proxies `/api` → `http://127.0.0.1:8000`

## Non-obvious patterns
- **Soft delete is two-phase**: first POST (no `confirm`) to probe, second POST (`confirm: true`) to cascade. Controller's `deleteItem` returns `SoftDeleteResponseT` and only dispatches `entityDeleted` when `is_active === false`. DeleteModal uses `useSoftDeleteFlow` shared hook.
- **Controllers use sync dispatch** (no thunks). `createItem`/`updateItem` dispatch `entityCreated`/`entityUpdated`, catch uses `toRejectValue` + `dispatch(mutationError(rv.msg))` + `throw rv`.
- **Slice key matches store key** (e.g., `name: "periodTypes"` → `state.academic.periodTypes`)
- **Do NOT send `is_active` on create** (backend defaults to true). `FormValues` excludes `is_active`.
- **FormModal uses `key={editingItem?.id ?? "create"}`** instead of `enableReinitialize`.
- **FormModal imports className objects from `@app/styles/styles`**, passes them as `className` prop to form components.
- **Form hook `useModuleForm` receives `create`/`update` from controller** (not internal). Uses `unwrapMutation` from `@shared/utils/validationErrors`.
- **Table gets data from parent** (not self-contained fetching). Orders/searches via backend (`?ordering=`, `?search=`), not client-side.
- **ViewModal calls service directly** (not dispatch), uses local `useReducer`.
- **Action buttons gated by permissions**: Page calculates `canCreate`/`canEdit`/`canDelete` via `hasPermission(selectUserPermissions, MODULE_PERMISSIONS.X)`.

## Redux store structure (`src/shared/redux/store.ts`)
```
auth              → authReducer
institutions      → combineReducers({ schoolYear, academicGrade, academicSubLevel, section, academicLevel })
academic          → combineReducers({ subjectAcademicConfigs, subjects, academicPeriods,
                    teacherSubjectSections, subjectOfferings, classSchedules, periodTypes })
grading           → combineReducers({ qualitativeScales, evaluationBlocks, blockComponents,
                    gradeHistory, studentNotes, periodGradeSummaries, activityTypes,
                    evaluativeActivities, qualitativeScaleSublevels })
students          → combineReducers({ student, representative, kinship, enrollments, specialNeedsTypes })
attendance        → combineReducers({ attendances, attendanceStatuses, absenceTypes })
behavior          → combineReducers({ behaviorEvaluations, incidentTypes, severities, conductIncidents })
analytics         → combineReducers({ dashboard, riskScores, scoringConfig, earlyAlerts })
teacher           → teacherReducer
iam               → combineReducers({ permissions, roles, users })
```

## Gotchas
- **Two lockfiles**: `package-lock.json` and `pnpm-lock.yaml` both committed — use `npm install`, not `pnpm install`.
- **No CI/CD config in repo**. No pre-commit hooks. No codegen.
- **`normalizeThunkError.ts` still exists** in `@shared/utils/` — it's leftover from the deprecated thunk pattern. Use `toRejectValue`/`getApiErrorMessage` instead.
- **Route config is centralized** in `src/app/routes.config.ts` — each feature domain exports a `RoutesConfigItem[]` merged there.
