import { useFormik } from "formik";
import { X } from "lucide-react";

import {
  checkboxClassname,
  inputClassname,
  selectClassname,
} from "@app/styles/styles";
import {
  CustomCheckbox,
  CustomInput,
  CustomSelect,
} from "@shared/components/Form";
import { ErrrosInForm } from "@shared/components/ErrrosInForm";
import type { SubmitErrorState } from "@shared/utils/validationErrors";

import { subjectAcademicConfigSchema } from "../subject-academic-config.utils";

import type {
  SubjectAcademicConfigFormValues,
  SubjectAcademicConfigT,
} from "../subject-academic-config.types";

const getFieldLabel = (field: string): string => {
  const labels: Record<string, string> = {
    subject: "Materia",
    academic_grade: "Grado academico",
    weekly_hours: "Horas semanales",
    non_field_errors: "Error general",
  };
  return labels[field] || field;
};

interface SubjectAcademicConfigFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEdit: boolean;
  editingSubjectAcademicConfig: SubjectAcademicConfigT | null;
  subjectOptions: { label: string; value: string }[];
  academicGradeOptions: { label: string; value: string }[];
  onSubmit: (values: SubjectAcademicConfigFormValues) => Promise<void>;
  submitErrors: SubmitErrorState;
}

export const SubjectAcademicConfigFormModal: React.FC<
  SubjectAcademicConfigFormModalProps
> = ({
  isOpen,
  onClose,
  isEdit,
  editingSubjectAcademicConfig,
  subjectOptions,
  academicGradeOptions,
  onSubmit,
  submitErrors,
}) => {
  const getInitialValues = (): SubjectAcademicConfigFormValues => {
    if (editingSubjectAcademicConfig) {
      return {
        subject: editingSubjectAcademicConfig.subject,
        academic_grade: editingSubjectAcademicConfig.academic_grade,
        weekly_hours: editingSubjectAcademicConfig.weekly_hours,
        is_required: editingSubjectAcademicConfig.is_required,
      };
    }
    return {
      subject: 0,
      academic_grade: 0,
      weekly_hours: 1,
      is_required: true,
    };
  };

  const formik = useFormik<SubjectAcademicConfigFormValues>({
    initialValues: getInitialValues(),
    validationSchema: subjectAcademicConfigSchema,
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
              {isEdit ? "Editar Configuracion" : "Nueva Configuracion"}
            </h3>
            <p className="mt-0.5 text-sm text-slate-500">
              Configure las horas semanales de materias por grado academico
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
            <CustomSelect
              label="Materia"
              name="subject"
              value={String(formik.values.subject)}
              onChange={(option) =>
                formik.setFieldValue("subject", Number(option.value))
              }
              options={subjectOptions}
              error={formik.touched.subject ? formik.errors.subject : undefined}
              className={selectClassname}
            />

            <CustomSelect
              label="Grado Academico"
              name="academic_grade"
              value={String(formik.values.academic_grade)}
              onChange={(option) =>
                formik.setFieldValue("academic_grade", Number(option.value))
              }
              options={academicGradeOptions}
              error={
                formik.touched.academic_grade
                  ? formik.errors.academic_grade
                  : undefined
              }
              className={selectClassname}
            />
          </div>

          <CustomInput
            label="Horas Semanales"
            name="weekly_hours"
            type="number"
            value={String(formik.values.weekly_hours)}
            onBlur={formik.handleBlur}
            onChange={(e) =>
              formik.setFieldValue("weekly_hours", Number(e.target.value))
            }
            error={
              formik.touched.weekly_hours
                ? formik.errors.weekly_hours
                : undefined
            }
            className={inputClassname}
          />

          <div className="flex items-end gap-4 pb-1">
            <CustomCheckbox
              name="is_required"
              checked={formik.values.is_required}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              label="Obligatorio"
              className={checkboxClassname}
            />
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
