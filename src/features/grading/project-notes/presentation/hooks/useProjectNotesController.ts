import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@shared/redux/hooks";
import {
  selectProjectNotesError,
  selectProjectNotes,
  selectProjectNotesStatus,
} from "../../reducers/project-notes.selectors";
import {
  createProjectNote,
  deleteProjectNote,
  fetchProjectNote,
  fetchProjectNotes,
  updateProjectNote,
} from "../../reducers/project-notes.thunks";
import type { ProjectNoteListParamsT } from "../../domain/repositories/project-notes.repository";
import type { ProjectNoteCreateDataT } from "../../domain/repositories/project-notes.repository";

export const useProjectNotesController = () => {
  const dispatch = useAppDispatch();
  const projectNotes = useAppSelector(selectProjectNotes);
  const status = useAppSelector(selectProjectNotesStatus);
  const error = useAppSelector(selectProjectNotesError);

  const loadProjectNotes = useCallback(
    (params?: ProjectNoteListParamsT) => {
      return dispatch(fetchProjectNotes(params ?? { page: 1, pageSize: 100 }));
    },
    [dispatch],
  );

  const getProjectNote = useCallback(
    (id: number) => {
      return dispatch(fetchProjectNote(id)).unwrap();
    },
    [dispatch],
  );

  const create = useCallback(
    (data: ProjectNoteCreateDataT) => {
      return dispatch(createProjectNote(data));
    },
    [dispatch],
  );

  const update = useCallback(
    (data: Partial<ProjectNoteCreateDataT> & { id: number }) => {
      return dispatch(updateProjectNote(data));
    },
    [dispatch],
  );

  const remove = useCallback(
    (id: number) => {
      return dispatch(deleteProjectNote(id));
    },
    [dispatch],
  );

  return {
    projectNotes,
    isLoading: status === "loading",
    error,
    loadProjectNotes,
    getProjectNote,
    createProjectNote: create,
    updateProjectNote: update,
    deleteProjectNote: remove,
  };
};
