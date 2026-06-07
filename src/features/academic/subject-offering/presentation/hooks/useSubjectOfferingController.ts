import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@shared/redux/hooks";
import {
  selectSubjectOfferingError,
  selectSubjectOfferings,
  selectSubjectOfferingsStatus,
} from "../../reducers/subject-offering.selectors";
import {
  createSubjectOffering,
  deleteSubjectOffering,
  fetchSubjectOfferings,
  updateSubjectOffering,
} from "../../reducers/subject-offering.reducer";
import type { SubjectOfferingT } from "../../domain/entities/subject-offering.types";

export const useSubjectOfferingController = () => {
  const dispatch = useAppDispatch();
  const subjectOfferings = useAppSelector(selectSubjectOfferings);
  const status = useAppSelector(selectSubjectOfferingsStatus);
  const error = useAppSelector(selectSubjectOfferingError);

  const loadSubjectOfferings = useCallback(
    (params?: { page?: number; pageSize?: number }) =>
      dispatch(fetchSubjectOfferings(params ?? { page: 1, pageSize: 100 })),
    [dispatch],
  );

  const create = useCallback(
    (data: Omit<SubjectOfferingT, "id" | "is_active" | "school_year_name" | "section_name" | "subject_academic_config_name">) =>
      dispatch(createSubjectOffering(data)),
    [dispatch],
  );

  const update = useCallback(
    (id: number, data: Partial<SubjectOfferingT>) =>
      dispatch(updateSubjectOffering({ id, data })),
    [dispatch],
  );

  const remove = useCallback(
    (id: number) => dispatch(deleteSubjectOffering(id)),
    [dispatch],
  );

  return {
    subjectOfferings,
    isLoading: status === "loading",
    error,
    loadSubjectOfferings,
    createSubjectOffering: create,
    updateSubjectOffering: update,
    deleteSubjectOffering: remove,
  };
};
