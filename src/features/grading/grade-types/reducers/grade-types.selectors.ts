import type { RootState } from "@shared/redux/store";
import type { GradeTypeT } from "../domain/entities/grade-types.types";

export const selectGradeTypes = (state: RootState): GradeTypeT[] =>
  state.grading.gradeTypes.gradeTypes;

export const selectGradeTypesStatus = (state: RootState) =>
  state.grading.gradeTypes.status;

export const selectGradeTypesError = (state: RootState) =>
  state.grading.gradeTypes.error;
