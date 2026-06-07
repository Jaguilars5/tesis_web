import type { RootState } from "@shared/redux/store";
import type { TeacherSubjectSectionT } from "../domain/teacher-subject-section.entity";

export const selectTeacherSubjectSections = (state: RootState): TeacherSubjectSectionT[] =>
  state.academic.teacherSubjectSections.teacherSubjectSections;

export const selectTeacherSubjectSectionsStatus = (state: RootState) =>
  state.academic.teacherSubjectSections.status;

export const selectTeacherSubjectSectionError = (state: RootState) =>
  state.academic.teacherSubjectSections.error;
