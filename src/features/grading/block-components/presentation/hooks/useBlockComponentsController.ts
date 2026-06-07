import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@shared/redux/hooks";
import {
  selectBlockComponentsError,
  selectBlockComponents,
  selectBlockComponentsStatus,
} from "../../reducers/block-components.selectors";
import {
  createBlockComponent,
  deleteBlockComponent,
  fetchBlockComponent,
  fetchBlockComponents,
  updateBlockComponent,
} from "../../reducers/block-components.thunks";
import type { BlockComponentListParamsT } from "../../domain/repositories/block-components.repository";

export const useBlockComponentsController = () => {
  const dispatch = useAppDispatch();
  const blockComponents = useAppSelector(selectBlockComponents);
  const status = useAppSelector(selectBlockComponentsStatus);
  const error = useAppSelector(selectBlockComponentsError);

  const loadBlockComponents = useCallback(
    (params?: BlockComponentListParamsT) => {
      return dispatch(fetchBlockComponents(params ?? { page: 1, pageSize: 100 }));
    },
    [dispatch],
  );

  const getBlockComponent = useCallback(
    (id: number) => {
      return dispatch(fetchBlockComponent(id)).unwrap();
    },
    [dispatch],
  );

  const create = useCallback(
    (data: Omit<Parameters<typeof createBlockComponent>[0], "id" | "evaluation_block_name">) => {
      return dispatch(createBlockComponent(data));
    },
    [dispatch],
  );

  const update = useCallback(
    (data: Partial<Parameters<typeof updateBlockComponent>[0]> & { id: number }) => {
      return dispatch(updateBlockComponent(data));
    },
    [dispatch],
  );

  const remove = useCallback(
    (id: number) => {
      return dispatch(deleteBlockComponent(id));
    },
    [dispatch],
  );

  return {
    blockComponents,
    isLoading: status === "loading",
    error,
    loadBlockComponents,
    getBlockComponent,
    createBlockComponent: create,
    updateBlockComponent: update,
    deleteBlockComponent: remove,
  };
};
