import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@shared/redux/store";
import type { RequestStatusT } from "@shared/types/request.types";
import type { BehaviorEvaluationT } from "./behavior-evaluation.types";

export interface BehaviorEvaluationStateT {
  items: BehaviorEvaluationT[];
  totalCount: number;
  currentBehaviorEvaluation: BehaviorEvaluationT | null;
  status: RequestStatusT;
  error: string | null;
}

const initialState: BehaviorEvaluationStateT = {
  items: [],
  totalCount: 0,
  currentBehaviorEvaluation: null,
  status: "idle",
  error: null,
};

const behaviorEvaluationSlice = createSlice({
  name: "behaviorEvaluations",
  initialState,
  reducers: {
    loadPending(state) { state.status = "loading"; state.error = null; },
    loadSuccess(state, action: PayloadAction<{ items: BehaviorEvaluationT[]; count: number }>) { state.items = action.payload.items; state.totalCount = action.payload.count; state.status = "succeeded"; },
    loadError(state, action: PayloadAction<string>) { state.status = "failed"; state.error = action.payload; },
    currentEvaluationLoaded(state, action: PayloadAction<BehaviorEvaluationT>) { state.currentBehaviorEvaluation = action.payload; state.status = "succeeded"; },
    entityUpdated(state, action: PayloadAction<BehaviorEvaluationT>) {
      const idx = state.items.findIndex((e) => e.id === action.payload.id);
      if (idx !== -1) state.items[idx] = action.payload;
      if (state.currentBehaviorEvaluation?.id === action.payload.id) state.currentBehaviorEvaluation = action.payload;
      state.status = "succeeded";
    },
    evaluationCalculated(state, action: PayloadAction<BehaviorEvaluationT>) {
      const idx = state.items.findIndex((e) => e.id === action.payload.id);
      if (idx !== -1) state.items[idx] = action.payload;
      else state.items.unshift(action.payload);
      state.currentBehaviorEvaluation = action.payload;
      state.status = "succeeded";
    },
    mutationError(state, action: PayloadAction<string>) { state.status = "failed"; state.error = action.payload; },
    setTotalCount(state, action: PayloadAction<number>) { state.totalCount = action.payload; },
    clearBehaviorEvaluationError(state) { state.error = null; },
  },
});

export const {
  loadPending, loadSuccess, loadError,
  currentEvaluationLoaded,
  entityUpdated, evaluationCalculated,
  mutationError, setTotalCount, clearBehaviorEvaluationError,
} = behaviorEvaluationSlice.actions;

export const selectItems = (state: RootState): BehaviorEvaluationT[] => state.behavior.behaviorEvaluations.items;
export const selectTotalCount = (state: RootState): number => state.behavior.behaviorEvaluations.totalCount;
export const selectStatus = (state: RootState): RequestStatusT => state.behavior.behaviorEvaluations.status;
export const selectError = (state: RootState): string | null => state.behavior.behaviorEvaluations.error;
export const selectCurrentBehaviorEvaluation = (state: RootState): BehaviorEvaluationT | null => state.behavior.behaviorEvaluations.currentBehaviorEvaluation;

export const behaviorEvaluationReducer = behaviorEvaluationSlice.reducer;
export default behaviorEvaluationSlice.reducer;
