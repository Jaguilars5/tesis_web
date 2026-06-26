import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@shared/redux/hooks";
import { toRejectValue } from "@shared/utils/validationErrors";
import type { SoftDeleteResponseT } from "@shared/types/soft-delete.types";
import { evaluationBlockService } from "../evaluation-blocks.service";
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
} from "../evaluation-blocks.slice";
import type {
  EvaluationBlockListParamsT,
  EvaluationBlockCreateParamsT,
  EvaluationBlockT,
  EvaluationBlockUpdateParamsT,
  EvaluationBlockDeleteParamsT,
} from "../evaluation-blocks.types";

export const useEvaluationBlockController = () => {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectItems);
  const status = useAppSelector(selectStatus);
  const error = useAppSelector(selectError);

  const loadItems = useCallback(
    async (params?: EvaluationBlockListParamsT) => {
      dispatch(loadPending());
      try {
        const result = await evaluationBlockService.list(
          params ?? { page: 1, pageSize: 100 },
        );
        dispatch(loadSuccess(result));
      } catch (err) {
        dispatch(loadError(
          err instanceof Error ? err.message : "Error al cargar bloques",
        ));
      }
    },
    [dispatch],
  );

  const createItem = useCallback(
    async (params: EvaluationBlockCreateParamsT): Promise<EvaluationBlockT> => {
      try {
        const created = await evaluationBlockService.create(params);
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
    async (params: EvaluationBlockUpdateParamsT): Promise<EvaluationBlockT> => {
      try {
        const updated = await evaluationBlockService.update(params);
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
    async (params: EvaluationBlockDeleteParamsT): Promise<SoftDeleteResponseT> => {
      try {
        const response = await evaluationBlockService.softDelete(params);
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
    isLoading: status === "loading",
    error,
    loadItems,
    createItem,
    updateItem,
    deleteItem,
  };
};

export type EvaluationBlockControllerT = ReturnType<typeof useEvaluationBlockController>;
