import { createSlice, type PayloadAction } from "@reduxjs/toolkit"; import type { RootState } from "@shared/redux/store"; import type { RequestStatusT } from "@shared/types/request.types"; import type { StudentT } from "./student.types";
export interface StudentStateT { students: StudentT[]; status: RequestStatusT; error: string | null; }
const initialState: StudentStateT = { students: [], status: "idle", error: null };
const slice = createSlice({ name: "student", initialState, reducers: { loadPending(s) { s.status = "loading"; s.error = null; }, loadSuccess(s, a: PayloadAction<StudentT[]>) { s.students = a.payload; s.status = "succeeded"; }, loadError(s, a: PayloadAction<string>) { s.status = "failed"; s.error = a.payload; }, entityCreated(s, a: PayloadAction<StudentT>) { s.students.unshift(a.payload); s.status = "succeeded"; }, entityUpdated(s, a: PayloadAction<StudentT>) { const idx = s.students.findIndex((p) => p.id === a.payload.id); if (idx !== -1) s.students[idx] = a.payload; s.status = "succeeded"; }, entityDeleted(s, a: PayloadAction<number>) { s.students = s.students.filter((p) => p.id !== a.payload); s.status = "succeeded"; }, mutationError(s, a: PayloadAction<string>) { s.status = "failed"; s.error = a.payload; }, clearError(s) { s.error = null; } } });
export const { loadPending, loadSuccess, loadError, entityCreated, entityUpdated, entityDeleted, mutationError, clearError } = slice.actions;
export const selectStudents = (s: RootState): StudentT[] => s.students.student.students;
export const selectStudentsStatus = (s: RootState): RequestStatusT => s.students.student.status;
export const selectStudentsError = (s: RootState): string | null => s.students.student.error;
export const studentReducer = slice.reducer; export default slice.reducer;
