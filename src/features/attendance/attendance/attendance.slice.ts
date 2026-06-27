import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@shared/redux/store";
import type { RequestStatusT } from "@shared/types/request.types";
import type { AttendanceT } from "./attendance.types";

export interface AttendanceStateT {
  items: AttendanceT[];
  totalCount: number;
  currentAttendance: AttendanceT | null;
  status: RequestStatusT;
  error: string | null;
}

const initialState: AttendanceStateT = {
  items: [],
  totalCount: 0,
  currentAttendance: null,
  status: "idle",
  error: null,
};

const attendanceSlice = createSlice({
  name: "attendances",
  initialState,
  reducers: {
    loadPending(state) { state.status = "loading"; state.error = null; },
    loadSuccess(state, action: PayloadAction<{ items: AttendanceT[]; count: number }>) { state.items = action.payload.items; state.totalCount = action.payload.count; state.status = "succeeded"; },
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
    setTotalCount(state, action: PayloadAction<number>) { state.totalCount = action.payload; },
    clearAttendanceError(state) { state.error = null; },
  },
});

export const {
  loadPending, loadSuccess, loadError,
  currentAttendanceLoaded,
  entityCreated, entityUpdated,
  mutationError, setTotalCount, clearAttendanceError,
} = attendanceSlice.actions;

export const selectItems = (state: RootState): AttendanceT[] => state.attendance.attendances.items;
export const selectTotalCount = (state: RootState): number => state.attendance.attendances.totalCount;
export const selectCurrentAttendance = (state: RootState): AttendanceT | null => state.attendance.attendances.currentAttendance;
export const selectStatus = (state: RootState): RequestStatusT => state.attendance.attendances.status;
export const selectError = (state: RootState): string | null => state.attendance.attendances.error;

export const attendanceReducer = attendanceSlice.reducer;
export default attendanceSlice.reducer;
