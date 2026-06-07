import { useFormik } from "formik";
import { X } from "lucide-react";
import { useEffect } from "react";

import { inputClassname } from "@app/styles/styles";
import { CustomInput } from "@shared/components/Form";

import { qualitativeScaleSchema } from "../../presentation/utils/qualitative-scales.validation";

import type { QualitativeScaleT } from "../../domain/entities/qualitative-scales.types";
import type { QualitativeScaleFormValues } from "../../presentation/hooks/useQualitativeScalesForm";

interface QualitativeScalesFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEdit: boolean;
  editingQualitativeScale: QualitativeScaleT | null;
  onSubmit: (values: QualitativeScaleFormValues) => Promise<void>;
}

export const QualitativeScalesFormModal = ({
  isOpen,
  onClose,
  isEdit,
  editingQualitativeScale,
  onSubmit,
}: QualitativeScalesFormModalProps) => {
  const getInitialValues = (): QualitativeScaleFormValues => {
    if (editingQualitativeScale) {
      return {
        code: editingQualitativeScale.code,
        description: editingQualitativeScale.description,
        numeric_equivalence: editingQualitativeScale.numeric_equivalence,
      };
    }
    return {
      code: "",
      description: "",
      numeric_equivalence: 0,
    };
  };

  const formik = useFormik<QualitativeScaleFormValues>({
    initialValues: getInitialValues(),
    validationSchema: qualitativeScaleSchema,
    enableReinitialize: true,
    onSubmit,
  });

  useEffect(() => {
    if (isOpen && editingQualitativeScale) {
      formik.setValues(getInitialValues());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, editingQualitativeScale]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-md animate-slide-up overflow-hidden rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              {isEdit ? "Editar Escala Cualitativa" : "Nueva Escala Cualitativa"}
            </h3>
            <p className="mt-0.5 text-sm text-slate-500">
              Configure la escala de calificación cualitativa
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
            label="Código"
            name="code"
            placeholder="Ej: EXC, SAT, SUP..."
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
            error={formik.touched.description ? formik.errors.description : undefined}
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
