import { useFormik } from "formik";
import { X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import {
  checkboxClassname,
  inputClassname,
} from "@app/styles/styles";
import { CustomCheckbox, CustomInput } from "@shared/components/Form";

import { roleSchema } from "../roles.utils";

import type { SubmitErrorState } from "../roles.controller";
import type {
  RoleAssignPermissionsDataT,
  RoleFormValues,
  RoleT,
} from "../roles.types";
import type { PermissionT } from "@features/iam/permission/permission.types";
import { permissionService } from "@features/iam/permission/permission.service";

const getFieldLabel = (field: string): string => {
  const labels: Record<string, string> = {
    name: "Nombre",
    description: "Descripción",
  };
  return labels[field] || field;
};

interface RolesFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEdit: boolean;
  editing: RoleT | null;
  onSubmit: (values: RoleFormValues) => Promise<void>;
  submitErrors: SubmitErrorState;
  roleId: number | null;
  assignPermissions: (id: number, payload: RoleAssignPermissionsDataT) => Promise<void>;
}

const buildInitialValues = (item: RoleT | null): RoleFormValues => {
  if (!item) {
    return { name: "", description: "", is_active: true };
  }
  return {
    name: item.name,
    description: item.description,
    is_active: item.is_active,
  };
};

export const RolesFormModal = ({
  isOpen,
  onClose,
  isEdit,
  editing,
  onSubmit,
  submitErrors,
  roleId,
  assignPermissions,
}: RolesFormModalProps) => {
  const [permissions, setPermissions] = useState<PermissionT[]>([]);
  const [selectedCodes, setSelectedCodes] = useState<string[]>([]);
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    if (isOpen) {
      permissionService.list({ page: 1, pageSize: 200 })
        .then(setPermissions)
        .catch(() => {});
    }
  }, [isOpen]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedCodes(isEdit && editing?.role_permissions
      ? editing.role_permissions.map((rp) => rp.permission.code)
      : []);
  }, [isEdit, editing]);

  const formik = useFormik<RoleFormValues>({
    initialValues: buildInitialValues(editing),
    enableReinitialize: true,
    validationSchema: roleSchema,
    onSubmit: async (values) => {
      await onSubmit(values);
    },
  });

  const togglePermission = useCallback((code: string) => {
    setSelectedCodes((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code],
    );
  }, []);

  const handleAssignPermissions = useCallback(async () => {
    if (!roleId) return;
    setAssigning(true);
    try {
      await assignPermissions(roleId, { permission_codes: selectedCodes });
    } finally {
      setAssigning(false);
    }
  }, [roleId, selectedCodes, assignPermissions]);

  if (!isOpen) return null;

  const groupedPermissions = permissions.reduce<Record<string, PermissionT[]>>(
    (acc, p) => {
      if (!acc[p.module]) acc[p.module] = [];
      acc[p.module].push(p);
      return acc;
    },
    {},
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={formik.isSubmitting ? undefined : onClose}
      />
      <div className="relative w-full max-w-2xl animate-slide-up overflow-hidden rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              {isEdit ? "Editar Rol" : "Nuevo Rol"}
            </h3>
            <p className="mt-0.5 text-sm text-slate-500">
              {isEdit
                ? "Modifique los datos del rol y asigne permisos"
                : "Ingrese los datos del nuevo rol"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={formik.isSubmitting}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X className="size-5" />
          </button>
        </div>

        {(submitErrors.general.length > 0 ||
          Object.keys(submitErrors.validation).length > 0) && (
          <div className="mx-5 mt-3 rounded-lg border border-red-300 bg-red-50 p-4 shadow-sm">
            <div className="flex items-start gap-2">
              <svg
                className="mt-0.5 size-5 flex-shrink-0 text-red-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="flex-1">
                <p className="mb-2 text-sm font-semibold text-red-800">
                  Error al guardar el rol
                </p>
                {submitErrors.general.length > 0 && (
                  <ul className="mb-2 space-y-1">
                    {submitErrors.general.map((err, i) => (
                      <li key={i} className="text-sm text-red-700">
                        • {err}
                      </li>
                    ))}
                  </ul>
                )}
                {Object.keys(submitErrors.validation).length > 0 && (
                  <ul className="space-y-1">
                    {Object.entries(submitErrors.validation).map(
                      ([field, message]) => (
                        <li key={field} className="text-sm text-red-700">
                          <span className="font-semibold">
                            {getFieldLabel(field)}:
                          </span>{" "}
                          {message}
                        </li>
                      ),
                    )}
                  </ul>
                )}
              </div>
            </div>
          </div>
        )}

        <form
          onSubmit={formik.handleSubmit}
          className="space-y-4 p-5"
        >
          <CustomInput
            label="Nombre"
            name="name"
            value={formik.values.name}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            type="text"
            error={formik.touched.name ? formik.errors.name : undefined}
            className={inputClassname}
            disabled={formik.isSubmitting}
          />
          <CustomInput
            label="Descripción"
            name="description"
            value={formik.values.description}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            type="text"
            error={
              formik.touched.description ? formik.errors.description : undefined
            }
            className={inputClassname}
            disabled={formik.isSubmitting}
          />

          {isEdit && (
            <CustomCheckbox
              name="is_active"
              checked={formik.values.is_active}
              onChange={(e) =>
                formik.setFieldValue("is_active", e.target.checked)
              }
              onBlur={formik.handleBlur}
              label="Activo"
              className={checkboxClassname}
              disabled={formik.isSubmitting}
            />
          )}

          <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={formik.isSubmitting}
              className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
            >
              {formik.isSubmitting ? (
                <>
                  <span className="mr-2 size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Guardando...
                </>
              ) : (
                "Guardar"
              )}
            </button>
          </div>
        </form>

        {isEdit && (
          <div className="border-t border-slate-200 p-5">
            <div className="mb-3">
              <h4 className="text-sm font-semibold text-slate-700">
                Asignar Permisos
              </h4>
              <p className="text-xs text-slate-500">
                Seleccione los permisos que tendrá este rol
              </p>
            </div>

            <div className="max-h-64 space-y-2 overflow-y-auto rounded-lg border border-slate-200 p-3">
              {Object.entries(groupedPermissions).map(([module, perms]) => (
                <div key={module}>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    {module}
                  </p>
                  <div className="ml-2 space-y-1">
                    {perms.map((perm) => (
                      <label
                        key={perm.id}
                        className="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-sm hover:bg-slate-50"
                      >
                        <input
                          type="checkbox"
                          checked={selectedCodes.includes(perm.code)}
                          onChange={() => togglePermission(perm.code)}
                          className="size-4 rounded border-slate-300 text-primary focus:ring-primary"
                        />
                        <span className="text-slate-700">{perm.code}</span>
                        <span className="text-xs text-slate-400">
                          {perm.description}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-3 flex justify-end">
              <button
                type="button"
                onClick={handleAssignPermissions}
                disabled={assigning}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
              >
                {assigning ? (
                  <>
                    <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Guardando...
                  </>
                ) : (
                  "Guardar Permisos"
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
