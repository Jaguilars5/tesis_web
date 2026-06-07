import type { RootState } from "@shared/redux/store";

export const selectAcademicSubnivels = (state: RootState) => state.institutions.academicSubnivel.academicSubnivels;
export const selectAcademicSubnivelsStatus = (state: RootState) => state.institutions.academicSubnivel.status;
export const selectAcademicSubnivelError = (state: RootState) => state.institutions.academicSubnivel.error;
