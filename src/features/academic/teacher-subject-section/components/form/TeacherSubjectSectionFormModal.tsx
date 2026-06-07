import { useFormik } from "formik";
import { X } from "lucide-react";
import { useEffect } from "react";

import { checkboxClassname, selectClassname } from "@app/styles/styles";
import { CustomCheckbox, CustomSelect } from "@shared/components/Form";

import { teacherSubjectSectionSchema } from "../../application/teacher-subject-section.schema";

import type { TeacherSubjectSectionFormValues } from "../../application/teacher-subject-section.schema";
import type { TeacherSubjectSectionT } from "../../domain/teacher-subject-section.entity";

interface TeacherSubjectSectionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEdit: boolean;
  editingTeacherSubjectSection: TeacherSubjectSectionT | null;
  onSubmit: (values: TeacherSubjectSectionFormValues) => Promise<void>;
}

export const TeacherSubjectSectionFormModal = ({
  isOpen,
  onClose,
  isEdit,
  editingTeacherSubjectSection,
  onSubmit,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, editingTeacherSubjectSection]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-md animate-slide-up overflow-hidden rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              {isEdit
                ? "Editar Asignacion"
                : "Nueva Asignacion"}
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

        <form onSubmit={formik.handleSubmit} className="space-y-4 p-5">
          <CustomSelect
            label="Docente"
            name="user"
            value={String(formik.values.user)}
            onBlur={formik.handleBlur}
            onChange={(option) =>
              formik.setFieldValue("user", Number(option.value))
            }
            error={formik.touched.user ? formik.errors.user : undefined}
            options={[]}
            className={selectClassname}
          />

          <CustomSelect
            label="Oferta de Materia"
            name="subject_offering"
            value={String(formik.values.subject_offering)}
            onBlur={formik.handleBlur}
            onChange={(option) =>
              formik.setFieldValue(
                "subject_offering",
                Number(option.value),
              )
            }
            error={
              formik.touched.subject_offering
                ? formik.errors.subject_offering
                : undefined
            }
            options={[]}
            className={selectClassname}
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
