import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@shared/redux/hooks";
import {
  selectRecoveryProcessesError,
  selectRecoveryProcesses,
  selectRecoveryProcessesStatus,
} from "../../reducers/recovery-processes.selectors";
import {
  createRecoveryProcess,
  deleteRecoveryProcess,
  fetchRecoveryProcess,
  fetchRecoveryProcesses,
  updateRecoveryProcess,
} from "../../reducers/recovery-processes.thunks";
import type { RecoveryProcessListParamsT } from "../../domain/repositories/recovery-processes.repository";
import type { RecoveryProcessT } from "../../domain/entities/recovery-processes.types";

export const useRecoveryProcessesController = () => {
  const dispatch = useAppDispatch();
  const recoveryProcesses = useAppSelector(selectRecoveryProcesses);
  const status = useAppSelector(selectRecoveryProcessesStatus);
  const error = useAppSelector(selectRecoveryProcessesError);

  const loadRecoveryProcesses = useCallback(
    (params?: RecoveryProcessListParamsT) => {
      return dispatch(fetchRecoveryProcesses(params ?? { page: 1, pageSize: 100 }));
    },
    [dispatch],
  );

  const getRecoveryProcess = useCallback(
    (id: number) => {
      return dispatch(fetchRecoveryProcess(id)).unwrap();
    },
    [dispatch],
  );

  const create = useCallback(
    (data: Omit<RecoveryProcessT, "id" | "period_grade_summary_name" | "managed_by_user_name">) => {
      return dispatch(createRecoveryProcess(data));
    },
    [dispatch],
  );

  const update = useCallback(
    (data: Partial<RecoveryProcessT> & { id: number }) => {
      return dispatch(updateRecoveryProcess(data));
    },
    [dispatch],
  );

  const remove = useCallback(
    (id: number) => {
      return dispatch(deleteRecoveryProcess(id));
    },
    [dispatch],
  );

  return {
    recoveryProcesses,
    isLoading: status === "loading",
    error,
    loadRecoveryProcesses,
    getRecoveryProcess,
    createRecoveryProcess: create,
    updateRecoveryProcess: update,
    deleteRecoveryProcess: remove,
  };
};
