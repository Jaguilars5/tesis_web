import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@shared/redux/store";
import type { RequestStatusT } from "@shared/types/request.types";
import type { AttendanceStatusT } from "./attendance-status.types";

export interface AttendanceStatusStateT {
  items: AttendanceStatusT[];
  totalCount: number;
  status: RequestStatusT;
  error: string | null;
}

const initialState: AttendanceStatusStateT = {
  items: [],
  totalCount: 0,
  status: "idle",
  error: null,
};

const attendanceStatusSlice = createSlice({
  name: "attendanceStatuses",
  initialState,
  reducers: {
    loadPending(state) { state.status = "loading"; state.error = null; },
    loadSuccess(state, action: PayloadAction<{ items: AttendanceStatusT[]; count: number }>) { state.items = action.payload.items; state.totalCount = action.payload.count; state.status = "succeeded"; },
    loadError(state, action: PayloadAction<string>) { state.status = "failed"; state.error = action.payload; },
    entityCreated(state, action: PayloadAction<AttendanceStatusT>) { state.items.unshift(action.payload); state.status = "succeeded"; },
    entityUpdated(state, action: PayloadAction<AttendanceStatusT>) {
      const idx = state.items.findIndex((p) => p.id === action.payload.id);
      if (idx !== -1) state.items[idx] = action.payload;
      state.status = "succeeded";
    },
    entityDeleted(state, action: PayloadAction<number>) {
      state.items = state.items.filter((p) => p.id !== action.payload);
      state.status = "succeeded";
    },
    mutationError(state, action: PayloadAction<string>) { state.status = "failed"; state.error = action.payload; },
    setTotalCount(state, action: PayloadAction<number>) { state.totalCount = action.payload; },
    clearAttendanceStatusError(state) { state.error = null; },
  },
});

export const {
  loadPending, loadSuccess, loadError,
  entityCreated, entityUpdated, entityDeleted,
  mutationError, setTotalCount, clearAttendanceStatusError,
} = attendanceStatusSlice.actions;

export const selectItems = (state: RootState): AttendanceStatusT[] => state.attendance.attendanceStatuses.items;
export const selectTotalCount = (state: RootState): number => state.attendance.attendanceStatuses.totalCount;
export const selectStatus = (state: RootState): RequestStatusT => state.attendance.attendanceStatuses.status;
export const selectError = (state: RootState): string | null => state.attendance.attendanceStatuses.error;

export const attendanceStatusReducer = attendanceStatusSlice.reducer;
export default attendanceStatusSlice.reducer;
