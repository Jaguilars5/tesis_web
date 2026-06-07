import type { RootState } from "@shared/redux/store";
import type { QualitativeScaleT } from "../domain/entities/qualitative-scales.types";

export const selectQualitativeScales = (state: RootState): QualitativeScaleT[] =>
  state.grading.qualitativeScales.qualitativeScales;

export const selectQualitativeScalesStatus = (state: RootState) =>
  state.grading.qualitativeScales.status;

export const selectQualitativeScalesError = (state: RootState) =>
  state.grading.qualitativeScales.error;
