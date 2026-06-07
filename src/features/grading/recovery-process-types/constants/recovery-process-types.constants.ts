export const RECOVERY_PROCESS_TYPES_THUNK_PREFIX = "grading";
export const RECOVERY_PROCESS_TYPES_ENDPOINTS = { LIST: "/api/grading/recovery-process-types/" } as const;
export const RECOVERY_PROCESS_TYPES_THUNKS = {
  FETCH: `${RECOVERY_PROCESS_TYPES_THUNK_PREFIX}/fetchRecoveryProcessTypes`,
  GET: `${RECOVERY_PROCESS_TYPES_THUNK_PREFIX}/fetchRecoveryProcessType`,
  CREATE: `${RECOVERY_PROCESS_TYPES_THUNK_PREFIX}/createRecoveryProcessType`,
  UPDATE: `${RECOVERY_PROCESS_TYPES_THUNK_PREFIX}/updateRecoveryProcessType`,
  DELETE: `${RECOVERY_PROCESS_TYPES_THUNK_PREFIX}/deleteRecoveryProcessType`,
};
