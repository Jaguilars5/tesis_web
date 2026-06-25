import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { RootState } from "@shared/redux/store";
import type { RequestStatusT } from "@shared/types/request.types";
import type { ClassScheduleT } from "./class-schedule.types";

export interface ClassScheduleStateT {
  classSchedules: ClassScheduleT[];
  status: RequestStatusT;
  error: string | null;
}

const initialState: ClassScheduleStateT = {
  classSchedules: [],
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
    loadSuccess(state, action: PayloadAction<ClassScheduleT[]>) {
      state.classSchedules = action.payload;
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
  clearClassScheduleError,
} = classScheduleSlice.actions;

export const selectClassSchedules = (state: RootState): ClassScheduleT[] =>
  state.academic.classSchedules.classSchedules;

export const selectClassSchedulesStatus = (state: RootState): RequestStatusT =>
  state.academic.classSchedules.status;

export const selectClassScheduleError = (state: RootState): string | null =>
  state.academic.classSchedules.error;

export const classScheduleReducer = classScheduleSlice.reducer;

export default classScheduleSlice.reducer;
