import { useAppDispatch, useAppSelector } from "@shared/redux/hooks";
import { toRejectValue } from "@shared/utils/validationErrors";
import { useCallback } from "react";
import { roleService } from "../roles.service";
import {
  loadPending,
  loadSuccess,
  loadError,
  entityCreated,
  entityUpdated,
  entityDeleted,
  mutationError,
  selectRoles,
  selectRolesStatus,
  selectRolesError,
} from "../roles.slice";
import type {
  RoleAssignPermissionsDataT,
  RoleCreateParamsT,
  RoleDeleteParamsT,
  RoleListParamsT,
  RoleT,
  RoleUpdateParamsT,
} from "../roles.types";
import type { SoftDeleteResponseT } from "@shared/types/soft-delete.types";

export const useRoleController = () => {
  const dispatch = useAppDispatch();
  const roles = useAppSelector(selectRoles);
  const status = useAppSelector(selectRolesStatus);
  const error = useAppSelector(selectRolesError);

  const loadRoles = useCallback(
    async (params?: RoleListParamsT) => {
      dispatch(loadPending());
      try {
        const items = await roleService.list(
          params ?? { page: 1, pageSize: 100 },
        );
        dispatch(loadSuccess(items));
      } catch (err) {
        dispatch(loadError(err instanceof Error ? err.message : "Error al cargar roles"));
      }
    },
    [dispatch],
  );

  const createRole = useCallback(
    async (data: RoleCreateParamsT): Promise<RoleT> => {
      try {
        const created = await roleService.create(data);
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

  const updateRole = useCallback(
    async (params: RoleUpdateParamsT): Promise<RoleT> => {
      try {
        const updated = await roleService.update(params);
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

  const deleteRole = useCallback(
    async (params: RoleDeleteParamsT): Promise<SoftDeleteResponseT> => {
      try {
        const response = await roleService.softDelete(params);
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

  const assignPermissions = useCallback(
    async (id: number, payload: RoleAssignPermissionsDataT): Promise<void> => {
      try {
        await roleService.assignPermissions(id, payload);
      } catch (err) {
        dispatch(mutationError(err instanceof Error ? err.message : "Error al asignar permisos"));
        throw err;
      }
    },
    [dispatch],
  );

  return {
    roles,
    isLoading: status === "loading",
    error,
    loadRoles,
    createRole,
    updateRole,
    deleteRole,
    assignPermissions,
  };
};

export type RoleControllerT = ReturnType<typeof useRoleController>;
