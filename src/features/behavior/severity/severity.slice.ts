import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@shared/redux/store";
import type { RequestStatusT } from "@shared/types/request.types";
import type { SeverityT } from "./severity.types";
export interface SeverityStateT { severities: SeverityT[]; status: RequestStatusT; error: string | null; }
const initialState: SeverityStateT = { severities: [], status: "idle", error: null };
const slice = createSlice({
  name: "severities", initialState,
  reducers: { loadPending(s) { s.status = "loading"; s.error = null; }, loadSuccess(s, a: PayloadAction<SeverityT[]>) { s.severities = a.payload; s.status = "succeeded"; }, loadError(s, a: PayloadAction<string>) { s.status = "failed"; s.error = a.payload; }, entityCreated(s, a: PayloadAction<SeverityT>) { s.severities.unshift(a.payload); s.status = "succeeded"; }, entityUpdated(s, a: PayloadAction<SeverityT>) { const idx = s.severities.findIndex((p) => p.id === a.payload.id); if (idx !== -1) s.severities[idx] = a.payload; s.status = "succeeded"; }, entityDeleted(s, a: PayloadAction<number>) { s.severities = s.severities.filter((p) => p.id !== a.payload); s.status = "succeeded"; }, mutationError(s, a: PayloadAction<string>) { s.status = "failed"; s.error = a.payload; }, clearError(s) { s.error = null; } },
});
export const { loadPending, loadSuccess, loadError, entityCreated, entityUpdated, entityDeleted, mutationError, clearError } = slice.actions;
export const selectSeverities = (s: RootState): SeverityT[] => s.behavior.severities.severities;
export const selectSeveritiesStatus = (s: RootState): RequestStatusT => s.behavior.severities.status;
export const selectSeveritiesError = (s: RootState): string | null => s.behavior.severities.error;
export const severityReducer = slice.reducer;
export default slice.reducer;
