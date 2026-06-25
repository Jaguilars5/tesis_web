import { useAppDispatch, useAppSelector } from "@shared/redux/hooks";
import { toRejectValue } from "@shared/utils/validationErrors";
import { useCallback } from "react";
import type { SoftDeleteResponseT } from "@shared/types/soft-delete.types";

import { academicPeriodService } from "../academic-period.service";
import {
  entityCreated,
  entityDeleted,
  entityUpdated,
  loadError,
  loadPending,
  loadSuccess,
  mutationError,
  selectAcademicPeriodError,
  selectAcademicPeriods,
  selectAcademicPeriodsStatus,
} from "../academic-period.slice";
import type {
  AcademicPeriodCreateParamsT,
  AcademicPeriodDeleteParamsT,
  AcademicPeriodListParamsT,
  AcademicPeriodT,
  AcademicPeriodUpdateParamsT,
} from "../academic-period.types";

export const useAcademicPeriodController = () => {
  const dispatch = useAppDispatch();
  const academicPeriods = useAppSelector(selectAcademicPeriods);
  const status = useAppSelector(selectAcademicPeriodsStatus);
  const error = useAppSelector(selectAcademicPeriodError);

  const loadAcademicPeriods = useCallback(
    async (params?: AcademicPeriodListParamsT) => {
      dispatch(loadPending());
      try {
        const items = await academicPeriodService.list(
          params ?? { page: 1, pageSize: 100 },
        );
        dispatch(loadSuccess(items));
      } catch (err) {
        dispatch(loadError(err instanceof Error ? err.message : "Error"));
      }
    },
    [dispatch],
  );

  const createAcademicPeriod = useCallback(
    async (params: AcademicPeriodCreateParamsT): Promise<AcademicPeriodT> => {
      try {
        const created = await academicPeriodService.create(params);
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

  const updateAcademicPeriod = useCallback(
    async (params: AcademicPeriodUpdateParamsT): Promise<AcademicPeriodT> => {
      try {
        const updated = await academicPeriodService.update(params);
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

  const deleteAcademicPeriod = useCallback(
    async (params: AcademicPeriodDeleteParamsT): Promise<SoftDeleteResponseT> => {
      try {
        const response = await academicPeriodService.softDelete(params);
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
    academicPeriods,
    isLoading: status === "loading",
    error,
    loadAcademicPeriods,
    createAcademicPeriod,
    updateAcademicPeriod,
    deleteAcademicPeriod,
  };
};

export type AcademicPeriodControllerT = ReturnType<
  typeof useAcademicPeriodController
>;
