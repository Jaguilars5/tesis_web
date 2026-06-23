import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@shared/redux/store";
import type { RequestStatusT } from "@shared/types/request.types";
import type { ActivityTypeT } from "./activity-types.types";
export interface ActivityTypesStateT { activityTypes: ActivityTypeT[]; status: RequestStatusT; error: string | null; }
const initialState: ActivityTypesStateT = { activityTypes: [], status: "idle", error: null };
const slice = createSlice({
  name: "activityTypes", initialState,
  reducers: { loadPending(s) { s.status = "loading"; s.error = null; }, loadSuccess(s, a: PayloadAction<ActivityTypeT[]>) { s.activityTypes = a.payload; s.status = "succeeded"; }, loadError(s, a: PayloadAction<string>) { s.status = "failed"; s.error = a.payload; }, entityCreated(s, a: PayloadAction<ActivityTypeT>) { s.activityTypes.unshift(a.payload); s.status = "succeeded"; }, entityUpdated(s, a: PayloadAction<ActivityTypeT>) { const idx = s.activityTypes.findIndex((p) => p.id === a.payload.id); if (idx !== -1) s.activityTypes[idx] = a.payload; s.status = "succeeded"; }, entityDeleted(s, a: PayloadAction<number>) { s.activityTypes = s.activityTypes.filter((p) => p.id !== a.payload); s.status = "succeeded"; }, mutationError(s, a: PayloadAction<string>) { s.status = "failed"; s.error = a.payload; }, clearError(s) { s.error = null; } },
});
export const { loadPending, loadSuccess, loadError, entityCreated, entityUpdated, entityDeleted, mutationError, clearError } = slice.actions;
export const selectActivityTypes = (s: RootState): ActivityTypeT[] => s.grading.activityTypes.activityTypes;
export const selectActivityTypesStatus = (s: RootState): RequestStatusT => s.grading.activityTypes.status;
export const selectActivityTypesError = (s: RootState): string | null => s.grading.activityTypes.error;
export const activityTypesReducer = slice.reducer;
export default slice.reducer;
