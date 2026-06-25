import { useFormik } from "formik";
import { inputClassname, selectClassname } from "@app/styles/styles";
import { CustomInput, CustomSelect } from "@shared/components/Form";
import { academicGradeSchema } from "../academic-grade.utils";
import type { SubmitErrorState } from "@shared/utils/validationErrors";
import type {
  AcademicGradeFormValues,
  AcademicGradeT,
} from "../academic-grade.types";
import { ErrrosInForm } from "@shared/components/ErrrosInForm";
import { X } from "lucide-react";

const getFieldLabel = (f: string): string =>
  ({
    code: "Código",
    name: "Nombre",
    academic_sublevel: "Subnivel",
    non_field_errors: "Error general",
  })[f] || f;

interface AcademicGradeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEdit: boolean;
  editingAcademicGrade: AcademicGradeT | null;
  academicSubLevelOptions: { label: string; value: string }[];
  onSubmit: (values: AcademicGradeFormValues) => Promise<void>;
  submitErrors: SubmitErrorState;
}

export const AcademicGradeFormModal: React.FC<AcademicGradeFormModalProps> = ({
  isOpen,
  onClose,
  isEdit,
  editingAcademicGrade,
  academicSubLevelOptions,
  onSubmit,
  submitErrors,
}) => {
  const getInitialValues = (): AcademicGradeFormValues => {
    if (editingAcademicGrade)
      return {
        code: editingAcademicGrade.code,
        name: editingAcademicGrade.name,
        academic_sublevel: editingAcademicGrade.academic_sublevel,
      };
    return { code: "", name: "", academic_sublevel: 0 };
  };

  const formik = useFormik<AcademicGradeFormValues>({
    initialValues: getInitialValues(),
    validationSchema: academicGradeSchema,
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
              {isEdit ? "Editar" : "Nuevo"} Grado
            </h3>
            <p className="mt-0.5 text-sm text-slate-500">
              Configure el grado académico
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
            placeholder="Ej. 1RO-BGU"
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
            placeholder="Primero de Bachillerato"
            value={formik.values.name}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            type="text"
            error={formik.touched.name ? formik.errors.name : undefined}
            className={inputClassname}
          />
          <CustomSelect
            label="Subnivel"
            name="academic_sublevel"
            value={String(formik.values.academic_sublevel ?? "")}
            onChange={(option) =>
              formik.setFieldValue(
                "academic_sublevel",
                option.value ? Number(option.value) : null,
              )
            }
            options={academicSubLevelOptions}
            className={selectClassname}
            error={
              formik.touched.academic_sublevel
                ? formik.errors.academic_sublevel
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
