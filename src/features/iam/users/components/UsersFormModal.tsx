import { useFormik } from "formik";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { inputClassname, selectClassname } from "@app/styles/styles";
import { CustomInput, CustomSelect } from "@shared/components/Form";
import { ErrrosInForm } from "@shared/components/ErrrosInForm";
import type { SubmitErrorState } from "@shared/utils/validationErrors";
import { userCreateSchema, userEditSchema } from "../users.utils";
import { roleService } from "@features/iam/roles/roles.service";
import type {
  UserCreateFormValues,
  UserEditFormValues,
  UserT,
} from "../users.types";

interface Option {
  label: string;
  value: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  isEdit: boolean;
  editingItem: UserT | null;
  submitErrors: SubmitErrorState;
  onCreate: (values: UserCreateFormValues) => Promise<void>;
  onUpdate: (values: UserEditFormValues) => Promise<void>;
}

const getFieldLabel = (field: string): string =>
  ({
    document_number: "Número de documento",
    names: "Nombres",
    last_names: "Apellidos",
    email: "Email",
    password: "Contraseña",
    role_id: "Rol",
  }[field] || field);

const createInitialValues: UserCreateFormValues = {
  document_number: "",
  names: "",
  last_names: "",
  email: "",
  password: "",
  role_id: 0,
};

const buildEditInitialValues = (item: UserT | null): UserEditFormValues => {
  if (!item) return { email: "", role_id: 0 };
  return { email: item.email, role_id: item.role_id ?? 0 };
};

export const UsersFormModal: React.FC<Props> = ({
  isOpen,
  onClose,
  isEdit,
  editingItem,
  submitErrors,
  onCreate,
  onUpdate,
}) => {
  const [roleOptions, setRoleOptions] = useState<Option[]>([]);

  useEffect(() => {
    if (isOpen) {
      roleService
        .list({ page: 1, pageSize: 100 })
        .then((roles) =>
          setRoleOptions(
            roles.map((r) => ({ label: r.name, value: String(r.id) })),
          ),
        )
        .catch(() => {});
    }
  }, [isOpen]);

  const createFormik = useFormik<UserCreateFormValues>({
    initialValues: createInitialValues,
    validationSchema: userCreateSchema,
    onSubmit: async (values) => {
      await onCreate(values);
    },
  });

  const editFormik = useFormik<UserEditFormValues>({
    initialValues: buildEditInitialValues(editingItem),
    validationSchema: userEditSchema,
    onSubmit: async (values) => {
      await onUpdate(values);
    },
  });

  if (!isOpen) return null;

  const isSubmitting = isEdit ? editFormik.isSubmitting : createFormik.isSubmitting;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={isSubmitting ? undefined : onClose}
      />
      <div className="relative w-full max-w-md animate-slide-up overflow-hidden rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              {isEdit ? "Editar Usuario" : "Nuevo Usuario"}
            </h3>
            <p className="mt-0.5 text-sm text-slate-500">
              {isEdit
                ? "Modifique los datos del usuario"
                : "Ingrese los datos del nuevo usuario"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X className="size-5" />
          </button>
        </div>

        {(submitErrors.general.length > 0 || Object.keys(submitErrors.validation).length > 0) && (
          <ErrrosInForm submitErrors={submitErrors} getFieldLabel={getFieldLabel} />
        )}

        {isEdit ? (
          <form onSubmit={editFormik.handleSubmit} className="space-y-4 p-5">
            <CustomInput
              label="Email"
              name="email"
              value={editFormik.values.email}
              onBlur={editFormik.handleBlur}
              onChange={editFormik.handleChange}
              type="email"
              error={editFormik.touched.email ? editFormik.errors.email : undefined}
              className={inputClassname}
              disabled={editFormik.isSubmitting}
            />
            <CustomSelect
              label="Rol"
              name="role_id"
              value={String(editFormik.values.role_id)}
              onBlur={editFormik.handleBlur}
              onChange={(option) =>
                editFormik.setFieldValue("role_id", Number(option.value))
              }
              error={editFormik.touched.role_id ? editFormik.errors.role_id : undefined}
              options={roleOptions}
              className={selectClassname}
              disabled={editFormik.isSubmitting}
            />
            <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={editFormik.isSubmitting}
                className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={editFormik.isSubmitting}
                className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
              >
                {editFormik.isSubmitting ? (
                  <><span className="mr-2 size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />Guardando...</>
                ) : "Guardar"}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={createFormik.handleSubmit} className="space-y-4 p-5">
            <CustomInput
              label="Número de Documento"
              name="document_number"
              value={createFormik.values.document_number}
              onBlur={createFormik.handleBlur}
              onChange={createFormik.handleChange}
              type="text"
              error={createFormik.touched.document_number ? createFormik.errors.document_number : undefined}
              className={inputClassname}
              disabled={createFormik.isSubmitting}
            />
            <div className="grid grid-cols-2 gap-4">
              <CustomInput
                label="Nombres"
                name="names"
                value={createFormik.values.names}
                onBlur={createFormik.handleBlur}
                onChange={createFormik.handleChange}
                type="text"
                error={createFormik.touched.names ? createFormik.errors.names : undefined}
                className={inputClassname}
                disabled={createFormik.isSubmitting}
              />
              <CustomInput
                label="Apellidos"
                name="last_names"
                value={createFormik.values.last_names}
                onBlur={createFormik.handleBlur}
                onChange={createFormik.handleChange}
                type="text"
                error={createFormik.touched.last_names ? createFormik.errors.last_names : undefined}
                className={inputClassname}
                disabled={createFormik.isSubmitting}
              />
            </div>
            <CustomInput
              label="Email"
              name="email"
              value={createFormik.values.email}
              onBlur={createFormik.handleBlur}
              onChange={createFormik.handleChange}
              type="email"
              error={createFormik.touched.email ? createFormik.errors.email : undefined}
              className={inputClassname}
              disabled={createFormik.isSubmitting}
            />
            <CustomInput
              label="Contraseña"
              name="password"
              value={createFormik.values.password}
              onBlur={createFormik.handleBlur}
              onChange={createFormik.handleChange}
              type="password"
              error={createFormik.touched.password ? createFormik.errors.password : undefined}
              className={inputClassname}
              disabled={createFormik.isSubmitting}
            />
            <CustomSelect
              label="Rol"
              name="role_id"
              value={String(createFormik.values.role_id)}
              onBlur={createFormik.handleBlur}
              onChange={(option) =>
                createFormik.setFieldValue("role_id", Number(option.value))
              }
              error={createFormik.touched.role_id ? createFormik.errors.role_id : undefined}
              options={roleOptions}
              className={selectClassname}
              disabled={createFormik.isSubmitting}
            />
            <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={createFormik.isSubmitting}
                className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={createFormik.isSubmitting}
                className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
              >
                {createFormik.isSubmitting ? (
                  <><span className="mr-2 size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />Guardando...</>
                ) : "Guardar"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
