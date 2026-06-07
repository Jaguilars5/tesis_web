import type { RootState } from "@shared/redux/store";
import type { RecoveryProcessTypeT } from "../domain/entities/recovery-process-types.types";

export const selectRecoveryProcessTypes = (state: RootState): RecoveryProcessTypeT[] =>
  state.grading.recoveryProcessTypes.recoveryProcessTypes;

export const selectRecoveryProcessTypesStatus = (state: RootState) =>
  state.grading.recoveryProcessTypes.status;

export const selectRecoveryProcessTypesError = (state: RootState) =>
  state.grading.recoveryProcessTypes.error;
