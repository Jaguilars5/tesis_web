import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@shared/redux/store";
import type { RequestStatusT } from "@shared/types/request.types";
import type { EvaluativeActivityT } from "./evaluative-activities.types";

export interface EvaluativeActivityStateT {
  items: EvaluativeActivityT[];
  status: RequestStatusT;
  error: string | null;
}

const initialState: EvaluativeActivityStateT = {
  items: [],
  status: "idle",
  error: null,
};

const evaluativeActivitySlice = createSlice({
  name: "evaluativeActivities",
  initialState,
  reducers: {
    loadPending(state) { state.status = "loading"; state.error = null; },
    loadSuccess(state, action: PayloadAction<EvaluativeActivityT[]>) { state.items = action.payload; state.status = "succeeded"; },
    loadError(state, action: PayloadAction<string>) { state.status = "failed"; state.error = action.payload; },
    entityCreated(state, action: PayloadAction<EvaluativeActivityT>) { state.items.unshift(action.payload); state.status = "succeeded"; },
    entityUpdated(state, action: PayloadAction<EvaluativeActivityT>) {
      const idx = state.items.findIndex((p) => p.id === action.payload.id);
      if (idx !== -1) state.items[idx] = action.payload;
      state.status = "succeeded";
    },
    entityDeleted(state, action: PayloadAction<number>) {
      state.items = state.items.filter((p) => p.id !== action.payload);
      state.status = "succeeded";
    },
    mutationError(state, action: PayloadAction<string>) { state.status = "failed"; state.error = action.payload; },
    clearEvaluativeActivityError(state) { state.error = null; },
  },
});

export const {
  loadPending, loadSuccess, loadError,
  entityCreated, entityUpdated, entityDeleted,
  mutationError, clearEvaluativeActivityError,
} = evaluativeActivitySlice.actions;

export const selectItems = (state: RootState): EvaluativeActivityT[] => state.grading.evaluativeActivities.items;
export const selectStatus = (state: RootState): RequestStatusT => state.grading.evaluativeActivities.status;
export const selectError = (state: RootState): string | null => state.grading.evaluativeActivities.error;

export const evaluativeActivityReducer = evaluativeActivitySlice.reducer;
export default evaluativeActivitySlice.reducer;
