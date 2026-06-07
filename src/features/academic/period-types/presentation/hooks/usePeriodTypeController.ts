import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@shared/redux/hooks";
import {
  selectPeriodTypeError,
  selectPeriodTypes,
  selectPeriodTypesStatus,
} from "../../reducers/period-types.selectors";
import {
  createPeriodType,
  deletePeriodType,
  fetchPeriodType,
  fetchPeriodTypes,
  updatePeriodType,
} from "../../reducers/period-types.thunks";
import type { PeriodTypeListParamsT } from "../../domain/repositories/period-types.repository";

export const usePeriodTypeController = () => {
  const dispatch = useAppDispatch();
  const periodTypes = useAppSelector(selectPeriodTypes);
  const status = useAppSelector(selectPeriodTypesStatus);
  const error = useAppSelector(selectPeriodTypeError);

  const loadPeriodTypes = useCallback(
    (params?: PeriodTypeListParamsT) => {
      return dispatch(fetchPeriodTypes(params ?? { page: 1, pageSize: 100 }));
    },
    [dispatch],
  );

  const getPeriodType = useCallback(
    (id: number) => {
      return dispatch(fetchPeriodType(id)).unwrap();
    },
    [dispatch],
  );

  const create = useCallback(
    (data: Omit<Parameters<typeof createPeriodType>[0], "id" | "is_active">) => {
      return dispatch(createPeriodType(data));
    },
    [dispatch],
  );

  const update = useCallback(
    (data: Partial<Parameters<typeof updatePeriodType>[0]> & { id: number }) => {
      return dispatch(updatePeriodType(data));
    },
    [dispatch],
  );

  const remove = useCallback(
    (id: number) => {
      return dispatch(deletePeriodType(id));
    },
    [dispatch],
  );

  return {
    periodTypes,
    isLoading: status === "loading",
    error,
    loadPeriodTypes,
    getPeriodType,
    createPeriodType: create,
    updatePeriodType: update,
    deletePeriodType: remove,
  };
};
