import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@shared/redux/store";
import type { RequestStatusT } from "@shared/types/request.types";
import type { QualitativeScaleSublevelT } from "./qualitative-scale-sublevels.types";

export interface QualitativeScaleSublevelsStateT {
  qualitativeScaleSublevels: QualitativeScaleSublevelT[];
  status: RequestStatusT;
  error: string | null;
}

const initialState: QualitativeScaleSublevelsStateT = {
  qualitativeScaleSublevels: [],
  status: "idle",
  error: null,
};

const qualitativeScaleSublevelsSlice = createSlice({
  name: "qualitativeScaleSublevels",
  initialState,
  reducers: {
    loadPending(state) {
      state.status = "loading";
      state.error = null;
    },
    loadSuccess(state, action: PayloadAction<QualitativeScaleSublevelT[]>) {
      state.qualitativeScaleSublevels = action.payload;
      state.status = "succeeded";
    },
    loadError(state, action: PayloadAction<string>) {
      state.status = "failed";
      state.error = action.payload;
    },
    entityCreated(state, action: PayloadAction<QualitativeScaleSublevelT>) {
      state.qualitativeScaleSublevels.unshift(action.payload);
      state.status = "succeeded";
    },
    entityUpdated(state, action: PayloadAction<QualitativeScaleSublevelT>) {
      const index = state.qualitativeScaleSublevels.findIndex(
        (item) => item.id === action.payload.id,
      );
      if (index !== -1) state.qualitativeScaleSublevels[index] = action.payload;
      state.status = "succeeded";
    },
    entityDeleted(state, action: PayloadAction<number>) {
      state.qualitativeScaleSublevels = state.qualitativeScaleSublevels.filter(
        (item) => item.id !== action.payload,
      );
      state.status = "succeeded";
    },
    mutationError(state, action: PayloadAction<string>) {
      state.status = "failed";
      state.error = action.payload;
    },
    clearQualitativeScaleSublevelsError(state) {
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
  clearQualitativeScaleSublevelsError,
} = qualitativeScaleSublevelsSlice.actions;

export const selectQualitativeScaleSublevels = (state: RootState): QualitativeScaleSublevelT[] =>
  state.grading.qualitativeScaleSublevels.qualitativeScaleSublevels;

export const selectQualitativeScaleSublevelsStatus = (state: RootState): RequestStatusT =>
  state.grading.qualitativeScaleSublevels.status;

export const selectQualitativeScaleSublevelsError = (state: RootState): string | null =>
  state.grading.qualitativeScaleSublevels.error;

export const qualitativeScaleSublevelReducer = qualitativeScaleSublevelsSlice.reducer;
export default qualitativeScaleSublevelsSlice.reducer;
