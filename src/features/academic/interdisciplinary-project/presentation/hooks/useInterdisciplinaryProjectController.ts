import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@shared/redux/hooks";
import {
  selectInterdisciplinaryProjectError,
  selectInterdisciplinaryProjects,
  selectInterdisciplinaryProjectsStatus,
} from "../../reducers/interdisciplinary-project.selectors";
import {
  createInterdisciplinaryProject,
  deleteInterdisciplinaryProject,
  fetchInterdisciplinaryProjects,
  updateInterdisciplinaryProject,
} from "../../reducers/interdisciplinary-project.reducer";
import type { InterdisciplinaryProjectT } from "../../domain/entities/interdisciplinary-project.types";

export const useInterdisciplinaryProjectController = () => {
  const dispatch = useAppDispatch();
  const interdisciplinaryProjects = useAppSelector(selectInterdisciplinaryProjects);
  const status = useAppSelector(selectInterdisciplinaryProjectsStatus);
  const error = useAppSelector(selectInterdisciplinaryProjectError);

  const loadInterdisciplinaryProjects = useCallback(
    (params?: { page?: number; pageSize?: number }) =>
      dispatch(fetchInterdisciplinaryProjects(params ?? { page: 1, pageSize: 100 })),
    [dispatch],
  );

  const create = useCallback(
    (data: Omit<InterdisciplinaryProjectT, "id" | "is_active" | "academic_period_name">) =>
      dispatch(createInterdisciplinaryProject(data)),
    [dispatch],
  );

  const update = useCallback(
    (id: number, data: Partial<InterdisciplinaryProjectT>) =>
      dispatch(updateInterdisciplinaryProject({ id, data })),
    [dispatch],
  );

  const remove = useCallback(
    (id: number) => dispatch(deleteInterdisciplinaryProject(id)),
    [dispatch],
  );

  return {
    interdisciplinaryProjects,
    isLoading: status === "loading",
    error,
    loadInterdisciplinaryProjects,
    createInterdisciplinaryProject: create,
    updateInterdisciplinaryProject: update,
    deleteInterdisciplinaryProject: remove,
  };
};
