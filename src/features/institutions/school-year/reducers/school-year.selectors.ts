import type { RootState } from "@shared/redux/store";

export const selectSchoolYears = (state: RootState) => state.institutions.schoolYear.schoolYears;
export const selectSchoolYearsStatus = (state: RootState) => state.institutions.schoolYear.status;
export const selectSchoolYearError = (state: RootState) => state.institutions.schoolYear.error;
