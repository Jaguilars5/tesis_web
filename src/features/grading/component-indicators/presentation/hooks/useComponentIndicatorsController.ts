import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@shared/redux/hooks";
import {
  selectComponentIndicatorsError,
  selectComponentIndicators,
  selectComponentIndicatorsStatus,
} from "../../reducers/component-indicators.selectors";
import {
  createComponentIndicator,
  deleteComponentIndicator,
  fetchComponentIndicator,
  fetchComponentIndicators,
  updateComponentIndicator,
} from "../../reducers/component-indicators.thunks";
import type { ComponentIndicatorListParamsT } from "../../domain/repositories/component-indicators.repository";

export const useComponentIndicatorsController = () => {
  const dispatch = useAppDispatch();
  const componentIndicators = useAppSelector(selectComponentIndicators);
  const status = useAppSelector(selectComponentIndicatorsStatus);
  const error = useAppSelector(selectComponentIndicatorsError);

  const loadComponentIndicators = useCallback(
    (params?: ComponentIndicatorListParamsT) => {
      return dispatch(fetchComponentIndicators(params ?? { page: 1, pageSize: 100 }));
    },
    [dispatch],
  );

  const getComponentIndicator = useCallback(
    (id: number) => {
      return dispatch(fetchComponentIndicator(id)).unwrap();
    },
    [dispatch],
  );

  const create = useCallback(
    (data: Omit<Parameters<typeof createComponentIndicator>[0], "id" | "block_component_name">) => {
      return dispatch(createComponentIndicator(data));
    },
    [dispatch],
  );

  const update = useCallback(
    (data: Partial<Parameters<typeof updateComponentIndicator>[0]> & { id: number }) => {
      return dispatch(updateComponentIndicator(data));
    },
    [dispatch],
  );

  const remove = useCallback(
    (id: number) => {
      return dispatch(deleteComponentIndicator(id));
    },
    [dispatch],
  );

  return {
    componentIndicators,
    isLoading: status === "loading",
    error,
    loadComponentIndicators,
    getComponentIndicator,
    createComponentIndicator: create,
    updateComponentIndicator: update,
    deleteComponentIndicator: remove,
  };
};
