import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@shared/redux/hooks";
import {
  selectSectionError,
  selectSections,
  selectSectionsStatus,
} from "../../reducers/section.selectors";
import {
  createSection,
  deleteSection,
  fetchSections,
  updateSection,
} from "../../reducers/section.reducer";
import type { SectionT } from "../../domain/entities/section.types";

export const useSectionController = () => {
  const dispatch = useAppDispatch();
  const sections = useAppSelector(selectSections);
  const status = useAppSelector(selectSectionsStatus);
  const error = useAppSelector(selectSectionError);

  const loadSections = useCallback(
    (params?: { page?: number; pageSize?: number }) =>
      dispatch(fetchSections(params ?? { page: 1, pageSize: 100 })),
    [dispatch],
  );

  const create = useCallback(
    (data: Omit<SectionT, "id" | "is_active" | "school_year_name" | "academic_grade_name">) =>
      dispatch(createSection(data)),
    [dispatch],
  );

  const update = useCallback(
    (id: number, data: Partial<SectionT>) =>
      dispatch(updateSection({ id, data })),
    [dispatch],
  );

  const remove = useCallback(
    (id: number) => dispatch(deleteSection(id)),
    [dispatch],
  );

  return {
    sections,
    isLoading: status === "loading",
    error,
    loadSections,
    createSection: create,
    updateSection: update,
    deleteSection: remove,
  };
};
