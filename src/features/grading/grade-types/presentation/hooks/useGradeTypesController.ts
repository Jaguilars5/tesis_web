import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@shared/redux/hooks";
import {
  selectGradeTypesError,
  selectGradeTypes,
  selectGradeTypesStatus,
} from "../../reducers/grade-types.selectors";
import {
  createGradeType,
  deleteGradeType,
  fetchGradeType,
  fetchGradeTypes,
  updateGradeType,
} from "../../reducers/grade-types.thunks";
import type { GradeTypeListParamsT } from "../../domain/repositories/grade-types.repository";

export const useGradeTypesController = () => {
  const dispatch = useAppDispatch();
  const gradeTypes = useAppSelector(selectGradeTypes);
  const status = useAppSelector(selectGradeTypesStatus);
  const error = useAppSelector(selectGradeTypesError);

  const loadGradeTypes = useCallback(
    (params?: GradeTypeListParamsT) => {
      return dispatch(fetchGradeTypes(params ?? { page: 1, pageSize: 100 }));
    },
    [dispatch],
  );

  const getGradeType = useCallback(
    (id: number) => {
      return dispatch(fetchGradeType(id)).unwrap();
    },
    [dispatch],
  );

  const create = useCallback(
    (data: Omit<Parameters<typeof createGradeType>[0], "id" | "is_active" | "created_at" | "updated_at">) => {
      return dispatch(createGradeType(data));
    },
    [dispatch],
  );

  const update = useCallback(
    (data: Partial<Parameters<typeof updateGradeType>[0]> & { id: number }) => {
      return dispatch(updateGradeType(data));
    },
    [dispatch],
  );

  const remove = useCallback(
    (id: number) => {
      return dispatch(deleteGradeType(id));
    },
    [dispatch],
  );

  return {
    gradeTypes,
    isLoading: status === "loading",
    error,
    loadGradeTypes,
    getGradeType,
    createGradeType: create,
    updateGradeType: update,
    deleteGradeType: remove,
  };
};
