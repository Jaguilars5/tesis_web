import { useCallback, useState } from "react";

import { useAppDispatch, useAppSelector } from "@shared/redux/hooks";

import {
  selectTeacherSubjectSectionError,
  selectTeacherSubjectSections,
  selectTeacherSubjectSectionsStatus,
} from "../reducers/teacher-subject-section.selectors";
import {
  createTeacherSubjectSection,
  deleteTeacherSubjectSection,
  fetchTeacherSubjectSection,
  fetchTeacherSubjectSections,
  updateTeacherSubjectSection,
} from "../reducers/teacher-subject-section.thunks";

import type { TeacherSubjectSectionT } from "../domain/teacher-subject-section.entity";
import type { TeacherSubjectSectionFormValues } from "./teacher-subject-section.schema";

export const useTeacherSubjectSections = () => {
  const dispatch = useAppDispatch();
  const teacherSubjectSections = useAppSelector(selectTeacherSubjectSections);
  const status = useAppSelector(selectTeacherSubjectSectionsStatus);
  const error = useAppSelector(selectTeacherSubjectSectionError);

  const loadTeacherSubjectSections = useCallback(
    (params?: { page?: number; pageSize?: number }) => {
      return dispatch(fetchTeacherSubjectSections(params ?? { page: 1, pageSize: 100 }));
    },
    [dispatch],
  );

  const getTeacherSubjectSection = useCallback(
    (params: { id: number }) => {
      return dispatch(fetchTeacherSubjectSection(params)).unwrap();
    },
    [dispatch],
  );

  const create = useCallback(
    (data: Omit<TeacherSubjectSectionT, "id" | "is_active" | "user_name" | "subject_offering_name">) => {
      return dispatch(createTeacherSubjectSection(data));
    },
    [dispatch],
  );

  const update = useCallback(
    (data: { id: number } & Partial<TeacherSubjectSectionT>) => {
      return dispatch(updateTeacherSubjectSection(data));
    },
    [dispatch],
  );

  const remove = useCallback(
    (id: number) => {
      return dispatch(deleteTeacherSubjectSection({ id }));
    },
    [dispatch],
  );

  return {
    teacherSubjectSections,
    isLoading: status === "loading",
    error,
    loadTeacherSubjectSections,
    getTeacherSubjectSection,
    createTeacherSubjectSection: create,
    updateTeacherSubjectSection: update,
    deleteTeacherSubjectSection: remove,
  };
};

export const useTeacherSubjectSectionsForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingTeacherSubjectSection, setEditingTeacherSubjectSection] = useState<TeacherSubjectSectionT | null>(null);
  const isEdit = !!editingTeacherSubjectSection;

  const { createTeacherSubjectSection: create, updateTeacherSubjectSection: update } = useTeacherSubjectSections();

  const openModal = useCallback((teacherSubjectSection?: TeacherSubjectSectionT) => {
    setEditingTeacherSubjectSection(teacherSubjectSection ?? null);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setEditingTeacherSubjectSection(null);
  }, []);

  const handleSubmit = useCallback(
    async (values: TeacherSubjectSectionFormValues) => {
      let result;
      if (editingTeacherSubjectSection) {
        result = await update({
          id: editingTeacherSubjectSection.id,
          user: values.user,
          subject_offering: values.subject_offering,
          is_active: values.is_active,
        });
      } else {
        result = await create({
          user: values.user,
          subject_offering: values.subject_offering,
        });
      }
      if (
        createTeacherSubjectSection.fulfilled.match(result) ||
        updateTeacherSubjectSection.fulfilled.match(result)
      ) {
        closeModal();
      }
    },
    [editingTeacherSubjectSection, create, update, closeModal],
  );

  return {
    isOpen,
    isEdit,
    editingTeacherSubjectSection,
    openModal,
    closeModal,
    handleSubmit,
  };
};
