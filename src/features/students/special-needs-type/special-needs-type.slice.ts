import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { RootState } from "@shared/redux/store";
import type { RequestStatusT } from "@shared/types/request.types";
import type { SpecialNeedsTypeT } from "./special-needs-type.types";

export interface SpecialNeedsTypeStateT {
  items: SpecialNeedsTypeT[];
  status: RequestStatusT;
  error: string | null;
}

const initialState: SpecialNeedsTypeStateT = {
  items: [],
  status: "idle",
  error: null,
};

const slice = createSlice({
  name: "specialNeedsTypes",
  initialState,
  reducers: {
    loadPending(s) { s.status = "loading"; s.error = null; },
    loadSuccess(s, a: PayloadAction<SpecialNeedsTypeT[]>) { s.items = a.payload; s.status = "succeeded"; },
    loadError(s, a: PayloadAction<string>) { s.status = "failed"; s.error = a.payload; },
    mutationError(s, a: PayloadAction<string>) { s.status = "failed"; s.error = a.payload; },
    clearError(s) { s.error = null; },
  },
});

export const { loadPending, loadSuccess, loadError, mutationError, clearError } = slice.actions;

export const selectSpecialNeedsTypes = (s: RootState): SpecialNeedsTypeT[] => s.students.specialNeedsTypes.items;
export const selectSpecialNeedsTypesStatus = (s: RootState): RequestStatusT => s.students.specialNeedsTypes.status;
export const selectSpecialNeedsTypesError = (s: RootState): string | null => s.students.specialNeedsTypes.error;

export const specialNeedsTypeReducer = slice.reducer;
export default slice.reducer;
