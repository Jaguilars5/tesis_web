import { useFormik } from "formik";
import { X } from "lucide-react";
import { useEffect } from "react";

import { checkboxClassname, inputClassname } from "@app/styles/styles";
import { CustomCheckbox, CustomInput } from "@shared/components/Form";

import { sectionSchema } from "../../presentation/utils/section.validation";

import type { SectionT } from "../../domain/entities/section.types";

interface SectionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEdit: boolean;
  editingSection: SectionT | null;
  onSubmit: (values: SectionFormValues) => Promise<void>;
}

export interface SectionFormValues {
  parallel: string;
  capacity: number;
  school_year: number;
  academic_grade: number | null;
  is_active: boolean;
}

export const SectionFormModal = ({
  isOpen,
  onClose,
  isEdit,
  editingSection,
  onSubmit,
}: SectionFormModalProps) => {
  const getInitialValues = (): SectionFormValues => {
    if (editingSection) {
      return {
        parallel: editingSection.parallel,
        capacity: editingSection.capacity,
        school_year: editingSection.school_year,
        academic_grade: editingSection.academic_grade,
        is_active: editingSection.is_active,
      };
    }
    return {
      parallel: "",
      capacity: 0,
      school_year: 0,
      academic_grade: null,
      is_active: true,
    };
  };

  const formik = useFormik<SectionFormValues>({
    initialValues: getInitialValues(),
    validationSchema: sectionSchema,
    enableReinitialize: true,
    onSubmit,
  });

  useEffect(() => {
    if (isOpen && editingSection) {
      formik.setValues(getInitialValues());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, editingSection]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-md animate-slide-up overflow-hidden rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              {isEdit ? "Editar Seccion" : "Nueva Seccion"}
            </h3>
            <p className="mt-0.5 text-sm text-slate-500">
              Configure la seccion y su paralelo
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
            label="Paralelo"
            name="parallel"
            placeholder="A"
            value={formik.values.parallel}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            type="text"
            error={formik.touched.parallel ? formik.errors.parallel : undefined}
            className={inputClassname}
          />

          <div className="grid grid-cols-2 gap-4">
            <CustomInput
              label="Capacidad"
              name="capacity"
              type="number"
              value={formik.values.capacity}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              error={
                formik.touched.capacity ? formik.errors.capacity : undefined
              }
              className={inputClassname}
            />

            <CustomInput
              label="Ano Escolar"
              name="school_year"
              type="number"
              value={formik.values.school_year}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              error={
                formik.touched.school_year
                  ? formik.errors.school_year
                  : undefined
              }
              className={inputClassname}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <CustomInput
              label="Grado Academico"
              name="academic_grade"
              type="number"
              value={formik.values.academic_grade ?? ""}
              onBlur={formik.handleBlur}
              onChange={(e) =>
                formik.setFieldValue(
                  "academic_grade",
                  e.target.value ? Number(e.target.value) : null,
                )
              }
              error={
                formik.touched.academic_grade
                  ? formik.errors.academic_grade
                  : undefined
              }
              className={inputClassname}
            />

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
