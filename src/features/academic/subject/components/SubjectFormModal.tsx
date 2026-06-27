import { useFormik } from "formik";
import { X } from "lucide-react";

import { checkboxClassname, inputClassname } from "@app/styles/styles";
import { CustomCheckbox, CustomInput } from "@shared/components/Form";
import { ErrrosInForm } from "@shared/components/ErrrosInForm";
import type { SubmitErrorState } from "@shared/utils/validationErrors";

import { subjectSchema } from "../subject.utils";

import type { SubjectFormValues, SubjectT } from "../subject.types";

const getFieldLabel = (field: string): string => {
  const labels: Record<string, string> = {
    name: "Nombre",
    code: "Código",
    non_field_errors: "Error general",
  };
  return labels[field] || field;
};

interface SubjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEdit: boolean;
  editingSubject: SubjectT | null;
  onSubmit: (values: SubjectFormValues) => Promise<void>;
  submitErrors: SubmitErrorState;
}

export const SubjectFormModal: React.FC<SubjectFormModalProps> = ({
  isOpen,
  onClose,
  isEdit,
  editingSubject,
  onSubmit,
  submitErrors,
}) => {
  const getInitialValues = (): SubjectFormValues => {
    if (editingSubject) {
      return {
        name: editingSubject.name,
        code: editingSubject.code,
        is_active: editingSubject.is_active,
      };
    }
    return {
      name: "",
      code: "",
      is_active: true,
    };
  };

  const formik = useFormik<SubjectFormValues>({
    initialValues: getInitialValues(),
    validationSchema: subjectSchema,
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
              {isEdit ? "Editar Materia" : "Nueva Materia"}
            </h3>
            <p className="mt-0.5 text-sm text-slate-500">
              Configure la asignatura
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
          <CustomInput
            label="Nombre de la Materia"
            name="name"
            placeholder="Matematicas"
            value={formik.values.name}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            type="text"
            error={formik.touched.name ? formik.errors.name : undefined}
            className={inputClassname}
          />

          <CustomInput
            label="Codigo"
            name="code"
            placeholder="MAT-101"
            value={formik.values.code}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            type="text"
            error={formik.touched.code ? formik.errors.code : undefined}
            className={inputClassname}
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
              className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
            >
              {formik.isSubmitting ? (
                <>
                  <span className="mr-2 inline-block size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
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
