import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@shared/redux/hooks";
import {
  selectSubjectProjectError,
  selectSubjectProjects,
  selectSubjectProjectsStatus,
} from "../../reducers/subject-project.selectors";
import {
  createSubjectProject,
  deleteSubjectProject,
  fetchSubjectProjects,
} from "../../reducers/subject-project.reducer";
import type { SubjectProjectT } from "../../domain/entities/subject-project.types";

export const useSubjectProjectController = () => {
  const dispatch = useAppDispatch();
  const subjectProjects = useAppSelector(selectSubjectProjects);
  const status = useAppSelector(selectSubjectProjectsStatus);
  const error = useAppSelector(selectSubjectProjectError);

  const loadSubjectProjects = useCallback(
    (params?: { page?: number; pageSize?: number }) =>
      dispatch(fetchSubjectProjects(params ?? { page: 1, pageSize: 100 })),
    [dispatch],
  );

  const create = useCallback(
    (data: Omit<SubjectProjectT, "id" | "interdisciplinary_project_title" | "subject_offering_name">) =>
      dispatch(createSubjectProject(data)),
    [dispatch],
  );

  const remove = useCallback(
    (id: number) => dispatch(deleteSubjectProject(id)),
    [dispatch],
  );

  return {
    subjectProjects,
    isLoading: status === "loading",
    error,
    loadSubjectProjects,
    createSubjectProject: create,
    deleteSubjectProject: remove,
  };
};
