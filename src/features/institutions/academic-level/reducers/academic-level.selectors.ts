import type { RootState } from "@shared/redux/store";
import type { AcademicLevelT } from "../domain/entities/academic-level.types";

export const selectAcademicLevels = (state: RootState): AcademicLevelT[] =>
  state.institutions.academicLevel.academicLevels;

export const selectAcademicLevelsStatus = (state: RootState) =>
  state.institutions.academicLevel.status;

export const selectAcademicLevelError = (state: RootState) =>
  state.institutions.academicLevel.error;
