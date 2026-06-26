import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@shared/redux/store";
import type { RequestStatusT } from "@shared/types/request.types";
import type { AbsenceTypeT } from "./absence-type.types";

export interface AbsenceTypeStateT {
  items: AbsenceTypeT[];
  status: RequestStatusT;
  error: string | null;
}

const initialState: AbsenceTypeStateT = {
  items: [],
  status: "idle",
  error: null,
};

const absenceTypeSlice = createSlice({
  name: "absenceTypes",
  initialState,
  reducers: {
    loadPending(state) { state.status = "loading"; state.error = null; },
    loadSuccess(state, action: PayloadAction<AbsenceTypeT[]>) { state.items = action.payload; state.status = "succeeded"; },
    loadError(state, action: PayloadAction<string>) { state.status = "failed"; state.error = action.payload; },
    entityCreated(state, action: PayloadAction<AbsenceTypeT>) { state.items.unshift(action.payload); state.status = "succeeded"; },
    entityUpdated(state, action: PayloadAction<AbsenceTypeT>) {
      const idx = state.items.findIndex((p) => p.id === action.payload.id);
      if (idx !== -1) state.items[idx] = action.payload;
      state.status = "succeeded";
    },
    entityDeleted(state, action: PayloadAction<number>) {
      state.items = state.items.filter((p) => p.id !== action.payload);
      state.status = "succeeded";
    },
    mutationError(state, action: PayloadAction<string>) { state.status = "failed"; state.error = action.payload; },
    clearAbsenceTypeError(state) { state.error = null; },
  },
});

export const {
  loadPending, loadSuccess, loadError,
  entityCreated, entityUpdated, entityDeleted,
  mutationError, clearAbsenceTypeError,
} = absenceTypeSlice.actions;

export const selectItems = (state: RootState): AbsenceTypeT[] => state.attendance.absenceTypes.items;
export const selectStatus = (state: RootState): RequestStatusT => state.attendance.absenceTypes.status;
export const selectError = (state: RootState): string | null => state.attendance.absenceTypes.error;

export const absenceTypeReducer = absenceTypeSlice.reducer;
export default absenceTypeSlice.reducer;
