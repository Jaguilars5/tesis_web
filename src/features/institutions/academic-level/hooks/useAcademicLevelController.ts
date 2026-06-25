import { useAppDispatch, useAppSelector } from "@shared/redux/hooks";
import { useCallback } from "react";
import { toRejectValue } from "@shared/utils/validationErrors";
import { academicLevelService } from "../academic-level.service";
import {
  selectAcademicLevels,
  selectAcademicLevelsStatus,
  selectAcademicLevelError,
  loadPending,
  loadSuccess,
  loadError,
  entityCreated,
  mutationError,
  entityUpdated,
  entityDeleted,
} from "../academic-level.slice";
import type {
  AcademicLevelListParamsT,
  AcademicLevelCreateParamsT,
  AcademicLevelT,
  AcademicLevelUpdateParamsT,
  AcademicLevelDeleteParamsT,
} from "../academic-level.types";

export const useAcademicLevelController = () => {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectAcademicLevels);
  const status = useAppSelector(selectAcademicLevelsStatus);
  const error = useAppSelector(selectAcademicLevelError);

  const load = useCallback(
    async (params?: AcademicLevelListParamsT) => {
      dispatch(loadPending());
      try {
        const items = await academicLevelService.list(
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
    async (params: AcademicLevelCreateParamsT): Promise<AcademicLevelT> => {
      try {
        const newAcademicLevel = await academicLevelService.create(params);
        dispatch(entityCreated(newAcademicLevel));
        return newAcademicLevel;
      } catch (err) {
        const rv = toRejectValue(err);
        dispatch(mutationError(rv.msg));
        throw rv;
      }
    },
    [dispatch],
  );
  const update = useCallback(
    async (params: AcademicLevelUpdateParamsT): Promise<AcademicLevelT> => {
      try {
        const updatedAcademicLevel = await academicLevelService.update(params);
        dispatch(entityUpdated(updatedAcademicLevel));
        return updatedAcademicLevel;
      } catch (err) {
        const rv = toRejectValue(err);
        dispatch(mutationError(rv.msg));
        throw rv;
      }
    },
    [dispatch],
  );
  const disable = useCallback(
    async (params: AcademicLevelDeleteParamsT): Promise<void> => {
      try {
        const { id } = await academicLevelService.softDelete(params);
        dispatch(entityDeleted(id));
      } catch (err) {
        dispatch(mutationError(err instanceof Error ? err.message : "Error"));
      }
    },
    [dispatch],
  );
  return {
    academicLevels: items,
    isLoading: status === "loading",
    error,
    loadAcademicLevels: load,
    createAcademicLevel: create,
    updateAcademicLevel: update,
    deleteAcademicLevel: disable,
  };
};
