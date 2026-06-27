import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@shared/redux/hooks";
import { toRejectValue } from "@shared/utils/validationErrors";
import type { SoftDeleteResponseT } from "@shared/types/soft-delete.types";
import { incidentTypeService } from "../incident-type.service";
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
  selectTotalCount,
} from "../incident-type.slice";
import type {
  IncidentTypeListParamsT,
  IncidentTypeCreateParamsT,
  IncidentTypeT,
  IncidentTypeUpdateParamsT,
  IncidentTypeDeleteParamsT,
} from "../incident-type.types";

export const useIncidentTypeController = () => {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectItems);
  const status = useAppSelector(selectStatus);
  const error = useAppSelector(selectError);
  const totalCount = useAppSelector(selectTotalCount);

  const loadItems = useCallback(
    async (params?: IncidentTypeListParamsT) => {
      dispatch(loadPending());
      try {
        const result = await incidentTypeService.list(
          params ?? { page: 1, pageSize: 100 },
        );
        dispatch(loadSuccess({ items: result.items, count: result.count }));
      } catch (err) {
        dispatch(
          loadError(
            err instanceof Error ? err.message : "Error al cargar tipos de incidente",
          ),
        );
      }
    },
    [dispatch],
  );

  const createItem = useCallback(
    async (params: IncidentTypeCreateParamsT): Promise<IncidentTypeT> => {
      try {
        const created = await incidentTypeService.create(params);
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
    async (params: IncidentTypeUpdateParamsT): Promise<IncidentTypeT> => {
      try {
        const updated = await incidentTypeService.update(params);
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
    async (params: IncidentTypeDeleteParamsT): Promise<SoftDeleteResponseT> => {
      try {
        const response = await incidentTypeService.softDelete(params);
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
    totalCount,
    isLoading: status === "loading",
    error,
    loadItems,
    createItem,
    updateItem,
    deleteItem,
  };
};

export type IncidentTypeControllerT = ReturnType<typeof useIncidentTypeController>;
