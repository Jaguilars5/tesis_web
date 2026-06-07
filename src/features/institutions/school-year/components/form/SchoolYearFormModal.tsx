import { useFormik } from "formik";
import { X } from "lucide-react";
import { useEffect } from "react";

import { checkboxClassname, inputClassname } from "@app/styles/styles";
import { CustomCheckbox, CustomInput } from "@shared/components/Form";

import { schoolYearSchema } from "../../presentation/utils/school-year.validation";

import type { SchoolYearT } from "../../domain/entities/school-year.types";

interface SchoolYearFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEdit: boolean;
  editingSchoolYear: SchoolYearT | null;
  onSubmit: (values: SchoolYearFormValues) => Promise<void>;
}

export interface SchoolYearFormValues {
  name: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
}

export const SchoolYearFormModal = ({
  isOpen,
  onClose,
  isEdit,
  editingSchoolYear,
  onSubmit,
}: SchoolYearFormModalProps) => {
  const getInitialValues = (): SchoolYearFormValues => {
    if (editingSchoolYear) {
      return {
        name: editingSchoolYear.name,
        start_date: editingSchoolYear.start_date,
        end_date: editingSchoolYear.end_date,
        is_active: editingSchoolYear.is_active,
      };
    }
    return {
      name: "",
      start_date: "",
      end_date: "",
      is_active: true,
    };
  };

  const formik = useFormik<SchoolYearFormValues>({
    initialValues: getInitialValues(),
    validationSchema: schoolYearSchema,
    enableReinitialize: true,
    onSubmit,
  });

  useEffect(() => {
    if (isOpen && editingSchoolYear) {
      formik.setValues(getInitialValues());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, editingSchoolYear]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-md animate-slide-up overflow-hidden rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              {isEdit ? "Editar Año Escolar" : "Nuevo Año Escolar"}
            </h3>
            <p className="mt-0.5 text-sm text-slate-500">
              Configure el año escolar y sus períodos académicos
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

        <form onSubmit={formik.handleSubmit} className="space-y-4 p-5">
          <CustomInput
            label="Nombre del Año Escolar"
            name="name"
            placeholder="2026-2027"
            value={formik.values.name}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            type="text"
            error={formik.touched.name ? formik.errors.name : undefined}
            className={inputClassname}
          />

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

          <div className="grid grid-cols-2 gap-4">
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
          </div>

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
