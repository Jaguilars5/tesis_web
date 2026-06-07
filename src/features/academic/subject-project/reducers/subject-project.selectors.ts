import type { RootState } from "@shared/redux/store";

export const selectSubjectProjects = (state: RootState) => state.academic.subjectProjects.subjectProjects;
export const selectSubjectProjectsStatus = (state: RootState) => state.academic.subjectProjects.status;
export const selectSubjectProjectError = (state: RootState) => state.academic.subjectProjects.error;
