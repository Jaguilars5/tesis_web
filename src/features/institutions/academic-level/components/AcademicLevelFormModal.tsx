import { useFormik } from "formik";
import { useEffect } from "react";
import { inputClassname } from "@app/styles/styles";
import { CustomInput } from "@shared/components/Form";
import { academicLevelSchema } from "../academic-level.utils";
import type { SubmitErrorState } from "@shared/utils/validationErrors";
import type {
  AcademicLevelFormValues,
  AcademicLevelT,
} from "../academic-level.types";
import { ErrrosInForm } from "@shared/components/ErrrosInForm";
import { X } from "lucide-react";

const getFieldLabel = (f: string): string =>
  ({
    code: "Código",
    name: "Nombre",
    description: "Descripción",
    non_field_errors: "Error general",
  })[f] || f;

interface AcademicLevelFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEdit: boolean;
  editingAcademicLevel: AcademicLevelT | null;
  onSubmit: (values: AcademicLevelFormValues) => Promise<void>;
  submitErrors: SubmitErrorState;
}

export const AcademicLevelFormModal: React.FC<AcademicLevelFormModalProps> = ({
  isOpen,
  onClose,
  isEdit,
  editingAcademicLevel,
  onSubmit,
  submitErrors,
}) => {
  const getInitialValues = (): AcademicLevelFormValues => {
    if (editingAcademicLevel)
      return {
        code: editingAcademicLevel.code,
        name: editingAcademicLevel.name,
        description: editingAcademicLevel.description,
      };
    return { code: "", name: "", description: "" };
  };

  const formik = useFormik<AcademicLevelFormValues>({
    initialValues: getInitialValues(),
    validationSchema: academicLevelSchema,
    enableReinitialize: true,
    onSubmit,
  });

  useEffect(() => {
    if (isOpen && editingAcademicLevel) formik.setValues(getInitialValues());
  }, [isOpen, editingAcademicLevel]);

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-md animate-slide-up overflow-hidden rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              {isEdit ? "Editar" : "Nuevo"} Nivel
            </h3>
            <p className="mt-0.5 text-sm text-slate-500">
              Configure el nivel académico
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
          >
            <X className="size-5" />
          </button>
        </div>
        {(submitErrors.general.length > 0 ||
          Object.keys(submitErrors.validation).length > 0) && (
          <ErrrosInForm
            submitErrors={submitErrors}
            getFieldLabel={getFieldLabel}
          />
        )}
        <form onSubmit={formik.handleSubmit} className="space-y-4 p-5">
          <CustomInput
            label="Código"
            name="code"
            placeholder="Ej: BASICA, BGU"
            value={formik.values.code}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            type="text"
            error={formik.touched.code ? formik.errors.code : undefined}
            className={inputClassname}
          />
          <CustomInput
            label="Nombre"
            name="name"
            placeholder="Ej: Educación Básica"
            value={formik.values.name}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            type="text"
            error={formik.touched.name ? formik.errors.name : undefined}
            className={inputClassname}
          />
          <CustomInput
            label="Descripción"
            name="description"
            placeholder="Descripción opcional"
            value={formik.values.description}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            type="text"
            error={
              formik.touched.description ? formik.errors.description : undefined
            }
            className={inputClassname}
          />

          <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-60"
            >
              {formik.isSubmitting ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
