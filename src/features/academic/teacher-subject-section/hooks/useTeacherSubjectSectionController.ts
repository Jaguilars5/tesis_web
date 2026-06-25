import { useCallback } from "react";

import { toRejectValue } from "@shared/utils/validationErrors";
import { useAppDispatch, useAppSelector } from "@shared/redux/hooks";
import type { SoftDeleteResponseT } from "@shared/types/soft-delete.types";

import { teacherSubjectSectionService } from "../teacher-subject-section.service";
import {
  entityCreated,
  entityDeleted,
  entityUpdated,
  loadError,
  loadPending,
  loadSuccess,
  mutationError,
  selectTeacherSubjectSectionError,
  selectTeacherSubjectSections,
  selectTeacherSubjectSectionsStatus,
} from "../teacher-subject-section.slice";
import type {
  TeacherSubjectSectionCreateParamsT,
  TeacherSubjectSectionDeleteParamsT,
  TeacherSubjectSectionListParamsT,
  TeacherSubjectSectionT,
  TeacherSubjectSectionUpdateParamsT,
} from "../teacher-subject-section.types";

export const useTeacherSubjectSectionController = () => {
  const dispatch = useAppDispatch();
  const teacherSubjectSections = useAppSelector(selectTeacherSubjectSections);
  const status = useAppSelector(selectTeacherSubjectSectionsStatus);
  const error = useAppSelector(selectTeacherSubjectSectionError);

  const loadTeacherSubjectSections = useCallback(
    async (params?: TeacherSubjectSectionListParamsT) => {
      dispatch(loadPending());
      try {
        const items = await teacherSubjectSectionService.list(
          params ?? { page: 1, pageSize: 100 },
        );
        dispatch(loadSuccess(items));
      } catch (err) {
        dispatch(
          loadError(err instanceof Error ? err.message : "Error al cargar asignaciones"),
        );
      }
    },
    [dispatch],
  );

  const createTeacherSubjectSection = useCallback(
    async (data: TeacherSubjectSectionCreateParamsT): Promise<TeacherSubjectSectionT> => {
      try {
        const created = await teacherSubjectSectionService.create(data);
        dispatch(entityCreated(created));
        return created;
      } catch (err) {
        const rejectValue = toRejectValue(err);
        dispatch(mutationError(rejectValue.msg));
        throw rejectValue;
      }
    },
    [dispatch],
  );

  const updateTeacherSubjectSection = useCallback(
    async (params: TeacherSubjectSectionUpdateParamsT): Promise<TeacherSubjectSectionT> => {
      try {
        const updated = await teacherSubjectSectionService.update(params);
        dispatch(entityUpdated(updated));
        return updated;
      } catch (err) {
        const rejectValue = toRejectValue(err);
        dispatch(mutationError(rejectValue.msg));
        throw rejectValue;
      }
    },
    [dispatch],
  );

  const deleteTeacherSubjectSection = useCallback(
    async (params: TeacherSubjectSectionDeleteParamsT): Promise<SoftDeleteResponseT> => {
      try {
        const response = await teacherSubjectSectionService.softDelete(params);
        if (response.is_active === false) {
          dispatch(entityDeleted(response.id));
        }
        return response;
      } catch (err) {
        const rejectValue = toRejectValue(err);
        dispatch(mutationError(rejectValue.msg));
        throw rejectValue;
      }
    },
    [dispatch],
  );

  return {
    teacherSubjectSections,
    isLoading: status === "loading",
    error,
    loadTeacherSubjectSections,
    createTeacherSubjectSection,
    updateTeacherSubjectSection,
    deleteTeacherSubjectSection,
  };
};

export type TeacherSubjectSectionControllerT = ReturnType<
  typeof useTeacherSubjectSectionController
>;
