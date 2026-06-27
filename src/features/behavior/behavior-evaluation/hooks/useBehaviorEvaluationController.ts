import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@shared/redux/hooks";
import { toRejectValue } from "@shared/utils/validationErrors";
import { behaviorEvaluationService } from "../behavior-evaluation.service";
import {
  loadPending,
  loadSuccess,
  loadError,
  currentEvaluationLoaded,
  entityUpdated,
  evaluationCalculated,
  mutationError,
  selectItems,
  selectTotalCount,
  selectCurrentBehaviorEvaluation,
  selectStatus,
  selectError,
} from "../behavior-evaluation.slice";
import type {
  BehaviorEvaluationCalculateDataT,
  BehaviorEvaluationListParamsT,
  BehaviorEvaluationT,
  BehaviorEvaluationUpdateParamsT,
  BehaviorEvaluationGetParamsT,
} from "../behavior-evaluation.types";

export const useBehaviorEvaluationController = () => {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectItems);
  const totalCount = useAppSelector(selectTotalCount);
  const currentBehaviorEvaluation = useAppSelector(selectCurrentBehaviorEvaluation);
  const status = useAppSelector(selectStatus);
  const error = useAppSelector(selectError);

  const loadItems = useCallback(
    async (params?: BehaviorEvaluationListParamsT) => {
      dispatch(loadPending());
      try {
        const result = await behaviorEvaluationService.list(
          params ?? { page: 1, pageSize: 100 },
        );
        dispatch(loadSuccess({ items: result.items, count: result.count }));
      } catch (err) {
        dispatch(
          loadError(
            err instanceof Error ? err.message : "Error al cargar evaluaciones",
          ),
        );
      }
    },
    [dispatch],
  );

  const loadEvaluation = useCallback(
    async (params: BehaviorEvaluationGetParamsT) => {
      try {
        const item = await behaviorEvaluationService.get(params);
        dispatch(currentEvaluationLoaded(item));
      } catch (err) {
        dispatch(
          loadError(
            err instanceof Error ? err.message : "Error al cargar evaluación",
          ),
        );
      }
    },
    [dispatch],
  );

  const updateItem = useCallback(
    async (params: BehaviorEvaluationUpdateParamsT): Promise<BehaviorEvaluationT> => {
      try {
        const updated = await behaviorEvaluationService.update(params);
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

  const calculate = useCallback(
    async (data: BehaviorEvaluationCalculateDataT): Promise<BehaviorEvaluationT> => {
      try {
        const result = await behaviorEvaluationService.calculate(data);
        dispatch(evaluationCalculated(result));
        return result;
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
    currentBehaviorEvaluation,
    isLoading: status === "loading",
    error,
    loadItems,
    loadEvaluation,
    updateItem,
    calculateItem: calculate,
  };
};

export type BehaviorEvaluationControllerT = ReturnType<typeof useBehaviorEvaluationController>;
