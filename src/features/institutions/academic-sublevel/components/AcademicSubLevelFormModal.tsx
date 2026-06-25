import { useFormik } from "formik";
import { useEffect } from "react";
import {
  inputClassname,
  selectClassname,
} from "@app/styles/styles";
import {
  CustomInput,
  CustomSelect,
} from "@shared/components/Form";
import { academicSubLevelSchema } from "../academic-sublevel.utils";
import type { SubmitErrorState } from "@shared/utils/validationErrors";
import type {
  AcademicSubLevelFormValues,
  AcademicSubLevelT,
} from "../academic-sublevel.types";
import { ErrrosInForm } from "@shared/components/ErrrosInForm";
import { X } from "lucide-react";

const getFieldLabel = (f: string): string =>
  ({
    code: "Código",
    name: "Nombre",
    description: "Descripción",
    academic_level: "Nivel",
    non_field_errors: "Error general",
  })[f] || f;

interface AcademicSubLevelFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEdit: boolean;
  editingAcademicSubLevel: AcademicSubLevelT | null;
  onSubmit: (values: AcademicSubLevelFormValues) => Promise<void>;
  submitErrors: SubmitErrorState;
  academicLevelOptions: { label: string; value: string }[];
}

export const AcademicSubLevelFormModal: React.FC<
  AcademicSubLevelFormModalProps
> = ({
  isOpen,
  onClose,
  isEdit,
  editingAcademicSubLevel,
  onSubmit,
  submitErrors,
  academicLevelOptions,
}) => {
  const getInitialValues = (): AcademicSubLevelFormValues => {
    if (editingAcademicSubLevel)
      return {
        code: editingAcademicSubLevel.code,
        name: editingAcademicSubLevel.name,
        description: editingAcademicSubLevel.description,
        academic_level: editingAcademicSubLevel.academic_level,
      };
    return {
      code: "",
      name: "",
      description: "",
      academic_level: 0,
    };
  };

  const formik = useFormik<AcademicSubLevelFormValues>({
    initialValues: getInitialValues(),
    validationSchema: academicSubLevelSchema,
    enableReinitialize: true,
    onSubmit,
  });

  useEffect(() => {
    if (isOpen && editingAcademicSubLevel) formik.setValues(getInitialValues());
  }, [isOpen, editingAcademicSubLevel]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-md animate-slide-up overflow-hidden rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              {isEdit ? "Editar" : "Nuevo"} Subnivel
            </h3>
            <p className="mt-0.5 text-sm text-slate-500">
              Configure el subnivel académico
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
            placeholder="Ej: BASICA-MEDIA"
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
            placeholder="Ej: Básica Media"
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
          <CustomSelect
            label="Nivel Académico"
            name="academic_level"
            value={String(formik.values.academic_level)}
            onChange={(o) =>
              formik.setFieldValue("academic_level", Number(o.value))
            }
            options={academicLevelOptions}
            className={selectClassname}
            error={
              formik.touched.academic_level
                ? formik.errors.academic_level
                : undefined
            }
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
