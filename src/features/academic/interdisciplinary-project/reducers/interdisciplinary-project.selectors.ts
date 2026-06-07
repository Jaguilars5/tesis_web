import type { RootState } from "@shared/redux/store";

export const selectInterdisciplinaryProjects = (state: RootState) => state.academic.interdisciplinaryProjects.interdisciplinaryProjects;
export const selectInterdisciplinaryProjectsStatus = (state: RootState) => state.academic.interdisciplinaryProjects.status;
export const selectInterdisciplinaryProjectError = (state: RootState) => state.academic.interdisciplinaryProjects.error;
