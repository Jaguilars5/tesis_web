import { useFormik } from "formik";
import { X } from "lucide-react";
import { useEffect } from "react";

import { checkboxClassname, inputClassname } from "@app/styles/styles";
import { CustomCheckbox, CustomInput } from "@shared/components/Form";

import { evaluationTypeSchema } from "../../presentation/utils/evaluation-types.validation";

import type { EvaluationTypeT } from "../../domain/entities/evaluation-types.types";
import type { EvaluationTypeFormValues } from "../../presentation/hooks/useEvaluationTypesForm";

interface EvaluationTypesFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEdit: boolean;
  editingEvaluationType: EvaluationTypeT | null;
  onSubmit: (values: EvaluationTypeFormValues) => Promise<void>;
}

export const EvaluationTypesFormModal = ({
  isOpen,
  onClose,
  isEdit,
  editingEvaluationType,
  onSubmit,
}: EvaluationTypesFormModalProps) => {
  const getInitialValues = (): EvaluationTypeFormValues => {
    if (editingEvaluationType) {
      return {
        code: editingEvaluationType.code,
        name: editingEvaluationType.name,
        description: editingEvaluationType.description ?? "",
        is_active: editingEvaluationType.is_active,
        order: editingEvaluationType.order,
      };
    }
    return {
      code: "",
      name: "",
      description: "",
      is_active: true,
      order: 0,
    };
  };

  const formik = useFormik<EvaluationTypeFormValues>({
    initialValues: getInitialValues(),
    validationSchema: evaluationTypeSchema,
    enableReinitialize: true,
    onSubmit,
  });

  useEffect(() => {
    if (isOpen && editingEvaluationType) {
      formik.setValues(getInitialValues());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, editingEvaluationType]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-md animate-slide-up overflow-hidden rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              {isEdit ? "Editar Tipo de Evaluación" : "Nuevo Tipo de Evaluación"}
            </h3>
            <p className="mt-0.5 text-sm text-slate-500">
              Configure el tipo de evaluación académica
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
            placeholder="Ej: DIAG, FOR, SUM..."
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
            placeholder="Ej: Diagnóstica, Formativa..."
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
            placeholder="Descripción opcional..."
            value={formik.values.description ?? ""}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            type="text"
            error={formik.touched.description ? formik.errors.description : undefined}
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
