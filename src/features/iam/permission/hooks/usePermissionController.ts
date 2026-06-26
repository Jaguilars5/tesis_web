import { useAppDispatch, useAppSelector } from "@shared/redux/hooks";
import { toRejectValue } from "@shared/utils/validationErrors";
import { useCallback } from "react";
import { permissionService } from "../permission.service";
import {
  loadPending,
  loadSuccess,
  loadError,
  entityCreated,
  entityUpdated,
  entityDeleted,
  mutationError,
  selectPermissions,
  selectPermissionsStatus,
  selectPermissionsError,
} from "../permission.slice";
import type {
  PermissionCreateParamsT,
  PermissionDeleteParamsT,
  PermissionListParamsT,
  PermissionT,
  PermissionUpdateParamsT,
} from "../permission.types";
import type { SoftDeleteResponseT } from "@shared/types/soft-delete.types";

export const usePermissionController = () => {
  const dispatch = useAppDispatch();
  const permissions = useAppSelector(selectPermissions);
  const status = useAppSelector(selectPermissionsStatus);
  const error = useAppSelector(selectPermissionsError);

  const loadPermissions = useCallback(
    async (params?: PermissionListParamsT) => {
      dispatch(loadPending());
      try {
        const items = await permissionService.list(
          params ?? { page: 1, pageSize: 100 },
        );
        dispatch(loadSuccess(items));
      } catch (err) {
        dispatch(loadError(err instanceof Error ? err.message : "Error al cargar permisos"));
      }
    },
    [dispatch],
  );

  const createPermission = useCallback(
    async (data: PermissionCreateParamsT): Promise<PermissionT> => {
      try {
        const created = await permissionService.create(data);
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

  const updatePermission = useCallback(
    async (params: PermissionUpdateParamsT): Promise<PermissionT> => {
      try {
        const updated = await permissionService.update(params);
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

  const deletePermission = useCallback(
    async (params: PermissionDeleteParamsT): Promise<SoftDeleteResponseT> => {
      try {
        const response = await permissionService.softDelete(params);
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
    permissions,
    isLoading: status === "loading",
    error,
    loadPermissions,
    createPermission,
    updatePermission,
    deletePermission,
  };
};

export type PermissionControllerT = ReturnType<typeof usePermissionController>;
