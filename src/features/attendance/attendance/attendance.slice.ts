import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@shared/redux/store";
import type { RequestStatusT } from "@shared/types/request.types";
import type { AttendanceT } from "./attendance.types";

export interface AttendanceStateT {
  attendances: AttendanceT[];
  currentAttendance: AttendanceT | null;
  status: RequestStatusT;
  error: string | null;
}

const initialState: AttendanceStateT = {
  attendances: [],
  currentAttendance: null,
  status: "idle",
  error: null,
};

const attendanceSlice = createSlice({
  name: "attendances",
  initialState,
  reducers: {
    loadPending(state) { state.status = "loading"; state.error = null; },
    loadSuccess(state, action: PayloadAction<AttendanceT[]>) { state.attendances = action.payload; state.status = "succeeded"; },
    loadError(state, action: PayloadAction<string>) { state.status = "failed"; state.error = action.payload; },
    currentAttendanceLoaded(state, action: PayloadAction<AttendanceT>) { state.currentAttendance = action.payload; state.status = "succeeded"; },
    attendanceCreated(state, action: PayloadAction<AttendanceT>) { state.attendances.unshift(action.payload); state.status = "succeeded"; },
    attendanceUpdated(state, action: PayloadAction<AttendanceT>) {
      const idx = state.attendances.findIndex((s) => s.id === action.payload.id);
      if (idx !== -1) state.attendances[idx] = action.payload;
      if (state.currentAttendance?.id === action.payload.id) state.currentAttendance = action.payload;
      state.status = "succeeded";
    },
    mutationError(state, action: PayloadAction<string>) { state.status = "failed"; state.error = action.payload; },
    clearError(state) { state.error = null; },
  },
});

export const {
  loadPending, loadSuccess, loadError,
  currentAttendanceLoaded,
  attendanceCreated, attendanceUpdated,
  mutationError, clearError,
} = attendanceSlice.actions;

export const selectAttendances = (state: RootState): AttendanceT[] => state.attendance.attendances.attendances;
export const selectCurrentAttendance = (state: RootState): AttendanceT | null => state.attendance.attendances.currentAttendance;
export const selectAttendancesStatus = (state: RootState): RequestStatusT => state.attendance.attendances.status;
export const selectAttendancesError = (state: RootState): string | null => state.attendance.attendances.error;

export const attendanceReducer = attendanceSlice.reducer;
export default attendanceSlice.reducer;
