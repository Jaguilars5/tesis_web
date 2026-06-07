import { useFormik } from "formik";
import { X } from "lucide-react";
import { useEffect } from "react";

import { checkboxClassname, inputClassname, selectClassname } from "@app/styles/styles";
import { CustomCheckbox, CustomInput, CustomSelect } from "@shared/components/Form";

import { evaluationBlockSchema } from "../../presentation/utils/evaluation-block.validation";

import type { SelectOptionT } from "@shared/components/Form/CustomSelect/CustomSelectProps";
import type { EvaluationBlockT } from "../../domain/entities/evaluation-block.types";
import type { EvaluationBlockFormValues } from "../../presentation/hooks/useEvaluationBlockForm";

interface EvaluationBlockFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEdit: boolean;
  editingEvaluationBlock: EvaluationBlockT | null;
  onSubmit: (values: EvaluationBlockFormValues) => Promise<void>;
  academicPeriodOptions: SelectOptionT[];
  evaluationTypeOptions: SelectOptionT[];
}

export const EvaluationBlockFormModal = ({
  isOpen,
  onClose,
  isEdit,
  editingEvaluationBlock,
  onSubmit,
  academicPeriodOptions,
  evaluationTypeOptions,
}: EvaluationBlockFormModalProps) => {
  const getInitialValues = (): EvaluationBlockFormValues => {
    if (editingEvaluationBlock) {
      return {
        name: editingEvaluationBlock.name,
        weight_percentage: editingEvaluationBlock.weight_percentage,
        academic_period: editingEvaluationBlock.academic_period,
        evaluation_type: editingEvaluationBlock.evaluation_type,
        is_active: editingEvaluationBlock.is_active,
      };
    }
    return {
      name: "",
      weight_percentage: 0,
      academic_period: 0,
      evaluation_type: null,
      is_active: true,
    };
  };

  const formik = useFormik<EvaluationBlockFormValues>({
    initialValues: getInitialValues(),
    validationSchema: evaluationBlockSchema,
    enableReinitialize: true,
    onSubmit,
  });

  useEffect(() => {
    if (isOpen && editingEvaluationBlock) {
      formik.setValues(getInitialValues());
    }
  }, [isOpen, editingEvaluationBlock]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-md animate-slide-up overflow-hidden rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              {isEdit ? "Editar Bloque de Evaluacion" : "Nuevo Bloque de Evaluacion"}
            </h3>
            <p className="mt-0.5 text-sm text-slate-500">
              Configure los parametros del bloque de evaluacion
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
            label="Nombre"
            name="name"
            placeholder="Nombre del bloque"
            value={formik.values.name}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            type="text"
            error={formik.touched.name ? formik.errors.name : undefined}
            className={inputClassname}
          />

          <CustomInput
            label="Porcentaje"
            name="weight_percentage"
            type="number"
            value={String(formik.values.weight_percentage)}
            onBlur={formik.handleBlur}
            onChange={(e) => formik.setFieldValue("weight_percentage", Number(e.target.value))}
            error={formik.touched.weight_percentage ? formik.errors.weight_percentage : undefined}
            className={inputClassname}
          />

          <CustomSelect
            label="Periodo Academico"
            name="academic_period"
            options={academicPeriodOptions}
            value={formik.values.academic_period}
            onChange={(option) => formik.setFieldValue("academic_period", option.value)}
            onBlur={formik.handleBlur}
            error={formik.touched.academic_period ? formik.errors.academic_period : undefined}
            className={selectClassname}
            placeholder="Seleccione un periodo"
          />

          <CustomSelect
            label="Tipo de Evaluacion"
            name="evaluation_type"
            options={evaluationTypeOptions}
            value={formik.values.evaluation_type ?? 0}
            onChange={(option) => formik.setFieldValue("evaluation_type", option.value)}
            onBlur={formik.handleBlur}
            error={formik.touched.evaluation_type ? formik.errors.evaluation_type : undefined}
            className={selectClassname}
            placeholder="Seleccione un tipo (opcional)"
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
