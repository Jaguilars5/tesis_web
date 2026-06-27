import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { RootState } from "@shared/redux/store";
import type { RequestStatusT } from "@shared/types/request.types";
import type { ClassScheduleT } from "./class-schedule.types";

export interface ClassScheduleStateT {
  classSchedules: ClassScheduleT[];
  totalCount: number;
  status: RequestStatusT;
  error: string | null;
}

const initialState: ClassScheduleStateT = {
  classSchedules: [],
  totalCount: 0,
  status: "idle",
  error: null,
};

const classScheduleSlice = createSlice({
  name: "classSchedules",
  initialState,
  reducers: {
    loadPending(state) {
      state.status = "loading";
      state.error = null;
    },
    loadSuccess(
      state,
      action: PayloadAction<{ items: ClassScheduleT[]; count: number }>,
    ) {
      state.classSchedules = action.payload.items;
      state.totalCount = action.payload.count;
      state.status = "succeeded";
    },
    loadError(state, action: PayloadAction<string>) {
      state.status = "failed";
      state.error = action.payload;
    },
    entityCreated(state, action: PayloadAction<ClassScheduleT>) {
      state.classSchedules.unshift(action.payload);
      state.status = "succeeded";
    },
    entityUpdated(state, action: PayloadAction<ClassScheduleT>) {
      const idx = state.classSchedules.findIndex(
        (schedule) => schedule.id === action.payload.id,
      );
      if (idx !== -1) state.classSchedules[idx] = action.payload;
      state.status = "succeeded";
    },
    entityDeleted(state, action: PayloadAction<number>) {
      state.classSchedules = state.classSchedules.filter(
        (schedule) => schedule.id !== action.payload,
      );
      state.status = "succeeded";
    },
    mutationError(state, action: PayloadAction<string>) {
      state.status = "failed";
      state.error = action.payload;
    },
    setTotalCount(state, action: PayloadAction<number>) {
      state.totalCount = action.payload;
    },
    clearClassScheduleError(state) {
      state.error = null;
    },
  },
});

export const {
  loadPending,
  loadSuccess,
  loadError,
  entityCreated,
  entityUpdated,
  entityDeleted,
  mutationError,
  setTotalCount,
  clearClassScheduleError,
} = classScheduleSlice.actions;

export const selectClassSchedules = (state: RootState): ClassScheduleT[] =>
  state.academic.classSchedules.classSchedules;

export const selectClassSchedulesStatus = (state: RootState): RequestStatusT =>
  state.academic.classSchedules.status;

export const selectClassScheduleError = (state: RootState): string | null =>
  state.academic.classSchedules.error;

export const selectClassScheduleTotalCount = (state: RootState): number =>
  state.academic.classSchedules.totalCount;

export const classScheduleReducer = classScheduleSlice.reducer;

export default classScheduleSlice.reducer;
