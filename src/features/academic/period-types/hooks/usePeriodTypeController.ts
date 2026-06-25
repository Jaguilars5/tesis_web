import { useAppDispatch, useAppSelector } from "@shared/redux/hooks";
import { toRejectValue } from "@shared/utils/validationErrors";
import { useCallback } from "react";

import { periodTypeService } from "../period-types.service";
import {
  entityCreated,
  entityDeleted,
  entityUpdated,
  loadError,
  loadPending,
  loadSuccess,
  mutationError,
  selectPeriodTypeError,
  selectPeriodTypes,
  selectPeriodTypesStatus,
} from "../period-types.slice";
import type {
  PeriodTypeCreateParamsT,
  PeriodTypeDeleteParamsT,
  PeriodTypeListParamsT,
  PeriodTypeT,
  PeriodTypeUpdateParamsT,
} from "../period-types.types";

export const usePeriodTypeController = () => {
  const dispatch = useAppDispatch();
  const periodTypes = useAppSelector(selectPeriodTypes);
  const status = useAppSelector(selectPeriodTypesStatus);
  const error = useAppSelector(selectPeriodTypeError);

  const loadPeriodTypes = useCallback(
    async (params?: PeriodTypeListParamsT) => {
      dispatch(loadPending());
      try {
        const items = await periodTypeService.list(
          params ?? { page: 1, pageSize: 100 },
        );
        dispatch(loadSuccess(items));
      } catch (err) {
        dispatch(loadError(err instanceof Error ? err.message : "Error"));
      }
    },
    [dispatch],
  );

  const createPeriodType = useCallback(
    async (params: PeriodTypeCreateParamsT): Promise<PeriodTypeT> => {
      try {
        const created = await periodTypeService.create(params);
        dispatch(entityCreated(created));
        return created;
      } catch (err) {
        const rv = toRejectValue(err);
        dispatch(mutationError(rv.msg));
        throw rv;
      }
    },
    [dispatch],
  );

  const updatePeriodType = useCallback(
    async (params: PeriodTypeUpdateParamsT): Promise<PeriodTypeT> => {
      try {
        const updated = await periodTypeService.update(params);
        dispatch(entityUpdated(updated));
        return updated;
      } catch (err) {
        const rv = toRejectValue(err);
        dispatch(mutationError(rv.msg));
        throw rv;
      }
    },
    [dispatch],
  );

  const deletePeriodType = useCallback(
    async (params: PeriodTypeDeleteParamsT): Promise<void> => {
      try {
        const { id } = await periodTypeService.softDelete(params);
        dispatch(entityDeleted(id));
      } catch (err) {
        dispatch(mutationError(err instanceof Error ? err.message : "Error"));
      }
    },
    [dispatch],
  );

  return {
    periodTypes,
    isLoading: status === "loading",
    error,
    loadPeriodTypes,
    createPeriodType,
    updatePeriodType,
    deletePeriodType,
  };
};

export type PeriodTypeControllerT = ReturnType<typeof usePeriodTypeController>;
