import type { RootState } from "@shared/redux/store";
import type { EvaluationTypeT } from "../domain/entities/evaluation-types.types";

export const selectEvaluationTypes = (state: RootState): EvaluationTypeT[] =>
  state.grading.evaluationTypes.evaluationTypes;

export const selectEvaluationTypesStatus = (state: RootState) =>
  state.grading.evaluationTypes.status;

export const selectEvaluationTypesError = (state: RootState) =>
  state.grading.evaluationTypes.error;
