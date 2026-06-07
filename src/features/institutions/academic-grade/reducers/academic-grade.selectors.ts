import type { RootState } from "@shared/redux/store";

export const selectAcademicGrades = (state: RootState) => state.institutions.academicGrade.academicGrades;
export const selectAcademicGradesStatus = (state: RootState) => state.institutions.academicGrade.status;
export const selectAcademicGradeError = (state: RootState) => state.institutions.academicGrade.error;
