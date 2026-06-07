import type { RootState } from "@shared/redux/store";

export const selectSubjectOfferings = (state: RootState) => state.academic.subjectOfferings.subjectOfferings;
export const selectSubjectOfferingsStatus = (state: RootState) => state.academic.subjectOfferings.status;
export const selectSubjectOfferingError = (state: RootState) => state.academic.subjectOfferings.error;
