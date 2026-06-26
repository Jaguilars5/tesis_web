import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@shared/redux/store";
import type { RequestStatusT } from "@shared/types/request.types";
import type { EvaluationBlockT } from "./evaluation-blocks.types";

export interface EvaluationBlocksStateT {
  items: EvaluationBlockT[];
  status: RequestStatusT;
  error: string | null;
}

const initialState: EvaluationBlocksStateT = {
  items: [],
  status: "idle",
  error: null,
};

const evaluationBlocksSlice = createSlice({
  name: "evaluationBlocks",
  initialState,
  reducers: {
    loadPending(state) { state.status = "loading"; state.error = null; },
    loadSuccess(state, action: PayloadAction<EvaluationBlockT[]>) { state.items = action.payload; state.status = "succeeded"; },
    loadError(state, action: PayloadAction<string>) { state.status = "failed"; state.error = action.payload; },
    entityCreated(state, action: PayloadAction<EvaluationBlockT>) { state.items.unshift(action.payload); state.status = "succeeded"; },
    entityUpdated(state, action: PayloadAction<EvaluationBlockT>) {
      const idx = state.items.findIndex((p) => p.id === action.payload.id);
      if (idx !== -1) state.items[idx] = action.payload;
      state.status = "succeeded";
    },
    entityDeleted(state, action: PayloadAction<number>) {
      state.items = state.items.filter((p) => p.id !== action.payload);
      state.status = "succeeded";
    },
    mutationError(state, action: PayloadAction<string>) { state.status = "failed"; state.error = action.payload; },
    clearEvaluationBlocksError(state) { state.error = null; },
  },
});

export const {
  loadPending, loadSuccess, loadError,
  entityCreated, entityUpdated, entityDeleted,
  mutationError, clearEvaluationBlocksError,
} = evaluationBlocksSlice.actions;

export const selectItems = (state: RootState): EvaluationBlockT[] => state.grading.evaluationBlocks.items;
export const selectStatus = (state: RootState): RequestStatusT => state.grading.evaluationBlocks.status;
export const selectError = (state: RootState): string | null => state.grading.evaluationBlocks.error;

export const evaluationBlocksReducer = evaluationBlocksSlice.reducer;
export default evaluationBlocksSlice.reducer;
