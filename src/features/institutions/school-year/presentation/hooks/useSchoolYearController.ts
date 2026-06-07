import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@shared/redux/hooks";
import {
  selectSchoolYearError,
  selectSchoolYears,
  selectSchoolYearsStatus,
} from "../../reducers/school-year.selectors";
import {
  createSchoolYear,
  deleteSchoolYear,
  fetchSchoolYears,
  updateSchoolYear,
} from "../../reducers/school-year.reducer";
import type { SchoolYearT } from "../../domain/entities/school-year.types";

export const useSchoolYearController = () => {
  const dispatch = useAppDispatch();
  const schoolYears = useAppSelector(selectSchoolYears);
  const status = useAppSelector(selectSchoolYearsStatus);
  const error = useAppSelector(selectSchoolYearError);

  const loadSchoolYears = useCallback(
    (params?: { page?: number; pageSize?: number }) =>
      dispatch(fetchSchoolYears(params ?? { page: 1, pageSize: 100 })),
    [dispatch],
  );

  const create = useCallback(
    (data: Omit<SchoolYearT, "id" | "is_active">) =>
      dispatch(createSchoolYear(data)),
    [dispatch],
  );

  const update = useCallback(
    (id: number, data: Partial<SchoolYearT>) =>
      dispatch(updateSchoolYear({ id, data })),
    [dispatch],
  );

  const remove = useCallback(
    (id: number) => dispatch(deleteSchoolYear(id)),
    [dispatch],
  );

  return {
    schoolYears,
    isLoading: status === "loading",
    error,
    loadSchoolYears,
    createSchoolYear: create,
    updateSchoolYear: update,
    deleteSchoolYear: remove,
  };
};
