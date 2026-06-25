import { useFormik } from "formik";
import { useEffect } from "react";
import { inputClassname } from "@app/styles/styles";
import { CustomInput } from "@shared/components/Form";
import { schoolYearSchema } from "../school-year.utils";

import type { SchoolYearFormValuesT, SchoolYearT } from "../school-year.types";
import type { SubmitErrorState } from "@shared/utils/validationErrors";
import { X } from "lucide-react";
import { ErrrosInForm } from "@shared/components/ErrrosInForm";

interface SchoolYearFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEdit: boolean;
  editingSchoolYear: SchoolYearT | null;
  onSubmit: (values: SchoolYearFormValuesT) => Promise<void>;
  submitErrors: SubmitErrorState;
}

const getFieldLabel = (f: string): string =>
  ({
    start_date: "Fecha de Inicio",
    end_date: "Fecha de Fin",
    non_field_errors: "Error general",
  })[f] || f;

export const SchoolYearFormModal: React.FC<SchoolYearFormModalProps> = ({
  isOpen,
  onClose,
  isEdit,
  editingSchoolYear,
  onSubmit,
  submitErrors,
}) => {
  const getInitialValues = (): SchoolYearFormValuesT => {
    if (editingSchoolYear)
      return {
        start_date: editingSchoolYear.start_date,
        end_date: editingSchoolYear.end_date,
      };
    return { start_date: "", end_date: "" };
  };

  const formik = useFormik<SchoolYearFormValuesT>({
    initialValues: getInitialValues(),
    validationSchema: schoolYearSchema,
    enableReinitialize: true,
    onSubmit,
  });

  useEffect(() => {
    if (isOpen && editingSchoolYear) formik.setValues(getInitialValues());
  }, [isOpen, editingSchoolYear]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-md animate-slide-up overflow-hidden rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              {isEdit ? "Editar" : "Nuevo"} Año Escolar
            </h3>
            <p className="mt-0.5 text-sm text-slate-500">
              Configure el año escolar
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
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
          <div className="grid grid-cols-2 gap-4">
            <CustomInput
              label="Fecha de Inicio"
              name="start_date"
              type="date"
              value={formik.values.start_date}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              error={
                formik.touched.start_date ? formik.errors.start_date : undefined
              }
              className={inputClassname}
            />
            <CustomInput
              label="Fecha de Fin"
              name="end_date"
              type="date"
              value={formik.values.end_date}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              error={
                formik.touched.end_date ? formik.errors.end_date : undefined
              }
              className={inputClassname}
            />
          </div>
          <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-60"
            >
              {formik.isSubmitting ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
