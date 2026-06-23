import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@shared/redux/store";
import type { RequestStatusT } from "@shared/types/request.types";
import type { StudentFeatureSnapshotT, StudentRiskScoreT } from "./analytics.types";

export interface RiskScoreStateT {
  scores: StudentRiskScoreT[];
  totalCount: number;
  selectedScore: StudentRiskScoreT | null;
  selectedSnapshot: StudentFeatureSnapshotT | null;
  calcTaskId: string | null;
  calcStatus: "idle" | "running" | "done" | "failed";
  completedTaskIds: string[];
  status: RequestStatusT;
  error: string | null;
}

const initialState: RiskScoreStateT = {
  scores: [],
  totalCount: 0,
  selectedScore: null,
  selectedSnapshot: null,
  calcTaskId: null,
  calcStatus: "idle",
  completedTaskIds: [],
  status: "idle",
  error: null,
};

const riskScoreSlice = createSlice({
  name: "riskScores",
  initialState,
  reducers: {
    riskScoresLoadPending(state) {
      state.status = "loading";
      state.error = null;
    },
    riskScoresLoadError(state, action: PayloadAction<string>) {
      state.status = "failed";
      state.error = action.payload;
    },
    riskScoresLoaded(state, action: PayloadAction<{ results: StudentRiskScoreT[]; count: number }>) {
      state.scores = action.payload.results;
      state.totalCount = action.payload.count;
      state.status = "succeeded";
    },
    riskScoreDetailLoaded(state, action: PayloadAction<StudentRiskScoreT>) {
      state.selectedScore = action.payload;
      state.status = "succeeded";
    },
    riskScoreSnapshotLoaded(state, action: PayloadAction<StudentFeatureSnapshotT | null>) {
      state.selectedSnapshot = action.payload;
    },
    calculationStarted(state) {
      state.calcStatus = "running";
      state.error = null;
    },
    calculationFinished(state, action: PayloadAction<{ taskId: string | null }>) {
      state.calcTaskId = action.payload.taskId;
      state.calcStatus = "running";
    },
    calculationNoStudents(state) {
      state.calcStatus = "done";
    },
    calculationFailed(state, action: PayloadAction<string>) {
      state.calcStatus = "failed";
      state.error = action.payload;
    },
    addCompletedTaskId(state, action: PayloadAction<string>) {
      const taskId = action.payload;
      if (!state.completedTaskIds.includes(taskId)) {
        state.completedTaskIds.push(taskId);
        if (state.calcTaskId === taskId && state.calcStatus === "running") {
          state.calcStatus = "done";
        }
      }
    },
    resetCalculationStatus(state) {
      state.calcStatus = "idle";
      state.calcTaskId = null;
    },
    clearRiskScoreError(state) {
      state.error = null;
    },
  },
});

export const {
  riskScoresLoadPending,
  riskScoresLoadError,
  riskScoresLoaded,
  riskScoreDetailLoaded,
  riskScoreSnapshotLoaded,
  calculationStarted,
  calculationFinished,
  calculationNoStudents,
  calculationFailed,
  addCompletedTaskId,
  resetCalculationStatus,
  clearRiskScoreError,
} = riskScoreSlice.actions;

export const selectRiskScores = (state: RootState): StudentRiskScoreT[] =>
  state.analytics.riskScores.scores;

export const selectRiskScoresTotalCount = (state: RootState): number =>
  state.analytics.riskScores.totalCount;

export const selectSelectedRiskScore = (state: RootState): StudentRiskScoreT | null =>
  state.analytics.riskScores.selectedScore;

export const selectSelectedSnapshot = (state: RootState): StudentFeatureSnapshotT | null =>
  state.analytics.riskScores.selectedSnapshot;

export const selectRiskScoresStatus = (state: RootState) =>
  state.analytics.riskScores.status;

export const selectRiskScoresError = (state: RootState): string | null =>
  state.analytics.riskScores.error;

export const selectCalcTaskId = (state: RootState): string | null =>
  state.analytics.riskScores.calcTaskId;

export const selectCalcStatus = (state: RootState): "idle" | "running" | "done" | "failed" =>
  state.analytics.riskScores.calcStatus;

export const selectCompletedTaskIds = (state: RootState): string[] =>
  state.analytics.riskScores.completedTaskIds;

export const riskScoreReducer = riskScoreSlice.reducer;
export default riskScoreSlice.reducer;
