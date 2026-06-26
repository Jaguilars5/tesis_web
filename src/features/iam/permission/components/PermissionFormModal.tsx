import { useFormik } from "formik";
import { X } from "lucide-react";
import { inputClassname } from "@app/styles/styles";
import { CustomInput } from "@shared/components/Form";
import { ErrrosInForm } from "@shared/components/ErrrosInForm";
import type { SubmitErrorState } from "@shared/utils/validationErrors";
import { permissionSchema } from "../permission.utils";
import type {
  PermissionFormValues,
  PermissionT,
} from "../permission.types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  isEdit: boolean;
  editingItem: PermissionT | null;
  onSubmit: (values: PermissionFormValues) => Promise<void>;
  submitErrors: SubmitErrorState;
}

const getFieldLabel = (field: string): string =>
  ({ code: "Código", description: "Descripción", module: "Módulo" }[field] || field);

const buildInitialValues = (
  editing?: PermissionT | null,
): PermissionFormValues => {
  if (editing)
    return {
      code: editing.code,
      description: editing.description,
      module: editing.module,
    };
  return { code: "", description: "", module: "" };
};

export const PermissionFormModal: React.FC<Props> = ({
  isOpen,
  onClose,
  isEdit,
  editingItem,
  onSubmit,
  submitErrors,
}) => {
  const formik = useFormik<PermissionFormValues>({
    initialValues: buildInitialValues(editingItem),
    validationSchema: permissionSchema,
    onSubmit: async (values) => {
      await onSubmit(values);
    },
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={formik.isSubmitting ? undefined : onClose}
      />
      <div className="relative w-full max-w-md animate-slide-up overflow-hidden rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              {isEdit ? "Editar Permiso" : "Nuevo Permiso"}
            </h3>
            <p className="mt-0.5 text-sm text-slate-500">
              {isEdit
                ? "Modifique los datos del permiso"
                : "Ingrese los datos del nuevo permiso"}
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

        <ErrrosInForm submitErrors={submitErrors} getFieldLabel={getFieldLabel} />

        <form onSubmit={formik.handleSubmit} className="space-y-4 p-5">
          <CustomInput
            label="Código"
            name="code"
            value={formik.values.code}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            type="text"
            error={formik.touched.code ? formik.errors.code : undefined}
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
          <CustomInput
            label="Módulo"
            name="module"
            value={formik.values.module}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            type="text"
            error={formik.touched.module ? formik.errors.module : undefined}
            className={inputClassname}
            disabled={formik.isSubmitting}
          />

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
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
            >
              {formik.isSubmitting ? (
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
      </div>
    </div>
  );
};
