import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@shared/redux/hooks";
import {
  selectEvaluationBlocks,
  selectEvaluationBlocksError,
  selectEvaluationBlocksStatus,
} from "../../reducers/evaluation-blocks.selectors";
import {
  createEvaluationBlock,
  deleteEvaluationBlock,
  fetchEvaluationBlocks,
  updateEvaluationBlock,
} from "../../reducers/evaluation-blocks.reducer";
import type { EvaluationBlockT } from "../../domain/entities/evaluation-block.types";

export const useEvaluationBlockController = () => {
  const dispatch = useAppDispatch();
  const evaluationBlocks = useAppSelector(selectEvaluationBlocks);
  const status = useAppSelector(selectEvaluationBlocksStatus);
  const error = useAppSelector(selectEvaluationBlocksError);

  const loadEvaluationBlocks = useCallback(
    () => dispatch(fetchEvaluationBlocks()),
    [dispatch],
  );

  const create = useCallback(
    (data: Omit<EvaluationBlockT, "id" | "is_active" | "academic_period_name">) =>
      dispatch(createEvaluationBlock(data)),
    [dispatch],
  );

  const update = useCallback(
    (id: number, data: Partial<EvaluationBlockT>) =>
      dispatch(updateEvaluationBlock({ id, data })),
    [dispatch],
  );

  const remove = useCallback(
    (id: number) => dispatch(deleteEvaluationBlock(id)),
    [dispatch],
  );

  return {
    evaluationBlocks,
    isLoading: status === "loading",
    error,
    loadEvaluationBlocks,
    createEvaluationBlock: create,
    updateEvaluationBlock: update,
    deleteEvaluationBlock: remove,
  };
};
