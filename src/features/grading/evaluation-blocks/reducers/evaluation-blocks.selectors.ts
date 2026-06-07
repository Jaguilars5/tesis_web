import type { RootState } from "@shared/redux/store";

export const selectEvaluationBlocks = (state: RootState) => state.grading.evaluationBlocks.evaluationBlocks;
export const selectEvaluationBlocksStatus = (state: RootState) => state.grading.evaluationBlocks.status;
export const selectEvaluationBlocksError = (state: RootState) => state.grading.evaluationBlocks.error;
