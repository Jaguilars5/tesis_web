import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@shared/redux/store";
import type { RequestStatusT } from "@shared/types/request.types";
import type { BehaviorEvaluationT } from "./behavior-evaluation.types";

export interface BehaviorEvaluationStateT { behaviorEvaluations: BehaviorEvaluationT[]; currentBehaviorEvaluation: BehaviorEvaluationT | null; status: RequestStatusT; error: string | null; }
const initialState: BehaviorEvaluationStateT = { behaviorEvaluations: [], currentBehaviorEvaluation: null, status: "idle", error: null };

const behaviorEvaluationSlice = createSlice({
  name: "behaviorEvaluations", initialState,
  reducers: {
    loadPending(state) { state.status = "loading"; state.error = null; },
    loadSuccess(state, action: PayloadAction<BehaviorEvaluationT[]>) { state.behaviorEvaluations = action.payload; state.status = "succeeded"; },
    loadError(state, action: PayloadAction<string>) { state.status = "failed"; state.error = action.payload; },
    currentEvaluationLoaded(state, action: PayloadAction<BehaviorEvaluationT>) { state.currentBehaviorEvaluation = action.payload; state.status = "succeeded"; },
    evaluationUpdated(state, action: PayloadAction<BehaviorEvaluationT>) {
      const idx = state.behaviorEvaluations.findIndex((e) => e.id === action.payload.id);
      if (idx !== -1) state.behaviorEvaluations[idx] = action.payload;
      if (state.currentBehaviorEvaluation?.id === action.payload.id) state.currentBehaviorEvaluation = action.payload;
      state.status = "succeeded";
    },
    evaluationCalculated(state, action: PayloadAction<BehaviorEvaluationT>) {
      const idx = state.behaviorEvaluations.findIndex((e) => e.id === action.payload.id);
      if (idx !== -1) state.behaviorEvaluations[idx] = action.payload;
      else state.behaviorEvaluations.unshift(action.payload);
      state.currentBehaviorEvaluation = action.payload;
      state.status = "succeeded";
    },
    mutationError(state, action: PayloadAction<string>) { state.status = "failed"; state.error = action.payload; },
    clearError(state) { state.error = null; },
  },
});

export const { loadPending, loadSuccess, loadError, currentEvaluationLoaded, evaluationUpdated, evaluationCalculated, mutationError, clearError } = behaviorEvaluationSlice.actions;
export const selectBehaviorEvaluations = (state: RootState): BehaviorEvaluationT[] => state.behavior.behaviorEvaluations.behaviorEvaluations;
export const selectBehaviorEvaluationStatus = (state: RootState): RequestStatusT => state.behavior.behaviorEvaluations.status;
export const selectBehaviorEvaluationError = (state: RootState): string | null => state.behavior.behaviorEvaluations.error;
export const selectCurrentBehaviorEvaluation = (state: RootState): BehaviorEvaluationT | null => state.behavior.behaviorEvaluations.currentBehaviorEvaluation;
export const behaviorEvaluationReducer = behaviorEvaluationSlice.reducer;
export default behaviorEvaluationSlice.reducer;
