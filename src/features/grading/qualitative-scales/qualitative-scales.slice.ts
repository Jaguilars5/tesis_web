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
const slice = createSlice({
  name: "qualitativeScales",
  initialState,
  reducers: {
    loadPending(s) {
      s.status = "loading";
      s.error = null;
    },
    loadSuccess(s, a: PayloadAction<QualitativeScaleT[]>) {
      s.qualitativeScales = a.payload;
      s.status = "succeeded";
    },
    loadError(s, a: PayloadAction<string>) {
      s.status = "failed";
      s.error = a.payload;
    },
    entityCreated(s, a: PayloadAction<QualitativeScaleT>) {
      s.qualitativeScales.unshift(a.payload);
      s.status = "succeeded";
    },
    entityUpdated(s, a: PayloadAction<QualitativeScaleT>) {
      const idx = s.qualitativeScales.findIndex((p) => p.id === a.payload.id);
      if (idx !== -1) s.qualitativeScales[idx] = a.payload;
      s.status = "succeeded";
    },
    entityDeleted(s, a: PayloadAction<number>) {
      s.qualitativeScales = s.qualitativeScales.filter(
        (p) => p.id !== a.payload,
      );
      s.status = "succeeded";
    },
    mutationError(s, a: PayloadAction<string>) {
      s.status = "failed";
      s.error = a.payload;
    },
    clearError(s) {
      s.error = null;
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
  clearError,
} = slice.actions;
export const selectQualitativeScales = (s: RootState): QualitativeScaleT[] =>
  s.grading.qualitativeScales.qualitativeScales;
export const selectQualitativeScalesStatus = (s: RootState): RequestStatusT =>
  s.grading.qualitativeScales.status;
export const selectQualitativeScalesError = (s: RootState): string | null =>
  s.grading.qualitativeScales.error;
export const qualitativeScalesReducer = slice.reducer;
export default slice.reducer;
