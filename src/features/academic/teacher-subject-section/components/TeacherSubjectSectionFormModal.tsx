import { useFormik } from "formik";
import { X } from "lucide-react";
import { useEffect } from "react";

import { checkboxClassname, selectClassname } from "@app/styles/styles";
import { CustomCheckbox, CustomSelect } from "@shared/components/Form";

import { teacherSubjectSectionSchema } from "../teacher-subject-section.utils";

import type { SubmitErrorState } from "../teacher-subject-section.controller";
import type {
  TeacherSubjectSectionFormValues,
  TeacherSubjectSectionT,
} from "../teacher-subject-section.types";

const getFieldLabel = (field: string): string => {
  const labels: Record<string, string> = {
    user: "Docente",
    subject_offering: "Oferta de materia",
    non_field_errors: "Error general",
  };
  return labels[field] || field;
};

interface TeacherSubjectSectionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEdit: boolean;
  editingTeacherSubjectSection: TeacherSubjectSectionT | null;
  userOptions: { label: string; value: string }[];
  subjectOfferingOptions: { label: string; value: string }[];
  onSubmit: (values: TeacherSubjectSectionFormValues) => Promise<void>;
  submitErrors: SubmitErrorState;
}

export const TeacherSubjectSectionFormModal = ({
  isOpen,
  onClose,
  isEdit,
  editingTeacherSubjectSection,
  userOptions,
  subjectOfferingOptions,
  onSubmit,
  submitErrors,
}: TeacherSubjectSectionFormModalProps) => {
  const getInitialValues = (): TeacherSubjectSectionFormValues => {
    if (editingTeacherSubjectSection) {
      return {
        user: editingTeacherSubjectSection.user,
        subject_offering: editingTeacherSubjectSection.subject_offering,
        is_active: editingTeacherSubjectSection.is_active,
      };
    }
    return {
      user: 0,
      subject_offering: 0,
      is_active: true,
    };
  };

  const formik = useFormik<TeacherSubjectSectionFormValues>({
    initialValues: getInitialValues(),
    validationSchema: teacherSubjectSectionSchema,
    enableReinitialize: true,
    onSubmit,
  });

  useEffect(() => {
    if (isOpen && editingTeacherSubjectSection) {
      formik.setValues(getInitialValues());
    }
  }, [isOpen, editingTeacherSubjectSection]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-md animate-slide-up overflow-hidden rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              {isEdit ? "Editar Asignacion" : "Nueva Asignacion"}
            </h3>
            <p className="mt-0.5 text-sm text-slate-500">
              Asigne un docente a una oferta de materia
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
                  Error al guardar la asignacion
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
          <CustomSelect
            label="Docente"
            name="user"
            value={String(formik.values.user)}
            onChange={(option) =>
              formik.setFieldValue("user", Number(option.value))
            }
            error={formik.touched.user ? formik.errors.user : undefined}
            options={userOptions}
            className={selectClassname}
          />

          <CustomSelect
            label="Oferta de Materia"
            name="subject_offering"
            value={String(formik.values.subject_offering)}
            onChange={(option) =>
              formik.setFieldValue("subject_offering", Number(option.value))
            }
            error={
              formik.touched.subject_offering
                ? formik.errors.subject_offering
                : undefined
            }
            options={subjectOfferingOptions}
            className={selectClassname}
          />

          <div className="flex items-end pb-1">
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
