import { useAppDispatch } from "@shared/redux/hooks";
import { useCallback } from "react";
import {
  createStudent,
  deleteStudent,
  fetchStudents,
  updateStudent,
} from "../redux/student.thunks";
import type {
  StudentCreateRequest,
  StudentUpdateRequest,
} from "../types/student.types";

export function useStudents() {
  const dispatch = useAppDispatch();

  const loadStudents = useCallback(() => {
    return dispatch(fetchStudents());
  }, [dispatch]);

  const createStudentMutation = useCallback(
    (data: StudentCreateRequest) => {
      return dispatch(createStudent(data));
    },
    [dispatch]
  );

  const updateStudentMutation = useCallback(
    (data: StudentUpdateRequest) => {
      return dispatch(updateStudent(data));
    },
    [dispatch]
  );

  const deleteStudentMutation = useCallback(
    (id: number) => {
      return dispatch(deleteStudent({ id }));
    },
    [dispatch]
  );

  return {
    loadStudents,
    createStudent: createStudentMutation,
    updateStudent: updateStudentMutation,
    deleteStudent: deleteStudentMutation,
  };
}

export function useStudentForm() {
  const { createStudent, updateStudent } = useStudents();

  const handleSubmit = useCallback(
    async (values: StudentCreateRequest, editingId?: number) => {
      if (editingId) {
        return updateStudent({ ...values, id: editingId });
      }
      return createStudent(values);
    },
    [createStudent, updateStudent]
  );

  return { handleSubmit };
}
