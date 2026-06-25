import { useAppDispatch, useAppSelector } from "@shared/redux/hooks";
import { toRejectValue } from "@shared/utils/validationErrors";
import { useCallback } from "react";
import type { SoftDeleteResponseT } from "@shared/types/soft-delete.types";

import { subjectService } from "../subject.service";
import {
  entityCreated,
  entityDeleted,
  entityUpdated,
  loadError,
  loadPending,
  loadSuccess,
  mutationError,
  selectSubjectError,
  selectSubjects,
  selectSubjectsStatus,
} from "../subject.slice";
import type {
  SubjectCreateParamsT,
  SubjectDeleteParamsT,
  SubjectListParamsT,
  SubjectT,
  SubjectUpdateParamsT,
} from "../subject.types";

export const useSubjectController = () => {
  const dispatch = useAppDispatch();
  const subjects = useAppSelector(selectSubjects);
  const status = useAppSelector(selectSubjectsStatus);
  const error = useAppSelector(selectSubjectError);

  const loadSubjects = useCallback(
    async (params?: SubjectListParamsT) => {
      dispatch(loadPending());
      try {
        const items = await subjectService.list(
          params ?? { page: 1, pageSize: 100 },
        );
        dispatch(loadSuccess(items));
      } catch (err) {
        dispatch(loadError(err instanceof Error ? err.message : "Error"));
      }
    },
    [dispatch],
  );

  const createSubject = useCallback(
    async (params: SubjectCreateParamsT): Promise<SubjectT> => {
      try {
        const created = await subjectService.create(params);
        dispatch(entityCreated(created));
        return created;
      } catch (err) {
        const rv = toRejectValue(err);
        dispatch(mutationError(rv.msg));
        throw rv;
      }
    },
    [dispatch],
  );

  const updateSubject = useCallback(
    async (params: SubjectUpdateParamsT): Promise<SubjectT> => {
      try {
        const updated = await subjectService.update(params);
        dispatch(entityUpdated(updated));
        return updated;
      } catch (err) {
        const rv = toRejectValue(err);
        dispatch(mutationError(rv.msg));
        throw rv;
      }
    },
    [dispatch],
  );

  const deleteSubject = useCallback(
    async (params: SubjectDeleteParamsT): Promise<SoftDeleteResponseT> => {
      try {
        const response = await subjectService.softDelete(params);
        if (response.is_active === false) {
          dispatch(entityDeleted(response.id));
        }
        return response;
      } catch (err) {
        const rv = toRejectValue(err);
        dispatch(mutationError(rv.msg));
        throw rv;
      }
    },
    [dispatch],
  );

  return {
    subjects,
    isLoading: status === "loading",
    error,
    loadSubjects,
    createSubject,
    updateSubject,
    deleteSubject,
  };
};

export type SubjectControllerT = ReturnType<typeof useSubjectController>;
