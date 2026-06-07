import type { RootState } from "@shared/redux/store";

export const selectAcademicPeriods = (state: RootState) => state.academic.academicPeriods.academicPeriods;
export const selectAcademicPeriodsStatus = (state: RootState) => state.academic.academicPeriods.status;
export const selectAcademicPeriodError = (state: RootState) => state.academic.academicPeriods.error;
