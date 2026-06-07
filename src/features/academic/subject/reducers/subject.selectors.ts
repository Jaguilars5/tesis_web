import type { RootState } from "@shared/redux/store";
import type { SubjectT } from "../domain/entities/subject.types";

export const selectSubjects = (state: RootState): SubjectT[] =>
  state.academic.subjects.subjects;

export const selectSubjectsStatus = (state: RootState) =>
  state.academic.subjects.status;

export const selectSubjectError = (state: RootState) =>
  state.academic.subjects.error;
