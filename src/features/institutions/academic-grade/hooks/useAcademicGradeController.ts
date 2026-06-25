import { useAppDispatch, useAppSelector } from "@shared/redux/hooks";
import { useCallback } from "react";
import { toRejectValue } from "@shared/utils/validationErrors";
import { academicGradeService } from "../academic-grade.service";
import {
  selectAcademicGrades,
  selectAcademicGradesStatus,
  selectAcademicGradeError,
  loadPending,
  loadSuccess,
  loadError,
  entityCreated,
  mutationError,
  entityUpdated,
  entityDeleted,
} from "../academic-grade.slice";
import type {
  AcademicGradeListParamsT,
  AcademicGradeCreateParamsT,
  AcademicGradeT,
  AcademicGradeUpdateParamsT,
  AcademicGradeDeleteParamsT,
} from "../academic-grade.types";

export const useAcademicGradeController = () => {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectAcademicGrades);
  const status = useAppSelector(selectAcademicGradesStatus);
  const error = useAppSelector(selectAcademicGradeError);

  const load = useCallback(
    async (params?: AcademicGradeListParamsT) => {
      dispatch(loadPending());
      try {
        const items = await academicGradeService.list(
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
    async (params: AcademicGradeCreateParamsT): Promise<AcademicGradeT> => {
      try {
        const newAcademicGrade = await academicGradeService.create(params);
        dispatch(entityCreated(newAcademicGrade));
        return newAcademicGrade;
      } catch (err) {
        const rv = toRejectValue(err);
        dispatch(mutationError(rv.msg));
        throw rv;
      }
    },
    [dispatch],
  );

  const update = useCallback(
    async (params: AcademicGradeUpdateParamsT): Promise<AcademicGradeT> => {
      try {
        const updatedAcademicGrade = await academicGradeService.update(params);
        dispatch(entityUpdated(updatedAcademicGrade));
        return updatedAcademicGrade;
      } catch (err) {
        const rv = toRejectValue(err);
        dispatch(mutationError(rv.msg));
        throw rv;
      }
    },
    [dispatch],
  );

  const disable = useCallback(
    async (params: AcademicGradeDeleteParamsT): Promise<void> => {
      try {
        const { id } = await academicGradeService.softDelete(params);
        dispatch(entityDeleted(id));
      } catch (err) {
        dispatch(mutationError(err instanceof Error ? err.message : "Error"));
      }
    },
    [dispatch],
  );

  return {
    academicGrades: items,
    isLoading: status === "loading",
    error,
    loadAcademicGrades: load,
    createAcademicGrade: create,
    updateAcademicGrade: update,
    deleteAcademicGrade: disable,
  };
};
