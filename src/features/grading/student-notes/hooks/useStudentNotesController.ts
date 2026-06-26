import { useAppDispatch, useAppSelector } from "@shared/redux/hooks";
import { toRejectValue } from "@shared/utils/validationErrors";
import { useCallback } from "react";
import { studentNoteService } from "../student-notes.service";
import {
  loadPending,
  loadSuccess,
  loadError,
  entityCreated,
  entityUpdated,
  entityDeleted,
  mutationError,
  selectStudentNotes,
  selectStudentNotesStatus,
  selectStudentNotesError,
} from "../student-notes.slice";
import type {
  StudentNoteCreateParamsT,
  StudentNoteDeleteParamsT,
  StudentNoteListParamsT,
  StudentNoteT,
  StudentNoteUpdateParamsT,
} from "../student-notes.types";
import type { SoftDeleteResponseT } from "@shared/types/soft-delete.types";

export const useStudentNotesController = () => {
  const dispatch = useAppDispatch();
  const studentNotes = useAppSelector(selectStudentNotes);
  const status = useAppSelector(selectStudentNotesStatus);
  const error = useAppSelector(selectStudentNotesError);

  const loadStudentNotes = useCallback(
    async (params?: StudentNoteListParamsT) => {
      dispatch(loadPending());
      try {
        const items = await studentNoteService.list(
          params ?? { page: 1, pageSize: 100 },
        );
        dispatch(loadSuccess(items));
      } catch (err) {
        dispatch(loadError(err instanceof Error ? err.message : "Error"));
      }
    },
    [dispatch],
  );

  const createStudentNote = useCallback(
    async (data: StudentNoteCreateParamsT): Promise<StudentNoteT> => {
      try {
        const created = await studentNoteService.create(data);
        dispatch(entityCreated(created));
        return created;
      } catch (err) {
        const rejectValue = toRejectValue(err);
        dispatch(mutationError(rejectValue.msg));
        throw rejectValue;
      }
    },
    [dispatch],
  );

  const updateStudentNote = useCallback(
    async (params: StudentNoteUpdateParamsT): Promise<StudentNoteT> => {
      try {
        const updated = await studentNoteService.update(params);
        dispatch(entityUpdated(updated));
        return updated;
      } catch (err) {
        const rejectValue = toRejectValue(err);
        dispatch(mutationError(rejectValue.msg));
        throw rejectValue;
      }
    },
    [dispatch],
  );

  const deleteStudentNote = useCallback(
    async (params: StudentNoteDeleteParamsT): Promise<SoftDeleteResponseT> => {
      try {
        const response = await studentNoteService.softDelete(params);
        if (response.is_active === false) {
          dispatch(entityDeleted(response.id));
        }
        return response;
      } catch (err) {
        const rejectValue = toRejectValue(err);
        dispatch(mutationError(rejectValue.msg));
        throw rejectValue;
      }
    },
    [dispatch],
  );

  return {
    studentNotes,
    isLoading: status === "loading",
    error,
    loadStudentNotes,
    createStudentNote,
    updateStudentNote,
    deleteStudentNote,
  };
};

export type StudentNotesControllerT = ReturnType<
  typeof useStudentNotesController
>;
