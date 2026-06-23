import { createSlice, type PayloadAction } from "@reduxjs/toolkit"; import type { RootState } from "@shared/redux/store"; import type { RequestStatusT } from "@shared/types/request.types"; import type { SectionT } from "./section.types";
export interface SectionStateT { sections: SectionT[]; status: RequestStatusT; error: string | null; }
const initialState: SectionStateT = { sections: [], status: "idle", error: null };
const slice = createSlice({ name: "section", initialState, reducers: { loadPending(s) { s.status = "loading"; s.error = null; }, loadSuccess(s, a: PayloadAction<SectionT[]>) { s.sections = a.payload; s.status = "succeeded"; }, loadError(s, a: PayloadAction<string>) { s.status = "failed"; s.error = a.payload; }, entityCreated(s, a: PayloadAction<SectionT>) { s.sections.unshift(a.payload); s.status = "succeeded"; }, entityUpdated(s, a: PayloadAction<SectionT>) { const idx = s.sections.findIndex((p) => p.id === a.payload.id); if (idx !== -1) s.sections[idx] = a.payload; s.status = "succeeded"; }, entityDeleted(s, a: PayloadAction<number>) { s.sections = s.sections.filter((p) => p.id !== a.payload); s.status = "succeeded"; }, mutationError(s, a: PayloadAction<string>) { s.status = "failed"; s.error = a.payload; }, clearError(s) { s.error = null; } } });
export const { loadPending, loadSuccess, loadError, entityCreated, entityUpdated, entityDeleted, mutationError, clearError } = slice.actions;
export const selectSections = (s: RootState): SectionT[] => s.institutions.section.sections;
export const selectSectionsStatus = (s: RootState): RequestStatusT => s.institutions.section.status;
export const selectSectionError = (s: RootState): string | null => s.institutions.section.error;
export const sectionReducer = slice.reducer; export default slice.reducer;
