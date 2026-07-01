import { useFormik } from "formik";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { inputClassname } from "@app/styles/styles";
import { CustomInput } from "@shared/components/Form";
import { ErrrosInForm } from "@shared/components/ErrrosInForm";
import { extractError } from "@shared/utils/validationErrors";
import type { SubmitErrorState } from "@shared/utils/validationErrors";
import { roleSchema } from "../roles.utils";
import type {
  RoleAssignPermissionsDataT,
  RoleFormValues,
  RoleT,
} from "../roles.types";
import type { PermissionT } from "@features/iam/permission/permission.types";
import { permissionService } from "@features/iam/permission/permission.service";
import type { RoleControllerT } from "../hooks/useRoleController";

const getFieldLabel = (field: string): string =>
  ({ name: "Nombre", description: "Descripción" }[field] || field);

interface Props {
  isOpen: boolean;
  onClose: () => void;
  isEdit: boolean;
  editingItem: RoleT | null;
  createRole: RoleControllerT["createRole"];
  updateRole: RoleControllerT["updateRole"];
  assignPermissions: (id: number, payload: RoleAssignPermissionsDataT) => Promise<void>;
}

const buildInitialValues = (item: RoleT | null): RoleFormValues => {
  if (!item) return { name: "", description: "" };
  return { name: item.name, description: item.description };
};

export const RolesFormModal: React.FC<Props> = ({
  isOpen,
  onClose,
  isEdit,
  editingItem,
  createRole,
  updateRole,
  assignPermissions,
}) => {
  const [permissions, setPermissions] = useState<PermissionT[]>([]);
  const [selectedCodes, setSelectedCodes] = useState<string[]>([]);
  const [submitErrors, setSubmitErrors] = useState<SubmitErrorState>({
    general: [],
    validation: {},
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      permissionService.list({ page: 1, pageSize: 200 })
        .then(setPermissions)
        .catch(() => {});
    }
  }, [isOpen]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedCodes(isEdit && editingItem?.role_permissions
      ? editingItem.role_permissions.map((rp) => rp.permission.code)
      : []);
  }, [isEdit, editingItem]);

  const formik = useFormik<RoleFormValues>({
    initialValues: buildInitialValues(editingItem),
    validationSchema: roleSchema,
    onSubmit: async (values) => {
      setSubmitting(true);
      setSubmitErrors({ general: [], validation: {} });
      try {
        if (isEdit && editingItem) {
          await updateRole({ id: editingItem.id, data: { description: values.description } });
          if (selectedCodes.length > 0) {
            await assignPermissions(editingItem.id, { permission_codes: selectedCodes });
          }
        } else {
          const created = await createRole({ name: values.name, description: values.description });
          if (selectedCodes.length > 0) {
            await assignPermissions(created.id, { permission_codes: selectedCodes });
          }
        }
        onClose();
      } catch (err) {
        const { general, validation } = extractError(err);
        setSubmitErrors({ general, validation });
      } finally {
        setSubmitting(false);
      }
    },
  });

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
        onClick={submitting ? undefined : onClose}
      />
      <div className="relative w-full max-w-2xl animate-slide-up overflow-hidden rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              {isEdit ? "Editar Rol" : "Nuevo Rol"}
            </h3>
            <p className="mt-0.5 text-sm text-slate-500">
              {isEdit
                ? "Modifique la descripción y asigne permisos"
                : "Ingrese los datos del nuevo rol"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X className="size-5" />
          </button>
        </div>

        {(submitErrors.general.length > 0 || Object.keys(submitErrors.validation).length > 0) && (
          <ErrrosInForm submitErrors={submitErrors} getFieldLabel={getFieldLabel} />
        )}

        <form onSubmit={formik.handleSubmit} className="space-y-4 p-5">
          <CustomInput
            label="Nombre"
            name="name"
            value={formik.values.name}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            type="text"
            error={formik.touched.name ? formik.errors.name : undefined}
            className={inputClassname}
            disabled={submitting || isEdit}
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
            disabled={submitting}
          />

          <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Guardando...
                </>
              ) : (
                "Guardar"
              )}
            </button>
          </div>
        </form>

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
                        onChange={() =>
                          setSelectedCodes((prev) =>
                            prev.includes(perm.code)
                              ? prev.filter((c) => c !== perm.code)
                              : [...prev, perm.code],
                          )
                        }
                        className="size-4 rounded border-slate-300 text-primary focus:ring-primary"
                      />
                      <span className="text-xs text-slate-600">
                        {perm.description}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
