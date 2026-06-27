import { useAppDispatch, useAppSelector } from "@shared/redux/hooks";
import { toRejectValue } from "@shared/utils/validationErrors";
import { useCallback } from "react";
import type { SoftDeleteResponseT } from "@shared/types/soft-delete.types";

import { subjectAcademicConfigService } from "../subject-academic-config.service";
import {
  entityCreated,
  entityDeleted,
  entityUpdated,
  loadError,
  loadPending,
  loadSuccess,
  mutationError,
  selectSubjectAcademicConfigError,
  selectSubjectAcademicConfigs,
  selectSubjectAcademicConfigsStatus,
  selectSubjectAcademicConfigTotalCount,
} from "../subject-academic-config.slice";
import type {
  SubjectAcademicConfigCreateParamsT,
  SubjectAcademicConfigDeleteParamsT,
  SubjectAcademicConfigListParamsT,
  SubjectAcademicConfigT,
  SubjectAcademicConfigUpdateParamsT,
} from "../subject-academic-config.types";

export const useSubjectAcademicConfigController = () => {
  const dispatch = useAppDispatch();
  const subjectAcademicConfigs = useAppSelector(selectSubjectAcademicConfigs);
  const status = useAppSelector(selectSubjectAcademicConfigsStatus);
  const error = useAppSelector(selectSubjectAcademicConfigError);
  const totalCount = useAppSelector(selectSubjectAcademicConfigTotalCount);

  const loadSubjectAcademicConfigs = useCallback(
    async (params?: SubjectAcademicConfigListParamsT) => {
      dispatch(loadPending());
      try {
        const result = await subjectAcademicConfigService.list(
          params ?? { page: 1, pageSize: 100 },
        );
        dispatch(loadSuccess({ items: result.items, count: result.count }));
      } catch (err) {
        dispatch(loadError(err instanceof Error ? err.message : "Error"));
      }
    },
    [dispatch],
  );

  const createSubjectAcademicConfig = useCallback(
    async (
      params: SubjectAcademicConfigCreateParamsT,
    ): Promise<SubjectAcademicConfigT> => {
      try {
        const created = await subjectAcademicConfigService.create(params);
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

  const updateSubjectAcademicConfig = useCallback(
    async (
      params: SubjectAcademicConfigUpdateParamsT,
    ): Promise<SubjectAcademicConfigT> => {
      try {
        const updated = await subjectAcademicConfigService.update(params);
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

  const deleteSubjectAcademicConfig = useCallback(
    async (params: SubjectAcademicConfigDeleteParamsT): Promise<SoftDeleteResponseT> => {
      try {
        const response = await subjectAcademicConfigService.softDelete(params);
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
    subjectAcademicConfigs,
    totalCount,
    isLoading: status === "loading",
    error,
    loadSubjectAcademicConfigs,
    createSubjectAcademicConfig,
    updateSubjectAcademicConfig,
    deleteSubjectAcademicConfig,
  };
};

export type SubjectAcademicConfigControllerT = ReturnType<
  typeof useSubjectAcademicConfigController
>;
