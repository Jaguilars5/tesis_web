import { useFormik } from "formik";
import { X } from "lucide-react";

import { inputClassname } from "@app/styles/styles";
import { CustomInput } from "@shared/components/Form";

import { subjectProjectSchema } from "../../presentation/utils/subject-project.validation";
import type { SubjectProjectFormValues } from "../../presentation/hooks/useSubjectProjectForm";

interface SubjectProjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: SubjectProjectFormValues) => Promise<void>;
}

export const SubjectProjectFormModal = ({
  isOpen,
  onClose,
  onSubmit,
}: SubjectProjectFormModalProps) => {
  const initialValues: SubjectProjectFormValues = {
    interdisciplinary_project: 0,
    subject_offering: 0,
  };

  const formik = useFormik<SubjectProjectFormValues>({
    initialValues,
    validationSchema: subjectProjectSchema,
    enableReinitialize: true,
    onSubmit,
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-md animate-slide-up overflow-hidden rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Vincular Materia a Proyecto
            </h3>
            <p className="mt-0.5 text-sm text-slate-500">
              Vincule una materia a un proyecto interdisciplinario
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
            label="Proyecto ID"
            name="interdisciplinary_project"
            type="number"
            value={String(formik.values.interdisciplinary_project)}
            onBlur={formik.handleBlur}
            onChange={(e) => formik.setFieldValue("interdisciplinary_project", Number(e.target.value))}
            error={formik.touched.interdisciplinary_project ? formik.errors.interdisciplinary_project : undefined}
            className={inputClassname}
          />

          <CustomInput
            label="Oferta de Materia ID"
            name="subject_offering"
            type="number"
            value={String(formik.values.subject_offering)}
            onBlur={formik.handleBlur}
            onChange={(e) => formik.setFieldValue("subject_offering", Number(e.target.value))}
            error={formik.touched.subject_offering ? formik.errors.subject_offering : undefined}
            className={inputClassname}
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
