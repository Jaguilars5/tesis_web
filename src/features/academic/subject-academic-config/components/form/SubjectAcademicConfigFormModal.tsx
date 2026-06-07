import { useFormik } from "formik";
import { X } from "lucide-react";
import { useEffect } from "react";

import { checkboxClassname, inputClassname } from "@app/styles/styles";
import { CustomCheckbox, CustomInput } from "@shared/components/Form";

import { subjectAcademicConfigSchema } from "../../presentation/utils/subject-academic-config.validation";
import type { SubjectAcademicConfigFormValues } from "../../presentation/hooks/useSubjectAcademicConfigForm";
import type { SubjectAcademicConfigT } from "../../domain/entities/subject-academic-config.entity";

interface SubjectAcademicConfigFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEdit: boolean;
  editingSubjectAcademicConfig: SubjectAcademicConfigT | null;
  onSubmit: (values: SubjectAcademicConfigFormValues) => Promise<void>;
}

export const SubjectAcademicConfigFormModal = ({
  isOpen,
  onClose,
  isEdit,
  editingSubjectAcademicConfig,
  onSubmit,
}: SubjectAcademicConfigFormModalProps) => {
  const getInitialValues = (): SubjectAcademicConfigFormValues => {
    if (editingSubjectAcademicConfig) {
      return {
        subject: editingSubjectAcademicConfig.subject,
        academic_grade: editingSubjectAcademicConfig.academic_grade,
        weekly_hours: editingSubjectAcademicConfig.weekly_hours,
        pedagogical_order: editingSubjectAcademicConfig.pedagogical_order,
        is_required: editingSubjectAcademicConfig.is_required,
        is_active: editingSubjectAcademicConfig.is_active,
      };
    }
    return {
      subject: 0,
      academic_grade: 0,
      weekly_hours: 0,
      pedagogical_order: 0,
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
              Configure las horas y orden de materias por grado academico
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
            label="Materia ID"
            name="subject"
            type="number"
            value={String(formik.values.subject)}
            onBlur={formik.handleBlur}
            onChange={(e) => formik.setFieldValue("subject", Number(e.target.value))}
            error={formik.touched.subject ? formik.errors.subject : undefined}
            className={inputClassname}
          />

          <CustomInput
            label="Grado Academico ID"
            name="academic_grade"
            type="number"
            value={String(formik.values.academic_grade)}
            onBlur={formik.handleBlur}
            onChange={(e) => formik.setFieldValue("academic_grade", Number(e.target.value))}
            error={formik.touched.academic_grade ? formik.errors.academic_grade : undefined}
            className={inputClassname}
          />

          <CustomInput
            label="Horas Semanales"
            name="weekly_hours"
            type="number"
            value={String(formik.values.weekly_hours)}
            onBlur={formik.handleBlur}
            onChange={(e) => formik.setFieldValue("weekly_hours", Number(e.target.value))}
            error={formik.touched.weekly_hours ? formik.errors.weekly_hours : undefined}
            className={inputClassname}
          />

          <CustomInput
            label="Orden Pedagogico"
            name="pedagogical_order"
            type="number"
            value={String(formik.values.pedagogical_order)}
            onBlur={formik.handleBlur}
            onChange={(e) => formik.setFieldValue("pedagogical_order", Number(e.target.value))}
            error={formik.touched.pedagogical_order ? formik.errors.pedagogical_order : undefined}
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
