import { useFormik } from "formik";
import { X } from "lucide-react";
import { inputClassname } from "@app/styles/styles";
import { CustomInput } from "@shared/components/Form";
import { ErrrosInForm } from "@shared/components/ErrrosInForm";
import type { SubmitErrorState } from "@shared/utils/validationErrors";
import { qualitativeScaleSchema } from "../qualitative-scales.utils";
import type {
  QualitativeScaleFormValues,
  QualitativeScaleT,
} from "../qualitative-scales.types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  isEdit: boolean;
  editingItem: QualitativeScaleT | null;
  onSubmit: (values: QualitativeScaleFormValues) => Promise<void>;
  submitErrors: SubmitErrorState;
}

const getFieldLabel = (field: string): string =>
  ({
    code: "Código",
    name: "Nombre",
    description: "Descripción",
    numeric_equivalence: "Equivalencia numérica",
    non_field_errors: "Error general",
  })[field] || field;

const getInitialValues = (
  editing?: QualitativeScaleT | null,
): QualitativeScaleFormValues => {
  if (editing)
    return {
      code: editing.code,
      name: editing.name,
      description: editing.description,
      numeric_equivalence: editing.numeric_equivalence,
    };
  return { code: "", name: "", description: "", numeric_equivalence: 0 };
};

export const QualitativeScalesFormModal: React.FC<Props> = ({
  isOpen,
  onClose,
  isEdit,
  editingItem,
  onSubmit,
  submitErrors,
}) => {
  const formik = useFormik<QualitativeScaleFormValues>({
    initialValues: getInitialValues(editingItem),
    validationSchema: qualitativeScaleSchema,
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
              {isEdit ? "Editar" : "Nueva"} Escala
            </h3>
            <p className="mt-0.5 text-sm text-slate-500">
              Configure la escala cualitativa
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

        <ErrrosInForm submitErrors={submitErrors} getFieldLabel={getFieldLabel} />

        <form onSubmit={formik.handleSubmit} className="space-y-4 p-5">
          <CustomInput
            label="Código"
            name="code"
            placeholder="Ej: EXC, SAT..."
            value={formik.values.code}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            type="text"
            error={formik.touched.code ? formik.errors.code : undefined}
            className={inputClassname}
          />

          <CustomInput
            label="Descripción"
            name="description"
            placeholder="Ej: Excelente, Satisfactorio..."
            value={formik.values.description}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            type="text"
            error={
              formik.touched.description
                ? formik.errors.description
                : undefined
            }
            className={inputClassname}
          />

          <CustomInput
            label="Equivalencia Numérica"
            name="numeric_equivalence"
            placeholder="Ej: 10.00"
            value={formik.values.numeric_equivalence}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            type="number"
            error={
              formik.touched.numeric_equivalence
                ? formik.errors.numeric_equivalence
                : undefined
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
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white hover:bg-primary-hover"
            >
              {formik.isSubmitting && (
                <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              )}
              {isEdit ? "Actualizar" : "Crear"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
