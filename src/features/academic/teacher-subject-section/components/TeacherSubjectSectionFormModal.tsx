import { useFormik } from "formik";
import { X } from "lucide-react";

import { selectClassname } from "@app/styles/styles";
import { CustomSelect } from "@shared/components/Form";
import { ErrrosInForm } from "@shared/components/ErrrosInForm";
import type { SubmitErrorState } from "@shared/utils/validationErrors";

import { teacherSubjectSectionSchema } from "../teacher-subject-section.utils";

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

export const TeacherSubjectSectionFormModal: React.FC<
  TeacherSubjectSectionFormModalProps
> = ({
  isOpen,
  onClose,
  isEdit,
  editingTeacherSubjectSection,
  userOptions,
  subjectOfferingOptions,
  onSubmit,
  submitErrors,
}) => {
  const getInitialValues = (): TeacherSubjectSectionFormValues => {
    if (editingTeacherSubjectSection) {
      return {
        user: editingTeacherSubjectSection.user,
        subject_offering: editingTeacherSubjectSection.subject_offering,
      };
    }
    return {
      user: 0,
      subject_offering: 0,
    };
  };

  const formik = useFormik<TeacherSubjectSectionFormValues>({
    initialValues: getInitialValues(),
    validationSchema: teacherSubjectSectionSchema,
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

        {hasSubmitErrors && (
          <ErrrosInForm
            submitErrors={submitErrors}
            getFieldLabel={getFieldLabel}
          />
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
