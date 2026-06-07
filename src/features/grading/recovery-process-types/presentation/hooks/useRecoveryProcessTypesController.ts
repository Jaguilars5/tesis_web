import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@shared/redux/hooks";
import {
  selectRecoveryProcessTypesError,
  selectRecoveryProcessTypes,
  selectRecoveryProcessTypesStatus,
} from "../../reducers/recovery-process-types.selectors";
import {
  createRecoveryProcessType,
  deleteRecoveryProcessType,
  fetchRecoveryProcessType,
  fetchRecoveryProcessTypes,
  updateRecoveryProcessType,
} from "../../reducers/recovery-process-types.thunks";
import type { RecoveryProcessTypeListParamsT } from "../../domain/repositories/recovery-process-types.repository";

export const useRecoveryProcessTypesController = () => {
  const dispatch = useAppDispatch();
  const recoveryProcessTypes = useAppSelector(selectRecoveryProcessTypes);
  const status = useAppSelector(selectRecoveryProcessTypesStatus);
  const error = useAppSelector(selectRecoveryProcessTypesError);

  const loadRecoveryProcessTypes = useCallback(
    (params?: RecoveryProcessTypeListParamsT) => {
      return dispatch(fetchRecoveryProcessTypes(params ?? { page: 1, pageSize: 100 }));
    },
    [dispatch],
  );

  const getRecoveryProcessType = useCallback(
    (id: number) => {
      return dispatch(fetchRecoveryProcessType(id)).unwrap();
    },
    [dispatch],
  );

  const create = useCallback(
    (data: Omit<Parameters<typeof createRecoveryProcessType>[0], "id" | "is_active" | "created_at" | "updated_at">) => {
      return dispatch(createRecoveryProcessType(data));
    },
    [dispatch],
  );

  const update = useCallback(
    (data: Partial<Parameters<typeof updateRecoveryProcessType>[0]> & { id: number }) => {
      return dispatch(updateRecoveryProcessType(data));
    },
    [dispatch],
  );

  const remove = useCallback(
    (id: number) => {
      return dispatch(deleteRecoveryProcessType(id));
    },
    [dispatch],
  );

  return {
    recoveryProcessTypes,
    isLoading: status === "loading",
    error,
    loadRecoveryProcessTypes,
    getRecoveryProcessType,
    createRecoveryProcessType: create,
    updateRecoveryProcessType: update,
    deleteRecoveryProcessType: remove,
  };
};
