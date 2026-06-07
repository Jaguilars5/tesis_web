import type { RootState } from "@shared/redux/store";

export const selectSections = (state: RootState) => state.institutions.section.sections;
export const selectSectionsStatus = (state: RootState) => state.institutions.section.status;
export const selectSectionError = (state: RootState) => state.institutions.section.error;
