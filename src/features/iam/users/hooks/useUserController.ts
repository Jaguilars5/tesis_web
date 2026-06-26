import { useAppDispatch, useAppSelector } from "@shared/redux/hooks";
import { toRejectValue } from "@shared/utils/validationErrors";
import { useCallback } from "react";
import { userService } from "../users.service";
import {
  loadPending,
  loadSuccess,
  loadError,
  entityCreated,
  entityUpdated,
  entityDeleted,
  mutationError,
  selectUsers,
  selectUsersStatus,
  selectUsersError,
} from "../users.slice";
import type {
  UserCreateParamsT,
  UserDeleteParamsT,
  UserListParamsT,
  UserT,
  UserUpdateParamsT,
} from "../users.types";
import type { SoftDeleteResponseT } from "@shared/types/soft-delete.types";

export const useUserController = () => {
  const dispatch = useAppDispatch();
  const users = useAppSelector(selectUsers);
  const status = useAppSelector(selectUsersStatus);
  const error = useAppSelector(selectUsersError);

  const loadUsers = useCallback(
    async (params?: UserListParamsT) => {
      dispatch(loadPending());
      try {
        const items = await userService.list(
          params ?? { page: 1, pageSize: 100 },
        );
        dispatch(loadSuccess(items));
      } catch (err) {
        dispatch(loadError(err instanceof Error ? err.message : "Error al cargar usuarios"));
      }
    },
    [dispatch],
  );

  const createUser = useCallback(
    async (data: UserCreateParamsT): Promise<UserT> => {
      try {
        const created = await userService.create(data);
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

  const updateUser = useCallback(
    async (params: UserUpdateParamsT): Promise<UserT> => {
      try {
        const updated = await userService.update(params);
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

  const deleteUser = useCallback(
    async (params: UserDeleteParamsT): Promise<SoftDeleteResponseT> => {
      try {
        const response = await userService.softDelete(params);
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

  const changePassword = useCallback(
    async (id: number, newPassword: string): Promise<void> => {
      try {
        await userService.changePassword(id, newPassword);
      } catch (err) {
        dispatch(mutationError(err instanceof Error ? err.message : "Error al cambiar contraseña"));
        throw err;
      }
    },
    [dispatch],
  );

  return {
    users,
    isLoading: status === "loading",
    error,
    loadUsers,
    createUser,
    updateUser,
    deleteUser,
    changePassword,
  };
};

export type UserControllerT = ReturnType<typeof useUserController>;
