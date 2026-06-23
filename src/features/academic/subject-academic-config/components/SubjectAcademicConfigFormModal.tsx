import { useFormik } from "formik";
import { X } from "lucide-react";
import { useEffect } from "react";

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

import { subjectAcademicConfigSchema } from "../subject-academic-config.utils";

import type { SubmitErrorState } from "../subject-academic-config.controller";
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

export const SubjectAcademicConfigFormModal = ({
  isOpen,
  onClose,
  isEdit,
  editingSubjectAcademicConfig,
  subjectOptions,
  academicGradeOptions,
  onSubmit,
  submitErrors,
}: SubjectAcademicConfigFormModalProps) => {
  const getInitialValues = (): SubjectAcademicConfigFormValues => {
    if (editingSubjectAcademicConfig) {
      return {
        subject: editingSubjectAcademicConfig.subject,
        academic_grade: editingSubjectAcademicConfig.academic_grade,
        weekly_hours: editingSubjectAcademicConfig.weekly_hours,
        is_required: editingSubjectAcademicConfig.is_required,
        is_active: editingSubjectAcademicConfig.is_active,
      };
    }
    return {
      subject: 0,
      academic_grade: 0,
      weekly_hours: 1,
      is_required: true,
      is_active: true,
    };
  };

  const formik = useFormik<SubjectAcademicConfigFormValues>({
    initialValues: getInitialValues(),
    validationSchema: subjectAcademicConfigSchema,
    enableReinitialize: true,
    onSubmit,
  });

  useEffect(() => {
    if (isOpen && editingSubjectAcademicConfig) {
      formik.setValues(getInitialValues());
    }
  }, [isOpen, editingSubjectAcademicConfig]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!isOpen) return null;

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
                  Error al guardar la configuracion
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
            {isEdit && (
              <CustomCheckbox
                name="is_active"
                checked={formik.values.is_active}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                label="Activo"
                className={checkboxClassname}
              />
            )}
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
