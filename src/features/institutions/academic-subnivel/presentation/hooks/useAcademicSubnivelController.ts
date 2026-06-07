import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@shared/redux/hooks";
import {
  selectAcademicSubnivelError,
  selectAcademicSubnivels,
  selectAcademicSubnivelsStatus,
} from "../../reducers/academic-subnivel.selectors";
import {
  createAcademicSubnivel,
  deleteAcademicSubnivel,
  fetchAcademicSubnivels,
  updateAcademicSubnivel,
} from "../../reducers/academic-subnivel.reducer";
import type { AcademicSubnivelT } from "../../domain/entities/academic-subnivel.types";

export const useAcademicSubnivelController = () => {
  const dispatch = useAppDispatch();
  const academicSubnivels = useAppSelector(selectAcademicSubnivels);
  const status = useAppSelector(selectAcademicSubnivelsStatus);
  const error = useAppSelector(selectAcademicSubnivelError);

  const loadAcademicSubnivels = useCallback(
    (params?: { page?: number; pageSize?: number }) =>
      dispatch(fetchAcademicSubnivels(params ?? { page: 1, pageSize: 100 })),
    [dispatch],
  );

  const create = useCallback(
    (data: Omit<AcademicSubnivelT, "id" | "is_active" | "academic_level_name">) =>
      dispatch(createAcademicSubnivel(data)),
    [dispatch],
  );

  const update = useCallback(
    (id: number, data: Partial<AcademicSubnivelT>) =>
      dispatch(updateAcademicSubnivel({ id, data })),
    [dispatch],
  );

  const remove = useCallback(
    (id: number) => dispatch(deleteAcademicSubnivel(id)),
    [dispatch],
  );

  return {
    academicSubnivels,
    isLoading: status === "loading",
    error,
    loadAcademicSubnivels,
    createAcademicSubnivel: create,
    updateAcademicSubnivel: update,
    deleteAcademicSubnivel: remove,
  };
};
