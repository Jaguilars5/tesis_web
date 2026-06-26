import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@shared/redux/hooks";
import { toRejectValue } from "@shared/utils/validationErrors";
import type { SoftDeleteResponseT } from "@shared/types/soft-delete.types";
import { evaluativeActivityService } from "../evaluative-activities.service";
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
} from "../evaluative-activities.slice";
import type {
  EvaluativeActivityListParamsT,
  EvaluativeActivityCreateParamsT,
  EvaluativeActivityT,
  EvaluativeActivityUpdateParamsT,
  EvaluativeActivityDeleteParamsT,
} from "../evaluative-activities.types";

export const useEvaluativeActivityController = () => {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectItems);
  const status = useAppSelector(selectStatus);
  const error = useAppSelector(selectError);

  const loadItems = useCallback(
    async (params?: EvaluativeActivityListParamsT) => {
      dispatch(loadPending());
      try {
        const result = await evaluativeActivityService.list(
          params ?? { page: 1, pageSize: 100 },
        );
        dispatch(loadSuccess(result));
      } catch (err) {
        dispatch(
          loadError(
            err instanceof Error ? err.message : "Error al cargar actividades",
          ),
        );
      }
    },
    [dispatch],
  );

  const createItem = useCallback(
    async (params: EvaluativeActivityCreateParamsT): Promise<EvaluativeActivityT> => {
      try {
        const created = await evaluativeActivityService.create(params);
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
    async (params: EvaluativeActivityUpdateParamsT): Promise<EvaluativeActivityT> => {
      try {
        const updated = await evaluativeActivityService.update(params);
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
    async (params: EvaluativeActivityDeleteParamsT): Promise<SoftDeleteResponseT> => {
      try {
        const response = await evaluativeActivityService.softDelete(params);
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

export type EAControllerT = ReturnType<typeof useEvaluativeActivityController>;
