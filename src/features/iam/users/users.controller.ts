import { useAppDispatch, useAppSelector } from "@shared/redux/hooks";
import { useCallback, useState } from "react";

import { userService } from "./users.service";
import {
  loadError,
  loadPending,
  loadSuccess,
  mutationError,
  entityCreated,
  entityUpdated,
  entityDeleted,
  selectUsersError,
  selectUsers,
  selectUsersStatus,
} from "./users.slice";
import type {
  UserCreateParamsT,
  UserDeleteParamsT,
  UserListParamsT,
  UserT,
  UserUpdateParamsT,
  UserCreateFormValues,
  UserEditFormValues,
} from "./users.types";

export type CreateUserRejectValue = {
  msg: string;
  data: Record<string, string> | null;
};

const toRejectValue = (error: unknown): CreateUserRejectValue => {
  const msg = error instanceof Error ? error.message : "Error desconocido";
  const cause =
    error instanceof Error ? (error as { cause?: unknown }).cause : undefined;
  const responseData = (cause as { response?: { data?: { data?: unknown } } })
    ?.response?.data;
  return {
    msg,
    data: (responseData?.data as Record<string, string> | null) ?? null,
  };
};

export const useUserController = () => {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectUsers);
  const status = useAppSelector(selectUsersStatus);
  const error = useAppSelector(selectUsersError);

  const loadItems = useCallback(
    async (params?: UserListParamsT) => {
      dispatch(loadPending());
      try {
        const items = await userService.list(
          params ?? { page: 1, pageSize: 100 },
        );
        dispatch(loadSuccess(items));
      } catch (err) {
        dispatch(
          loadError(
            err instanceof Error ? err.message : "Error al cargar usuarios",
          ),
        );
      }
    },
    [dispatch],
  );

  const create = useCallback(
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

  const update = useCallback(
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

  const remove = useCallback(
    async (id: UserDeleteParamsT): Promise<void> => {
      try {
        const { id: deletedId } = await userService.softDelete(id);
        dispatch(entityDeleted(deletedId));
      } catch (err) {
        dispatch(
          mutationError(
            err instanceof Error ? err.message : "Error al eliminar usuario",
          ),
        );
      }
    },
    [dispatch],
  );

  const changePassword = useCallback(
    async (id: number, newPassword: string): Promise<void> => {
      try {
        await userService.changePassword(id, newPassword);
      } catch (err) {
        dispatch(
          mutationError(
            err instanceof Error
              ? err.message
              : "Error al cambiar contraseña",
          ),
        );
        throw err;
      }
    },
    [dispatch],
  );

  return {
    items,
    isLoading: status === "loading",
    error,
    loadItems,
    create,
    update,
    remove,
    changePassword,
  };
};

export type UserControllerT = ReturnType<typeof useUserController>;

export type ValidationErrors = Record<string, string>;

export interface SubmitErrorState {
  general: string[];
  validation: ValidationErrors;
}

const extractError = (error: unknown) => {
  if (
    error &&
    typeof error === "object" &&
    "msg" in error &&
    typeof (error as { msg?: unknown }).msg === "string"
  ) {
    const obj = error as CreateUserRejectValue;
    const fieldErrors: ValidationErrors = {};
    const general: string[] = [];
    if (obj.data && typeof obj.data === "object") {
      for (const [key, value] of Object.entries(obj.data)) {
        if (typeof value === "string") {
          fieldErrors[key] = value;
        } else {
          general.push(`${key}: ${value}`);
        }
      }
    }
    if (general.length === 0 && Object.keys(fieldErrors).length === 0) {
      general.push(obj.msg);
    }
    return { msg: obj.msg, general, validation: fieldErrors };
  }
  const msg = error instanceof Error ? error.message : "Error desconocido";
  return { msg, general: [msg], validation: {} };
};

interface UseUserFormArgs {
  create: UserControllerT["create"];
  update: UserControllerT["update"];
}

export const useUserForm = ({ create, update }: UseUserFormArgs) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<UserT | null>(null);
  const [submitErrors, setSubmitErrors] = useState<SubmitErrorState>({
    general: [],
    validation: {},
  });
  const isEdit = !!editing;

  const openModal = useCallback((entity?: UserT) => {
    setEditing(entity ?? null);
    setSubmitErrors({ general: [], validation: {} });
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setEditing(null);
    setSubmitErrors({ general: [], validation: {} });
  }, []);

  const handleCreate = useCallback(
    async (values: UserCreateFormValues) => {
      setSubmitErrors({ general: [], validation: {} });
      try {
        await create({
          document_number: values.document_number,
          names: values.names,
          last_names: values.last_names,
          email: values.email,
          password: values.password,
          role_id: values.role_id,
        });
        closeModal();
      } catch (error) {
        const parsed = extractError(error);
        setSubmitErrors({ general: parsed.general, validation: parsed.validation });
      }
    },
    [create, closeModal],
  );

  const handleUpdate = useCallback(
    async (values: UserEditFormValues) => {
      setSubmitErrors({ general: [], validation: {} });
      if (!editing) return;
      try {
        await update({ id: editing.id, data: values });
        closeModal();
      } catch (error) {
        const parsed = extractError(error);
        setSubmitErrors({ general: parsed.general, validation: parsed.validation });
      }
    },
    [editing, update, closeModal],
  );

  return {
    isOpen,
    isEdit,
    editing,
    submitErrors,
    openModal,
    closeModal,
    handleCreate,
    handleUpdate,
  };
};
