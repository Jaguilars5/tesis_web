import { useAppDispatch, useAppSelector } from "@shared/redux/hooks";
import { useCallback, useState } from "react";

import { roleService } from "./roles.service";
import {
  loadError,
  loadPending,
  loadSuccess,
  mutationError,
  entityCreated,
  entityUpdated,
  entityDeleted,
  selectRolesError,
  selectRoles,
  selectRolesStatus,
} from "./roles.slice";
import type {
  RoleCreateDataT,
  RoleCreateParamsT,
  RoleDeleteParamsT,
  RoleFormValues,
  RoleListParamsT,
  RoleT,
  RoleUpdateParamsT,
  RoleAssignPermissionsDataT,
} from "./roles.types";

export type CreateRoleRejectValue = {
  msg: string;
  data: Record<string, string> | null;
};

const toRejectValue = (error: unknown): CreateRoleRejectValue => {
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

export const useRoleController = () => {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectRoles);
  const status = useAppSelector(selectRolesStatus);
  const error = useAppSelector(selectRolesError);

  const loadItems = useCallback(
    async (params?: RoleListParamsT) => {
      dispatch(loadPending());
      try {
        const items = await roleService.list(
          params ?? { page: 1, pageSize: 100 },
        );
        dispatch(loadSuccess(items));
      } catch (err) {
        dispatch(
          loadError(
            err instanceof Error ? err.message : "Error al cargar roles",
          ),
        );
      }
    },
    [dispatch],
  );

  const create = useCallback(
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

  const update = useCallback(
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

  const remove = useCallback(
    async (id: RoleDeleteParamsT): Promise<void> => {
      try {
        const { id: deletedId } = await roleService.softDelete(id);
        dispatch(entityDeleted(deletedId));
      } catch (err) {
        dispatch(
          mutationError(
            err instanceof Error ? err.message : "Error al eliminar rol",
          ),
        );
      }
    },
    [dispatch],
  );

  const assignPermissions = useCallback(
    async (id: number, payload: RoleAssignPermissionsDataT): Promise<void> => {
      try {
        await roleService.assignPermissions(id, payload);
      } catch (err) {
        dispatch(
          mutationError(
            err instanceof Error ? err.message : "Error al asignar permisos",
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
    assignPermissions,
  };
};

export type RoleControllerT = ReturnType<typeof useRoleController>;

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
    const obj = error as CreateRoleRejectValue;
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

const unwrapCreate = async (
  data: RoleCreateDataT,
  create: RoleControllerT["create"],
) => {
  try {
    return {
      ok: true as const,
      result: await create(data),
      errors: { general: [], validation: {} } as SubmitErrorState,
    };
  } catch (error) {
    const parsed = extractError(error);
    return {
      ok: false as const,
      result: null,
      errors: {
        general: parsed.general,
        validation: parsed.validation,
      } as SubmitErrorState,
    };
  }
};

const unwrapUpdate = async (
  params: RoleUpdateParamsT,
  update: RoleControllerT["update"],
) => {
  try {
    return {
      ok: true as const,
      result: await update(params),
      errors: { general: [], validation: {} } as SubmitErrorState,
    };
  } catch (error) {
    const parsed = extractError(error);
    return {
      ok: false as const,
      result: null,
      errors: {
        general: parsed.general,
        validation: parsed.validation,
      } as SubmitErrorState,
    };
  }
};

interface UseRoleFormArgs {
  create: RoleControllerT["create"];
  update: RoleControllerT["update"];
}

export const useRoleForm = ({
  create,
  update,
}: UseRoleFormArgs) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<RoleT | null>(null);
  const [submitErrors, setSubmitErrors] = useState<SubmitErrorState>({
    general: [],
    validation: {},
  });
  const isEdit = !!editing;

  const openModal = useCallback((entity?: RoleT) => {
    setEditing(entity ?? null);
    setSubmitErrors({ general: [], validation: {} });
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setEditing(null);
    setSubmitErrors({ general: [], validation: {} });
  }, []);

  const handleSubmit = useCallback(
    async (values: RoleFormValues) => {
      setSubmitErrors({ general: [], validation: {} });
      if (editing) {
        const result = await unwrapUpdate(
          { id: editing.id, data: values },
          update,
        );
        if (result.ok) {
          closeModal();
          return;
        }
        setSubmitErrors(result.errors);
      } else {
        const result = await unwrapCreate(values, create);
        if (result.ok) {
          closeModal();
          return;
        }
        setSubmitErrors(result.errors);
      }
    },
    [editing, create, update, closeModal],
  );

  return { isOpen, isEdit, editing, submitErrors, openModal, closeModal, handleSubmit };
};
