import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@shared/redux/hooks";
import { toRejectValue } from "@shared/utils/validationErrors";
import { attendanceService } from "../attendance.service";
import {
  loadPending,
  loadSuccess,
  loadError,
  currentAttendanceLoaded,
  entityCreated,
  entityUpdated,
  mutationError,
  selectItems,
  selectTotalCount,
  selectCurrentAttendance,
  selectStatus,
  selectError,
} from "../attendance.slice";
import type {
  AttendanceListParamsT,
  AttendanceCreateParamsT,
  AttendanceT,
  AttendanceUpdateParamsT,
  AttendanceGetParamsT,
} from "../attendance.types";

export const useAttendanceController = () => {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectItems);
  const totalCount = useAppSelector(selectTotalCount);
  const currentAttendance = useAppSelector(selectCurrentAttendance);
  const status = useAppSelector(selectStatus);
  const error = useAppSelector(selectError);

  const loadItems = useCallback(
    async (params?: AttendanceListParamsT) => {
      dispatch(loadPending());
      try {
        const result = await attendanceService.list(
          params ?? { page: 1, pageSize: 100 },
        );
        dispatch(loadSuccess({ items: result.items, count: result.count }));
      } catch (err) {
        dispatch(
          loadError(
            err instanceof Error ? err.message : "Error al cargar asistencias",
          ),
        );
      }
    },
    [dispatch],
  );

  const loadAttendance = useCallback(
    async (params: AttendanceGetParamsT) => {
      try {
        const item = await attendanceService.get(params);
        dispatch(currentAttendanceLoaded(item));
      } catch (err) {
        dispatch(
          loadError(
            err instanceof Error ? err.message : "Error al cargar asistencia",
          ),
        );
      }
    },
    [dispatch],
  );

  const createItem = useCallback(
    async (params: AttendanceCreateParamsT): Promise<AttendanceT> => {
      try {
        const created = await attendanceService.create(params);
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

  const updateItem = useCallback(
    async (params: AttendanceUpdateParamsT): Promise<AttendanceT> => {
      try {
        const updated = await attendanceService.update(params);
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

  return {
    items,
    totalCount,
    currentAttendance,
    isLoading: status === "loading",
    error,
    loadItems,
    loadAttendance,
    createItem,
    updateItem,
  };
};

export type AttendanceControllerT = ReturnType<typeof useAttendanceController>;
