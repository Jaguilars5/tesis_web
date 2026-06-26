import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@shared/redux/hooks";
import { toRejectValue } from "@shared/utils/validationErrors";
import type { SoftDeleteResponseT } from "@shared/types/soft-delete.types";
import { blockComponentService } from "../block-components.service";
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
} from "../block-components.slice";
import type {
  BlockComponentListParamsT,
  BlockComponentCreateParamsT,
  BlockComponentT,
  BlockComponentUpdateParamsT,
  BlockComponentDeleteParamsT,
} from "../block-components.types";

export const useBlockComponentsController = () => {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectItems);
  const status = useAppSelector(selectStatus);
  const error = useAppSelector(selectError);

  const loadItems = useCallback(
    async (params?: BlockComponentListParamsT) => {
      dispatch(loadPending());
      try {
        const result = await blockComponentService.list(
          params ?? { page: 1, pageSize: 100 },
        );
        dispatch(loadSuccess(result));
      } catch (err) {
        dispatch(
          loadError(
            err instanceof Error ? err.message : "Error al cargar componentes",
          ),
        );
      }
    },
    [dispatch],
  );

  const createItem = useCallback(
    async (params: BlockComponentCreateParamsT): Promise<BlockComponentT> => {
      try {
        const created = await blockComponentService.create(params);
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
    async (params: BlockComponentUpdateParamsT): Promise<BlockComponentT> => {
      try {
        const updated = await blockComponentService.update(params);
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
    async (params: BlockComponentDeleteParamsT): Promise<SoftDeleteResponseT> => {
      try {
        const response = await blockComponentService.softDelete(params);
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

export type BlockComponentsControllerT = ReturnType<typeof useBlockComponentsController>;
