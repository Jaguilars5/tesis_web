import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@shared/redux/hooks";
import {
  selectActivityTypesError,
  selectActivityTypes,
  selectActivityTypesStatus,
} from "../../reducers/activity-types.selectors";
import {
  createActivityType,
  deleteActivityType,
  fetchActivityType,
  fetchActivityTypes,
  updateActivityType,
} from "../../reducers/activity-types.thunks";
import type { ActivityTypeListParamsT } from "../../domain/repositories/activity-types.repository";

export const useActivityTypesController = () => {
  const dispatch = useAppDispatch();
  const activityTypes = useAppSelector(selectActivityTypes);
  const status = useAppSelector(selectActivityTypesStatus);
  const error = useAppSelector(selectActivityTypesError);

  const loadActivityTypes = useCallback(
    (params?: ActivityTypeListParamsT) => {
      return dispatch(fetchActivityTypes(params ?? { page: 1, pageSize: 100 }));
    },
    [dispatch],
  );

  const getActivityType = useCallback(
    (id: number) => {
      return dispatch(fetchActivityType(id)).unwrap();
    },
    [dispatch],
  );

  const create = useCallback(
    (data: Omit<Parameters<typeof createActivityType>[0], "id" | "is_active" | "created_at" | "updated_at">) => {
      return dispatch(createActivityType(data));
    },
    [dispatch],
  );

  const update = useCallback(
    (data: Partial<Parameters<typeof updateActivityType>[0]> & { id: number }) => {
      return dispatch(updateActivityType(data));
    },
    [dispatch],
  );

  const remove = useCallback(
    (id: number) => {
      return dispatch(deleteActivityType(id));
    },
    [dispatch],
  );

  return {
    activityTypes,
    isLoading: status === "loading",
    error,
    loadActivityTypes,
    getActivityType,
    createActivityType: create,
    updateActivityType: update,
    deleteActivityType: remove,
  };
};
