import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@shared/redux/hooks";
import { toRejectValue } from "@shared/utils/validationErrors";
import type { SoftDeleteResponseT } from "@shared/types/soft-delete.types";
import { activityTypeService } from "../activity-types.service";
import {
  loadPending,
  loadSuccess,
  loadError,
  entityCreated,
  entityUpdated,
  entityDeleted,
  mutationError,
  selectItems,
  selectTotalCount,
  selectStatus,
  selectError,
} from "../activity-types.slice";
import type {
  ActivityTypeListParamsT,
  ActivityTypeCreateParamsT,
  ActivityTypeT,
  ActivityTypeUpdateParamsT,
  ActivityTypeDeleteParamsT,
} from "../activity-types.types";

export const useActivityTypesController = () => {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectItems);
  const totalCount = useAppSelector(selectTotalCount);
  const status = useAppSelector(selectStatus);
  const error = useAppSelector(selectError);

  const loadItems = useCallback(
    async (params?: ActivityTypeListParamsT) => {
      dispatch(loadPending());
      try {
        const result = await activityTypeService.list(
          params ?? { page: 1, pageSize: 100 },
        );
        dispatch(loadSuccess({ items: result.items, count: result.count }));
      } catch (err) {
        dispatch(
          loadError(
            err instanceof Error ? err.message : "Error al cargar tipos de actividad",
          ),
        );
      }
    },
    [dispatch],
  );

  const createItem = useCallback(
    async (params: ActivityTypeCreateParamsT): Promise<ActivityTypeT> => {
      try {
        const created = await activityTypeService.create(params);
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
    async (params: ActivityTypeUpdateParamsT): Promise<ActivityTypeT> => {
      try {
        const updated = await activityTypeService.update(params);
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
    async (params: ActivityTypeDeleteParamsT): Promise<SoftDeleteResponseT> => {
      try {
        const response = await activityTypeService.softDelete(params);
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

export type ActivityTypesControllerT = ReturnType<typeof useActivityTypesController>;
