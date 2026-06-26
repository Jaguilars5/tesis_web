import { useFormik } from "formik";
import { X } from "lucide-react";

import { inputClassname } from "@app/styles/styles";
import { CustomInput } from "@shared/components/Form";
import { ErrrosInForm } from "@shared/components/ErrrosInForm";

import { severitySchema } from "../severity.utils";

import type { SubmitErrorState } from "@shared/utils/validationErrors";
import type { SeverityFormValues, SeverityT } from "../severity.types";

const getFieldLabel = (field: string): string => {
  const labels: Record<string, string> = {
    code: "Código",
    name: "Nombre",
    description: "Descripción",
    non_field_errors: "Error general",
  };
  return labels[field] || field;
};

interface SeverityFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEdit: boolean;
  editingSeverity: SeverityT | null;
  onSubmit: (values: SeverityFormValues) => Promise<void>;
  submitErrors: SubmitErrorState;
}

export const SeverityFormModal: React.FC<SeverityFormModalProps> = ({
  isOpen,
  onClose,
  isEdit,
  editingSeverity,
  onSubmit,
  submitErrors,
}) => {
  const getInitialValues = (): SeverityFormValues => {
    if (editingSeverity) {
      return {
        code: editingSeverity.code,
        name: editingSeverity.name,
        description: editingSeverity.description,
      };
    }
    return { code: "", name: "", description: "" };
  };

  const formik = useFormik<SeverityFormValues>({
    initialValues: getInitialValues(),
    validationSchema: severitySchema,
    onSubmit,
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-md animate-slide-up overflow-hidden rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              {isEdit ? "Editar Severidad" : "Nueva Severidad"}
            </h3>
            <p className="mt-0.5 text-sm text-slate-500">
              Configure la severidad
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="size-5" />
          </button>
        </div>

        {(submitErrors.general.length > 0 ||
          Object.keys(submitErrors.validation).length > 0) && (
          <ErrrosInForm
            submitErrors={submitErrors}
            getFieldLabel={getFieldLabel}
          />
        )}

        <form onSubmit={formik.handleSubmit} className="space-y-4 p-5">
          <CustomInput
            label="Código"
            name="code"
            placeholder="Ej: HIGH, MEDIUM"
            value={formik.values.code}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            type="text"
            error={formik.touched.code ? formik.errors.code : undefined}
            className={inputClassname}
          />
          <CustomInput
            label="Nombre"
            name="name"
            placeholder="Nombre de la severidad"
            value={formik.values.name}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            type="text"
            error={formik.touched.name ? formik.errors.name : undefined}
            className={inputClassname}
          />
          <CustomInput
            label="Descripción"
            name="description"
            placeholder="Descripción opcional"
            value={formik.values.description}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            type="text"
            error={
              formik.touched.description ? formik.errors.description : undefined
            }
            className={inputClassname}
          />
          <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
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
              ) : isEdit ? (
                "Actualizar"
              ) : (
                "Crear"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
