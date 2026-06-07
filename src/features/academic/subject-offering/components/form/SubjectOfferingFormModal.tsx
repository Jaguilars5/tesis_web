import { useFormik } from "formik";
import { X } from "lucide-react";
import { useEffect } from "react";

import { checkboxClassname, inputClassname } from "@app/styles/styles";
import { CustomCheckbox, CustomInput } from "@shared/components/Form";

import { subjectOfferingSchema } from "../../presentation/utils/subject-offering.validation";
import type { SubjectOfferingFormValues } from "../../presentation/hooks/useSubjectOfferingForm";
import type { SubjectOfferingT } from "../../domain/entities/subject-offering.types";

interface SubjectOfferingFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEdit: boolean;
  editingSubjectOffering: SubjectOfferingT | null;
  onSubmit: (values: SubjectOfferingFormValues) => Promise<void>;
}

export const SubjectOfferingFormModal = ({
  isOpen,
  onClose,
  isEdit,
  editingSubjectOffering,
  onSubmit,
}: SubjectOfferingFormModalProps) => {
  const getInitialValues = (): SubjectOfferingFormValues => {
    if (editingSubjectOffering) {
      return {
        school_year: editingSubjectOffering.school_year,
        section: editingSubjectOffering.section,
        subject_academic_config: editingSubjectOffering.subject_academic_config,
        is_active: editingSubjectOffering.is_active,
      };
    }
    return {
      school_year: 0,
      section: 0,
      subject_academic_config: 0,
      is_active: true,
    };
  };

  const formik = useFormik<SubjectOfferingFormValues>({
    initialValues: getInitialValues(),
    validationSchema: subjectOfferingSchema,
    enableReinitialize: true,
    onSubmit,
  });

  useEffect(() => {
    if (isOpen && editingSubjectOffering) {
      formik.setValues(getInitialValues());
    }
  }, [isOpen, editingSubjectOffering]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-md animate-slide-up overflow-hidden rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              {isEdit ? "Editar Oferta" : "Nueva Oferta"}
            </h3>
            <p className="mt-0.5 text-sm text-slate-500">
              Gestione las ofertas curriculares de materias en aulas
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
            label="Ano Escolar ID"
            name="school_year"
            type="number"
            value={String(formik.values.school_year)}
            onBlur={formik.handleBlur}
            onChange={(e) => formik.setFieldValue("school_year", Number(e.target.value))}
            error={formik.touched.school_year ? formik.errors.school_year : undefined}
            className={inputClassname}
          />

          <CustomInput
            label="Seccion ID"
            name="section"
            type="number"
            value={String(formik.values.section)}
            onBlur={formik.handleBlur}
            onChange={(e) => formik.setFieldValue("section", Number(e.target.value))}
            error={formik.touched.section ? formik.errors.section : undefined}
            className={inputClassname}
          />

          <CustomInput
            label="Configuracion Academica ID"
            name="subject_academic_config"
            type="number"
            value={String(formik.values.subject_academic_config)}
            onBlur={formik.handleBlur}
            onChange={(e) => formik.setFieldValue("subject_academic_config", Number(e.target.value))}
            error={formik.touched.subject_academic_config ? formik.errors.subject_academic_config : undefined}
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
