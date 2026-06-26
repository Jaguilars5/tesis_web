import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@shared/redux/hooks";
import { toRejectValue } from "@shared/utils/validationErrors";
import type { SoftDeleteResponseT } from "@shared/types/soft-delete.types";
import { severityService } from "../severity.service";
import {
  loadPending,
  loadSuccess,
  loadError,
  entityCreated,
  entityUpdated,
  entityDeleted,
  mutationError,
  selectItems,
  selectStatus,
  selectError,
} from "../severity.slice";
import type {
  SeverityListParamsT,
  SeverityCreateParamsT,
  SeverityT,
  SeverityUpdateParamsT,
  SeverityDeleteParamsT,
} from "../severity.types";

export const useSeverityController = () => {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectItems);
  const status = useAppSelector(selectStatus);
  const error = useAppSelector(selectError);

  const loadItems = useCallback(
    async (params?: SeverityListParamsT) => {
      dispatch(loadPending());
      try {
        const result = await severityService.list(
          params ?? { page: 1, pageSize: 100 },
        );
        dispatch(loadSuccess(result));
      } catch (err) {
        dispatch(
          loadError(
            err instanceof Error ? err.message : "Error al cargar severidades",
          ),
        );
      }
    },
    [dispatch],
  );

  const createItem = useCallback(
    async (params: SeverityCreateParamsT): Promise<SeverityT> => {
      try {
        const created = await severityService.create(params);
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

  const updateItem = useCallback(
    async (params: SeverityUpdateParamsT): Promise<SeverityT> => {
      try {
        const updated = await severityService.update(params);
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

  const deleteItem = useCallback(
    async (params: SeverityDeleteParamsT): Promise<SoftDeleteResponseT> => {
      try {
        const response = await severityService.softDelete(params);
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

  return {
    items,
    isLoading: status === "loading",
    error,
    loadItems,
    createItem,
    updateItem,
    deleteItem,
  };
};

export type SeverityControllerT = ReturnType<typeof useSeverityController>;
