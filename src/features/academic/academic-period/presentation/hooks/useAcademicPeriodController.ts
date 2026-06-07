import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@shared/redux/hooks";
import {
  selectAcademicPeriodError,
  selectAcademicPeriods,
  selectAcademicPeriodsStatus,
} from "../../reducers/academic-period.selectors";
import {
  createAcademicPeriod,
  deleteAcademicPeriod,
  fetchAcademicPeriods,
  updateAcademicPeriod,
} from "../../reducers/academic-period.reducer";
import type { AcademicPeriodT } from "../../domain/entities/academic-period.types";

export const useAcademicPeriodController = () => {
  const dispatch = useAppDispatch();
  const academicPeriods = useAppSelector(selectAcademicPeriods);
  const status = useAppSelector(selectAcademicPeriodsStatus);
  const error = useAppSelector(selectAcademicPeriodError);

  const loadAcademicPeriods = useCallback(
    (params?: { page?: number; pageSize?: number }) =>
      dispatch(fetchAcademicPeriods(params ?? { page: 1, pageSize: 100 })),
    [dispatch],
  );

  const create = useCallback(
    (data: Omit<AcademicPeriodT, "id" | "is_active" | "school_year_name">) =>
      dispatch(createAcademicPeriod(data)),
    [dispatch],
  );

  const update = useCallback(
    (id: number, data: Partial<AcademicPeriodT>) =>
      dispatch(updateAcademicPeriod({ id, data })),
    [dispatch],
  );

  const remove = useCallback(
    (id: number) => dispatch(deleteAcademicPeriod(id)),
    [dispatch],
  );

  return {
    academicPeriods,
    isLoading: status === "loading",
    error,
    loadAcademicPeriods,
    createAcademicPeriod: create,
    updateAcademicPeriod: update,
    deleteAcademicPeriod: remove,
  };
};
