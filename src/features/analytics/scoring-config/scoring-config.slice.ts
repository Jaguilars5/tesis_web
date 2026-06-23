import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { RootState } from "@shared/redux/store";
import type { RequestStatusT } from "@shared/types/request.types";

import type { RiskScoringConfigT } from "./scoring-config.types";

export interface ScoringConfigStateT {
  config: RiskScoringConfigT | null;
  status: RequestStatusT;
  error: string | null;
}

const initialState: ScoringConfigStateT = {
  config: null,
  status: "idle",
  error: null,
};

const scoringConfigSlice = createSlice({
  name: "scoringConfig",
  initialState,
  reducers: {
    loadPending(state) {
      state.status = "loading";
      state.error = null;
    },
    loadSuccess(state, action: PayloadAction<RiskScoringConfigT>) {
      state.config = action.payload;
      state.status = "succeeded";
    },
    loadError(state, action: PayloadAction<string>) {
      state.status = "failed";
      state.error = action.payload;
    },
    configSaved(state, action: PayloadAction<RiskScoringConfigT>) {
      state.config = action.payload;
      state.status = "succeeded";
    },
    mutationError(state, action: PayloadAction<string>) {
      state.status = "failed";
      state.error = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
  },
});

export const {
  loadPending,
  loadSuccess,
  loadError,
  configSaved,
  mutationError,
  clearError,
} = scoringConfigSlice.actions;

export const selectScoringConfig = (
  state: RootState,
): RiskScoringConfigT | null => state.analytics.scoringConfig.config;
export const selectScoringConfigStatus = (state: RootState): RequestStatusT =>
  state.analytics.scoringConfig.status;
export const selectScoringConfigError = (state: RootState): string | null =>
  state.analytics.scoringConfig.error;

export const scoringConfigReducer = scoringConfigSlice.reducer;
export default scoringConfigSlice.reducer;
