import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@shared/redux/hooks";
import {
  selectEvaluationTypesError,
  selectEvaluationTypes,
  selectEvaluationTypesStatus,
} from "../../reducers/evaluation-types.selectors";
import {
  createEvaluationType,
  deleteEvaluationType,
  fetchEvaluationType,
  fetchEvaluationTypes,
  updateEvaluationType,
} from "../../reducers/evaluation-types.thunks";
import type { EvaluationTypeListParamsT } from "../../domain/repositories/evaluation-types.repository";

export const useEvaluationTypesController = () => {
  const dispatch = useAppDispatch();
  const evaluationTypes = useAppSelector(selectEvaluationTypes);
  const status = useAppSelector(selectEvaluationTypesStatus);
  const error = useAppSelector(selectEvaluationTypesError);

  const loadEvaluationTypes = useCallback(
    (params?: EvaluationTypeListParamsT) => {
      return dispatch(fetchEvaluationTypes(params ?? { page: 1, pageSize: 100 }));
    },
    [dispatch],
  );

  const getEvaluationType = useCallback(
    (id: number) => {
      return dispatch(fetchEvaluationType(id)).unwrap();
    },
    [dispatch],
  );

  const create = useCallback(
    (data: Omit<Parameters<typeof createEvaluationType>[0], "id" | "is_active" | "created_at" | "updated_at">) => {
      return dispatch(createEvaluationType(data));
    },
    [dispatch],
  );

  const update = useCallback(
    (data: Partial<Parameters<typeof updateEvaluationType>[0]> & { id: number }) => {
      return dispatch(updateEvaluationType(data));
    },
    [dispatch],
  );

  const remove = useCallback(
    (id: number) => {
      return dispatch(deleteEvaluationType(id));
    },
    [dispatch],
  );

  return {
    evaluationTypes,
    isLoading: status === "loading",
    error,
    loadEvaluationTypes,
    getEvaluationType,
    createEvaluationType: create,
    updateEvaluationType: update,
    deleteEvaluationType: remove,
  };
};
