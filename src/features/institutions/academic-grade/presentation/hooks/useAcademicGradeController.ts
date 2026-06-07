import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@shared/redux/hooks";
import {
  selectAcademicGradeError,
  selectAcademicGrades,
  selectAcademicGradesStatus,
} from "../../reducers/academic-grade.selectors";
import {
  createAcademicGrade,
  deleteAcademicGrade,
  fetchAcademicGrades,
  updateAcademicGrade,
} from "../../reducers/academic-grade.reducer";
import type { AcademicGradeT } from "../../domain/entities/academic-grade.types";

export const useAcademicGradeController = () => {
  const dispatch = useAppDispatch();
  const academicGrades = useAppSelector(selectAcademicGrades);
  const status = useAppSelector(selectAcademicGradesStatus);
  const error = useAppSelector(selectAcademicGradeError);

  const loadAcademicGrades = useCallback(
    (params?: { page?: number; pageSize?: number }) =>
      dispatch(fetchAcademicGrades(params ?? { page: 1, pageSize: 100 })),
    [dispatch],
  );

  const create = useCallback(
    (data: Omit<AcademicGradeT, "id" | "is_active" | "academic_level_name">) =>
      dispatch(createAcademicGrade(data)),
    [dispatch],
  );

  const update = useCallback(
    (id: number, data: Partial<AcademicGradeT>) =>
      dispatch(updateAcademicGrade({ id, data })),
    [dispatch],
  );

  const remove = useCallback(
    (id: number) => dispatch(deleteAcademicGrade(id)),
    [dispatch],
  );

  return {
    academicGrades,
    isLoading: status === "loading",
    error,
    loadAcademicGrades,
    createAcademicGrade: create,
    updateAcademicGrade: update,
    deleteAcademicGrade: remove,
  };
};
