import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@shared/redux/store";
import type { RequestStatusT } from "@shared/types/request.types";
import type { AttendanceT } from "./attendance.types";

export interface AttendanceStateT {
  items: AttendanceT[];
  currentAttendance: AttendanceT | null;
  status: RequestStatusT;
  error: string | null;
}

const initialState: AttendanceStateT = {
  items: [],
  currentAttendance: null,
  status: "idle",
  error: null,
};

const attendanceSlice = createSlice({
  name: "attendances",
  initialState,
  reducers: {
    loadPending(state) { state.status = "loading"; state.error = null; },
    loadSuccess(state, action: PayloadAction<AttendanceT[]>) { state.items = action.payload; state.status = "succeeded"; },
    loadError(state, action: PayloadAction<string>) { state.status = "failed"; state.error = action.payload; },
    currentAttendanceLoaded(state, action: PayloadAction<AttendanceT>) { state.currentAttendance = action.payload; state.status = "succeeded"; },
    entityCreated(state, action: PayloadAction<AttendanceT>) { state.items.unshift(action.payload); state.status = "succeeded"; },
    entityUpdated(state, action: PayloadAction<AttendanceT>) {
      const idx = state.items.findIndex((s) => s.id === action.payload.id);
      if (idx !== -1) state.items[idx] = action.payload;
      if (state.currentAttendance?.id === action.payload.id) state.currentAttendance = action.payload;
      state.status = "succeeded";
    },
    mutationError(state, action: PayloadAction<string>) { state.status = "failed"; state.error = action.payload; },
    clearAttendanceError(state) { state.error = null; },
  },
});

export const {
  loadPending, loadSuccess, loadError,
  currentAttendanceLoaded,
  entityCreated, entityUpdated,
  mutationError, clearAttendanceError,
} = attendanceSlice.actions;

export const selectItems = (state: RootState): AttendanceT[] => state.attendance.attendances.items;
export const selectCurrentAttendance = (state: RootState): AttendanceT | null => state.attendance.attendances.currentAttendance;
export const selectStatus = (state: RootState): RequestStatusT => state.attendance.attendances.status;
export const selectError = (state: RootState): string | null => state.attendance.attendances.error;

export const attendanceReducer = attendanceSlice.reducer;
export default attendanceSlice.reducer;
