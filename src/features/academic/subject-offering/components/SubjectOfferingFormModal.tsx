import { useFormik } from "formik";
import { X } from "lucide-react";

import { checkboxClassname, selectClassname } from "@app/styles/styles";
import { CustomCheckbox, CustomSelect } from "@shared/components/Form";
import { ErrrosInForm } from "@shared/components/ErrrosInForm";
import type { SubmitErrorState } from "@shared/utils/validationErrors";

import { subjectOfferingSchema } from "../subject-offering.utils";

import type {
  SubjectOfferingFormValues,
  SubjectOfferingT,
} from "../subject-offering.types";

const getFieldLabel = (field: string): string => {
  const labels: Record<string, string> = {
    school_year: "Año escolar",
    section: "Sección",
    subject_academic_config: "Configuración académica",
    non_field_errors: "Error general",
  };
  return labels[field] || field;
};

interface SubjectOfferingFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEdit: boolean;
  editingSubjectOffering: SubjectOfferingT | null;
  schoolYearOptions: { label: string; value: string }[];
  sectionOptions: { label: string; value: string }[];
  subjectAcademicConfigOptions: { label: string; value: string }[];
  onSubmit: (values: SubjectOfferingFormValues) => Promise<void>;
  submitErrors: SubmitErrorState;
}

export const SubjectOfferingFormModal: React.FC<
  SubjectOfferingFormModalProps
> = ({
  isOpen,
  onClose,
  isEdit,
  editingSubjectOffering,
  schoolYearOptions,
  sectionOptions,
  subjectAcademicConfigOptions,
  onSubmit,
  submitErrors,
}) => {
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

        {hasSubmitErrors && (
          <ErrrosInForm
            submitErrors={submitErrors}
            getFieldLabel={getFieldLabel}
          />
        )}

        <form onSubmit={formik.handleSubmit} className="space-y-4 p-5">
          <CustomSelect
            label="Año Escolar"
            name="school_year"
            value={String(formik.values.school_year)}
            onChange={(option) =>
              formik.setFieldValue("school_year", Number(option.value))
            }
            options={schoolYearOptions}
            error={
              formik.touched.school_year ? formik.errors.school_year : undefined
            }
            className={selectClassname}
          />

          <CustomSelect
            label="Sección"
            name="section"
            value={String(formik.values.section)}
            onChange={(option) =>
              formik.setFieldValue("section", Number(option.value))
            }
            options={sectionOptions}
            error={formik.touched.section ? formik.errors.section : undefined}
            className={selectClassname}
          />

          <CustomSelect
            label="Configuración Académica"
            name="subject_academic_config"
            value={String(formik.values.subject_academic_config)}
            onChange={(option) =>
              formik.setFieldValue(
                "subject_academic_config",
                Number(option.value),
              )
            }
            options={subjectAcademicConfigOptions}
            error={
              formik.touched.subject_academic_config
                ? formik.errors.subject_academic_config
                : undefined
            }
            className={selectClassname}
          />

          {isEdit && (
            <div className="flex items-end pb-1">
              <CustomCheckbox
                name="is_active"
                checked={formik.values.is_active}
                onChange={(e) =>
                  formik.setFieldValue("is_active", e.target.checked)
                }
                label="Activo"
                className={checkboxClassname}
              />
            </div>
          )}

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
