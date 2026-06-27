import { useAppDispatch, useAppSelector } from "@shared/redux/hooks";
import { toRejectValue } from "@shared/utils/validationErrors";
import { useCallback } from "react";
import type { SoftDeleteResponseT } from "@shared/types/soft-delete.types";

import { subjectOfferingService } from "../subject-offering.service";
import {
  entityCreated,
  entityDeleted,
  entityUpdated,
  loadError,
  loadPending,
  loadSuccess,
  mutationError,
  selectSubjectOfferingError,
  selectSubjectOfferingTotalCount,
  selectSubjectOfferings,
  selectSubjectOfferingsStatus,
} from "../subject-offering.slice";
import type {
  SubjectOfferingCreateParamsT,
  SubjectOfferingDeleteParamsT,
  SubjectOfferingListParamsT,
  SubjectOfferingT,
  SubjectOfferingUpdateParamsT,
} from "../subject-offering.types";

export const useSubjectOfferingController = () => {
  const dispatch = useAppDispatch();
  const subjectOfferings = useAppSelector(selectSubjectOfferings);
  const totalCount = useAppSelector(selectSubjectOfferingTotalCount);
  const status = useAppSelector(selectSubjectOfferingsStatus);
  const error = useAppSelector(selectSubjectOfferingError);

  const loadSubjectOfferings = useCallback(
    async (params?: SubjectOfferingListParamsT) => {
      dispatch(loadPending());
      try {
        const result = await subjectOfferingService.list(
          params ?? { page: 1, pageSize: 100 },
        );
        dispatch(loadSuccess({ items: result.items, count: result.count }));
      } catch (err) {
        dispatch(loadError(err instanceof Error ? err.message : "Error"));
      }
    },
    [dispatch],
  );

  const createSubjectOffering = useCallback(
    async (params: SubjectOfferingCreateParamsT): Promise<SubjectOfferingT> => {
      try {
        const created = await subjectOfferingService.create(params);
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

  const updateSubjectOffering = useCallback(
    async (params: SubjectOfferingUpdateParamsT): Promise<SubjectOfferingT> => {
      try {
        const updated = await subjectOfferingService.update(params);
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

  const deleteSubjectOffering = useCallback(
    async (params: SubjectOfferingDeleteParamsT): Promise<SoftDeleteResponseT> => {
      try {
        const response = await subjectOfferingService.softDelete(params);
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
    subjectOfferings,
    totalCount,
    isLoading: status === "loading",
    error,
    loadSubjectOfferings,
    createSubjectOffering,
    updateSubjectOffering,
    deleteSubjectOffering,
  };
};

export type SubjectOfferingControllerT = ReturnType<
  typeof useSubjectOfferingController
>;
