import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@shared/redux/store";
import type { RequestStatusT } from "@shared/types/request.types";
import type { AbsenceTypeT } from "./absence-type.types";

export interface AbsenceTypeStateT {
  absenceTypes: AbsenceTypeT[];
  status: RequestStatusT;
  error: string | null;
}

const initialState: AbsenceTypeStateT = {
  absenceTypes: [],
  status: "idle",
  error: null,
};

const absenceTypeSlice = createSlice({
  name: "absenceTypes",
  initialState,
  reducers: {
    loadPending(state) { state.status = "loading"; state.error = null; },
    loadSuccess(state, action: PayloadAction<AbsenceTypeT[]>) { state.absenceTypes = action.payload; state.status = "succeeded"; },
    loadError(state, action: PayloadAction<string>) { state.status = "failed"; state.error = action.payload; },
    entityCreated(state, action: PayloadAction<AbsenceTypeT>) { state.absenceTypes.unshift(action.payload); state.status = "succeeded"; },
    entityUpdated(state, action: PayloadAction<AbsenceTypeT>) {
      const idx = state.absenceTypes.findIndex((p) => p.id === action.payload.id);
      if (idx !== -1) state.absenceTypes[idx] = action.payload;
      state.status = "succeeded";
    },
    entityDeleted(state, action: PayloadAction<number>) {
      state.absenceTypes = state.absenceTypes.filter((p) => p.id !== action.payload);
      state.status = "succeeded";
    },
    mutationError(state, action: PayloadAction<string>) { state.status = "failed"; state.error = action.payload; },
    clearError(state) { state.error = null; },
  },
});

export const {
  loadPending, loadSuccess, loadError,
  entityCreated, entityUpdated, entityDeleted,
  mutationError, clearError,
} = absenceTypeSlice.actions;

export const selectAbsenceTypes = (state: RootState): AbsenceTypeT[] => state.attendance.absenceTypes.absenceTypes;
export const selectAbsenceTypesStatus = (state: RootState): RequestStatusT => state.attendance.absenceTypes.status;
export const selectAbsenceTypesError = (state: RootState): string | null => state.attendance.absenceTypes.error;

export const absenceTypeReducer = absenceTypeSlice.reducer;
export default absenceTypeSlice.reducer;
