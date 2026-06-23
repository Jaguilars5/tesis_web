import { useAppDispatch, useAppSelector } from "@shared/redux/hooks";
import { useCallback, useState } from "react";

import { permissionService } from "./permission.service";
import {
  loadError,
  loadPending,
  loadSuccess,
  mutationError,
  entityCreated,
  entityUpdated,
  entityDeleted,
  selectPermissionsError,
  selectPermissions,
  selectPermissionsStatus,
} from "./permission.slice";
import type {
  PermissionCreateDataT,
  PermissionCreateParamsT,
  PermissionDeleteParamsT,
  PermissionFormValues,
  PermissionListParamsT,
  PermissionT,
  PermissionUpdateParamsT,
} from "./permission.types";

export type CreatePermissionRejectValue = {
  msg: string;
  data: Record<string, string> | null;
};

const toRejectValue = (error: unknown): CreatePermissionRejectValue => {
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

export const usePermissionController = () => {
  const dispatch = useAppDispatch();
  const permissions = useAppSelector(selectPermissions);
  const status = useAppSelector(selectPermissionsStatus);
  const error = useAppSelector(selectPermissionsError);

  const loadItems = useCallback(
    async (params?: PermissionListParamsT) => {
      dispatch(loadPending());
      try {
        const items = await permissionService.list(
          params ?? { page: 1, pageSize: 100 },
        );
        dispatch(loadSuccess(items));
      } catch (err) {
        dispatch(
          loadError(
            err instanceof Error ? err.message : "Error al cargar permisos",
          ),
        );
      }
    },
    [dispatch],
  );

  const create = useCallback(
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

  const update = useCallback(
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

  const remove = useCallback(
    async (id: PermissionDeleteParamsT): Promise<void> => {
      try {
        const { id: deletedId } = await permissionService.softDelete(id);
        dispatch(entityDeleted(deletedId));
      } catch (err) {
        dispatch(
          mutationError(
            err instanceof Error ? err.message : "Error al eliminar permiso",
          ),
        );
      }
    },
    [dispatch],
  );

  return {
    items: permissions,
    isLoading: status === "loading",
    error,
    loadItems,
    create,
    update,
    remove,
  };
};

export type PermissionControllerT = ReturnType<typeof usePermissionController>;

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
    const obj = error as CreatePermissionRejectValue;
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
  data: PermissionCreateDataT,
  create: PermissionControllerT["create"],
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
  params: PermissionUpdateParamsT,
  update: PermissionControllerT["update"],
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

interface UsePermissionFormArgs {
  create: PermissionControllerT["create"];
  update: PermissionControllerT["update"];
}

export const usePermissionForm = ({
  create,
  update,
}: UsePermissionFormArgs) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<PermissionT | null>(null);
  const [submitErrors, setSubmitErrors] = useState<SubmitErrorState>({
    general: [],
    validation: {},
  });
  const isEdit = !!editing;

  const openModal = useCallback((entity?: PermissionT) => {
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
    async (values: PermissionFormValues) => {
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
