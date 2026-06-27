import { useFormik } from "formik";
import { X } from "lucide-react";
import { inputClassname, selectClassname } from "@app/styles/styles";
import { CustomInput, CustomSelect } from "@shared/components/Form";
import { ErrrosInForm } from "@shared/components/ErrrosInForm";
import { sectionSchema } from "../section.utils";
import type { SubmitErrorState } from "@shared/utils/validationErrors";
import type { SectionFormValues, SectionT } from "../section.types";

const getFieldLabel = (f: string): string =>
  ({
    parallel: "Paralelo",
    school_year: "Año escolar",
    academic_grade: "Grado académico",
    non_field_errors: "Error general",
  })[f] || f;

interface SectionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEdit: boolean;
  editingSection: SectionT | null;
  onSubmit: (values: SectionFormValues) => Promise<void>;
  submitErrors: SubmitErrorState;
  schoolYearOptions: { label: string; value: string }[];
  academicGradeOptions: { label: string; value: string }[];
}

export const SectionFormModal: React.FC<SectionFormModalProps> = ({
  isOpen,
  onClose,
  isEdit,
  editingSection,
  onSubmit,
  submitErrors,
  schoolYearOptions,
  academicGradeOptions,
}) => {
  const getInitialValues = (): SectionFormValues => {
    if (editingSection)
      return {
        parallel: editingSection.parallel,
        school_year: editingSection.school_year,
        academic_grade: editingSection.academic_grade,
        capacity: editingSection.capacity,
        code: editingSection.code,
      };
    return {
      parallel: "",
      school_year: 0,
      academic_grade: 0,
      capacity: 0,
      code: "",
    };
  };

  const formik = useFormik<SectionFormValues>({
    initialValues: getInitialValues(),
    validationSchema: sectionSchema,
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
              {isEdit ? "Editar" : "Nueva"} Sección
            </h3>
            <p className="mt-0.5 text-sm text-slate-500">
              Configure la sección/paralelo
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
          <CustomInput
            label="Paralelo"
            name="parallel"
            placeholder="Ej: A, B, C"
            value={formik.values.parallel}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            type="text"
            error={formik.touched.parallel ? formik.errors.parallel : undefined}
            className={inputClassname}
          />
          <CustomInput
            label="Código"
            name="code"
            placeholder="Ej: 123456"
            value={formik.values.code}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            type="text"
            error={formik.touched.code ? formik.errors.code : undefined}
            className={inputClassname}
          />
          <CustomSelect
            label="Año Escolar"
            name="school_year"
            value={String(formik.values.school_year || "")}
            onChange={(option) =>
              formik.setFieldValue(
                "school_year",
                option.value ? Number(option.value) : 0,
              )
            }
            options={schoolYearOptions}
            className={selectClassname}
            error={
              formik.touched.school_year ? formik.errors.school_year : undefined
            }
          />
          <CustomSelect
            label="Grado Académico"
            name="academic_grade"
            value={String(formik.values.academic_grade || "")}
            onChange={(option) =>
              formik.setFieldValue(
                "academic_grade",
                option.value ? Number(option.value) : 0,
              )
            }
            options={academicGradeOptions}
            className={selectClassname}
            error={
              formik.touched.academic_grade
                ? formik.errors.academic_grade
                : undefined
            }
          />
          <CustomInput
            label="Capacidad"
            name="capacity"
            placeholder="Ej: 30"
            value={formik.values.capacity}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            type="number"
            error={formik.touched.capacity ? formik.errors.capacity : undefined}
            className={inputClassname}
          />

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
