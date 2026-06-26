import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@shared/redux/store";
import type { RequestStatusT } from "@shared/types/request.types";
import type { QualitativeScaleT } from "./qualitative-scales.types";

export interface QualitativeScalesStateT {
  qualitativeScales: QualitativeScaleT[];
  status: RequestStatusT;
  error: string | null;
}

const initialState: QualitativeScalesStateT = {
  qualitativeScales: [],
  status: "idle",
  error: null,
};

const qualitativeScalesSlice = createSlice({
  name: "qualitativeScales",
  initialState,
  reducers: {
    loadPending(state) {
      state.status = "loading";
      state.error = null;
    },
    loadSuccess(state, action: PayloadAction<QualitativeScaleT[]>) {
      state.qualitativeScales = action.payload;
      state.status = "succeeded";
    },
    loadError(state, action: PayloadAction<string>) {
      state.status = "failed";
      state.error = action.payload;
    },
    entityCreated(state, action: PayloadAction<QualitativeScaleT>) {
      state.qualitativeScales.unshift(action.payload);
      state.status = "succeeded";
    },
    entityUpdated(state, action: PayloadAction<QualitativeScaleT>) {
      const index = state.qualitativeScales.findIndex(
        (item) => item.id === action.payload.id,
      );
      if (index !== -1) state.qualitativeScales[index] = action.payload;
      state.status = "succeeded";
    },
    entityDeleted(state, action: PayloadAction<number>) {
      state.qualitativeScales = state.qualitativeScales.filter(
        (item) => item.id !== action.payload,
      );
      state.status = "succeeded";
    },
    mutationError(state, action: PayloadAction<string>) {
      state.status = "failed";
      state.error = action.payload;
    },
    clearQualitativeScalesError(state) {
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
  clearQualitativeScalesError,
} = qualitativeScalesSlice.actions;

export const selectQualitativeScales = (state: RootState): QualitativeScaleT[] =>
  state.grading.qualitativeScales.qualitativeScales;

export const selectQualitativeScalesStatus = (state: RootState): RequestStatusT =>
  state.grading.qualitativeScales.status;

export const selectQualitativeScalesError = (state: RootState): string | null =>
  state.grading.qualitativeScales.error;

export const qualitativeScalesReducer = qualitativeScalesSlice.reducer;
export default qualitativeScalesSlice.reducer;
