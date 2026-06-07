import type { RootState } from "@shared/redux/store";
import type { RecoveryProcessT } from "../domain/entities/recovery-processes.types";

export const selectRecoveryProcesses = (state: RootState): RecoveryProcessT[] =>
  state.grading.recoveryProcesses.recoveryProcesses;

export const selectRecoveryProcessesStatus = (state: RootState) =>
  state.grading.recoveryProcesses.status;

export const selectRecoveryProcessesError = (state: RootState) =>
  state.grading.recoveryProcesses.error;
