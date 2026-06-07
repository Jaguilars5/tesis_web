import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@shared/redux/hooks";
import {
  selectStudentNotesError,
  selectStudentNotes,
  selectStudentNotesStatus,
} from "../../reducers/student-notes.selectors";
import {
  createStudentNote,
  deleteStudentNote,
  fetchStudentNote,
  fetchStudentNotes,
  updateStudentNote,
} from "../../reducers/student-notes.thunks";
import type { StudentNoteListParamsT } from "../../domain/repositories/student-notes.repository";
import type { StudentNoteCreateDataT } from "../../domain/repositories/student-notes.repository";

export const useStudentNotesController = () => {
  const dispatch = useAppDispatch();
  const studentNotes = useAppSelector(selectStudentNotes);
  const status = useAppSelector(selectStudentNotesStatus);
  const error = useAppSelector(selectStudentNotesError);

  const loadStudentNotes = useCallback(
    (params?: StudentNoteListParamsT) => {
      return dispatch(fetchStudentNotes(params ?? { page: 1, pageSize: 100 }));
    },
    [dispatch],
  );

  const getStudentNote = useCallback(
    (id: number) => {
      return dispatch(fetchStudentNote(id)).unwrap();
    },
    [dispatch],
  );

  const create = useCallback(
    (data: StudentNoteCreateDataT) => {
      return dispatch(createStudentNote(data));
    },
    [dispatch],
  );

  const update = useCallback(
    (data: Partial<StudentNoteCreateDataT> & { id: number }) => {
      return dispatch(updateStudentNote(data));
    },
    [dispatch],
  );

  const remove = useCallback(
    (id: number) => {
      return dispatch(deleteStudentNote(id));
    },
    [dispatch],
  );

  return {
    studentNotes,
    isLoading: status === "loading",
    error,
    loadStudentNotes,
    getStudentNote,
    createStudentNote: create,
    updateStudentNote: update,
    deleteStudentNote: remove,
  };
};
