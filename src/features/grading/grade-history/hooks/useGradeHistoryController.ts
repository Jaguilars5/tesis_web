import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@shared/redux/hooks";
import { gradeHistoryService } from "../grade-history.service";
import {
  loadPending,
  loadSuccess,
  loadError,
  itemLoaded,
  mutationError,
  selectItems,
  selectTotalCount,
  selectStatus,
  selectError,
} from "../grade-history.slice";
import type {
  GradeChangeHistoryListParamsT,
  GradeChangeHistoryGetParamsT,
  GradeChangeHistoryT,
} from "../grade-history.types";

export const useGradeHistoryController = () => {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectItems);
  const totalCount = useAppSelector(selectTotalCount);
  const status = useAppSelector(selectStatus);
  const error = useAppSelector(selectError);

  const loadItems = useCallback(
    async (params?: GradeChangeHistoryListParamsT) => {
      dispatch(loadPending());
      try {
        const result = await gradeHistoryService.list(
          params ?? { page: 1, pageSize: 100 },
        );
        dispatch(loadSuccess({ items: result.items, count: result.count }));
      } catch (err) {
        dispatch(
          loadError(
            err instanceof Error ? err.message : "Error al cargar historial",
          ),
        );
      }
    },
    [dispatch],
  );

  const getItem = useCallback(
    async (params: GradeChangeHistoryGetParamsT): Promise<GradeChangeHistoryT> => {
      try {
        const item = await gradeHistoryService.get(params);
        dispatch(itemLoaded(item));
        return item;
      } catch (err) {
        dispatch(
          mutationError(
            err instanceof Error ? err.message : "Error al cargar registro",
          ),
        );
        throw err;
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
    getItem,
  };
};

export type GradeHistoryControllerT = ReturnType<typeof useGradeHistoryController>;
