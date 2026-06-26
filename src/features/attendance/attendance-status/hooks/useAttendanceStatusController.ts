import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@shared/redux/hooks";
import { toRejectValue } from "@shared/utils/validationErrors";
import type { SoftDeleteResponseT } from "@shared/types/soft-delete.types";
import { attendanceStatusService } from "../attendance-status.service";
import {
  loadPending,
  loadSuccess,
  loadError,
  entityCreated,
  entityUpdated,
  entityDeleted,
  mutationError,
  selectItems,
  selectStatus,
  selectError,
} from "../attendance-status.slice";
import type {
  AttendanceStatusListParamsT,
  AttendanceStatusCreateParamsT,
  AttendanceStatusT,
  AttendanceStatusUpdateParamsT,
  AttendanceStatusDeleteParamsT,
} from "../attendance-status.types";

export const useAttendanceStatusController = () => {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectItems);
  const status = useAppSelector(selectStatus);
  const error = useAppSelector(selectError);

  const loadItems = useCallback(
    async (params?: AttendanceStatusListParamsT) => {
      dispatch(loadPending());
      try {
        const result = await attendanceStatusService.list(
          params ?? { page: 1, pageSize: 100 },
        );
        dispatch(loadSuccess(result));
      } catch (err) {
        dispatch(
          loadError(
            err instanceof Error ? err.message : "Error al cargar estados de asistencia",
          ),
        );
      }
    },
    [dispatch],
  );

  const createItem = useCallback(
    async (params: AttendanceStatusCreateParamsT): Promise<AttendanceStatusT> => {
      try {
        const created = await attendanceStatusService.create(params);
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
    async (params: AttendanceStatusUpdateParamsT): Promise<AttendanceStatusT> => {
      try {
        const updated = await attendanceStatusService.update(params);
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

  const deleteItem = useCallback(
    async (params: AttendanceStatusDeleteParamsT): Promise<SoftDeleteResponseT> => {
      try {
        const response = await attendanceStatusService.softDelete(params);
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
    items,
    isLoading: status === "loading",
    error,
    loadItems,
    createItem,
    updateItem,
    deleteItem,
  };
};

export type AttendanceStatusControllerT = ReturnType<typeof useAttendanceStatusController>;
