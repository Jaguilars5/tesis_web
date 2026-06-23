import { useAppDispatch, useAppSelector } from "@shared/redux/hooks"; import { useCallback } from "react"; import { gradeHistoryService } from "./grade-history.service"; import { loadPending, loadSuccess, loadError, itemLoaded, mutationError, selectGradeHistory, selectGradeHistoryStatus, selectGradeHistoryError } from "./grade-history.slice"; import type { GradeChangeHistoryListParamsT } from "./grade-history.types";
export const useGradeHistoryController = () => {
  const dispatch = useAppDispatch(); const gradeHistoryItems = useAppSelector(selectGradeHistory); const status = useAppSelector(selectGradeHistoryStatus); const error = useAppSelector(selectGradeHistoryError);
  const loadGradeHistory = useCallback(async (p?: GradeChangeHistoryListParamsT) => { dispatch(loadPending()); try { const items = await gradeHistoryService.list(p ?? { page: 1, pageSize: 100 }); dispatch(loadSuccess(items)); } catch (err) { dispatch(loadError(err instanceof Error ? err.message : "Error")); } }, [dispatch]);
  const getGradeHistoryItem = useCallback(async (id: number) => { try { const item = await gradeHistoryService.get(id); dispatch(itemLoaded(item)); return item; } catch (err) { dispatch(mutationError(err instanceof Error ? err.message : "Error")); throw err; } }, [dispatch]);
  return { gradeHistoryItems, isLoading: status === "loading", error, loadGradeHistory, getGradeHistoryItem };
};
