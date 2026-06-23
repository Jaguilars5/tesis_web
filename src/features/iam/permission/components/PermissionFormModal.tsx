import { useFormik } from "formik";
import { X } from "lucide-react";

import { inputClassname } from "@app/styles/styles";
import { CustomInput } from "@shared/components/Form";

import { permissionSchema } from "../permission.utils";

import type { SubmitErrorState } from "../permission.controller";
import type {
  PermissionFormValues,
  PermissionT,
} from "../permission.types";

const getFieldLabel = (field: string): string => {
  const labels: Record<string, string> = {
    code: "Código",
    description: "Descripción",
    module: "Módulo",
  };
  return labels[field] || field;
};

interface PermissionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEdit: boolean;
  editing: PermissionT | null;
  onSubmit: (values: PermissionFormValues) => Promise<void>;
  submitErrors: SubmitErrorState;
}

const buildInitialValues = (
  item: PermissionT | null,
): PermissionFormValues => {
  if (!item) {
    return { code: "", description: "", module: "" };
  }
  return {
    code: item.code,
    description: item.description,
    module: item.module,
  };
};

export const PermissionFormModal = ({
  isOpen,
  onClose,
  isEdit,
  editing,
  onSubmit,
  submitErrors,
}: PermissionFormModalProps) => {
  const formik = useFormik<PermissionFormValues>({
    initialValues: buildInitialValues(editing),
    enableReinitialize: true,
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
                  Error al guardar el permiso
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
      </div>
    </div>
  );
};
