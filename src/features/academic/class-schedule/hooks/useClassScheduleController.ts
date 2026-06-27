import { useAppDispatch, useAppSelector } from "@shared/redux/hooks";
import { toRejectValue } from "@shared/utils/validationErrors";
import { useCallback } from "react";
import type { SoftDeleteResponseT } from "@shared/types/soft-delete.types";

import { classScheduleService } from "../class-schedule.service";
import {
  entityCreated,
  entityDeleted,
  entityUpdated,
  loadError,
  loadPending,
  loadSuccess,
  mutationError,
  selectClassScheduleError,
  selectClassScheduleTotalCount,
  selectClassSchedules,
  selectClassSchedulesStatus,
} from "../class-schedule.slice";
import type {
  ClassScheduleCreateParamsT,
  ClassScheduleDeleteParamsT,
  ClassScheduleListParamsT,
  ClassScheduleT,
  ClassScheduleUpdateParamsT,
} from "../class-schedule.types";

export const useClassScheduleController = () => {
  const dispatch = useAppDispatch();
  const classSchedules = useAppSelector(selectClassSchedules);
  const totalCount = useAppSelector(selectClassScheduleTotalCount);
  const status = useAppSelector(selectClassSchedulesStatus);
  const error = useAppSelector(selectClassScheduleError);

  const loadClassSchedules = useCallback(
    async (params?: ClassScheduleListParamsT) => {
      dispatch(loadPending());
      try {
        const result = await classScheduleService.list(
          params ?? { page: 1, pageSize: 100 },
        );
        dispatch(loadSuccess({ items: result.items, count: result.count }));
      } catch (err) {
        dispatch(loadError(err instanceof Error ? err.message : "Error"));
      }
    },
    [dispatch],
  );

  const createClassSchedule = useCallback(
    async (params: ClassScheduleCreateParamsT): Promise<ClassScheduleT> => {
      try {
        const created = await classScheduleService.create(params);
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

  const updateClassSchedule = useCallback(
    async (params: ClassScheduleUpdateParamsT): Promise<ClassScheduleT> => {
      try {
        const updated = await classScheduleService.update(params);
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

  const deleteClassSchedule = useCallback(
    async (params: ClassScheduleDeleteParamsT): Promise<SoftDeleteResponseT> => {
      try {
        const response = await classScheduleService.softDelete(params);
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
    classSchedules,
    totalCount,
    isLoading: status === "loading",
    error,
    loadClassSchedules,
    createClassSchedule,
    updateClassSchedule,
    deleteClassSchedule,
  };
};

export type ClassScheduleControllerT = ReturnType<
  typeof useClassScheduleController
>;
