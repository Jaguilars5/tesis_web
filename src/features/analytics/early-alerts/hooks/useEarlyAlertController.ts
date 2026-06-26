import { useCallback } from "react";

import { toRejectValue } from "@shared/utils/validationErrors";
import { useAppDispatch, useAppSelector } from "@shared/redux/hooks";
import type { SoftDeleteResponseT } from "@shared/types/soft-delete.types";

import { earlyAlertService } from "../early-alerts.service";
import {
  entityCreated,
  entityDeleted,
  entityUpdated,
  loadError,
  loadPending,
  loadSuccess,
  mutationError,
  selectError,
  selectItems,
  selectStatus,
} from "../early-alerts.slice";
import type {
  EarlyAlertCreateParamsT,
  EarlyAlertDeleteParamsT,
  EarlyAlertListParamsT,
  EarlyAlertT,
  EarlyAlertUpdateParamsT,
} from "../early-alerts.types";

export const useEarlyAlertController = () => {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectItems);
  const status = useAppSelector(selectStatus);
  const error = useAppSelector(selectError);

  const loadItems = useCallback(async (params?: EarlyAlertListParamsT) => {
    dispatch(loadPending());
    try {
      const items = await earlyAlertService.list(params ?? { page: 1, pageSize: 100 });
      dispatch(loadSuccess(items));
    } catch (err) {
      dispatch(loadError(err instanceof Error ? err.message : "Error al cargar alertas tempranas"));
    }
  }, [dispatch]);

  const create = useCallback(async (data: EarlyAlertCreateParamsT): Promise<EarlyAlertT> => {
    try {
      const created = await earlyAlertService.create(data);
      dispatch(entityCreated(created));
      return created;
    } catch (err) {
      const rv = toRejectValue(err);
      dispatch(mutationError(rv.msg));
      throw rv;
    }
  }, [dispatch]);

  const update = useCallback(async (params: EarlyAlertUpdateParamsT): Promise<EarlyAlertT> => {
    try {
      const updated = await earlyAlertService.update(params);
      dispatch(entityUpdated(updated));
      return updated;
    } catch (err) {
      const rv = toRejectValue(err);
      dispatch(mutationError(rv.msg));
      throw rv;
    }
  }, [dispatch]);

  const remove = useCallback(
    async (params: EarlyAlertDeleteParamsT): Promise<SoftDeleteResponseT> => {
      try {
        const response = await earlyAlertService.softDelete(params);
        if (response.is_active === false) {
          dispatch(entityDeleted(response.id));
        }
        return response;
      } catch (err) {
        const rv = toRejectValue(err);
        dispatch(mutationError(rv.msg));
        throw rv;
      }
    },
    [dispatch],
  );

  const markAttended = useCallback(async (id: number, response_actions: string): Promise<EarlyAlertT> => {
    try {
      const updated = await earlyAlertService.markAttended({ id, response_actions });
      dispatch(entityUpdated(updated));
      return updated;
    } catch (err) {
      dispatch(mutationError(err instanceof Error ? err.message : "Error al marcar como atendida"));
      throw err;
    }
  }, [dispatch]);

  return { items, isLoading: status === "loading", error, loadItems, create, update, remove, markAttended };
};

export type EarlyAlertControllerT = ReturnType<typeof useEarlyAlertController>;
