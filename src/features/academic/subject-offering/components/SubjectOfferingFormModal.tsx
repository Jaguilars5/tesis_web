import { useFormik } from "formik";
import { X } from "lucide-react";
import { useEffect } from "react";

import { checkboxClassname, selectClassname } from "@app/styles/styles";
import { CustomCheckbox, CustomSelect } from "@shared/components/Form";

import { subjectOfferingSchema } from "../subject-offering.utils";

import type { SubmitErrorState } from "../subject-offering.controller";
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

export const SubjectOfferingFormModal = ({
  isOpen,
  onClose,
  isEdit,
  editingSubjectOffering,
  schoolYearOptions,
  sectionOptions,
  subjectAcademicConfigOptions,
  onSubmit,
  submitErrors,
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
                  Error al guardar la oferta
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
