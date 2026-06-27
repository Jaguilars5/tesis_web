import { useFormik } from "formik";
import { X } from "lucide-react";

import { inputClassname, selectClassname } from "@app/styles/styles";
import { CustomInput, CustomSelect } from "@shared/components/Form";
import { ErrrosInForm } from "@shared/components/ErrrosInForm";

import { evaluationBlockSchema } from "../evaluation-blocks.utils";
import { useBlockTypeOptions } from "../hooks/useBlockTypeOptions";

import type { SubmitErrorState } from "@shared/utils/validationErrors";
import type {
  EvaluationBlockFormValues,
  EvaluationBlockT,
} from "../evaluation-blocks.types";

const getFieldLabel = (field: string): string => {
  const labels: Record<string, string> = {
    code: "Código",
    name: "Nombre",
    weight_percentage: "Porcentaje",
    academic_period: "Período",
    subject_offering: "Oferta de materia",
    block_type: "Tipo",
    non_field_errors: "Error general",
  };
  return labels[field] || field;
};

interface EvaluationBlockFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEdit: boolean;
  editingEvaluationBlock: EvaluationBlockT | null;
  academicPeriodOptions: { label: string; value: string }[];
  subjectOfferingOptions: { label: string; value: string }[];
  onSubmit: (values: EvaluationBlockFormValues) => Promise<void>;
  submitErrors: SubmitErrorState;
}

export const EvaluationBlockFormModal: React.FC<
  EvaluationBlockFormModalProps
> = ({
  isOpen,
  onClose,
  isEdit,
  editingEvaluationBlock,
  academicPeriodOptions,
  subjectOfferingOptions,
  onSubmit,
  submitErrors,
}) => {
  const getInitialValues = (): EvaluationBlockFormValues => {
    if (editingEvaluationBlock) {
      return {
        code: editingEvaluationBlock.code,
        name: editingEvaluationBlock.name,
        weight_percentage: editingEvaluationBlock.weight_percentage,
        academic_period: editingEvaluationBlock.academic_period,
        subject_offering: editingEvaluationBlock.subject_offering,
        block_type: editingEvaluationBlock.block_type ?? null,
      };
    }
    return {
      code: "",
      name: "",
      weight_percentage: 0,
      academic_period: 0,
      subject_offering: 0,
      block_type: null,
    };
  };

  const { blockTypeOptions } = useBlockTypeOptions();

  const blockTypeSelectOptions = [
    { label: "Sin tipo", value: "" },
    ...blockTypeOptions,
  ];

  const formik = useFormik<EvaluationBlockFormValues>({
    initialValues: getInitialValues(),
    validationSchema: evaluationBlockSchema,
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
              {isEdit ? "Editar" : "Nuevo"} Bloque
            </h3>
            <p className="mt-0.5 text-sm text-slate-500">
              Configure el bloque de evaluación
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
          <ErrrosInForm
            submitErrors={submitErrors}
            getFieldLabel={getFieldLabel}
          />
        )}

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
            label="Porcentaje (%)"
            name="weight_percentage"
            type="number"
            value={String(formik.values.weight_percentage)}
            onBlur={formik.handleBlur}
            onChange={(e) =>
              formik.setFieldValue("weight_percentage", Number(e.target.value))
            }
            error={
              formik.touched.weight_percentage
                ? formik.errors.weight_percentage
                : undefined
            }
            className={inputClassname}
          />
          <CustomSelect
            label="Período Académico"
            name="academic_period"
            options={academicPeriodOptions}
            value={formik.values.academic_period}
            onChange={(option) =>
              formik.setFieldValue("academic_period", Number(option.value))
            }
            onBlur={formik.handleBlur}
            error={
              formik.touched.academic_period
                ? formik.errors.academic_period
                : undefined
            }
            className={selectClassname}
            placeholder="Seleccione un período"
          />
          <CustomSelect
            label="Oferta de Materia"
            name="subject_offering"
            options={subjectOfferingOptions}
            value={formik.values.subject_offering}
            onChange={(option) =>
              formik.setFieldValue("subject_offering", Number(option.value))
            }
            onBlur={formik.handleBlur}
            error={
              formik.touched.subject_offering
                ? formik.errors.subject_offering
                : undefined
            }
            className={selectClassname}
            placeholder="Seleccione una oferta"
          />
          <CustomSelect
            label="Tipo"
            name="block_type"
            options={blockTypeSelectOptions}
            value={formik.values.block_type ?? ""}
            onChange={(option) =>
              formik.setFieldValue("block_type", option.value || null)
            }
            onBlur={formik.handleBlur}
            error={
              formik.touched.block_type ? formik.errors.block_type : undefined
            }
            className={selectClassname}
            placeholder="Seleccione un tipo"
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
