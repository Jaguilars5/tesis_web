import { useFormik } from "formik";
import { X } from "lucide-react";
import { useEffect } from "react";

import { checkboxClassname, inputClassname } from "@app/styles/styles";
import { CustomCheckbox, CustomInput } from "@shared/components/Form";

import { periodTypeSchema } from "../period-types.utils";

import type { PeriodTypeFormValues, PeriodTypeT } from "../period-types.types";
import type { SubmitErrorState } from "../period-types.controller";

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

export const PeriodTypeFormModal = ({
  isOpen,
  onClose,
  isEdit,
  editingPeriodType,
  onSubmit,
  submitErrors,
}: PeriodTypeFormModalProps) => {
  const getInitialValues = (): PeriodTypeFormValues => {
    if (editingPeriodType) {
      return {
        code: editingPeriodType.code,
        name: editingPeriodType.name,
        description: editingPeriodType.description,
        divisions_per_year: editingPeriodType.divisions_per_year,
        is_active: editingPeriodType.is_active,
      };
    }
    return {
      code: "",
      name: "",
      description: "",
      divisions_per_year: 1,
      is_active: true,
    };
  };

  const formik = useFormik<PeriodTypeFormValues>({
    initialValues: getInitialValues(),
    validationSchema: periodTypeSchema,
    enableReinitialize: true,
    onSubmit,
  });

  useEffect(() => {
    if (isOpen && editingPeriodType) {
      formik.setValues(getInitialValues());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, editingPeriodType]);

  if (!isOpen) return null;

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
                  Error al guardar el tipo de periodo
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

          {isEdit && (
            <div className="flex items-end pb-1">
              <CustomCheckbox
                name="is_active"
                checked={formik.values.is_active}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                label="Activo"
                className={checkboxClassname}
              />
            </div>
          )}

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
