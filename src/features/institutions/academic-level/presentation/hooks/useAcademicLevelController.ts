import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@shared/redux/hooks";
import {
  selectAcademicLevelError,
  selectAcademicLevels,
  selectAcademicLevelsStatus,
} from "../../reducers/academic-level.selectors";
import {
  fetchAcademicLevels,
  fetchAcademicLevel,
  createAcademicLevel,
  updateAcademicLevel,
  deleteAcademicLevel,
} from "../../application";

export const useAcademicLevelController = () => {
  const dispatch = useAppDispatch();
  const academicLevels = useAppSelector(selectAcademicLevels);
  const status = useAppSelector(selectAcademicLevelsStatus);
  const error = useAppSelector(selectAcademicLevelError);

  const loadAcademicLevels = useCallback(
    (params?: { page?: number; pageSize?: number }) => {
      return dispatch(fetchAcademicLevels(params ?? { page: 1, pageSize: 100 }));
    },
    [dispatch],
  );

  const getAcademicLevel = useCallback(
    (id: number) => {
      return dispatch(fetchAcademicLevel(id)).unwrap();
    },
    [dispatch],
  );

  const create = useCallback(
    (data: { name: string }) => {
      return dispatch(createAcademicLevel(data));
    },
    [dispatch],
  );

  const update = useCallback(
    (data: { id: number; name?: string; is_active?: boolean }) => {
      return dispatch(updateAcademicLevel(data));
    },
    [dispatch],
  );

  const remove = useCallback(
    (id: number) => {
      return dispatch(deleteAcademicLevel(id));
    },
    [dispatch],
  );

  return {
    academicLevels,
    isLoading: status === "loading",
    error,
    loadAcademicLevels,
    getAcademicLevel,
    createAcademicLevel: create,
    updateAcademicLevel: update,
    deleteAcademicLevel: remove,
  };
};
