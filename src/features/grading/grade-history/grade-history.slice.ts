import { createSlice, type PayloadAction } from "@reduxjs/toolkit"; import type { RootState } from "@shared/redux/store"; import type { RequestStatusT } from "@shared/types/request.types"; import type { GradeChangeHistoryT } from "./grade-history.types";
export interface GradeHistoryStateT { gradeHistoryItems: GradeChangeHistoryT[]; status: RequestStatusT; error: string | null; }
const initialState: GradeHistoryStateT = { gradeHistoryItems: [], status: "idle", error: null };
const slice = createSlice({ name: "gradeHistory", initialState, reducers: { loadPending(s) { s.status = "loading"; s.error = null; }, loadSuccess(s, a: PayloadAction<GradeChangeHistoryT[]>) { s.gradeHistoryItems = a.payload; s.status = "succeeded"; }, loadError(s, a: PayloadAction<string>) { s.status = "failed"; s.error = a.payload; }, itemLoaded(s, a: PayloadAction<GradeChangeHistoryT>) { const idx = s.gradeHistoryItems.findIndex((i) => i.id === a.payload.id); if (idx !== -1) s.gradeHistoryItems[idx] = a.payload; else s.gradeHistoryItems.unshift(a.payload); s.status = "succeeded"; }, mutationError(s, a: PayloadAction<string>) { s.status = "failed"; s.error = a.payload; }, clearError(s) { s.error = null; } } });
export const { loadPending, loadSuccess, loadError, itemLoaded, mutationError, clearError } = slice.actions;
export const selectGradeHistory = (s: RootState): GradeChangeHistoryT[] => s.grading.gradeHistory.gradeHistoryItems;
export const selectGradeHistoryStatus = (s: RootState): RequestStatusT => s.grading.gradeHistory.status;
export const selectGradeHistoryError = (s: RootState): string | null => s.grading.gradeHistory.error;
export const gradeHistoryReducer = slice.reducer; export default slice.reducer;
