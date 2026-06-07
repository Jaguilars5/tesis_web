import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@shared/redux/hooks";
import {
  selectSubjectError,
  selectSubjects,
  selectSubjectsStatus,
} from "../../reducers/subject.selectors";
import {
  createSubject,
  deleteSubject,
  fetchSubjects,
  updateSubject,
} from "../../application/use-cases";
import type { SubjectT } from "../../domain/entities/subject.types";

export const useSubjectController = () => {
  const dispatch = useAppDispatch();
  const subjects = useAppSelector(selectSubjects);
  const status = useAppSelector(selectSubjectsStatus);
  const error = useAppSelector(selectSubjectError);

  const loadSubjects = useCallback(
    (params?: { page?: number; pageSize?: number }) => {
      return dispatch(fetchSubjects(params));
    },
    [dispatch],
  );

  const create = useCallback(
    (data: Omit<SubjectT, "id" | "is_active">) => {
      return dispatch(createSubject(data));
    },
    [dispatch],
  );

  const update = useCallback(
    (id: number, data: Partial<SubjectT>) => {
      return dispatch(updateSubject({ id, data }));
    },
    [dispatch],
  );

  const remove = useCallback(
    (id: number) => {
      return dispatch(deleteSubject(id));
    },
    [dispatch],
  );

  return {
    subjects,
    isLoading: status === "loading",
    error,
    loadSubjects,
    createSubject: create,
    updateSubject: update,
    deleteSubject: remove,
  };
};
