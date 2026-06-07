import type { RootState } from "@shared/redux/store";
import type { Student } from "../types/student.types";

export const selectStudents = (state: RootState): Student[] =>
  state.students.student.entities;

export const selectStudentsStatus = (state: RootState) =>
  state.students.student.status;

export const selectStudentsError = (state: RootState) =>
  state.students.student.error;
