import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@shared/redux/store";
import type { RequestStatusT } from "@shared/types/request.types";
import type { AttendanceStatusT } from "./attendance-status.types";

export interface AttendanceStatusStateT { attendanceStatuses: AttendanceStatusT[]; status: RequestStatusT; error: string | null; }
const initialState: AttendanceStatusStateT = { attendanceStatuses: [], status: "idle", error: null };

const attendanceStatusSlice = createSlice({
  name: "attendanceStatuses", initialState,
  reducers: {
    loadPending(state) { state.status = "loading"; state.error = null; },
    loadSuccess(state, action: PayloadAction<AttendanceStatusT[]>) { state.attendanceStatuses = action.payload; state.status = "succeeded"; },
    loadError(state, action: PayloadAction<string>) { state.status = "failed"; state.error = action.payload; },
    entityCreated(state, action: PayloadAction<AttendanceStatusT>) { state.attendanceStatuses.unshift(action.payload); state.status = "succeeded"; },
    entityUpdated(state, action: PayloadAction<AttendanceStatusT>) {
      const idx = state.attendanceStatuses.findIndex((p) => p.id === action.payload.id);
      if (idx !== -1) state.attendanceStatuses[idx] = action.payload;
      state.status = "succeeded";
    },
    entityDeleted(state, action: PayloadAction<number>) { state.attendanceStatuses = state.attendanceStatuses.filter((p) => p.id !== action.payload); state.status = "succeeded"; },
    mutationError(state, action: PayloadAction<string>) { state.status = "failed"; state.error = action.payload; },
    clearError(state) { state.error = null; },
  },
});

export const { loadPending, loadSuccess, loadError, entityCreated, entityUpdated, entityDeleted, mutationError, clearError } = attendanceStatusSlice.actions;
export const selectAttendanceStatuses = (state: RootState): AttendanceStatusT[] => state.attendance.attendanceStatuses.attendanceStatuses;
export const selectAttendanceStatusesStatus = (state: RootState): RequestStatusT => state.attendance.attendanceStatuses.status;
export const selectAttendanceStatusesError = (state: RootState): string | null => state.attendance.attendanceStatuses.error;
export const attendanceStatusReducer = attendanceStatusSlice.reducer;
export default attendanceStatusSlice.reducer;
