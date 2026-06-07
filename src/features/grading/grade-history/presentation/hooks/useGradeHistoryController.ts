import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@shared/redux/hooks";
import {
  selectGradeHistoryError,
  selectGradeHistory,
  selectGradeHistoryStatus,
} from "../../reducers/grade-history.selectors";
import {
  fetchGradeHistory,
  fetchGradeHistoryItem,
} from "../../reducers/grade-history.thunks";

export const useGradeHistoryController = () => {
  const dispatch = useAppDispatch();
  const gradeHistoryItems = useAppSelector(selectGradeHistory);
  const status = useAppSelector(selectGradeHistoryStatus);
  const error = useAppSelector(selectGradeHistoryError);

  const loadGradeHistory = useCallback(
    (params?: { page?: number; pageSize?: number }) => {
      return dispatch(fetchGradeHistory(params ?? { page: 1, pageSize: 100 }));
    },
    [dispatch],
  );

  const getGradeHistoryItem = useCallback(
    (id: number) => {
      return dispatch(fetchGradeHistoryItem(id)).unwrap();
    },
    [dispatch],
  );

  return {
    gradeHistoryItems,
    isLoading: status === "loading",
    error,
    loadGradeHistory,
    getGradeHistoryItem,
  };
};
