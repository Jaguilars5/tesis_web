export const RECOVERY_PROCESSES_THUNK_PREFIX = "grading";
export const RECOVERY_PROCESSES_ENDPOINTS = { LIST: "/api/grading/recovery-processes/" } as const;
export const RECOVERY_PROCESSES_THUNKS = {
  FETCH: `${RECOVERY_PROCESSES_THUNK_PREFIX}/fetchRecoveryProcesses`,
  GET: `${RECOVERY_PROCESSES_THUNK_PREFIX}/fetchRecoveryProcess`,
  CREATE: `${RECOVERY_PROCESSES_THUNK_PREFIX}/createRecoveryProcess`,
  UPDATE: `${RECOVERY_PROCESSES_THUNK_PREFIX}/updateRecoveryProcess`,
  DELETE: `${RECOVERY_PROCESSES_THUNK_PREFIX}/deleteRecoveryProcess`,
};
