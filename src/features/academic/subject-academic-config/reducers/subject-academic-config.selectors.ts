import type { RootState } from "@shared/redux/store";

export const selectSubjectAcademicConfigs = (state: RootState) => state.academic.subjectAcademicConfigs.subjectAcademicConfigs;
export const selectSubjectAcademicConfigsStatus = (state: RootState) => state.academic.subjectAcademicConfigs.status;
export const selectSubjectAcademicConfigError = (state: RootState) => state.academic.subjectAcademicConfigs.error;
