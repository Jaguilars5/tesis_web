import { useFormik } from "formik";
import { X } from "lucide-react";

import { inputClassname } from "@app/styles/styles";
import { CustomInput } from "@shared/components/Form";
import { ErrrosInForm } from "@shared/components/ErrrosInForm";
import type { SubmitErrorState } from "@shared/utils/validationErrors";

import { periodTypeSchema } from "../period-types.utils";

import type {
  PeriodTypeFormValues,
  PeriodTypeT,
} from "../period-types.types";

const getFieldLabel = (field: string): string => {
  const labels: Record<string, string> = {
    code: "Código",
    name: "Nombre",
    description: "Descripción",
    divisions_per_year: "Divisiones por año",
    non_field_errors: "Error general",
  };
  return labels[field] || field;
};

interface PeriodTypeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEdit: boolean;
  editingPeriodType: PeriodTypeT | null;
  onSubmit: (values: PeriodTypeFormValues) => Promise<void>;
  submitErrors: SubmitErrorState;
}

export const PeriodTypeFormModal: React.FC<PeriodTypeFormModalProps> = ({
  isOpen,
  onClose,
  isEdit,
  editingPeriodType,
  onSubmit,
  submitErrors,
}) => {
  const getInitialValues = (): PeriodTypeFormValues => {
    if (editingPeriodType) {
      return {
        code: editingPeriodType.code,
        name: editingPeriodType.name,
        description: editingPeriodType.description,
        divisions_per_year: editingPeriodType.divisions_per_year,
      };
    }
    return {
      code: "",
      name: "",
      description: "",
      divisions_per_year: 1,
    };
  };

  const formik = useFormik<PeriodTypeFormValues>({
    initialValues: getInitialValues(),
    validationSchema: periodTypeSchema,
    onSubmit,
  });

  if (!isOpen) return null;

  const hasSubmitErrors =
    submitErrors.general.length > 0 ||
    Object.keys(submitErrors.validation).length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-md animate-slide-up overflow-hidden rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              {isEdit ? "Editar Tipo de Periodo" : "Nuevo Tipo de Periodo"}
            </h3>
            <p className="mt-0.5 text-sm text-slate-500">
              Configure el tipo de periodo académico
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

        {hasSubmitErrors && (
          <ErrrosInForm
            submitErrors={submitErrors}
            getFieldLabel={getFieldLabel}
          />
        )}

        <form onSubmit={formik.handleSubmit} className="space-y-4 p-5">
          <div className="grid grid-cols-2 gap-4">
            <CustomInput
              label="Código"
              name="code"
              placeholder="Ej: QUIMESTRE_1"
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
              placeholder="Ej: Quimestre 1"
              value={formik.values.name}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="text"
              error={formik.touched.name ? formik.errors.name : undefined}
              className={inputClassname}
            />
          </div>

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

          <CustomInput
            label="Divisiones por año"
            name="divisions_per_year"
            placeholder="Ej: 3"
            value={formik.values.divisions_per_year}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            type="number"
            min={1}
            max={12}
            error={
              formik.touched.divisions_per_year
                ? formik.errors.divisions_per_year
                : undefined
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
              className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
            >
              {formik.isSubmitting ? (
                <>
                  <span className="mr-2 inline-block size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
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
