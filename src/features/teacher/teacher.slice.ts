import { createSlice } from "@reduxjs/toolkit"; import type { RootState } from "@shared/redux/store"; import type { RequestStatusT } from "@shared/types/request.types";
export interface TeacherStateT { status: RequestStatusT; error: string | null; }
const initialState: TeacherStateT = { status: "idle", error: null };
const slice = createSlice({ name: "teacher", initialState, reducers: {} });
export const selectTeacherStatus = (s: RootState): RequestStatusT => s.teacher.status;
export const teacherReducer = slice.reducer; export default slice.reducer;
