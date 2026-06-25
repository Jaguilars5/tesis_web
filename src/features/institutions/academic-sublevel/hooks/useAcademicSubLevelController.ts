import { useAppDispatch, useAppSelector } from "@shared/redux/hooks";
import { toRejectValue } from "@shared/utils/validationErrors";
import { useCallback } from "react";
import { academicSubLevelService } from "../academic-sublevel.service";
import {
  selectAcademicSubLevels,
  selectAcademicSubLevelsStatus,
  selectAcademicSubLevelError,
  loadPending,
  loadSuccess,
  loadError,
  entityCreated,
  mutationError,
  entityUpdated,
  entityDeleted,
} from "../academic-sublevel.slice";
import type {
  AcademicSubLevelListParamsT,
  AcademicSubLevelCreateParamsT,
  AcademicSubLevelT,
  AcademicSubLevelUpdateParamsT,
  AcademicSubLevelDeleteParamsT,
} from "../academic-sublevel.types";

export const useAcademicSubLevelController = () => {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectAcademicSubLevels);
  const status = useAppSelector(selectAcademicSubLevelsStatus);
  const error = useAppSelector(selectAcademicSubLevelError);

  const load = useCallback(
    async (params?: AcademicSubLevelListParamsT) => {
      dispatch(loadPending());
      try {
        const items = await academicSubLevelService.list(
          params ?? { page: 1, pageSize: 100 },
        );
        dispatch(loadSuccess(items));
      } catch (err) {
        dispatch(loadError(err instanceof Error ? err.message : "Error"));
      }
    },
    [dispatch],
  );

  const create = useCallback(
    async (params: AcademicSubLevelCreateParamsT): Promise<AcademicSubLevelT> => {
      try {
        const newItem = await academicSubLevelService.create(params);
        dispatch(entityCreated(newItem));
        return newItem;
      } catch (err) {
        const rv = toRejectValue(err);
        dispatch(mutationError(rv.msg));
        throw rv;
      }
    },
    [dispatch],
  );

  const update = useCallback(
    async (params: AcademicSubLevelUpdateParamsT): Promise<AcademicSubLevelT> => {
      try {
        const updatedItem = await academicSubLevelService.update(params);
        dispatch(entityUpdated(updatedItem));
        return updatedItem;
      } catch (err) {
        const rv = toRejectValue(err);
        dispatch(mutationError(rv.msg));
        throw rv;
      }
    },
    [dispatch],
  );

  const disable = useCallback(
    async (params: AcademicSubLevelDeleteParamsT): Promise<void> => {
      try {
        const { id } = await academicSubLevelService.softDelete(params);
        dispatch(entityDeleted(id));
      } catch (err) {
        dispatch(mutationError(err instanceof Error ? err.message : "Error"));
      }
    },
    [dispatch],
  );

  return {
    academicSubLevels: items,
    isLoading: status === "loading",
    error,
    loadAcademicSubLevels: load,
    createAcademicSubLevel: create,
    updateAcademicSubLevel: update,
    deleteAcademicSubLevel: disable,
  };
};
